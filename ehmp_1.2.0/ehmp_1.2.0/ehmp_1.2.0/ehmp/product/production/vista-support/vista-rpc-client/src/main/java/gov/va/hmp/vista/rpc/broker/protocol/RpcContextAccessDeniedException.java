package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class RpcContextAccessDeniedException extends RpcException {
    public RpcContextAccessDeniedException(String message) {
        super(message); 
    }
}
