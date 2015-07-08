package gov.va.hmp;

import gov.va.cpe.vpr.sync.expirationrulesengine.ExpirationRule;

import java.util.Map;

public interface ISecondarySiteConfig {

    public abstract Map<String, ExpirationRule> getSecondarySiteRulesMap();

}