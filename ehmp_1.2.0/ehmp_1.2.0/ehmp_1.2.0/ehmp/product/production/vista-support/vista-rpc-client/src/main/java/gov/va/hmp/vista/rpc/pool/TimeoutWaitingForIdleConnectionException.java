package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcException;

/**
 * Exception thrown when a when a request for a connection from a ConnectionManager times out.
 */
public class TimeoutWaitingForIdleConnectionException extends RpcException {

    public TimeoutWaitingForIdleConnectionException() {
        super("Timeout waiting for idle connection");
    }
    
    public TimeoutWaitingForIdleConnectionException(Exception e) {
        super("Timeout waiting for idle connection", e);
    }
}
