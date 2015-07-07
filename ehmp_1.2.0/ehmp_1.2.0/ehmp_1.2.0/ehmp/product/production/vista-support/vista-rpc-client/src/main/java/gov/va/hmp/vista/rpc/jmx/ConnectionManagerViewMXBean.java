package gov.va.hmp.vista.rpc.jmx;

import javax.management.openmbean.CompositeData;

public interface ConnectionManagerViewMXBean extends ConnectionMetricsViewMBean {
    String getActiveHosts();

    int getNumActiveConnections();

    int getNumIdleConnections();

    void closeIdleConnections();

    void closeExpiredConnections();

    ConnectionMetricsSnapshot getConnectionMetricsTotals();
}
