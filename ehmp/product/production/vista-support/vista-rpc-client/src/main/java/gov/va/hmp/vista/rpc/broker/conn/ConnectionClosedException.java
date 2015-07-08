package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;

public class ConnectionClosedException extends RpcException {

    public ConnectionClosedException() {
        this("connection has already been closed");
    }

    public ConnectionClosedException(String message) {
        super(message);
    }
}
