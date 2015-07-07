package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.dao.IVprUpdateDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.jms.support.converter.SimpleMessageConverter;

import javax.jms.Message;
import javax.jms.Session;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VprUpdateCompleteMessageHandlerTests {

    private VprUpdateCompleteMessageHandler handler;
    Message mockMessage;
    Session mockSession;
    SimpleMessageConverter converter;

    @Before
    public void setUp() throws Exception {
        handler = new VprUpdateCompleteMessageHandler();
        handler.setSolrService(mock(ISolrDao.class));
        handler.setSyncService(mock(ISyncService.class));
        handler.setPatientDao(mock(IPatientDAO.class));
        handler.setVistaAccountDao(mock(IVistaAccountDao.class));
        handler.setLastUpdateDao(mock(IVprUpdateDao.class));
        converter = mock(SimpleMessageConverter.class);
        mockMessage = Mockito.mock(Message.class);
        mockSession = Mockito.mock(Session.class);
        handler.converter = converter;
    }

    @Test
    public void testOnMessage() throws Exception {
        Map<String, String> msg = new HashMap<String, String>();
        msg.put(SyncMessageConstants.VISTA_LAST_UPDATED, "foo");
        msg.put(SyncMessageConstants.VISTA_ID, "A1B2");
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);


    }
}
