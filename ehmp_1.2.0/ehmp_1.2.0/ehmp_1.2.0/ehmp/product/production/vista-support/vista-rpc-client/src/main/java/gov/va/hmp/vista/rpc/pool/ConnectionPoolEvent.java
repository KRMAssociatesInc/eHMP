package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.conn.Connection;

public class ConnectionPoolEvent {
    private final Connection connection;

    public ConnectionPoolEvent(final Connection connection) {
        this.connection = connection;
    }

    public Connection getConnection() {
        return connection;
    }
}
