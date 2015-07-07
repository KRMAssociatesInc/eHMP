package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.*;
import gov.va.hmp.vista.rpc.broker.conn.ConnectionClosedException;
import gov.va.hmp.vista.rpc.broker.protocol.InternalServerException;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;
import gov.va.hmp.vista.rpc.conn.ConnectionUserDetails;
import gov.va.hmp.vista.rpc.conn.SystemInfo;

public class ManagedConnection implements Connection {

    private ConnectionManager connectionManager;
    private String connectionKey;
    private Connection connection;
    private long blockingMillis = -1;
    private long connectingMillis = -1;
    private boolean released = false;

    public ManagedConnection(ConnectionManager connectionManager, String connectionKey, Connection connection, long blockingMillis, long connectingMillis) {
        this.connectionManager = connectionManager;
        this.connectionKey = connectionKey;
        this.connection = connection;
        this.blockingMillis = blockingMillis;
        this.connectingMillis = connectingMillis;
    }

    String getConnectionKey() {
        return connectionKey;
    }

    Connection getConnection() {
        return connection;
    }

    @Override
    public RpcHost getHost() {
        if (released) throw new ConnectionClosedException();
        return connection.getHost();
    }

    @Override
    public SystemInfo getSystemInfo() throws RpcException {
        if (released) throw new ConnectionClosedException();
        return connection.getSystemInfo();
    }

    @Override
    public ConnectionUserDetails getUserDetails() throws RpcException {
        if (released) throw new ConnectionClosedException();
        return connection.getUserDetails();
    }

    @Override
    public RpcResponse send(RpcRequest request) throws RpcException {
        if (released) throw new ConnectionClosedException();
        try {
            RpcResponse response = connection.send(request);
            response.setElapsedMillis(RpcPhase.BLOCKING, blockingMillis);
            response.setElapsedMillis(RpcPhase.CONNECTING, connectingMillis);
            return response;
        } catch (TimeoutWaitingForRpcResponseException e) {
            invalidate();
            throw e;
        } catch (RpcIoException e) {
            invalidate();
            throw e;
        } catch (InternalServerException e) {
            invalidate();
            throw e;
        }
    }

    private void invalidate() {
        if (released) return;
        try {
            connectionManager.invalidateConnection(this);
            connectionManager.closeExpiredConnections();
        } finally {
            released = true;
        }
    }

    @Override
    public void close() throws RpcException {
        if (released) return;
        try {
            connectionManager.releaseConnection(this);
            connection = null;
        } finally {
            released = true;
        }
    }

    @Override
    public boolean isClosed() throws RpcException {
        if (released)
            return true;
        else
            return connection.isClosed();
    }

    @Override
    public boolean isStale() {
        if (released)
            return false;
        else
            return connection.isStale();
    }

    @Override
    public ConnectionMetrics getMetrics() {
        if (released) throw new ConnectionClosedException();
        return connection.getMetrics();
    }

    @Override
    public long getElapsedMillis() {
        return connectingMillis;
    }
}
