package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcIoException;

/**
 * Signals that an end of stream has been reached unexpectedly during reading an RPC response.
 */
public class EOFException extends RpcIoException {

    public EOFException() {
        super("unexpected end of stream in RPC response");
    }

    public EOFException(String detail) {
        super(detail);
    }
}
