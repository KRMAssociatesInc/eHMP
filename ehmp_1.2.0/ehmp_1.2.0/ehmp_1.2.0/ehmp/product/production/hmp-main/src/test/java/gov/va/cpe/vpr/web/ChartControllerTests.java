package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import gov.va.hmp.web.servlet.view.StringView;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class ChartControllerTests {

    public static final String MOCK_PID = "10104";
    public static final String MOCK_DIVISION = "500";
    public static final String MOCK_DIVISION_NAME = "CAMP MASTER";
    public static final String MOCK_USER_UID = UidUtils.getUserUid(MockVistaDataChunks.VISTA_ID, "34");
    public static final String MOCK_USER_NAME = "Monkey Fitzpatrick";


    private ChartController controller;
    private MockHttpServletRequest mockRequest;
    private RpcOperations mockRpcTemplate;
    private IPatientDAO mockPatientDao;
    private UserContext mockUserContext;
    private IGenericPatientObjectDAO mockGenericDao;
    private IVistaVprPatientObjectDao mockVprPatientObjectDao;

    @Before
    public void setUp() throws Exception {
        mockRpcTemplate = mock(RpcOperations.class);
        mockPatientDao = mock(IPatientDAO.class);
        mockUserContext = mock(UserContext.class);
        mockGenericDao = mock(IGenericPatientObjectDAO.class);
        mockVprPatientObjectDao = mock(IVistaVprPatientObjectDao.class);

        controller = new ChartController();
        controller.setRpcTemplate(mockRpcTemplate);
        controller.setPatientDao(mockPatientDao);
        controller.setUserContext(mockUserContext);
        controller.setGenericJdsDAO(mockGenericDao);
        controller.setVprPatientObjectDao(mockVprPatientObjectDao);

        mockRequest = new MockHttpServletRequest();
        mockRequest.addHeader("X-Requested-With", "XMLHttpRequest");
        
        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUser.getUid()).thenReturn(MOCK_USER_UID);
        when(mockUser.getVistaId()).thenReturn(MockVistaDataChunks.VISTA_ID);
        when(mockUser.getDivision()).thenReturn(MOCK_DIVISION);
        when(mockUser.getDivisionName()).thenReturn(MOCK_DIVISION_NAME);
        when(mockUser.getDisplayName()).thenReturn(MOCK_USER_NAME);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
    }

    @Test
    public void testOrderingControl() throws Exception {
        String mockRpcResponse = "{\"message\":\"mock RPC response\"}";
        when(mockRpcTemplate.executeForString(eq(ORDERING_CONTROLLER_RPC_URI), anyMap())).thenReturn(mockRpcResponse);

        ModelAndView mav = controller.orderingControl(
                "mockCommand",
                "mockUid",
                "mockPatient",
                "mockSnippet",
                "mockName",
                "mockOrderAction",
                "mockAction",
                "mockOrderChecksOnly",
                mockRequest);

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForString(eq(ORDERING_CONTROLLER_RPC_URI), rpcArg.capture());

        assertThat((String) rpcArg.getValue().get("command"), is("mockCommand"));
        assertThat((String) rpcArg.getValue().get("uid"), is("mockUid"));
        assertThat((String) rpcArg.getValue().get("patient"), is("mockPatient"));
        assertThat((String) rpcArg.getValue().get("snippet"), is("mockSnippet"));
        assertThat((String) rpcArg.getValue().get("name"), is("mockName"));
        assertThat((String) rpcArg.getValue().get("orderAction"), is("mockOrderAction"));
        assertThat((String) rpcArg.getValue().get("action"), is("mockAction"));
        assertThat((String) rpcArg.getValue().get("orderChecksOnly"), is("mockOrderChecksOnly"));
        assertThat((String) rpcArg.getValue().get("location"), is("240"));
        assertThat((String) rpcArg.getValue().get("user"), is("1089"));
        assertThat((String) rpcArg.getValue().get("panelNumber"), is("1"));
    }

    @Test
    public void testPostOrderingControl() throws Exception {
        String mockRpcResponse = "{\"message\":\"mock RPC response\"}";
        when(mockRpcTemplate.executeForString(eq(ORDERING_CONTROLLER_RPC_URI), anyMap())).thenReturn(mockRpcResponse);

        ModelAndView mav = controller.postOrderingControl(
                "mockCommand",
                "mockUid",
                "mockPatient",
                "mockSnippet",
                "mockName",
                "mockQoIen",
                "mockOrderAction",
                "mockAction",
                mockRequest);

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForString(eq(ORDERING_CONTROLLER_RPC_URI), rpcArg.capture());

        assertThat((String) rpcArg.getValue().get("command"), is("mockCommand"));
        assertThat((String) rpcArg.getValue().get("uid"), is("mockUid"));
        assertThat((String) rpcArg.getValue().get("patient"), is("mockPatient"));
        assertThat((String) rpcArg.getValue().get("snippet"), is("mockSnippet"));
        assertThat((String) rpcArg.getValue().get("name"), is("mockName"));
        assertThat((String) rpcArg.getValue().get("qoIen"), is("mockQoIen"));
        assertThat((String) rpcArg.getValue().get("orderAction"), is("mockOrderAction"));
        assertThat((String) rpcArg.getValue().get("action"), is("mockAction"));
        assertThat((String) rpcArg.getValue().get("location"), is("240"));
        assertThat((String) rpcArg.getValue().get("provider"), is("1089"));
        assertThat((String) rpcArg.getValue().get("panelNumber"), is("1"));
    }

    @Test
    public void testGetReminderList() throws Exception {
        String mockRpcResponse = "{\"message\":\"mock RPC response\"}";
        when(mockRpcTemplate.executeForString(eq(CONTROLLER_RPC_URI), anyMap())).thenReturn(mockRpcResponse);

        ModelAndView mav = controller.getReminderList(mockRequest);

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForString(eq(CONTROLLER_RPC_URI), rpcArg.capture());

        assertThat((String) rpcArg.getValue().get("command"), is("getReminderList"));
        assertThat((String) rpcArg.getValue().get("location"), is(""));
    }

    @Test
    public void testEvaluateReminderWithPidAndDfn() throws Exception {
        String mockRpcResponse = "{\"message\":\"mock RPC response\"}";
        when(mockRpcTemplate.executeForString(eq(CONTROLLER_RPC_URI), anyMap())).thenReturn(mockRpcResponse);

        ModelAndView mav = controller.evaluateReminder(
                "mockUid",
                "mockPid",
                "mockDfn",
                mockRequest);

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForString(eq(CONTROLLER_RPC_URI), rpcArg.capture());

        assertThat((String) rpcArg.getValue().get("command"), is("evaluateReminder"));
        assertThat((String) rpcArg.getValue().get("patientId"), is("mockDfn"));
        assertThat((String) rpcArg.getValue().get("uid"), is("mockUid"));
    }

    @Test
    public void testEvaluateReminderWithPidAndNoDfn() throws Exception {
        String mockRpcResponse = "{\"message\":\"mock RPC response\"}";
        when(mockRpcTemplate.executeForString(eq(CONTROLLER_RPC_URI), anyMap())).thenReturn(mockRpcResponse);

        PatientDemographics mockPatient = MockPatientUtils.create(MOCK_PID);
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(mockPatient);

        ModelAndView mav = controller.evaluateReminder(
                "mockUid",
                MOCK_PID,
                null,
                mockRequest);

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForString(eq(CONTROLLER_RPC_URI), rpcArg.capture());

        assertThat((String) rpcArg.getValue().get("command"), is("evaluateReminder"));
        assertThat((String) rpcArg.getValue().get("patientId"), is(MockVistaDataChunks.DFN));
        assertThat((String) rpcArg.getValue().get("uid"), is("mockUid"));
    }

    @Test
    public void testPostAddTreatment() throws Exception {
        PatientDemographics mockPatient = MockPatientUtils.create(MOCK_PID);
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(mockPatient);

        JsonNode mockRpcResponse = POMUtils.parseJSONtoNode("{\"success\":true,\"data\":{\"uid\":\"urn:va:foo:ABCD:12345\"}}");
        when(mockRpcTemplate.executeForJson(eq(VPR_PUT_PATIENT_DATA_URI), eq(MockVistaDataChunks.DFN), eq("treatment"), anyObject())).thenReturn(mockRpcResponse);

        ModelAndView mav = controller.postAddTreatment(MOCK_PID, "schnobb", "06/11/2013", null, mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((JsonNode) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Treatment> treatmentArg = ArgumentCaptor.forClass(Treatment.class);
        verify(mockGenericDao).save(treatmentArg.capture());
        assertThat(treatmentArg.getValue().getUid(), is("urn:va:foo:ABCD:12345"));
        assertThat(treatmentArg.getValue().getPid(), is(MOCK_PID));
        assertThat(treatmentArg.getValue().getDescription(), is("schnobb"));
        assertThat(treatmentArg.getValue().getDueDate(), is(new PointInTime(2013, 6, 11)));
        assertThat(treatmentArg.getValue().getFacilityCode(), is(MOCK_DIVISION));
        assertThat(treatmentArg.getValue().getFacilityName(), is(MOCK_DIVISION_NAME));
    }

    @Test(expected = PatientNotFoundException.class)
    public void testPostAddTreatmentPatientNotFound() throws Exception {
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(null);
        controller.postAddTreatment(MOCK_PID, "schnobb", "06/11/2013", null, mockRequest);
    }

    @Test
    public void testPostAddTask() throws Exception {
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(MockPatientUtils.create(MOCK_PID));
        when(mockVprPatientObjectDao.save(eq(Task.class), anyMap())).then(new Answer<Task>() {
            @Override
            public Task answer(InvocationOnMock invocation) throws Throwable {
                Task task = new Task((Map) invocation.getArguments()[1]);
                task.setData("uid", "urn:va:foo:ABCD:1234");
                return task;
            }
        });

        ModelAndView mav = controller.postAddTask(
                MOCK_PID,
                "schnobb",
                "mockType",
                "wobb",
                new PointInTime(2013, 6, 11, 19, 34, 12),
                true,
                "mockLinkUid",
                "true",
                "",
                mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCResponse<Task> jsonc = (JsonCResponse<Task>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc, notNullValue());
        Task task = jsonc.data;
        assertThat(task.getPid(), is(MOCK_PID));
        assertThat(task.getUid(), is("urn:va:foo:ABCD:1234"));
        assertThat(task.getTaskName(), is("schnobb"));
        assertThat(task.getType(), is("mockType"));
        assertThat(task.getDueDate(), is(new PointInTime(2013, 6, 11, 19, 34, 12)));
        assertThat(task.getCompleted(), is(true));
        assertThat(task.getCreatedByCode(), is(MOCK_USER_UID));
        assertThat(task.getCreatedByName(), is(MOCK_USER_NAME));
        assertThat(task.getFacilityCode(), is(MOCK_DIVISION));
        assertThat(task.getFacilityName(), is(MOCK_DIVISION_NAME));
        assertThat(task.getLinkUid(), is("mockLinkUid"));

        verify(mockVprPatientObjectDao).save(eq(Task.class), anyMap());
    }

    @Test
    public void testPatientSecurityLog() throws Exception {
        String mockRpcResponse = "{\"message\":\"mock RPC response\"}";
        when(mockRpcTemplate.executeForString(eq(CONTROLLER_RPC_URI), anyMap())).thenReturn(mockRpcResponse);

        PatientDemographics mockPatient = MockPatientUtils.create(MOCK_PID);
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(mockPatient);

        ModelAndView mav = controller.patientSecurityLog(MOCK_PID);

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is(mockRpcResponse));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForString(eq(CONTROLLER_RPC_URI), rpcArg.capture());

        assertThat((String) rpcArg.getValue().get("command"), is("logPatientAccess"));
        assertThat((String) rpcArg.getValue().get("patientId"), is(MockVistaDataChunks.DFN));
    }

    @Test(expected = PatientNotFoundException.class)
    public void testPatientSecurityLogPatientNotFound() throws Exception {
        when(mockPatientDao.findByPid(MOCK_PID)).thenReturn(null);
        controller.patientSecurityLog(MOCK_PID);
    }
}
