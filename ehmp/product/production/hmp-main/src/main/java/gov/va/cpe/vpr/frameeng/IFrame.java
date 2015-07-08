package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.frameeng.Frame.FrameException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.Frame.FrameReference;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.queryeng.ViewParam;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Set;


public interface IFrame {
	public String getID();
	public String getName();
	public URI getResource();
	public FrameStats getStats();
	public List<FrameReference> getReferences();
	public Map<String, Object> getAppInfo();
	public Map<String, Object> getMeta();
	public Set<ViewParam> getParamDefs();
	public Map<String, Object> getParamDefaultVals();
	public Map<String, Object> calcParams(FrameTask task);
	public IFrameTrigger<?> evalTriggers(IFrameEvent<?> event);
	
	// lifecycle methods
	public void validate(FrameTask task) throws FrameInitException;
	public void init(FrameTask task) throws FrameInitException;
	public void exec(FrameTask ctx) throws FrameException;
}
