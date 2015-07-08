package gov.va.hmp.vista.rpc.jmx;

import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;

public class ConnectionMetricsView implements ConnectionMetricsViewMBean {

    private ConnectionMetrics metrics;
    private boolean siUnits = true;

    public ConnectionMetricsView(ConnectionMetrics metrics) {
        this.metrics = metrics;
    }

    @Override
    public long getRpcRequestCount() {
        return metrics.getRequestCount();
    }

    @Override
    public long getRpcResponseCount() {
        return metrics.getResponseCount();
    }

    @Override
    public long getRpcDataSentBytes() {
        return metrics.getSentBytesCount();
    }

    @Override
    public long getRpcDataReceivedBytes() {
        return metrics.getReceivedBytesCount();
    }

    @Override
    public long getMinRpcRequestSizeBytes() {
        return metrics.getMinBytesPerRequest();
    }

    @Override
    public long getMaxRpcRequestSizeBytes() {
        return metrics.getMaxBytesPerRequest();
    }

    @Override
    public long getMeanRpcRequestSizeBytes() {
        return metrics.getMeanBytesPerRequest();
    }

    @Override
    public long getMinRpcResponseSizeBytes() {
        return metrics.getMinBytesPerResponse();
    }

    @Override
    public long getMaxRpcResponseSizeBytes() {
        return metrics.getMaxBytesPerResponse();
    }

    @Override
    public long getMeanRpcResponseSizeBytes() {
        return metrics.getMeanBytesPerResponse();
    }

    @Override
    public long getMinRpcElapsedTimeMilliseconds() {
        return metrics.getMinElapsedMilliseconds();
    }

    @Override
    public long getMaxRpcElapsedTimeMilliseconds() {
        return metrics.getMaxElapsedMilliseconds();
    }

    @Override
    public long getMeanRpcElapsedTimeMilliseconds() {
        return metrics.getMeanElapsedMilliseconds();
    }


    @Override
    public long getMinSendThroughputBitsPerSecond() {
        return metrics.getMinSendThroughputBitsPerSecond();
    }

    @Override
    public long getMaxSendThroughputBitsPerSecond() {
        return metrics.getMaxSendThroughputBitsPerSecond();
    }

    @Override
    public long getMeanSendThroughputBitsPerSecond() {
        return metrics.getMeanSendThroughputBitsPerSecond();
    }

    @Override
    public long getMinReceiveThroughputBitsPerSecond() {
        return metrics.getMinReceiveThroughputBitsPerSecond();
    }

    @Override
    public long getMaxReceiveThroughputBitsPerSecond() {
        return metrics.getMaxReceiveThroughputBitsPerSecond();
    }

    @Override
    public long getMeanReceiveThroughputBitsPerSecond() {
        return metrics.getMeanReceiveThroughputBitsPerSecond();
    }

    @Override
    public String getRpcDataSent() {
        return humanReadableByteCount(metrics.getSentBytesCount(), siUnits);
    }

    @Override
    public String getRpcDataReceived() {
        return humanReadableByteCount(metrics.getReceivedBytesCount(), siUnits);
    }

    @Override
    public String getMinRpcRequestSize() {
        return humanReadableByteCount(metrics.getMinBytesPerRequest(), siUnits);
    }

    @Override
    public String getMaxRpcRequestSize() {
        return humanReadableByteCount(metrics.getMaxBytesPerRequest(), siUnits);
    }

    @Override
    public String getMeanRpcRequestSize() {
        return humanReadableByteCount(metrics.getMeanBytesPerRequest(), siUnits);
    }

    @Override
    public String getMinRpcResponseSize() {
        return humanReadableByteCount(metrics.getMinBytesPerResponse(), siUnits);
    }

    @Override
    public String getMaxRpcResponseSize() {
        return humanReadableByteCount(metrics.getMaxBytesPerResponse(), siUnits);
    }

    @Override
    public String getMeanRpcResponseSize() {
        return humanReadableByteCount(metrics.getMeanBytesPerResponse(), siUnits);
    }

    @Override
    public String getMinRpcElapsedTime() {
        return humanReadableTime(metrics.getMinElapsedMilliseconds());
    }

    @Override
    public String getMaxRpcElapsedTime() {
        return humanReadableTime(metrics.getMaxElapsedMilliseconds());
    }

    @Override
    public String getMeanRpcElapsedTime() {
        return humanReadableTime(metrics.getMeanElapsedMilliseconds());
    }

    @Override
    public String getMinSendThroughput() {
        return humanReadableThroughput(metrics.getMinSendThroughputBitsPerSecond(), siUnits);
    }

    @Override
    public String getMaxSendThroughput() {
        return humanReadableThroughput(metrics.getMaxSendThroughputBitsPerSecond(), siUnits);
    }

    @Override
    public String getMeanSendThroughput() {
        return humanReadableThroughput(metrics.getMeanSendThroughputBitsPerSecond(), siUnits);
    }

    @Override
    public String getMinReceiveThroughput() {
        return humanReadableThroughput(metrics.getMinReceiveThroughputBitsPerSecond(), siUnits);
    }

    @Override
    public String getMaxReceiveThroughput() {
        return humanReadableThroughput(metrics.getMaxReceiveThroughputBitsPerSecond(), siUnits);
    }

    @Override
    public String getMeanReceiveThroughput() {
        return humanReadableThroughput(metrics.getMeanReceiveThroughputBitsPerSecond(), siUnits);
    }

    @Override
    public void reset() {
        metrics.reset();
    }

    @Override
    public void displaySIUnits() {
        siUnits = true;
    }

    @Override
    public void displayBinaryUnits() {
        siUnits = false;
    }

    /**
     * Returns a byte count in a human-readable format.
     * <p/>
     * Example output:
     * <blockquote><pre>
     *                              SI     BINARY
     *                   0:        0 B        0 B
     *                  27:       27 B       27 B
     *                 999:      999 B      999 B
     *                1000:     1.0 kB     1000 B
     *                1023:     1.0 kB     1023 B
     *                1024:     1.0 kB    1.0 KiB
     *                1728:     1.7 kB    1.7 KiB
     *              110592:   110.6 kB  108.0 KiB
     *             7077888:     7.1 MB    6.8 MiB
     *           452984832:   453.0 MB  432.0 MiB
     *         28991029248:    29.0 GB   27.0 GiB
     *       1855425871872:     1.9 TB    1.7 TiB
     * 9223372036854775807:     9.2 EB    8.0 EiB   (Long.MAX_VALUE)
     * </pre></blockquote>
     *
     * @param bytes the byte count to put into a human-readable format.
     * @param si    <code>true</code> to format as SI units, <code>false</code> to format as binary
     * @return human-readable form of byte count.
     */
    public static String humanReadableByteCount(long bytes, boolean si) {
        return humanReadbleCount(bytes, si, "B");
    }

    public static String humanReadableThroughput(long throughputBitsPerSecond, boolean si) {
        return humanReadbleCount(throughputBitsPerSecond, si, "bps");
    }

    private static String humanReadbleCount(long things, boolean si, String unitSuffix) {
        int unitPrefix = si ? 1000 : 1024;
        if (things < unitPrefix) return things + " " + unitSuffix;
        int exp = (int) (Math.log(things) / Math.log(unitPrefix));
        String pre = (si ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (si ? "" : "i");
        return String.format("%.1f %s" + unitSuffix, things / Math.pow(unitPrefix, exp), pre);
    }

    public static String humanReadableTime(long milliseconds) {
        if (milliseconds >= 60000)
            return String.format("%.1f min", ((double) milliseconds) / 60000.0d);
        if (milliseconds >= 1000)
            return String.format("%.1f s", ((double) milliseconds) / 1000.0d);
        return milliseconds + " ms";
    } 
}
