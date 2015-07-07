package gov.va.hmp.metrics.health;

import gov.va.hmp.HmpProperties;

public class OpenInfoButtonHealthCheck extends EnvironmentPropertyUrlHealthCheck {
    public OpenInfoButtonHealthCheck() {
        setPropertyKey(HmpProperties.INFO_BUTTON_URL);
    }
}
