package gov.va.jmeadows.util.document.retrieve;

import gov.va.hmp.HmpProperties;
import gov.va.jmeadows.AbstractJMeadowsConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Convert document configuration.
 */
@Component("RetrieveDocumentConfiguration")
public class RetrieveDocumentConfiguration extends AbstractJMeadowsConfiguration {

    private int maxThreads;
    private int timeoutMS;

    /**
     * Constructs convert document configuration from Environment.
     */
    @Autowired
    public RetrieveDocumentConfiguration(Environment environment) {
        super(environment);

        this.maxThreads = Integer.parseInt(environment.getProperty(HmpProperties.DOC_RETRIEVE_MAX_THREADS));
        this.timeoutMS = Integer.parseInt(environment.getProperty(HmpProperties.DOC_RETRIEVE_TIMEOUT_MS));
    }

    public int getMaxThreads() {
        return maxThreads;
    }

    public void setMaxThreads(int maxThreads) {
        this.maxThreads = maxThreads;
    }

    public int getTimeoutMS() {
        return timeoutMS;
    }

    public void setTimeoutMS(int timeoutMS) {
        this.timeoutMS = timeoutMS;
    }
}
