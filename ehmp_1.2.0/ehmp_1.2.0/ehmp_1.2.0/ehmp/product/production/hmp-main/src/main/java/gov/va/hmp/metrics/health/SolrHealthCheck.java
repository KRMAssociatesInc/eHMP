package gov.va.hmp.metrics.health;

import gov.va.hmp.HmpProperties;

public class SolrHealthCheck extends EnvironmentPropertyUrlHealthCheck {
    public SolrHealthCheck() {
        setPropertyKey(HmpProperties.SOLR_URL);
    }
}
