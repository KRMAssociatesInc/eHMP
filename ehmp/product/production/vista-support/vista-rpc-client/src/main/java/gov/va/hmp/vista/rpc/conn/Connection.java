package gov.va.hmp.vista.rpc.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;

/**
 * A <code>Connection</code> represents an application-level handle that is used by a client to access the underlying
 * physical connection to a VistA instance.
 * <p/>
 * <p>A client gets a Connection instance by using the getConnection method on a ConnectionFactory instance.
 *
 * @see ConnectionFactory
 */
public interface Connection {

    /**
     * The hostname and port of the VistA system to which this connection is open.
     * @return
     */
    RpcHost getHost();

    /**
     * Gets the information on the underlying VistA instance represented through an active connection.
     *
     * @return {@link SystemInfo} instance representing information about the VistA instance.
     * @throws gov.va.hmp.vista.rpc.RpcException if there is a failure getting information about the connected VistA instance.
     */
    SystemInfo getSystemInfo() throws RpcException;

    /**
     * Gets the information on the currently connected user to the underlying VistA instance.
     *
     * @return {@link ConnectionUserDetails} instance representing information about the connected user.
     * @throws RpcException if there is a failure getting information on the currently connected user.
     */
    ConnectionUserDetails getUserDetails() throws RpcException;

    /**
     * Sends an {@link gov.va.hmp.vista.rpc.RpcRequest} to the underlying VistA instance, giving it a chance to respond with an
     * {@link gov.va.hmp.vista.rpc.RpcResponse} or a {@link RpcException}.
     *
     * @param request an RpcRequest to send to the VistA system
     * @return an RpcResponse returned by the VistA system
     * @throws RpcException if any error occurs during execution of the RPC
     * @see gov.va.hmp.vista.rpc.RpcRequest
     * @see gov.va.hmp.vista.rpc.RpcResponse
     */
    RpcResponse send(RpcRequest request) throws RpcException;

    /**
     * Releases this {@link Connection} object's network resources
     * immediately instead of waiting for them to be automatically released.
     * <p/>
     * Calling the method <code>close</code> on a {@link Connection}
     * object that is already closed is a no-op.
     *
     * @throws RpcException if an error occurs
     */
    void close() throws RpcException;

    /**
     * Returns whether or not this connection has been closed.
     *
     * @return <code>true</code> if the connection is closed, <code>false</code> otherwise.
     * @throws RpcException if an error occurs testing whether or not the connection is closed.
     */
    boolean isClosed() throws RpcException;

     /**
     * Checks whether this connection has gone down.
     * Network connections may get closed during some time of inactivity
     * for several reasons. The next time a read is attempted on such a
     * connection it will throw an {@link java.io.IOException}.
     * This method tries to alleviate this inconvenience by trying to
     * find out if a connection is still usable. Implementations may do
     * that by attempting a read with a very small timeout. Thus this
     * method may block for a small amount of time before returning a result.
     * It is therefore an <i>expensive</i> operation.
     *
     * @return  <code>true</code> if attempts to use this connection are
     *          likely to succeed, or <code>false</code> if they are likely
     *          to fail and this connection should be closed
     */
    boolean isStale();

    /**
     * Returns a set of connection metrics.

     * @return ConnectionMetrics
     */
    ConnectionMetrics getMetrics();

    /**
     * Number of milliseconds it took to establish and authenticate the connection with VistA.
     * @return
     */
    long getElapsedMillis();
}
