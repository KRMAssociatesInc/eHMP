package gov.va.cpe.vpr.sync;

import com.codahale.metrics.MetricRegistry;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.msg.ClearPatientMessageHandler;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.jms.JMSException;
import javax.jms.Message;

import org.apache.activemq.broker.jmx.QueueViewMBean;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jms.core.JmsOperations;

import javax.jms.JMSException;
import javax.jms.Message;
import java.util.*;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;
import com.codahale.metrics.MetricRegistry;

public class SyncServiceTests {

    private IPatientDAO mockPatientDao;

    private JmsOperations mockJmsTemplate;

    private ConversionService mockConversionService;

    private IVistaVprDataExtractEventStreamDAO mockPatientDataService;
    
    private SyncService syncService;

    private IVprSyncErrorDao mockErrorDao;

    private IVprSyncStatusDao mockSyncStatusDao;
    
    private ClearPatientMessageHandler mockClearPatientMessageHandler;

    private Pageable mockPageable;
    private QueueViewMBean mockQueueMBean;

    @Before
    public void setUp() {
        mockJmsTemplate = mock(JmsOperations.class);
        mockPatientDao = mock(IPatientDAO.class);
        mockConversionService = mock(ConversionService.class);
        mockPatientDataService = mock(IVistaVprDataExtractEventStreamDAO.class);
        mockClearPatientMessageHandler = mock(ClearPatientMessageHandler.class);
        mockQueueMBean = mock(QueueViewMBean.class);
        mockPageable = new PageRequest(0, 100);
        mockErrorDao = mock(IVprSyncErrorDao.class);
        mockSyncStatusDao = mock(IVprSyncStatusDao.class);

        syncService = new SyncService();
        syncService.setJmsTemplate(mockJmsTemplate);
        syncService.setPatientDao(mockPatientDao);
        syncService.setConversionService(mockConversionService);
        syncService.setMetricRegistry(new MetricRegistry());
        syncService.setVprDeadLetterQueueMBean(mockQueueMBean);
        syncService.setErrorDao(mockErrorDao);
        syncService.setEventStreamDAO(mockPatientDataService);
        syncService.setSyncStatusDao(mockSyncStatusDao);
        syncService.setClearPatientMessageHandler(mockClearPatientMessageHandler);
    }

    @Test
    public void testSyncErrorSearchUnsuccessful() throws JMSException {

        List messages = createMockErrorMsgList(100);
        when(mockErrorDao.getAllSyncErrors()).thenReturn(messages);

        Page<SyncError> pageOfErrors;

        // should return nothing
        pageOfErrors = syncService.findAllErrors(mockPageable, true, "uno", null);
        assertTrue(pageOfErrors.getNumberOfElements() == 0);
    }

    @Test
    public void testSyncErrorSearchSuccessful() throws JMSException {
        // JMS is mocked as all get out so if there is a match, syncService.findAllErrors should
        // just return a single SyncError with the ID of "777" no matter the amount of matches
        List messages = createMockErrorMsgList(100);
        when(mockErrorDao.getAllSyncErrors()).thenReturn(messages);

        // should return one result
        Page<SyncError> pageOfErrors;
        pageOfErrors = syncService.findAllErrors(mockPageable, true, "99", "message");
        assertTrue(pageOfErrors.getNumberOfElements() == 1);
        assertTrue(pageOfErrors.getContent().get(0).getId().equals("ID:99"));
    }

    @Test
    public void testSendClearItemMsg() {
        syncService.sendClearItemMsg("foo");

        Map msg = new HashMap();
        msg.put(SyncMessageConstants.UID, "foo");

        ArgumentCaptor<SyncService.CommandPostProcessor> postProcessorArgumentCaptor = ArgumentCaptor.forClass(SyncService.CommandPostProcessor.class);
        verify(mockJmsTemplate).convertAndSend(eq(MessageDestinations.COMMAND_QUEUE), eq(msg), postProcessorArgumentCaptor.capture());

        assertThat(postProcessorArgumentCaptor.getValue().getCommand(), is(SyncCommand.ITEM_CLEAR));
    }

    @Test
    public void testSendClearPatientMsg() {
        syncService.sendClearPatientMsg("foo");

        Map msg = new HashMap();
        msg.put(SyncMessageConstants.PATIENT_ID, "foo");

        ArgumentCaptor<SyncService.CommandPostProcessor> postProcessorArgumentCaptor = ArgumentCaptor.forClass(SyncService.CommandPostProcessor.class);
        verify(mockClearPatientMessageHandler, times(1)).clearPatient(any(String.class));
    }

    @Test
    public void testSendClearAllPatientsMsg() {
        List<String> pids = Arrays.asList("3", "4", "5");
        when(mockPatientDao.listLoadedPatientIds()).thenReturn(pids);

        syncService.sendClearAllPatientsMsg();

        verify(mockPatientDao).listLoadedPatientIds();
        verify(mockClearPatientMessageHandler, times(pids.size())).clearPatient(any(String.class));
    }

    @Test
    public void testSendReindexPatientMsg() {
        syncService.sendReindexPatientMsg("foo");

        Map msg = new HashMap();
        msg.put(SyncMessageConstants.PATIENT_ID, "foo");

        ArgumentCaptor<SyncService.CommandPostProcessor> postProcessorArgumentCaptor = ArgumentCaptor.forClass(SyncService.CommandPostProcessor.class);
        verify(mockJmsTemplate).convertAndSend(eq(MessageDestinations.COMMAND_QUEUE), eq(msg), postProcessorArgumentCaptor.capture());

        assertThat(postProcessorArgumentCaptor.getValue().getCommand(), is(SyncCommand.PATIENT_REINDEX));
    }

    @Test
    public void testSendReindexAllPatientsMsg() {
        List<String> pids = Arrays.asList("3", "4", "5");
        when(mockPatientDao.listLoadedPatientIds()).thenReturn(pids);

        syncService.sendReindexAllPatientsMsg();

        verify(mockPatientDao).listLoadedPatientIds();

        verify(mockJmsTemplate, times(pids.size()+1)).convertAndSend(eq(MessageDestinations.COMMAND_QUEUE), anyMap(), any(SyncService.CommandPostProcessor.class));
    }

    @Test
    public void testSendImportChunkMsg() {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson("{\"foo\":\"bar\"}","ABCD", "1234", "foo");
        chunk.setPatientId("5678");

        Map msg = new HashMap();
        msg.put(SyncMessageConstants.VISTA_ID, "ABCD");
        msg.put(SyncMessageConstants.PATIENT_DFN, "1234");

        when(mockConversionService.convert(chunk, Map.class)).thenReturn(msg);

        syncService.sendImportVistaDataExtractItemMsg(chunk);

        ArgumentCaptor<SyncService.PatientCommandPostProcessor> postProcessorArgumentCaptor = ArgumentCaptor.forClass(SyncService.PatientCommandPostProcessor.class);
        verify(mockJmsTemplate).convertAndSend(eq(MessageDestinations.PATIENT_QUEUE), eq(msg), postProcessorArgumentCaptor.capture());

        assertThat(postProcessorArgumentCaptor.getValue().getCommand(), is(SyncCommand.IMPORT_CHUNK));
        assertThat(postProcessorArgumentCaptor.getValue().pid, is("5678"));
    }

    @Test
    public void testSendImportChunkForAutoUpdateMsg() {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson("{\"foo\":\"bar\"}","ABCD", "1234", "foo");
        chunk.setPatientId("5678");
        chunk.setBatch(false);

        Map msg = new HashMap();
        msg.put(SyncMessageConstants.VISTA_ID, "ABCD");
        msg.put(SyncMessageConstants.PATIENT_DFN, "1234");

        when(mockConversionService.convert(chunk, Map.class)).thenReturn(msg);

        syncService.sendImportVistaDataExtractItemMsg(chunk);

        ArgumentCaptor<SyncService.PatientCommandPostProcessor> postProcessorArgumentCaptor = ArgumentCaptor.forClass(SyncService.PatientCommandPostProcessor.class);
        verify(mockJmsTemplate).convertAndSend(eq(MessageDestinations.PATIENT_QUEUE), eq(msg), postProcessorArgumentCaptor.capture());

        assertThat(postProcessorArgumentCaptor.getValue().getCommand(), is(SyncCommand.IMPORT_CHUNK));
        assertThat(postProcessorArgumentCaptor.getValue().pid, is("5678"));
        assertThat(postProcessorArgumentCaptor.getValue().batch, is(false));
    }

    @Test
    public void testCommandPostProcessor() throws Exception {
        Message message = mock(Message.class);
        SyncService.CommandPostProcessor p = new SyncService.CommandPostProcessor("foo");
        message = p.postProcessMessage(message);

        verify(message).setStringProperty(SyncMessageConstants.COMMAND, "foo");
    }

    @Test
    public void testPatientCommandPostProcessor() throws Exception {
        Message message = mock(Message.class);
        SyncService.PatientCommandPostProcessor p = new SyncService.PatientCommandPostProcessor("foo", "bar");
        message = p.postProcessMessage(message);

        verify(message).setStringProperty(SyncMessageConstants.COMMAND, "foo");
        verify(message).setStringProperty(SyncService.JMSXGROUP_ID, "vpr.pt.bar");
        verify(message).setStringProperty(SyncMessageConstants.PATIENT_ID, "bar");
    }

    @Test
    public void testPatientCommandPostProcessorForAutoUpdateMessage() throws Exception {
        Message message = mock(Message.class);
        SyncService.PatientCommandPostProcessor p = new SyncService.PatientCommandPostProcessor("foo", "bar", false);
        message = p.postProcessMessage(message);

        verify(message).setStringProperty(SyncMessageConstants.COMMAND, "foo");
        verify(message).setStringProperty(SyncService.JMSXGROUP_ID, "vpr.pt.bar");
        verify(message).setStringProperty(SyncMessageConstants.PATIENT_ID, "bar");
        verify(message).setJMSPriority(SyncService.AUTO_UPDATE_JMS_PRIORITY);
    }

    @Test
    public void testOperationalDomainCommandPostProcessor() throws Exception {
        Message message = mock(Message.class);
        SyncService.OperationalDomainCommandPostProcessor p = new SyncService.OperationalDomainCommandPostProcessor("foo", "bar");
        message = p.postProcessMessage(message);

        verify(message).setStringProperty(SyncMessageConstants.COMMAND, "foo");
        verify(message).setStringProperty(SyncService.JMSXGROUP_ID, "odc.domain.bar");
    }

    @Test
    public void testIsPatientNotLoadedAndNotLoading() throws Exception {
        String pid = "ABCD;42";
        when(mockSyncStatusDao.findOneByPid(pid)).thenReturn(null);

        assertThat(syncService.isNotLoadedAndNotLoading(pid), is(true));

        verify(mockSyncStatusDao).findOneByPid(pid);
    }

    @Test
    public void testGetPatientSyncStatus() throws Exception {
        String pid = "ABCD;42";

        SyncStatus mockSyncStatus = new SyncStatus();
        mockSyncStatus.setData("pid", pid);
        when(mockSyncStatusDao.findOneByPid(pid)).thenReturn(mockSyncStatus);

        SyncStatus patientSyncStatus = syncService.getPatientSyncStatus(pid);
        assertThat(patientSyncStatus, is(sameInstance(patientSyncStatus)));

        verify(mockSyncStatusDao).findOneByPid(pid);
    }

    @Test
    public void testGetOperationalSyncStatus() throws Exception {
        SyncStatus mockSyncStatus = new SyncStatus();
        mockSyncStatus.setData("uid", SyncStatus.OPERATIONAL_DATA_STATUS_UID);
        when(mockSyncStatusDao.findOneForOperational()).thenReturn(mockSyncStatus);

        SyncStatus patientSyncStatus = syncService.getOperationalSyncStatus();
        assertThat(patientSyncStatus, is(sameInstance(mockSyncStatus)));

        verify(mockSyncStatusDao).findOneForOperational();
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
        SyncError err = new SyncError();//mock(SyncError.class);
        String pid = new Random(System.currentTimeMillis()).toString();
        err.setId("ID:" + Integer.toString(index)); // sort of like a JMS message ID, but not exact
        err.setPid(pid);
        err.setJson("{\"foo\":\"bar\",\"baz\":" + index + "}");
        err.setMessage("message " + index);
        err.setItem("item " + index);
        return err;

    }
}
