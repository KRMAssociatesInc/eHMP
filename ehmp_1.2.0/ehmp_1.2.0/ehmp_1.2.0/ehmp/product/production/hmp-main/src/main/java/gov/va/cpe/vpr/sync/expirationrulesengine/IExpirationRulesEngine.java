package gov.va.cpe.vpr.sync.expirationrulesengine;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.ISecondarySiteConfig;

import java.util.Map;

public interface IExpirationRulesEngine {

    public Map<String, ExpirationRule> getRules();

    public void setRules(Map<String, ExpirationRule> rules);

    public void setSecondarySiteConfig(ISecondarySiteConfig secondarySiteConfig);

    public SyncStatus evaluate(SyncStatus syncStatus);

}
