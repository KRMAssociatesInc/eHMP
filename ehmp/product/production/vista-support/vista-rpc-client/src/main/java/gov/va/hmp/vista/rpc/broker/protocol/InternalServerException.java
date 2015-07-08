package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

/**
 * TODOC: Provide summary documentation of class InternalServerException
 */
public class InternalServerException extends RpcException {
    public InternalServerException(String message) {
        super("M Error - Use ^XTER: " + message);
    }
}
