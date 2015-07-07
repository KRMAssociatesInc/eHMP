package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.sync.SyncError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.stereotype.Service;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.Map;

@Service
class ClearItemMessageHandler implements SessionAwareMessageListener {

    private IVprSyncErrorDao errorDao;

    private static Logger LOGGER = LoggerFactory.getLogger(ReindexPatientMessageHandler.class);

    @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }

    @Autowired
	IGenericPatientObjectDAO vprDao;

    @Autowired
    SimpleMessageConverter converter;

    @Override
	public void onMessage(Message message, Session session) {
        Map msg = null;
        try {
            msg = (Map) converter.fromMessage(message);
            assert msg.get(gov.va.cpe.vpr.sync.SyncMessageConstants.UID)!=null;
            String uid = msg.get(gov.va.cpe.vpr.sync.SyncMessageConstants.UID).toString();
            vprDao.deleteByUID(uid);
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
}
