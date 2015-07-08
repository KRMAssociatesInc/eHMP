package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprUpdateDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.vista.VprUpdate;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import org.codehaus.groovy.runtime.DefaultGroovyMethods;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class VprUpdateCompleteMessageHandler implements SessionAwareMessageListener {

    private static final Logger LOG = LoggerFactory.getLogger(VprUpdateCompleteMessageHandler.class);

    private ISolrDao solrService;
    private ISyncService syncService;
    private IPatientDAO patientDao;
    private IVistaAccountDao vistaAccountDao;
    private IVprUpdateDao lastUpdateDao;

    private IVprSyncErrorDao errorDao;

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }

    private static Logger LOGGER = LoggerFactory.getLogger(ReindexPatientMessageHandler.class);

    @Autowired
    public void setSolrService(ISolrDao solrService) {
        this.solrService = solrService;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
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
    public void setLastUpdateDao(IVprUpdateDao lastUpdateDao) {
        this.lastUpdateDao = lastUpdateDao;
    }

    @Autowired
    SimpleMessageConverter converter;

    public void onMessage(Message message, Session session) {
        Map msg = null;
        try {
            msg = (Map) converter.fromMessage(message);
            String domainsByPidJson = (String) msg.get(SyncMessageConstants.PATIENT_DOMAINS_BY_PID);
            if (StringUtils.hasText(domainsByPidJson)) {
                Map<String, Object> domainsByPid = POMUtils.parseJSONtoMap(domainsByPidJson);
                Set<String> pids = StringUtils.commaDelimitedListToSet((String) msg.get(SyncMessageConstants.PATIENT_IDS));
                for (String pid : pids) {
                    try {
                        updatePatientLastUpdated(pid, (List<String>) domainsByPid.get(pid));
                    } catch (Exception e) {
                        syncService.errorDuringMsg(msg, e, ErrorLevel.ERROR);
                    }
                }

            }

            String vistaLastUpdateTimestamp = (String) msg.get(SyncMessageConstants.VISTA_LAST_UPDATED);
            String vistaId = (String) msg.get(SyncMessageConstants.VISTA_ID);

            LOG.debug("updatecomplete VistA {} at {}", vistaId, vistaLastUpdateTimestamp);
            lastUpdateDao.save(new VprUpdate(vistaId, vistaLastUpdateTimestamp));

            // TODO: record timing info
        } catch (Exception e) {
            LOGGER.error("Error synching patient data: " + e.getMessage(), e);
            try {
                errorDao.save(new SyncError(message, msg, e));
                session.recover();
            } catch (JMSException e1) {
                e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }

    }

    private void updatePatientLastUpdated(String pid, List<String> domains) {
        String updatedDomains = "";

        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt == null) {
            LOG.warn("received {} updates for patient {}, who is no longer in the VPR", domains, pid);
            return;

        }

        pt.setLastUpdated(PointInTime.now());

        for (String domain : domains) {
            String domainName;
            int strLength = domain.length();
            if (domain.equals("pharmacy")) {
                domainName = "meds";
            } else if (domain.endsWith("y")) {
                domainName = domain.substring(0, domain.length() - 1) + "ies";
            } else domainName = domain + "s";
            if (updatedDomains.equals("")) {
                updatedDomains = domainName;
            } else if (DefaultGroovyMethods.count(updatedDomains, domainName.toString()) < 1) {
                updatedDomains = updatedDomains + ", " + domainName;
            }

        }

        pt.setData("domainUpdated", updatedDomains);
        patientDao.save(pt);
    }
}
