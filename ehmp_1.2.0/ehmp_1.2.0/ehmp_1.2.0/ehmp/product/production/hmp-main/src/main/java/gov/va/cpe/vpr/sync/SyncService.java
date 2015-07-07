package gov.va.cpe.vpr.sync;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import static gov.va.cpe.vpr.sync.MessageDestinations.COMMAND_QUEUE;
import static gov.va.cpe.vpr.sync.MessageDestinations.IMPORT_QUEUE;
import static gov.va.cpe.vpr.sync.MessageDestinations.PATIENT_QUEUE;
import static gov.va.cpe.vpr.sync.SyncCommand.IMPORT_CHUNK;
import static gov.va.cpe.vpr.sync.SyncCommand.VPR_UPDATE_COMPLETE;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.COMMAND;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.ERROR_LEVEL;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.PATIENT_DOMAINS_BY_PID;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.PATIENT_ID;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.PATIENT_IDS;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.TIMESTAMP;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.UID;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.VISTA_ID;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.VISTA_LAST_UPDATED;
import static gov.va.hmp.HmpProperties.SERVER_ID;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.msg.ClearPatientMessageHandler;
import gov.va.cpe.vpr.sync.msg.ErrorLevel;
import gov.va.cpe.vpr.sync.vista.IVistaOperationalDataDAO;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.jms.InvalidSelectorException;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.QueueBrowser;
import javax.jms.Session;

import org.apache.activemq.broker.jmx.QueueViewMBean;
import org.apache.commons.lang.NotImplementedException;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.convert.ConversionService;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jms.JmsException;
import org.springframework.jms.core.BrowserCallback;
import org.springframework.jms.core.JmsOperations;
import org.springframework.jms.core.MessagePostProcessor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Class responsible for dispatching sync messages via JMS for processing by JMS listeners.
 */
@Service
public class SyncService implements ISyncService {

    static final String JMSXGROUP_ID = "JMSXGroupID";
    static final String JMSXGROUP_SEQ = "JMSXGroupSeq";
    static final int AUTO_UPDATE_JMS_PRIORITY = 8; // 0-9, (0-4 are gradations of normal, 5-9 gradations of expedited priority)
//    private static final long PATIENT_QUEUE_IDLE_THRESHOLD = 10000;

    private static Logger log = LoggerFactory.getLogger(SyncService.class);

    private IPatientDAO patientDao;
    private JmsOperations jmsTemplate;
    private ConversionService conversionService;
    private QueueViewMBean vprWorkQueueMBean;
    private QueueViewMBean vprCommandQueueMBean;
    private QueueViewMBean vprDLQMBean;
    private MetricRegistry metrics;
    private IVprSyncStatusDao syncStatusDao;
    private IVprSyncErrorDao errorDao;
    private IVistaVprDataExtractEventStreamDAO eventStreamDAO;
    private IVistaOperationalDataDAO operationalDataService;

    private boolean reindexAllComplete = true;

    private SolrServer solrServer;
    private boolean dataStreamEnabled = true;
    private String dataStreamDisabledMsg;
    private Exception dataStreamDisabledException;
    private ClearPatientMessageHandler clearPatientMessageHandler;
    
    @Autowired
    public void setClearPatientMessageHandler(ClearPatientMessageHandler clearPatientMessageHandler) {
        log.debug("ClearPatientMessageHandler was autowired and is: " + ((clearPatientMessageHandler==null)?"null":"not null"));
        this.clearPatientMessageHandler = clearPatientMessageHandler;
    }

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }
    
    @Autowired
    public void setSyncStatusDao(IVprSyncStatusDao syncStatusDao) {
        this.syncStatusDao = syncStatusDao;
    }

    public JmsOperations getJmsTemplate() {
        return jmsTemplate;
    }

    @Autowired
    public void setJmsTemplate(JmsOperations jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    @Autowired
    public void setPatientDao(@Qualifier("jdsPatientDao") IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setConversionService(ConversionService conversionService) {
        this.conversionService = conversionService;
    }

    @Autowired
    public void setVprWorkQueueMBean(QueueViewMBean vprWorkQueueMBean) {
        this.vprWorkQueueMBean = vprWorkQueueMBean;
    }

    @Autowired
    public void setVprCommandQueueMBean(QueueViewMBean vprCommandQueueMBean) {
        this.vprCommandQueueMBean = vprCommandQueueMBean;
    }

    @Autowired
    public void setVprDeadLetterQueueMBean(QueueViewMBean vprDeadLetterQueueMBean) {
        this.vprDLQMBean = vprDeadLetterQueueMBean;
    }

    @Autowired
    public void setMetricRegistry(MetricRegistry metrics) {
        this.metrics = metrics;
    }

    @Autowired
    public void setEventStreamDAO(IVistaVprDataExtractEventStreamDAO eventStreamDAO) {
        this.eventStreamDAO = eventStreamDAO;
    }

    @Autowired
    public void setOperationalDataService(IVistaOperationalDataDAO operationalDataService) {
        this.operationalDataService = operationalDataService;
    }

    @Override
    public long getOperationalImportQueueSize() {
        try {
            long rslt = vprWorkQueueMBean.getQueueSize();
            if (rslt < 0) {
                vprWorkQueueMBean.purge();
                rslt = vprWorkQueueMBean.getQueueSize();
            }
            log.debug("SyncService.getOperationalImportQueueSize: QueueSize: " + rslt);
            return rslt;
        } catch (Exception e) {
            log.warn("Error connecting to work queue : " + e.getMessage());
            return -1;
        }
    }

    public long getSynchingPatientCount() {
        return syncStatusDao.findAllLoadingPatientStatii().size();
    }

    // S64 MERGE - Relic from the merge - not sure if we need it.
    //@Override
    //public boolean isPatientLoaded(Patient pt) {
    //    SyncStatus stat = syncStatusDao.getForPid(pt.getPid()==null?PidUtils.getPid(pt):pt.getPid());
    //    return stat!=null && stat.getSyncComplete();
    //}

    public ArrayList<Map<String, Object>> getPatientQueueSizes() {
        ArrayList<Map<String, Object>> rslt = new ArrayList<Map<String, Object>>();
        List<SyncStatus> statii = syncStatusDao.findAllLoadingPatientStatii();
        for (SyncStatus stat : statii) {
            Map<String, Object> patCollections = patientDao.getSynchedCollectionCounts(stat.getPid());
            Map<String, Integer> statExpectedTotals = stat.getDomainExpectedTotalsForAllSystemIds();
            int size = 0;
            boolean pendingResponses = false;
            for (String key : statExpectedTotals.keySet()) {
                Integer expected = statExpectedTotals.get(key);
                if (expected == null) {
                    pendingResponses = true;
                } else {
                    Integer found = (patCollections == null ? 0 : patCollections.get(key) == null ? 0 : Integer.valueOf(patCollections.get(key).toString()));
                    if (found < expected) {
                        size += (expected - found);
                    }
                }
            }
            if (size > 0 || pendingResponses) {
                Map<String, Object> row = new HashMap<String, Object>();
                row.put("pid", stat.getPid());
                row.put("size", size);
                row.put("pending", pendingResponses);
                rslt.add(row);
            }
        }
        return rslt;
    }

    @Override
    public void redeliverDeadLetter(String recId) {
        try {
        	errorDao.deleteByJMSMessageId(recId);
            vprDLQMBean.retryMessage(recId);
            vprDLQMBean.removeMessage(recId);
        } catch (Exception e) {
            log.error("redeliver dead letter", e);
        }
    }

    @Override
    public long getCommandQueueSize() {
        try {
            long rslt = vprCommandQueueMBean.getQueueSize();
            if (rslt < 0) {
                vprCommandQueueMBean.purge();
                rslt = vprCommandQueueMBean.getQueueSize();
            }
            return rslt;
        } catch (Exception e) {
            log.warn("Error connecting to command queue : " + e.getMessage());
            return -1;
        }
    }

    private void sendCommandMsg(final String command, final Map msg) {
        jmsTemplate.convertAndSend(COMMAND_QUEUE, msg, new CommandPostProcessor(command));
    }

    public void sendImportVistaDataExtractItemMsg(final VistaDataChunk item) {
        Map importMsg;
        try {
            Timer.Context convertContext = metrics.timer(MetricRegistry.name("vpr.convertChunk")).time();
            importMsg = conversionService.convert(item, Map.class);
            convertContext.stop();
        } catch (RuntimeException e) {
            throw e;
        }
        try {
        	Timer.Context readyContext = metrics.timer(MetricRegistry.name("vpr.readyChunk")).time();
            readyContext.stop();

            Timer.Context sendContext = metrics.timer(MetricRegistry.name("vpr.sendChunk")).time();
            String pid = item.getPatientId();
            if(pid==null) {
                getJmsTemplate().convertAndSend("vpr.import", importMsg, new PatientCommandPostProcessor(IMPORT_CHUNK, item.getPatientId(), item.isBatch()));
            } else {
//                String queueName = "vpr.patient."+pid;
                importMsg.put("pid",pid);
                String queueName = PATIENT_QUEUE;
                getJmsTemplate().convertAndSend(queueName, importMsg, new PatientCommandPostProcessor(IMPORT_CHUNK, item.getPatientId(), item.isBatch()));
            }

            sendContext.stop();
            
        } catch (Exception e) {
            errorDuringMsg(importMsg, e, ErrorLevel.ERROR);
        }
    }

    public void retryMsg(Map msg) {
        try {
            getJmsTemplate().convertAndSend(IMPORT_QUEUE, msg);
        } catch (Exception e) {
            errorDuringMsg(msg, e, ErrorLevel.ERROR);
        }
    }

    public void sendReindexPatientMsg(PatientDemographics pt) {
        sendReindexPatientMsg(pt.getPid());
    }

    public void sendReindexPatientMsg(String pid) {
        Map msg = new HashMap();
        msg.put(PATIENT_ID, pid);

        sendCommandMsg(SyncCommand.PATIENT_REINDEX, msg);
    }

    public void sendReindexAllPatientsMsg() {

        List<String> pids = patientDao.listLoadedPatientIds();
        for (String pid : pids) {
            sendReindexPatientMsg(pid);
        }

        Map completeMsg = new HashMap();
        completeMsg.put(TIMESTAMP, System.currentTimeMillis());
        sendCommandMsg(SyncCommand.PATIENT_REINDEX_ALL_COMPLETE, completeMsg);
    }

    public void sendClearPatientMsg(PatientDemographics pt) {
        log.debug("sendClearPatientMsg(pt): Entered method. pt: " + ((pt == null) ? "null" : pt.toJSON()));
        sendClearPatientMsg(pt.getPid());
    }

    public void sendClearPatientMsg(String pid) {
        log.debug("SyncService.sendClearPatientMsg(pid): Starting unsync of a patient for pid: " + pid);

        clearPatientMessageHandler.clearPatient(pid);
        
        // Remove any relics of the sync status now.
        //------------------------------------------
        SyncStatus stat = syncStatusDao.findOneByPid(pid);
        if (stat != null) {
            log.debug("sendClearPatientMsg: deleting the sync status for pid: " + pid);
            syncStatusDao.delete(stat);
        }
        else {
            log.debug("sendClearPatientMsg: sync status did not exist for pid: " + pid + " - no need to delete it.");
        }

        log.debug("SyncService.sendClearPatientMsg: End of unsync of a patient for pid: " + pid);
    }

    public void sendClearItemMsg(String uid) {
        Map msg = new HashMap();
        msg.put(UID, uid);

        sendCommandMsg(SyncCommand.ITEM_CLEAR, msg);
    }

    public void sendClearAllPatientsMsg() {
        List<String> pids = patientDao.listLoadedPatientIds();
        for (String pid : pids) {
            sendClearPatientMsg(pid);
        }
    }

    @Override
    public void sendHdrPatientImportMsg(String pid, String division, String vistaId) {
        Map<String, Object> msg = new HashMap<>();
        msg.put(SyncMessageConstants.PATIENT_ID,pid);
        msg.put(SyncMessageConstants.DIVISION,division);
        msg.put(SyncMessageConstants.VISTA_ID,vistaId);
        this.sendCommandMsg(SyncCommand.HDR_IMPORT,msg);
    }

    public void sendUpdateVprCompleteMsg(String serverId, String vistaId, String lastUpdate, Map<String, Set<String>> domainsByPatientId) {
        Map msg = new HashMap();
        msg.put(VISTA_ID, vistaId);
        msg.put(SERVER_ID, serverId);
        msg.put(TIMESTAMP, System.currentTimeMillis());
        msg.put(PATIENT_IDS, domainsByPatientId != null ? StringUtils.collectionToCommaDelimitedString(domainsByPatientId.keySet()) : "");
        msg.put(PATIENT_DOMAINS_BY_PID, domainsByPatientId != null ? POMUtils.toJSON(domainsByPatientId) : "");
        msg.put(VISTA_LAST_UPDATED, lastUpdate);

        sendCommandMsg(VPR_UPDATE_COMPLETE, msg);
    }

    @Override
    public void cancelPendingMessages() {
        try {
            vprWorkQueueMBean.purge();
            vprCommandQueueMBean.purge();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void warningDuringMsg(final Map msg, String warning) {
        getJmsTemplate().convertAndSend(MessageDestinations.WARNING_QUEUE, SyncMessageUtils.createWarningMessage(msg, warning), new MessagePostProcessor() {
            @Override
            public Message postProcessMessage(Message message) throws JMSException {
                message.setStringProperty(PATIENT_ID, (String) msg.get(PATIENT_ID)); // this enables us to select messages from the queue by pid
                return message;
            }
        });
    }

    public void errorDuringMsg(final Map msg, Throwable t, final String lvl) {
        try {
        	
            getJmsTemplate().convertAndSend(MessageDestinations.DEAD_LETTER_QUEUE, SyncMessageUtils.createErrorMessage(msg, t, lvl), new MessagePostProcessor() {
                @Override
                public Message postProcessMessage(Message message) throws JMSException {
                    message.setStringProperty(PATIENT_ID, (String) msg.get(PATIENT_ID)); // this enables us to select messages from the queue by pid
                    message.setStringProperty(ERROR_LEVEL, lvl);
                    return message;
                }
            });
            Object msgPid = msg.get(SyncMessageConstants.PATIENT_ID);
            if(msgPid!=null) {
                // FIXME: move this into metadata rather than on demographics object
                PatientDemographics pat = patientDao.findByPid(msg.get(SyncMessageConstants.PATIENT_ID).toString());
            	if(pat!=null) {
            		pat.incrementSyncErrorCount();
            		patientDao.save(pat);
            	}
            }
        } catch (JmsException e) {
            Object pid = msg.get(SyncMessageConstants.PATIENT_ID);
            String pidString = pid == null ? "" : String.valueOf(pid);
            log.error("unable to put error msg in error queue: " + t.getMessage() + "\n" + pidString, e);
        }
    }

    public void setReindexAllComplete(boolean reindexAllComplete) {
        this.reindexAllComplete = reindexAllComplete;
    }

    public boolean isReindexAllComplete() {
        return reindexAllComplete;
    }

    static class CommandPostProcessor implements MessagePostProcessor {

        protected String command;

        protected CommandPostProcessor(String command) {
            this.command = command;
        }

        public String getCommand() {
            return command;
        }

        @Override
        public Message postProcessMessage(Message message) throws JMSException {
            message.setStringProperty(COMMAND, command);
            return message;
        }
    }

    static class PatientCommandPostProcessor extends CommandPostProcessor {
        protected String pid;
        protected boolean batch;

        PatientCommandPostProcessor(String command, String pid) {
            this(command, pid, false);
        }

        PatientCommandPostProcessor(String command, String pid, boolean autoUpdate) {
            super(command);
            this.pid = pid;
            this.batch = batch;
        }

        @Override
        public Message postProcessMessage(Message message) throws JMSException {
            Message m = super.postProcessMessage(message);
            if (StringUtils.hasText(pid)) {
                m.setStringProperty(JMSXGROUP_ID, getPatientMessageGroupId(pid));
                m.setStringProperty(PATIENT_ID, pid);
                if (!batch) {
                    m.setJMSPriority(AUTO_UPDATE_JMS_PRIORITY);
                }
            }
            return m;
        }

        private String getPatientMessageGroupId(String pid) {
            return "vpr.pt." + pid;
        }
    }

    static class OperationalDomainCommandPostProcessor extends CommandPostProcessor {
        protected String domain;

        OperationalDomainCommandPostProcessor(String command, String domain) {
            super(command);
            this.domain = domain;
        }

        @Override
        public Message postProcessMessage(Message message) throws JMSException {
            log.debug("SyncService.OperationalDomainCommandPostProcessor.postProcessMessage: Domain: " + domain);
            Message m = super.postProcessMessage(message);
            m.setStringProperty(JMSXGROUP_ID, getOperationalDomainGroupId(domain));
            return m;
        }

        private String getOperationalDomainGroupId(String domain) {
            return "odc.domain." + domain;
        }
    }

	@Override
	public List<Map> getCommandQueueDetail() {
		List<Map> rslt = new ArrayList<Map>();
		try {
			List<?> msgs = vprCommandQueueMBean.browseMessages();
	    	for(Object msg: msgs) {
	    		String domain = ((MapMessage)msg).getString(SyncMessageConstants.DOMAIN);
	    		Map<String, Object> rmsg = new HashMap<String, Object>();
	    		rmsg.put("domain",domain);
	    		rmsg.put("text",domain);
	    		rslt.add(rmsg);
	    	}
		} catch (InvalidSelectorException e) {
			throw new DataAccessResourceFailureException(e.getMessage(), e);
		} catch (JMSException e) {
			throw new DataAccessResourceFailureException(e.getMessage(), e);
		}
		return rslt;
	}

    private boolean messageMatch(SyncError msg, String searchStrings, String searchAreas) throws IllegalAccessException {
        boolean matched = false;
        if(!(searchStrings==null || searchStrings.isEmpty())) {
            String[] searchStringArray = searchStrings.split(" ");
            for(String searchString : searchStringArray) {
                // if we matched this message already, go to the next message
                if(matched) { break; }
                if (searchAreas != null && searchAreas != "") {
                    String[] areas = searchAreas.split("-");
                    matched = msg.match(searchString, areas);
                }
                else {
                    matched = msg.match(searchString, null);
                }
            }
        }
        return matched;
    }

    @Override
    public Page<SyncError> findAllErrors(final Pageable pageable, final Boolean includeWarnings, String searchStrings, String searchAreas) {

        int total = pageable.getOffset();
        int max = total + pageable.getPageSize();
        List<SyncError> emsgs;
        List<SyncError> rslt = new ArrayList<>();
        emsgs = errorDao.getAllSyncErrors();
        if(searchStrings!=null && !searchStrings.isEmpty()) {
            List<SyncError> filteredList = new ArrayList<>();
            for(SyncError err: emsgs) {
                try {
                    if(messageMatch(err, searchStrings, searchAreas)) {
                        filteredList.add(err);
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                    log.error("Error checking field values for match string: "+e.getMessage(), e);
                }
            }
            emsgs = filteredList;
        }
        if(total>emsgs.size())
        {
            // TODO: Recover from a case where the page is affected by different search criteria. Reset to last page possible.
            throw new IllegalArgumentException("Requested offset " + pageable.getOffset() + " is greater than the number of error messages (" + emsgs.size() + ")");
        }
        for (int i = total; (rslt.size()+total) < max && emsgs.size()>i; i++) {
            rslt.add(emsgs.get(i));
        }
        return new PageImpl<>(rslt, pageable, emsgs.size());
    }

    @Override
    public Page<SyncError> findAllErrors(Pageable pageable, Boolean includeWarnings, String searchString) {
        return findAllErrors(pageable, includeWarnings, searchString, null);
    }

    @Override
    public Integer getPatientErrorCount(String pid) {
        return errorDao.getErrorCountForPid(pid);
    }

    @Override
    public Integer getNumPatientsWithErrors() {
        return errorDao.getErrorPatientCount();
    }

    @Override
    public Page<SyncError> findAllErrorsByPatientId(final String pid, final Pageable pageable) {
        List<SyncError> emsgs = errorDao.getAllSyncErrorsForPid(pid);
        int total = pageable.getOffset();
        int max = total + pageable.getPageSize();

        if(total>emsgs.size())
        {
            throw new IllegalArgumentException("Requested offset " + pageable.getOffset() + " is greater than the number of error messages for patient '" + pid + "' (" + emsgs.size() + ")");
        }
        // grab a page worth's of MapMessages and convert them to SyncError objects
        List<SyncError> messages = new ArrayList<SyncError>(pageable.getPageSize());
        for (int i = total; i < max; i++) {
            if (emsgs.size()>i) {
                messages.add(emsgs.get(i));
            }
        }

        return new PageImpl<SyncError>(messages, pageable, emsgs.size());
    }

    @Override
    public int deleteErrorByPatientId(String pid) {
        String selector = getPatientIdSelector(pid);
        int num = jmsTemplate.browseSelected(MessageDestinations.DEAD_LETTER_QUEUE, selector, new BrowserCallback<Integer>() {
            @Override
            public Integer doInJms(Session session, QueueBrowser browser) throws JMSException {
                return Collections.list(browser.getEnumeration()).size();
            }
        });
        for (int i = 0; i < num; i++) {
            jmsTemplate.receiveSelected(MessageDestinations.DEAD_LETTER_QUEUE, selector);
        }
        return num;
    }

    private String getPatientIdSelector(String pid) {
        return SyncMessageConstants.PATIENT_ID + "='" + pid + "'";
    }

    @Override
    public SyncError findOneError(String id) {
        return errorDao.getOneByJMSMessageId(id);
    }

    @Override
    public long getErrorCount() {
        return errorDao.getSyncErrorCount();
    }

    @Override
    public void deleteError(String id) {
        jmsTemplate.receiveSelected(MessageDestinations.DEAD_LETTER_QUEUE, "JMSMessageID='" + id + "'");
        errorDao.deleteByJMSMessageId(id);
    }

    @Override
    public void deleteError(SyncError err) {
        deleteError(err.getId());
    }

    @Override
    public void deleteAllErrors() {
        try {
            vprDLQMBean.purge();
            errorDao.purge();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<SyncError> findAllErrors() {
        throw new NotImplementedException();
    }

    @Override
    public List<SyncError> findAllErrors(Sort sort) {
        throw new NotImplementedException();
    }

    @Override
    public Page<SyncError> findAllErrors(Pageable pageable) {
        return this.findAllErrors(pageable, true, null);
    }

    @Override
    public void subscribePatient(String vistaId, PatientDemographics pat) {
        log.debug("SyncService.subscribePatient(vistaId, pat): Entered method.  vistaId: " + vistaId + "; pat: " +
                  ((pat == null) ? "null" : pat.toJSON()));
        if (pat != null) {
            subscribePatient(pat.getLocalPatientIdForSystem(vistaId), pat.getPid());
        } 
        else {
            log.debug("SyncService.subscribePatient(vistaId, pat): pat was null.  vistaId: " + vistaId + ".  No subscription was done.");
        }
    }

    @Override
    public void subscribePatient(String vistaId, String pid) {
        log.debug("SyncService.subscribePatient(vistaId, pid): Entered method.  vistaId: " + vistaId + "; pid: " + pid);
        eventStreamDAO.subscribePatient(vistaId, pid, true);
    }

    @Override
    public void subscribePatient(JsonObject mvi, String pid, String edipi) {
        log.debug("SyncService.subscribePatient(mvi,pid): Entered method. mvi: " + mvi.toString() + "; pid: " + pid + "; edipi: " + edipi);
        eventStreamDAO.subscribePatient(mvi, pid, edipi);
    }
    
    @Override
    public void subscribePatient(String prioritySelect, List<String> sitesToSync, String pid) {
        log.debug("SyncService.subscribePatient(prioritySelect, sitesToSync, pid): Entered method.  prioritySelect: " + prioritySelect + "; sitesToSync: " + sitesToSync.toString() + "; pid: " + pid);
        eventStreamDAO.subscribePatient(prioritySelect, sitesToSync, pid);
    }

    @Override
    public void subscribeOperational(String vistaId) {
        log.debug("SyncService.subscribeOperational: vistaId: " + vistaId);
        operationalDataService.subscribe(vistaId);
    }

    @Override
    public boolean isOperationalSynching() {
        log.debug("SyncService.isOperationalSynching: Entering method: ");
        SyncStatus stat = syncStatusDao.findOneForOperational();
        if (stat == null || !stat.getSyncOperationalComplete()) {
            log.debug("SyncService.isOperationalSynching: returning: false (stat was null)");
            return true;
        }

        log.debug("SyncService.isOperationalSynching: returning: " + !stat.getSyncComplete());

        return false;
    }

    @Override
    public void resetServerSubscriptions(String vistaId) {
        operationalDataService.resetServerSubscriptions(vistaId);
    }

    @Override
    public SyncStatus getOperationalSyncStatus() {
        log.debug("SyncService.getOperationalSyncStatus: Entering method: ");
        return syncStatusDao.findOneForOperational();
    }

    @Override
    public SyncStatus getPatientSyncStatus(String pid) {
        return syncStatusDao.findOneByPid(pid);
    }

    @Override
    public boolean isNotLoadedAndNotLoading(String pid) {
        return syncStatusDao.findOneByPid(pid) == null;
    }

    @Autowired
    public void setSolrServer(SolrServer solrServer){
        this.solrServer = solrServer;
    }

    int solrServerInitRetry = 0;

    @Override
    public Map<String, Integer> getIndexAndJdsPatientCounts() throws SolrServerException {
        SolrQuery qry = new SolrQuery("*:*");
        qry.setRows(0);
        qry.addFacetField("pid");
        qry.setFacetLimit(-1); // Default is 100;
        try {
            QueryResponse resp = solrServer.query(qry);
            FacetField ff = resp.getFacetField("pid");
            int solrPidCount = ff.getValues().size();
            int jdsPidCount = patientDao.count();
            Map<String, Integer> rslt = new HashMap<>();
            rslt.put("solrPidCount",solrPidCount);
            rslt.put("jdsPidCount",jdsPidCount);
            return rslt;
        } catch(SolrServerException e) {
            // Short-term handling when embedded SolrServer is not initializing fast enough;
            // Long-term plan is to have a dedicated SolrServer.
            if(e.getMessage().toLowerCase().contains("server refused connection")) {
                if(solrServerInitRetry++<5) {
                    try {
                        log.warn("SOLR server refused connection when trying to get PID count; Retry #"+solrServerInitRetry);
                        Thread.sleep(2000);
                    } catch (InterruptedException e1) {
                        e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                    }
                    return getIndexAndJdsPatientCounts();
                }
            }
        }
        return null;
    }

    @Override
    public void setDataStreamEnabled(boolean b, String disabledMsg, Exception disabledException) {
        this.dataStreamEnabled = b;
        this.dataStreamDisabledMsg = disabledMsg;
        this.dataStreamDisabledException = disabledException;
    }

    @Override
    public boolean isDataStreamEnabled() {
        return dataStreamEnabled;
    }

    @Override
    public Map<String, Object> getDataStreamErrorDetails() {
        Map<String, Object> rslt = new HashMap<>();
        rslt.put("disabledMsg",dataStreamDisabledMsg);
        rslt.put("disabledException",dataStreamDisabledException);
        return rslt;
    }

    @Override
    public void expireSite(String pid, String vistaId, PointInTime time) {
        eventStreamDAO.expireSite(pid, vistaId, time);
    }

}
