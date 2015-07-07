package gov.va.cpe.vpr.sync.msg;


import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import com.google.common.collect.ImmutableMap;
import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.odc.Person;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.expirationrulesengine.IExpirationRulesEngine;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.jmeadows.IJMeadowsPatientService;
import gov.va.jmeadows.JMeadowsPatientService;

import gov.va.nhin.vler.service.IVlerService;
import gov.va.nhin.vler.service.NhinAdapterCfg;
import gov.va.nhin.vler.service.RetrieveVlerDocumentService;
import gov.va.nhin.vler.service.VlerService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.jms.support.converter.SimpleMessageConverter;

import org.slf4j.Logger;

import javax.jms.JMSException;
import java.util.*;

import javax.jms.Message;
import javax.jms.Session;

import static gov.va.cpe.vpr.pom.POMUtils.convertObjectToNode;
import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

public class SyncVlerMessageHandlerTest {

    private static final gov.va.cpe.vpr.sync.SyncStatus SYNCSTATUS_WITH_VLERSITE = new SyncStatus() {{
        addSite("uid", "dfn", "VLER");
    }};

    private IVlerService mockVlerService;
    private ISyncService syncService;
    private SyncVlerMessageHandler handler;
    private SimpleMessageConverter converter;
    private MetricRegistry metrics;
    private IVprSyncStatusDao syncStatusDao;
    private IBroadcastService broadcastService;
    private Logger mockLogger;
    private IExpirationRulesEngine mockExpirationRulesEngine;
    private IPatientDAO patientDao;

    @Before
    public void setUp() {
        mockVlerService = mock(IVlerService.class);
        syncService = mock(ISyncService.class);
        converter = mock(SimpleMessageConverter.class);
        metrics = mock(MetricRegistry.class);
        syncStatusDao = mock(IVprSyncStatusDao.class);
        broadcastService = mock(IBroadcastService.class);
        mockLogger = mock(Logger.class);
        mockExpirationRulesEngine = mock(IExpirationRulesEngine.class);
        patientDao = mock(IPatientDAO.class);

        handler = new SyncVlerMessageHandler();
        handler.setVlerService(mockVlerService);
        handler.setSyncService(syncService);
        handler.setMessageConverter(converter);
        handler.setMetricRegistry(metrics);
        handler.setSyncStatusDao(syncStatusDao);
        handler.setBroadcastService(broadcastService);
        handler.setLogger(mockLogger);
        handler.setExpirationRulesEngine(mockExpirationRulesEngine);
        handler.setPatientDao(patientDao);
    }

    private PatientIds getPatientIds() {
        String vistaId = "9E7A";
        String icn = "123456789";
        String dfn = "4321";
        String pid = vistaId +";"+ dfn;
        String uid = "urn:va:patient:"+vistaId+":"+ dfn +":"+ icn;
        String edipi = "0000000001";

        return new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .edipi(edipi)
                .uid(uid)
                .build();
    }

    private static Person getPerson(String uid) {
        Map<String, Object> data = new HashMap<>();
        data.put("uid", uid);
        Person person = new Person(data);
        return person;
    }

    private List<VistaDataChunk> getChunks(final String uid, final String domain) {
        return new ArrayList<VistaDataChunk>() {{
            add(VistaDataChunk.createVistaDataChunk("ABCD", "/foo/bar", convertObjectToNode(getPerson(uid)), domain, 0, 1));
        }};
    }

    @Test
    public void testOnMessage() throws JMSException {
        String personDomain = "person";
        String syncDomain = "syncStatus";
        Map message = ImmutableMap
                .builder()
                .put("patientIds", this.getPatientIds().toMap())
                .build();
        Session mockSession = Mockito.mock(Session.class);
        Message mockMessage = Mockito.mock(Message.class);
        when(mockVlerService.fetchVlerData((PatientIds)anyObject())).thenReturn(this.getChunks(this.getPatientIds().getUid(), personDomain));
        when(converter.fromMessage(mockMessage)).thenReturn(message);
        when(metrics.timer(anyString())).thenReturn(new Timer());
        when(syncStatusDao.findOneByPid(anyString())).thenReturn(SYNCSTATUS_WITH_VLERSITE);
        when(syncStatusDao.saveMergeSyncStatus(any(SyncStatus.class), (HashSet<String>)anyObject())).thenReturn(new SyncStatus());

        handler.onMessage(mockMessage, mockSession);
        ArgumentCaptor<VistaDataChunk> vistaDataChunkArgumentCaptor = ArgumentCaptor.forClass(VistaDataChunk.class);

        verify(syncService, times(2)).sendImportVistaDataExtractItemMsg(vistaDataChunkArgumentCaptor.capture());
        List<VistaDataChunk> chunks = vistaDataChunkArgumentCaptor.getAllValues();
        boolean bFoundPerson = false;
        boolean bFoundSyncStatus = false;
        for (VistaDataChunk chunk : chunks) {
            if (personDomain.equals(chunk.getDomain())) {
                bFoundPerson = true;
            }
            else if (syncDomain.equals(chunk.getDomain())) {
                bFoundSyncStatus = true;
            }
        }
        assertEquals(bFoundPerson, true);
        assertEquals(bFoundSyncStatus, true);
    }

    @Test
    public void testFetchVlerData() {
        PatientIds patientIds = getPatientIds();

        VistaDataChunk dataChunk = new VistaDataChunk();
        dataChunk.setContent("test.content");
        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(dataChunk);

        when(mockVlerService.fetchVlerData((PatientIds) anyObject())).thenReturn(vistaDataChunkList);

        PatientDemographics pt = new PatientDemographics();
        List<VistaDataChunk> resp = handler.fetchData(patientIds, pt);

        assertNotNull(resp);
        assertEquals(resp.size(), 1);
        assertEquals(resp.get(0).getContent(), dataChunk.getContent());

        //test null response
        when(mockVlerService.fetchVlerData((PatientIds) anyObject())).thenReturn(null);

        List<VistaDataChunk> resp2 = handler.fetchData(patientIds, pt);

        assertNull(resp2);

    }
}
