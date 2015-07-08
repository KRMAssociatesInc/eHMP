package gov.va.hmp.metrics.health;

import com.codahale.metrics.health.HealthCheckRegistry;

import java.util.concurrent.atomic.AtomicReference;

public class HealthCheckRegistryHolder {
    private static AtomicReference<HealthCheckRegistry> healthCheckRegistry = new AtomicReference<>(new HealthCheckRegistry());

    public static HealthCheckRegistry getHealthCheckRegistry() {
        return healthCheckRegistry.get();
    }
}
