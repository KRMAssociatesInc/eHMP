package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.SiteAndPid;
import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.vista.IVistaOperationalDataDAO;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.util.NullChecker;
import gov.va.jmeadows.util.document.IDodDocumentService;

import org.h2.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import java.util.List;
import java.util.Map;

@Service
public class ClearPatientMessageHandler implements SessionAwareMessageListener {
    private static Logger log = LoggerFactory.getLogger(ClearPatientMessageHandler.class);

    @Autowired
    private IPatientDAO patientDao;

    @Autowired
    private ISolrDao solrDao;

    private IVprSyncStatusDao vprSyncStatusDao;

    @Autowired
    private IVistaVprDataExtractEventStreamDAO vistaPatientDataService;

    @Autowired

    private IVistaOperationalDataDAO vistaOperationalDataService;

    @Autowired
    private IDodDocumentService dodDocumentService;

    private IVprSyncErrorDao errorDao;

    private IVistaAccountDao vistaAccountDao;

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }

    @Autowired
    public void setVprSyncStatusDao(IVprSyncStatusDao vprSyncStatusDao) {
        this.vprSyncStatusDao = vprSyncStatusDao;
    }

    private static Logger LOGGER = LoggerFactory.getLogger(ReindexPatientMessageHandler.class);


    @Autowired
    SimpleMessageConverter converter;

    @Autowired
    private ISyncService syncService;

    public void onMessage(Message message, Session session) {
        Map msg = null;
        try {
            msg = (Map) converter.fromMessage(message);
            String pid = (String) msg.get(SyncMessageConstants.PATIENT_ID);
            Assert.hasText(pid, "[Assertion failed] - 'pid' must have text; it must not be null, empty, or blank");

            clearPatient(pid);
        } catch (Exception e) {
            LOGGER.error("Error synching patient data: " + e.getMessage(), e);
            try {
                errorDao.save(new SyncError(message, msg, e));
                session.recover();
            } catch (JMSException e1) {
                LOGGER.error("Exception while saving sync error", e1);
            }
        }
    }

    public void clearPatient(String pid) {
        log.debug("clearPatient: Entered method.  Clearing for pid: " + pid);

        boolean unsubPatient = false;
        // Get all primary VistaIds 
        List<String> vistaIds = vistaAccountDao.findAllVistaIds();

        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt == null) {
            log.debug("clearPatient: Patient demographics for this patient did not exist.  No need to unsyncrhonize.  pid: " + pid);
            return;
        }
        
        // Check given pid is primary site pid 
        if (vistaIds.contains(PidUtils.getVistaId(pid))){
            unsubPatient = true;
        }
        else{

          // Secondary site pid is given. Get icn.
            if (StringUtils.isNullOrEmpty(pt.getIcn())){
                log.debug("clearPatient: ICN does not exist for this patient. No need to unsyncrhonize.  pid: " + pid);
                return;                
            }
            
            // Get all the demographics for the patient to see if data exists in any of the primary sites.
            List<PatientDemographics> oaPt = patientDao.findListByPid(pt.getIcn());            
            for (PatientDemographics ptItem : oaPt) {
                if ((NullChecker.isNotNullish(ptItem.getPid()) && (vistaIds.contains(PidUtils.getVistaId(ptItem.getPid()))))) {
                    // Data exists in primary vista sites for the patient. Get the primary site demographics and use that for unsubscribing then deleting data.
                    unsubPatient = true;                
                    pt = ptItem;
                    break;
                }
            }
        }
                    
        if (unsubPatient){
            unsubscribePatient(pt);
        }
                
        deletePatient(pt.getPid());
        log.debug("clearPatient: End of method.  pid: " + pid);
    }


    private void deletePatient(final String pid) {
        log.debug("deletePatient: Entering method.  pid: " + pid);
        SyncStatus stat = vprSyncStatusDao.findOneByPid(pid);
        patientDao.deleteByPID(pid);

        syncService.deleteErrorByPatientId(pid);

        solrDao.deleteByQuery("pid:" + pid);

        //Delete syncstatus for the patient
        if(stat!=null) {
            vprSyncStatusDao.delete(stat);
        }
        dodDocumentService.deleteDodDocuments(pid);

        log.debug("deletePatient: End of method.  pid: " + pid);
    }

    private void unsubscribePatient(PatientDemographics pt) {
        log.debug("unsubscribePatient: Entering method.  pt: " + ((pt == null) ? "null" : pt.toJSON()));
        
        if ((pt != null) && (NullChecker.isNotNullish(pt.getPid()))) {
            String pid = pt.getPid();
            String vistaId = PidUtils.getVistaId(pid);
            log.debug("unsubscribePatient: Unsubscribing pid: " + pid + "; site: " + vistaId);
            vistaPatientDataService.unsubscribePatient(vistaId, pid, true,false);
        }

        log.debug("unsubscribePatient: Leaving method.");
    }

    public IPatientDAO getPatientDao() {
        return patientDao;
    }

    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    public ISolrDao getSolrDao() {
        return solrDao;
    }

    public void setSolrDao(ISolrDao solrDao) {
        this.solrDao = solrDao;
    }

    public IVistaVprDataExtractEventStreamDAO getVistaPatientDataService() {
        return vistaPatientDataService;
    }

    public void setVistaPatientDataService(IVistaVprDataExtractEventStreamDAO vistaPatientDataService) {
        this.vistaPatientDataService = vistaPatientDataService;
    }

    public IVistaOperationalDataDAO getVistaOperationalDataService() {
        return vistaOperationalDataService;
    }

    public void setVistaOperationalDataService(IVistaOperationalDataDAO vistaOperationalDataService) {
        this.vistaOperationalDataService = vistaOperationalDataService;
    }

    public ISyncService getSyncService() {
        return syncService;
    }

    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    public IDodDocumentService getDodDocumentService() {
        return dodDocumentService;
    }

    public void setDodDocumentService(IDodDocumentService dodDocumentService) {
        this.dodDocumentService = dodDocumentService;
    }
}
