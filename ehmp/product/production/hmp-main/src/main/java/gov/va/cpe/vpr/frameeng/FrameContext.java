package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;

import java.util.*;

public abstract class FrameContext {
    private FrameContext parent = null;
    private Map<String, Object> params = null; // lazy init;
    private Map<Object, String> resources = null; // lazy init
	private List<IFrameProgressMonitor> monitors = null; // lazy init

    protected FrameContext() {
    }

    protected FrameContext(FrameContext parent) {
        this.parent = parent;
    }

    /** Returns the parent frame execution context, or null if none */
    public FrameContext getParentContext() {
        return this.parent;
    }
    
    // event listeners/callback registration ----------------------------------
    
    public void addProgressMonitor(IFrameProgressMonitor monitor) {
    	if (this.monitors == null) this.monitors = new ArrayList<IFrameProgressMonitor>();
    	this.monitors.add(monitor);
    }
    
    /**
     * @return Walks the hierarchy of FrameContexts to returns a list of registered progress monitors.  Should not return null, but may return an empty list. 
     */
    public List<IFrameProgressMonitor> getProgressMonitors() {
    	if (this.monitors == null && getParentContext() != null) {
    		return getParentContext().getProgressMonitors();
    	} else if (this.monitors == null) {
    		// nothing to return
    		return Collections.emptyList();
    	} else {
    		List<IFrameProgressMonitor> ret = new ArrayList<IFrameProgressMonitor>(this.monitors);
    		if (getParentContext() != null) ret.addAll(getParentContext().getProgressMonitors());
    		return ret;
    	}
    }

    // add/get resources ------------------------------------------------------

    public void addResource(String name, Object obj) {
        if (this.resources == null) this.resources = new HashMap<Object, String>();
        this.resources.put(obj, name);
    }

    public void addResource(Object obj) {
        addResource(null, obj);
    }

    public <T> T getResource(Class<T> clazz, String name) {
        // first look in local resource map (if any)
        if (this.resources != null) {
            for (Object obj : this.resources.keySet()) {
                String objname = this.resources.get(obj);
                if (objname == null || name == null || objname.equals(name)) {
                    if (clazz.isInstance(obj)) {
                        return (T) obj;
                    }
                }
            }
        }

        // not found, look in parent context (if any)
        T ret = null;
        if (this.parent != null) {
            ret = this.parent.getResource(clazz, name);
        }

        // not found, throw error
        if (ret == null) {
            throw new RuntimeException("No resource of type " + clazz.getName() + " with name " + name + " found in Frame Context");
        }
        return ret;
    }

    public <T> T getResource(Class<T> clazz) {
        return getResource(clazz, null);
    }

    // set/calculate params ---------------------------------------------------

    public void setParam(String key, Object val) {
        if (params == null) params = new HashMap<String, Object>();
        params.put(key, val);
    }

    public void setParam(String key, int val) {
        setParam(key, "" + val);
    }

    public void setParams(Map<String, Object> params) {
        setParams("", params);
    }

    public void setParams(String prefix, Map<String, Object> params) {
        if (params == null || params.isEmpty()) return;
        for (String key : params.keySet()) {
            Object val = params.get(key);
            if (val == null) {
                continue;
            }

            // if the value is a map, traverse it as well and use a dot notation
            // this is how grails params work
            if (val instanceof Map) {
                setParams(prefix + key + ".", (Map<String, Object>) val);
            }

            setParam(prefix + key, val);
        }
    }

    // get params -------------------------------------------------------------

    public Map<String, Object> getParams() {
        Map<String, Object> ret = new HashMap<String, Object>();
        if (parent != null) {
            ret.putAll(parent.getParams());
        }
        if (params != null) ret.putAll(params);
        return ret;
    }

    @SuppressWarnings("unchecked")
    public <T> T getParam(Class<T> clazz, String key) {
        Object ret = getParamObj(key);
        if (ret == null) {
            return null;
        } else if (clazz.isInstance(ret)) {
            return (T) ret;
        } else if (clazz.equals(String.class)) {
            return (T) getParamStr(key);
        } else if (clazz.equals(Integer.class)) {
            return (T) (Integer) getParamInt(key);
        } else if (clazz.equals(Boolean.class)) {
            return (T) Boolean.valueOf(Boolean.parseBoolean(getParamStr(key)));
        } else {
            // TODO: Plug in spring conversion?
            throw new IllegalArgumentException("Unrecognized return type: " + clazz);
        }
    }

    public Object getParamObj(String key) {
        Map<String, Object> params = getParams();
        if (params.containsKey(key)) {
            // first look for the param in our own context
            return params.get(key);
        } else if (parent != null) {
            // they look for it in the parent context
            return parent.getParamObj(key);
        } else {
            // not found, return null
            return null;
        }
    }

    public String getParamStr(String key) {
        Object val = getParamObj(key);
        if (val != null) {
            return val.toString();
        }
        return null;
    }

    public int getParamInt(String key) {
        Object val = getParamObj(key);
        if (val == null) {
            // null returns -1
            return -1;
        }

        // if its a int already, just return it.
        if (val instanceof Integer) {
            return ((Integer) val).intValue();
        }

        // otherwise try parsing the string.
        try {
            int ret = Integer.parseInt(val.toString());
            return ret;
        } catch (NumberFormatException ex) {
            // otherwise return -1
            return -1;
        }
    }

    public boolean getParamBool(String key) {
        Object val = getParamObj(key);
        if (val == null) {
            // null returns false
            return false;
        }

        // if its a int already, just return it.
        if (val instanceof Boolean) {
            return ((Boolean) val).booleanValue();
        }

        // otherwise try parsing the string.
        boolean ret = Boolean.parseBoolean(val.toString());
        return ret;
    }
    
	/**
	 * Provides callbacks during various stages of a frame running. Can be registered in any FrameContext,
	 * so FrameRunner can have one that applies to all Frames/Jobs.  Or individual FrameJobs/FrameTasks can 
	 * register monitors as well.
	 * 
	 * Usefull for things like logging injections, stats/metrics collections and for live-streaming results.
	 * 
	 * Care should be taken to not take too long to return which could disrupt the frame processing cycles.
	 * 
	 * TODO: Add some extra callbacks/hooks like onTaskStart()/onJobStart(), etc?
	 * TODO: Maybe add error handling methods too? Although error handling might need to be different/seperate.
	 * @author brian
	 */
	public interface IFrameProgressMonitor {
		public void onAddAction(FrameContext ctx, FrameAction action);
		public void onFrameTaskComplete(FrameTask task);
		public void onFrameJobComplete(FrameJob job);
	}
}
