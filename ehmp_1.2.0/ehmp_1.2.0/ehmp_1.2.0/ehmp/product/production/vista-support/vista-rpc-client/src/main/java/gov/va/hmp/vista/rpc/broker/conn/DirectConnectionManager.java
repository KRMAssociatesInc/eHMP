package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.*;
import gov.va.hmp.vista.rpc.pool.ConnectionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class implements {@link gov.va.hmp.vista.rpc.pool.ConnectionManager} by delegating directly to an instance of {@link ConnectionFactory} which
 * provides a non-pooling implementation of {@link gov.va.hmp.vista.rpc.pool.ConnectionManager}.
 */
public class DirectConnectionManager implements ConnectionManager {

    private static Logger LOG = LoggerFactory.getLogger(DirectConnectionManager.class);

    private ConnectionFactory connectionFactory;

    public DirectConnectionManager(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    @Override
    public synchronized Connection requestConnection(RpcHost host, String credentials) throws RpcException {
        return this.connectionFactory.getConnection(host, getConnectionSpec(credentials));
    }

    @Override
    public void releaseConnection(Connection connection) {
        try {
            connection.close();
        } catch (RpcException e) {
            LOG.warn("Exception while releasing connection", e);
            // NOOP: ignore exceptions on close
        }
    }

    @Override
    public void invalidateConnection(Connection connection) {
        try {
            connection.close();
        } catch (RpcException e) {
            LOG.warn("Exception while invalidating connection", e);
            // NOOP: ignore exceptions on close
        }
    }

    @Override
    public void closeIdleConnections() {
        // NOOP: Nothing to close, since there are no idle connections
    }

    @Override
    public void closeExpiredConnections() {
        // NOOP: Nothing to close, since there are no expired connections
    }

    @Override
    public synchronized void shutdown() {
        connectionFactory = null;
    }

    private ConnectionSpec getConnectionSpec(String credentials) {
        return ConnectionSpecFactory.create(credentials);
    }
}
