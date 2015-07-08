package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.Map;

@Service
public class ReindexPatientMessageHandler implements SessionAwareMessageListener {

	private IVprSyncErrorDao errorDao;

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }

    private static Logger LOGGER = LoggerFactory.getLogger(ReindexPatientMessageHandler.class);

    private ISolrDao solrDao;

    private IGenericPatientObjectDAO genericPatientRelatedDao;

    public ISolrDao getSolrDao() {
        return solrDao;
    }

    @Autowired
    public void setSolrDao(ISolrDao solrDao) {
        this.solrDao = solrDao;
    }

    public IGenericPatientObjectDAO getGenericPatientRelatedDao() {
        return genericPatientRelatedDao;
    }

    @Autowired
    public void setGenericPatientRelatedDao(IGenericPatientObjectDAO genericPatientRelatedDao) {
        this.genericPatientRelatedDao = genericPatientRelatedDao;
    }

    @Autowired
    SimpleMessageConverter converter;

    public void onMessage(Message message, Session session) {
        Map msg = null;
        try {
            msg = (Map) converter.fromMessage(message);
            final String pid = (String) msg.get(SyncMessageConstants.PATIENT_ID);
            Assert.hasText(pid, "[Assertion failed] - the 'pid' argument must have text; it must not be null, empty, or blank");

            LOGGER.debug("Reindexing " + pid);

            // TODO: should probably centralize this domain list somewhere
            for (String domain : UidUtils.getAllPatientDataDomains()) {
            	Class domainClass = UidUtils.getDomainClass(domain);
                Page<IPatientObject> items = genericPatientRelatedDao.findAllByPID(domainClass, pid, null); // Pageable is ignored for now, JDS need to implement pagination
                if (items == null) continue;
                for (IPatientObject item : items) {
                    try {
                        solrDao.save(item);
                    } catch (Exception e) {
                        LOGGER.error("unable to reindex item " + String.valueOf(item), e);
                    }
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error synching patient data: " + e.getMessage(), e);
            try {
                errorDao.save(new SyncError(message, msg, e));
                session.recover();
            } catch (JMSException e1) {
                LOGGER.error("Exception saving sync error: " + e.getMessage(), e1);
            }
        }

    }
}
