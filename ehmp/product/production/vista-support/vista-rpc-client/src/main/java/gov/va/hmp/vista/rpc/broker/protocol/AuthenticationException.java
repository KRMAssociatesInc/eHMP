package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class AuthenticationException extends RpcException {
    public AuthenticationException(String message) {
        super(message);
    }
}
