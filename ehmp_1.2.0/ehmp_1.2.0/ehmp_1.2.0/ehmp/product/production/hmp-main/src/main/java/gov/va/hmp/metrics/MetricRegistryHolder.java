package gov.va.hmp.metrics;

import com.codahale.metrics.MetricRegistry;

import java.util.concurrent.atomic.AtomicReference;

public class MetricRegistryHolder {

    private static AtomicReference<MetricRegistry> metricRegistry = new AtomicReference<>(new MetricRegistry());

    public static MetricRegistry getMetricRegistry() {
        return metricRegistry.get();
    }
}
