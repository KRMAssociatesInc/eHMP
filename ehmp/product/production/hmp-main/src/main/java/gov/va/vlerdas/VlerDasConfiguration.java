package gov.va.vlerdas;

import gov.va.hmp.HmpProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * VLER DAS Webservice Configuration
 */
@Component("VlerDasConfiguration")
public class VlerDasConfiguration {

    private String baseUrl;


    /**
     * Constructor
     * @param environment the spring environment
     */
    @Autowired
    public VlerDasConfiguration(Environment environment)
    {
        if (environment != null) {
            this.baseUrl = environment.getProperty(HmpProperties.VLER_DAS_BASE_URL);
        }
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}
