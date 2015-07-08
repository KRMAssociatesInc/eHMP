package gov.va.hmp.vista.rpc;

import java.io.InterruptedIOException;

/**
 * Signals that a timeout waiting for an RPC response has occurred during RPC execution.
 */
public class TimeoutWaitingForRpcResponseException extends RpcException {

    public TimeoutWaitingForRpcResponseException(InterruptedIOException cause) {
        super("Timeout waiting for RPC response", cause);
    }
}
