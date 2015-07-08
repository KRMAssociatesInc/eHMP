package gov.va.hmp.vista.rpc.jmx;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.pool.DefaultConnectionManager;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;

/**
 * Provides a JMX Management view of a DefaultConnectionManager.
 */
public class ConnectionManagerView implements ConnectionManagerViewMXBean {

    private DefaultConnectionManager connectionManager;
    private ConnectionMetricsView totalMetricsView;

    public ConnectionManagerView(DefaultConnectionManager connectionManager) {
        this.connectionManager = connectionManager;
        this.totalMetricsView = new ConnectionMetricsView(connectionManager.getTotals());
    }

    @Override
    public String getActiveHosts() {
        Set<RpcHost> activeHosts = connectionManager.getActiveHosts();
        Set<String> hostStrings = new HashSet<String>(activeHosts.size());
        for (RpcHost host : activeHosts) {
            hostStrings.add(host.toHostString());
        }
        return StringUtils.collectionToCommaDelimitedString(hostStrings);
    }

    @Override
    public int getNumActiveConnections() {
        return connectionManager.getNumActiveConnections();
    }

    @Override
    public int getNumIdleConnections() {
        return connectionManager.getNumIdleConnections();
    }

    @Override
    public void closeIdleConnections() {
        connectionManager.closeIdleConnections();
    }

    @Override
    public void closeExpiredConnections() {
        connectionManager.closeExpiredConnections();
    }
     @Override
    public ConnectionMetricsSnapshot getConnectionMetricsTotals() {
        return new ConnectionMetricsSnapshot(connectionManager.getTotals());
    }

    @Override
    public long getRpcRequestCount() {
        return totalMetricsView.getRpcRequestCount();
    }

    @Override
    public long getRpcResponseCount() {
        return totalMetricsView.getRpcResponseCount();
    }

    @Override
    public long getRpcDataSentBytes() {
        return totalMetricsView.getRpcDataSentBytes();
    }

    @Override
    public long getRpcDataReceivedBytes() {
        return totalMetricsView.getRpcDataReceivedBytes();
    }

    @Override
    public long getMinRpcRequestSizeBytes() {
        return totalMetricsView.getMinRpcRequestSizeBytes();
    }

    @Override
    public long getMaxRpcRequestSizeBytes() {
        return totalMetricsView.getMaxRpcRequestSizeBytes();
    }

    @Override
    public long getMeanRpcRequestSizeBytes() {
        return totalMetricsView.getMeanRpcRequestSizeBytes();
    }

    @Override
    public long getMinRpcResponseSizeBytes() {
        return totalMetricsView.getMinRpcResponseSizeBytes();
    }

    @Override
    public long getMaxRpcResponseSizeBytes() {
        return totalMetricsView.getMaxRpcResponseSizeBytes();
    }

    @Override
    public long getMeanRpcResponseSizeBytes() {
        return totalMetricsView.getMeanRpcResponseSizeBytes();
    }

    @Override
    public long getMinRpcElapsedTimeMilliseconds() {
        return totalMetricsView.getMinRpcElapsedTimeMilliseconds();
    }

    @Override
    public long getMaxRpcElapsedTimeMilliseconds() {
        return totalMetricsView.getMaxRpcElapsedTimeMilliseconds();
    }

    @Override
    public long getMeanRpcElapsedTimeMilliseconds() {
        return totalMetricsView.getMeanRpcElapsedTimeMilliseconds();
    }

    @Override
    public long getMinSendThroughputBitsPerSecond() {
        return totalMetricsView.getMinSendThroughputBitsPerSecond();
    }

    @Override
    public long getMaxSendThroughputBitsPerSecond() {
        return totalMetricsView.getMaxSendThroughputBitsPerSecond();
    }

    @Override
    public long getMeanSendThroughputBitsPerSecond() {
        return totalMetricsView.getMeanSendThroughputBitsPerSecond();
    }

    @Override
    public long getMinReceiveThroughputBitsPerSecond() {
        return totalMetricsView.getMinReceiveThroughputBitsPerSecond();
    }

    @Override
    public long getMaxReceiveThroughputBitsPerSecond() {
        return totalMetricsView.getMaxReceiveThroughputBitsPerSecond();
    }

    @Override
    public long getMeanReceiveThroughputBitsPerSecond() {
        return totalMetricsView.getMeanReceiveThroughputBitsPerSecond();
    }

    @Override
    public String getRpcDataSent() {
        return totalMetricsView.getRpcDataSent();
    }

    @Override
    public String getRpcDataReceived() {
        return totalMetricsView.getRpcDataReceived();
    }

    @Override
    public String getMinRpcRequestSize() {
        return totalMetricsView.getMinRpcRequestSize();
    }

    @Override
    public String getMaxRpcRequestSize() {
        return totalMetricsView.getMaxRpcRequestSize();
    }

    @Override
    public String getMeanRpcRequestSize() {
        return totalMetricsView.getMeanRpcRequestSize();
    }

    @Override
    public String getMinRpcResponseSize() {
        return totalMetricsView.getMinRpcResponseSize();
    }

    @Override
    public String getMaxRpcResponseSize() {
        return totalMetricsView.getMaxRpcResponseSize();
    }

    @Override
    public String getMeanRpcResponseSize() {
        return totalMetricsView.getMeanRpcResponseSize();
    }

    @Override
    public String getMinRpcElapsedTime() {
        return totalMetricsView.getMinRpcElapsedTime();
    }

    @Override
    public String getMaxRpcElapsedTime() {
        return totalMetricsView.getMaxRpcElapsedTime();
    }

    @Override
    public String getMeanRpcElapsedTime() {
        return totalMetricsView.getMeanRpcElapsedTime();
    }

    @Override
    public String getMeanSendThroughput() {
        return totalMetricsView.getMeanSendThroughput();
    }

    @Override
    public String getMinSendThroughput() {
        return totalMetricsView.getMinSendThroughput();
    }

    @Override
    public String getMaxSendThroughput() {
        return totalMetricsView.getMaxSendThroughput();
    }

    @Override
    public String getMinReceiveThroughput() {
        return totalMetricsView.getMinReceiveThroughput();
    }

    @Override
    public String getMaxReceiveThroughput() {
        return totalMetricsView.getMaxReceiveThroughput();
    }

    @Override
    public String getMeanReceiveThroughput() {
        return totalMetricsView.getMeanReceiveThroughput();
    }

    @Override
    public void displaySIUnits() {
        totalMetricsView.displaySIUnits();
    }

    @Override
    public void displayBinaryUnits() {
        totalMetricsView.displayBinaryUnits();
    }

    @Override
    public void reset() {
        totalMetricsView.reset();
    }
}
