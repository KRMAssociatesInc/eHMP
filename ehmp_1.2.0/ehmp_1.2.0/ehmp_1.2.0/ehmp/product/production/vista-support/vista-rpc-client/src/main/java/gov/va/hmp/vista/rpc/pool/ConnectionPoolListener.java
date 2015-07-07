package gov.va.hmp.vista.rpc.pool;

public interface ConnectionPoolListener {
    void connectionCreated(final ConnectionPoolEvent event);
    void connectionClosed(final ConnectionPoolEvent event);
    void connectionActivated(final ConnectionPoolEvent event);
    void connectionPassivated(final ConnectionPoolEvent event);
}
