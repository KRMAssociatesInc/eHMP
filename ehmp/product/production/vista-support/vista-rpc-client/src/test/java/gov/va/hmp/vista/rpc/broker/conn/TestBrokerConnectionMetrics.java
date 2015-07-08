package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class TestBrokerConnectionMetrics {

    private BrokerConnectionMetrics metrics;
    private TransportMetrics mockInMetrics;
    private TransportMetrics mockOutMetrics;

    @Before
    public void setUp() throws Exception {
        mockInMetrics = mock(TransportMetrics.class);
        mockOutMetrics = mock(TransportMetrics.class);
        metrics = new BrokerConnectionMetrics(mockInMetrics, mockOutMetrics);
    }

    @Test
    public void testConstruct() throws Exception {
        assertThat(metrics.getRequestCount(), is(0L));
        assertThat(metrics.getMinBytesPerRequest(), is(0L));
        assertThat(metrics.getMaxBytesPerRequest(), is(0L));
        assertThat(metrics.getMeanBytesPerRequest(), is(0L));

        assertThat(metrics.getResponseCount(), is(0L));
        assertThat(metrics.getMinBytesPerResponse(), is(0L));
        assertThat(metrics.getMaxBytesPerResponse(), is(0L));
        assertThat(metrics.getMeanBytesPerResponse(), is(0L));

        assertThat(metrics.getMinElapsedMilliseconds(), is(0L));
        assertThat(metrics.getMaxElapsedMilliseconds(), is(0L));
        assertThat(metrics.getMeanElapsedMilliseconds(), is(0L));

        assertThat(metrics.getMinSendThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMaxSendThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMeanSendThroughputBitsPerSecond(), is(0L));

        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(0L));
    }

    @Test
    public void testGetSentAndReceivedBytesDelegatesToTransportMetrics() throws Exception {
        when(mockOutMetrics.getBytesTransferred()).thenReturn(123L);
        when(mockInMetrics.getBytesTransferred()).thenReturn(456L);

        assertThat(metrics.getSentBytesCount(), is(123L));
        assertThat(metrics.getReceivedBytesCount(), is(456L));

        verify(mockOutMetrics).getBytesTransferred();
        verify(mockInMetrics).getBytesTransferred();
    }

    @Test
    public void testRequestResponseChainAndCummulativeRollingMeans() throws Exception {
        Long[] requestBytes = new Long[]{1234L, 1234L + 4321L};
        Long[] responseBytes = new Long[]{5678L, 5678L + 8765L};
        when(mockOutMetrics.getBytesTransferred()).thenReturn(requestBytes[0], requestBytes[1]);
        when(mockInMetrics.getBytesTransferred()).thenReturn(responseBytes[0], responseBytes[1]);

        metrics.incrementRequestCount(TimeUnit.SECONDS.toMillis(1));
        assertThat(metrics.getRequestCount(), is(1L));

        metrics.incrementResponseCount(TimeUnit.SECONDS.toMillis(3));
        assertThat(metrics.getResponseCount(), is(1L));

        assertThat(metrics.getMinBytesPerRequest(), is(requestBytes[0]));
        assertThat(metrics.getMaxBytesPerRequest(), is(requestBytes[0]));
        assertThat(metrics.getMeanBytesPerRequest(), is(requestBytes[0]));

        assertThat(metrics.getMinBytesPerResponse(), is(responseBytes[0]));
        assertThat(metrics.getMaxBytesPerResponse(), is(responseBytes[0]));
        assertThat(metrics.getMeanBytesPerResponse(), is(responseBytes[0]));

        assertThat(metrics.getMinElapsedMilliseconds(), is(3000L));
        assertThat(metrics.getMaxElapsedMilliseconds(), is(3000L));
        assertThat(metrics.getMeanElapsedMilliseconds(), is(3000L));

        long sendThroughput1 = (requestBytes[0] * Byte.SIZE) / 1L;
        assertThat(metrics.getMinSendThroughputBitsPerSecond(), is(sendThroughput1));
        assertThat(metrics.getMaxSendThroughputBitsPerSecond(), is(sendThroughput1));
        assertThat(metrics.getMeanSendThroughputBitsPerSecond(), is(sendThroughput1));

        long receiveThroughput1 = (responseBytes[0] * Byte.SIZE) / 3L;
        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(receiveThroughput1));
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(receiveThroughput1));
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(receiveThroughput1));

        metrics.incrementRequestCount(5123L);
        assertThat(metrics.getRequestCount(), is(2L));

        metrics.incrementResponseCount(7123L);
        assertThat(metrics.getResponseCount(), is(2L));

        assertThat(metrics.getMinBytesPerRequest(), is(requestBytes[0]));
        assertThat(metrics.getMaxBytesPerRequest(), is(requestBytes[1] - requestBytes[0]));
        assertThat(metrics.getMeanBytesPerRequest(), is(requestBytes[1] / 2));

        assertThat(metrics.getMinBytesPerResponse(), is(responseBytes[0]));
        assertThat(metrics.getMaxBytesPerResponse(), is(responseBytes[1] - responseBytes[0]));
        assertThat(metrics.getMeanBytesPerResponse(), is(responseBytes[1] / 2));

        assertThat(metrics.getMinElapsedMilliseconds(), is(3000L));
        assertThat(metrics.getMaxElapsedMilliseconds(), is(7123L));
        assertThat(metrics.getMeanElapsedMilliseconds(), is((3000L + 7123L) / 2));

        long sendThroughput2 = ((requestBytes[1] - requestBytes[0]) * Byte.SIZE * 1000L) / 5123L;
        assertThat(metrics.getMinSendThroughputBitsPerSecond(), is(sendThroughput2));
        assertThat(metrics.getMaxSendThroughputBitsPerSecond(), is(sendThroughput1));
        assertThat(metrics.getMeanSendThroughputBitsPerSecond(), is(Math.round((sendThroughput1 + sendThroughput2) / 2.0d)));

        long receiveThroughput2 = ((responseBytes[1] - responseBytes[0]) * Byte.SIZE * 1000L) / 7123L;
        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(Math.min(receiveThroughput1, receiveThroughput2)));
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(Math.max(receiveThroughput1, receiveThroughput2)));
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(Math.round((receiveThroughput1 + receiveThroughput2) / 2.0d)));

        verify(mockInMetrics, times(2)).getBytesTransferred();
        verify(mockOutMetrics, times(2)).getBytesTransferred();
    }

    @Test
    public void testReset() throws Exception {
        long requestBytes = 123L;
        long responseBytes = 45678L;

        when(mockOutMetrics.getBytesTransferred()).thenReturn(requestBytes);
        when(mockInMetrics.getBytesTransferred()).thenReturn(responseBytes);

        metrics.incrementRequestCount(TimeUnit.SECONDS.toMillis(1));
        assertThat(metrics.getRequestCount(), is(1L));

        metrics.incrementResponseCount(TimeUnit.SECONDS.toMillis(3));
        assertThat(metrics.getResponseCount(), is(1L));

        assertThat(metrics.getMinBytesPerRequest(), is(requestBytes));
        assertThat(metrics.getMaxBytesPerRequest(), is(requestBytes));
        assertThat(metrics.getMeanBytesPerRequest(), is(requestBytes));

        assertThat(metrics.getMinBytesPerResponse(), is(responseBytes));
        assertThat(metrics.getMaxBytesPerResponse(), is(responseBytes));
        assertThat(metrics.getMeanBytesPerResponse(), is(responseBytes));

        assertThat(metrics.getMinElapsedMilliseconds(), is(3000L));
        assertThat(metrics.getMaxElapsedMilliseconds(), is(3000L));
        assertThat(metrics.getMeanElapsedMilliseconds(), is(3000L));

        long sendThroughput = (requestBytes * Byte.SIZE) / 1L;
        assertThat(metrics.getMinSendThroughputBitsPerSecond(), is(sendThroughput));
        assertThat(metrics.getMaxSendThroughputBitsPerSecond(), is(sendThroughput));
        assertThat(metrics.getMeanSendThroughputBitsPerSecond(), is(sendThroughput));

        long receiveThroughput = (responseBytes * Byte.SIZE) / 3L;
        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(receiveThroughput));
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(receiveThroughput));
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(receiveThroughput));

        metrics.reset();

        assertThat(metrics.getRequestCount(), is(0L));
        assertThat(metrics.getMinBytesPerRequest(), is(0L));
        assertThat(metrics.getMaxBytesPerRequest(), is(0L));
        assertThat(metrics.getMeanBytesPerRequest(), is(0L));

        assertThat(metrics.getResponseCount(), is(0L));
        assertThat(metrics.getMinBytesPerResponse(), is(0L));
        assertThat(metrics.getMaxBytesPerResponse(), is(0L));
        assertThat(metrics.getMeanBytesPerResponse(), is(0L));

        assertThat(metrics.getMinElapsedMilliseconds(), is(0L));
        assertThat(metrics.getMaxElapsedMilliseconds(), is(0L));
        assertThat(metrics.getMeanElapsedMilliseconds(), is(0L));

        assertThat(metrics.getMinSendThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMaxSendThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMeanSendThroughputBitsPerSecond(), is(0L));

        assertThat(metrics.getMinReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMaxReceiveThroughputBitsPerSecond(), is(0L));
        assertThat(metrics.getMeanReceiveThroughputBitsPerSecond(), is(0L));
    }
}
