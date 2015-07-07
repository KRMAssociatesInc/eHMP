package gov.va.cpe.vpr.web;

import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.hmp.audit.IUserAuditService;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCError;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

import static gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME;
import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class SyncControllerTest {

    private SyncController controller;
    private IPatientDAO mockPatientDao;
    private IPatientSelectDAO mockPatientSelectDao;
    private PatientContext mockPatientContext;
    private IUserAuditService mockUserAuditService;
    private IVistaAccountDao vistaAccountDaoMock;

    @Before
    public void setUp() throws Exception {
        mockPatientDao = mock(IPatientDAO.class);
        mockPatientSelectDao = mock(IPatientSelectDAO.class);
        mockPatientContext = mock(PatientContext.class);
        mockUserAuditService = mock(IUserAuditService.class);
        vistaAccountDaoMock = mock(IVistaAccountDao.class);
        
        List<String> vistaIds = new ArrayList<String>();
        vistaIds.add("9E7A");
        vistaIds.add("C877");
        when(vistaAccountDaoMock.findAllVistaIds()).thenReturn(vistaIds);

        controller = new SyncController();
        controller.setPatientDao(mockPatientDao);
        controller.setPatientSelectDao(mockPatientSelectDao);
        controller.setPatientContext(mockPatientContext);
        controller.setUserAuditService(mockUserAuditService);
        controller.setVistaAccountDao(vistaAccountDaoMock);
    }

    @Test
    public void testIsSelectedPatientToReload_LocalId() throws Exception {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "2");

        when(mockPatientDao.findByLocalId("545", "8")).thenReturn(pt);
        Assert.assertTrue(controller.isSelectedPatientToReload("2", "8", "545", null));
        Assert.assertFalse(controller.isSelectedPatientToReload("3", "", "", ""));
    }

    @Test
    public void testIsSelectedPatientToReload_Icn() throws Exception {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "1001");

        when(mockPatientDao.findByPid("1001")).thenReturn(pt);
        Assert.assertTrue(controller.isSelectedPatientToReload("1001", null, null, "1001"));
        Assert.assertFalse(controller.isSelectedPatientToReload("3", null, null, "1001"));
    }

    @Test
    public void testClearAllPatient() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.getSession().setAttribute("pid", "3");
        ISyncService syncServiceMock = mock(ISyncService.class);
        controller.setSyncService(syncServiceMock);

        ModelAndView mv = controller.clearAllPatient(mockRequest);
        Assert.assertEquals(DEFAULT_VIEW_NAME, mv.getViewName());
        Assert.assertNull(mockRequest.getSession().getAttribute("pid"));

        verify(syncServiceMock, Mockito.times(1)).sendClearAllPatientsMsg();
        verify(mockUserAuditService).audit(eq("clear"), anyString());
    }

    @Test
    public void testClearPatientByLocalPatientId() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.getSession().setAttribute("pid", "33");

        ISyncService syncServiceMock = mock(ISyncService.class);
        UserContext userContextMock = mock(UserContext.class);
        HmpUserDetails userDetails = mock(HmpUserDetails.class);

        controller.setSyncService(syncServiceMock);
        controller.setUserContext(userContextMock);

        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "3");
        when(userContextMock.getCurrentUser()).thenReturn(userDetails);
        when(userDetails.getVistaId()).thenReturn("545");

        when(mockPatientDao.findByLocalId("545", "8")).thenReturn(pt);

        ModelAndView mv = controller.clearPatient("", "", "8", mockRequest);

        Assert.assertEquals(DEFAULT_VIEW_NAME, mv.getViewName());
        Assert.assertEquals("33", mockRequest.getSession().getAttribute("pid"));

        verify(syncServiceMock, Mockito.times(1)).sendClearPatientMsg(pt);
}

    @Test
    public void testClearPatientByIcn() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        when(mockPatientContext.getCurrentPatientPid()).thenReturn("9E7A;3");

        ISyncService syncServiceMock = mock(ISyncService.class);
        controller.setSyncService(syncServiceMock);
        
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "9E7A;3");
        when(mockPatientDao.findByIcn("1001")).thenReturn(pt);

        ModelAndView mv = controller.clearPatient("1001", "", "", mockRequest);

        Assert.assertEquals(DEFAULT_VIEW_NAME, mv.getViewName());
        verify(syncServiceMock, Mockito.times(1)).sendClearPatientMsg(pt);
        verify(mockPatientContext).setCurrentPatient(null);
    }

    @Test
    public void testClearPatientByPid() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        when(mockPatientContext.getCurrentPatientPid()).thenReturn("3");

        ISyncService syncServiceMock = mock(ISyncService.class);
        controller.setSyncService(syncServiceMock);

        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "3");
        when(mockPatientDao.findByPid("3")).thenReturn(pt);

        ModelAndView mv = controller.clearPatient("", "3", "", mockRequest);

        Assert.assertEquals(DEFAULT_VIEW_NAME, mv.getViewName());
        verify(syncServiceMock, Mockito.times(1)).sendClearPatientMsg(pt);
        verify(mockPatientContext).setCurrentPatient(null);
    }

    @Test
    public void loadByIcn() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();

        ISyncService syncServiceMock = mock(ISyncService.class);
        UserContext userContextMock = mock(UserContext.class);
        HmpUserDetails userDetails = mock(HmpUserDetails.class);

        controller.setSyncService(syncServiceMock);
        controller.setUserContext(userContextMock);

        PatientSelect pt = new PatientSelect();
        pt.setData("pid", "3");
        pt.setData("uid", "urn:va:patient:C877:3:3");
        when(userContextMock.getCurrentUser()).thenReturn(userDetails);
        when(userDetails.getVistaId()).thenReturn("C877");
        when(mockPatientSelectDao.findOneByIcn("1001")).thenReturn(pt);

        ModelAndView mav = controller.load("1001", null, "none", null, mockRequest);

        Assert.assertEquals(DEFAULT_VIEW_NAME, mav.getViewName());
        verify(syncServiceMock, Mockito.times(1)).subscribePatient("C877", "3");
    }

    
    @Test
    public void loadWithPriority() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();

        ISyncService syncServiceMock = mock(ISyncService.class);
        UserContext userContextMock = mock(UserContext.class);
        HmpUserDetails userDetails = mock(HmpUserDetails.class);

        controller.setSyncService(syncServiceMock);
        controller.setUserContext(userContextMock);

        PatientSelect pt = new PatientSelect();
        pt.setData("pid", "3");
        pt.setData("uid", "urn:va:patient:C877:3:3");
        when(userContextMock.getCurrentUser()).thenReturn(userDetails);
        when(userDetails.getVistaId()).thenReturn("C877");
        when(mockPatientSelectDao.findOneByIcn("1001")).thenReturn(pt);

        List<String> testPrioritySitesList = new ArrayList<String>();
        testPrioritySitesList.add("9E7A");
        
        ModelAndView mav = controller.load("1001", null, "userSelect", testPrioritySitesList, mockRequest);

        Assert.assertEquals(DEFAULT_VIEW_NAME, mav.getViewName());
        verify(syncServiceMock, Mockito.times(1)).subscribePatient("userSelect", testPrioritySitesList,"3");
    }

    @Test
    public void loadByUnknownIcn() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();

        ISyncService syncServiceMock = mock(ISyncService.class);
        UserContext userContextMock = mock(UserContext.class);
        HmpUserDetails userDetails = mock(HmpUserDetails.class);

        controller.setSyncService(syncServiceMock);
        controller.setUserContext(userContextMock);

        when(userContextMock.getCurrentUser()).thenReturn(userDetails);
        when(userDetails.getVistaId()).thenReturn("545");
        when(mockPatientSelectDao.findOneByIcn("1001")).thenReturn(null);

        ModelAndView mav = controller.load("1001", null, "none", null, mockRequest);

        Assert.assertEquals(DEFAULT_VIEW_NAME, mav.getViewName());
        Assert.assertTrue(mav.getModel().containsKey(ModelAndViewFactory.DEFAULT_MODEL_KEY));
        assertThat(((JsonCError) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY)).getSuccess(), is(false));
    }
}
