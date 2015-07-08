package gov.va.hmp.web.velocity.tools;

import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;

/**
 * Velocity 'Tool' to expose Spring {@link Environment} to velocity templates.
 */
public class SpringEnvironmentTool implements EnvironmentAware {

    private Environment environment;

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public String[] getActiveProfiles() {
        return environment.getActiveProfiles();
    }

    public String[] getDefaultProfiles() {
        return environment.getDefaultProfiles();
    }

    public boolean acceptsProfiles(String... profiles) {
        return environment.acceptsProfiles(profiles);
    }

    public boolean containsProperty(String key) {
        return environment.containsProperty(key);
    }

    public String getProperty(String key) {
        return environment.getProperty(key);
    }

    public String getProperty(String key, String defaultValue) {
        return environment.getProperty(key, defaultValue);
    }

    public <T> T getProperty(String key, Class<T> targetType) {
        return environment.getProperty(key, targetType);
    }

    public <T> T getProperty(String key, Class<T> targetType, T defaultValue) {
        return environment.getProperty(key, targetType, defaultValue);
    }

    public <T> Class<T> getPropertyAsClass(String key, Class<T> targetType) {
        return environment.getPropertyAsClass(key, targetType);
    }

    public String getRequiredProperty(String key) throws IllegalStateException {
        return environment.getRequiredProperty(key);
    }

    public <T> T getRequiredProperty(String key, Class<T> targetType) throws IllegalStateException {
        return environment.getRequiredProperty(key, targetType);
    }

    public String resolvePlaceholders(String text) {
        return environment.resolvePlaceholders(text);
    }

    public String resolveRequiredPlaceholders(String text) throws IllegalArgumentException {
        return environment.resolveRequiredPlaceholders(text);
    }
}
