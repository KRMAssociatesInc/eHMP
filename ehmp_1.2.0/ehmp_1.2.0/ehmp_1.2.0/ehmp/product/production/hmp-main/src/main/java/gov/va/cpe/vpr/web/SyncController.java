package gov.va.cpe.vpr.web;

import com.google.gson.reflect.TypeToken;
import com.google.gson.JsonObject;
import com.google.gson.*;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;
import static java.util.Collections.singletonMap;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import com.codahale.metrics.Meter;
import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;

import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.roster.IRosterService;
import gov.va.cpe.roster.RosterPatient;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.msg.ImportChunkMessageHandler;
import gov.va.cpe.vpr.sync.msg.SyncMessageDispatcher;
import gov.va.cpe.vpr.sync.vista.VprUpdateJob;
import gov.va.hmp.audit.IUserAuditService;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCError;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import gov.va.hmp.util.NullChecker;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.jms.JMSException;
import javax.servlet.http.HttpServletRequest;

import org.apache.solr.client.solrj.SolrServerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SyncController {
    private static final Logger logger = LoggerFactory.getLogger(SyncController.class);

    private ISyncService syncService;
    private IRosterService rosterService;
    private IPatientSelectDAO patientSelectDao;
    private IPatientDAO patientDao;
    private IVistaAccountDao vistaAccountDao;
    private UserContext userContext;
    private PatientContext patientContext;
    private VprUpdateJob vprUpdateJob;
    private MetricRegistry metricRegistry;
    private IUserAuditService userAuditService;
    private ApplicationContext ctx;

    @Autowired
    public void setApplicationContext(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setRosterService(IRosterService rosterService) {
        this.rosterService = rosterService;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPatientContext(PatientContext patientContext) {
        this.patientContext = patientContext;
    }

    @Autowired
    public void setVprUpdateJob(VprUpdateJob vprUpdateJob) {
        this.vprUpdateJob = vprUpdateJob;
    }

    @Autowired
    public void setMetricRegistry(MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    @Autowired
    public void setUserAuditService(IUserAuditService userAuditService) {
        this.userAuditService = userAuditService;
    }

    @Autowired
    public void setPatientSelectDao(IPatientSelectDAO patientSelectDao) {
        this.patientSelectDao = patientSelectDao;
    }

    @RequestMapping(value = "/sync/stats", method = GET)
    public ModelAndView stats(HttpServletRequest request) {
        Meter commandMeter = metricRegistry.meter(SyncMessageDispatcher.MESSAGE_PROCESSING_METER);
        Timer importTimer = metricRegistry.timer(ImportChunkMessageHandler.VPR_IMPORT_TIMER);

        long cq = syncService.getCommandQueueSize();
        long iq = syncService.getOperationalImportQueueSize();
        long pq = -1;
        List<Map<String, Object>> pqueues = null;
        try {
            pqueues = syncService.getPatientQueueSizes();
            pq = 0;
            for (Map<String, Object> roe : pqueues) {
                pq = pq + (Long.valueOf(roe.get("size").toString()));
            }
        } catch (JMSException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        List<Map> stats = new ArrayList<>();
        stats.add(createStat("Total Patients", patientSelectDao.count()));
        stats.add(createStat("Loaded Patients", patientDao.count()));
        stats.add(createStat("Patients with Errors", syncService.getNumPatientsWithErrors()));
        stats.add(createStat("Sync Errors", syncService.getErrorCount()));
        stats.add(createStat("Syncing Patients", syncService.getSynchingPatientCount()));
        stats.add(createStat("Command Queue", cq, "/sync/command/detail", Arrays.asList("domain", "text")));

        stats.add(createStat("Command Rate (1 min)", String.format("%.2f items/second", commandMeter.getOneMinuteRate())));
        stats.add(createStat("Patient Queues Total", pq, "/sync/patient/queues", Arrays.asList("pid", "size")));
        stats.add(createStat("Operational Import Queue", iq));
        stats.add(createStat("Import Rate (Oper. and Patient) (1 min)", String.format("%.0f items/second", importTimer.getOneMinuteRate())));
        stats.add(createStat("Automatic Updates", (vprUpdateJob.isDisabled() ? "Disabled" : "Enabled")));

        return contentNegotiatingModelAndView(JsonCCollection.create(request, stats));
    }

    private Map createStat(String name, Object value) {
        return createStat(name, value, null, null);
    }

    private Map createStat(String name, Object value, String detailRestEndpoint, List<?> columns) {
        Map<String, Object> stat = new HashMap<String, Object>();
        stat.put("name", name);
        stat.put("value", value);
        stat.put("detailRestEndpoint", detailRestEndpoint);
        stat.put("columns", columns);
        return stat;
    }

    @RequestMapping(value = "/sync/command/detail", method = GET)
    public ModelAndView getCommandDetail() {
        return contentNegotiatingModelAndView(syncService.getCommandQueueDetail());
    }

    @RequestMapping(value = "/sync/patient/queues", method = GET)
    public ModelAndView getPatientQueues() {
        ArrayList<Map<String, Object>> rslt = null;
        try {
            rslt = syncService.getPatientQueueSizes();
        } catch (JMSException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "/sync/operationalSyncStatus", method = GET)
    public ModelAndView getOperationalSyncStatus(HttpServletRequest request) {
        SyncStatus resp = syncService.getOperationalSyncStatus();
        if(resp==null) {
            return contentNegotiatingModelAndView(new HashMap<>());
        }
        return contentNegotiatingModelAndView(syncService.getOperationalSyncStatus());
    }

    @RequestMapping(value = "/sync/reindexStatus", method = GET)
    public ModelAndView getReindexStatus(HttpServletRequest request) {
        Map<String, Object> reindexStatus = new HashMap<>();
        reindexStatus.put("reindexComplete", syncService.isReindexAllComplete());
        try {
            reindexStatus.put("pidCounts", syncService.getIndexAndJdsPatientCounts());
        } catch (SolrServerException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return contentNegotiatingModelAndView(reindexStatus);
    }

    @RequestMapping(value = "/sync/loadRosterPatients", method = POST)
    public ModelAndView loadRosterPatients(HttpServletRequest request, @RequestParam final String uid) {
        String vistaId = userContext.getCurrentUser().getVistaId();

        List<RosterPatient> patients = rosterService.getRosterPatients(uid);

        String message;
        if (patients == null || patients.isEmpty()) {
            message = "Roster " + uid + " has no patients";
        } else {
            for (RosterPatient pat : patients) {
                syncService.subscribePatient(vistaId, pat.getPid());
            }
            message = "Subscribing patients from roster <strong>" + uid + "</strong>";
            userAuditService.audit("subscribe", String.format("patients on roster=%s", uid));
        }

        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(1);
        map.put("message", message);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, map));
    }

    @RequestMapping(value = "/sync/expire", method = POST)
    public ModelAndView expire(@RequestParam(required = false) final String icn,
                               @RequestParam(required = false) final String dfn,
                               @RequestParam(required = true) final String vistaId,
                               @RequestParam(required = false) final PointInTime time, 
                               HttpServletRequest request) {
        logger.debug("SyncController.expire: entering expire method with with icn: " + icn + ", dfn: " + dfn + ", vistaId=" + vistaId + " and time=" + (time != null ? time.toString() : "null"));

        if (vistaAccountDao.findAllVistaIds().contains(vistaId)) {
            throw new BadRequestException(vistaId + " is a primary site, and primary site data can't be expired");
        }

        if (!StringUtils.hasText(icn) && !StringUtils.hasText(dfn))
            throw new BadRequestException("either 'dfn' or 'icn' request parameter is required");

        String pidVistaId = "";
        String pid = null;
        PatientSelect pt = null;
        String message = null;
        
        // DFN not prepended with Site
        //----------------------------
        if ((NullChecker.isNotNullish(dfn)) && (!dfn.contains(";"))) {
            pidVistaId = userContext.getCurrentUser().getVistaId();
            pid = PidUtils.getPid(pidVistaId, dfn);
            pt = patientSelectDao.findOneByPid(pid);
            message = "Patient with DFN '" + dfn + "' not found";
        }
        // DFN prepended with Site
        //-------------------------
        else if ((NullChecker.isNotNullish(dfn))) {
            pidVistaId = dfn.substring(0, dfn.indexOf(";"));
            pid = dfn;
            pt = patientSelectDao.findOneByPid(pid);
            message = "Patient with Site;DFN '" + dfn + "' not found";
        }
        // ICN
        //-----
        else if (NullChecker.isNotNullish(icn)) {
            pt = patientSelectDao.findOneByIcn(icn);
            if (pt != null) {
                pidVistaId = UidUtils.getSystemIdFromPatientUid(pt.getUid());
                pid = pt.getPid();
            }
            message = "Patient with ICN '" + icn + "' not found";
        }

        if (pt == null) {
            logger.warn(message);
            return contentNegotiatingModelAndView(JsonCError.createError(request, "404", message));
        }
        
        PointInTime timeToUse = time; // need a non-final reference to this object.
        if (time == null) {
            timeToUse = PointInTime.now();
        }
        String timeString = timeToUse.toString();

        logger.debug("SyncController.expire: preparing expire to expire site " + vistaId + " for patient " + pid + " and time=" + timeString);
        try {
            syncService.expireSite(pid, vistaId, timeToUse);
        } catch (Exception e) {
            message = "Error while attempting to expire site " + vistaId + " for patient " + pid + " and time=" + timeString;
            logger.error(message, e);
            return contentNegotiatingModelAndView(JsonCError.createError(request, "500", message));
        }

        message = "Successfully expired site " + vistaId + " for patient " + pid + " and time=" + timeString;
        logger.debug(message);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
    }

    @RequestMapping(value = "/sync/load", method = POST)
    public ModelAndView load(@RequestParam(required = false) final String icn, @RequestParam(required = false) final String dfn, 
    		@RequestParam(required = false) final String prioritySelect, @RequestParam(required = false) List<String> prioritySite, HttpServletRequest request) {

        logger.debug("SyncController.load(...): entering load method ('/sync/load') with icn: " + icn + "; dfn: " + dfn);
        if (!StringUtils.hasText(icn) && !StringUtils.hasText(dfn))
            throw new BadRequestException("either 'dfn' or 'icn' request parameter is required");

        String vistaId = "";
        String pid = null;
        PatientSelect pt = null;
        String message = null;
        
        // DFN not prepended with Site
        //----------------------------
        if ((NullChecker.isNotNullish(dfn)) && (!dfn.contains(";"))) {
            vistaId = userContext.getCurrentUser().getVistaId();
            pid = PidUtils.getPid(vistaId, dfn);
            pt = patientSelectDao.findOneByPid(pid);
            message = "Patient with DFN '" + dfn + "' not found";
        }
        // DFN prepended with Site
        //-------------------------
        else if ((NullChecker.isNotNullish(dfn))) {
            vistaId = dfn.substring(0, dfn.indexOf(";"));
            pid = dfn;
            pt = patientSelectDao.findOneByPid(pid);
            message = "Patient with Site;DFN '" + dfn + "' not found";
        }
        else if (NullChecker.isNotNullish(icn)) {
            pt = patientSelectDao.findOneByIcn(icn);
            if (pt != null) {
                vistaId = UidUtils.getSystemIdFromPatientUid(pt.getUid());
                pid = pt.getPid();
            }
            message = "Patient with ICN '" + icn + "' not found";
        }

        if (pt == null) {
            return contentNegotiatingModelAndView(JsonCError.createError(request, "404", message));
        }

        if((NullChecker.isNotNullish(prioritySelect)) && !prioritySelect.equals("none"))
        {
        	logger.debug("SyncController.load(...): using subscription prioritization mode: " + prioritySelect);
        	
        	if(prioritySelect.equals("current")){
        		vistaId = userContext.getCurrentUser().getVistaId();
        		logger.debug("SyncController.load(...): synchronizing patient for site: " + vistaId + "; pid: " + pid);
                syncService.subscribePatient(vistaId, pid);
        	}
        	else
        	{
        		logger.debug("SyncController.load(...): synchronizing patient " + pid);
        		syncService.subscribePatient(prioritySelect, prioritySite, pid);
        	}
        }
        else
        {
        	logger.debug("SyncController.load(...): No prioritization given. Will subscribe " + vistaId + " first.");
        	logger.debug("SyncController.load(...): synchronizing patient for site: " + vistaId + "; pid: " + pid);
        	syncService.subscribePatient(vistaId, pid);
        }

        message = "Subscribed to patient '" + pid + "'";
        userAuditService.audit("sync", String.format("patient pid=%s", pid));

        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
    }

    @RequestMapping(value = "/sync/mvi", method = POST)
    public ModelAndView mviSync(@RequestBody String mvi, HttpServletRequest request) {
        logger.debug("SyncController.mvi(...): entering mvi method ('/sync/mvi')");
        JsonElement edipi_elem;
        String edipi = null;
        JsonElement icn_elem;
        String icn = null;
        PatientSelect pt = null;
        String currentPid = null;
        String message = "Subscribed mvi patient";

        if(NullChecker.isNullish(mvi))
        {
            message = "No data received to do mvi sync";
            return contentNegotiatingModelAndView(JsonCError.createError(request, "404", message));
        }

        JsonObject mviJsonObject = new Gson().fromJson(mvi, JsonObject.class);
        edipi_elem = mviJsonObject.get("edipi");
        icn_elem = mviJsonObject.get("icn");

        if (icn_elem.isJsonNull()){
            message = "No ICN given. This is mandatory.";
            return contentNegotiatingModelAndView(JsonCError.createError(request, "404", message));
        }
        else
        {
            icn = icn_elem.getAsString();
            PatientDemographics pd = patientDao.findByIcn(icn);

            if (pd != null)
            {
                message = "Patient already exists. Please do a sync.";
                return contentNegotiatingModelAndView(JsonCError.createError(request, "404", message));
            }
        }

        if (!edipi_elem.isJsonNull()){
            edipi = edipi_elem.getAsString();
        }

        String[] pidList = new Gson().fromJson(mviJsonObject.getAsJsonArray("pid"), String[].class);

        if (edipi != null && pidList.length == 0)
        {
            logger.debug("SyncController.mvi(...): processing edipi: " + edipi);
            syncService.subscribePatient(mviJsonObject, null, edipi);
        }
        else
        {
            for (String mviPid : pidList) {
                logger.debug("SyncController.mvi(...): processing pid: " + mviPid);
                currentPid = mviPid;
                pt = patientSelectDao.findOneByPid(mviPid);

                if (pt != null) {
                    message = "Patient already exists. Please do a sync.";
                    return contentNegotiatingModelAndView(JsonCError.createError(request, "404", message));

                }
            }

            if (pt == null) {
                logger.debug("SyncController.mvi(...): Patient not found so going to create demographics and sync");
                syncService.subscribePatient(mviJsonObject, currentPid, edipi);
            }
        }

        userAuditService.audit("sync", String.format("patient pid=%s", pidList.toString()));

        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
    }
    
    @RequestMapping(value = "/sync/clearPatient", method = POST)
    public ModelAndView clearPatient(@RequestParam(required = false) String icn,
                                     @RequestParam(required = false) String pid,
                                     @RequestParam(required = false) String dfn,
                                     HttpServletRequest request) {
        logger.debug("SyncController.clearPatient:  Entered call to clear the patient.");

        if (!StringUtils.hasText(icn) && !StringUtils.hasText(pid) && !StringUtils.hasText(dfn))
            throw new BadRequestException("either 'pid', 'dfn' or 'icn' request parameter is required");

        PatientDemographics pt = null;
        if (StringUtils.hasText(pid)) {
            pt = patientDao.findByPid(pid);
        } else if (StringUtils.hasText(icn)) {
            pt = patientDao.findByIcn(icn);            
        }else if (StringUtils.hasText(dfn)) {
            pt = patientDao.findByLocalId(userContext.getCurrentUser().getVistaId(), dfn);
        }
        
        logger.debug("SyncController.clearPatient: Patient retreived from JDS: " + ((pt==null)?"null":pt.toJSON()));

        JsonCResponse jsonCResponse = clearPatient(pt);

        logger.debug("SyncController.clearPatient: Done with steps to clear patient.");

        jsonCResponse.setMethodAndParams(request);
        return contentNegotiatingModelAndView(jsonCResponse);
    }

    private JsonCResponse clearPatient(PatientDemographics pt) {
        String message = null;
        if (pt != null) {
            String lastSelectedPid = patientContext.getCurrentPatientPid();
            if (StringUtils.hasText(lastSelectedPid) && pt.getPid().equals(lastSelectedPid)) {
                patientContext.setCurrentPatient(null);
            }

            syncService.sendClearPatientMsg(pt);
            userAuditService.audit("clear", String.format("patient pid=%s", pt.getPid()));
            message = "Clearing patient " + StringUtils.collectionToCommaDelimitedString(pt.getPatientIds()) + "...";
        } else {
            message = "Patient not found.";
        }

        return JsonCResponse.create(singletonMap("message", message));
    }

    @RequestMapping(value = "/sync/toggleAutoUpdates", method = POST)
    public ModelAndView autoUpdates(HttpServletRequest request) {
        vprUpdateJob.setDisabled(!vprUpdateJob.isDisabled());

        boolean enabled = !vprUpdateJob.isDisabled();
        userAuditService.audit(enabled ? "enable" : "disable", "automatic updates");
        String message = enabled ? "Automatic Updates Enabled" : "Automatic Updates Disabled";

        Map<String, Object> map = new LinkedHashMap<>(2);
        map.put("message", message);
        map.put("autoUpdatesEnabled", enabled);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, map));
    }

    @RequestMapping(value = "/sync/cancel", method = POST)
    public ModelAndView cancelPendingMessages(HttpServletRequest request) {
        syncService.cancelPendingMessages();
        userAuditService.audit("cancel", "pending messages");

        String message = "Cancelled Pending Messages";
        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
    }

    @RequestMapping(value = "/sync/clearAllPatients", method = POST)
    public ModelAndView clearAllPatient(HttpServletRequest request) {
        //remove reference to last selected patient from session.
        request.getSession().removeAttribute("pid");
        syncService.sendClearAllPatientsMsg();
        userAuditService.audit("clear", "all patients");

        String message = "Clearing all patients...";
        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
    }

    @RequestMapping(value = "/sync/reindexPatient", method = POST)
    public ModelAndView reindexPatient(@RequestParam(required = true) final String pid, HttpServletRequest request) {
        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt != null) {
            syncService.sendReindexPatientMsg(pt);
            userAuditService.audit("reindex", "patient pid=" + pt.getPid());

            String message = "Reindexing patient " + pid + "...";

            return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
        } else {
            throw new PatientNotFoundException(pid);
        }

    }

    @RequestMapping(value = "/sync/reindexAllPatients", method = POST)
    public ModelAndView reindexAllPatients(HttpServletRequest request) {
        syncService.sendReindexAllPatientsMsg();
        userAuditService.audit("reindex", "all patients");
        String message = "Reindexing all patients...";
        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", message)));
    }

    @RequestMapping(value = "/sync/error/redeliver")
    public ModelAndView resendSyncError(@RequestParam(required = true) String recId, HttpServletRequest request) {
        syncService.redeliverDeadLetter(recId);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("success", "true")));
    }

    @RequestMapping(value = "/sync/syncErrors", method = GET)
    public ModelAndView syncErrors(Pageable pageable,
                                   @RequestParam(required = false) String format,
                                   @RequestParam(required = false) Boolean includeWarnings,
                                   @RequestParam(required = false) String searchString,
                                   @RequestParam(required = false) String searchAreas,
                                   HttpServletRequest request) {
        Page<SyncError> page = syncService.findAllErrors(new PageRequest(pageable.getPageNumber(), pageable.getPageSize(), Sort.Direction.DESC, "dateCreated"), includeWarnings, searchString, searchAreas);

        List<Map> patientSyncErrors = new ArrayList<>(page.getSize());
        for (SyncError error : page.getContent()) {
            Map<String, Object> map = new LinkedHashMap<String, Object>(8);
            PatientDemographics pt = StringUtils.hasText(error.getPid()) ? patientDao.findByPid(error.getPid()) : null;
            if (pt != null) {
                map.put("patient", pt.getFullName());
                map.put("pids", pt.getPatientIds());
            }
            map.put("id", error.getId());
            map.put("item", error.getItem());
            map.put("dateCreated", error.getDateCreated());
            map.put("json", error.getJson());
            map.put("message", error.getMessage());
            map.put("stackTrace", error.getStackTrace());
            patientSyncErrors.add(map);
        }

        JsonCCollection<SyncError> paginatedCollection = JsonCCollection.create(request, page);
        ((JsonCResponse.Collection) paginatedCollection.data).items = patientSyncErrors;

        return contentNegotiatingModelAndView(paginatedCollection);
    }

    @RequestMapping(value = "/sync/syncErrors/clear", method = POST)
    public ModelAndView clearAllSyncErrors(HttpServletRequest request) {
        syncService.deleteAllErrors();
        userAuditService.audit("clear", "all sync errors");
        return contentNegotiatingModelAndView(JsonCResponse.create(request, singletonMap("message", "Cleared All Sync Errors")));
    }

    public boolean isSelectedPatientToReload(String pid, String dfn, String vistaId, String icn) {
        boolean check = false;
        if (StringUtils.hasText(pid)) {
            PatientDemographics pt = null;
            if (StringUtils.hasText(dfn) && StringUtils.hasText(vistaId)) {
                pt = patientDao.findByLocalId(vistaId, dfn);
            } else if (StringUtils.hasText(icn)) {
                pt = patientDao.findByPid(icn);
            }

            if (pt != null && pid.equalsIgnoreCase(pt.getPid())) {
                check = true;
            }

        }

        return check;
    }

    @RequestMapping(value = "/sync/simulateErrors/patientData", method = POST)
    public ModelAndView toggleSimulatePatientErrors(@RequestParam(required = false) Boolean simulateErrors) {
        ((ImportChunkMessageHandler) ctx.getBean("importChunkMessageHandler")).setSimulateErrors(simulateErrors);
        Map<String, Object> rslt = new HashMap<>();
        rslt.put("success", "true");
        return contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "/sync/operationalInProgress", method = GET)
    public ModelAndView isOperationalDataSynching() {
        boolean isSynching = syncService.isOperationalSynching();
        Map<String, Object> rslt = new HashMap<>();
        rslt.put("success", "true");
        rslt.put("synching", isSynching);
        return contentNegotiatingModelAndView(rslt);
    }
}
