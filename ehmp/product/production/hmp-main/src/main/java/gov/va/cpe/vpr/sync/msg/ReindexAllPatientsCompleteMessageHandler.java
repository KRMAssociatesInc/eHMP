package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.sync.SyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.stereotype.Service;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 5/6/14
 * Time: 9:17 AM
 * To change this template use File | Settings | File Templates.
 */
@Service
public class ReindexAllPatientsCompleteMessageHandler implements SessionAwareMessageListener {

    private SyncService syncService;

    @Autowired
    public void setSyncService(SyncService syncService) {
        this.syncService = syncService;
    }

    @Override
    public void onMessage(Message message, Session session) throws JMSException {
        syncService.setReindexAllComplete(true);
    }
}
