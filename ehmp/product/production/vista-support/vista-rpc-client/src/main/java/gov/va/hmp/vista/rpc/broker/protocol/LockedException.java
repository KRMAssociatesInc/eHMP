package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class LockedException extends RpcException {
    public LockedException(String message) {
        super(message); 
    }
}
