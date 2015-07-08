package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class BadCredentialsException extends RpcException {
    public static final String INVALID_CREDENTIALS_MESSAGE = "Not a valid ACCESS CODE/VERIFY CODE pair.";

    public BadCredentialsException() {
        super(INVALID_CREDENTIALS_MESSAGE);
    }

    public BadCredentialsException(String message) {
        super(message);
    }

}
