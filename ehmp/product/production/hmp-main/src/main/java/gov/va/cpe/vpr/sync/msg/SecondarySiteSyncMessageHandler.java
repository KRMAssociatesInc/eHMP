package gov.va.cpe.vpr.sync.msg;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_STREAM_API_RPC_URI;
import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.ImmutableMap;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientService;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.expirationrulesengine.IExpirationRulesEngine;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.LoggingUtil;
import gov.va.hmp.util.NullChecker;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;

public abstract class SecondarySiteSyncMessageHandler implements SessionAwareMessageListener {
    private static final String CRLF = System.getProperty("line.separator");

    protected abstract String getSiteId();
    protected abstract String getTimerName();
    protected abstract Logger getLogger();
    protected abstract void setLogger(Logger theLogger);
    protected abstract String getUid(PatientIds patientIds);
    protected abstract String getPid(PatientIds patientIds);

    protected MetricRegistry metrics;
    protected IBroadcastService bcSvc;
    protected SimpleMessageConverter messageConverter;
    protected ISyncService syncService;
    protected IVprSyncStatusDao syncStatusDao;
    protected PatientService patientService;
    protected IExpirationRulesEngine expirationRulesEngine;
    protected int retryCount = 0;

    @Autowired
    public void setMetricRegistry(MetricRegistry metrics) {
        this.metrics = metrics;
    }

    @Autowired
    public void setBroadcastService(IBroadcastService bcSvc) {
        this.bcSvc = bcSvc;
    }

    @Autowired
    public void setMessageConverter(SimpleMessageConverter messageConverter) {
        this.messageConverter = messageConverter;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setSyncStatusDao(IVprSyncStatusDao syncStatusDao) {
        this.syncStatusDao = syncStatusDao;
    }

    @Autowired
    public void setPatientService(PatientService patientService) {
        this.patientService = patientService;
    }

    @Autowired
    public void setExpirationRulesEngine(IExpirationRulesEngine expirationRulesEngine) {
        this.expirationRulesEngine = expirationRulesEngine;
    }
    
    private IPatientDAO patientDao;

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    protected abstract List<VistaDataChunk> fetchData(PatientIds patientIds, PatientDemographics pt) throws Exception;

    @Override
    public void onMessage(Message message, Session session) throws JMSException {
        getLogger().debug("SecondarySiteSyncMessageHandler.onMessage().  Entering method...");
        Timer.Context timerContext = metrics.timer(MetricRegistry.name(getTimerName())).time();

        Map msg = (Map) messageConverter.fromMessage(message);
        Map patientIdMap = (Map) msg.get("patientIds");
        PatientIds patientIds = PatientIds.fromMap(patientIdMap);
        Object objRetryCount = msg.get("retrycount");
        if (objRetryCount != null) {
            retryCount = (int) objRetryCount;
        }

        getLogger().debug("SecondarySiteSyncMessageHandler.onMessage().  calling fetchData()...");
        Map<String, Map<String, Integer>> domainTotals = new HashMap<>();

        List<VistaDataChunk> vistaDataChunks = null;
        getLogger().debug("retryCount:" + retryCount);        
        int iterationCount = 0;
        String syncError = "";
        PatientDemographics pt = null;
        while (true) {
            try {
                getLogger().debug("onMessage: Retrieving patient demographics for pid: " + getPid(patientIds));
                getLogger().debug("onMessage: patientDao is = " + ((patientDao == null) ? "null" : "NOT null"));
                pt = patientDao.findByPid(getPid(patientIds));
                getLogger().debug("onMessage: Found patient demographics.  pt: " + ((pt == null) ? "null" : pt.toJSON()));
                vistaDataChunks = fetchData(patientIds, pt);
                break;
            } catch (Exception e) {
                getLogger().error("Error while fetching data from site '" + getSiteId() + "'.  Error: " + e.getMessage(), e);

                ++iterationCount;

                if (iterationCount < retryCount + 1) {
                    getLogger().info("Retrying to fetch data.");
                } else {
                    getLogger().error("'" + getSiteId() + "' site data could not be fetched even after " + retryCount + " retries.");
                    syncError = "Site could not be synced because of '" + e.getMessage().replace("java.lang.RuntimeException: ", "") + "'";
                    break;
                }
            }
        }
        
        // Calculate domain totals to place in the sync status
        //----------------------------------------------------
        if (vistaDataChunks != null) {
            getLogger().debug("SecondarySiteSyncMessageHandler.onMessage().  Received " + vistaDataChunks.size() + " chunks.");
            for (VistaDataChunk vistaDataChunk : vistaDataChunks ) {
                Map<String, Integer> currentCounts = domainTotals.get(vistaDataChunk.getDomain());
                if (currentCounts == null) {
                    currentCounts = ImmutableMap.<String, Integer>builder()
                            .put("total", 1)
                            .put("count", 1)
                            .build();
                    domainTotals.put(vistaDataChunk.getDomain(), currentCounts);
                } else {
                    currentCounts = ImmutableMap.<String, Integer>builder()
                            .put("total", currentCounts.get("total") + 1)
                            .put("count", currentCounts.get("count") + 1)
                            .build();
                    domainTotals.put(vistaDataChunk.getDomain(), currentCounts);
                }
            }
        } else {
            getLogger().debug("SecondarySiteSyncMessageHandler.onMessage().  No data was received...");
        }
        
        // Create the sync status
        //------------------------
        SyncStatus syncStatus = syncStatusDao.findOneByPid(getPid(patientIds));
        getLogger().debug(LoggingUtil.outputSyncStatus("onMessage: Retrieved sync status from JDS - pid: " + getPid(patientIds), syncStatus));

        if (syncStatus != null) {
            SyncStatus.VistaAccountSyncStatus vistaAccountSyncStatusForSystemId;
            try {
                vistaAccountSyncStatusForSystemId = syncStatus.getVistaAccountSyncStatusForSystemId(getSiteId());
            } catch (NullPointerException npe) {
                getLogger().error("onMessage: Exception occured. This should never happen.  Failed to find site: " + getSiteId() + " in SyncStatus: " + syncStatus.getUid(), npe);
                throw new IllegalStateException("No site found in " + syncStatus.getUid() + " for Site ID " + getSiteId());
            }
            if (vistaAccountSyncStatusForSystemId == null) {
                getLogger().error("onMessage: This should never happen.  Failed to find site: " + getSiteId() + " in SyncStatus: " + syncStatus.getUid());
                vistaAccountSyncStatusForSystemId = syncStatus.addSite(patientIds.getUid(), patientIds.getEdipi(), getSiteId());
            }

            // Add domains totals and counts
            vistaAccountSyncStatusForSystemId.setDomainExpectedTotals(domainTotals);
            vistaAccountSyncStatusForSystemId.setSyncReceivedAllChunks(true);

            // Record the last sync time
            vistaAccountSyncStatusForSystemId.setLastSyncTime(PointInTime.now());
            // Clear expiration
            vistaAccountSyncStatusForSystemId.setExpiresOn(null);
            // Set expiration
            // TODO: Should this stay here? Or should it only be in VistaVprDataExtractEventStreamDAO.subscribePatientSecondarySites(...)?
            expirationRulesEngine.evaluate(syncStatus);
            //Set Sync Error message if any
            vistaAccountSyncStatusForSystemId.setErrorMessage(syncError);
            
            // If we are in an error condition, then set sync complete to true.  Nothing more to do on this.
            //------------------------------------------------------------------------------------------------
            if (NullChecker.isNotNullish(syncError)) {
                vistaAccountSyncStatusForSystemId.setSyncComplete(true);
            }

            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
            overwriteErrorMessageForSites.add(getSiteId());

            getLogger().debug(LoggingUtil.outputSyncStatus("onMessage: Before storing sync status - primary site pid: " + patientIds.getPid() + "; Secondary Site pid: " + getPid(patientIds), syncStatus));
            syncStatus = syncStatusDao.saveMergeSyncStatus(syncStatus, overwriteErrorMessageForSites);
            getLogger().debug(LoggingUtil.outputSyncStatus("onMessage: After storing sync status - primary site pid: " + patientIds.getPid() + "; Secondary Site pid: " + getPid(patientIds), syncStatus));
            getLogger().debug("onMessage: After storing sync status - primary site pid: " + patientIds.getPid() + "; Secondary Site pid: " + getPid(patientIds) + "- Full Message: " + syncStatus.toJSON());
            broadcastSyncStatus(syncStatus);
            
            // Note that this chunk must be added last and only if we are not in an error condition.   
            // So that it is the last message processed and stored in the JDS.
            //-----------------------------------------------------------------------------------------------------------
            if (NullChecker.isNullish(syncError)) {
                
                syncStatus.setSyncComplete(getSiteId(), true);
                JsonNode dataNode = POMUtils.parseJSONtoNode(syncStatus.toJSON());
                getLogger().debug("onMessage: Completed receiving data from secondary site. Creating VistaDataChunk for SyncStatus.  pid:" + getPid(patientIds) + 
                          "; + vistaId + " + "; syncStatus: " + CRLF + syncStatus.toJSON());
                String url = VISTA_RPC_BROKER_SCHEME + "://" + this.getSiteId() + VPR_STREAM_API_RPC_URI;
                int idx = 1;
                int tot = 1;
                VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(this.getSiteId(), url, dataNode, "syncStatus", idx, tot, pt, 
                                       VistaDataChunk.getProcessorParams(this.getSiteId(), getPid(patientIds), false), false);
                if (vistaDataChunks != null) {
                	vistaDataChunks.add(chunk);
                }
            }
        } else {
            getLogger().error("Null value found for sync status for pid " + getPid(patientIds));
            throw new RuntimeException("Error:  A SyncStatus record should always exist at this point, but for some reason it did not. " +  
                                       "Aborting processing of the secondary site data for Site: " + this.getSiteId() + "; pid: " + getPid(patientIds) +
                                       "; icn: " + patientIds.getIcn() + "; edipi: " + patientIds.getEdipi());
        }

        try {
            if (vistaDataChunks != null) {
                for (VistaDataChunk vistaDataChunk : vistaDataChunks ) {
                    if (getLogger().isDebugEnabled()) {
                        getLogger().debug("onMessage: Sending chunk to queue with pid: " + vistaDataChunk.getPatientId() + "; " + vistaDataChunk.objectContentsOutput("vistaDataChunk"));
                    }
                    syncService.sendImportVistaDataExtractItemMsg(vistaDataChunk);
                }
            } else {
                getLogger().debug("SecondarySiteSyncMessageHandler.onMessage().  No data was received...");
            }
        } catch (Exception e) {
            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
            overwriteErrorMessageForSites.add(getSiteId());
            SyncStatus.VistaAccountSyncStatus vistaAccountSyncStatusForSystemId;
            vistaAccountSyncStatusForSystemId = syncStatus.getVistaAccountSyncStatusForSystemId(getSiteId());
            vistaAccountSyncStatusForSystemId.setErrorMessage(syncError);
            vistaAccountSyncStatusForSystemId.setSyncComplete(true);
            getLogger().debug(LoggingUtil.outputSyncStatus("onMessage: Before storing sync status - primary site pid: " + patientIds.getPid() + "; Secondary Site pid: " + getPid(patientIds), syncStatus));
            syncStatus = syncStatusDao.saveMergeSyncStatus(syncStatus, overwriteErrorMessageForSites);
            getLogger().debug(LoggingUtil.outputSyncStatus("onMessage: After storing sync status - primary site pid: " + patientIds.getPid() + "; Secondary Site pid: " + getPid(patientIds), syncStatus));

            getLogger().error("SecondarySiteSyncMessageHandler.onMessage().  An exception was thrown.  Message: " + e.getMessage(), e);
        }

        timerContext.stop();
    }

    private void broadcastSyncStatus(SyncStatus stat) {
        Map<String, Object> message = new HashMap<String, Object>();
        message.put("eventName", "syncStatusChange");
        message.put("syncStatus", stat.getData());
        bcSvc.broadcastMessage(message);
    }

}
