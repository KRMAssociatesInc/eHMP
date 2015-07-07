package gov.va.cpe.vpr.sync;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public class SyncStatus extends AbstractPOMObject {

    static final Logger LOG = LoggerFactory.getLogger(SyncStatus.class);

    public static final String OPERATIONAL_DATA_STATUS_UID = "urn:va:syncstatus:OPD";

    private String pid;
    private Map<String, VistaAccountSyncStatus> syncStatusByVistaSystemId;

    // Square peg round hole... Different class?
    private boolean forOperational;
    private boolean syncOperationalComplete;
    private VistaAccountSyncStatus operationalSyncStatus;

    public SyncStatus() {
        super();
    }

    @JsonCreator
    public SyncStatus(Map<String, Object> data) {
        super(data);
    }

    /**
     * NOTE:   ON A PREVIOUS RELEASE WE HAD TROUBLE USING Boolean AS THE
     *         TYPE.  WE HAD TO CHANGE IT TO boolean.  WE ARE RESTORING
     *         BACK TO THEIR ORIGINAL - BUT IF THERE IS A PROBLEM - WE WILL
     *         NEED TO REMERGE IN VISTACORE UX CHANGES TO FIX THIS DATA TYPE.
     *         THE PROBLEM WAS RELATED TO JACKSON BEING ABLE TO HANDLE THIS.
     */
    public Boolean getSyncCompleteForSystemId(String systemId) {
        if ((syncStatusByVistaSystemId == null) || (syncStatusByVistaSystemId.get(systemId) == null)) {
            return false;
        }

        return syncStatusByVistaSystemId.get(systemId).getSyncComplete();
    }

    public void setSyncReceivedAllChunks(String systemId, Boolean syncReceivedAllChunks) {
        if ((syncStatusByVistaSystemId != null) && (syncStatusByVistaSystemId.get(systemId) != null)) {
            syncStatusByVistaSystemId.get(systemId).setSyncReceivedAllChunks(syncReceivedAllChunks);
        }
    }

    public void setSyncComplete(String systemId, Boolean syncComplete) {
        if ((syncStatusByVistaSystemId != null) && (syncStatusByVistaSystemId.get(systemId) != null)) {
            syncStatusByVistaSystemId.get(systemId).setSyncComplete(syncComplete);
        }
    }

    public void setDomainExpectedTotals(String systemId, Map<String, Map<String, Integer>> domainExpectedTotals) {
        if ((syncStatusByVistaSystemId != null) && (syncStatusByVistaSystemId.get(systemId) != null)) {
            syncStatusByVistaSystemId.get(systemId).setDomainExpectedTotals(domainExpectedTotals);
        }
    }

    public Boolean getForOperational() {
        return pid==null;
    }

    public Map<String, VistaAccountSyncStatus> getSyncStatusByVistaSystemId() {
        return syncStatusByVistaSystemId;
    }

    @Override
    public String getUid() {
        if (!StringUtils.hasText(uid)) {
            uid = forOperational ? OPERATIONAL_DATA_STATUS_UID : (getPid() == null ? null : "urn:va:syncstatus:" + getPid().replaceAll(";","\\:"));
        }
        return super.getUid();
    }

    public void setForOperational(boolean b) {
        forOperational = b;
        operationalSyncStatus = new VistaAccountSyncStatus();
    }
    
    public void setForOperationalByVistaId(boolean b, String vistaId) {
        forOperational = b;
        if (operationalSyncStatus == null)
        	operationalSyncStatus = new VistaAccountSyncStatus();
        operationalSyncStatus.setSyncStatusByVistaId(vistaId, "false");
    }

    /**
     *  NOTE:   THIS WAS DROPPED FROM VA S64 MERGE - BUT IT WAS NEEDED ON OUR SIDE.  LEAVING IT
     *          HERE IN CASE IT IS NEEDED FOR THE SYNC STATUS HANDLING.  DO NOT WANT TO DROP IT NOW.
     */
    public void setPatient(PatientDemographics pat) {
        Assert.notNull(pat.getPid(), "[Assertion failed] - 'pid' is required; it must not be null");

        this.pid = pat.getPid();
        String systemId = UidUtils.getSystemIdFromPatientUid(pat.getUid());
        this.syncStatusByVistaSystemId = new HashMap<>();
        VistaAccountSyncStatus vstat = new VistaAccountSyncStatus();
        vstat.setPatientUid(pat.getUid());
        vstat.setSyncComplete(false);
        vstat.setSyncReceivedAllChunks(false);
        vstat.setDfn(pat.getLocalPatientIdForSystem(systemId));
        syncStatusByVistaSystemId.put(systemId, vstat);
    }

    /**
     * This adds in a new site information instance into the sync status.
     * @param pat The patient to be synchronized.
     * @param vistaId The vista site hash code for the site.
     * @return The newly created site syncstatus
     */
    public VistaAccountSyncStatus addSite(PatientDemographics pat, String vistaId) {
        if (pat == null) {
            return null;
        }
        return this.addSite(pat.getUid(), pat.getLocalPatientIdForSystem(vistaId), vistaId);
    }

    /**
     * This adds in a new site information instance into the sync status.
     * @param vistaId The vista site hash code for the site.
     * @return The newly created site syncstatus
     */
    public VistaAccountSyncStatus addSite(String uid, String dfn, String vistaId) {
        if (this.syncStatusByVistaSystemId == null) {
            this.syncStatusByVistaSystemId = new HashMap<>();
        }
        VistaAccountSyncStatus vstat = new VistaAccountSyncStatus();
        vstat.setPatientUid(uid);
        vstat.setSyncComplete(false);
        vstat.setSyncReceivedAllChunks(false);
        vstat.setDfn(dfn);
        syncStatusByVistaSystemId.put(vistaId, vstat);
        return vstat;
    }

    public String getPid() {
        return pid;
    }

    public void updateDomainTotal(String vistaId, String domainName, int tot) {
        if ((this.syncStatusByVistaSystemId != null) && (this.syncStatusByVistaSystemId.get(vistaId) != null)) {
            this.syncStatusByVistaSystemId.get(vistaId).updateDomainTotal(domainName, tot);
        }
    }

    public void updateDomainCount(String vistaId, String domainName, int count) {
        if ((this.syncStatusByVistaSystemId != null) && (this.syncStatusByVistaSystemId.get(vistaId) != null)) {
            this.syncStatusByVistaSystemId.get(vistaId).updateDomainCount(domainName, count);
        }
    }
    
    public void setSyncOperationalCompleteByVistaId(String vistaId, boolean syncOperationalComplete) {
        this.syncOperationalComplete = syncOperationalComplete;
        this.operationalSyncStatus.setSyncComplete(syncOperationalComplete);
        if (syncOperationalComplete) {
        	this.operationalSyncStatus.setSyncStatusByVistaId(vistaId,"true");
        }
        else {
        	this.operationalSyncStatus.setSyncStatusByVistaId(vistaId,"false");
        }
    }

    public void updateOperationalDomainCount(String domainName, int count) {
        if (this.operationalSyncStatus != null) {
            this.operationalSyncStatus.updateDomainCount(domainName, count);
        }
    }

    public void updateOperationalDomainTotal(String domainName, int tot) {
        if (this.operationalSyncStatus != null) {
            this.operationalSyncStatus.updateDomainTotal(domainName, tot);
        }
    }

    public VistaAccountSyncStatus getOperationalSyncStatus() {
        return operationalSyncStatus;
    }

    public boolean getSyncOperationalComplete() {
        return syncOperationalComplete;
    }

    @JsonIgnore
    public boolean getSyncComplete() {
        if (forOperational || this.syncStatusByVistaSystemId == null) {
            return syncOperationalComplete;
        }
        for (VistaAccountSyncStatus stat : this.syncStatusByVistaSystemId.values()) {
            if (!stat.isSyncComplete()) {
                return false;
            }
        }
        return true;
    }

    @JsonIgnore
    public Map<String,Integer> getDomainExpectedTotalsForAllSystemIds() {
        if (syncStatusByVistaSystemId == null) {
            return null;
        }
        Map<String, Integer> rslt = new HashMap<>();
        for (VistaAccountSyncStatus stat : syncStatusByVistaSystemId.values()) {
            for (String domain : stat.getDomainExpectedTotals().keySet()) {
                Integer current = rslt.get(domain);
                rslt.put(domain, (current == null ? 0 : current) + stat.getDomainExpectedTotals().get(domain).get("total"));
            }
        }
        return rslt;
    }

    @JsonIgnore
    public VistaAccountSyncStatus getVistaAccountSyncStatusForSystemId(String vistaId) {
        if (syncStatusByVistaSystemId == null) {
            return null;
        }

        return syncStatusByVistaSystemId.get(vistaId);
    }
    
    public void expireSite(String vistaId, PointInTime time) {
        LOG.debug("Trying to set expiresOn=" + time.toString() + " for " + pid + " on " + vistaId);
        if ((syncStatusByVistaSystemId != null) && (syncStatusByVistaSystemId.get(vistaId) != null)) {
            LOG.debug("   ...null checks passed.");
            syncStatusByVistaSystemId.get(vistaId).setExpiresOn(time);
        }
        try {
            LOG.debug("Leaving expireSite method; expiresOn=" + syncStatusByVistaSystemId.get(vistaId).getExpiresOn().toString() + " for " + pid + " on " + vistaId);
        } catch (NullPointerException e) {
            LOG.error("Null pointer dereferenced while logging; this should never happen.", e);
        }
    }
    
    public void setErrorMessage(String vistaId, String errorMessage){
        syncStatusByVistaSystemId.get(vistaId).setErrorMessage(errorMessage);        
    }
    
    @JsonIgnore
    public boolean needsSync(String vistaId) {
        if ((syncStatusByVistaSystemId == null) || (syncStatusByVistaSystemId.get(vistaId) == null)) {
            LOG.debug(pid + " needs sync for " + vistaId + " because of a null value.");
            return true;
        }
        LOG.debug("Checking if " + pid + " needs sync for " + vistaId + "...");
        return syncStatusByVistaSystemId.get(vistaId).needsSync();
    }

    public void setQueueStatus(String vistaId, JsonNode data) {
        ArrayNode wpd = (ArrayNode)data.path("waitingPids");
        List<String> pendingPids = new ArrayList<>();
        if(wpd!=null) {
            for(JsonNode wp: wpd) {pendingPids.add(wp.asText());}
        }

        ArrayNode ppd = (ArrayNode)data.path("processingPids");
        List<String> processingPids = new ArrayList<>();
        if(ppd!=null) {
            for(JsonNode pp: ppd) {processingPids.add(pp.asText());}
        }

        getSyncStatusByVistaSystemId().get(vistaId).setQueuePosition(pendingPids.contains(pid)?pendingPids.indexOf(pid)+1:0);
        getSyncStatusByVistaSystemId().get(vistaId).setProcessingPosition(processingPids.contains(pid)?processingPids.indexOf(pid)+1:0);
    }


    public static class VistaAccountSyncStatus {
        private String patientUid;
        private String dfn;
        private Map<String, Map<String, Integer>> domainExpectedTotals = new HashMap<>();
        private Boolean syncComplete = Boolean.FALSE;
        private int queuePosition;
        private int processingPosition;
        private Map<String, Map<String, Integer>> syncStatusByVistaIdMap = new HashMap<>();
        private PointInTime lastSyncTime;
        private PointInTime expiresOn;
        private Boolean expired = Boolean.FALSE;
        private String errorMessage;
        private Boolean syncReceivedAllChunks = Boolean.FALSE;

        public Boolean getSyncComplete() {
            return syncComplete;
        }

        public void setSyncComplete(Boolean syncComplete) {
            this.syncComplete = syncComplete;
        }

        public Boolean getSyncReceivedAllChunks() {
            return syncReceivedAllChunks;
        }

        public boolean isSyncReceivedAllChunks() {
            return syncReceivedAllChunks;
        }

        public void setSyncReceivedAllChunks(Boolean syncReceivedAllChunks) {
            this.syncReceivedAllChunks = syncReceivedAllChunks;
        }

        public void setPatientUid(String patientUid) {
            this.patientUid = patientUid;
        }

        public void setDfn(String dfn) {
            this.dfn = dfn;
        }

        public void setDomainExpectedTotals(Map<String, Map<String, Integer>> domainExpectedTotals) {
            this.domainExpectedTotals = domainExpectedTotals;
        }

        public Map<String, Map<String, Integer>> getDomainExpectedTotals() {
            return domainExpectedTotals;
        }

        public String getPatientUid() {
            return patientUid;
        }

        public void updateDomainTotal(String domainName, int tot) {
            Map<String, Map<String, Integer>> dmap = domainExpectedTotals;
            if(dmap == null) {dmap = new HashMap<>(); domainExpectedTotals = dmap;}
            Map<String, Integer> domTot = dmap.get(domainName);
            if(domTot==null) {domTot = new HashMap<>(); dmap.put(domainName, domTot);}
            domTot.put("total",tot);
        }

        public void updateDomainCount(String domainName, int count) {
            Map<String, Map<String, Integer>> dmap = domainExpectedTotals;
            if(dmap == null) {dmap = new HashMap<>(); domainExpectedTotals = dmap;}
            Map<String, Integer> domTot = dmap.get(domainName);
            if(domTot==null) {domTot = new HashMap<>(); dmap.put(domainName, domTot);}
            domTot.put("count", count);
        }

        public boolean isSyncComplete() {
            return syncComplete;
        }

        public String getDfn() {
            return dfn;
        }

        public void setQueuePosition(int queuePosition) {
            this.queuePosition = queuePosition;
        }

        public int getQueuePosition() {
            return queuePosition;
        }

        public void setProcessingPosition(int processingPosition) {
            this.processingPosition = processingPosition;
        }

        public int getProcessingPosition() {
            return processingPosition;
        }
        
        public void setsyncStatusByVistaIdMap(Map<String, Map<String, Integer>> syncStatusByVistaIdMap) {
            this.syncStatusByVistaIdMap = syncStatusByVistaIdMap;
        }

        public Map<String, Map<String, Integer>> getsyncStatusByVistaIdMap() {
            return syncStatusByVistaIdMap;
        }

        public void setSyncStatusByVistaId(String vistaId, String syncStatus) {
        	 Map<String, Map<String, Integer>> smap = syncStatusByVistaIdMap;
             if(smap == null) {smap = new HashMap<>(); syncStatusByVistaIdMap = smap;}
             Map<String, Integer> syncStatVista = smap.get(vistaId);
             if(syncStatVista==null) {syncStatVista = new HashMap<>(); smap.put(vistaId, syncStatVista);}
             if (syncStatus == "true") {
            	 syncStatVista.put("Complete", 1);
             }
             else {
            	 syncStatVista.put("Complete", 0); 
             }
        }

        public PointInTime getLastSyncTime() {
            return lastSyncTime;
        }

        public void setLastSyncTime(PointInTime lastSyncTime) {
            this.lastSyncTime = lastSyncTime;
        }

        public PointInTime getExpiresOn() {
            return expiresOn;
        }

        public void setExpiresOn(PointInTime expiresOn) {
            this.expiresOn = expiresOn;
        }

        @JsonIgnore
        public boolean needsSync() {
            if (expiresOn == null) {
                LOG.debug(patientUid + " needs sync because of a null value.");
                return true;
            }
            if (NullChecker.isNotNullish(errorMessage)) {
                LOG.debug(patientUid + " needs sync because of an error condition: " + errorMessage);
                return true;
            }
            PointInTime now = PointInTime.now();
            LOG.debug("...checking if " + now.toString() + " is after " + expiresOn.toString());
            boolean answer = now.after(expiresOn);
            if (answer) {
                LOG.debug("...it is.");
            } else {
                LOG.debug("...it isn't.");
            }
            return answer;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }

        public Boolean isExpired() {
            return expired;
        }

        public void setExpired(Boolean expired) {
            this.expired = expired;
        }        
    }

}
