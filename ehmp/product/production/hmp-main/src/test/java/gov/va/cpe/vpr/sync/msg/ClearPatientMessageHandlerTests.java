package gov.va.cpe.vpr.sync.msg;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientFacility;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.dao.ISolrDao;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.jmeadows.util.document.DodDocumentService;
import gov.va.jmeadows.util.document.IDodDocumentService;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.core.env.Environment;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME;
import static org.mockito.Mockito.*;

public class ClearPatientMessageHandlerTests {

    public static final String MOCK_PID = "ABCD;23";
    public static final String MOCK_LOCAL_PATIENT_ID_FOR_MOCK_VISTA_ID = "42";
    public static final String MOCK_HMP_SERVER_ID = "flibberty-floo";
    public static final String MOCK_VISTA_ID = "ABCD";
    public static final String MOCK_STATION_NUMBER = "500";

    private ClearPatientMessageHandler handler;

    private Environment mockEnvironment;
    private IPatientDAO mockPatientDao;
    private ISyncService mockSyncService;
    private IVprSyncStatusDao mockSyncStatusDao;
    private ISolrDao mockSolrDao;
    private PatientDemographics mockPatient;
    private List<PatientDemographics> mockPatientList;
    private IVistaVprDataExtractEventStreamDAO mockVistaPatientDataService;
    private IDodDocumentService mockDodDocumentService;
    Message mockMessage;
    Session mockSession;
    SimpleMessageConverter converter;
    private IVprSyncErrorDao mockErrorDao;
    private List<String> mockVistaSites;
    private IVistaAccountDao mockVistaAccountDao;

    @Before
    public void setUp() throws Exception {
        mockEnvironment = mock(Environment.class);
        mockPatientDao = mock(IPatientDAO.class);
        mockSyncService = mock(ISyncService.class);
        mockSyncStatusDao = mock(IVprSyncStatusDao.class);
        mockSolrDao = mock(ISolrDao.class);
        mockVistaPatientDataService = mock(IVistaVprDataExtractEventStreamDAO.class);
        mockErrorDao = mock(IVprSyncErrorDao.class);
        mockDodDocumentService = mock(DodDocumentService.class);
        mockVistaAccountDao = mock(IVistaAccountDao.class);
        
        handler = new ClearPatientMessageHandler();
        handler.setPatientDao(mockPatientDao);
        handler.setSyncService(mockSyncService);
        handler.setSolrDao(mockSolrDao);
        handler.setVprSyncStatusDao(mockSyncStatusDao);
        handler.setVistaPatientDataService(mockVistaPatientDataService);
        handler.setErrorDao(mockErrorDao);
        handler.setDodDocumentService(mockDodDocumentService);
        handler.setVistaAccountDao(mockVistaAccountDao);
        converter = mock(SimpleMessageConverter.class);
        mockMessage = Mockito.mock(Message.class);
        mockSession = Mockito.mock(Session.class);
        handler.converter = converter;

        mockPatient = new PatientDemographics();
        mockPatient.setData("pid", MOCK_PID);
        mockPatientList = new ArrayList<PatientDemographics>();
        mockPatientList.add(mockPatient);
        mockPatientList.add(mockPatient);
        mockVistaSites = new ArrayList<String>();
        mockVistaSites.add("1111");
        mockVistaSites.add("2222");

        PatientFacility facility = new PatientFacility();
        facility.setData("systemId", MOCK_VISTA_ID);
        facility.setData("code", MOCK_STATION_NUMBER);
        facility.setData("localPatientId", MOCK_LOCAL_PATIENT_ID_FOR_MOCK_VISTA_ID);
        mockPatient.addToFacilities(facility);

        VistaAccount mockVistaAccount = new VistaAccount();
        mockVistaAccount.setVistaId(MOCK_VISTA_ID);

        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn(MOCK_HMP_SERVER_ID);
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(mockPatient);
        when(mockPatientDao.findListByPid(MOCK_PID)).thenReturn(mockPatientList);
        // S64 MERGE - need to fix it.
//        when(mockVistaPatientDataService.getPatientVistaSites(MOCK_PID)).thenReturn(mockVistaSites);
    }

    @Test
    public void testOnMessage() throws Exception {
        Map msg = new HashMap();
        msg.put(SyncMessageConstants.PATIENT_ID, MOCK_PID);
        
        List<String> vistaIds = new ArrayList<>();
        vistaIds.add(PidUtils.getVistaId(MOCK_PID));
        when(mockVistaAccountDao.findAllVistaIds()).thenReturn(vistaIds);
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);

        // verify deletion
        verify(mockPatientDao).findByPid(MOCK_PID);
        // s64 MERGE - NEED TO FIX IT
        //verify(mockPatientDao).findListByPid(MOCK_PID);
        verify(mockPatientDao).deleteByPID(MOCK_PID);
        verify(mockSyncService).deleteErrorByPatientId(MOCK_PID);
        verify(mockSolrDao).deleteByQuery("pid:" + MOCK_PID);
        verify(mockDodDocumentService).deleteDodDocuments(MOCK_PID);

        // verify unsubscribe
        //verify(mockVistaPatientDataService).unsubscribePatient(MOCK_VISTA_ID, MOCK_LOCAL_PATIENT_ID_FOR_MOCK_VISTA_ID, MOCK_HMP_SERVER_ID);
        verify(mockVistaPatientDataService).unsubscribePatient(MOCK_VISTA_ID, MOCK_PID, true,false);

        // S64 MERGE - Our version of that line.
        //verify(mockVistaPatientDataService).removePtSubscription(MOCK_PID, mockVistaSites);
    }
    
    @Test
    public void testClearPatientBySecondarySitePid() throws Exception {

        String primaryPid = "9E7A;3";
        List<String> vistaIds = new ArrayList<>();
        vistaIds.add(PidUtils.getVistaId(primaryPid));
        when(mockVistaAccountDao.findAllVistaIds()).thenReturn(vistaIds);
        
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", MOCK_PID);
        pt.setData("icn", "1001");
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(pt);

        List<PatientDemographics> ptDemographicsList = new ArrayList<>();

        ptDemographicsList.add(pt);

        PatientDemographics pt1 = new PatientDemographics();
        pt1.setData("pid", primaryPid);
        pt1.setData("icn", "1001");
        ptDemographicsList.add(pt1);
        
        when(mockPatientDao.findListByPid("1001")).thenReturn(ptDemographicsList);

        handler.clearPatient(MOCK_PID);

        
        verify(mockVistaAccountDao).findAllVistaIds();        
        verify(mockPatientDao).findByPid(MOCK_PID);
        verify(mockPatientDao).findListByPid("1001");
        verify(mockPatientDao).deleteByPID(primaryPid);
        verify(mockSyncService).deleteErrorByPatientId(primaryPid);
        verify(mockSolrDao).deleteByQuery("pid:" + primaryPid);
        verify(mockDodDocumentService).deleteDodDocuments(primaryPid);

        // verify unsubscribe
        verify(mockVistaPatientDataService).unsubscribePatient(PidUtils.getVistaId(primaryPid), primaryPid, true,false);
        
    }
    
    @Test
    public void testOnMessageWithPatientIdNotInVpr() throws Exception {
        reset(mockPatientDao);
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(null);

        Map msg = new HashMap();
        msg.put(SyncMessageConstants.PATIENT_ID, MOCK_PID);

        List<String> vistaIds = new ArrayList<>();
        vistaIds.add(PidUtils.getVistaId(MOCK_PID));
        when(mockVistaAccountDao.findAllVistaIds()).thenReturn(vistaIds);
        
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);

        // verify deletion
        verify(mockPatientDao).findByPid(MOCK_PID);
        verifyNoMoreInteractions(mockPatientDao);
        verifyZeroInteractions(mockSolrDao);
        verifyZeroInteractions(mockVistaPatientDataService);
    }

    @Test
    public void testOnMessageMissingPatientId() throws JMSException {
        Map msg = new HashMap();
        when(converter.fromMessage(mockMessage)).thenReturn(msg);
        handler.onMessage(mockMessage, mockSession);
        verify(mockErrorDao).save(any(SyncError.class));
    }
}
