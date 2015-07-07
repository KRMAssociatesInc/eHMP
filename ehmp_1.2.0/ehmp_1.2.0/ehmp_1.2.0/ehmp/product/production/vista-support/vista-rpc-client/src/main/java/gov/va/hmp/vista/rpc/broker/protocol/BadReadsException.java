package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

/**
 * TODOC: Provide summary documentation of class BadReadsException
 */
public class BadReadsException extends RpcException {
    public BadReadsException() {
        super("Repeated Incomplete Reads on the server. Server unable to read input data correctly.");
    }
}
