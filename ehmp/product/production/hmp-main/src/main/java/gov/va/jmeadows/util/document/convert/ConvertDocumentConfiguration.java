package gov.va.jmeadows.util.document.convert;

import gov.va.hmp.HmpProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Convert document configuration.
 */
@Component("ConvertDocumentConfiguration")
public class ConvertDocumentConfiguration {

    private String officeHome;
    private int maxThreads;
    private int timeoutMS;

    /**
     * Constructs convert document configuration from Environment.
     */
    @Autowired
    public ConvertDocumentConfiguration(Environment environment) {
        this.officeHome = environment.getProperty(HmpProperties.DOC_CONVERT_OFFICE_HOME);
        this.maxThreads = Integer.parseInt(environment.getProperty(HmpProperties.DOC_CONVERT_MAX_THREADS));
        this.timeoutMS = Integer.parseInt(environment.getProperty(HmpProperties.DOC_CONVERT_TIMEOUT_MS));
    }

    public String getOfficeHome() {
        return officeHome;
    }

    public void setOfficeHome(String officeHome) {
        this.officeHome = officeHome;
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
