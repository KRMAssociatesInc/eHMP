package gov.va.cpe.vpr.sync.expirationrulesengine;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.ISecondarySiteConfig;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public final class ExpirationRulesEngine implements IExpirationRulesEngine {

    static final Logger LOG = LoggerFactory.getLogger(ExpirationRulesEngine.class);

    private Map<String, ExpirationRule> rules;

    /* (non-Javadoc)
     * @see gov.va.cpe.vpr.sync.expiresrulesengine.IExpirationRulesEngine#getRules()
     */
    @Override
    public Map<String, ExpirationRule> getRules() {
        return rules;
    }

    /* (non-Javadoc)
     * @see gov.va.cpe.vpr.sync.expiresrulesengine.IExpirationRulesEngine#setRules(java.util.Map)
     */
    @Override
    public void setRules(Map<String, ExpirationRule> rules) {
        this.rules = rules;
    }

    /* (non-Javadoc)
     * @see gov.va.cpe.vpr.sync.expiresrulesengine.IExpirationRulesEngine#setSecondarySiteConfig(gov.va.hmp.ISecondarySiteConfig)
     */
    @Override
    @Autowired
    public void setSecondarySiteConfig(ISecondarySiteConfig secondarySiteConfig) {
        rules = secondarySiteConfig.getSecondarySiteRulesMap();
    }

    /* (non-Javadoc)
     * @see gov.va.cpe.vpr.sync.expiresrulesengine.IExpirationRulesEngine#evaluate(gov.va.cpe.vpr.sync.SyncStatus)
     */
    @Override
    public SyncStatus evaluate(SyncStatus syncStatus) {
        if ((rules == null) || (syncStatus == null) || (syncStatus.getSyncStatusByVistaSystemId() == null)) {
            return syncStatus;
        }
        PointInTime minExpiresOn = null;
        PointInTime newExpiresOn = null;
        for (String vistaId : syncStatus.getSyncStatusByVistaSystemId().keySet()) {
            LOG.debug("evaluating expiration time for " + vistaId);
            minExpiresOn = syncStatus.getVistaAccountSyncStatusForSystemId(vistaId).getExpiresOn();
            LOG.debug("minExpiresOn set to initial value: " + (minExpiresOn == null ? null : minExpiresOn.toString()));
            // find rule with matching site id
            for (ExpirationRule rule : rules.values()) {
                if (vistaId.equals(rule.getSiteId())) {
                    newExpiresOn = rule.evaluate(syncStatus);
                    LOG.debug("              newExpiresOn set to: " + (newExpiresOn == null ? null : newExpiresOn.toString()));
                    // use the rule that returns the earliest expiration time
                    if ((newExpiresOn != null) && (minExpiresOn == null || minExpiresOn.after(newExpiresOn))) {
                        LOG.debug("   ...which is earlier, so updating minExpiresOn.");
                        syncStatus.expireSite(vistaId, newExpiresOn);
                        minExpiresOn = newExpiresOn;
                    }
                }
            }
        }
        return syncStatus;
    }

}
