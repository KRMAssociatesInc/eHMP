package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.vista.rpc.conn.ConnectionMetrics;
import gov.va.hmp.vista.rpc.jmx.ConnectionMetricsView;
import gov.va.hmp.vista.rpc.jmx.ManagementContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.management.MBeanServer;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import java.lang.management.ManagementFactory;
import java.util.*;

public class ConnectionMetricsManager implements ConnectionPoolListener {

    private static Logger LOGGER = LoggerFactory.getLogger(ConnectionMetricsManager.class);

    Map<RpcHost, AggregateConnectionMetrics> metricsByHost = Collections.synchronizedMap(new HashMap<RpcHost, AggregateConnectionMetrics>());
    AggregateConnectionMetrics metricsTotals = new AggregateConnectionMetrics();

    private ConnectionManager connectionManager;
    private ManagementContext jmxContext;

    public ConnectionMetricsManager(ConnectionManager connectionManager, ManagementContext jmxContext) {
        this.connectionManager = connectionManager;
        this.jmxContext = jmxContext;
    }

    public Set<RpcHost> getActiveHosts() {
        return new HashSet<RpcHost>(metricsByHost.keySet());
    }

    public ConnectionMetrics getMetrics(RpcHost host) {
        return metricsByHost.get(host);
    }

    public ConnectionMetrics getTotals() {
        return metricsTotals;
    }

    @Override
    public void connectionCreated(final ConnectionPoolEvent event) {
        Connection connection = event.getConnection();
        ConnectionMetrics metrics = connection.getMetrics();
        RpcHost host = connection.getHost();

        AggregateConnectionMetrics hostMetrics = getAggregateConnectionMetrics(host);
        hostMetrics.add(metrics);
        metricsTotals.add(metrics);
    }

    private AggregateConnectionMetrics getAggregateConnectionMetrics(RpcHost host) {
        AggregateConnectionMetrics hostMetrics = metricsByHost.get(host);
        if (hostMetrics == null) {
            hostMetrics = new AggregateConnectionMetrics();
            metricsByHost.put(host, hostMetrics);
            jmxContext.registerHostMetricsMBean(connectionManager, host, hostMetrics);
        }
        return hostMetrics;
    }

    @Override
    public void connectionClosed(final ConnectionPoolEvent event) {
        Connection connection = event.getConnection();
        ConnectionMetrics metrics = connection.getMetrics();
        RpcHost host = connection.getHost();

        AggregateConnectionMetrics hostMetrics = metricsByHost.get(host);
        if (hostMetrics != null) {
            hostMetrics.remove(metrics);
            if (hostMetrics.isEmpty()) {
                removeAggregateConnectionMetrics(host);
            }
        }
        metricsTotals.remove(metrics);
    }

    private void removeAggregateConnectionMetrics(RpcHost host) {
        AggregateConnectionMetrics hostMetrics = metricsByHost.remove(host);
        jmxContext.unregisterHostMetricsMBean(connectionManager, host, hostMetrics);
    }

    @Override
    public void connectionActivated(final ConnectionPoolEvent event) {
        // NOOP
    }

    @Override
    public void connectionPassivated(final ConnectionPoolEvent event) {
        // NOOP
    }

    public void shutdown() {
        for (Map.Entry<RpcHost, AggregateConnectionMetrics> entry: metricsByHost.entrySet()) {
            jmxContext.unregisterHostMetricsMBean(connectionManager, entry.getKey(), entry.getValue());
        }
        metricsByHost.clear();
        metricsTotals.clear();
    }
}
