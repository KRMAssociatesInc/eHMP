package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.notNull;
import static org.mockito.Mockito.*;

public class TestPoolableConnectionFactory {

    private RpcHost host = new RpcHost("example.org", 9060);
    private String credentials = "500:foo;bar";

    private ConnectionFactory mockConnectionFactory;
    private PoolableConnectionFactory poolableConnectionFactory;
    private ConnectionPoolListener mockListener;

    @Before
    public void setUp() throws Exception {
        mockConnectionFactory = mock(ConnectionFactory.class);
        poolableConnectionFactory = new PoolableConnectionFactory(mockConnectionFactory);
        mockListener = mock(ConnectionPoolListener.class);
        poolableConnectionFactory.addConnectionListener(mockListener);
    }

    @After
    public void tearDown() throws Exception {
        poolableConnectionFactory.removeConnectionListener(mockListener);
    }

    @Test
    public void testMakeObject() throws Exception {
        ConnectionSpec spec = ConnectionSpecFactory.create(credentials);
        Connection mockConnection = mock(Connection.class);
        when(mockConnectionFactory.getConnection(host, spec)).thenReturn(mockConnection);

        Connection c = (Connection) poolableConnectionFactory.makeObject(PoolKeyUtils.getKey(host, credentials));
        verify(mockConnectionFactory).getConnection(host, spec);
        assertThat(c, sameInstance(mockConnection));

        ArgumentCaptor<ConnectionPoolEvent> eventCaptor = ArgumentCaptor.forClass(ConnectionPoolEvent.class);
        verify(mockListener).connectionCreated(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getConnection(), sameInstance(c));

    }

    @Test
    public void testDestroyObject() throws Exception {
        Connection mockConnection = mock(Connection.class);
        poolableConnectionFactory.destroyObject(PoolKeyUtils.getKey(host, credentials), mockConnection);
        verifyZeroInteractions(mockConnectionFactory);
        verify(mockConnection).close();

        ArgumentCaptor<ConnectionPoolEvent> eventCaptor = ArgumentCaptor.forClass(ConnectionPoolEvent.class);
        verify(mockListener).connectionClosed(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getConnection(), sameInstance(mockConnection));
    }

    @Test
    public void testActivateObject() throws Exception {
        Connection mockConnection = mock(Connection.class);
        poolableConnectionFactory.activateObject(PoolKeyUtils.getKey(host, credentials), mockConnection);
        verifyZeroInteractions(mockConnectionFactory, mockConnection);

        ArgumentCaptor<ConnectionPoolEvent> eventCaptor = ArgumentCaptor.forClass(ConnectionPoolEvent.class);
        verify(mockListener).connectionActivated(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getConnection(), sameInstance(mockConnection));
    }

    @Test
    public void testPassivateObject() throws Exception {
        Connection mockConnection = mock(Connection.class);
        poolableConnectionFactory.passivateObject(PoolKeyUtils.getKey(host, credentials), mockConnection);
        verifyZeroInteractions(mockConnectionFactory, mockConnection);

        ArgumentCaptor<ConnectionPoolEvent> eventCaptor = ArgumentCaptor.forClass(ConnectionPoolEvent.class);
        verify(mockListener).connectionPassivated(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getConnection(), sameInstance(mockConnection));
    }
}
