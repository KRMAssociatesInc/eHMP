package gov.va.cpe.vpr.sync.expirationrulesengine;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.hmp.healthtime.PointInTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BasicExpirationRule extends ExpirationRule {

    private static Logger LOGGER = LoggerFactory.getLogger(BasicExpirationRule.class);

    private String siteId;
    private int expirationHours;

    public int getExpirationHours() {
        return expirationHours;
    }

    public void setExpirationHours(int expirationHours) {
        this.expirationHours = expirationHours;
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public PointInTime evaluate(SyncStatus syncStatus) {
        LOGGER.debug("Evaluating a Basic rule for " + siteId);
        //basic rule:
        //set expiresOn property
        //expiresOn = lastSyncTime + timeToExpire        

        VistaAccountSyncStatus vstat = getVistaAccountSyncStatus(syncStatus);
        if ((vstat != null) && (vstat.getLastSyncTime() != null)) {
            LOGGER.debug("returning " + vstat.getLastSyncTime().addHours(expirationHours));
            return vstat.getLastSyncTime().addHours(expirationHours);             
        } else {
            PointInTime now = PointInTime.now();
            LOGGER.debug("lastSyncTime not set, so defaulting to " + now.addHours(expirationHours));
            return now.addHours(expirationHours);
        }
    }

    @Override
    protected Logger getLogger() {
        return LOGGER;
    }

    @Override
    public String toString() {
        return getClass().getName() + ": siteId = " + siteId + ", expirationHours = " + expirationHours;
    }

}
