package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;
import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;

public class BrokerConnectionMetrics implements ConnectionMetrics {

    private static final long MILLIS_PER_SECOND = 1000L;

    private long requestCount = 0L;
    private long responseCount = 0L;

    private final TransportMetrics inTransportMetrics;
    private final TransportMetrics outTransportMetrics;

    private long sentBytesCountStart = 0L;
    private long receivedBytesCountStart = 0L;

    private long minBytesPerRequest = Long.MAX_VALUE;
    private long meanBytesPerRequest = 0L;
    private long maxBytesPerRequest = 0L;

    private long minBytesPerResponse = Long.MAX_VALUE;
    private long meanBytesPerResponse = 0L;
    private long maxBytesPerResponse = 0L;

    private long minElapsedMillis = Long.MAX_VALUE;
    private long meanElapsedMillis = 0L;
    private long maxElapsedMillis = 0L;

    private long minSendThroughputBitsPerSecond = Long.MAX_VALUE;
    private long meanSendThroughputBitsPerSecond = 0L;
    private long maxSendThroughputBitsPerSecond = 0L;

    private long minReceiveThroughputBitsPerSecond = Long.MAX_VALUE;
    private long meanReceiveThroughputBitsPerSecond = 0L;
    private long maxReceiveThroughputBitsPerSecond = 0L;

    public BrokerConnectionMetrics(TransportMetrics inTransportMetrics, TransportMetrics outTransportMetrics) {
        this.inTransportMetrics = inTransportMetrics;
        this.outTransportMetrics = outTransportMetrics;
    }

    @Override
    public long getRequestCount() {
        return requestCount;
    }

    @Override
    public long getResponseCount() {
        return responseCount;
    }

    @Override
    public long getSentBytesCount() {
        if (outTransportMetrics != null) {
            return outTransportMetrics.getBytesTransferred();
        } else {
            return -1;
        }
    }

    @Override
    public long getReceivedBytesCount() {
        if (inTransportMetrics != null) {
            return inTransportMetrics.getBytesTransferred();
        } else {
            return -1;
        }
    }

    @Override
    public long getMinBytesPerRequest() {
        return minBytesPerRequest == Long.MAX_VALUE ? 0L : minBytesPerRequest;
    }

    @Override
    public long getMaxBytesPerRequest() {
        return maxBytesPerRequest;
    }

    @Override
    public long getMeanBytesPerRequest() {
        return meanBytesPerRequest;
    }

    @Override
    public long getMinBytesPerResponse() {
        return minBytesPerResponse == Long.MAX_VALUE ? 0L : minBytesPerResponse;
    }

    @Override
    public long getMaxBytesPerResponse() {
        return maxBytesPerResponse;
    }

    @Override
    public long getMeanBytesPerResponse() {
        return meanBytesPerResponse;
    }

    @Override
    public long getMinElapsedMilliseconds() {
        return minElapsedMillis == Long.MAX_VALUE ? 0L : minElapsedMillis;
    }

    @Override
    public long getMaxElapsedMilliseconds() {
        return maxElapsedMillis;
    }

    @Override
    public long getMeanElapsedMilliseconds() {
        return meanElapsedMillis;
    }

    @Override
    public long getMinSendThroughputBitsPerSecond() {
        return minSendThroughputBitsPerSecond == Long.MAX_VALUE ? 0L : minSendThroughputBitsPerSecond;
    }

    @Override
    public long getMaxSendThroughputBitsPerSecond() {
        return maxSendThroughputBitsPerSecond;
    }

    @Override
    public long getMeanSendThroughputBitsPerSecond() {
        return meanSendThroughputBitsPerSecond;
    }

    @Override
    public long getMinReceiveThroughputBitsPerSecond() {
        return minReceiveThroughputBitsPerSecond == Long.MAX_VALUE ? 0L : minReceiveThroughputBitsPerSecond;
    }

    @Override
    public long getMaxReceiveThroughputBitsPerSecond() {
        return maxReceiveThroughputBitsPerSecond;
    }

    @Override
    public long getMeanReceiveThroughputBitsPerSecond() {
        return meanReceiveThroughputBitsPerSecond;
    }

    public void incrementRequestCount(long sendMilliseconds) {
        this.requestCount++;

        long sentBytesCount = getSentBytesCount();

        long requestBytesSent = sentBytesCount - this.sentBytesCountStart;
        minBytesPerRequest = Math.min(minBytesPerRequest, requestBytesSent);
        maxBytesPerRequest = Math.max(maxBytesPerRequest, requestBytesSent);
        meanBytesPerRequest = sentBytesCount / getRequestCount();

        long sendBitsPerSecond = sendMilliseconds == 0 ? -1 : (requestBytesSent * Byte.SIZE * MILLIS_PER_SECOND) / sendMilliseconds;
        if (sendBitsPerSecond != -1) {
            minSendThroughputBitsPerSecond = Math.min(minSendThroughputBitsPerSecond, sendBitsPerSecond);
            maxSendThroughputBitsPerSecond = Math.max(maxSendThroughputBitsPerSecond, sendBitsPerSecond);
            meanSendThroughputBitsPerSecond = calculateCummulativeMovingMean(meanSendThroughputBitsPerSecond, sendBitsPerSecond, getRequestCount());
        }

        this.sentBytesCountStart = sentBytesCount;
    }

    public void incrementResponseCount(long waitAndReceiveMilliseconds) {
        this.responseCount++;

        long receivedBytesCount = getReceivedBytesCount();
        long responseBytesReceived = receivedBytesCount - this.receivedBytesCountStart;
        minBytesPerResponse = Math.min(minBytesPerResponse, responseBytesReceived);
        maxBytesPerResponse = Math.max(maxBytesPerResponse, responseBytesReceived);
        meanBytesPerResponse = receivedBytesCount / getResponseCount();

        minElapsedMillis = Math.min(minElapsedMillis, waitAndReceiveMilliseconds);
        maxElapsedMillis = Math.max(maxElapsedMillis, waitAndReceiveMilliseconds);

        long receiveBitsPerSecond = waitAndReceiveMilliseconds == 0 ? -1 : (responseBytesReceived * Byte.SIZE * MILLIS_PER_SECOND) / waitAndReceiveMilliseconds;
        if (receiveBitsPerSecond != -1) {
            minReceiveThroughputBitsPerSecond = Math.min(minReceiveThroughputBitsPerSecond, receiveBitsPerSecond);
            maxReceiveThroughputBitsPerSecond = Math.max(maxReceiveThroughputBitsPerSecond, receiveBitsPerSecond);
            meanReceiveThroughputBitsPerSecond = calculateCummulativeMovingMean(meanReceiveThroughputBitsPerSecond, receiveBitsPerSecond, getResponseCount());
        }

        this.meanElapsedMillis = calculateCummulativeMovingMean(meanElapsedMillis, waitAndReceiveMilliseconds, getResponseCount());
        this.receivedBytesCountStart = receivedBytesCount;
    }

    private long calculateCummulativeMovingMean(long meanValue, long newValue, long total) {
        return meanValue + ((newValue - meanValue) / total);
    }

    @Override
    public void reset() {
        this.requestCount = 0L;
        this.responseCount = 0L;

        this.minBytesPerRequest = Long.MAX_VALUE;
        this.maxBytesPerRequest = 0L;
        this.meanBytesPerRequest = 0L;

        this.minBytesPerResponse = Long.MAX_VALUE;
        this.maxBytesPerResponse = 0L;
        this.meanBytesPerResponse = 0L;

        this.minElapsedMillis = Long.MAX_VALUE;
        this.maxElapsedMillis = 0L;
        this.meanElapsedMillis = 0L;

        this.minSendThroughputBitsPerSecond = Long.MAX_VALUE;
        this.meanSendThroughputBitsPerSecond = 0L;
        this.maxSendThroughputBitsPerSecond = 0L;

        this.minReceiveThroughputBitsPerSecond = Long.MAX_VALUE;
        this.meanReceiveThroughputBitsPerSecond = 0L;
        this.maxReceiveThroughputBitsPerSecond = 0L;

        if (inTransportMetrics != null) {
            inTransportMetrics.reset();
        }
        if (outTransportMetrics != null) {
            outTransportMetrics.reset();
        }
    }
}
