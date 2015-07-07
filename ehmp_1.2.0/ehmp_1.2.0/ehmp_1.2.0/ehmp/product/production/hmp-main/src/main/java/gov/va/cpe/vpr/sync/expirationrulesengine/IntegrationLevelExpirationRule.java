package gov.va.cpe.vpr.sync.expirationrulesengine;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.cpe.vpr.sync.msg.SyncDodMessageHandler;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IntegrationLevelExpirationRule extends ExpirationRule {

    public static final int DEEPLY_INTEGERATED = 1;
    public static final int PARTIALLY_INTEGRATED = 2;
    public static final int NOT_INTEGRATED = 3;

    private static Logger LOGGER = LoggerFactory.getLogger(IntegrationLevelExpirationRule.class);
    private String siteId;

    private int deepIntegrationExpirationHours;
    private int partialIntegrationExpirationHours;
    private Map<String, Integer> integrationLevelsByVistaId;

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public int getDeepIntegrationExpirationHours() {
        return deepIntegrationExpirationHours;
    }

    public void setDeepIntegrationExpirationHours(int deepIntegrationExpirationHours) {
        this.deepIntegrationExpirationHours = deepIntegrationExpirationHours;
    }

    public int getPartialIntegrationExpirationHours() {
        return partialIntegrationExpirationHours;
    }

    public void setPartialIntegrationExpirationHours(int partialIntegrationExpirationHours) {
        this.partialIntegrationExpirationHours = partialIntegrationExpirationHours;
    }

    public Map<String, Integer> getIntegrationLevelsByVistaId() {
        return integrationLevelsByVistaId;
    }

    public void setIntegrationLevelsByVistaId(Map<String, Integer> integrationLevelsByVistaId) {
        this.integrationLevelsByVistaId = integrationLevelsByVistaId;
    }

    public PointInTime evaluate(SyncStatus syncStatus) {
        LOGGER.debug("  Evaluating an Integration Level rule for " + siteId);

        VistaAccountSyncStatus vstat = getVistaAccountSyncStatus(syncStatus);

        int integrationLevel = calculateIntegrationLevel(syncStatus);
        PointInTime answer = null;
        if (integrationLevel == DEEPLY_INTEGERATED) {
            if (vstat.getLastSyncTime() != null) {
                answer = vstat.getLastSyncTime().addHours(deepIntegrationExpirationHours);
            } else {
                answer = PointInTime.now().addHours(deepIntegrationExpirationHours);
            }
        } else if (integrationLevel == PARTIALLY_INTEGRATED) {
            if (vstat.getLastSyncTime() != null) {
                answer = vstat.getLastSyncTime().addHours(partialIntegrationExpirationHours);
            } else {
                answer = PointInTime.now().addHours(partialIntegrationExpirationHours);
            }
        }

        LOGGER.debug("  Returning " + answer);
        return answer;
    }

    private int calculateIntegrationLevel(SyncStatus syncStatus) {
        LOGGER.debug("  Calculating Integration level.");
        int minLevel = NOT_INTEGRATED;
        if ((syncStatus != null) && (syncStatus.getSyncStatusByVistaSystemId() != null) && !syncStatus.getSyncStatusByVistaSystemId().isEmpty()) {
            LOGGER.debug("  Nullish check ok.");
            for (String vistaId : syncStatus.getSyncStatusByVistaSystemId().keySet()) {
                if (integrationLevelsByVistaId.containsKey(vistaId)) {
                    LOGGER.debug("  Found data from site " + vistaId);
                    int newLevel = 0;
                    if (siteId.equals(SyncDodMessageHandler.SITE_ID)) {
                        newLevel = integrationLevelsByVistaId.get(vistaId);
                        LOGGER.debug(" ..." + vistaId + " has a DoD Integration Level of " + newLevel + "...");
                    } else {
                        // TODO
                        String message = "Attempted to calculate Integration Level for unsupported site " + siteId;
                        LOGGER.error(message);
                        throw new UnsupportedOperationException(message);
                    }
                    if ((newLevel > 0) && (newLevel < minLevel)) {
                        LOGGER.debug(" " + newLevel + "<" + minLevel + ", so setting " + newLevel + " as the new minLevel...");
                        minLevel = newLevel;
                    }
                }
            }
        } else {
            LOGGER.debug("  Nullish check failed!");
        }
        LOGGER.debug("  Returning " + minLevel);
        return minLevel;
    }

    @Override
    protected Logger getLogger() {
        return LOGGER;
    }

    @Override
    public String toString() {
        String answer = getClass().getName()
               + ": siteId = " + siteId 
               + ", deepIntegrationExpirationHours = " + deepIntegrationExpirationHours 
               + ", partialIntegrationExpirationHours = " + partialIntegrationExpirationHours;

        if (integrationLevelsByVistaId != null) {
            for (Map.Entry<String, Integer> entry : integrationLevelsByVistaId.entrySet()) {
                answer = answer + ", " + entry.getKey() + " has integration level " + entry.getValue();
            }
        }

        return answer;
    }

}
