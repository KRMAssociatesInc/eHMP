package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TestAggregateConnectionMetrics {

    private ConnectionMetrics mockMetrics1;
    private ConnectionMetrics mockMetrics2;
    private ConnectionMetrics mockMetrics3;
    private AggregateConnectionMetrics metrics;

    @Before
    public void setUp() throws Exception {
        mockMetrics1 = mock(ConnectionMetrics.class);
        when(mockMetrics1.getRequestCount()).thenReturn(1L);
        when(mockMetrics1.getResponseCount()).thenReturn(1L);
        when(mockMetrics1.getSentBytesCount()).thenReturn(100L);
        when(mockMetrics1.getReceivedBytesCount()).thenReturn(1000L);
        when(mockMetrics1.getMinBytesPerRequest()).thenReturn(123L);
        when(mockMetrics1.getMaxBytesPerRequest()).thenReturn(123L);
        when(mockMetrics1.getMeanBytesPerRequest()).thenReturn(123L);
        when(mockMetrics1.getMinBytesPerResponse()).thenReturn(1234L);
        when(mockMetrics1.getMaxBytesPerResponse()).thenReturn(1234L);
        when(mockMetrics1.getMeanBytesPerResponse()).thenReturn(1234L);
        when(mockMetrics1.getMinElapsedMilliseconds()).thenReturn(111L);
        when(mockMetrics1.getMaxElapsedMilliseconds()).thenReturn(111L);
        when(mockMetrics1.getMeanElapsedMilliseconds()).thenReturn(111L);
        when(mockMetrics1.getMinSendThroughputBitsPerSecond()).thenReturn(1000L);
        when(mockMetrics1.getMaxSendThroughputBitsPerSecond()).thenReturn(1000L);
        when(mockMetrics1.getMeanSendThroughputBitsPerSecond()).thenReturn(1000L);
        when(mockMetrics1.getMinReceiveThroughputBitsPerSecond()).thenReturn(10000L);
        when(mockMetrics1.getMaxReceiveThroughputBitsPerSecond()).thenReturn(10000L);
        when(mockMetrics1.getMeanReceiveThroughputBitsPerSecond()).thenReturn(10000L);

        mockMetrics2 = mock(ConnectionMetrics.class);
        when(mockMetrics2.getRequestCount()).thenReturn(2L);
        when(mockMetrics2.getResponseCount()).thenReturn(2L);
        when(mockMetrics2.getSentBytesCount()).thenReturn(200L);
        when(mockMetrics2.getReceivedBytesCount()).thenReturn(2000L);
        when(mockMetrics2.getMinBytesPerRequest()).thenReturn(223L);
        when(mockMetrics2.getMaxBytesPerRequest()).thenReturn(223L);
        when(mockMetrics2.getMeanBytesPerRequest()).thenReturn(223L);
        when(mockMetrics2.getMinBytesPerResponse()).thenReturn(2345L);
        when(mockMetrics2.getMaxBytesPerResponse()).thenReturn(2345L);
        when(mockMetrics2.getMeanBytesPerResponse()).thenReturn(2345L);
        when(mockMetrics2.getMinElapsedMilliseconds()).thenReturn(222L);
        when(mockMetrics2.getMaxElapsedMilliseconds()).thenReturn(222L);
        when(mockMetrics2.getMeanElapsedMilliseconds()).thenReturn(222L);
        when(mockMetrics2.getMinSendThroughputBitsPerSecond()).thenReturn(2000L);
        when(mockMetrics2.getMaxSendThroughputBitsPerSecond()).thenReturn(2000L);
        when(mockMetrics2.getMeanSendThroughputBitsPerSecond()).thenReturn(2000L);
        when(mockMetrics2.getMinReceiveThroughputBitsPerSecond()).thenReturn(20000L);
        when(mockMetrics2.getMaxReceiveThroughputBitsPerSecond()).thenReturn(20000L);
        when(mockMetrics2.getMeanReceiveThroughputBitsPerSecond()).thenReturn(20000L);

        mockMetrics3 = mock(ConnectionMetrics.class);
        when(mockMetrics3.getRequestCount()).thenReturn(3L);
        when(mockMetrics3.getResponseCount()).thenReturn(3L);
        when(mockMetrics3.getSentBytesCount()).thenReturn(300L);
        when(mockMetrics3.getReceivedBytesCount()).thenReturn(3000L);
        when(mockMetrics3.getMinBytesPerRequest()).thenReturn(323L);
        when(mockMetrics3.getMaxBytesPerRequest()).thenReturn(323L);
        when(mockMetrics3.getMeanBytesPerRequest()).thenReturn(323L);
        when(mockMetrics3.getMinBytesPerResponse()).thenReturn(3456L);
        when(mockMetrics3.getMaxBytesPerResponse()).thenReturn(3456L);
        when(mockMetrics3.getMeanBytesPerResponse()).thenReturn(3456L);
        when(mockMetrics3.getMinElapsedMilliseconds()).thenReturn(333L);
        when(mockMetrics3.getMaxElapsedMilliseconds()).thenReturn(333L);
        when(mockMetrics3.getMeanElapsedMilliseconds()).thenReturn(333L);
        when(mockMetrics3.getMinSendThroughputBitsPerSecond()).thenReturn(3000L);
        when(mockMetrics3.getMaxSendThroughputBitsPerSecond()).thenReturn(3000L);
        when(mockMetrics3.getMeanSendThroughputBitsPerSecond()).thenReturn(3000L);
        when(mockMetrics3.getMinReceiveThroughputBitsPerSecond()).thenReturn(30000L);
        when(mockMetrics3.getMaxReceiveThroughputBitsPerSecond()).thenReturn(30000L);
        when(mockMetrics3.getMeanReceiveThroughputBitsPerSecond()).thenReturn(30000L);

        metrics = new AggregateConnectionMetrics();
        metrics.add(mockMetrics1);
        metrics.add(mockMetrics2);
        metrics.add(mockMetrics3);
    }

    @Test
    public void testConstruct() throws Exception {
        metrics.clear();

        assertThat(metrics.isEmpty(), is(true));

        assertThat(metrics.getRequestCount(), is(0L));
        assertThat(metrics.getResponseCount(), is(0L));

        assertThat(metrics.getSentBytesCount(), is(0L));
        assertThat(metrics.getReceivedBytesCount(), is(0L));

        assertThat(metrics.getMinBytesPerRequest(), is(0L));
        assertThat(metrics.getMaxBytesPerRequest(), is(0L));
        assertThat(metrics.getMeanBytesPerRequest(), is(0L));

        assertThat(metrics.getMinBytesPerResponse(), is(0L));
        assertThat(metrics.getMaxBytesPerResponse(), is(0L));
        assertThat(metrics.getMeanBytesPerResponse(), is(0L));

        assertThat(metrics.getMinElapsedMilliseconds(), is(0L));
        assertThat(metrics.getMaxElapsedMilliseconds(), is(0L));
        assertThat(metrics.getMeanElapsedMilliseconds(), is(0L));

        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(0L));
    }

    @Test
    public void testAggregateRequestCount() throws Exception {
        assertThat(metrics.getRequestCount(), is(6L));
    }

    @Test
    public void testAggregateResponseCount() throws Exception {
        assertThat(metrics.getResponseCount(), is(6L));
    }

    @Test
    public void testAggregateSentBytes() throws Exception {
        assertThat(metrics.getSentBytesCount(), is(600L));
    }

    @Test
    public void testAggregateReceivedBytes() throws Exception {
        assertThat(metrics.getReceivedBytesCount(), is(6000L));
    }

    @Test
    public void testAggregateMinBytesPerRequest() throws Exception {
        assertThat(metrics.getMinBytesPerRequest(), is(123L));
    }

    @Test
    public void testAggregateMaxBytesPerRequest() throws Exception {
        assertThat(metrics.getMaxBytesPerRequest(), is(323L));
    }

    @Test
    public void testAggregateMeanBytesPerRequest() throws Exception {
        assertThat(metrics.getMeanBytesPerRequest(), is(100L));
    }

    @Test
    public void testAggregateMinBytesPerResponse() throws Exception {
        assertThat(metrics.getMinBytesPerResponse(), is(1234L));
    }

    @Test
    public void testAggregateMaxBytesPerResponse() throws Exception {
        assertThat(metrics.getMaxBytesPerResponse(), is(3456L));
    }

    @Test
    public void testAggregateMeanBytesPerResponse() throws Exception {
        assertThat(metrics.getMeanBytesPerResponse(), is(1000L));
    }

    @Test
    public void testAggregateMinElapsedMilliseconds() throws Exception {
        assertThat(metrics.getMinElapsedMilliseconds(), is(111L));
    }

    @Test
    public void testAggregateMaxElapsedMilliseconds() throws Exception {
        assertThat(metrics.getMaxElapsedMilliseconds(), is(333L));
    }

    @Test
    public void testAggregateMeanElapsedMilliseconds() throws Exception {
        assertThat(metrics.getMeanElapsedMilliseconds(), is(259L));
    }

    @Test
    public void testAggregateMinSendThroughput() throws Exception {
        assertThat(metrics.getMinSendThroughputBitsPerSecond(), is(1000L));
    }

    @Test
    public void testAggregateMaxSendThroughput() throws Exception {
        assertThat(metrics.getMaxSendThroughputBitsPerSecond(), is(3000L));
    }

    @Test
    public void testAggregateMeanSendThroughput() throws Exception {
        assertThat(metrics.getMeanSendThroughputBitsPerSecond(), is(2000L));
    }

    @Test
    public void testAggregateMinReceiveThroughput() throws Exception {
        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(10000L));
    }

    @Test
    public void testAggregateMaxReceiveThroughput() throws Exception {
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(30000L));
    }

    @Test
    public void testAggregateMeanReceiveThroughput() throws Exception {
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(20000L));
    }
}
