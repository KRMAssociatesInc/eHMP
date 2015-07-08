package gov.va.hmp.metrics.health;

import gov.va.hmp.HmpProperties;

public class JdsHealthCheck extends EnvironmentPropertyUrlHealthCheck {
    public JdsHealthCheck() {
        setPropertyKey(HmpProperties.JDS_URL);
        setUrlPath("/ping");
    }
}
