package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.jms.support.converter.SimpleMessageConverter;

import javax.jms.Message;
import javax.jms.Session;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ClearItemMessageHandlerTests {

    private IGenericPatientObjectDAO mockGenericDao;
    private ClearItemMessageHandler handler;
    Message mockMessage;
    Session mockSession;
    SimpleMessageConverter converter;

    @Before
    public void setUp() throws Exception {
        mockGenericDao = mock(IGenericPatientObjectDAO.class);

        handler = new ClearItemMessageHandler();
        handler.vprDao = mockGenericDao;
        converter = mock(SimpleMessageConverter.class);
        mockMessage = Mockito.mock(Message.class);
        mockSession = Mockito.mock(Session.class);
        handler.converter = converter;
    }

    @Test
    public void testOnMessage() throws Exception {
        Map msg = new HashMap();
        msg.put(SyncMessageConstants.UID, "urn:va:bar:baz:order:foo");
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);
        msg.put(SyncMessageConstants.UID, "urn:va:team:foo:bar");
        handler.onMessage(mockMessage, mockSession);
        verify(mockGenericDao).deleteByUID("urn:va:bar:baz:order:foo");
        verify(mockGenericDao).deleteByUID("urn:va:team:foo:bar");
    }
}
