package gov.va.hmp.metrics.health;

import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.util.Assert;

public class EnvironmentPropertyUrlHealthCheck extends UrlAvailableHealthCheck implements EnvironmentAware {

    private String propertyKey;

    private Environment environment;

    public void setPropertyKey(String environmentPropertyKey) {
        this.propertyKey = environmentPropertyKey;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Assert.hasText(propertyKey, "[Assertion failed] - the 'propertyKey' property must have text; it must not be null, empty, or blank");

        setBaseUrl(this.environment.getProperty(propertyKey));

        super.afterPropertiesSet();
    }
}
