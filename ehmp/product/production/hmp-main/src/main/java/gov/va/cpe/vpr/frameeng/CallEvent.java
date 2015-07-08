package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.frameeng.IFrameEvent.RequestEvent;

import java.util.Map;

/**
 * The current thinking is that CallEvent is essentially used by 1 frame to invoke another
 * frame sharing the same context. So this would be appropriate when building 1 frame that
 * many other frames delegate to for a shared chunk of logic.
 *  
 */
public class CallEvent<T> extends RequestEvent<T> {
	private static final long serialVersionUID = 1L;
	private IFrame frame;
	private Map<String, Object> extradata;
	private String frameID;
	
	public CallEvent(IFrame frame, T source) {
		super(source);
		this.frame = frame;
	}
	
	public CallEvent(String frameID, T source) {
		super(source);
		this.frameID = frameID;
	}
	
	public CallEvent(String frameID, T source, Map<String, Object> params) {
		super(source);
		this.frameID = frameID;
		this.params = params;
	}

	
	public IFrame getFrame() {
		return this.frame;
	}
	
	public String getFrameID() {
		return (this.frame != null) ? this.frame.getID() : this.frameID;
	}
	
	public void setData(Map<String, Object> data) {
		this.extradata = data;
	}
	
	public Map<String, Object> getData() {
		return this.extradata;
	}
}