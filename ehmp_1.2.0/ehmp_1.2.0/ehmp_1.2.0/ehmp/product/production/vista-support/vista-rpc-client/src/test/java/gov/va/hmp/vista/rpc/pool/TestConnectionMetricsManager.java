package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;
import gov.va.hmp.vista.rpc.jmx.ManagementContext;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TestConnectionMetricsManager {

    private static final RpcHost HOST_1 = new RpcHost("exmaple.org", 9060);
    private static final RpcHost HOST_2 = new RpcHost("exmaple.org", 9060);
    private static final RpcHost HOST_3 = new RpcHost("exmaple.org", 9061);
    private static final RpcHost HOST_4 = new RpcHost("exmaple.com", 10060);

    private ConnectionMetricsManager m;

    private Connection mockConnection1;
    private ConnectionMetrics mockMetrics1;
    private Connection mockConnection2;
    private ConnectionMetrics mockMetrics2;
    private Connection mockConnection3;
    private ConnectionMetrics mockMetrics3;
    private Connection mockConnection4;
    private ConnectionMetrics mockMetrics4;

    @Before
    public void setUp() throws Exception {
        ManagementContext jmxContext = new ManagementContext();
        m = new ConnectionMetricsManager(mock(ConnectionManager.class), jmxContext);

        mockMetrics1 = mock(ConnectionMetrics.class);
        mockConnection1 = mock(Connection.class);
        when(mockConnection1.getMetrics()).thenReturn(mockMetrics1);
        when(mockConnection1.getHost()).thenReturn(HOST_1);

        mockMetrics2 = mock(ConnectionMetrics.class);
        mockConnection2 = mock(Connection.class);
        when(mockConnection2.getMetrics()).thenReturn(mockMetrics2);
        when(mockConnection2.getHost()).thenReturn(HOST_2);

        mockMetrics3 = mock(ConnectionMetrics.class);
        mockConnection3 = mock(Connection.class);
        when(mockConnection3.getMetrics()).thenReturn(mockMetrics3);
        when(mockConnection3.getHost()).thenReturn(HOST_3);

        mockMetrics4 = mock(ConnectionMetrics.class);
        mockConnection4 = mock(Connection.class);
        when(mockConnection4.getMetrics()).thenReturn(mockMetrics4);
        when(mockConnection4.getHost()).thenReturn(HOST_4);
    }

    @Test
    public void testConstruct() throws Exception {
        assertThat(m.getTotals().getRequestCount(), is(0L));
        assertThat(m.getTotals().getResponseCount(), is(0L));

        assertThat(m.getTotals().getRequestCount(), is(0L));
        assertThat(m.getTotals().getResponseCount(), is(0L));

        assertThat(m.getTotals().getSentBytesCount(), is(0L));
        assertThat(m.getTotals().getReceivedBytesCount(), is(0L));

        assertThat(m.getTotals().getMinBytesPerRequest(), is(0L));
        assertThat(m.getTotals().getMaxBytesPerRequest(), is(0L));
        assertThat(m.getTotals().getMeanBytesPerRequest(), is(0L));

        assertThat(m.getTotals().getMinBytesPerResponse(), is(0L));
        assertThat(m.getTotals().getMaxBytesPerResponse(), is(0L));
        assertThat(m.getTotals().getMeanBytesPerResponse(), is(0L));

        assertThat(m.getTotals().getMinReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(m.getTotals().getMaxReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(m.getTotals().getMeanReceiveThroughputBitsPerSecond(), is(0L));

        assertThat(m.getActiveHosts().isEmpty(), is(true));
    }

    @Test
    public void testTotalsAffectedByConnectionOpeningAndClosing() throws Exception {
        ConnectionMetrics mockMetrics1 = mock(ConnectionMetrics.class);
        Connection mockConnection1 = mock(Connection.class);
        when(mockConnection1.getMetrics()).thenReturn(mockMetrics1);
        when(mockConnection1.getHost()).thenReturn(HOST_1);

        m.connectionCreated(new ConnectionPoolEvent(mockConnection1));
        assertThat(m.metricsTotals.contains(mockMetrics1), is(true));

        m.connectionClosed(new ConnectionPoolEvent(mockConnection1));
        assertThat(m.metricsTotals.contains(mockMetrics1), is(false));
    }

    @Test
    public void testMetricsByHostAffectedByConnectionOpeningAndClosing() throws Exception {
        m.connectionCreated(new ConnectionPoolEvent(mockConnection1));
        assertThat(m.getActiveHosts().size(), is(1));
        assertThat(m.getActiveHosts(), hasItem(HOST_1));
        assertThat(m.metricsByHost.get(HOST_1).contains(mockMetrics1), is(true));

        m.connectionCreated(new ConnectionPoolEvent(mockConnection2));
        assertThat(m.getActiveHosts().size(), is(1)); // HOST_1 and HOST_2 are the same
        assertThat(m.getActiveHosts(), hasItem(HOST_2));
        assertThat(m.metricsByHost.get(HOST_2).contains(mockMetrics1), is(true));
        assertThat(m.metricsByHost.get(HOST_2).contains(mockMetrics2), is(true));

        m.connectionCreated(new ConnectionPoolEvent(mockConnection3));
        assertThat(m.getActiveHosts().size(), is(2));
        assertThat(m.getActiveHosts(), hasItem(HOST_3));
        assertThat(m.metricsByHost.get(HOST_3).contains(mockMetrics3), is(true));

        m.connectionCreated(new ConnectionPoolEvent(mockConnection4));
        assertThat(m.getActiveHosts().size(), is(3));
        assertThat(m.getActiveHosts(), hasItem(HOST_4));
        assertThat(m.metricsByHost.get(HOST_4).contains(mockMetrics4), is(true));

        m.connectionClosed(new ConnectionPoolEvent(mockConnection1));
        assertThat(m.getActiveHosts().size(), is(3));
        assertThat(m.getActiveHosts(), hasItem(HOST_1));
        assertThat(m.metricsByHost.get(HOST_1).contains(mockMetrics1), is(false));
        assertThat(m.metricsByHost.get(HOST_2).contains(mockMetrics2), is(true));

        m.connectionClosed(new ConnectionPoolEvent(mockConnection4));
        assertThat(m.getActiveHosts().size(), is(2));
        assertThat(m.getActiveHosts(), not(hasItem(HOST_4)));
        assertThat(m.metricsByHost.get(HOST_4), nullValue());

        m.connectionClosed(new ConnectionPoolEvent(mockConnection3));
        assertThat(m.getActiveHosts().size(), is(1));
        assertThat(m.getActiveHosts(), not(hasItem(HOST_3)));
        assertThat(m.metricsByHost.get(HOST_3), nullValue());

        m.connectionClosed(new ConnectionPoolEvent(mockConnection2));
        assertThat(m.getActiveHosts().size(), is(0));
        assertThat(m.getActiveHosts(), not(hasItem(HOST_2)));
        assertThat(m.metricsByHost.get(HOST_2), nullValue());
    }
}
