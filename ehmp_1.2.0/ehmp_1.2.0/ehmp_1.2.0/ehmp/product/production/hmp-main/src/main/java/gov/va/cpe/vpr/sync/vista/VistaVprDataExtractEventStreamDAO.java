package gov.va.cpe.vpr.sync.vista;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_DATA_VERSION_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_PATIENT_ACTIVITY_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_STREAM_API_RPC_URI;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_STREAM_DELSUB_RPC_URI;
import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

import com.google.gson.JsonObject;

import gov.va.cpe.idn.IPatientIdentityService;
import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.SiteAndPid;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.cpe.vpr.sync.expirationrulesengine.IExpirationRulesEngine;
import gov.va.cpe.vpr.sync.msg.SyncCdsMessageHandler;
import gov.va.cpe.vpr.sync.msg.SyncDasMessageHandler;
import gov.va.cpe.vpr.sync.msg.SyncDodMessageHandler;
import gov.va.cpe.vpr.sync.msg.SyncVlerMessageHandler;
import gov.va.cpe.vpr.sync.util.SyncUtils;
import gov.va.cpe.vpr.termeng.jlv.JLVDocDefUtil;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.ptselect.PtSelectToPtDemographicsUtil;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import gov.va.hmp.util.LoggingUtil;
import gov.va.hmp.util.NullChecker;
import gov.va.hmp.vista.rpc.JacksonRpcResponseExtractor;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.jms.core.JmsOperations;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.collect.ImmutableMap;


@Component
public class VistaVprDataExtractEventStreamDAO implements IVistaVprDataExtractEventStreamDAO, EnvironmentAware {

    private static final int DEFAULT_BATCH_SIZE = 1000;
    private static final Logger LOG = LoggerFactory.getLogger(VistaVprDataExtractEventStreamDAO.class);
    public static final String EXTRACT_SCHEMA = "3.001";
	private static final String CRLF = System.getProperty("line.separator");
    private static final Object DOCUMENT_TYPE = "document";

    private RpcOperations synchronizationRpcTemplate;
    private IPatientDAO patientDao;
    private IPatientSelectDAO patientSelectDao;
    private MetricRegistry metricRegistry;
    private ConversionService conversionService;
    private IVprSyncStatusDao syncStatusDao;
    private IBroadcastService bcSvc;
    private IPatientIdentityService vistaPatientIdentityService;
    private ISyncService syncService;
    private Environment environment;
    private JmsOperations jmsTemplate;
    private JdsOperations jdsTemplate;

    private JacksonRpcResponseExtractor jsonExtractor = new JacksonRpcResponseExtractor();
    private int asyncBatchSize;
    private Boolean hdrEnabled;
    private Boolean dodJmeadowsEnabled;
    private Boolean vlerEnabled;
    private Boolean vlerDasEnabled;

    private IVistaAccountDao vistaAccountDao;


    private IExpirationRulesEngine expirationRulesEngine;

    @Autowired
    public void setExpirationRulesEngine(IExpirationRulesEngine expirationRulesEngine) {
        this.expirationRulesEngine = expirationRulesEngine;
    }

    private IPrimarySiteMonitorsMap primarySiteMonitorsMap;

    
    @Autowired
	public void setPrimarySiteMonitorsMap(IPrimarySiteMonitorsMap primarySiteMonitors) {
		this.primarySiteMonitorsMap = primarySiteMonitors;
	}

	@Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setBroadcastService(IBroadcastService bcSvc) {
        this.bcSvc = bcSvc;
    }

    @Autowired
    public void setSynchronizationRpcTemplate(RpcOperations synchronizationRpcTemplate) {
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setMetricRegistry(MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    @Autowired
    public void setPatientSelectDao(IPatientSelectDAO patientSelectDao) {
        this.patientSelectDao = patientSelectDao;
    }
    
    @Autowired
    public void setJdsTemplate(JdsOperations jdsTemplate) {
        this.jdsTemplate = jdsTemplate;
    }

    @Override
    public String fetchVprVersion(String vistaId) {
        return synchronizationRpcTemplate.executeForString(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_DATA_VERSION_RPC_URI);
    }

    @Override
    public VistaDataChunk fetchPatientDemographicsWithDfn(String vistaId, String ptDfn) {
        return fetchPatientDemographics(vistaId, ptDfn, false);
    }

    @Override
    public VistaDataChunk fetchPatientDemographicsWithIcn(String vistaId, String ptIcn) {
        return fetchPatientDemographics(vistaId, ptIcn, true);
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setConversionService(ConversionService conversionService) {
        this.conversionService = conversionService;
    }

    @Autowired
    public void setSyncStatusDao(IVprSyncStatusDao syncStatusDao) {
        this.syncStatusDao = syncStatusDao;
    }

    @Autowired
    public void setVistaPatientIdentityService(IPatientIdentityService vistaPatientIdentityService)
    {
        this.vistaPatientIdentityService = vistaPatientIdentityService;
    }

   
    public JmsOperations getJmsTemplate() {
        return jmsTemplate;
    }

    @Autowired
    public void setJmsTemplate(JmsOperations jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    public void processPatientsWithAppointments(String vistaId) {
        LOG.debug("APPTTRIGGER processPatientsWithAppointments (vistaIs): Entered method for vistaId: " + vistaId);
        RpcResponse response = synchronizationRpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + vistaId
                + VPR_PATIENT_ACTIVITY_RPC_URI);
        
        if(response == null || response.toString() == null || response.toString().length() == 0) {
            LOG.debug("APPTTRIGGER processPatientsWithAppointments (" + vistaId + "): no appointments");
            return;
        }
        
        JsonNode rpcJson = null;
        
        try {
            rpcJson = jsonExtractor.extractData(response);
        } catch(RuntimeException e) {
            LOG.error("APPTTRIGGER processPatientsWithAppointments(" + vistaId + ") invalid response: " + response);
            return;
        }
        
        LOG.debug("APPTTRIGGER got: " + rpcJson.size() + " patients");
        for(int i = 0; i < rpcJson.size(); i++) {
            JsonNode patient = rpcJson.get(i);
            LOG.debug("APTTRIGGER patient: " + patient);
            String dfn = patient.has("dfn") ? patient.get("dfn").asText() : null;
            String icn = patient.has("icn") ? patient.get("icn").asText() : null;

            if(!NullChecker.isNullish(dfn) && dfn.indexOf(";") != -1) {
                LOG.debug("APPTTRIGGER subscribe to patient dfn=" + dfn);
                subscribePatient(vistaId, dfn, true);
            } else if(!NullChecker.isNullish(icn)) {
                PatientSelect pt = patientSelectDao.findOneByIcn(icn);
                if (pt != null) {
                    vistaId = UidUtils.getSystemIdFromPatientUid(pt.getUid());
                    String pid = pt.getPid();
                    LOG.error("APPTTRIGGER subscribe to patient pid=" + pid);
                    subscribePatient(vistaId, pid, true);
                } else {
                    LOG.warn("APPTRIGGER patient NOT subscribed, could not get patient from icn=" + icn);
                }
            } else {
                LOG.warn("APPTRIGGER patient NOT subscribed, could not find valid dfn or icn in appointment record dfn=" + dfn + " icn=" + icn);
            }
        }
    }


    private VistaDataChunk fetchPatientDemographics(String vistaId, String pid, boolean isIcn) {
        Timer.Context timer = metricRegistry.timer(MetricRegistry.name("vpr.fetch.patient")).time();
        try {
            Map rpcArg = new HashMap();
            rpcArg.put("patientId", (isIcn ? ";" + pid : pid));
            rpcArg.put("domain", "patient");
            rpcArg.put("extractSchema",EXTRACT_SCHEMA);
            RpcResponse response = synchronizationRpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_GET_VISTA_DATA_JSON_RPC_URI, rpcArg);
            JsonNode json = jsonExtractor.extractData(response);
            JsonNode patientJsonNode = json.path("data").path("items").path(0);
            if (patientJsonNode.isNull())
                throw new DataRetrievalFailureException("missing 'data.items[0]' node in JSON RPC response");
            VistaDataChunk patientChunk = VistaDataChunk.createVistaDataChunk(vistaId, response.getRequestUri(), patientJsonNode, "patient", 0, 1, null, VistaDataChunk.getProcessorParams(vistaId, pid, isIcn));
            patientChunk.getParams().put(SyncMessageConstants.DIVISION, response.getDivision());
            patientChunk.getParams().put(SyncMessageConstants.DIVISION_NAME, response.getDivisionName());

            if (!isIcn)
                patientChunk.setLocalPatientId(pid);

            return patientChunk;
        } catch (RuntimeException e) {
            throw e;
        } finally {
            timer.stop();
        }
    }

    public VistaDataChunk fetchOneByUid(String vistaId, String pid, String uid) {
        Timer.Context timer = metricRegistry.timer(MetricRegistry.name("vpr.fetch.patient")).time();
        String domain = UidUtils.getCollectionNameFromUid(uid);
        PatientDemographics pt = patientDao.findByPid(pid);
        try {
            Map rpcArg = new HashMap();
            rpcArg.put("uid", uid);
            RpcResponse response = synchronizationRpcTemplate.execute(VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_GET_VISTA_DATA_JSON_RPC_URI, rpcArg);
            JsonNode json = jsonExtractor.extractData(response);
            JsonNode jsonNode = json.path("data").path("items").path(0);
            if (jsonNode.isNull())
                throw new DataRetrievalFailureException("missing 'data.items[0]' node in JSON RPC response");
            VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(vistaId, response.getRequestUri(), jsonNode, domain, 0, 1, pt);

            return chunk;
        } catch (RuntimeException e) {
            throw e;
        } finally {
            timer.stop();
        }
    }

    /**
     * This method unsubscribes a patient for a single site.
     * 
     * @param vistaId The site to unsubscribe
     * @param pid The pid for the patient to unsubscribe
     */
    private void unsubscribePatientForSingleSite(String vistaId, String pid,boolean resetSync) {
        LOG.debug("unsubscribePatientForSingleSite: Entered method for vistaId: " + vistaId + "; pid:" + pid);
        LOG.debug("unsubscribePatientForSingleSite: Got here by the following trace: " + CRLF + Arrays.toString(Thread.currentThread().getStackTrace()));
        
        Map<String, Object> params = new HashMap<>();
        params.put("hmpSrvId", environment.getProperty(HmpProperties.SERVER_ID));
        params.put("pid", pid);
        String url = VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_STREAM_DELSUB_RPC_URI;
        synchronizationRpcTemplate.executeForJson(url, params);
        
        if(resetSync)
        {
        	syncStatusDao.reset(pid, vistaId);
        }
        else
        {

        	syncStatusDao.delete(pid, vistaId);
        }
    }
    
    @Override
    public void unsubscribePatient(String vistaId, String pid, boolean cascade,boolean resetSync) {
        LOG.debug("unsubscribePatient (vistaId, pid): Entered method for vistaId: " + vistaId + "; pid:" + pid);
        LOG.debug("unsubscribePatient: Got here by the following trace: " + CRLF + Arrays.toString(Thread.currentThread().getStackTrace()));
        
        if (NullChecker.isNullish(pid)) {
            LOG.warn("unsubscribePatient: pid was null.  No unsubscription will be performed.");
            return;
        }
        
        // Unsubscribe for this site.
        //--------------------------
        if (NullChecker.isNotNullish(vistaId)) {
            LOG.debug("unsubscribePatient: Unsubscribing patient for original request.  site: " + vistaId + "; pid: " + pid);
            unsubscribePatientForSingleSite(vistaId, pid,resetSync);
        }
        
        if (cascade) {
            // Now lets see if this patient has other sites where they have data and unsubscribe them too.
            //--------------------------------------------------------------------------------------------
            List<SiteAndPid> oaSiteAndPid = getPatientVistaSites(pid);
            if (NullChecker.isNotNullish(oaSiteAndPid)) {
                for (SiteAndPid siteAndPid : oaSiteAndPid) {
                    if ((NullChecker.isNotNullish(siteAndPid.getSite())) &&
                            (NullChecker.isNotNullish(siteAndPid.getPid())) &&
                            (!siteAndPid.getSite().equals(vistaId))) {
                        LOG.debug("unsubscribePatient: Unsubscribing patient for another site.  site: " + siteAndPid.getSite() + "; pid: " + siteAndPid.getPid());
                        unsubscribePatientForSingleSite(siteAndPid.getSite(), siteAndPid.getPid(),resetSync);
                    }
                }
            }
        }
    }
    
    @Override
    public void unsubscribePatient(String vistaId, PatientDemographics pt, boolean cascade) {
        LOG.debug("unsubscribePatient(vistaId, pt): Entered method for vistaId: " + vistaId + "; pt: " + ((pt == null) ? "null" : pt.toString()));
        LOG.debug("unsubscribePatient: Got here by the following trace: " + CRLF + Arrays.toString(Thread.currentThread().getStackTrace()));
        unsubscribePatient(vistaId, pt.getPid(), cascade,false);
    }

    /**
     * Return true of this pid is an ICN.   A pid that has a ';' is NOT an ICN.
     * 
     * @param pid The pid to check.
     * @return TRUE if the pid is an icn.
     */
    private static boolean isIcn(String pid) {
        if ((NullChecker.isNotNullish(pid)) && (pid.contains(";"))) {
            return false;
        }
        else if ((NullChecker.isNotNullish(pid))) {
            return true; 
        }
        else {
            return false;
        }
    }
    
    /**
     * Clone or create new demographics and assign given pid and uid to it.
     * 
     * @param pt demographics to clone from.
     * @param newPid The Pid to set to cloned/new demographics.
     * @param newPatientUid The Uid to set to cloned/new demographics.
     * @return cloned/new demographics.
     */
    private PatientDemographics cloneOrCreateNewPatientDemographics(PatientDemographics pt, String newPid, String newPatientUid){
        PatientDemographics newPatientDemographics = new PatientDemographics();
        if (pt != null){
            newPatientDemographics.setData(pt.getData());
        }

        newPatientDemographics.setData("pid", newPid);
        newPatientDemographics.setData("uid", newPatientUid);

        return newPatientDemographics;
    }

    private PatientIds createPatientIds(String pid, String patientUid, String icn, String edipi, String dfn) {
        PatientIds patientIds = new PatientIds.Builder()
                .pid(pid)
                .dfn(dfn)
                .edipi(edipi)
                .icn(icn)
                .uid(patientUid)
                .build();

        return patientIds;
    }

    /**
     * This method subscribes a patient the DOD data for a patient.
     * @param patientIds 
     * 
     * @param patientIds The patient IDs from the VistA site for this patient.
     * @param vistaId The ID of the site that the request came from.
     * @param pid The pid of the patient (This is the pid for the site that requested the original sync).
     * @param pt The patient demographics for the primary site that triggered this sync.
     */
    private SyncStatus subscribePatientSecondarySiteDOD(PatientIds patientIds, String vistaId, String pid, PatientDemographics pt, SyncStatus stat) {
        LOG.debug("subscribePatientSecondarySiteDOD: Entered method: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        // Pull DoD data from JMeadows.
        //---------------------
        if (this.dodJmeadowsEnabled) {
            LOG.debug("subscribePatientSecondarySiteDOD: JMeadows is enabled attempting to subscribe DOD site: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));

            //skip jMeadows call if EDIPI is empty
            if (patientIds != null && !StringUtils.isEmpty(patientIds.getEdipi()) && !StringUtils.isEmpty(patientIds.getIcn())) {
                try {
                    String siteId = SyncDodMessageHandler.SITE_ID;

                    if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)  && (!stat.getSyncCompleteForSystemId(siteId))) {
                        LOG.warn("subscribePatientSecondarySiteDOD: subscribePatient for DOD called but patient already subscribed; pid={}; vistaId={}; No synchronization for this patient will be triggered.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : pid), vistaId);
                        return stat;
                    }

                    if (pt != null) {
                        // Create DOD site in syncstatus to track sync completion
                        String localPid = PidUtils.getPid(siteId, patientIds.getEdipi());
                        String patientUid = "urn:va:patient:" + siteId + ":" + patientIds.getEdipi() + ":" + patientIds.getEdipi(); 

                        PatientDemographics dodPatientDemographics = null;
                        //Get the PatientDemographics from JDS
                        dodPatientDemographics = patientDao.findByPid(localPid);
                        //If PatientDemographics does not exist then make an RPC call using the fetchPatientDemographicsWithDfn
                        if (dodPatientDemographics == null){
                         
                            dodPatientDemographics = cloneOrCreateNewPatientDemographics(pt, localPid, patientUid);
                            //--------------------------------------------------------------------------------------------------------------
                            // I see a potential problem here.  If a patient has an EDIPI but no ICN - there is no way in the JDS to tie the 
                            // record together with the other items in the demographics.
                            //---------------------------------------------------------------------------------------------------------------
                            if (NullChecker.isNullish(dodPatientDemographics.getIcn())) {
                                dodPatientDemographics.setData("icn", patientIds.getIcn());
                            }

                            //Save the patientDemographics
                            LOG.debug("subscribePatientSecondarySiteDOD: Patient DOD Demographics " + CRLF + dodPatientDemographics.toJSON());
                            dodPatientDemographics = patientDao.save(dodPatientDemographics);
                            LOG.debug("subscribePatientSecondarySiteDOD: Demographics returned from patientDao save method" + CRLF + ((dodPatientDemographics == null)?"null":dodPatientDemographics.toJSON()));
                         }
                        
                        HashMap<String, SyncStatus> statMap = new HashMap<String, SyncStatus>();
                        if (stat != null) {
                            statMap.put(localPid, stat);
                        }
                        stat = getPtSyncStatus(statMap, localPid, dodPatientDemographics, siteId, patientUid);   // Note I changed this to use the secondary site PID now.
                        if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)
                                && (NullChecker.isNotNullish(stat.getVistaAccountSyncStatusForSystemId(siteId).getErrorMessage()))) {
                            stat.setSyncComplete(siteId, false);
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setErrorMessage(null);
                            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                            overwriteErrorMessageForSites.add(siteId);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteDOD: Before starting JMeadows sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteDOD: Before starting JMeadows sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        else {
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteDOD: Before starting JMeadows sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, null);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteDOD: Before starting JMeadows sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }

                        PatientIds dodPatientIds = createPatientIds(localPid, patientUid, patientIds.getIcn(), patientIds.getEdipi(), patientIds.getEdipi());
                        Map message = ImmutableMap.builder()
                                .put("patientIds", dodPatientIds.toMap())
                                .put("retrycount",environment.getProperty(HmpProperties.JMEADOWS_RETRY_COUNT)!=null?Integer.parseInt(environment.getProperty(HmpProperties.JMEADOWS_RETRY_COUNT)):0)
                                .build();
                        getJmsTemplate().convertAndSend(MessageDestinations.SYNC_DOD_QUEUE, message);
                    }
                    else {
                        LOG.error("Failed to find or create demographics for pid: " + PidUtils.getPid(siteId, patientIds.getEdipi()) + ".  No synchronization will be done for DOD.");
                    }
                        
                } catch (Exception e) {
                    LOG.error("An error occurred while retrieving DoD data from jMeadows.", e);
                }

            } else LOG.debug("Patient pid:{} does not have an EDIPI, skipping DoD data jMeadows pull", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        }
        else LOG.debug("Not fetching DoD data for patient {}: jMeadows is disabled.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        
        return stat;
    }

    /**
     * This method subscribes a patient to VLER data service for a patient.
     * @param patientIds
     *
     * @param patientIds The patient IDs from the VistA site for this patient.
     * @param vistaId The ID of the site that the request came from.
     * @param pid The pid of the patient (This is the pid for the site that requested the original sync).
     * @param pt The patient demographics for the primary site that triggered this sync.
     */
    private SyncStatus subscribePatientSecondarySiteVler(PatientIds patientIds, String vistaId, String pid, PatientDemographics pt, SyncStatus stat) {
        LOG.debug("subscribePatientSecondarySiteVler: Entered method: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        // Pull dataa from VLER.
        //---------------------
        if (this.vlerEnabled) {
            LOG.debug("subscribePatientSecondarySiteVler: VLER is enabled attempting to subscribe VLER data: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));

            //skip VLER call if ICN is empty
            if (patientIds != null && !StringUtils.isEmpty(patientIds.getIcn())) {
                try {
                    String siteId = SyncVlerMessageHandler.SITE_ID;
                    if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)  && (!stat.getSyncCompleteForSystemId(siteId))) {
                        LOG.warn("subscribePatientSecondarySiteVler: subscribePatient for VLER called but patient already subscribed; pid={}; vistaId={}; No synchronization for this patient will be triggered.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : pid), vistaId);
                        return stat;
                    }

                    if (pt != null) {
                        // Create VLER site in syncstatus to track sync completion
                        String localPid = PidUtils.getPid(siteId, patientIds.getIcn());
                        String patientUid = "urn:va:patient:" + siteId + ":" + patientIds.getIcn() + ":" + patientIds.getIcn(); 
                        
                        PatientDemographics oPatientDemographics = null;
                        //Get the PatientDemographics from JDS
                        oPatientDemographics = patientDao.findByPid(localPid);
                        //If PatientDemographics does not exist then make an RPC call using the fetchPatientDemographicsWithDfn
                        if (oPatientDemographics == null){
                            if (NullChecker.isNullish(pt.getIcn())) {
                                pt.setData("icn", patientIds.getIcn());
                            }
                         
                            oPatientDemographics = cloneOrCreateNewPatientDemographics(pt, localPid, patientUid);
                            if (NullChecker.isNullish(oPatientDemographics.getIcn())) {
                                oPatientDemographics.setData("icn", patientIds.getIcn());
                            }

                            //Save the patientDemographics
                            LOG.debug("subscribePatientSecondarySiteVler: Patient VLER Demographics " + CRLF + oPatientDemographics.toJSON());
                            oPatientDemographics = patientDao.save(oPatientDemographics);
                            LOG.debug("subscribePatientSecondarySiteVler: Demographics returned from patientDao save method" + CRLF + ((oPatientDemographics == null)?"null":oPatientDemographics.toJSON()));
                        }
                        
                        // Create VLER site in syncstatus to track sync completion
                        HashMap<String, SyncStatus> statMap = new HashMap<String, SyncStatus>();
                        if (stat != null) {
                            statMap.put(localPid, stat);
                        }
                        stat = getPtSyncStatus(statMap, localPid, oPatientDemographics, siteId, patientUid);   // Note I changed this to use the secondary site PID now.
                        if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)
                                && (NullChecker.isNotNullish(stat.getVistaAccountSyncStatusForSystemId(siteId).getErrorMessage()))) {
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setSyncComplete(false);
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setErrorMessage(null);
                            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                            overwriteErrorMessageForSites.add(siteId);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVler: Before starting VLER sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVler: Before starting VLER sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        else {
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVler: Before starting VLER sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, null);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVler: Before starting VLER sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        PatientIds vlerPatientIds = createPatientIds(localPid, patientUid, patientIds.getIcn(), patientIds.getEdipi(), patientIds.getIcn());
                        Map message = ImmutableMap.builder()
                                .put("patientIds", vlerPatientIds.toMap())
                                .put("retrycount",environment.getProperty(HmpProperties.VLER_RETRY_COUNT)!=null?Integer.parseInt(environment.getProperty(HmpProperties.VLER_RETRY_COUNT)):0)
                                .build();
                        getJmsTemplate().convertAndSend(MessageDestinations.SYNC_VLER_QUEUE, message);
                    }
                    else {
                        LOG.error("Failed to find or create demographics for pid: " + PidUtils.getPid(siteId, patientIds.getEdipi()) + ".  No synchronization will be done for VLER data pull.");
                    }

                } catch (Exception e) {
                    LOG.error("An error occurred while retrieving VLER data.", e);
                }

            } else LOG.debug("Patient pid:{} does not have an ICN, skipping VLER data pull", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        }
        else LOG.debug("Not fetching VLER data for patient {}: VLER is disabled.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        
        return stat;
    }

    /**
     * This method subscribes a patient to the CDS data for the patient.
     *
     * @param patientIds The patient IDs from the VistA site for this patient.
     * @param vistaId The ID of the site that the request came from.
     * @param pid The pid of the patient (This is the pid for the site that requested the original sync).
     * @param pt The patient demographics for the primary site that triggered this sync.
     */
    private SyncStatus subscribePatientSecondarySiteCDS(PatientIds patientIds, String vistaId, String pid, PatientDemographics pt, SyncStatus stat) {
        LOG.debug("subscribePatientSecondarySiteCDS: Entered method: vistaId: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        // Pull CDS (HDR) data.
        //---------------------
        if (this.hdrEnabled) {
            LOG.debug("subscribePatientSecondarySiteCDS: HDR is enabled attempting to subscribe CDS site: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));

            //skip CDS call if ICN is empty
            if (patientIds != null && !StringUtils.isEmpty(patientIds.getIcn())) {
                try {
                    String siteId = SyncCdsMessageHandler.SITE_ID;

                    if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)  && (!stat.getSyncCompleteForSystemId(siteId))) {
                        LOG.warn("subscribePatientSecondarySiteCDS: subscribePatient for CDS called but patient already subscribed; pid={}; vistaId={}; No synchronization for this patient will be triggered.", pid, vistaId);
                        return stat;
                    }
                    
                    if (pt != null) {
                        String localPid = PidUtils.getPid(siteId, patientIds.getIcn());
                        String patientUid = "urn:va:patient:" + siteId + ":" + patientIds.getIcn() + ":" + patientIds.getIcn();
                        
                        //Get the PatientDemographics from JDS
                        PatientDemographics cdsPatientDemographics = patientDao.findByPid(localPid);
                        //If PatientDemographics does not exist then make an RPC call using the fetchPatientDemographicsWithDfn
                        if (cdsPatientDemographics == null){
                            cdsPatientDemographics = cloneOrCreateNewPatientDemographics(pt, localPid, patientUid);
                            if (NullChecker.isNullish(cdsPatientDemographics.getIcn())) {
                                cdsPatientDemographics.setData("icn", patientIds.getIcn());
                            }

                            //Save the patientDemographics
                            LOG.debug("subscribePatientSecondarySiteCDS: Patient CDS Demographics " + CRLF + cdsPatientDemographics.toJSON());
                            cdsPatientDemographics = patientDao.save(cdsPatientDemographics);
                            LOG.debug("subscribePatientSecondarySiteCDS: Demographics returned from patientDao save method" + CRLF + ((cdsPatientDemographics == null)?"null":cdsPatientDemographics.toJSON()));
                        }

                        HashMap<String, SyncStatus> statMap = new HashMap<String, SyncStatus>();
                        if (stat != null) {
                            statMap.put(localPid, stat);
                        }
                        stat = getPtSyncStatus(statMap, localPid, cdsPatientDemographics, siteId, patientUid);
                        if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)
                                && (NullChecker.isNotNullish(stat.getVistaAccountSyncStatusForSystemId(siteId).getErrorMessage()))) {
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setSyncComplete(false);
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setErrorMessage(null);
                            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                            overwriteErrorMessageForSites.add(siteId);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteCDS: Before starting HDR/CDS sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteCDS: Before starting HDR/CDS sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        else {
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteCDS: Before starting HDR/CDS sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, null);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteCDS: Before starting HDR/CDS sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        PatientIds cdsPatientIds = createPatientIds(localPid, patientUid, patientIds.getIcn(), patientIds.getEdipi(), patientIds.getIcn());
                        Map message = ImmutableMap.builder()
                                .put("patientIds", cdsPatientIds.toMap())
                                .put("retrycount",environment.getProperty(HmpProperties.HDR_RETRY_COUNT)!=null?Integer.parseInt(environment.getProperty(HmpProperties.HDR_RETRY_COUNT)):0)
                                .build();
                        getJmsTemplate().convertAndSend(MessageDestinations.SYNC_CDS_QUEUE, message);
                    }
                    else {
                        LOG.error("Failed to find or create demographics for pid: " + PidUtils.getPid(siteId, patientIds.getIcn()) + ".  No synchronization will be done for CDS.");
                    }
                } catch (Exception e) {
                    LOG.error("An error occurred while retrieving CDS (HDR) data.", e);
                }

            } else LOG.debug("Patient pid:{} does not have an ICN, skipping CDS (HDR) data pull", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        }
        else LOG.debug("Not fetching CDS (HDR) data for patient {}: HDR is disabled.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        
        return stat;
    }

    /**
     * This method subscribes a patient to the CDS data for the patient.
     * @param patientIds 
     * 
     * @param patientIds The patient IDs for this patient.
     * @param vistaId The ID of the site that the request came from.
     * @param pid The pid of the patient (This is the pid for the site that requested the original sync).
     * @param pt The patient demographics for the primary site that triggered this sync.
     */
    private SyncStatus subscribePatientSecondarySiteVlerDAS(PatientIds patientIds, String vistaId, String pid, PatientDemographics pt, SyncStatus stat) {
        LOG.debug("subscribePatientSecondarySiteVlerDAS: Entered method: vistaId: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        // Pull VLER data
        //----------------
        if (this.vlerDasEnabled) {
            LOG.debug("subscribePatientSecondarySiteVlerDAS: VLER DAS is enabled attempting to subscribe DAS site: " + (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));

            if (patientIds != null && (!StringUtils.isEmpty(patientIds.getIcn()))) {
                try {
                    String siteLocalId = "";
                    if (NullChecker.isNotNullish(patientIds.getIcn())) {
                        siteLocalId = patientIds.getIcn();
                    }
//                    else if (NullChecker.isNotNullish(patientIds.getEdipi())) {
//                        siteLocalId = "E" + patientIds.getEdipi();
//                    }
                    
                    // Create VLER DAS site in syncstatus to track sync completion
                    String siteId = SyncDasMessageHandler.SITE_ID;
                    if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)  && (!stat.getSyncCompleteForSystemId(siteId))) {
                        LOG.warn("subscribePatientSecondarySiteVlerDAS: subscribePatient for DAS called but patient already subscribed; pid={}; vistaId={}; No synchronization for this patient will be triggered.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : pid), vistaId);
                        return stat;
                    }

                    if (pt != null) {
                        String localPid = PidUtils.getPid(siteId, siteLocalId);
                        String patientUid = "urn:va:patient:" + siteId + ":" + siteLocalId + ":" + siteLocalId;

                        PatientDemographics dasPatientDemographics;
                        //Get the PatientDemographics from JDS
                        dasPatientDemographics = patientDao.findByPid(localPid);
                        //If PatientDemographics does not exist then make an RPC call using the fetchPatientDemographicsWithDfn
                        if (dasPatientDemographics == null){
                             
                            dasPatientDemographics = cloneOrCreateNewPatientDemographics(pt, localPid, patientUid);
                            //--------------------------------------------------------------------------------------------------------------
                            // I see a potential problem here.  If a patient has an EDIPI but no ICN - there is no way in the JDS to tie the 
                            // record together with the other items in the demographics.
                            //---------------------------------------------------------------------------------------------------------------
                            if (NullChecker.isNullish(dasPatientDemographics.getIcn())) {
                                dasPatientDemographics.setData("icn", patientIds.getIcn());
                            }

                            //Save the patientDemographics
                            LOG.debug("subscribePatientSecondarySiteDAS: Patient DAS Demographics " + CRLF + dasPatientDemographics.toJSON());
                            dasPatientDemographics = patientDao.save(dasPatientDemographics);
                            LOG.debug("subscribePatientSecondarySiteDAS: Demographics returned from patientDao save method" + CRLF + ((dasPatientDemographics == null)?"null":dasPatientDemographics.toJSON()));
                        }

                        HashMap<String, SyncStatus> statMap = new HashMap<String, SyncStatus>();
                        if (stat != null) {
                            statMap.put(localPid, stat);
                        }
                        stat = getPtSyncStatus(statMap, localPid, dasPatientDemographics, siteId, patientUid);
                        if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(siteId) != null)
                                && (NullChecker.isNotNullish(stat.getVistaAccountSyncStatusForSystemId(siteId).getErrorMessage()))) {
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setSyncComplete(false);
                            stat.getVistaAccountSyncStatusForSystemId(siteId).setErrorMessage(null);
                            HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                            overwriteErrorMessageForSites.add(siteId);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVlerDAS: Before starting VLER DAS sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVlerDAS: After starting VLER DAS sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        else {
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVlerDAS: Before starting VLER DAS sync pid: " + localPid + "; vistaId: " + siteId + ".  Storing sync status now.", stat));
                            stat = syncStatusDao.saveMergeSyncStatus(stat, null);
                            LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientSecondarySiteVlerDAS: After starting VLER DAS sync pid: " + localPid + "; vistaId: " + siteId + ".  After saving.", stat));
                        }
                        PatientIds dasPatientIds = createPatientIds(localPid, patientUid, patientIds.getIcn(), patientIds.getEdipi(), patientIds.getIcn());
                        Map message = ImmutableMap.builder()
                                .put("patientIds", dasPatientIds.toMap())
                                .put("retrycount",environment.getProperty(HmpProperties.VLER_DAS_RETRY_COUNT)!=null?Integer.parseInt(environment.getProperty(HmpProperties.VLER_DAS_RETRY_COUNT)):0)
                                .build();
                        getJmsTemplate().convertAndSend(MessageDestinations.SYNC_DAS_QUEUE, message);
                    }
                    else {
                        LOG.error("Failed to find or create demographics for pid: " + PidUtils.getPid(siteId, siteLocalId) + ".  No synchronization will be done for VLER DAS.");
                    }
                } catch (Throwable t) {
                    LOG.error("An error occurred while retrieving VLER data from DAS", t);
                }
            }
        } else {
            LOG.debug("Not fetching VLER data for patient {}: VlerDas is disabled.", (vistaId == null && pid == null ? LoggingUtil.outputPatientIds(patientIds) : " vistaId: " + vistaId + "; pid: " + pid));
        }
        
        return stat;
    }
    
    
    /**
     * This method subscribes a patient to the secondary sites.
     * 
     * @param vistaId
     *            The id for the site that the request came from.
     * @param pid
     *            The PID of the patient being subscribed.
     * @param secondarySiteId
     *            The secondary site that will be subscribed. (pass null or
     *            empty to subscribe all secondary sites.)
     */
    private SyncStatus subscribePatientSecondarySites(String vistaId, String pid, String secondarySiteId, SyncStatus stat, PatientIds pIds, PatientDemographics ptDemo) {
        LOG.debug("subscribePatientSecondarySites: Entered method: vistaId: " + vistaId + "; pid: " + pid);

        PatientIds patientIds = pIds;
        PatientDemographics pt = ptDemo;

        if (stat != null) {
            // Calculate expiration times.
            if (LOG.isDebugEnabled()) {
                LOG.debug(LoggingUtil.outputSyncStatus("SyncStatus before expirationRulesEngine.evaluate(): ", stat));
                LOG.debug("SyncStatus before expirationRulesEngine.evaluate(): " + CRLF + stat.toJSON());
            }
            expirationRulesEngine.evaluate(stat);
            if (LOG.isDebugEnabled()) {
                LOG.debug(LoggingUtil.outputSyncStatus("SyncStatus after expirationRulesEngine.evaluate(): ", stat));
                LOG.debug("SyncStatus after expirationRulesEngine.evaluate(): " + CRLF + stat.toJSON());
            }

            stat = syncStatusDao.saveMergeSyncStatus(stat, null);
        }

        if (pt == null) {
            pt = patientDao.findByPid(pid);
        }

        if ((this.dodJmeadowsEnabled) || (this.vlerDasEnabled) || (this.hdrEnabled) || (this.vlerEnabled)) {
            LOG.debug("subscribePatientSecondarySites: One of the secondary systems is enabled.  Subscribing patient for secondary sites.  pid: "
                    + (pid != null ? pid : LoggingUtil.outputPatientIds(pIds)));

            if (patientIds == null) {
                if (primarySiteMonitorsMap.getPrimarySiteMonitors().get(vistaId).isDataStreamDisabled()) {
                    String siteId = primarySiteMonitorsMap.getEnabledPrimarySiteId();
                    if (siteId != null) {
                        String pidIcn = pid;
                        if ((NullChecker.isNotNullish(pt.getIcn()))) {
                            pidIcn = pt.getIcn();
                        }

                        patientIds = vistaPatientIdentityService.getPatientIdentifiers(siteId, pidIcn);
                    }
                } else {
                    patientIds = vistaPatientIdentityService.getPatientIdentifiers(vistaId, pid);
                }
            }

            if (pt != null) {
                LOG.debug("subscribePatientSecondarySites: Found patient demographics for pid: "
                        + (pid != null ? pid : LoggingUtil.outputPatientIds(pIds))
                        + ";  pt: " + CRLF + pt.toJSON());

                if (NullChecker.isNullish(secondarySiteId)) {
                    if (needsSync(stat, SyncDodMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteDOD(patientIds, vistaId, pid, pt, stat);
                    }
                    if (needsSync(stat, SyncCdsMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteCDS(patientIds, vistaId, pid, pt, stat);
                    }
                    if (needsSync(stat, SyncDasMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteVlerDAS(patientIds, vistaId, pid, pt, stat);
                    }
                    if (needsSync(stat, SyncVlerMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteVler(patientIds, vistaId, pid, pt, stat);
                    }
                } else if (needsSync(stat, secondarySiteId)) {
                    if (secondarySiteId.equals(SyncDodMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteDOD(patientIds, vistaId, pid, pt, stat);
                    } else if (secondarySiteId.equals(SyncCdsMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteCDS(patientIds, vistaId, pid, pt, stat);
                    } else if (secondarySiteId.equals(SyncDasMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteVlerDAS(patientIds, vistaId, pid, pt, stat);
                    } else if (secondarySiteId.equals(SyncVlerMessageHandler.SITE_ID)) {
                        stat = subscribePatientSecondarySiteVler(patientIds, vistaId, pid, pt, stat);
                    }
                }
            } else {
                LOG.error("subscribePatientSecondarySites: Failed to find patient demographics for pid: "
                        + (pid != null ? pid : LoggingUtil.outputPatientIds(pIds))
                        + ".  Secondary sites will not be synchronized.");
            }
        }

        return stat;

    }

    /**
     * Checks to see if a patient needs a sync for a secondary site.
     * A patient needs a sync for a secondary site if their sync status is null (indicating that they aren't synced at all yet)
     * or if the site is expired.
     * 
     * @param syncStatus The patient's sync status.
     * @param vistaId The site hash of the site being checked.
     * @return true if the patient needs a sync from that site.
     */
    private boolean needsSync(SyncStatus syncStatus, String vistaId) {
        if (syncStatus == null) {
            return true;
        }
        return syncStatus.needsSync(vistaId);
    }

    /**
     * This method is used to subscribe a patient for a single site.
     * 
     * @param vistaId
     *            The site being subscribed.
     * @param pid
     *            The pid being subscribed
     */
    private SyncStatus subscribePatientForSingleSite(String vistaId, String pid, SyncStatus stat) {
        LOG.debug("subscribePatientForSingleSite: Entered method for vistaId: " + vistaId + "; pid: " + pid);
        if (primarySiteMonitorsMap.getPrimarySiteMonitors().get(vistaId).isDataStreamDisabled()) {
            PatientDemographics pd = patientDao.findByPid(pid);
            // pd is null if patient is unsynced
            if (pd == null) {
                PatientSelect ptSelect = patientSelectDao.findOneByPid(pid);
                if (ptSelect != null)
                    pd = PtSelectToPtDemographicsUtil.convertPtSelectToDemographics(ptSelect, vistaId);
                patientDao.save(pd);
            }
            if (pd != null) {
                HashMap<String, SyncStatus> statMap = new HashMap<String, SyncStatus>();
                if (stat != null) {
                    statMap.put(pid, stat);
                }
                SyncStatus syncStatus = getPtSyncStatus(statMap, pid, pd, vistaId, null);
                SyncStatus.VistaAccountSyncStatus vstat = syncStatus.getVistaAccountSyncStatusForSystemId(vistaId);
                vstat.setSyncComplete(true);
                vstat.setErrorMessage("Site Down");

                HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                overwriteErrorMessageForSites.add(vistaId);
                stat = syncStatusDao.saveMergeSyncStatus(syncStatus, overwriteErrorMessageForSites);
                LOG.debug(LoggingUtil.outputSyncStatus("subscribePatientForSingleSite: Stored Sync Status: ", stat));
            }
        } else {
            Map<String, Object> params = new HashMap<>();
            params.put("server", environment.getProperty(HmpProperties.SERVER_ID));
            params.put("command", "putPtSubscription");

            String dfn = PidUtils.getDfn(pid);
            if (StringUtils.hasText(dfn)) {
                params.put("localId", dfn);
            } else {
                throw new IllegalArgumentException("Missing dfn for subscribing patients.");
            }

            if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(vistaId) != null) &&
                    stat.getVistaAccountSyncStatusForSystemId(vistaId).isSyncComplete()
                    && stat.getVistaAccountSyncStatusForSystemId(vistaId).isSyncReceivedAllChunks())
            {
                LOG.warn("subscribePatientForSingleSite: subscribePatient called but patient already subscribed; pid={}; vistaId={}; No synchronization for this patient will be triggered.", pid, vistaId);
                return stat;
            }
            // US1999 : Set sync status to false here before the subscription
            // starts as the patient
            // has already initiated the subscription but not received it yet

            // Get the PatientDemographics from JDS
            PatientDemographics pt = patientDao.findByPid(pid);

            // If PatientDemographics does not exist then make an RPC call using
            // the fetchPatientDemographicsWithDfn
            if (pt == null) {
                VistaDataChunk patientChunk = fetchPatientDemographicsWithDfn(vistaId, dfn);
                pt = conversionService.convert(patientChunk, PatientDemographics.class);

                // Save the patientDemographics
                LOG.debug("handlePatientDataItem: Demographics converted from Patient Chunk" + CRLF + pt.toString());
                pt = patientDao.save(pt);
                LOG.debug("handlePatientDataItem: Demographics returned from patientDao save method" + CRLF + ((pt == null) ? "null" : pt.toString()));
            }
            // Get the SyncStatus
            //--------------------
            HashMap<String, SyncStatus> statMap = new HashMap<String, SyncStatus>();
            if (stat != null) {
                statMap.put(pid, stat);
            }
            stat = getPtSyncStatus(statMap, pid, pt, vistaId, null);
            if ((stat != null) && (stat.getVistaAccountSyncStatusForSystemId(vistaId) != null)
                    && (NullChecker.isNotNullish(stat.getVistaAccountSyncStatusForSystemId(vistaId).getErrorMessage()))) {
                stat.getVistaAccountSyncStatusForSystemId(vistaId).setSyncComplete(false);
                stat.getVistaAccountSyncStatusForSystemId(vistaId).setErrorMessage(null);
                HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
                overwriteErrorMessageForSites.add(vistaId);
                LOG.debug(LoggingUtil.outputSyncStatus("Before Storing sync status before actual sync - pid: " + pid, stat));
                stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                LOG.debug(LoggingUtil.outputSyncStatus("After Storing sync status before actual sync - pid: " + pid, stat));
            }
            else {
                LOG.debug(LoggingUtil.outputSyncStatus("Before Storing sync status before actual sync - pid: " + pid, stat));
                // Save the SyncStatus object
                stat = syncStatusDao.saveMergeSyncStatus(stat, null);
                LOG.debug(LoggingUtil.outputSyncStatus("After Storing sync status before actual sync - pid: " + pid, stat));
            }
            String url = VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_STREAM_API_RPC_URI;
            JsonNode json = synchronizationRpcTemplate.executeForJson(url, params);

            if (json.has("error")) {
                String msg = json.path("error").path("message").asText();
                LOG.error("VistA event stream error: {}", msg);
            }
        }
        
        return stat;
    }
    
    @Override
    public void subscribePatient(String vistaId, String pid, boolean cascade) {
        LOG.debug("subscribePatient: Entered method for vistaId: " + vistaId + "; pid: " + pid);
        LOG.debug("subscribePatient: Got here by the following trace: " + CRLF + Arrays.toString(Thread.currentThread().getStackTrace()));

        if (NullChecker.isNullish(pid)) {
            LOG.warn("subscribePatient: pid was null.  No subscription will be performed.");
            return;
        }
        
        SyncStatus stat = syncStatusDao.findOneByPid(pid);

        // Subscribe for this site.
        // --------------------------
        if (NullChecker.isNotNullish(vistaId)) {
            LOG.debug("subscribePatient: Subscribing patient for original request.  site: " + vistaId + "; pid: " + pid);
            stat = subscribePatientForSingleSite(vistaId, pid, stat);
        }
        
        if (cascade) {
            // Now lets see if this patient has other sites where they have data
            // and subscribe them too.
            // ------------------------------------------------------------------------------------------
            List<SiteAndPid> oaSiteAndPid = getPatientVistaSites(pid);
            if (NullChecker.isNotNullish(oaSiteAndPid)) {
                for (SiteAndPid siteAndPid : oaSiteAndPid) {
                    if ((NullChecker.isNotNullish(siteAndPid.getSite())) && (NullChecker.isNotNullish(siteAndPid.getPid())) && (!siteAndPid.getSite().equals(vistaId))) {
                        LOG.debug("subscribePatient: Subscribing patient for another site.  site: " + siteAndPid.getSite() + "; pid: " + siteAndPid.getPid());
                        stat = subscribePatientForSingleSite(siteAndPid.getSite(), siteAndPid.getPid(), stat);
                    }
                }
            }
            // Subscribe secondary sites.
            subscribePatientSecondarySites(vistaId, pid, null, stat, null, null);
        }
        checkForMissingSites(pid);
    }

    @Override
    public void subscribePatient(JsonObject mvi, String pid, String edipi)
    {
        LOG.debug("subscribePatient(mvi, pid, edipi): Entered method. mvi: "+ mvi.toString() + " pid: " + pid  + "; edipi: " + edipi);

        JsonObject demographics = mvi.getAsJsonObject("demographics");

        PointInTime dob = new PointInTime(demographics.get("dob").getAsString());
        String last4 = null;
        String last5 = null;
        String familyName = demographics.get("familyName").getAsString();
        String ssn = demographics.get("ssn").getAsString();
        String icn = mvi.get("icn").getAsString();
        String dfn = null;

        if (pid != null) {
            dfn = PidUtils.getDfn(pid);
        }

        if (ssn != null && ssn.length() == 9) {
            last4 = ssn.substring(5);
        }

        if (familyName != null && familyName.length()>0) {
            if (last4 != null) {
                last5 = familyName.substring(0, 1).toUpperCase() + last4;
            }
        }

        PatientIds patientIds = new PatientIds.Builder()
            .pid(pid)
            .dfn(dfn)
            .edipi(edipi)
            .icn(icn)
            .build();

        // Create Demographics
        PatientDemographics ptDemographics = new PatientDemographics();

        ptDemographics.setData("birthDate", dob);
        ptDemographics.setData("ssn", ssn);
        ptDemographics.setData("last4", last4);
        ptDemographics.setData("last5", last5);
        ptDemographics.setData("icn", icn);
        ptDemographics.setData("familyName", familyName);
        ptDemographics.setData("givenNames", demographics.get("givenNames").getAsString());
        ptDemographics.setData("genderCode", demographics.get("genderCode").getAsString());
        ptDemographics.setData("fullName", demographics.get("fullName").getAsString());
        ptDemographics.setData("displayName", demographics.get("displayName").getAsString());
        ptDemographics.setData("genderName", demographics.get("genderName").getAsString());

        if (pid != null) {
            ptDemographics.setData("pid", pid);
            ptDemographics.setData("localId", dfn);
        }

        LOG.debug("subscribePatient(mvi, pid, edipi): subscribing to secondary sites");

        subscribePatientSecondarySites(null, null, null, null, patientIds, ptDemographics);
        LOG.debug("subscribePatient(mvi, pid, edipi): subscribed to secondary sites");
    }
    
    @Override
    public void subscribePatient(String prioritySelect, List<String> sitesToSync, String pid) {
    	LOG.debug("subscribePatient: Entered method for prioritization: " + prioritySelect + "; sitesToSync:" + sitesToSync.toString() + "; pid: " + pid);
        LOG.debug("subscribePatient: Got here by the following trace: " + CRLF + Arrays.toString(Thread.currentThread().getStackTrace()));
        
        if (NullChecker.isNullish(pid)) {
            LOG.warn("subscribePatient: pid was null.  No subscription will be performed.");
            return;
        }
        
        if (NullChecker.isNullish(prioritySelect)) {
            LOG.warn("subscribePatient: prioritySelect was null.  No subscription will be performed.");
            return;
        }
                
        if(prioritySelect.equals("userSelect")) {
        	if (NullChecker.isNullish(sitesToSync)) {return;}
        	
            SyncStatus stat = syncStatusDao.findOneByPid(pid);
        	
        	List<SiteAndPid> oaSiteAndPid = getPatientVistaSites(pid);
        	List<SiteAndPid> oaSecondarySiteAndPid = getSecondarySites(pid);
        	if ((oaSiteAndPid == null) && (NullChecker.isNotNullish(oaSecondarySiteAndPid))) {
        	    oaSiteAndPid = oaSecondarySiteAndPid;
        	}
        	else if ((oaSiteAndPid != null) && (NullChecker.isNotNullish(oaSecondarySiteAndPid))) {
        	    oaSiteAndPid.addAll(oaSecondarySiteAndPid);
        	}
        	if (NullChecker.isNullish(oaSiteAndPid)) {return;}
        	
        	List<SiteAndPid> filteredPrioritizedSiteAndPids = filterPrioritizedSiteList(sitesToSync, oaSiteAndPid);
        	
        	if(NullChecker.isNullish(filteredPrioritizedSiteAndPids) ) {
        		return;
        	} 
        		
        	for(SiteAndPid siteToSubscribe : filteredPrioritizedSiteAndPids) {  			
        		String siteString = siteToSubscribe.getSite();				
        		LOG.debug("subscribePatient, prioritized: Subscribing patient for site: " + siteString + "; pid: " + siteToSubscribe.getPid());
        		if (isVistaSite(siteString)) {
        		    stat = subscribePatientForSingleSite(siteString, siteToSubscribe.getPid(), stat);
        		}
        		else {
                    stat = subscribePatientSecondarySites(PidUtils.getVistaId(pid), pid, siteString, stat, null, null);
        		}
        	} 	
        } 
        else { 
            LOG.error("subscribePatient, prioritized: prioritySelect was not 'userSelect'.  Performing a standard synchronization.  pid: " + pid);
            String vistaId = PidUtils.getVistaId(pid);
            subscribePatient(vistaId, pid, true);
        }
    }

    private void checkForMissingSites(String pid) {
        LOG.debug("checkForMissingSites: Entered method for pid: " + pid);
        List<SiteAndPid> patientSites = new ArrayList<SiteAndPid>();
        List<SiteAndPid> missingSites = new ArrayList<SiteAndPid>();

        patientSites = getPatientVistaSites(pid);

        SyncStatus stat = syncStatusDao.findOneByPid(pid);

        LOG.debug("checkForMissingSites: Patient Sites: " + patientSites.toString() +" Sync: "+ stat.toJSON());

        // Check which sites are missing
        Map<String, VistaAccountSyncStatus> mapVistaSyncStatus = stat.getSyncStatusByVistaSystemId();
        if (NullChecker.isNotNullish(mapVistaSyncStatus)) {
            for (SiteAndPid site : patientSites) {
                VistaAccountSyncStatus oVistaSyncStatus = mapVistaSyncStatus.get(site.getSite());

                if (oVistaSyncStatus == null) {
                    missingSites.add(site);
                }
                else {
                    if (oVistaSyncStatus.getErrorMessage() != null) {
                        missingSites.add(site);
                    }
                }
            }
        }

        LOG.debug("checkForMissingSites: Missing Sites (if any): " + missingSites.toString());

        // Sync Missing Sites
        for (SiteAndPid missing : missingSites) {
            subscribePatientForSingleSite(missing.getSite(), missing.getPid(), stat);
        }

        return;
    }

    /**
     * This produces a list of all the secondary sites.
     * 
     * @param originalRequestPid  This is the pid for the original request.   We need that pid and not the Secondary site pid.
     * @return The list of all the secondary sites.
     */
    private List<SiteAndPid> getSecondarySites(String originalRequestPid) {
        List<SiteAndPid> oaSiteAndPid = new ArrayList<SiteAndPid>();
        
        SiteAndPid oSiteAndPid = createSiteAndPid(SyncDodMessageHandler.SITE_ID, originalRequestPid);
        oaSiteAndPid.add(oSiteAndPid);
        oSiteAndPid = createSiteAndPid(SyncCdsMessageHandler.SITE_ID, originalRequestPid);
        oaSiteAndPid.add(oSiteAndPid);
        oSiteAndPid = createSiteAndPid(SyncDasMessageHandler.SITE_ID, originalRequestPid);
        oaSiteAndPid.add(oSiteAndPid);
        oSiteAndPid = createSiteAndPid(SyncVlerMessageHandler.SITE_ID, originalRequestPid);
        oaSiteAndPid.add(oSiteAndPid);
        
        return oaSiteAndPid;
    }

    /**
     * This creates a single site and PID and fills it in.
     * 
     * @param siteId The site ID to be put in.
     * @param pid The pid to be put in.
     * @return The SiteAndPid that was created
     */
    private SiteAndPid createSiteAndPid(String siteId, String pid) {
        SiteAndPid oSiteAndPid = new SiteAndPid();
        oSiteAndPid.setSite(siteId);
        oSiteAndPid.setPid(pid);
        return oSiteAndPid;
    }

    //Filters out sites in the user-provided list of prioritized sites that are not in the list of the patient's sites
    //Adds nonprioritized sites in the list of the patient's sites to the end of the resulting list.
    private List<SiteAndPid> filterPrioritizedSiteList(List<String> initialPrioritizedStringList, List<SiteAndPid> patientSiteAndPidList){
    	
    	LOG.debug("filterPrioritizedSiteList: Entering method");
    	
    	List<String> patientSiteStringList= new ArrayList<String>();
    	List<String> patientSitePidList = new ArrayList<String>();
    	
    	List<SiteAndPid> filteredPrioritizedSiteAndPidList = new ArrayList<SiteAndPid>();
    	List<String> filteredPrioritizedSiteStrings = new ArrayList<String>();

    	//Separate SiteAndPids from patientSiteList into an array of siteId's and an array of pid's
    	for(SiteAndPid patientSiteAndPid : patientSiteAndPidList) {
    		patientSiteStringList.add(patientSiteAndPid.getSite() );
    		patientSitePidList.add(patientSiteAndPid.getPid() );
    	}
    	
    	//Combine and add siteId's and pid's present in list of prioritized site strings into SiteAndPid's and add them to
    	//the list of prioritized SiteAndPid's
    	for(String prioritySiteString : initialPrioritizedStringList) {    		
    		//Skip adding a site from the initial priority list if:
    		//     1. It is not in the list of patient site strings
    		//	   2. It is already in the filtered priority list
    		if(patientSiteStringList.contains(prioritySiteString) && !filteredPrioritizedSiteStrings.contains(prioritySiteString) ){
        		SiteAndPid filteredPrioritizedSiteAndPid = new SiteAndPid();
        		filteredPrioritizedSiteAndPid.setSite(prioritySiteString);
        		filteredPrioritizedSiteAndPid.setPid(patientSitePidList.get(patientSiteStringList.indexOf(prioritySiteString) ) );
        		
        		filteredPrioritizedSiteAndPidList.add(filteredPrioritizedSiteAndPid);
        		filteredPrioritizedSiteStrings.add(prioritySiteString);
    		} else {
    			LOG.debug("filterPrioritizedSiteList: " + prioritySiteString + " is either not in the patient site list or is already in the filtered site list: " + filteredPrioritizedSiteStrings.toString() );
    		}
    	}
    	
    	LOG.debug("filterPrioritizedSiteList: Now checking for nonpriortized patient sites...");
    	//Add sites from the list of all patient sites that are not already in the filtered prioritized list
    	for(SiteAndPid patientSiteAndPid : patientSiteAndPidList){
    		if(!filteredPrioritizedSiteStrings.contains(patientSiteAndPid.getSite())){
    			filteredPrioritizedSiteAndPidList.add(patientSiteAndPid);
    			//This next line shouldn't be necessary, but do it just in case...
    			filteredPrioritizedSiteStrings.add(patientSiteAndPid.getSite());
    			
    			LOG.debug("filteredPrioritizedSiteList: Added " + patientSiteAndPid.getSite() + " to filtered prioritized site list.");
    		}
    	}

    	LOG.debug("filteredPrioritizedSiteList: Resulting filtered, prioritized site list: " + filteredPrioritizedSiteStrings.toString());
    	return filteredPrioritizedSiteAndPidList;
    }
    
    private SyncStatus createSyncStatus(String vistaId, PatientDemographics pt) {
        SyncStatus stat = new SyncStatus();
        if (NullChecker.isNotNullish(pt.getIcn())) {
            stat.setData("pid", pt.getIcn());
        }
        else {
            stat.setData("pid", pt.getPid());
        }
        stat.setData("displayName",pt.getDisplayName());
        
        Set<String> qdfns = new HashSet<String>(pt.getPatientIds());
        qdfns.remove(pt.getIcn());
        qdfns.remove(pt.getSsn());
        qdfns.remove(pt.getPid());
        stat.setData("localPatientIds", StringUtils.collectionToCommaDelimitedString(qdfns));

        SyncStatus.VistaAccountSyncStatus vstat = new SyncStatus.VistaAccountSyncStatus();
        vstat.setPatientUid(UidUtils.getPatientUid(vistaId, pt.getLocalPatientIdForSystem(vistaId)));
        vstat.setDfn(pt.getLocalPatientIdForSystem(vistaId));

        Map<String, Object> syncStatusByVistaSystemId = new HashMap<>();
        syncStatusByVistaSystemId.put(vistaId, vstat);

        stat.setData("syncStatusByVistaSystemId", syncStatusByVistaSystemId);
        return stat;
    }

    // It now serves both patient and operational data purposes.
    @Override
    public VprUpdateData fetchUpdates(String vistaId, String division, String previousLastUpdate) {
        // Synchronized because, in the case where there is a change to patient subscription,
        // either subscribing new or removing a patient subscription,
        // we don't want to collide with status checks.
        // We can safely move this when we move the sync status check elsewhere.

        LOG.debug("fetchUpdates: Entered method: lastUpdate: " + previousLastUpdate + "; vistaId: " + vistaId + "; division: " + division);

        Map<String, Object> params = new HashMap<>();

        params.put("command", "getPtUpdates");
        params.put("lastUpdate", previousLastUpdate);
        params.put("getStatus", true);  // Temp flag for experimentation; check sync statii against VISTA
        params.put("max", asyncBatchSize);
        String version = environment.getProperty(HmpProperties.VERSION);
        params.put("hmpVersion", version);
        params.put("extractSchema",EXTRACT_SCHEMA);

        List<VistaDataChunk> chunks = new ArrayList<VistaDataChunk>();

        params.put("server", environment.getProperty(HmpProperties.SERVER_ID));

        String url = VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_STREAM_API_RPC_URI;
        LOG.debug("fetchUpdates: Calling RPC to retrieve patient data - RPC URL: " + url);
        LoggingUtil.dumpMap(params);

        JsonNode json = synchronizationRpcTemplate.executeForJson(url, params);

        JsonNode data = json.path("data");
        String newlyReceivedUpdate = data.get("lastUpdate").asText();

        ArrayNode items = (ArrayNode) json.findValue("items");

        Map<String, PatientDemographics> patMap = new HashMap<>();
        Map<String, SyncStatus> statMap = new HashMap<>();
        VprUpdateData rslt = new VprUpdateData();
        if (items != null) {
            LOG.debug("fetchUpdates: Processing " + items.size() + " json items.");
        }
        else {
            LOG.debug("fetchUpdates: Processing 0 json items.  The array was null.");
        }
        for (JsonNode item : items) {
            boolean isBatch = false;
            JsonNode bnode = item.path("batch");
            if(bnode!=null && !bnode.isMissingNode()) {
                isBatch = bnode.asBoolean();
            }
            String domainName = item.path("collection").asText();
            int tot = item.path("total").asInt();
            int idx = item.path("seq").asInt();
            String pid = item.path("pid").asText();
            JsonNode object = item.path("object");
            if(domainName.equalsIgnoreCase("syncCommand")) {
                handleSyncCommand(vistaId, chunks, url, item, object);
            } else if (domainName.equalsIgnoreCase("patient") || !StringUtils.hasText(pid)) {   // If the record is basically operational data (not tied to an existing patient)
                if (!item.path("deletes").isMissingNode()) {
                    LOG.debug("fetchUpdates: Processing 'delete' json item.");
                    JsonNode deletesNode = item.path("deletes");
                    for (JsonNode deleteNode : deletesNode) {
                        String uid = deleteNode.get("uid").textValue();
                        rslt.getUidsToDelete().add(uid);
                    }
                } else if (!item.path("error").isMissingNode()) {
                    LOG.debug("fetchUpdates: Processing 'error' json item.");
                    JsonNode errorsNode = item.path("error");
                    for (JsonNode errorNode : errorsNode) {
                        String msg = errorNode.path("error").textValue();
                        LOG.error("error in VPR update data: " + msg);
                    }
                } else {
                    LOG.debug("fetchUpdates: Processing 'operational data' json item.");
                    handleOperationalDataItem(vistaId, chunks, url, domainName, tot, idx, object, statMap, isBatch);
                }

            } else {
                LOG.debug("fetchUpdates: Processing 'patient data' json item.");
                handlePatientDataItem(vistaId, division, chunks, url, patMap, item, domainName, tot, idx, pid, object, statMap, isBatch);
            }
        }

        ArrayNode wpd = (ArrayNode)data.path("waitingPids");
        List<String> pendingPids = new ArrayList<>();
        for(JsonNode wp: wpd) {pendingPids.add(wp.asText());}

        ArrayNode ppd = (ArrayNode)data.path("processingPids");
        List<String> processingPids = new ArrayList<>();
        for(JsonNode pp: ppd) {processingPids.add(pp.asText());}

        for(String pid: pendingPids) {
            SyncStatus stat = statMap.get(pid);
            if(stat==null) {
                stat = syncStatusDao.findOneByPid(pid);
            }
            if(stat!=null && stat.getVistaAccountSyncStatusForSystemId(vistaId) != null) {
                stat.getVistaAccountSyncStatusForSystemId(vistaId).setQueuePosition(pendingPids.indexOf(pid) + 1);
                
                // Use merge and put to prevent over-writing statMap with incomplete syncStatus
                this.mergeAndPutSyncStatus(statMap, pid, stat);
            }
        }

        for(String pid: processingPids) {
            SyncStatus stat = statMap.get(pid);
            if(stat==null) {
                stat = syncStatusDao.findOneByPid(pid);
            }
            if(stat!=null && stat.getVistaAccountSyncStatusForSystemId(vistaId) != null) {
                stat.getVistaAccountSyncStatusForSystemId(vistaId).setQueuePosition(processingPids.indexOf(pid) + 1);
                
                // Use merge and put to prevent over-writing statMap with incomplete syncStatus
                this.mergeAndPutSyncStatus(statMap, pid, stat);
            }
        }


        // If it does a NEW one in the same session as the COMPLETE one, it borks.
        // If NEW and COMPLETE are in different responses, it work sfine.
        for (SyncStatus stat : statMap.values()) {
            LOG.debug(LoggingUtil.outputSyncStatus("fetchUpdates: Storing SyncStatus to database (before storing): ", stat));
            stat = syncStatusDao.saveMergeSyncStatus(stat, null);
            LOG.debug(LoggingUtil.outputSyncStatus("fetchUpdates: Storing SyncStatus to database (after storing): ", stat));
            broadcastSyncStatus(stat);
        }

        JsonNode statii = data.get("syncStatii");
        LOG.debug("fetchUpdates: chunks.size(): " + chunks.size());
        LOG.debug("fetchUpdates: statii was " + ((statii == null)?"null":"not null"));
        if (chunks.size() == 0 && statii != null && statii.isArray()) {
            // For now we must check only when the return set is empty;
            // When we are able to implement status "3" (which means VISTA thinks we have gotten all the records) we can check regardless of chunk payload.
            LOG.debug("fetchUpdates: calling SyncUtils.resolveSyncStatusDifferences.");
            SyncUtils.resolveSyncStatusDifferences(syncStatusDao.findAllPatientStatii(), (ArrayNode)statii, syncStatusDao, this, vistaId);
        }
        else {
            LOG.debug("fetchUpdates: NOT calling SyncUtils.resolveSyncStatusDifferences.");
        }

        if (chunks != null) {
            LOG.debug("fetchUpdates: Adding " + chunks.size() + " chunks to the return result.");
        }

        rslt.setChunks(chunks);
        rslt.setLastUpdate(newlyReceivedUpdate);
        LOG.debug("fetchUpdates: setting return result last update to: " + newlyReceivedUpdate);

        return rslt;
    }
    
    public JsonNode getVistaHealthCheck(String vistaId, String division) {
        Map<String, Object> params = new HashMap<>();
        params.put("command", "checkHealth");
        params.put("server", environment.getProperty(HmpProperties.SERVER_ID));
        String url = VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VPR_STREAM_API_RPC_URI;
        return synchronizationRpcTemplate.executeForJson(url, params);
    }

    private void handleSyncCommand(String vistaId, List<VistaDataChunk> chunks, String url, JsonNode item, JsonNode object) {
        LOG.debug("handleSyncCommand: Entering method. vistaId: " + vistaId + "; url: " + url);
        String command = object.path("command").textValue();
        LOG.debug("handleSyncCommand: command: " + command);
        if(command.equalsIgnoreCase("deleteDomainForPatient") || command.equalsIgnoreCase("deleteUidForPatient")) {
            String pid = object.path("pid").textValue();
            PatientDemographics dem = patientDao.findByPid(pid);
            if(dem!=null) {
                VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(vistaId, url, object, "syncCommand", 0, 0, dem, VistaDataChunk.getProcessorParams(vistaId, dem.getIcn(), true), true, VistaDataChunk.COMMAND);
                chunks.add(chunk);
            } else {
                // The patient was removed, so the domain is already gone. We can safely ignore this command message for this patient.
                LOG.info("Patient "+pid+" was missing when deleteDomainForPatient command message was received.");
            }
        } else if(command.equalsIgnoreCase("deleteOperationalDomain") || command.equalsIgnoreCase("deleteOperationalUid")) {
            VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(vistaId, url, object, "syncCommand", 0, 0, null, VistaDataChunk.getProcessorParams(vistaId, null, false), true, VistaDataChunk.COMMAND);
            chunks.add(chunk);
        }
    }


    private void broadcastSyncStatus(SyncStatus stat) {
        Map<String, Object> message = new HashMap<String, Object>();
        message.put("eventName", "syncStatusChange");
        message.put("syncStatus", stat.getData());
        bcSvc.broadcastMessage(message);
    }

    /**
     * This method will retrieve the patient status information..   It first checks to see if the status is already
     * in the status map that we are tracking.  If it is, then it uses that one.  If it is not, then it checks to
     * see if it is in the database.  If it is not, then it creates one.
     *
     * @param statMap The SyncStatus objects we are tracking as part of this set of data chunks we are processing.
     * @param pid The patient ID.
     * @param pt The patient demographics.
     * @param vistaId The vista site hash code.
     * @return The SyncStatus for this patient.
     */
    private SyncStatus getPtSyncStatus(Map<String, SyncStatus> statMap, String pid, PatientDemographics pt, String vistaId, String patientUid) {
        SyncStatus syncStat = null;

        // First check to see if we have all the data that we are expecting.
        //-------------------------------------------------------------------
        if ((statMap == null) || (NullChecker.isNullish(pid)) || (pt == null)) {
            throw new InvalidDataAccessResourceUsageException("Unable to locate sync status - the pid, pt, or statMap was not available.");
        }

        syncStat = statMap.get(pid);
        if (syncStat == null) {
            // Not in the map, so lets get it from the database.
            //--------------------------------------------------
            LOG.debug("getPtSyncStatus: statMap did NOT contain the syncStatus for pid: " + pid);
            syncStat = syncStatusDao.findOneByPid(pt.getPid());
        }
        else {
            LOG.debug("getPtSyncStatus: statMap contained the syncStatus for pid: " + pid);
        }

        // Not in the map or the database - create it.
        //---------------------------------------------
        if (syncStat == null) {
            LOG.debug("getPtSyncStatus: sync status was not in the map or the database for pid: " + pid + ".  Creating it now from scratch.");
            syncStat = createSyncStatus(PidUtils.getVistaId(pt.getPid()), pt);
        }

        // Now lets verify that there is an entry for the facility that we are processing.
        //---------------------------------------------------------------------------------
        VistaAccountSyncStatus siteSyncStatus = syncStat.getVistaAccountSyncStatusForSystemId(vistaId);
        if (siteSyncStatus == null) {
            String localPatientUid = "";
            if (NullChecker.isNotNullish(patientUid)){
                LOG.debug("Using patientUid");
                localPatientUid = patientUid;
            }
            else{
                localPatientUid = pt.getUid();
                LOG.debug("Using pt.getUid()");
            }
                
            syncStat.addSite(localPatientUid, PidUtils.getDfn(pid), vistaId);
            
            LOG.debug("getPtSyncStatus: SyncStatus did NOT contain an entry for vistaId: " + vistaId + " for pid: " + pid + ".  Adding a new one now.");
        }
        else {
            LOG.debug("getPtSyncStatus: SyncStatus contained an entry for vistaId: " + vistaId + " for pid: " + pid);
            if (!isVistaSite(vistaId) && syncStat.needsSync(vistaId)) {
                syncStat.setSyncComplete(vistaId, false);
            }
        }

        return syncStat;
    }


    private void handlePatientDataItem(String vistaId, String division, List<VistaDataChunk> chunks,
                                       String url, Map<String, PatientDemographics> patMap, JsonNode item,
                                       String domainName, int tot, int idx, String pid, JsonNode object, Map<String, SyncStatus> statMap, boolean isBatch) {
        LOG.debug("handlePatientDataItem: Entered handlePatientItem method; domainName=" + domainName);
        if (domainName.equals("syncStatus")) {
            LOG.debug("handlePatientDataItem: Entered handlePatientItem method.  domainName='syncStatus'; tot: " + tot + "; idx: " + idx);
            
            // Now, update sync status stuff.
            // This should be the end of this patient's sync stream - so if we have a mishmash, we may want to acknowledge it as complete with errors.
            PatientDemographics pt = patientDao.findByPid(pid);
            if (pt != null) {
                LOG.debug("handlePatientDataItem: Found (non-null) Patient. Patient: " + pt.toJSON());
                
                SyncStatus stat = getPtSyncStatus(statMap, pt.getPid(), pt, vistaId, null);

                HashSet<String> overwriteErrorMessageForSites = new HashSet<>();
//                overwriteErrorMessageForSites.add(vistaId);   We do not set complete - we should not overwrite the error here.

                // Record that we have received all the chunks from VistA.
                //--------------------------------------------------------
                stat.setSyncReceivedAllChunks(vistaId, true);

                // Store out what we have gathered up in memory
                //---------------------------------------------
                LOG.debug(LoggingUtil.outputSyncStatus("handlePatientDataItem: Completed receiving data from primary site (But NOT all stored yet). pid: " + pt.getPid() + "; vistaId: " + vistaId + ".  Saving SyncStatus now: ", stat));
                stat = syncStatusDao.saveMergeSyncStatus(stat, overwriteErrorMessageForSites);
                statMap.remove(pt.getPid());
                LOG.debug(LoggingUtil.outputSyncStatus("handlePatientDataItem: Completed receiving data from primary site (But NOT all stored yet): pid: " + pt.getPid() + "; vistaId: " + vistaId + ". After saving SyncStatus: ", stat));

                pt.setLastUpdated(PointInTime.now());
                patientDao.save(pt);

                // Set the sync to be completed...  We want to do this after JMeadows - but regardless if JMeadows is successful.
                // Note that the actual storing of this value will not happen until it is processed as a chunk.
                //----------------------------------------------------------------------------------------------------------------
                stat.setSyncComplete(vistaId, true);     

                // Note that this chunk must be added last.   So that it is the last message processed and stored in the JDS.
                //-----------------------------------------------------------------------------------------------------------
                JsonNode dataNode = POMUtils.parseJSONtoNode(stat.toJSON());
                LOG.debug("handlePatientDataItem: Completed receiving data from primary site. Creating VistaDataChunk for SyncStatus.  pid:" + pt.getPid() + 
                          "; + vistaId + " + "; syncStatus: " + CRLF + stat.toJSON());
                VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(vistaId, url, dataNode, "syncStatus", idx, tot, pt, VistaDataChunk.getProcessorParams(vistaId, pid, false), false);
                chunks.add(chunk);
                
                // Commented out the place the HDR is called in VA code - vor VistaCoreEx We do this
                // differently.
//                if(this.hdrEnabled) {
//                    // TODO: How do I get the correct division?
//                   syncService.sendHdrPatientImportMsg(pid, division, vistaId);
//                }
            }
            else {
                LOG.error("handlePatientDataItem: Could not complete sync for patient.  Failed to retrieve patient demographics.  vistaId: " + vistaId + "; pid: " + pid);
            }

        } else if (domainName.equals("syncStart")) {
            LOG.debug("handlePatientDataItem: Entered handlePatientItem method.  domainName='syncStart'");
            // Handle initial patient demographic object saving here
            if (object.isNull())
                throw new DataRetrievalFailureException("missing 'data.items[0]' node in JSON RPC response");
            VistaDataChunk patientChunk = VistaDataChunk.createVistaDataChunk(vistaId, url, object, "patient", 0, 1, null, VistaDataChunk.getProcessorParams(vistaId, pid, false), false);

            LOG.debug("handlePatientDataItem: Just before outputting patientChunk information.");

            try {
                PatientDemographics pt = conversionService.convert(patientChunk, PatientDemographics.class);
                if (pt == null || StringUtils.isEmpty(pt.getUid())) {
                    throw new InvalidDataAccessResourceUsageException("Unable to convert patientChunk into PatientDemographics object: " + patientChunk);
                }
                LOG.debug("handlePatientDataItem: Demographics converted from Patient Chunk" + CRLF + pt.toString());

                pt = patientDao.save(pt);
                LOG.debug("handlePatientDataItem: Demographics returned from patientDao save method" + CRLF + ((pt == null)?"null":pt.toString()));

                String localPatientId = pt.getLocalPatientIdForSystem(vistaId);
                patientChunk.setLocalPatientId(localPatientId);
                SyncStatus stat = getPtSyncStatus(statMap, pid, pt, vistaId, null);

                // Use merge and put to prevent over-writing statMap with incomplete syncStatus
                this.mergeAndPutSyncStatus(statMap, pt.getPid(), stat);

                LOG.debug("handlePatientDataItem: Started sync for patient.  pid:" + pid + "; pt.getPid(): " + pt.getPid());
                LOG.debug(LoggingUtil.outputSyncStatus("handlePatientDataItem: Started sync for pid: " + pid + "; vistaId: " + vistaId + ".  Placing sync status in status map now.", stat));
            } catch(ConversionFailedException e){
                LOG.error("Unable to convert patientChunk into PatientDemographics object: " + patientChunk, e);
            }
        } else if (tot > 0 && idx > 0) {
            LOG.debug("handlePatientDataItem: Entered handlePatientItem method.  domainName: " + domainName + ".  It was NOT 'syncStatus' or 'syncStart'");
            PatientDemographics pt = patMap.get(pid);
            if (pt == null) {
                pt = patientDao.findByPid(pid);
                if (pt == null && item.path("pid") != null) {
                    LOG.warn("JDS should have a record for pid: " + pid + " but it cannot be found; Requesting patient record from VISTA...");
                    VistaDataChunk patientChunk = this.fetchPatientDemographics(vistaId, PidUtils.getDfn(pid), false);
                    pt = conversionService.convert(patientChunk, PatientDemographics.class);
                    if (pt == null) {
                        LOG.error("Cannot find patient by pid: " + pid + " Item data will be skipped for uid: " + item.path("uid").asText(), new DataRetrievalFailureException("Can't find patient by pid: " + pid + " when checking async stream"));
                        return;
                    }
                    LOG.warn("VISTA record for pid: " + pid + " has been recovered and saved to JDS");
                    pt = patientDao.save(pt);
//                        String altPid = UidUtils.getLocalPatientIdFromDomainUid(item.path("uid").asText());
//                        pt = patientDao.findByAnyPid(PidUtils.getPid(null, altPid, vistaId));
//                        if (pt == null) {
//                            throw new DataRetrievalFailureException("Can't find patient by pid: " + pid + " or alternate dfn: " + altPid + " when checking async stream");
//                        }
                }
                if (pt == null) {
                    LOG.error("Cannot find patient by pid: " + pid + " Item data will be skipped for uid: " + item.path("uid").asText(), new DataRetrievalFailureException("Can't find patient by pid: " + pid + " when checking async stream"));
                    return;
                }
                patMap.put(pt.getPid(), pt);
            }
            SyncStatus stat = getPtSyncStatus(statMap, pt.getPid(), pt, vistaId, null);
            LOG.debug(LoggingUtil.outputSyncStatus("Middle of sync for pid: " + pid + "; vistaId: " + vistaId + "; domainName: " + domainName + ".  Before updating totals.", stat));

            // This should probably be inside the SyncStatus object.
            stat.updateDomainTotal(vistaId, domainName, tot);
            stat.updateDomainCount(vistaId, domainName, idx);

            // Use merge and put to prevent over-writing statMap with incomplete syncStatus
            this.mergeAndPutSyncStatus(statMap, pt.getPid(), stat);

            VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(vistaId, url, object, domainName, idx, tot, pt, VistaDataChunk.getProcessorParams(vistaId, pt.getLocalPatientIdForSystem(vistaId), false), isBatch);
            
            if (domainName.equals(DOCUMENT_TYPE)) {
                LOG.debug("Found a 'document' chunk - fixing the vuid now: Chunk: " + chunk.objectContentsOutput("chunk"));
                JLVDocDefUtil docDefUtil = new JLVDocDefUtil(jdsTemplate);
                docDefUtil.insertVuidFromDocDefUid(chunk);
                LOG.debug("Found a 'document' chunk - after fixing the vuid: Chunk: " + chunk.objectContentsOutput("chunk"));
            }

            LOG.debug("handlePatientDataItem: Just before outputting CHUNK information.");
            LOG.debug("Chunk was added to the holding array: " + chunk.objectContentsOutput("chunk"));
            LOG.debug(LoggingUtil.outputSyncStatus("handlePatientDataItem: Middle of sync for pid: " + pid + "; vistaId: " + vistaId + "; domainName: " + domainName + ".  After updating totals.", stat));

            chunks.add(chunk);
        }
    }

    private void handleOperationalDataItem(String vistaId, List<VistaDataChunk> chunks, String url, String domainName, int tot, int idx, JsonNode object, Map<String, SyncStatus> statMap, boolean isBatch) {
    	LOG.debug("handleOperationalDataItem: Entering method.");
        SyncStatus syncStatus = statMap.get("OPD");
        if (syncStatus == null) {
            syncStatus = syncStatusDao.findOneForOperational();
            if (syncStatus == null) {
                syncStatus = new SyncStatus();
            }
            syncStatus.setForOperationalByVistaId(true, vistaId);
            statMap.put("OPD", syncStatus);
        }
        else {
        	syncStatus.setForOperationalByVistaId(true, vistaId);
        }
        
        if (domainName.equals("syncStatus") || domainName.equals("syncStart")) {
            if (domainName.equals("syncStatus")) {
                syncStatus.setSyncOperationalCompleteByVistaId(vistaId, true);
            }
        } else if (tot > 0 && idx > 0) {
            if (object.path("uid").isMissingNode()) {
                LOG.warn("Skipping '" + domainName + "' operational item with missing UID.");
            } else {
                syncStatus.updateOperationalDomainTotal(domainName + ":" + vistaId, tot);
                syncStatus.updateOperationalDomainCount(domainName + ":" + vistaId, idx);
                VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk(vistaId, url, object, domainName + ":" + vistaId, idx, tot, null, VistaDataChunk.getProcessorParams(vistaId, null, false), isBatch);
                chunks.add(chunk);
            }
        }
    }

    @Override
    public void setEnvironment(Environment environment) {
        LOG.debug("setEnvironment: entering setEnvironment method.");
        this.environment = environment;

        this.hdrEnabled = environment.getProperty(HmpProperties.HDR_ENABLED, Boolean.class, false);
        LOG.debug("setEnvironment: hdrEnabled set to " + hdrEnabled);

        this.dodJmeadowsEnabled = environment.getProperty(HmpProperties.DOD_JMEADOWS_ENABLED)!=null?Boolean.parseBoolean(environment.getProperty(HmpProperties.DOD_JMEADOWS_ENABLED)):false;
        LOG.debug("setEnvironment: dodJmeadowsEnabled set to " + dodJmeadowsEnabled);

        this.vlerEnabled = environment.getProperty(HmpProperties.VLER_ENABLED)!=null?Boolean.parseBoolean(environment.getProperty(HmpProperties.VLER_ENABLED)):false;
        LOG.debug("setEnvironment: vlerEnabled set to " + vlerEnabled);

        this.vlerDasEnabled = environment.getProperty(HmpProperties.VLER_DAS_ENABLED)!=null?Boolean.parseBoolean(environment.getProperty(HmpProperties.VLER_DAS_ENABLED)):false;
        LOG.debug("VistaPatientDataService.setEnvironment: 777 vlerDasEnabled set to " + vlerDasEnabled);

        this.asyncBatchSize = environment.getProperty(HmpProperties.ASYNC_BATCH_SIZE, Integer.class, DEFAULT_BATCH_SIZE);
        LOG.debug("setEnvironment: asyncBatchSize set to " + this.asyncBatchSize);
    }
    
    /**
     * Using the PID - look up the patient in the patient select area and find the patient's 
     * ICN.
     * 
     * @param pid The pid of the patient.
     * @return The ICN for this patient.
     */
    private String getIcnForPatient(String pid) {
        String sIcn = "";
        
        PatientSelect ptSelect = patientSelectDao.findOneByPid(pid);
        if (ptSelect != null) {
            sIcn = ptSelect.getIcn();
            LOG.debug("getIcnForPatient: Found icn: " + sIcn + " for pid: " + pid);
        }
        else {
            LOG.debug("getIcnForPatient: Did not find any patient select data for pid: " + pid);
        }
        
        return sIcn;
    }
    
    /**
     * Returns true if this site ID represents a secondary site.
     * 
     * @param site The site ID of the site to check.
     * @return TRUE if this is a secondary site.
     */
    private boolean isVistaSite(String site) {
        boolean bVistaSite = false;
        List<String> vistaIds = vistaAccountDao.findAllVistaIds();
        if ((NullChecker.isNotNullish(site)) &&
            (NullChecker.isNotNullish(vistaIds)) &&
            (vistaIds.contains(site))) {
            bVistaSite = true;
        }
        
        return bVistaSite;
    }
    
    /**
     * This method returns the sites that are known to have data for this patient.
     * 
     * @param pid The pid of the patient.
     * @return The list of patient sites that are known to have data for this patient.
     */
    @Override
    public List<SiteAndPid> getPatientVistaSites(String pid) {
        LOG.debug("getPatientVistaSites: Entered method.  pid: " + pid);

        List<SiteAndPid> oaSiteAndPid = new ArrayList<SiteAndPid>();
        String site = "";

        if (NullChecker.isNotNullish(pid)) {
            String icn = getIcnForPatient(pid);

            if (NullChecker.isNotNullish(icn)) {
                List<PatientSelect> oaPtSelect = patientSelectDao.findAllByIcn(icn);
                if (NullChecker.isNotNullish(oaPtSelect)) {
                    for (PatientSelect ptSelect : oaPtSelect) {
                        if (NullChecker.isNotNullish(ptSelect.getUid())) {
                            site = UidUtils.getSystemIdFromPatientUid(ptSelect.getUid());
                            if (NullChecker.isNotNullish(site)) {
                                SiteAndPid siteAndPid = new SiteAndPid();
                                siteAndPid.setSite(site);
                                siteAndPid.setPid(ptSelect.getPid());
                                oaSiteAndPid.add(siteAndPid);
                            }
                        }
                    }
                }
                else {
                    LOG.debug("getPatientVistaSites: No patients found for this icn: " + icn + " and pid: " + pid);
                }
            }
            else {
                LOG.debug("getPatientVistaSites: No icn existed for pid: " + pid);
            }
        }
        else {
            LOG.debug("getPatientVistaSites: pid was null.  Unable to retrieve sites for this patient.");
        }
        
        if ((NullChecker.isNullish(oaSiteAndPid)) && (NullChecker.isNotNullish(pid))) {
            site = PidUtils.getVistaId(pid);
            if (NullChecker.isNotNullish(site)) {
                SiteAndPid siteAndPid = new SiteAndPid();
                siteAndPid.setPid(pid);
                siteAndPid.setSite(site);
                oaSiteAndPid.add(siteAndPid);
                LOG.debug("getPatientVistaSites: Returning only the site in this pid: " + pid + "; site: " + site);
            }
        }
            
        return oaSiteAndPid;
    }

    /**
     * Merges a new SyncStatus object with the existing entry in statMap (if one exists) and puts the merged SyncStatus in to the statMap object.
     * No value is returned, but the statMap parameter is treated as non-final and modified.
     * 
     * @param statMap the Map to be modified
     * @param pid     the pid of the patient for the syncStatus in the statMap
     * @param newSyncStatus updated SyncStatus to merge with the existing statMap
     */
    private void mergeAndPutSyncStatus(Map<String, SyncStatus> statMap, String pid, SyncStatus newSyncStatus) {
        if (statMap == null) {
            throw new IllegalStateException("statMap cannot be null.");
        }

        SyncStatus oldSyncStatus = statMap.get(pid);
        
        SyncStatus mergedSyncStatus;
        if (oldSyncStatus != null) {
            mergedSyncStatus = SyncUtils.mergePatientSyncStatus(oldSyncStatus, newSyncStatus, null);
        } else {
            mergedSyncStatus = newSyncStatus;
        }
        
        statMap.put(pid, mergedSyncStatus);
    }

    @Override
    public void expireSite(String pid, String vistaId, PointInTime time) {
        SyncStatus syncStatus = syncService.getPatientSyncStatus(pid);
        syncStatus.expireSite(vistaId, time);
        syncStatus = syncStatusDao.saveMergeSyncStatus(syncStatus, null);
        LOG.debug("    save/merge returned expiresOn=" + syncStatus.getVistaAccountSyncStatusForSystemId(vistaId).getExpiresOn().toString() + " for " + pid + " on " + vistaId);
        LOG.debug("After save/merge, found expiresOn=" + syncService.getPatientSyncStatus(pid).getVistaAccountSyncStatusForSystemId(vistaId).getExpiresOn().toString() + " for " + pid + " on " + vistaId);
    }

}
