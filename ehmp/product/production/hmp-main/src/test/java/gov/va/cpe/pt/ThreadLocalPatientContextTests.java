package gov.va.cpe.pt;

import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.PatientChecks;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientDemographicsAdditional;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.hmp.audit.IUserAuditService;
import gov.va.hmp.auth.UserContext;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class ThreadLocalPatientContextTests {

    public static final String MOCK_VISTA_ID = "ABCD";
    public static final String MOCK_PID = PidUtils.getPid(MOCK_VISTA_ID, "1234");

    private ThreadLocalPatientContext ptContext;
    private IParamService mockParamService;
    private ISyncService mockSyncService;
    private IVistaPatientContextService mockVistaPatientContextService;
    private IGenericPOMObjectDAO mockJdsDao;
    private IUserAuditService mockAuditService;
    private UserContext mockUserContext;
    private PatientDemographicsAdditional patientDemographicsAdditional;

    @Before
    public void setUp() throws Exception {
        mockParamService = mock(IParamService.class);
        mockVistaPatientContextService = mock(VistaPatientContextService.class);
        mockSyncService = mock(ISyncService.class);
        mockJdsDao = mock(IGenericPOMObjectDAO.class);
        mockAuditService = mock(IUserAuditService.class);
        mockUserContext = mock(UserContext.class);

        ptContext = new ThreadLocalPatientContext();
        ptContext.setParamService(mockParamService);
        ptContext.setVistaPatientContextService(mockVistaPatientContextService);
        ptContext.setSyncService(mockSyncService);
        ptContext.setJdsDao(mockJdsDao);
        ptContext.setAuditService(mockAuditService);
        ptContext.setUserContext(mockUserContext);

        patientDemographicsAdditional = new PatientDemographicsAdditional("dummy-uid", "3C-F", "foo", "shortFoo", "cwadf", null);
                //.primaryCareProvider("bar").build();
    }

    @Test
    public void testEqualsAndHashCode() throws Exception {
        assertThat(ptContext.equals(ptContext), is(true));

        ThreadLocalPatientContext ptContext2 = new ThreadLocalPatientContext();

        // both contexts have null pt
        assertThat(ptContext.equals(ptContext2), is(true));
        assertThat(ptContext2.equals(ptContext), is(true));
        assertThat(ptContext2.hashCode(), is(ptContext.hashCode()));

        // one context has pid set, one has null pt
        ptContext.setCurrentPatientPid(MOCK_PID);

        assertThat(ptContext.equals(ptContext2), is(false));
        assertThat(ptContext2.equals(ptContext), is(false));
        assertThat(ptContext2.hashCode(), is(not(ptContext.hashCode())));

        // both contexts have the same PID
        ptContext2.setCurrentPatientPid(MOCK_PID);
        assertThat(ptContext.equals(ptContext2), is(true));
        assertThat(ptContext2.equals(ptContext), is(true));
        assertThat(ptContext2.hashCode(), is(ptContext.hashCode()));
    }

    @Test
    public void testAfterPropertiesSetRestoresPidFromUserPreference() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        when(mockParamService.getUserPreference(ptContext.getUserPreferenceKey())).thenReturn(MOCK_PID);
        PatientDemographics mockPatient = createMockPatient();
        when(mockVistaPatientContextService.fetchVistaPatientContextInfo(MOCK_PID, false)).thenReturn(new VistaPatientContextInfo(mockPatient, patientDemographicsAdditional, new PatientChecks()));

        ptContext.afterPropertiesSet();

        assertThat(ptContext.getCurrentPatientPid(), is(MOCK_PID));
        assertThat(ptContext.getCurrentPatient(), sameInstance(mockPatient));

        verify(mockParamService).getUserPreference(ptContext.getUserPreferenceKey());
        verifyZeroInteractions(mockJdsDao);
    }

    @Test
    public void testAfterPropertiesSetAndUserNotLoggedInDoesntInitializeContext() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(false);

        ptContext.afterPropertiesSet();

        assertThat(ptContext.isInitialized(), is(false));
        verifyZeroInteractions(mockJdsDao, mockParamService);
    }

    @Test
    public void testRestoreInvalidPidFromUserPreference() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        when(mockParamService.getUserPreference(ptContext.getUserPreferenceKey())).thenReturn("12345");
        when(mockVistaPatientContextService.fetchVistaPatientContextInfo("12345", false)).thenThrow(new IllegalArgumentException());

        ptContext.afterPropertiesSet();

        assertThat(ptContext.getCurrentPatientPid(), is(nullValue()));
        assertThat(ptContext.getCurrentPatient(), is(nullValue()));

        verify(mockParamService).getUserPreference(ptContext.getUserPreferenceKey());
        verifyZeroInteractions(mockJdsDao);
    }

//    @Test
//    public void testRestoreInvalidPidFromUserPreference() throws Exception {
//        when(mockParamService.getUserPreference(ptContext.getUserPreferenceKey())).thenReturn("12345");
//        PatientDemographics mockPatient = createMockPatient();
//        when(mockVistaPatientContextService.fetchVistaPatientContextInfo("12345", false)).thenReturn(new VistaPatientContextInfo(mockPatient, new PatientDemographicsAdditional("3C-F", "foo", "cwadf"), new PatientChecks()));
//
//        ptContext.afterPropertiesSet();
//
//        assertThat(ptContext.getCurrentPatientPid(), is("12345"));
//        assertThat(ptContext.getCurrentPatient(), sameInstance(mockPatient));
//
//        verify(mockParamService).getUserPreference(ptContext.getUserPreferenceKey());
//    }

    @Test
    public void testAfterPropertiesSetRestoresUnknownPid() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        when(mockParamService.getUserPreference(ptContext.getUserPreferenceKey())).thenReturn("");

        ptContext.afterPropertiesSet();

        assertThat(ptContext.getCurrentPatientPid(), nullValue());
        assertThat(ptContext.getCurrentPatient(), nullValue());

        verify(mockParamService).getUserPreference(ptContext.getUserPreferenceKey());
        verifyZeroInteractions(mockJdsDao);
    }

    @Test
    public void testSetCurrentPatientPid() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);
        ptContext.afterPropertiesSet();
        reset(mockJdsDao, mockParamService);

        PatientDemographics mockPatient = createMockPatient();
        when(mockVistaPatientContextService.fetchVistaPatientContextInfo(MOCK_PID, true)).thenReturn(new VistaPatientContextInfo(mockPatient, patientDemographicsAdditional, new PatientChecks()));
        when(mockJdsDao.save(mockPatient)).thenReturn(mockPatient);
        when(mockSyncService.isNotLoadedAndNotLoading(MOCK_PID)).thenReturn(true);

        ptContext.setCurrentPatientPid(MOCK_PID);
        assertThat(ptContext.getCurrentPatientPid(), is(MOCK_PID));

        verify(mockJdsDao).save(mockPatient);
        verify(mockVistaPatientContextService).fetchVistaPatientContextInfo(MOCK_PID, true);
        verify(mockSyncService).isNotLoadedAndNotLoading(MOCK_PID);
        verify(mockSyncService).subscribePatient(PidUtils.getVistaId(MOCK_PID), MOCK_PID);
        verify(mockAuditService).audit(eq("sync"), anyString());
    }

    @Test
    public void testSetCurrentPatientPidToNull() throws Exception {
        // set up an existing context
        ptContext.setCurrentPatientPid(MOCK_PID);

        // set team to null
        ptContext.setCurrentPatientPid(null);
        assertThat(ptContext.getCurrentPatientPid(), is(nullValue()));
    }

    @Test
    public void testSetCurrentPatient() throws Exception {
        PatientDemographics mockPatient = createMockPatient();
        when(mockVistaPatientContextService.fetchVistaPatientContextInfo(MOCK_PID, true)).thenReturn(new VistaPatientContextInfo(mockPatient, patientDemographicsAdditional, new PatientChecks()));
        when(mockJdsDao.save(mockPatient)).thenReturn(mockPatient);
        when(mockSyncService.isNotLoadedAndNotLoading(MOCK_PID)).thenReturn(true);
        when(mockUserContext.isLoggedIn()).thenReturn(true);

        ptContext.afterPropertiesSet();

        ptContext.setCurrentPatient(mockPatient);
        assertThat(ptContext.getCurrentPatientPid(), is(MOCK_PID));

        PatientDemographics pt = ptContext.getCurrentPatient();
        assertThat(pt, is(equalTo(mockPatient)));

        verify(mockJdsDao).save(mockPatient);
        verify(mockVistaPatientContextService).fetchVistaPatientContextInfo(MOCK_PID, true);
        verify(mockSyncService).isNotLoadedAndNotLoading(MOCK_PID);
        verify(mockSyncService).subscribePatient(PidUtils.getVistaId(MOCK_PID), MOCK_PID);
        verify(mockAuditService).audit(eq("sync"), anyString());
    }

    @Test
    public void testSetCurrentPatientToInvalidPid() throws Exception {
        PatientDemographics mockPatient = new PatientDemographics();
        mockPatient.setData("pid", "12345");
        when(mockSyncService.isNotLoadedAndNotLoading("12345")).thenReturn(true);

        ptContext.setCurrentPatient(mockPatient);
        assertThat(ptContext.getCurrentPatientPid(), is(nullValue()));

        PatientDemographics pt = ptContext.getCurrentPatient();
        assertThat(pt, is(nullValue()));

        verifyZeroInteractions(mockJdsDao, mockVistaPatientContextService, mockAuditService);
        verify(mockSyncService).isNotLoadedAndNotLoading("12345");
        verifyZeroInteractions(mockSyncService);
    }

    @Test
    public void testChangeCurrentPatientPid() throws Exception {
        PatientDemographics mockPatient = createMockPatient();
        when(mockVistaPatientContextService.fetchVistaPatientContextInfo(MOCK_PID, true)).thenReturn(new VistaPatientContextInfo(mockPatient, patientDemographicsAdditional, new PatientChecks()));
        when(mockJdsDao.save(mockPatient)).thenReturn(mockPatient);
        when(mockSyncService.isNotLoadedAndNotLoading(MOCK_PID)).thenReturn(true);
        when(mockUserContext.isLoggedIn()).thenReturn(true);

        ptContext.setCurrentPatientPid(MOCK_PID);
        assertThat(ptContext.getCurrentPatientPid(), is(MOCK_PID));

        reset(mockVistaPatientContextService, mockJdsDao, mockSyncService, mockAuditService);

        final String MOCK_PID2 = PidUtils.getPid(MOCK_VISTA_ID, "4321");
        mockPatient = createMockPatient();
        mockPatient.setData("pid", MOCK_PID2);
        when(mockVistaPatientContextService.fetchVistaPatientContextInfo(MOCK_PID2, true)).thenReturn(new VistaPatientContextInfo(mockPatient, patientDemographicsAdditional, new PatientChecks()));
        when(mockJdsDao.save(mockPatient)).thenReturn(mockPatient);
        when(mockSyncService.isNotLoadedAndNotLoading(MOCK_PID2)).thenReturn(true);

        ptContext.setCurrentPatientPid(MOCK_PID2);
        assertThat(ptContext.getCurrentPatientPid(), is(MOCK_PID2));

        // TODO: verify a crapton of stuff
//        verify()
    }

    private PatientDemographics createMockPatient() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", MOCK_PID);
        return pt;
    }

    @Test
    public void testSetCurrentPatientToNull() throws Exception {
        // set up an existing context
        PatientDemographics mockPt = createMockPatient();
        ptContext.setCurrentPatient(mockPt);

        // set patient to null
        ptContext.setCurrentPatient(null);
        assertThat(ptContext.getCurrentPatientPid(), is(nullValue()));
        assertThat(ptContext.getCurrentPatient(), is(nullValue()));
    }

}
