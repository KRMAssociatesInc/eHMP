package gov.va.hmp.metrics;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.MetricSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.BeanPostProcessor;

public class MetricSetBeanPostProcessor implements BeanPostProcessor {

    private static final Logger LOG = LoggerFactory.getLogger(MetricSetBeanPostProcessor.class);

    private final MetricRegistry metricRegistry;

    public MetricSetBeanPostProcessor(final MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        if (bean instanceof MetricSet) {
            metricRegistry.registerAll((MetricSet) bean);

            LOG.debug("Registering MetricSet bean {}", beanName);
        }

        return bean;
    }
}
