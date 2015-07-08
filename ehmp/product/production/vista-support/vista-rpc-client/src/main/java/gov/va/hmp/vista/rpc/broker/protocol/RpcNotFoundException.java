package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class RpcNotFoundException extends RpcException {
    public RpcNotFoundException(String message) {
        super(message);
    }
}
