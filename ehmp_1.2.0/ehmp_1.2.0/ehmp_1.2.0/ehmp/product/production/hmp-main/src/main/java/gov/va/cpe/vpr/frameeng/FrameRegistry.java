package gov.va.cpe.vpr.frameeng;

import com.codahale.metrics.Metric;
import com.codahale.metrics.MetricSet;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.frameeng.AdapterFrame.DroolsFrameAdapter;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.FrameInitEvent;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.IViewDefDefDAO;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.drools.KnowledgeBase;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.*;


/**
 * A registry is a list of eligible frames
 * 
 * - Handles the event resolution of triggers
 * - Responsible for determining how many (0+) instances of each frame are active
 * - Responsible for creating/returning the frame instance to run for the given event (may reuse a single frame, delegate to trigger, etc).
 * - Attempts to handle circular frame reference dependencies.
 * 
 * TODO: Work on more metadata stuff, like inferring a list of attributes/categories
 * - find patient specific viewdefs by which ones declare PatientIDParam, etc.
 * - invokable viewdefs by trigger declaration
 * - ViewDefs by instance of ViewDef.class
 * - create some sort of findByType(xxx);
 * 
 * TODO: current type system does not allow you to have multiple types.
 * TODO: If you try to register multiple frames with the same ID, should throw an error.
 * @author brian
 */
public class FrameRegistry extends AbstractCollection<IFrame> implements ApplicationContextAware, MetricSet, IFrameRegistry {
	private static List<FrameRegistry> INSTANCES = new ArrayList<FrameRegistry>();
	private Map<IFrame, IFrameLoader> allFrames = Collections.synchronizedMap(new HashMap<IFrame, IFrameLoader>());
	private Map<String, IFrame> allFramesByID = new HashMap<String, IFrame>();
	private List<IFrameLoader> frameLoaders = new ArrayList<IFrameLoader>();
	private FrameContext frameContext;

	public FrameRegistry(IFrameLoader... loaders) {
		this.frameLoaders.addAll(Arrays.asList(loaders));
		INSTANCES.add(this);
	}
	
	/**
	 * This initialization mechanism is invoked by spring after all the other injection has finished....
	 * @throws Exception
	 */
	public void load() throws Exception {
		load(frameLoaders);
	}
	
	/**
	 * Run a specific frameLoader. Necessary to get the first boards into the FrameRegistry.
	 * FYI: Named it 'reloader' because the name 'reloadbyreloader' really sucked.
	 * @param loaderClass
	 */
	public static void reloader(Class<? extends IFrameLoader> loaderClass) {
		// loop though all instances
		synchronized(INSTANCES) {
			for (FrameRegistry reg : INSTANCES) {
				Set<IFrameLoader> loaders = new HashSet<IFrameLoader>();
				for(IFrameLoader loader: reg.frameLoaders) {
					if(loader.getClass()==loaderClass) {
						loaders.add(loader);
					}
				}
				reg.load(loaders);
			}
		}
	}
	
	/**
	 * Used by JRebel plugin to dynamically refresh all necessary FrameRegistries 
	 * when a frame class is modified at run-time.
	 */
	public static void reload(Class<? extends IFrame> frameClass) {
		// loop though all instances
		for (FrameRegistry reg : INSTANCES) {
			// Loop though all the frames that match and find the set of loaders to refresh
			List<IFrame> frames = reg.findAllByClass(frameClass);
			Set<IFrameLoader> loaders = new HashSet<IFrameLoader>();
			for (IFrame frame : frames) {
				// find which loader loaded the frame
				loaders.add(reg.allFrames.get(frame));
			}
			
			// unload/reload the found frame loaders
			reg.load(loaders);
		}
	}
	
	/**
	 * Removes all the frames from the specified loader
	 */
	private void unload(IFrameLoader loader) {
		// first remove any frames currently registered under this frameloader
		List<IFrame> removeList = new ArrayList<IFrame>();
		for (IFrame frame : allFrames.keySet()) {
			if (allFrames.get(frame) == loader) {
				removeList.add(frame);
			}
		}
		for (IFrame frame : removeList) {
			String id = frame.getID();
			this.allFrames.remove(frame);
			this.allFramesByID.remove(id);
			// TODO: Shutdown event?
		}
	}
	
	/**
	 * Due to a potential race condition, take care to load/register everything first
	 * before initializing each frame, that way they can all see each other during initialization
	 * and any frame dependencies can be resolved.
	 * 
	 * @param loaders
	 */
	private void load(Collection<IFrameLoader> loaders) {
		FrameJob initjob = new FrameJob(frameContext);
		
		for (IFrameLoader loader : loaders) {
			// clear any existing frames first...
			if (this.frameLoaders.contains(loader)) {
				unload(loader);
			}
		
			// then register the frames
			for (IFrame frame : loader.load()) {
				String id = frame.getID();
				this.allFrames.put(frame, loader);
				if (this.allFramesByID.containsKey(id)) {
					// TODO: Throw error
				}
				this.allFramesByID.put(id, frame);
				
				FrameInitEvent evt = new FrameInitEvent(frame);
				initjob.addSubTask(new FrameTask(initjob, frame, evt, null));
			}
		}
		
		// now run all the frame initializers
		try {
			for (FrameTask task : initjob.getSubTasks()) {
				task.getFrame().init(task);
			}
		} catch (FrameInitException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.frameContext = new SpringFrameContext();
		((SpringFrameContext) this.frameContext).setApplicationContext(applicationContext);
	}
	
	/** to setup the parent context used to initialize frames, useful for test suites mainly */
	public void setFrameContext(FrameContext ctx) {
		this.frameContext = ctx;
	}

	public List<IFrameLoader> getFrameLoaders() {
		return this.frameLoaders;
	}
	
	public boolean isEmpty() {
		return allFrames.isEmpty();
	}
	
	@Override
	public Map<String, Metric> getMetrics() {
		Map<String, Metric> ret = new HashMap<String, Metric>();
		Iterator<IFrame> itr = iterator();
		while (itr.hasNext()) {
			IFrame frame = itr.next();
			ret.put(frame.getID(), frame.getStats());
		}
		return ret;
	}

	public int size() {
		return allFrames.size();
	}
	
	public Iterator<IFrame> iterator() {
		return this.allFrames.keySet().iterator();
	}
	
	@Override
    public IFrame findByID(String id) {
		return allFramesByID.get(id);
	}
	
	@Override
    public List<IFrame> findAllByClass(Class<? extends IFrame> clazz) {
		List<IFrame> ret = new ArrayList<IFrame>();
		for (IFrame f : this) {
			if (clazz.isAssignableFrom(f.getClass())) {
				ret.add(f);
			}
		}
		return ret;
	}
	
	public Map<IFrame, IFrameTrigger<?>> getTriggeredFrames(IFrameEvent<?> event) {
		Map<IFrame, IFrameTrigger<?>> ret = new HashMap<IFrame, IFrameTrigger<?>>();
		
		// TODO:this may eventually become a bottleneck.
		synchronized(allFrames) {
			for (IFrame frame : allFrames.keySet()) {
				IFrameTrigger<?> trig = frame.evalTriggers(event);
				if (trig != null) {
					ret.put(frame, trig);
				}
			}
		}
		
		return ret;
	}
	
	public static interface IFrameLoader {
		public List<IFrame> load();
		public void add(IFrame frame);
	}
	
	public abstract static class AbstractFrameLoader implements IFrameLoader {
		public void add(IFrame frame) {
			throw new UnsupportedOperationException();
		}
	}
	
	public static class StaticFrameLoader extends AbstractFrameLoader {
		private List<IFrame> frames = new ArrayList<>();

		public StaticFrameLoader(IFrame... frames) {
			this(Arrays.asList(frames));
		}
		
		public StaticFrameLoader(List<IFrame> frames) {
			this.frames.addAll(frames);
		}
		
		@Override
		public void add(IFrame frame) {
			this.frames.add(frame);
		}

		@Override
		public List<IFrame> load() {
			return this.frames;
		}
	}
	
	public static class SpringFrameLoader extends AbstractFrameLoader implements ApplicationContextAware {
		private ApplicationContext ctx;

		@Override
		public List<IFrame> load() {
			Map<String, IFrame> map = this.ctx.getBeansOfType(IFrame.class);
			return new ArrayList<IFrame>(map.values());
		}

		@Override
		public void setApplicationContext(ApplicationContext ctx) throws BeansException {
			this.ctx = ctx;
		}
		
	}
	
	public static class ViewDefDefFrameLoader extends AbstractFrameLoader {
		ArrayList<IFrame> myList = null;
		Map<String, Object> myMap = null;
		/*
		 * Are these autowirings creating too much overhead?
		 * If so, it involves a fairly moderate refactor down into the RosterPatientQuery that is found in the PPVD.
		 */
		
		@Autowired
		IViewDefDefDAO vddDAO;
		
		@Override
		public synchronized List<IFrame> load() {
			if(myList == null) {
				List<ViewDef> vds = new ArrayList<ViewDef>();
				myMap = new HashMap<String, Object>();
				List<ViewDefDef> defs = vddDAO.findAll();
				for(ViewDefDef vdd: defs) {
					try {
						ViewDef vd = vdd.buildViewDef();
						vds.add(vd);
						myMap.put(vdd.getUid(), vd);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				myList = new ArrayList<IFrame>(vds);
			}
			return myList;
		}
		
		public void update(ViewDefDef obj) {
			synchronized(myList) {
				try {
					ViewDef vd = obj.buildViewDef();
					if(myMap.containsKey(obj.getUid())) {
						Object o = myMap.get(obj.getUid());
						if(o != null && myList.contains(o)) {
							myList.set(myList.indexOf(o), vd);
						} else {
							myList.add(vd);
						}
					} else {
						myList.add(vd);
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				FrameRegistry.reloader(FrameRegistry.ViewDefDefFrameLoader.class);
			}
		}

		public void remove(ViewDefDef obj) {
			if(myMap.containsKey(obj.getUid())) {
				Object o = myMap.get(obj.getUid());
				if(o != null && myList.contains(o)) {
					myList.remove(o);
					FrameRegistry.reloader(FrameRegistry.ViewDefDefFrameLoader.class);
				}
			}
		}
		
	}
	
	public static class ProtocolFileFrameLoader extends AbstractFrameLoader {
		private File dir;

		public ProtocolFileFrameLoader(File dir) {
			this.dir = dir;
		}
		
		@Override
		public List<IFrame> load() {
			List<IFrame> ret = new ArrayList<IFrame>();
			File[] files = this.dir.listFiles(new FilenameFilter() {
				@Override
				public boolean accept(File dir, String name) {
					return name.endsWith(".json");
				}
			});
			for (File file : files) {
				try (FileInputStream fis = new FileInputStream(file)) {
					ret.add(new IncubatorFrame.ProtocolFrame(file.toURI(), POMUtils.parseJSONtoNode(fis)));
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
			return ret;
		}
	}
	
	
	public static class DroolsFrameLoader extends AbstractFrameLoader {
		private KnowledgeBase kb;
		
		public DroolsFrameLoader(KnowledgeBase kb) {
			this.kb = kb;
		}
		
		@Override
		public List<IFrame> load() {
			ArrayList<IFrame> ret = new ArrayList<IFrame>();
			ret.add(new DroolsFrameAdapter(kb));
			return ret;
		}
	}
	
	public static class RemindersFrameLoader extends AbstractFrameLoader {
		private RpcTemplate tpl;
		
		public RemindersFrameLoader(RpcTemplate tpl) {
			this.tpl = tpl;
		}
		
		@Override
		public List<IFrame> load() {
			Map<String, Object> params = new HashMap<String, Object>();
            params.put("command", "getReminderList");
            params.put("user", "");
            params.put("location", "");
            
//            RpcRequest req = new RpcRequest();
//            tpl.execute(req);
            
            String req = "vrpcb://500:vpruser1;verifycode1&@localhost:29060" + UserInterfaceRpcConstants.CONTROLLER_RPC_URI;
            Map resp = tpl.executeForObject(Map.class, req, params);
            List reminders = (List) resp.get("reminders");
            
            List<IFrame> ret = new ArrayList<IFrame>();
			for (Object obj : reminders) {
				Map map = (Map) obj;
				String name = (String) map.get("name");
				String uid = (String) map.get("uid");
				ret.add(new AdapterFrame.ReminderFrame(name, uid));
			}
			System.out.println("REMINDER FRAMES");
			System.out.println(ret);
			return ret;
		}
	}
	
}
