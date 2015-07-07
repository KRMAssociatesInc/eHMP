package gov.va.cpe.vpr.dao.jms;

import gov.va.cpe.test.mock.jms.ReturnsBrowserCallbackArgument;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.SyncService;
import org.apache.activemq.broker.jmx.QueueViewMBean;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jms.core.BrowserCallback;
import org.springframework.jms.core.JmsOperations;

import javax.jms.JMSException;
import javax.jms.QueueBrowser;
import javax.jms.Session;
import javax.management.openmbean.OpenDataException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.*;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class JmsSyncErrorDaoTests {

    private Session mockJmsSession;
    private QueueBrowser mockJmsQueueBrowser;
    private JmsOperations mockJmsTemplate;
    private ConversionService mockConversionService;
    private SyncService syncService;
    private QueueViewMBean mockQueueMBean;
    private IVprSyncErrorDao mockErrorDao;

    @Before
    public void setUp() throws Exception {
        mockJmsSession = mock(Session.class);
        mockJmsQueueBrowser = mock(QueueBrowser.class);
        mockJmsTemplate = mock(JmsOperations.class);
        mockConversionService = mock(ConversionService.class);
        mockQueueMBean = mock(QueueViewMBean.class);
        mockErrorDao = mock(IVprSyncErrorDao.class);

        syncService = new SyncService();
        syncService.setConversionService(mockConversionService);
        syncService.setErrorDao(mockErrorDao);
        syncService.setJmsTemplate(mockJmsTemplate);
        syncService.setVprDeadLetterQueueMBean(mockQueueMBean);

        when(mockJmsTemplate.browse(eq(MessageDestinations.DEAD_LETTER_QUEUE), any(BrowserCallback.class))).thenAnswer(new ReturnsBrowserCallbackArgument<Object>(mockJmsSession, mockJmsQueueBrowser));
    }

    @Test
    public void testCount() throws Exception {
//        when(mockQueueMBean.getQueueSize()).thenReturn(42L);
        List<SyncError> msgs = createMockErrorMsgList(42);
        when(mockErrorDao.getAllSyncErrors()).thenReturn(msgs);
        when(mockErrorDao.getSyncErrorCount()).thenReturn(42L);
        assertThat(syncService.getErrorCount(), is(42L));

    }

    @SuppressWarnings("unchecked")
	@Test
    public void testFindAllPaginated() throws JMSException {
        List messages = createMockErrorMsgList(100);
        when(mockErrorDao.getAllSyncErrors()).thenReturn(messages);

        Page<SyncError> errors = syncService.findAllErrors(new PageRequest(1, 20, Sort.Direction.DESC, "dateCreated"));
        assertThat(errors.getNumberOfElements(), is(20));
        assertThat(errors.getTotalElements(), is(100L));
    }

    @Test
    public void testFindAllPaginatedLessThanPageSize() throws JMSException {
        List messages = createMockErrorMsgList(15);
        when(mockErrorDao.getAllSyncErrors()).thenReturn(messages);

        Page<SyncError> errors = syncService.findAllErrors(new PageRequest(0, 20, Sort.Direction.DESC, "dateCreated"));
        assertThat(errors.getNumberOfElements(), is(15));
        assertThat(errors.getTotalElements(), is(15L));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testFindAllPaginatedRequestedOffsetGreaterThanQueueSize() throws Exception {
        List messages = createMockErrorMsgList(15);
        when(mockErrorDao.getAllSyncErrors()).thenReturn(messages);

        Page<SyncError> errors = syncService.findAllErrors(new PageRequest(1, 20, Sort.Direction.DESC, "dateCreated"));
    }

    @Test
    public void testFindAllByPatientIdPaginated() throws JMSException {
        List messages = createMockErrorMsgList(5);
        // set them all to the same patient id
        for (Object o : messages) {
        	SyncError msg = (SyncError) o;
            when(msg.getPid()).thenReturn("23");
        }
        when(mockErrorDao.getAllSyncErrorsForPid("23")).thenReturn(messages);
        //when(mockJmsTemplate.browseSelected(eq(SyncQueues.ERROR_QUEUE), eq(SyncMessageConstants.PATIENT_ID + "='23'"), any(BrowserCallback.class))).thenAnswer(new ReturnsBrowserCallbackArgument<Object>(mockJmsSession, mockJmsQueueBrowser));
        //when(mockJmsQueueBrowser.getEnumeration()).thenReturn(Collections.enumeration(messages));

        Page<SyncError> errors = syncService.findAllErrorsByPatientId("23", new PageRequest(0, 10, Sort.Direction.DESC, "dateCreated"));
        assertThat(errors.getNumberOfElements(), is(5));
        assertThat(errors.getTotalElements(), is(5L));
    }

    @Test
    public void testDeleteAll() throws Exception {
        syncService.deleteAllErrors();

        verify(mockQueueMBean).purge();
        verify(mockErrorDao).purge();
    }

    @Test
    public void testDeleteSyncError() throws JMSException {
        SyncError e = new SyncError();
        e.setId("ID:" + 3); // not an actual JMSMessageID, but close enough
        syncService.deleteError(e);

        verify(mockJmsTemplate).receiveSelected(MessageDestinations.DEAD_LETTER_QUEUE, "JMSMessageID='ID:3'");
    }

    @Test
    public void testDeleteById() throws JMSException {
        syncService.deleteError("ID:" + 3);  // not an actual JMSMessageID, but close enough

        verify(mockJmsTemplate).receiveSelected(MessageDestinations.DEAD_LETTER_QUEUE, "JMSMessageID='ID:3'");
    }

    @Test
    public void testDeleteByPatientId() throws JMSException {
        List messages = createMockErrorMsgList(5);
        // set them all to the same patient id
        for (Object o : messages) {
        	SyncError msg = (SyncError) o;
            when(msg.getPid()).thenReturn("23");
        }
//        when(mockQueueMBean.browseMessages(eq(SyncMessageConstants.PATIENT_ID + "='23'"))).thenReturn(messages);
        when(mockJmsTemplate.browseSelected(eq(MessageDestinations.DEAD_LETTER_QUEUE), eq(SyncMessageConstants.PATIENT_ID + "='23'"), any(BrowserCallback.class))).thenAnswer(new ReturnsBrowserCallbackArgument<Object>(mockJmsSession, mockJmsQueueBrowser));
        when(mockJmsQueueBrowser.getEnumeration()).thenReturn(Collections.enumeration(messages));

        syncService.deleteErrorByPatientId("23");

        verify(mockJmsTemplate, times(5)).receiveSelected(MessageDestinations.DEAD_LETTER_QUEUE, SyncMessageConstants.PATIENT_ID + "='23'");
    }

    @Test
    public void testCountAllPatientIds() throws JMSException, OpenDataException {
        List messages = createMockErrorMsgList(13);
        for (Object o : messages) {
        	SyncError msg = (SyncError) o;
            when(msg.getPid()).thenReturn(messages.indexOf(o)+"");
        }
        when(mockErrorDao.getAllSyncErrors()).thenReturn(messages);
        when(mockErrorDao.getErrorPatientCount()).thenReturn(messages.size());
//        when(mockJmsQueueBrowser.getEnumeration()).thenReturn(Collections.enumeration(messages));

        assertThat(syncService.getNumPatientsWithErrors(), is(equalTo(13)));
    }

    @Test
    public void testFindOne() throws JMSException {
        List<SyncError> messages = createMockErrorMsgList(10);
        SyncError fauxMessage = messages.get(3);
        when(mockErrorDao.getOneByJMSMessageId(eq("ID:3"))).thenReturn(messages.get(3));
//        when(mockQueueMBean.browseMessages(eq("JMSMessageID='ID:3'"))).thenReturn(fauxMessage);
//        when(mockJmsTemplate.browseSelected(eq(SyncQueues.ERROR_QUEUE), eq("JMSMessageID='ID:3'"), any(BrowserCallback.class))).thenAnswer(new ReturnsBrowserCallbackArgument<Object>(mockJmsSession, mockJmsQueueBrowser));
//        when(mockJmsQueueBrowser.getEnumeration()).thenReturn(Collections.enumeration(Collections.singletonList(messages.get(3))));
        
        SyncError e = syncService.findOneError("ID:" + 3);

        assertThat(e, notNullValue());
        assertThat(e.getId(), is(equalTo("ID:" + 3)));
    }

    @Test
    public void testSyncErrorSerializable() throws IOException {
        SyncError se = new SyncError();
        new ObjectOutputStream(new ByteArrayOutputStream()).writeObject(se);
    }

    private static Map<String, SyncError> createMockErrorMsgMap(int num) throws JMSException {
        Map<String, SyncError> map = new HashMap<>();
        for(int i = 0; i<num; i++) {
            SyncError err = createMockErrorMsg(i);
            map.put(err.getId(), err);
        }
        return map;
    }

    private static List<SyncError> createMockErrorMsgList(int num) throws JMSException {
        List<SyncError> map = new ArrayList<>();
        for(int i = 0; i<num; i++) {
            SyncError err = createMockErrorMsg(i);
            map.add(err);
        }
        return map;
    }

    private static SyncError createMockErrorMsg(int index) throws JMSException {
        SyncError err = mock(SyncError.class);
        String pid = new Random(System.currentTimeMillis()).toString();
        when(err.getId()).thenReturn("ID:" + Integer.toString(index)); // sort of like a JMS message ID, but not exact
        when(err.getPid()).thenReturn(pid);
        when(err.getJson()).thenReturn("{\"foo\":\"bar\",\"baz\":" + index + "}");
        when(err.getMessage()).thenReturn("message " + index);
        when(err.getItem()).thenReturn("item " + index);
        return err;

    }

//    private static List<MapMessage> createMockErrorMsgs(int num) throws JMSException {
//        ArrayList<MapMessage> mockMessages = new ArrayList<MapMessage>(num);
//        for (int i = 0; i < num; i++) {
//            mockMessages.add(createMockErrorMsg(i));
//        }
//        return mockMessages;
//    }

//    private static MapMessage createMockErrorMsg(int index) throws JMSException {
//        MapMessage msg = mock(MapMessage.class);
//        String pid = new Random(System.currentTimeMillis()).toString();
//        when(msg.getJMSMessageID()).thenReturn("ID:" + Integer.toString(index)); // sort of like a JMS message ID, but not exact
//        when(msg.getStringProperty(SyncMessageConstants.PATIENT_ID)).thenReturn(pid);
//        when(msg.getString(SyncMessageConstants.PATIENT_ID)).thenReturn(pid);
//        when(msg.getString(SyncMessageConstants.RPC_ITEM_CONTENT)).thenReturn("{\"foo\":\"bar\",\"baz\":" + index + "}");
//        when(msg.getString(SyncMessageConstants.EXCEPTION_MESSAGE)).thenReturn("message " + index);
//        when(msg.getString("item")).thenReturn("item " + index);
////        when(msg.getString("stackTrace")).thenReturn("");
//        return msg;
//    }
}
