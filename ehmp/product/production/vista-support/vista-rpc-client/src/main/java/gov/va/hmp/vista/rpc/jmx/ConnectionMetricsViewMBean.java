package gov.va.hmp.vista.rpc.jmx;

public interface ConnectionMetricsViewMBean {
    long getRpcRequestCount();
    long getRpcResponseCount();

    long getRpcDataSentBytes();
    long getRpcDataReceivedBytes();

    long getMinRpcRequestSizeBytes();
    long getMaxRpcRequestSizeBytes();
    long getMeanRpcRequestSizeBytes();

    long getMinRpcResponseSizeBytes();
    long getMaxRpcResponseSizeBytes();
    long getMeanRpcResponseSizeBytes();

    long getMinRpcElapsedTimeMilliseconds();
    long getMaxRpcElapsedTimeMilliseconds();
    long getMeanRpcElapsedTimeMilliseconds();

    long getMinSendThroughputBitsPerSecond();
    long getMaxSendThroughputBitsPerSecond();
    long getMeanSendThroughputBitsPerSecond();

    long getMinReceiveThroughputBitsPerSecond();
    long getMaxReceiveThroughputBitsPerSecond();
    long getMeanReceiveThroughputBitsPerSecond();

    // human readable versions
    String getRpcDataSent();
    String getRpcDataReceived();

    String getMinRpcRequestSize();
    String getMaxRpcRequestSize();
    String getMeanRpcRequestSize();

    String getMinRpcResponseSize();
    String getMaxRpcResponseSize();
    String getMeanRpcResponseSize();

    String getMinRpcElapsedTime();
    String getMaxRpcElapsedTime();
    String getMeanRpcElapsedTime();

    String getMinSendThroughput();
    String getMaxSendThroughput();
    String getMeanSendThroughput();

    String getMinReceiveThroughput();
    String getMaxReceiveThroughput();
    String getMeanReceiveThroughput();

    void displaySIUnits();
    void displayBinaryUnits();
    void reset();
}
