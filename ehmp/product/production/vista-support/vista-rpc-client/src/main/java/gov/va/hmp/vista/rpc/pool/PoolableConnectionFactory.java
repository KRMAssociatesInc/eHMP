package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.*;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.apache.commons.pool.KeyedPoolableObjectFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Implementation of {@link KeyedPoolableObjectFactory} that uses the supplied {@link ConnectionFactory} to create
 * connections to be pooled by key by a GenericKeyedObjectPool.
 * <p/>
 *
 * @see org.apache.commons.pool.impl.GenericKeyedObjectPool
 */
public class PoolableConnectionFactory implements KeyedPoolableObjectFactory<String, Connection> {

    private static Logger LOG = LoggerFactory.getLogger(PoolableConnectionFactory.class);

    private ConnectionFactory connectionFactory;

    private List<ConnectionPoolListener> eventListeners = Collections.synchronizedList(new ArrayList<ConnectionPoolListener>());

    public PoolableConnectionFactory(ConnectionFactory connectionFactory) {
        Assert.notNull(connectionFactory, "connectionFactory must not be null");
        this.connectionFactory = connectionFactory;
    }

    public PoolableConnectionFactory(ConnectionFactory connectionFactory, ConnectionPoolListener listener) {
        this(connectionFactory);
        if (listener != null) addConnectionListener(listener);
    }

    public void addConnectionListener(final ConnectionPoolListener listener) {
        eventListeners.add(listener);
    }

    public void removeConnectionListener(final ConnectionPoolListener listener) {
        eventListeners.remove(listener);
    }

    protected void fireConnectionCreated(Connection connection) {
        ConnectionPoolListener[] listeners = eventListeners.toArray(new ConnectionPoolListener[eventListeners.size()]);
        if (listeners.length == 0) return;
        ConnectionPoolEvent e = new ConnectionPoolEvent(connection);
        for (ConnectionPoolListener listener : listeners) {
             listener.connectionCreated(e);
        }
    }

    protected void fireConnectionClosed(Connection connection) {
        ConnectionPoolListener[] listeners = eventListeners.toArray(new ConnectionPoolListener[eventListeners.size()]);
        if (listeners.length == 0) return;
        ConnectionPoolEvent e = new ConnectionPoolEvent(connection);
        for (ConnectionPoolListener listener : listeners) {
            listener.connectionClosed(e);
        }
    }

    protected void fireConnectionActivated(Connection connection) {
        ConnectionPoolListener[] listeners = eventListeners.toArray(new ConnectionPoolListener[eventListeners.size()]);
        if (listeners.length == 0) return;
        ConnectionPoolEvent e = new ConnectionPoolEvent(connection);
        for (ConnectionPoolListener listener : listeners) {
            listener.connectionActivated(e);
        }
    }

    protected void fireConnectionPassivated(Connection connection) {
        ConnectionPoolListener[] listeners = eventListeners.toArray(new ConnectionPoolListener[eventListeners.size()]);
        if (listeners.length == 0) return;
        ConnectionPoolEvent e = new ConnectionPoolEvent(connection);
        for (ConnectionPoolListener listener : listeners) {
            listener.connectionPassivated(e);
        }
    }

    @Override
    public Connection makeObject(String key) throws Exception {
        ConnectionSpec auth = null;
        try {
            RpcHost host = RpcUriUtils.extractHost(PoolKeyUtils.keyToUriString(key));
            auth = PoolKeyUtils.keyToConnectionSpec(key);
            Connection connection = connectionFactory.getConnection(host, auth);
            fireConnectionCreated(connection);
            return connection;
        } finally {
            LOG.debug("Connection pool: created     {}", RpcUriUtils.sanitize(PoolKeyUtils.keyToUriString(key), auth));
        }
    }

    @Override
    public void destroyObject(String key, Connection connection) throws Exception {
        Connection c = (Connection) connection;
        try {
            LOG.debug("Connection pool: destroying  {}", RpcUriUtils.sanitize(PoolKeyUtils.keyToUriString(key), PoolKeyUtils.keyToConnectionSpec(key)));
            c.close();
            fireConnectionClosed(connection);
        } catch (RpcException e) {
            throw e;
        } finally {
            LOG.debug("Connection pool: destroyed   {}", RpcUriUtils.sanitize(PoolKeyUtils.keyToUriString(key), PoolKeyUtils.keyToConnectionSpec(key)));
        }
    }

    @Override
    public boolean validateObject(String key, Connection connection) {
        if (LOG.isDebugEnabled()) {
            LOG.debug("Connection pool: validating  {}", RpcUriUtils.sanitize(PoolKeyUtils.keyToUriString(key), PoolKeyUtils.keyToConnectionSpec(key)));
        }
        Connection c = (Connection) connection;
        if (c.isClosed()) return false;
        return !c.isStale();
    }

    @Override
    public void activateObject(String key, Connection connection) throws Exception {
        LOG.debug("Connection pool: activating  {}", RpcUriUtils.sanitize(PoolKeyUtils.keyToUriString(key), PoolKeyUtils.keyToConnectionSpec(key)));
        fireConnectionActivated(connection);
    }

    @Override
    public void passivateObject(String key, Connection connection) throws Exception {
        LOG.debug("Connection pool: passivating {}", RpcUriUtils.sanitize(PoolKeyUtils.keyToUriString(key), PoolKeyUtils.keyToConnectionSpec(key)));
        fireConnectionPassivated(connection);
    }

}
