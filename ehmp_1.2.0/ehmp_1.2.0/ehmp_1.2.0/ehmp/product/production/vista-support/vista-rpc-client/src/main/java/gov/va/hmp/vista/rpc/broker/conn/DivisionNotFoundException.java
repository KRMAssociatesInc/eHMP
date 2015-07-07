package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;

public class DivisionNotFoundException extends RpcException {
    private String division;

    public DivisionNotFoundException(String division) {
        super("Unknown division " + division);
        this.division = division;
    }

    public DivisionNotFoundException(String division, Throwable cause) {
        super("Unknown division " + division, cause);
        this.division = division;
    }

    public String getDivision() {
        return division;
    }
}
