package gov.va.hmp.vista.rpc.conn;

/**
 * The point of access to the statistics of an {@link Connection}.
 */
public interface ConnectionMetrics {
     /**
     * Returns the number of requests transferred over the connection,
     * 0 if not available.
     */
    long getRequestCount();

    /**
     * Returns the number of responses transferred over the connection,
     * 0 if not available.
     */
    long getResponseCount();

    /**
     * Returns the number of bytes transferred over the connection,
     * -1 if not available.
     */
    long getSentBytesCount();

    /**
     * Returns the number of bytes transferred over the connection,
     * -1 if not available.
     */
    long getReceivedBytesCount();

    /**
     * Resets the counts
     */
    void reset();

    long getMinBytesPerRequest();

    long getMaxBytesPerRequest();

    long getMeanBytesPerRequest();

    long getMinBytesPerResponse();

    long getMaxBytesPerResponse();

    long getMeanBytesPerResponse();

    long getMinElapsedMilliseconds();

    long getMaxElapsedMilliseconds();

    long getMeanElapsedMilliseconds();

    long getMinSendThroughputBitsPerSecond();

    long getMaxSendThroughputBitsPerSecond();

    long getMeanSendThroughputBitsPerSecond();

    long getMinReceiveThroughputBitsPerSecond();

    long getMaxReceiveThroughputBitsPerSecond();

    long getMeanReceiveThroughputBitsPerSecond();
}
