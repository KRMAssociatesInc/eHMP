package gov.va.cpe.web;

import gov.va.hmp.Bootstrap;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;

/**
 * RequestMatcher that checks to see if application setup as run yet or not.
 * If it has not, spring security will redirect to the configured entry point in order to begin the setup process.
 */
public class SetupRequestMatcher implements RequestMatcher, EnvironmentAware {

    private Environment environment;

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public boolean matches(HttpServletRequest request) {
        return !Bootstrap.isSetupComplete(environment);
    }

}
