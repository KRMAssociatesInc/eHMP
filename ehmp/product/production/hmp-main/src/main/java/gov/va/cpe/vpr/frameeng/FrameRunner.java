package gov.va.cpe.vpr.frameeng;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import gov.va.cpe.vpr.frameeng.Frame.FrameExecException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.FrameAction.DebugInfo;
import gov.va.cpe.vpr.frameeng.FrameAction.IFrameActionExec;
import gov.va.cpe.vpr.frameeng.FrameAction.IPatientSerializableAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.cpe.vpr.queryeng.RenderTask.RowRenderSubTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.web.context.request.RequestContextHolder;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import java.io.Closeable;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

public class FrameRunner extends SpringFrameContext implements IFrameRunner, Closeable {
	private static String QUEUE_NAME = "vpr.events";
	private static String JMSXGROUP_ID = "JMSXGroupID";
	private static String JMSXGROUP_SEQ = "JMSXGroupSeq";
	
	@Autowired
	protected JdsTemplate tpl;
	
	@Autowired
	protected JmsTemplate jms;
	
	private FrameActionRunner[] actionRunners;
	private FrameRegistry registry;
	
	// concurrency stuff
	private int timeoutMS = 10000;
	private ThreadFactory threadFactory = new ThreadFactory() {
		final AtomicInteger threadNumber = new AtomicInteger(1);
		
        public Thread newThread(Runnable runnable) {
            Thread thread = new Thread(runnable, "hmp-framerunner-" + threadNumber.getAndIncrement());
            thread.setDaemon(true);
            return thread;
        }
    };
    
    // TODO: Switch to spring-bean and maybe a ThreadPoolExecutor with a variable # of threads...
	private ExecutorService exec = Executors.newFixedThreadPool(5, threadFactory);
	
	@Autowired
	public FrameRunner(FrameRegistry registry, FrameActionRunner... actionRunners) {
		this.registry = registry;
		this.actionRunners = actionRunners;
		addResource(this);
	}
	
	@Override
	public void close() throws IOException {
		exec.shutdown();
	}
	
	// standard getters/setters  ----------------------------------------------
	public ExecutorService getExecutor() {
		return exec;
	}
	
	public void setExecutor(ExecutorService exec) {
		this.exec = exec;
	}
	
	public FrameRegistry getRegistry() {
		return registry;
	}
	
	public void setTimeoutMS(int timeoutMS) {
		this.timeoutMS = timeoutMS;
	}
	
	public int getTimeoutMS() {
		return timeoutMS;
	}
	
	@Override
    public void pushEvents(List<PatientEvent<IPatientObject>> events) {
		if (events == null || events.size() == 0) {
			return;
		}
		
		for (final PatientEvent<IPatientObject> evt : events) {
			pushEvent(evt);
		}		
	}
	
	@Override
    public void pushEvent(final PatientEvent<?> evt) {
		jms.send(QUEUE_NAME, new MessageCreator() {
			public Message createMessage(Session session) throws JMSException {
				Message msg = session.createObjectMessage(evt);
				IPatientObject obj = evt.getSource();
				msg.setStringProperty("uid", obj.getUid());
				msg.setStringProperty("pid", obj.getPid());
				msg.setStringProperty("type", evt.getType().toString());
				msg.setStringProperty("summary", obj.getSummary());
//				msg.setJMSCorrelationID(arg0)
//				msg.setJMSDeliveryMode(arg0)
//				msg.setJMSType(arg0)
				return msg;
			}
		});
		
	}
	
	/** Creates a new FrameJob and returns it, but does not execute it */
	public FrameJob createJob(IFrameEvent<?>... events) {
		return createJob(Arrays.asList(events));
	}
	
	/** Creates a new FrameJob and returns it, but does not execute it */
	public FrameJob createJob(List<IFrameEvent<?>> events) {
		FrameJob job = new FrameJob(this);
		for (IFrameEvent<?> event : events) {
			Map<IFrame, IFrameTrigger<?>> trigs = registry.getTriggeredFrames(event);
			for (Entry<IFrame, IFrameTrigger<?>> entry : trigs.entrySet()) {
				job.addSubTask(new FrameTask(job, entry.getKey(), event, entry.getValue()));
			}
		}
		return job;
	}
	
	/** Same as exec(Arrays.asList(Events)) */
	@Override
    public FrameJob exec(IFrameEvent<?>... events) throws FrameInitException, FrameExecException {
		return exec(Arrays.asList(events));
	}
	
	/**
	 * Primary way to create/execute an event list.
	 */
	@Override
    public FrameJob exec(List<IFrameEvent<?>> events) throws FrameInitException, FrameExecException {
		// get the frames to run
		FrameJob job = createJob(events);
		
		// kick off the job and wait till its done
		long timeoutAt = System.currentTimeMillis() + getTimeoutMS();
		job.exec();
		job.blockTillDone(timeoutAt);
		
		// process the actions from all the subtasks
		if (this.actionRunners != null && this.actionRunners.length > 0) {
			for (FrameTask task : job.getSubTasks()) {
				try {
					for (FrameAction action : task.getActions()) {
						for (FrameActionRunner runner : this.actionRunners) {
							runner.exec(job, action);
						}
					}
				} catch (Exception ex) {
					throw new FrameExecException(task.getFrame(), "Exception processing FrameAction", ex);
				}
			}
			/*
			for (FrameAction action : job.getActions()) {
				for (FrameActionRunner runner : this.actionRunners) {
					runner.exec(job, action);
				}
			}
			*/
		}
		
		return job;
	}
	
	/**
	 * Executes a single frame, regardless of if its in the registry or not (but must still have a CallTrigger defined).
	 * Useful for test cases and other direct invoke methods
	 */
	@Override
    public FrameTask exec(IFrame frame, Map<String, Object> params) throws FrameInitException, FrameExecException {
		long start = System.currentTimeMillis();
		long timeoutAt = start + getTimeoutMS();
		
    	// setup event/task to run
    	CallEvent<IFrame> evt = new CallEvent<IFrame>(frame.getID(), frame, params);
    	IFrameTrigger<?> trig = frame.evalTriggers(evt);
    	if (trig == null) return null; // no trigger was triggered
		FrameTask task = new FrameTask(this, frame, evt, trig);
		
		// configure task
		task.setParams(params);
		task.addResource(RequestContextHolder.getRequestAttributes());
		
		// execute task and wait till its done
		task.call(); // let the current thread do the inital work.
		task.blockTillDone(timeoutAt);
		return task;
	}
	
	/** Same as exec(Frame, null); */
	@Override
    public FrameTask exec(IFrame frame) throws FrameInitException, FrameExecException {
		return exec(frame, null);
	}
	
	@Override
    public FrameTask exec(String frameid, Map<String, Object> params) throws FrameInitException, FrameExecException {
		IFrame frame = getRegistry().findByID(frameid);
		if (frame != null) {
			return exec(frame, params);
		}
		return null;
	}
	
	/**
	 * Execute a specific frame (does not have to be in the registry) using the given event.
	 * 
	 * Returns NULL if the frame was not triggered.
	 * @throws FrameExecException 
	 * @throws FrameInitException 
	 */
	public FrameTask exec(IFrame frame, IFrameEvent<?> evt, Map<String, Object> params) throws FrameInitException, FrameExecException {
		long timeoutAt = System.currentTimeMillis() + getTimeoutMS();
		IFrameTrigger<?> trig = frame.evalTriggers(evt);
    	if (trig == null) return null; // no trigger was triggered
		FrameTask task = new FrameTask(this, frame, evt, trig);
		
		// configure task
		task.setParams(params);
		task.addResource(RequestContextHolder.getRequestAttributes());
		
		// execute task and wait till its done
		task.call(); // let the current thread do the inital work.
		task.blockTillDone(timeoutAt);
		return task;
	}
	
	/**
	 * Utility method to generate/extract/collect debugging information to be returned to the client if needed.
	 * 
	 * Crawls the job/task higherarchy and returns relevant info/actions for known types.  Also injects data from
	 * any {@link DebugInfo} actions that {@link Frame}s {@link ViewDef}s or {@link Query}s may have injected. 
	 * @param task The root job/task to display
	 * @return JSON data ready to be returned to the client
	 */
	public static ObjectNode renderDebugData(FrameJob task) {
		ObjectNode ret = POMUtils.MAPPER.createObjectNode();
		
		List<FrameAction> actions = task.getActions();
		List<FrameTask> subtasks = task.getSubTasks();
		ret.put("taskClass", task.getClass().toString());
		ret.put("execTimeMS", task.getExecTimeMS());
		ret.put("totalTimeMS", task.getTotalTimeMS());
		ret.put("runThreadName", task.getRunThreadName());
		ret.put("totalActionCount", actions.size());
		ret.put("subtaskCount", subtasks.size());
		
		// FrameTasks can give us a non-recursive action set and more detailed debug data
		if (task instanceof FrameTask) {
			FrameTask ft = (FrameTask) task;
			actions = ft.getActions(false);
			ret.put("event", ft.getTriggerEvent().toString());
			ret.put("frameID", ft.getFrame().getID());
			ret.put("trigger", ft.getFrameTrigger().toString());
			
			// display any DebugInfo actions (non-recursivley) 
			ArrayNode ary = POMUtils.MAPPER.createArrayNode();
			for (FrameAction act : actions) {
				if (act instanceof DebugInfo) {
					ary.add(POMUtils.convertObjectToNode(((DebugInfo) act).getData()));
				}
			}
			ret.put("debug", ary);
			
			// only display the actions for FrameTask decendants (so we don't double list them)
			ArrayNode ary2 = POMUtils.MAPPER.createArrayNode();
			for (FrameAction a : actions) {
				ary2.add(a.toString());
			}
			ret.put("actions", ary2);
		}
		
		// render tasks have extra ViewDef/query info to return
		if (task instanceof RenderTask) {
			Query q = ((RenderTask) task).getQuery();
			ret.put("pk", ((RenderTask) task).getPK());
			ret.put("query", q.toString());
			ret.put("queryStr", q.getQueryString());
			ret.put("rowcount", task.size());
			ret.put("viewDefID", ((RenderTask) task).getViewDef().getID());
		}
		
		// RowRenderSubTasks have additional row information to return
		if (task instanceof RowRenderSubTask) {
			ret.put("rowIdx", ((RowRenderSubTask) task).getRowIdx());
			ret.put("rowPK", ((RowRenderSubTask) task).getParentRowKey());
		}
		
		// recursivley render subtasks
		if (!subtasks.isEmpty()) {
			ArrayNode ary = POMUtils.MAPPER.createArrayNode();
			for (FrameTask subtask : subtasks) {
				ary.add(renderDebugData(subtask));
			}
			ret.put("subtasks", ary);
		}
		return ret;
	}
	
	public abstract static class FrameActionRunner {
		public abstract void exec(FrameJob job, FrameAction action) throws Exception;
	}
	
	public static class DefaultFrameActionRunner extends FrameActionRunner {
		@Override
		public void exec(FrameJob job, FrameAction action) throws Exception {
			if (action instanceof IFrameActionExec) {
				IFrameActionExec a = (IFrameActionExec) action;
				a.exec(job);
			}
		}
	}
	
	public static class JDSSaveActionRunner extends FrameActionRunner  {
		private JdsTemplate tpl;

		public JDSSaveActionRunner(JdsTemplate tpl) {
			this.tpl = tpl;
		}
		
		@Override
		public void exec(FrameJob job, FrameAction action) {
			if (action instanceof IPatientSerializableAction) {
				IPatientSerializableAction a = (IPatientSerializableAction) action;
				tpl.postForLocation("/vpr/" + a.getPid(), a);
			}
		}
	}
	
	public static class PatientObjectActionRunner extends FrameActionRunner  {
		private IGenericPatientObjectDAO dao;

		public PatientObjectActionRunner(IGenericPatientObjectDAO dao) {
			this.dao = dao;
		}
		
		@Override
		public void exec(FrameJob job, FrameAction action) {
			if (action instanceof IPatientObject) {
				dao.save((IPatientObject) action);
			}
		}
	}
	
	
	/**
	 * Idea: this could inject ClockEvents at set times?
	 * TODO: Maybe the spring scheduling mechanism can do this instead and inject into 
	 * an existing FrameRunner instead.
	 */
	public abstract static class ClockFrameRunner extends FrameRunner {
		public ClockFrameRunner(FrameRegistry registry) {
			super(registry);
		}
	}
}
