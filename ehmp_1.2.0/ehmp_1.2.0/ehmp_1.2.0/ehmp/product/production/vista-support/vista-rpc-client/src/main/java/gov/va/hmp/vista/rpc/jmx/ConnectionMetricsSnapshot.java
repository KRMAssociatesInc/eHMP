package gov.va.hmp.vista.rpc.jmx;

import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;

import java.beans.ConstructorProperties;

/**
 * Provides a JMX Management view of a set of ConnectionMetrics.
 *
 * @see ConnectionMetrics
 */
public class ConnectionMetricsSnapshot {

    private long requestCount;
    private long responseCount;
    private long sentBytesCount;
    private long receivedBytesCount;
    private long minBytesPerRequest;
    private long maxBytesPerRequest;
    private long meanBytesPerRequest;
    private long minBytesPerResponse;
    private long maxBytesPerResponse;
    private long meanBytesPerResponse;
    private long minElapsedMilliseconds;
    private long maxElapsedMilliseconds;
    private long meanElapsedMilliseconds;
    private long minThroughputBitsPerSecond;
    private long maxThroughputBitsPerSecond;
    private long meanThroughputBitsPerSecond;

    @ConstructorProperties({
            "requestCount",
            "responseCount",
            "sentBytesCount",
            "receivedBytesCount",
            "minBytesPerRequest",
            "maxBytesPerRequest",
            "meanBytesPerRequest",
            "minBytesPerResponse",
            "maxBytesPerResponse",
            "meanBytesPerResponse",
            "minElapsedMilliseconds",
            "maxElapsedMilliseconds",
            "meanElapsedMilliseconds",
            "minThroughputBitsPerSecond",
            "maxThroughputBitsPerSecond",
            "meanThroughputBitsPerSecond"})
    public ConnectionMetricsSnapshot(long requestCount,
                                     long responseCount,
                                     long sentBytesCount,
                                     long receivedBytesCount,
                                     long minBytesPerRequest,
                                     long maxBytesPerRequest,
                                     long meanBytesPerRequest,
                                     long minBytesPerResponse,
                                     long maxBytesPerResponse,
                                     long meanBytesPerResponse,
                                     long minElapsedMilliseconds,
                                     long maxElapsedMilliseconds,
                                     long meanElapsedMilliseconds,
                                     long minThroughputBitsPerSecond,
                                     long maxThroughputBitsPerSecond,
                                     long meanThroughputBitsPerSecond) {
        this.requestCount = requestCount;
        this.responseCount = responseCount;
        this.sentBytesCount = sentBytesCount;
        this.receivedBytesCount = receivedBytesCount;
        this.minBytesPerRequest = minBytesPerRequest;
        this.maxBytesPerRequest = maxBytesPerRequest;
        this.meanBytesPerRequest = meanBytesPerRequest;
        this.minBytesPerResponse = minBytesPerResponse;
        this.maxBytesPerResponse = maxBytesPerResponse;
        this.meanBytesPerResponse = meanBytesPerResponse;
        this.minElapsedMilliseconds = minElapsedMilliseconds;
        this.maxElapsedMilliseconds = maxElapsedMilliseconds;
        this.meanElapsedMilliseconds = meanElapsedMilliseconds;
        this.minThroughputBitsPerSecond = minThroughputBitsPerSecond;
        this.maxThroughputBitsPerSecond = maxThroughputBitsPerSecond;
        this.meanThroughputBitsPerSecond = meanThroughputBitsPerSecond;
    }

    public ConnectionMetricsSnapshot(ConnectionMetrics metrics) {
        this.requestCount = metrics.getRequestCount();
        this.responseCount = metrics.getResponseCount();
        this.sentBytesCount = metrics.getSentBytesCount();
        this.receivedBytesCount = metrics.getReceivedBytesCount();
        this.minBytesPerRequest = metrics.getMinBytesPerRequest();
        this.maxBytesPerRequest = metrics.getMaxBytesPerRequest();
        this.meanBytesPerRequest = metrics.getMeanBytesPerRequest();
        this.minBytesPerResponse = metrics.getMinBytesPerResponse();
        this.maxBytesPerResponse = metrics.getMaxBytesPerResponse();
        this.meanBytesPerResponse = metrics.getMeanBytesPerResponse();
        this.minElapsedMilliseconds = metrics.getMinElapsedMilliseconds();
        this.maxElapsedMilliseconds = metrics.getMaxElapsedMilliseconds();
        this.meanElapsedMilliseconds = metrics.getMeanElapsedMilliseconds();
        this.minThroughputBitsPerSecond = metrics.getMinReceiveThroughputBitsPerSecond();
        this.maxThroughputBitsPerSecond = metrics.getMaxReceiveThroughputBitsPerSecond();
        this.meanThroughputBitsPerSecond = metrics.getMeanReceiveThroughputBitsPerSecond();
    }

    public long getRequestCount() {
        return requestCount;
    }

    public long getResponseCount() {
        return responseCount;
    }

    public long getSentBytesCount() {
        return sentBytesCount;
    }

    public long getReceivedBytesCount() {
        return receivedBytesCount;
    }

    public long getMinBytesPerRequest() {
        return minBytesPerRequest;
    }

    public long getMaxBytesPerRequest() {
        return maxBytesPerRequest;
    }

    public long getMeanBytesPerRequest() {
        return meanBytesPerRequest;
    }

    public long getMinBytesPerResponse() {
        return minBytesPerResponse;
    }

    public long getMaxBytesPerResponse() {
        return maxBytesPerResponse;
    }

    public long getMeanBytesPerResponse() {
        return meanBytesPerResponse;
    }

    public long getMinElapsedMilliseconds() {
        return minElapsedMilliseconds;
    }

    public long getMaxElapsedMilliseconds() {
        return maxElapsedMilliseconds;
    }

    public long getMeanElapsedMilliseconds() {
        return meanElapsedMilliseconds;
    }

    public long getMinThroughputBitsPerSecond() {
        return minThroughputBitsPerSecond;
    }

    public long getMaxThroughputBitsPerSecond() {
        return maxThroughputBitsPerSecond;
    }

    public long getMeanThroughputBitsPerSecond() {
        return meanThroughputBitsPerSecond;
    }
}
