package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.HMPApp;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.queryeng.HMPAppInfo;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URL;
import java.util.*;

/**
 * @since 8/27/2012
 */
public abstract class Frame implements IFrame, HMPApp {
	
	public static class FrameReference {
		public String authors;
		public String title;
		public String source;
		public String pmid;
		public URL href;
		
		@Override
		public String toString() {
			return authors + ". " + title + ". " + source + ".";
		}
	}
	
	public abstract static class FrameException extends Exception {
		private static final long serialVersionUID = 6544178374820985407L;
		protected IFrame frame;
		public FrameException(IFrame f, String msg, Throwable cause) {
			super(msg, cause, true, false);
			this.frame = f;
		}
		
		public IFrame getFrame() {
			return frame;
		}
	}
	
	public static class FrameInitException extends FrameException {
		private static final long serialVersionUID = 8880375377058998751L;

		public FrameInitException(IFrame f, String msg) {
			super(f, msg, null);
		}
		
		public FrameInitException(IFrame f, Throwable cause) {
			super(f, "Error while initalizing frame: " + f.getID() + ": " + cause.getMessage(), cause);
		}
	}
	
	public static class FrameExecException extends FrameException {
		private static final long serialVersionUID = 6843959708057792831L;

		public FrameExecException(IFrame f, String msg) {
			super(f, msg, null);
		}
		
		public FrameExecException(IFrame f, String msg, Throwable cause) {
			super(f, msg, cause);
		}
		
		public FrameExecException(IFrame f, Throwable cause) {
			super(f, "Error executing frame: " + f.getID() + ": " + cause.getMessage(), cause);
		}
	}
	
	private String id;
	private String name;
	private String type;
	private URI resource;
	private FrameStats stats = new FrameStats();
	private Map<String, Object> meta = new HashMap<String, Object>();
	private List<IFrameTrigger<?>> triggers = new ArrayList<IFrameTrigger<?>>();
	private Set<ViewParam> params = new LinkedHashSet<ViewParam>();
	private List<FrameReference> refs = new ArrayList<FrameReference>();
	private Map<String, Object> appinfo;
	protected boolean initalized = false;
	
	// Initialization/Validation -----------------------------------------------
	
	public Frame() {
	}
	
	/**
	 * Idea here is to be sort of a secondary constructor, capabilities include:
	 * 1) let frames initialize resources into member variables (dao's, templates, etc.)
	 * 2) let frames be 'reinialized' at some point if necessary?
	 * 3) let frames declare additional triggers dynamically (based on user parameter values, etc.)
	 * 4) let bridge frames do additional stuff they may need to (open connections, load metadata, etc.)
	 *  
	 * TODO: should this be an event instead of a task/job?
	 * TODO: How to ensure persisted configuration variables are initialized/load into task params?
	 * TODO: In general, should adding params/triggers/queries be done in a 'protected abstract void init()'?
	 * -- easier to reload, could be invoked from constructor
	 * -- must migrate existing constructor stuff into init(), but stuff in constructor should still work.
	 * -- constructors with arguments should probably remain the way they are.
	 * -- main issue: how to pass a FrameTask, event, context ext into the init() method?
	 * Frame registry should be responsible for ensuring this is called.
	 * @param task
	 */
	public final void init(FrameTask task) throws FrameInitException {
		try {
			if (!isInitalized()) {
				doInit(task);
			}
		} catch (Exception ex) {
			throw new FrameInitException(this, ex);
		}
		this.initalized = true;
	}
	
	protected boolean isInitalized() {
		return this.initalized;
	}
	
	/**
	 * TODO: Need to think about this some more. There almost needs to be a separate paramValidation()
	 * mechanism but maybe as part of a trigger instead?  The use case here is that when a PID is missing
	 * some frames should not run, but shouldn't throw an error either (unless they were called specifically)
	 * 
	 * ALso, should the FrameRegistry call this as part of createJob()? Or should FrameTask.exec() call it?
	 */
	@Override
	public void validate(FrameTask task) throws FrameInitException {
		if (!isInitalized()) {
			throw new FrameInitException(this, "Frame was not initalized");
		}
		try {
			for (ViewParam param : params) {
//				if (!param.validate(task)) {
//					throw new IllegalStateException("ViewParam is not valid: " + param);
//				}
			}
		} catch (Exception ex) {
			throw new FrameInitException(this, ex);
		}
	}
	
	protected void doInit(FrameJob task) throws Exception {
		// does nothing by default...
	}
	
	// Public getters (IFrame Interface) --------------------------------------
	
	public List<IFrameTrigger<?>> getTriggers() {
		return this.triggers;
	}
	
	public String getID() {
		return (String) getAppInfo().get("id");
	}
	
	public String getName() {
		return (String) getAppInfo().get("name");
	}
	
	public List<FrameReference> getReferences() {
		return refs;
	}
	
	public FrameStats getStats() {
		return this.stats;
	}
	
	public URI getResource() {
		return this.resource;
	}
	
	public Map<String, Object> getMeta() {
		return this.meta;
	}
	
	public Set<ViewParam> getParamDefs() {
		return params;
	}
	
	public Set<ViewParam> getParamDefs(Class<?> clazz) {
		Set<ViewParam> ret = new LinkedHashSet<ViewParam>();
		for (ViewParam p : getParamDefs()) {
			if (clazz.isAssignableFrom(p.getClass())) {
				ret.add(p);
			}
		}
		return ret;
	}
	
	public Map<String, Object> getParamDefaultVals() {
		Map<String, Object> ret = new HashMap<String, Object>();
		// default params initialization
		for(ViewParam p : getParamDefs()) {
			Map<String, Object> vals = p.getDefaultValues();
			if (vals != null) {
				ret.putAll(vals);
			}
		}
		return ret;
	}
	
    public Map<String, Object> calcParams(FrameTask task) {
    	Map<String, Object> ret = getParamDefaultVals();
        for (ViewParam p : getParamDefs()) {
        	Map<String, Object> params = p.calcParams(task);
        	if (params != null) {
        		ret.putAll(params);
        	}
        }
        return ret;
    }
	
	@Override
	public Map<String, Object> getAppInfo() {
		if (appinfo == null) {
			Map<String, Object> viewInfo = getParamDefaultVals();
			HashMap<String, Object> ret = new HashMap<String, Object>();
			
			// get the annotation, use it to fill in any values not declared in the param
			HMPAppInfo annotation = getClass().getAnnotation(HMPAppInfo.class);
			Component annotation2 = getClass().getAnnotation(Component.class);
			
			// get the name from: 1) declared name, 2) ViewInfoParam, 3) annotation, 4) class name
			String name = this.name;
			if (name == null) {
				name = (String) viewInfo.get("view.name");
			}
			if (name == null && annotation != null) {
				name = annotation.title();
			}
			if (name == null) {
				name = getClass().getName();
			}
			
			// get the ID from: 1) declared ID, 2) @Component annotation, 3) class name
			String id = this.id;
			if (id == null && annotation2 != null) {
				id = annotation2.value();
			}
			if (id == null) {
				id = getClass().getName();
			}
			
			// TODO: this probably needs to be delegated to the subclasses
			String type = "gov.va.cpe.frame";
			if (this.type != null) {
				type = this.type;
			} else if (annotation != null) {
				type = annotation.value();
			}
			
			// return the results
			ret.put("type", type);
			ret.put("name", name);
			ret.put("id", id);
			ret.put("code", ret.get("id"));
			ret.put("resource", this.resource);
			appinfo = ret;
		}
		
		return appinfo;
	}

	
	// protected setters ------------------------------------------------------
	
	protected <T extends IFrameTrigger<?>> T addTrigger(T trig) {
		if (isInitalized()) {
			throw new IllegalStateException("Cannot add triggers after a frames been initalized.");
		}
		this.triggers.add(trig);
		return trig;
	}
	
	protected void setID(String id) {
		this.id = id;
	}
	
	protected void setName(String name) {
		this.name = name;
	}
	
	protected void setType(String type) {
		this.type = type;
	}
	
	protected void setResource(URI resource) {
		this.resource = resource;
	}
	
	protected void addMeta(String key, Object val) {
		this.meta.put(key, val);
	}
	
	protected void addMeta(Map<String, Object> data) {
		this.meta.putAll(data);
	}
	
	protected void addReference(FrameReference ref) {
		this.refs.add(ref);
	}
	
	protected void declareParam(ViewParam param) {
		// look for duplicate (equals) params and replace the existing one with the new one.
		// I kind of thought this should be handled automatically given the equals() implementation, alas, it does not.
		for (ViewParam p : params) {
			if (p.equals(param)) {
				params.remove(p);
				params.add(param);
				return;
			}
		}
		
		// no equal ViewParam exists yet, add it.
		params.add(param);
	}
	
	protected void declareParam(String key, Object defaultVal) {
		declareParam(new ViewParam.SimpleViewParam(key, defaultVal));
	}
	
	// Execution/evaluation  --------------------------------------------------
	public IFrameTrigger<?> evalTriggers(IFrameEvent<?> event) {
		for (IFrameTrigger<?> trig : getTriggers()) {
			if (trig.eval(event)) {
				return trig;
			}
		}
		return null;
	}
	
	public abstract void exec(FrameTask task) throws FrameException;
	
	
	/**
	 * FrameParams could be:
	 * 1) system default: default lab value range, etc.
	 * 2) instance specific: AbnormalLabFrame could be instantiated multiple times and the abnormal range could be part of that instantiation
	 * 3) patient specific: persisted somewhere per-patient.
	 * 4) event/context data: passed in from URL or event payload
	 * TODO: params derived dynamically from context? PID from PatientEvent or CallEvent.getData().get('pid'), etc.
	 * TODO: Patient Population-specific values? 
	 */
	public abstract static class FrameParam extends ViewParam {
		
		/** adds the a userContext key and a currentUser key (if authenticated) */
		public static class UserContextParam extends FrameParam {
			
		    @Override
		    public Map<String, Object> calcParams(FrameTask task) {
		    	UserContext ctx = task.getResource(UserContext.class);
		    	Map<String, Object> ret = super.calcParams(task);
		    	ret.put("userContext", ctx);
		    	ret.put("currentUser", ctx.getCurrentUser());
		    	return ret;
		    }

			@Override
			public Map<String, Object> getDefaultValues() {
				return null;
			}
			
		}
		
		public abstract static class PatientObjectParam extends FrameParam {
			/**
			 * TODO: Idea: instead of the common CallTrigger + PatientOBjectTrigger combo,
			 * what if this runtime parameter attempted to derive the triggering object dynamically
			 * from the successful trigger?  IF its a PatientObjectTrigger, then return trig.getSource()
			 * if its a CallEvent where event.getData().containsKey("pid") then use the generic
			 * DAO to fetch the value.
			 */
		}
	}
}
