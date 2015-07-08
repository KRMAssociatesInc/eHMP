package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.BrokerConnectionFactory;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.vista.rpc.conn.ConnectionFactory;
import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;
import gov.va.hmp.vista.rpc.conn.ConnectionSpec;
import gov.va.hmp.vista.rpc.jmx.ManagementContext;
import org.apache.commons.pool.impl.GenericKeyedObjectPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import java.util.NoSuchElementException;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * This class manages open connections in a pool so that every RPC call doesn't have to open (and close) a new
 * connection.
 */
public class DefaultConnectionManager implements InitializingBean, DisposableBean, ApplicationContextAware, ConnectionManager, ConnectionFactory {

    public static final int DEFAULT_PULSE = 81000; // milliseconds; 45% of 3 minutes
    private static final String DEFAULT_DOMAIN = "gov.va.hmp.vista.rpc";

    private static Logger LOGGER = LoggerFactory.getLogger(DefaultConnectionManager.class);

    private ConnectionFactory connectionFactory;
    private GenericKeyedObjectPool<String, Connection> connectionPool;
    private ConnectionMetricsManager metricsManager;
    private ManagementContext jmxContext = new ManagementContext();

    public DefaultConnectionManager() {
        this(new BrokerConnectionFactory());
    }

    public DefaultConnectionManager(ConnectionFactory connectionFactory) {
        this(connectionFactory, createDefaultPoolConfig());
    }

    public DefaultConnectionManager(ConnectionFactory connectionFactory, GenericKeyedObjectPool.Config poolConfig) {
        this.connectionFactory = connectionFactory;
        this.metricsManager = new ConnectionMetricsManager(this, jmxContext);
        this.connectionPool = new GenericKeyedObjectPool<String, Connection>(new PoolableConnectionFactory(this.connectionFactory, metricsManager), poolConfig);
    }

    public DefaultConnectionManager(ConnectionFactory connectionFactory, int maxActive) {
        this(connectionFactory, createPoolConfig(maxActive));
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        jmxContext.registerConnectionManagerMBean(this);
        jmxContext.afterPropertiesSet();
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        jmxContext.setApplicationContext(applicationContext);
    }

    public void setConfig(GenericKeyedObjectPool.Config poolConfig) {
        this.connectionPool.setConfig(poolConfig);
    }

    public int getMaxActive() {
        return connectionPool.getMaxActive();
    }

    public void setMaxActive(int maxActive) {
        connectionPool.setMaxActive(maxActive);
    }

    public long getMaxWait() {
        return connectionPool.getMaxWait();
    }

    public void setMaxWait(long maxWait) {
        connectionPool.setMaxWait(maxWait);
    }

    public long getTimeBetweenEvictionRunsMillis() {
        return connectionPool.getTimeBetweenEvictionRunsMillis();
    }

    public void setTimeBetweenEvictionRunsMillis(long timeBetweenEvictionRunsMillis) {
        connectionPool.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);
    }

    public long getMinEvictableIdleTimeMillis() {
        return connectionPool.getMinEvictableIdleTimeMillis();
    }

    public void setMinEvictableIdleTimeMillis(long minEvictableIdleTimeMillis) {
        connectionPool.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
    }

    public int getNumActiveConnections() {
        return connectionPool.getNumActive();
    }

    public int getNumIdleConnections() {
        return connectionPool.getNumIdle();
    }

    public Set<RpcHost> getActiveHosts() {
        return metricsManager.getActiveHosts();
    }

    public ConnectionMetrics getMetrics(RpcHost host) {
        return metricsManager.getMetrics(host);
    }

    public ConnectionMetrics getTotals() {
        return metricsManager.getTotals();
    }

    @Override
    public Connection getConnection(RpcHost host, ConnectionSpec auth) throws RpcException {
        return requestConnection(host, auth.toString());
    }

    @Override
    public Connection requestConnection(RpcHost host, String credentials) throws RpcException {
        long blockingMillisStart = System.currentTimeMillis();
        try {
            String key = PoolKeyUtils.getKey(host, credentials);
            boolean newConnection = isNewConnection(key);
            LOGGER.debug("DefaultConnectionManager: Getting an RPC connection from the pool for host (This may block of all connections are used): " + ((host != null) ? host.getHostname() : "(host was null)"));
            Connection connection = (Connection) connectionPool.borrowObject(key);
            LOGGER.debug("DefaultConnectionManager: Received a connection from the pool for host: " + ((host != null) ? host.getHostname() : "(host was null)"));
            long blockingMillis = System.currentTimeMillis() - blockingMillisStart;
            if (newConnection) {
                blockingMillis -= connection.getElapsedMillis();
            }

            return new ManagedConnection(this, key, connection, blockingMillis, newConnection ? connection.getElapsedMillis() : -1);
        } catch (RpcException e) {
            throw e;
        } catch (NoSuchElementException e) {
            throw new TimeoutWaitingForIdleConnectionException(e);
        } catch (Exception e) {
            throw new RpcException(e);
        }
    }

    private boolean isNewConnection(String key) {
        return (connectionPool.getNumActive(key) + connectionPool.getNumIdle(key)) == 0;
    }

    @Override
    public void releaseConnection(Connection connection) {
        try {
            ManagedConnection managedConnection = (ManagedConnection) connection;
            String key = managedConnection.getConnectionKey();
            connectionPool.returnObject(key, managedConnection.getConnection());
        } catch (Exception e) {
            LOGGER.error("Exception occurred releasing connection", e);
        }
    }

    @Override
    public void invalidateConnection(Connection connection) {
        try {
            ManagedConnection managedConnection = (ManagedConnection) connection;
            String key = managedConnection.getConnectionKey();
            connectionPool.invalidateObject(key, managedConnection.getConnection());
        } catch (Exception e) {
            LOGGER.warn("Exception occurred invalidating connection", e);
        }
    }

    @Override
    public void closeIdleConnections() {
        try {
            connectionPool.clear();
        } catch (Exception e) {
            LOGGER.warn("Exception occurred closing idle connections", e);
        }
    }

    @Override
    public void closeExpiredConnections() {
        try {
            connectionPool.evict();
        } catch (Exception e) {
            LOGGER.warn("Exception occurred closing expired connections", e);
        }
    }

    @Override
    public void shutdown() {
        try {
            connectionPool.close();
        } catch (Exception e) {
            LOGGER.warn("Exception occurred shutting down connection manager", e);
        }
        metricsManager.shutdown();
        jmxContext.unregisterConnectionManagerMBean(this);
    }

    @Override
    public void destroy() throws Exception {
        shutdown();
    }

    static GenericKeyedObjectPool.Config createDefaultPoolConfig() {
        GenericKeyedObjectPool.Config poolConfig = new GenericKeyedObjectPool.Config();
        poolConfig.maxActive = 1; // one object per key
        poolConfig.maxWait = TimeUnit.SECONDS.toMillis(30);
        poolConfig.testWhileIdle = true;
        poolConfig.timeBetweenEvictionRunsMillis = DEFAULT_PULSE;
        poolConfig.minEvictableIdleTimeMillis = TimeUnit.MINUTES.toMillis(5);
        poolConfig.testOnBorrow = true;
        return poolConfig;
    }

    static GenericKeyedObjectPool.Config createPoolConfig(int maxActive) {
        GenericKeyedObjectPool.Config poolConfig = createDefaultPoolConfig();
        poolConfig.maxActive = maxActive;
        return poolConfig;
    }
}
