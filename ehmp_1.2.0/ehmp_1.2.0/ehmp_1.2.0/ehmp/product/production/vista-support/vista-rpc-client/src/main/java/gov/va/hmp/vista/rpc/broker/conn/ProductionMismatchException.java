package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;

/**
 * Thrown when there is a mismatch between the client and the server in the designation of each side as production or non-production.
 *
 * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,PRODUCTION(8989.3,501)"
 */
public class ProductionMismatchException extends RpcException {
    public ProductionMismatchException(boolean expected, boolean actual) {
        super("There is a mismatch between the application and VistA account production settings.  Expected production=" + expected + ", was " + actual);
    }
}
