package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class AggregateConnectionMetrics implements ConnectionMetrics {

    private Set<ConnectionMetrics> metricsSet = Collections.synchronizedSet(new HashSet<ConnectionMetrics>());

    public boolean add(ConnectionMetrics connectionMetrics) {
        return metricsSet.add(connectionMetrics);
    }

    public boolean remove(ConnectionMetrics connectionMetrics) {
        return metricsSet.remove(connectionMetrics);
    }

    public boolean addAll(Collection<? extends ConnectionMetrics> c) {
        return metricsSet.addAll(c);
    }

    public boolean removeAll(Collection<?> c) {
        return metricsSet.removeAll(c);
    }

    public boolean contains(ConnectionMetrics connectionMetrics) {
        return metricsSet.contains(connectionMetrics);
    }

    public boolean isEmpty() {
        return metricsSet.isEmpty();
    }

    public void clear() {
        metricsSet.clear();
    }

    @Override
    public long getRequestCount() {
        long requestCount = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            requestCount += metrics.getRequestCount();
        }
        return requestCount;
    }

    @Override
    public long getResponseCount() {
        long responseCount = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            responseCount += metrics.getResponseCount();
        }
        return responseCount;
    }

    @Override
    public long getSentBytesCount() {
        long bytesSent = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            bytesSent += metrics.getSentBytesCount();
        }
        return bytesSent;
    }

    @Override
    public long getReceivedBytesCount() {
        long bytesReceived = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            bytesReceived += metrics.getReceivedBytesCount();
        }
        return bytesReceived;
    }

    @Override
    public void reset() {
        for (ConnectionMetrics metrics : metricsSet) {
            metrics.reset();
        }
    }

    @Override
    public long getMinBytesPerRequest() {
        long minBytesPerRequest = Long.MAX_VALUE;
        for (ConnectionMetrics metrics : metricsSet) {
            minBytesPerRequest = Math.min(minBytesPerRequest, metrics.getMinBytesPerRequest());
        }
        return minBytesPerRequest == Long.MAX_VALUE ? 0 : minBytesPerRequest;
    }

    @Override
    public long getMaxBytesPerRequest() {
        long maxBytesPerRequest = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            maxBytesPerRequest = Math.max(maxBytesPerRequest, metrics.getMaxBytesPerRequest());
        }
        return maxBytesPerRequest;
    }

    @Override
    public long getMeanBytesPerRequest() {
        if (getRequestCount() == 0) return 0;
        long meanBytesPerRequest = getSentBytesCount() / getRequestCount();
        return meanBytesPerRequest;
    }

    @Override
    public long getMinBytesPerResponse() {
        long minBytesPerResponse = Long.MAX_VALUE;
        for (ConnectionMetrics metrics : metricsSet) {
            minBytesPerResponse = Math.min(minBytesPerResponse, metrics.getMinBytesPerResponse());
        }
        return minBytesPerResponse == Long.MAX_VALUE ? 0 : minBytesPerResponse;
    }

    @Override
    public long getMaxBytesPerResponse() {
        long maxBytesPerResponse = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            maxBytesPerResponse = Math.max(maxBytesPerResponse, metrics.getMaxBytesPerResponse());
        }
        return maxBytesPerResponse;
    }

    @Override
    public long getMeanBytesPerResponse() {
        if (getResponseCount() == 0) return 0;
        long meanBytesPerResponse = getReceivedBytesCount() / getResponseCount();
        return meanBytesPerResponse;
    }

    @Override
    public long getMinElapsedMilliseconds() {
        long minElapsedMilliseconds = Long.MAX_VALUE;
        for (ConnectionMetrics metrics : metricsSet) {
            minElapsedMilliseconds = Math.min(minElapsedMilliseconds, metrics.getMinElapsedMilliseconds());
        }
        return minElapsedMilliseconds == Long.MAX_VALUE ? 0 : minElapsedMilliseconds;
    }

    @Override
    public long getMaxElapsedMilliseconds() {
        long maxElapsedMilliseconds = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            maxElapsedMilliseconds = Math.max(maxElapsedMilliseconds, metrics.getMaxElapsedMilliseconds());
        }
        return maxElapsedMilliseconds;
    }

    @Override
    public long getMeanElapsedMilliseconds() {
        long meanElapsedMilliseconds = 0;
        if (metricsSet.isEmpty()) return meanElapsedMilliseconds;

        for (ConnectionMetrics metrics : metricsSet) {
            meanElapsedMilliseconds += (metrics.getMeanElapsedMilliseconds() * metrics.getResponseCount());
        }
        meanElapsedMilliseconds /= this.getResponseCount();
        return meanElapsedMilliseconds;
    }

    @Override
    public long getMinSendThroughputBitsPerSecond() {
        long minThroughput = Long.MAX_VALUE;
        for (ConnectionMetrics metrics : metricsSet) {
            minThroughput = Math.min(minThroughput, metrics.getMinSendThroughputBitsPerSecond());
        }
        return minThroughput == Long.MAX_VALUE ? 0 : minThroughput;
    }

    @Override
    public long getMaxSendThroughputBitsPerSecond() {
        long maxThroughput = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            maxThroughput = Math.max(maxThroughput, metrics.getMaxSendThroughputBitsPerSecond());
        }
        return maxThroughput;
    }

    @Override
    public long getMeanSendThroughputBitsPerSecond() {
        long meanThroughput = 0;
        if (metricsSet.isEmpty()) return meanThroughput;

        for (ConnectionMetrics metrics : metricsSet) {
            meanThroughput += metrics.getMeanSendThroughputBitsPerSecond();
        }
        meanThroughput /= metricsSet.size();
        return meanThroughput;
    }

    @Override
    public long getMinReceiveThroughputBitsPerSecond() {
        long minThroughput = Long.MAX_VALUE;
        for (ConnectionMetrics metrics : metricsSet) {
            minThroughput = Math.min(minThroughput, metrics.getMinReceiveThroughputBitsPerSecond());
        }
        return minThroughput == Long.MAX_VALUE ? 0 : minThroughput;
    }

    @Override
    public long getMaxReceiveThroughputBitsPerSecond() {
        long maxThroughput = 0;
        for (ConnectionMetrics metrics : metricsSet) {
            maxThroughput = Math.max(maxThroughput, metrics.getMaxReceiveThroughputBitsPerSecond());
        }
        return maxThroughput;
    }

    @Override
    public long getMeanReceiveThroughputBitsPerSecond() {
        long meanThroughput = 0;
        if (metricsSet.isEmpty()) return meanThroughput;

        for (ConnectionMetrics metrics : metricsSet) {
            meanThroughput += metrics.getMeanReceiveThroughputBitsPerSecond();
        }
        meanThroughput /= metricsSet.size();
        return meanThroughput;
    }
}
