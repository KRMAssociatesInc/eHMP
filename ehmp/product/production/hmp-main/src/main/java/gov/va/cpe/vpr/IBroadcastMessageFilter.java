package gov.va.cpe.vpr;

import javax.jms.JMSException;
import javax.jms.Message;

/**
 * Useful for things like filtering on specific PID(s), jobs, etc.
 * @author brian
 */
public interface IBroadcastMessageFilter {
    public boolean include(Message msg) throws JMSException;
    
    public static class PIDMessageFilter implements IBroadcastMessageFilter {
    	
    	private String pid;

		public PIDMessageFilter(String pid) {
    		this.pid = pid;
		}

		@Override
		public boolean include(Message msg) throws JMSException {
			String pid = msg.getStringProperty("pid");
			if (pid != null && pid.equalsIgnoreCase(this.pid)) {
				return true;
			}
			return false;
		}
    }
}
