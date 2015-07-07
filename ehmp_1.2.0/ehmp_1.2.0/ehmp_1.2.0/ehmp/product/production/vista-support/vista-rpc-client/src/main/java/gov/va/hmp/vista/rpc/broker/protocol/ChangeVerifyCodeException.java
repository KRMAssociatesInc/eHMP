package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

/**
 * No docs I can find tell me of various CVC error codes, so I'll keep this one generalized.
 * @author vhaislchandj
 *
 */
public class ChangeVerifyCodeException extends RpcException {
    public ChangeVerifyCodeException(String message) {
        super(message);
    }
}
