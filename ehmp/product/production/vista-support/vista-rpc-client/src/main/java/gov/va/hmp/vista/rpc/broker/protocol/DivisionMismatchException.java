package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class DivisionMismatchException extends RpcException {

    public DivisionMismatchException(String message) {
        super(message);
    }
    
}
