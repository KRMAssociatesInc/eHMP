package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class RpcContextNotFoundException extends RpcException {
    public RpcContextNotFoundException(String message) {
        super(message);
    }
}
