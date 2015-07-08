package gov.va.cpe.vpr.frameeng;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class IFrameEvent<T> implements Serializable {
	private static final long serialVersionUID = 4146409780890124384L;
	
	protected Map<String, Object> params = new HashMap<String, Object>();
    protected transient T source;
    private Class<T> clazz;

	public IFrameEvent(T source) {
		this.source = source;
		this.clazz = (Class<T>) ((source!= null) ? source.getClass() : null);
	}
	
	public Class<T> getSourceClass() {
		return this.clazz;
	}
	
    public T getSource() {
        return source;
    }
    
	public Map<String, Object> getParams() {
		return params;
	}

    public String toString() {
        return getClass().getName() + "[source=" + source + "]";
    }

	/**
	 * Executes 0+ frames based on a named entryPoint and optionally an event Object class
	 * 
	 * The idea is to be able to create extention points for things like row actions/details.  
	 * 
	 * TODO: Should invoke event extend UserEvent?
	 * @author brian
	 */
	public static class InvokeEvent<T> extends RequestEvent<T> {
		private static final long serialVersionUID = 1L;
		private String entryPoint;
		private String frameID;

		public InvokeEvent(String entryPoint, T obj) {
			super(obj);
			this.entryPoint = entryPoint;
		}
		
		/* Not really in the 'spirit' of this event
		public InvokeEvent(String entryPoint, String frameID, T obj) {
			this(entryPoint, obj);
			this.frameID = frameID;
		}
		*/
		
		public InvokeEvent(String entryPoint, T obj, Map<String, Object> params) {
			super(obj);
			this.entryPoint = entryPoint;
			this.params.putAll(params);
		}

		public String getFrameID() {
			return frameID;
		}
		
		public String getEntryPoint() {
			return entryPoint;
		}
		
	    public String toString() {
	        return getClass().getName() + "[entryPoint=" + entryPoint + ", source=" + source + "]";
	    }
	}
	
	public static class SystemEvent<T> extends IFrameEvent<T> {
		private static final long serialVersionUID = 1L;
		
		public SystemEvent(T source) {
			super(source);
		}
	}
	
	public static class FrameInitEvent extends SystemEvent<IFrame> {
		private static final long serialVersionUID = 1L;

		public FrameInitEvent(IFrame source) {
			super(source);
		}
	}
	
	/**
	 * Superset of syncronous request/response type events. Currently
	 * the main two are InvokeEvent (invokes all matching frames) or CallEvent(calls one frame)
	 * 
	 * @author brian
	 * @param <T>
	 */
	public static class RequestEvent<T> extends IFrameEvent<T> {
		private static final long serialVersionUID = 1L;
		public RequestEvent(T source) {
			super(source);
		}
	}
	
	/**
	 * This could represent User interactions (like login, logout, select patient, etc)
	 * 
	 * @author brian
	 * @param <T>
	 */
	public static class UserEvent<T> extends IFrameEvent<T> {
		private static final long serialVersionUID = 1L;

		public UserEvent(T source) {
			super(source);
		}
	}

	/** 
	 * The idea here is that various frame outputs (actions) could be events as well, so an alert from one frame
	 * might trigger another frame...
	 * @author brian
	 */
	public static class FrameActionEvent extends SystemEvent<FrameAction> {
		private static final long serialVersionUID = -3486029638565166823L;

		public FrameActionEvent(FrameAction action) {
			super(action);
		}
	}
}

