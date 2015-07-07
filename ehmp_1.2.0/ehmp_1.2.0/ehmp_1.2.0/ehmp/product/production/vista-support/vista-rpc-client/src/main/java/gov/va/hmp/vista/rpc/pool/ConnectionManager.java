package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.Connection;

/**
 * Management interface for {@link Connection client connections}.
 * The purpose of an RPC connection manager is to serve as a factory for new
 * RPC connections, manage persistent connections and synchronize access to
 * persistent connections making sure that only one thread of execution can
 * have access to a connection at a time.
 * <p>
 * Implementations of this interface must be thread-safe. Access to shared
 * data must be synchronized as methods of this interface may be executed
 * from multiple threads.
 */
public interface ConnectionManager {

    Connection requestConnection(RpcHost host, String credentials) throws RpcException;

    /**
     * Releases a connection for use by others.
     * You may optionally specify how long the connection is valid
     * to be reused.  Values <= 0 are considered to be valid forever.
     * If the connection is not marked as reusable, the connection will
     * not be reused regardless of the valid duration.
     *
     * If the connection has been released before,
     * the call will be ignored.
     *
     * @param connection@see #closeExpiredConnections()
     */
    void releaseConnection(Connection connection);

    /**
     * Invalidates a connection and attempts to close it.
     * <p/>
     * This method should be used when a connection that has been request is determined (due to an exception or other problem) to be invalid.
     *
     * @param connection
     */
    void invalidateConnection(Connection connection);

    /**
     * Closes idle connections in the pool.
     *
     * All expired connections will also be closed.
     *
     * @see #closeExpiredConnections()
     */
    void closeIdleConnections();

    /**
     * Closes all expired connections in the pool.
     */
    void closeExpiredConnections();

    /**
     * Shuts down this connection manager and releases allocated resources.
     * This includes closing all connections, whether they are currently
     * used or not.
     */
    void shutdown();
}
