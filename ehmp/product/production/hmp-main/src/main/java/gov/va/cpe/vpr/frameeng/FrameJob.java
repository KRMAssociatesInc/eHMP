package gov.va.cpe.vpr.frameeng;

import com.codahale.metrics.Timer;
import gov.va.cpe.vpr.frameeng.Frame.FrameExecException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.hmp.metrics.MetricRegistryHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.*;

/**
 * TODO: Re-document this
 */
public class FrameJob extends FrameContext implements Callable<FrameJob> {
	
	// runtime/status info
	protected String runThreadName = null;
	protected long execTimeMS = 0;
	private Future<FrameJob> taskFuture;
	private List<FrameTask> subtasks = new ArrayList<FrameTask>();
	private boolean async = true;

	public FrameJob(FrameContext parent) {
		super(parent);
	}
	
	public FrameJob() {
		this(null);
	}
	
	// add/get tasks/context  -------------------------------------------------
	
	public FrameJob setAsync(boolean async) {
		this.async = async;
		return this;
	}
	
	/** Add multiple sub-tasks, one for each triggered frame */
	public void addSubTasks(IFrameEvent<?> evt) {
		FrameRegistry reg = getResource(FrameRegistry.class);
		for (Entry<IFrame, IFrameTrigger<?>> entry : reg.getTriggeredFrames(evt).entrySet()) {
			addSubTask(new FrameTask(this, entry.getKey(), evt, entry.getValue()));
		}
	}
	
	public <T extends FrameTask> T addSubTask(T task) {
		this.subtasks.add(task);
		return task;
	}
	
	public List<FrameTask> getSubTasks() {
		return this.subtasks;
	}

	public int size() {
		return this.subtasks.size();
	}
	
	public long getExecTimeMS() {
		return this.execTimeMS;
	}
	
	public long getTotalTimeMS() {
		long ret = this.execTimeMS;
		for (FrameTask task : getSubTasks()) {
			ret += task.getTotalTimeMS();
		}
		return ret;
	}
	
	public String getRunThreadName() {
		return this.runThreadName;
	}
	
	// job aggregate results --------------------------------------------------
	
	public List<IFrame> getFrames() {
		List<IFrame> ret = new ArrayList<IFrame>();
		for (FrameTask task : getSubTasks()) {
			ret.add(task.getFrame());
		}
		return ret;
	}
	
	public List<FrameAction> getActions() {
		List<FrameAction> actions = new ArrayList<FrameAction>();
		for (FrameTask task : getSubTasks()) {
			actions.addAll(task.getActions());
		}
		return actions;
	}
	
	@SuppressWarnings("unchecked")
	public <T extends FrameAction> T getAction(Class<T> clazz) {
		for (FrameAction action : getActions()) {
			if (clazz.isInstance(action)) {
//			if (action.getClass().isAssignableFrom(clazz)) {
				return (T) action;
			}
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	public <T extends FrameAction> List<T> getActions(Class<T> clazz) {
		List<T> ret = new ArrayList<T>();
		for (FrameAction action : getActions()) {
			if (clazz.isInstance(action)) {
//			if (action.getClass().isAssignableFrom(clazz)) {
				ret.add((T) action);
			}
		}
		return ret;
	}
	
	// execute ----------------------------------------------------------------
	
	public synchronized void exec() throws FrameInitException, FrameExecException {
		// try to get an executor from the frame runner
		ExecutorService exec = (this.async) ? getResource(FrameRunner.class).getExecutor() : null;
		if (exec == null) {
			this.call();
		} else {
			taskFuture = exec.submit(this);
		}
	}
	
	public synchronized void blockTillDone(long timeoutAt) throws FrameExecException {
		if (taskFuture != null) {
				try {
					taskFuture.get(Math.max(timeoutAt - System.currentTimeMillis(), 1), TimeUnit.MILLISECONDS);
				} catch (Exception ex) {
					if (ex instanceof ExecutionException && ex.getCause() instanceof FrameExecException) {
						throw (FrameExecException) ex.getCause();
					} else if (this instanceof FrameTask) {
						throw new FrameExecException(((FrameTask) this).getFrame(), ex);
					}
					throw new FrameExecException(null, ex);
				}
		}
		for (FrameTask subtask : getSubTasks()) {
			subtask.blockTillDone(timeoutAt);
		}
	}

	@Override
	public FrameJob call() throws FrameInitException, FrameExecException {
		this.runThreadName = Thread.currentThread().getName();
//		throw new UnsupportedOperationException("FrameJob should be executed from FrameRunner");
        Timer.Context watch = MetricRegistryHolder.getMetricRegistry().timer("frame.job").time();
		
		// run all the subtasks (we do not run frames part of the same job in parallel)
		for (FrameTask task : getSubTasks()) {
			task.exec();
		}
		watch.stop();
		
		// invoke callbacks (if any)
		for (IFrameProgressMonitor mon : getProgressMonitors()) {
			mon.onFrameJobComplete(this);
		}
		
		return this;
	}
	
	@Override
	public String toString() {
		return super.toString() + ": runtime=" + this.execTimeMS + "ms; elapsed=" + getTotalTimeMS() + "ms; runThreadName=" + runThreadName + "; subtasks=" + subtasks.size();
	}
	
	// subclasses -------------------------------------------------------------
	public static class FrameTask extends FrameJob {
		private IFrame frame;
		private IFrameEvent<?> event;
		private IFrameTrigger<?> trig;
		private List<FrameAction> actions = new ArrayList<FrameAction>();

		/**
		 * Protected constructor w/o event or trigger info, mostly for testing and extending
		 */
		protected FrameTask(IFrame frame) {
			super();
			this.frame = frame;
		}
		
		protected FrameTask(FrameContext parent, IFrame frame) {
			super(parent);
			this.frame = frame;
		}

		public FrameTask(FrameContext parent, IFrame frame, IFrameEvent<?> event, IFrameTrigger<?> trig) {
			super(parent);
			this.frame = frame;
			this.event = event;
			this.trig = trig;
		}
		
		public IFrameTrigger<?> getFrameTrigger() {
			return trig;
		}
		
		public IFrame getFrame() {
			return this.frame;
		}
		
		public IFrameEvent<?> getTriggerEvent() {
			return event;
		}
		
		public <T extends FrameAction> T addAction(T action) {
			this.actions.add(action);
			// invoke callbacks (if any)
			for (IFrameProgressMonitor mon : getProgressMonitors()) {
				mon.onAddAction(this, action);
			}
			return action;
		}
		
		public List<FrameAction> getActions() {
			return getActions(true);
		}
		
		
		public List<FrameAction> getActions(boolean recursive) {
			if (!recursive) return this.actions; // shortcut if no recusion necessary
			
			List<FrameAction> ret = super.getActions();
			ret.addAll(this.actions);
			return ret;
		}
		
		public Map<String, Object> getParams() {
	    	Map<String, Object> ret = super.getParams();
	    	if (event != null) {
	    		ret.putAll(event.getParams());
	    	}
	        return ret;
	    }	
		
		@Override
		public String toString() {
			return super.toString() + "; FrameID=" + getFrame().getID() + "; Actions=" + actions.size();
		}
		
		@Override
		public FrameTask call() throws FrameInitException, FrameExecException {
			this.runThreadName = Thread.currentThread().getName();

			// initalize/validate the frame
    		setParams(getFrame().calcParams(this));
			getFrame().validate(this);
			
			FrameStats stats = getFrame().getStats();
			Timer.Context watch = stats.time(); 
			try {
				// run the frame
				getFrame().exec(this);
			} catch (Exception ex) {
				stats.error(ex);
				throw new FrameExecException(getFrame(), ex);
			} finally {
				this.execTimeMS = TimeUnit.NANOSECONDS.toMillis(watch.stop());
			}
			
			// run any subtasks
			for (FrameTask task : getSubTasks()) {
				task.exec();
			}
			
			// invoke callbacks (if any)
			for (IFrameProgressMonitor mon : getProgressMonitors()) {
				mon.onFrameTaskComplete(this);
			}
			
			return this;
		}
	}
	
}
