package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.*;
import gov.va.hmp.vista.rpc.broker.conn.ConnectionClosedException;
import gov.va.hmp.vista.rpc.broker.protocol.InternalServerException;
import gov.va.hmp.vista.rpc.conn.Connection;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InterruptedIOException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class ManagedConnectionTest {
    public static final long BLOCKING_MILLIS = 54321L;
    public static final long CONNECTING_MILLIS = 98765L;

    private ConnectionManager connectionManager;
    private ManagedConnection managedConnection;
    private Connection connection;
    private RpcRequest request;


    @Before
    public void setUp() throws IOException {
        connectionManager = mock(ConnectionManager.class);
        connection = mock(Connection.class);
        request = mock(RpcRequest.class);
        managedConnection = new ManagedConnection(connectionManager, "", connection, BLOCKING_MILLIS, CONNECTING_MILLIS);
    }

    @Test
    public void testSendNormalFlow() throws IOException {
        RpcResponse response = new RpcResponse("");
        when(connection.send((RpcRequest) any())).thenReturn(response);

        try {
            RpcResponse response1 = managedConnection.send(request);
            assertNotNull(response1);
            assertThat(response1.getElapsedMillis(RpcPhase.CONNECTING), is(CONNECTING_MILLIS));
            assertThat(response1.getElapsedMillis(RpcPhase.BLOCKING), is(BLOCKING_MILLIS));
        } catch (Throwable t) {
            fail("Should not thrown Exception");
        }
    }

    @Test
    public void testSendThrowRpcIoException() throws IOException {
        when(connection.send(any(RpcRequest.class))).thenThrow(new RpcIoException());

        try {
            managedConnection.send(request);
            fail("Should have thrown RpcIoException");
        } catch (Throwable t) {
            assertTrue(t instanceof RpcIoException);
        }
        verify(connectionManager).invalidateConnection(managedConnection);
        verify(connectionManager).closeExpiredConnections();
        assertThat(managedConnection.isClosed(), is(true));
    }

    @Test
    public void testSendThrowInternalServerException() throws InternalServerException {
        when(connection.send(any(RpcRequest.class))).thenThrow(new InternalServerException("whoops"));

        try {
            managedConnection.send(request);
            fail("Should have thrown " + InternalServerException.class);
        } catch (Throwable t) {
            assertTrue(t instanceof InternalServerException);
        }
        verify(connectionManager).invalidateConnection(managedConnection);
        verify(connectionManager).closeExpiredConnections();
        assertThat(managedConnection.isClosed(), is(true));
    }

    @Test
    public void testSendThrowTimeoutWaitingForRpcResponseException() throws InternalServerException {
        when(connection.send(any(RpcRequest.class))).thenThrow(new TimeoutWaitingForRpcResponseException(new InterruptedIOException("too long!")));

        try {
            managedConnection.send(request);
            fail("Should have thrown " + TimeoutWaitingForRpcResponseException.class);
        } catch (Throwable t) {
            assertTrue(t instanceof TimeoutWaitingForRpcResponseException);
        }
        verify(connectionManager).invalidateConnection(managedConnection);
        verify(connectionManager).closeExpiredConnections();
        assertThat(managedConnection.isClosed(), is(true));
    }

    @Test
    public void testCloseIsClosedAndIsStale() {
        managedConnection.close();

        assertThat(managedConnection.isClosed(), is(true));
        assertThat(managedConnection.isStale(), is(false));
        verify(connectionManager).releaseConnection(managedConnection);
    }

    @Test(expected = ConnectionClosedException.class)
    public void testGetHostAfterClose() {
        managedConnection.close();
        managedConnection.getSystemInfo();
    }

    @Test(expected = ConnectionClosedException.class)
    public void testGetSystemInfoAfterClose() {
        managedConnection.close();
        managedConnection.getSystemInfo();
    }

    @Test(expected = ConnectionClosedException.class)
    public void testGetUserDetailsAfterClose() {
        managedConnection.close();
        managedConnection.getUserDetails();
    }

    @Test(expected = ConnectionClosedException.class)
    public void testSendAfterClose() {
        managedConnection.close();
        managedConnection.send(request);
    }

    @Test(expected = ConnectionClosedException.class)
    public void testGetMetricsAfterClose() {
        managedConnection.close();
        managedConnection.getMetrics();
    }
}
