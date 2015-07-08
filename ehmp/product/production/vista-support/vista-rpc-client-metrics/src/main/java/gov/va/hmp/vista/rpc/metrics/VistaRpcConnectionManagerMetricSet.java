package gov.va.hmp.vista.rpc.metrics;

import com.codahale.metrics.Gauge;
import com.codahale.metrics.Metric;
import com.codahale.metrics.MetricSet;
import gov.va.hmp.vista.rpc.pool.ConnectionManager;
import gov.va.hmp.vista.rpc.pool.DefaultConnectionManager;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static com.codahale.metrics.MetricRegistry.name;

/**
 * Set of metrics that expose existing connection stats as Gauges.
 *
 * NOTE: we could probably implement many of these stats as bona fide {@link com.codahale.metrics.Metric}s (Meters and
 * Timers) and benefit from the histogram, resevoirs work already in the metrics lib.
 */
public class VistaRpcConnectionManagerMetricSet implements MetricSet {

    private DefaultConnectionManager connectionManager;
    private String metricName = "";

    public VistaRpcConnectionManagerMetricSet(DefaultConnectionManager connectionManager, String metricName) {
        this.connectionManager = connectionManager;
        this.metricName = metricName;
    }

    @Override
    public Map<String, Metric> getMetrics() {
        final Map<String, Metric> gauges = new HashMap<String, Metric>();

        gauges.put(name(ConnectionManager.class, metricName, "leased-connections"), new Gauge<Integer>() {
            @Override
            public Integer getValue() {
                return connectionManager.getNumActiveConnections();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "available-connections"), new Gauge<Integer>() {
            @Override
            public Integer getValue() {
                return connectionManager.getNumIdleConnections();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "max-connections"), new Gauge<Integer>() {
            @Override
            public Integer getValue() {
                return connectionManager.getMaxActive();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "requests"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getRequestCount();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "responses"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getResponseCount();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "bytes-sent"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getSentBytesCount();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "bytes-received"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getReceivedBytesCount();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "min-bytes-per-request"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMinBytesPerRequest();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "mean-bytes-per-request"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMeanBytesPerRequest();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "max-bytes-per-request"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMaxBytesPerRequest();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "min-bytes-per-response"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMinBytesPerResponse();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "mean-bytes-per-response"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMeanBytesPerResponse();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "max-bytes-per-response"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMaxBytesPerResponse();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "min-throughput-send-bps"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMinSendThroughputBitsPerSecond();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "mean-throughput-send-bps"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMeanSendThroughputBitsPerSecond();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "max-throughput-send-bps"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMaxSendThroughputBitsPerSecond();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "min-throughput-receive-bps"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMinReceiveThroughputBitsPerSecond();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "mean-throughput-receive-bps"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMeanReceiveThroughputBitsPerSecond();
            }
        });
        gauges.put(name(ConnectionManager.class, metricName, "max-throughput-receive-bps"), new Gauge<Long>() {
            @Override
            public Long getValue() {
                return connectionManager.getTotals().getMaxReceiveThroughputBitsPerSecond();
            }
        });

        return Collections.unmodifiableMap(gauges);
    }
}
