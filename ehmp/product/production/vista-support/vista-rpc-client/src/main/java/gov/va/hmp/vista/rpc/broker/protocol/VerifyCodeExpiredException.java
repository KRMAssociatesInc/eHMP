package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class VerifyCodeExpiredException extends RpcException {
    public static final String VERIFY_CODE_EXPIRED_MESSAGE = "VERIFY CODE must be changed before continued use.";

    public VerifyCodeExpiredException() {
        super(VERIFY_CODE_EXPIRED_MESSAGE);
    }

    public VerifyCodeExpiredException(String message) {
        super(message);
    }
}
