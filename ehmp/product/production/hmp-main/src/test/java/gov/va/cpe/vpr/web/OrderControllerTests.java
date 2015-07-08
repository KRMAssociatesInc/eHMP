package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.order.Orderable;
import gov.va.cpe.order.Route;
import gov.va.cpe.order.Schedule;
import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.ORDERING_CONTROLLER_RPC_URI;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class OrderControllerTests {

    private OrderController controller;
    private MockHttpServletRequest mockRequest;
    private IGenericPOMObjectDAO mockGenericDao;
    private RpcOperations mockRpcTemplate;
    private PatientContext mockPatientContext;
    private UserContext mockUserContext;
    private HmpUserDetails mockUser;
    private ISyncService mockSyncService;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockGenericDao = mock(IGenericPOMObjectDAO.class);
        mockRpcTemplate = mock(RpcOperations.class);
        mockPatientContext = mock(PatientContext.class);
        mockUserContext = mock(UserContext.class);
        mockSyncService = mock(ISyncService.class);

        controller = new OrderController();
        controller.setGenDao(mockGenericDao);
        controller.setRpcTemplate(mockRpcTemplate);
        controller.setPatientContext(mockPatientContext);
        controller.setUserContext(mockUserContext);
        controller.setSyncService(mockSyncService);

        mockUser = mock(HmpUserDetails.class);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
    }

    @Test
    public void testTypes() throws Exception {
        ModelAndView mav = controller.orderTypes(mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Map<String, Object>> jsonC = (JsonCCollection<Map<String, Object>>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat((String) jsonC.getItems().get(0).get("typeName"), is("Inpatient Meds"));
        assertThat((String) jsonC.getItems().get(1).get("typeName"), is("Outpatient Meds"));
        assertThat((String) jsonC.getItems().get(2).get("typeName"), is("Non-VA Meds"));

        verifyZeroInteractions(mockGenericDao);
    }

    @Test
    public void testOrderablesForType() throws Exception {
        Orderable orderable1 = new Orderable(Collections.<String, Object>singletonMap("uid", "foo"));
        PageRequest pageRequest = new PageRequest(0, 3);
        Page<Orderable> orderables = new PageImpl(Arrays.asList(orderable1), pageRequest, 9);
        when(mockGenericDao.findAllByIndexAndRange(Orderable.class, "orderable-types", "Inpatient Meds>\"foo\"*", pageRequest)).thenReturn(orderables);

        ModelAndView mav = controller.orderablesForType("Inpatient Meds", "foo", new PageRequest(0, 3), mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Orderable> jsonC = (JsonCCollection<Orderable>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonC.getCurrentItemCount(), is(1));
        assertThat(jsonC.getItemsPerPage(), is(3));
        assertThat(jsonC.getTotalItems(), is(9));

        verify(mockGenericDao).findAllByIndexAndRange(Orderable.class, "orderable-types", "Inpatient Meds>\"foo\"*", pageRequest);
    }

    @Test
    public void testRoutes() throws Exception {
        Route route1 = new Route(Collections.<String, Object>singletonMap("uid", "foo"));
        Route route2 = new Route(Collections.<String, Object>singletonMap("uid", "bar"));
        List<Route> mockRoutes = Arrays.asList(route1, route2);
        when(mockGenericDao.findAll(Route.class, new Sort("name"))).thenReturn(mockRoutes);

        ModelAndView mav = controller.getRoutes(mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Route> jsonC = (JsonCCollection<Route>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonC.getCurrentItemCount(), is(mockRoutes.size()));
        assertThat(jsonC.getItems(), hasItems(route1, route2));

        verify(mockGenericDao).findAll(Route.class, new Sort("name"));
    }

    @Test
    public void testSchedules() throws Exception {
        Schedule schedule1 = new Schedule(Collections.<String, Object>singletonMap("uid", "foo"));
        Schedule schedule2 = new Schedule(Collections.<String, Object>singletonMap("uid", "bar"));
        List<Schedule> mockSchedules = Arrays.asList(schedule1, schedule2);
        when(mockGenericDao.findAll(Schedule.class, new Sort("name"))).thenReturn(mockSchedules);

        ModelAndView mav = controller.getSchedules(mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<Schedule> jsonC = (JsonCCollection<Schedule>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonC.getCurrentItemCount(), is(mockSchedules.size()));
        assertThat(jsonC.getItems(), hasItems(schedule1, schedule2));

        verify(mockGenericDao).findAll(Schedule.class, new Sort("name"));
    }

    @Test
    public void testSave() throws Exception {
        mockRequest.addParameter("type", "Inpatient Meds");
        mockRequest.addParameter("foo", "bar");
        mockRequest.addParameter("baz", "spaz");

        when(mockUser.getVistaId()).thenReturn(MockVistaDataChunks.VISTA_ID);
        when(mockUser.getDUZ()).thenReturn("123456");

        PatientDemographics pt = MockPatientUtils.create();
        when(mockPatientContext.getCurrentPatient()).thenReturn(pt);
        when(mockPatientContext.getCurrentPatientPid()).thenReturn(pt.getPid());

        JsonNode mockJson = POMUtils.parseJSONtoNode("{\"success\":true}");
        when(mockRpcTemplate.executeForJson(eq(ORDERING_CONTROLLER_RPC_URI), anyMap())).thenReturn(mockJson);

        ModelAndView mav = controller.save("Inpatient Meds", mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        ArgumentCaptor<Map> rpcArg = ArgumentCaptor.forClass(Map.class);
        verify(mockRpcTemplate).executeForJson(eq(ORDERING_CONTROLLER_RPC_URI), rpcArg.capture());
        assertThat((String) rpcArg.getValue().get("command"), is("saveOrder"));
        assertThat((String) rpcArg.getValue().get("location"), is("240"));
        assertThat((String) rpcArg.getValue().get("provider"), is("123456"));
        assertThat((String) rpcArg.getValue().get("patient"), is(MockVistaDataChunks.DFN));
        assertThat((String) rpcArg.getValue().get("orderString"), is("foo;bar baz;spaz"));
        assertThat((String) rpcArg.getValue().get("type"), is("Inpatient Meds"));
    }
}
