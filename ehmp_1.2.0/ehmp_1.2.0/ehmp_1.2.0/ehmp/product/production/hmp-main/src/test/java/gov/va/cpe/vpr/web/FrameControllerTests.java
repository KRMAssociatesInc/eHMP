package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.PatientAlert;
import gov.va.cpe.vpr.frameeng.*;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.termeng.ITermDataSource;
import gov.va.cpe.vpr.termeng.ITermEng;
import gov.va.hmp.healthtime.NowStrategy;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.web.servlet.mvc.ParameterMap;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Matchers;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import java.nio.charset.Charset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.util.Collections.singletonList;
import static java.util.Collections.singletonMap;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class FrameControllerTests {

    public static final String MOCK_PID = "10104";
    public static final String MOCK_ALLERGY_UID = "urn:va:allergy:ABCD:229:23";
    private FrameController controller;
    private MockHttpServletRequest mockRequest;
    private RpcOperations mockRpcTemplate;
    private JdsOperations mockJdsTemplate;
    private IGenericPatientObjectDAO mockGenericDao;
    private IPatientDAO mockPatientDao;
    private IFrameRunner mockFrameRunner;
    private IFrameRegistry mockFrameRegistry;
    private ITermEng mockTermEng;
    private static PointInTime MOCK_NOW;
    private Allergy mockAllergy;
    private FrameJob mockFrameJob;

    @BeforeClass
    public static void beforeAll() {
        MOCK_NOW = new PointInTime(2013, 11, 6, 6, 30, 23);
        PointInTime.setNowStrategy(new NowStrategy() {
            @Override
            public PointInTime now() {
                return MOCK_NOW;
            }
        });
    }

    @AfterClass
    public static void afterAll() throws Exception {
        PointInTime.setNowStrategy(null); // clears custom now strategy, returns it to default
    }

    @Before
    public void setUp() throws Exception {
        mockAllergy = new Allergy();
        mockFrameJob = new FrameJob();
        mockRequest = new MockHttpServletRequest();
        mockRpcTemplate = mock(RpcOperations.class);
        mockJdsTemplate = mock(JdsOperations.class);
        mockGenericDao = mock(IGenericPatientObjectDAO.class);
        mockPatientDao = mock(IPatientDAO.class);
        mockFrameRunner = mock(IFrameRunner.class);
        mockFrameRegistry = mock(IFrameRegistry.class);
        mockTermEng = mock(ITermEng.class);

        controller = new FrameController();
        controller.setRpcTemplate(mockRpcTemplate);
        controller.setTpl(mockJdsTemplate);
        controller.setDao(mockGenericDao);
        controller.setPatdao(mockPatientDao);
        controller.setRunner(mockFrameRunner);
        controller.setRegistry(mockFrameRegistry);
        controller.setEng(mockTermEng);
    }

    @Test
    public void testInvoke() throws Exception {
        setUpForExec();

        ModelAndView mav = controller.invoke("mockEntryPoint", mockRequest, MOCK_ALLERGY_UID);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        List<FrameAction> actions = (List<FrameAction>) mav.getModel().get("actions");
        assertThat(actions, notNullValue());
        Map<String,String> frames = (Map<String,String>) mav.getModel().get("frames");
        assertThat(frames, notNullValue());

        assertExecEntryPoint();
    }

    @Test
    public void testCall() throws Exception {
        setUpForExec();

        ModelAndView mav = controller.call("mockFrameId", mockRequest, MOCK_ALLERGY_UID);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        List<FrameAction> actions = (List<FrameAction>) mav.getModel().get("actions");
        assertThat(actions, notNullValue());
        Map<String,String> frames = (Map<String,String>) mav.getModel().get("frames");
        assertThat(frames, notNullValue());

        assertExecFrame();
    }

    @Test
    public void testExecEntryPoint() throws Exception {
        setUpForExec();

        ModelAndView mav = controller.exec(MOCK_ALLERGY_UID, null, "mockEntryPoint", "mockMode", mockRequest);

        assertThat(mav.getViewName(), is("mockMode"));
        assertThat((IGenericPatientObjectDAO) mav.getModel().get("dao"), sameInstance(mockGenericDao));
        assertThat((IPatientDAO) mav.getModel().get("patdao"), sameInstance(mockPatientDao));
        assertThat((FrameJob) mav.getModel().get("job"), sameInstance(mockFrameJob));

        assertExecEntryPoint();
    }

    private void assertExecEntryPoint() throws Frame.FrameInitException, Frame.FrameExecException {
        ArgumentCaptor<IFrameEvent.InvokeEvent> frameEventArg = ArgumentCaptor.forClass(IFrameEvent.InvokeEvent.class);
        verify(mockFrameRunner).exec(frameEventArg.capture());
        assertThat(frameEventArg.getValue().getEntryPoint(), is("mockEntryPoint"));
        assertThat((Allergy) frameEventArg.getValue().getSource(), sameInstance(mockAllergy));
        assertThat((String) frameEventArg.getValue().getParams().get("pid"), is(MOCK_PID));
        assertThat((String) frameEventArg.getValue().getParams().get("sort.col"), is("foo"));
        assertThat((String) frameEventArg.getValue().getParams().get("sort.dir"), is("asc"));
    }

    private void setUpForExec() throws Frame.FrameInitException, Frame.FrameExecException {
        mockRequest.addParameter("sort", "[{\"property\":\"foo\",\"direction\":\"asc\"}]");

        mockAllergy.setData("uid", MOCK_ALLERGY_UID);
        mockAllergy.setData("pid", MOCK_PID);
        when(mockGenericDao.findByUID(Allergy.class, MOCK_ALLERGY_UID)).thenReturn(mockAllergy);
        when(mockFrameRunner.exec(Matchers.<IFrameEvent[]>any())).thenReturn(mockFrameJob);
    }

    @Test
    public void testExecFrame() throws Exception {
        setUpForExec();

        ModelAndView mav = controller.exec(MOCK_ALLERGY_UID, "mockFrameId", null, "mockMode", mockRequest);

        assertThat(mav.getViewName(), is("mockMode"));
        assertThat((IGenericPatientObjectDAO) mav.getModel().get("dao"), sameInstance(mockGenericDao));
        assertThat((IPatientDAO) mav.getModel().get("patdao"), sameInstance(mockPatientDao));
        assertThat((FrameJob) mav.getModel().get("job"), sameInstance(mockFrameJob));

        assertExecFrame();
    }

    private void assertExecFrame() throws Frame.FrameInitException, Frame.FrameExecException {
        ArgumentCaptor<CallEvent> frameEventArg = ArgumentCaptor.forClass(CallEvent.class);
        verify(mockFrameRunner).exec(frameEventArg.capture());
        assertThat(frameEventArg.getValue().getFrameID(), is("mockFrameId"));
        assertThat((Allergy) frameEventArg.getValue().getSource(), sameInstance(mockAllergy));
        assertThat((String) frameEventArg.getValue().getParams().get("pid"), is(MOCK_PID));
        assertThat((String) frameEventArg.getValue().getParams().get("sort.col"), is("foo"));
        assertThat((String) frameEventArg.getValue().getParams().get("sort.dir"), is("asc"));
    }

    @Test(expected = BadRequestException.class)
    public void testExecMissingArgs() throws Exception {
        controller.exec("foo", null, null, "mockMode", mockRequest);
    }

    @Test
    public void testRenderAlertWithUid() throws Exception {
        mockRequest.addParameter("uid", "foo");

        PatientAlert mockPatientAlert = new PatientAlert();
        when(mockGenericDao.findByUID("foo")).thenReturn(mockPatientAlert);

        ModelAndView mav = controller.renderAlert(mockRequest, null);

        assertThat(mav.getViewName(), is("/frame/alert"));

        verify(mockGenericDao).findByUID(PatientAlert.class, "foo");
    }

    @Test
    public void testRenderAlertWithJson() throws Exception {
        mockRequest.addParameter("frameID", "fooFrameId");

        IFrame mockFrame = mock(IFrame.class);
        when(mockFrameRegistry.findByID("fooFrameId")).thenReturn(mockFrame);

        ModelAndView mav = controller.renderAlert(mockRequest, "{\"uid\":\"alertUid\",\"links\":[{\"uid\":\"linkUid1\"},{\"uid\":\"linkUid2\"}]}");

        assertThat(mav.getViewName(), is("/frame/alert"));
        ParameterMap params = (ParameterMap) mav.getModel().get("params");
        assertThat(params, notNullValue());
        assertThat(params, equalTo(new ParameterMap(mockRequest)));
        PatientAlert alert = (PatientAlert) mav.getModel().get("alert");
        assertThat(alert, notNullValue());
        assertThat(alert.getUid(), is("alertUid"));
        assertThat((IFrame) mav.getModel().get("frame"), sameInstance(mockFrame));
        List<Map<String, Object>> links = (List<Map<String, Object>>) mav.getModel().get("links");
        assertThat(links, notNullValue());

        verify(mockGenericDao).findByUID("linkUid1");
        verify(mockGenericDao).findByUID("linkUid2");
    }

    @Test
    public void testRenderInfo() throws Exception {
        IFrame mockFrame = mock(IFrame.class);
        when(mockFrameRegistry.findByID("foo")).thenReturn(mockFrame);

        ModelAndView mav = controller.renderInfo("foo");
        assertThat(mav.getViewName(), is("/frame/info"));
        assertThat((IFrame) mav.getModel().get("frame"), sameInstance(mockFrame));

        mav = controller.renderInfo2("foo");
        assertThat(mav.getViewName(), is("/frame/info"));
        assertThat((IFrame) mav.getModel().get("frame"), sameInstance(mockFrame));
    }

    @Test(expected = BadRequestException.class)
    public void testRenderInfoUnknownFrame() throws Exception {
        when(mockFrameRegistry.findByID("foo")).thenReturn(null);
        controller.renderInfo("foo");
    }

    @Test(expected = BadRequestException.class)
    public void testRenderInfo2UnknownFrame() throws Exception {
        when(mockFrameRegistry.findByID("foo")).thenReturn(null);
        controller.renderInfo2("foo");
    }

    @Test
    public void testRenderGoal() throws Exception {
        ModelAndView mav = controller.renderGoal("foo", MOCK_PID);

        assertThat(mav.getViewName(), is("/frame/foo"));
        assertThat((String) mav.getModel().get("pid"), is(MOCK_PID));
        assertThat((IGenericPatientObjectDAO) mav.getModel().get("dao"), sameInstance(mockGenericDao));
        assertThat((IPatientDAO) mav.getModel().get("patdao"), sameInstance(mockPatientDao));
        assertThat((RpcOperations) mav.getModel().get("rpc"), sameInstance(mockRpcTemplate));
    }

    @Test
    public void testDeleteParam() throws Exception {
        String responseBody = controller.delParam("foo", MOCK_PID);
        assertThat(responseBody, is("Deleted"));
        verify(mockJdsTemplate).delete("/vpr/" + MOCK_PID + "/urn:va:::frame:foo");
    }

    @Test
    public void testSetParam() throws Exception {
        Map frameParams = new LinkedHashMap();
        frameParams.put("fred", "barney");
        String responseBody = controller.setParam("foo", MOCK_PID, frameParams);
        assertThat(responseBody, is("Saved"));

        ArgumentCaptor<Map> dataArg = ArgumentCaptor.forClass(Map.class);
        verify(mockJdsTemplate).postForLocation(eq("/vpr/" + MOCK_PID), dataArg.capture());
        assertThat((String) dataArg.getValue().get("uid"), is("urn:va:::frame:foo"));
        assertThat((String) dataArg.getValue().get("pid"), is(MOCK_PID));
        assertThat((String) dataArg.getValue().get("fred"), is("barney"));
    }

    @Test
    public void testGetParamWithKey() throws Exception {
        Map mockData = new LinkedHashMap();
        mockData.put("fred", "barney");
        when(mockJdsTemplate.getForMap("/vpr/" + MOCK_PID + "/urn:va:::frame:foo")).thenReturn(singletonMap("data", singletonMap("items", singletonList(mockData))));
        String responseBody = controller.getParam("foo", MOCK_PID, "fred");
        assertThat(responseBody, is("barney"));
        verify(mockJdsTemplate).getForMap("/vpr/" + MOCK_PID + "/urn:va:::frame:foo");
    }

    @Test
    public void testGetParamWithNullKey() throws Exception {
        Map mockData = new LinkedHashMap();
        mockData.put("fred", "barney");
        when(mockJdsTemplate.getForMap("/vpr/" + MOCK_PID + "/urn:va:::frame:foo")).thenReturn(singletonMap("data", singletonMap("items", singletonList(mockData))));
        String responseBody = controller.getParam("foo", MOCK_PID, null);
        assertThat(responseBody, is(mockData.toString()));
        verify(mockJdsTemplate).getForMap("/vpr/" + MOCK_PID + "/urn:va:::frame:foo");
    }

    @Test
    public void testAddObservation() throws Exception {
        when(mockTermEng.getDescription("foo")).thenReturn("Woah Nelly");

        String responseBody = controller.addObservation(MOCK_PID, "foo", "fred", "20131106061412");

        verify(mockTermEng).getDescription("foo");
        ArgumentCaptor<Observation> obsArg = ArgumentCaptor.forClass(Observation.class);
        verify(mockGenericDao).save(obsArg.capture());
        assertThat(obsArg.getValue().getUid(), is("urn:va:::obs:foo"));
        assertThat(obsArg.getValue().getPid(), is(MOCK_PID));
        assertThat(obsArg.getValue().getEntered(), is(MOCK_NOW));
        assertThat(obsArg.getValue().getKind(), is("Clinical Observation"));
        assertThat(obsArg.getValue().getTypeCode(), is("foo"));
        assertThat(obsArg.getValue().getTypeName(), is("Woah Nelly"));
        assertThat(obsArg.getValue().getResult(), is("fred"));
        assertThat(obsArg.getValue().getObserved(), is(new PointInTime(2013, 11, 6, 6, 14, 12)));

        verify(mockFrameRunner).pushEvents(anyList());
    }

    @Test
    public void testDelObservation() throws Exception {
        String responseBody = controller.delObservation(MOCK_PID, "foo");
        verify(mockGenericDao).deleteByUID(Observation.class, "urn:va:::obs:foo");
    }

    @Test
    public void testCreateEventEnqueuePatientEvent() throws Exception {
        mockRequest.addParameter("_ACTION_", "Enqueue");
        mockRequest.addParameter("eventClass", "gov.va.cpe.vpr.pom.PatientEvent");
        mockRequest.addParameter("uid", "urn:va:foo:ABCD:23");
        mockRequest.addParameter("fred", "barney"); // an event param

        IPatientObject mockEntity = mock(IPatientObject.class);
        when(mockEntity.getUid()).thenReturn("urn:va:foo:ABCD:23");
        when(mockEntity.getPid()).thenReturn(MOCK_PID);
        when(mockGenericDao.findByUID("urn:va:foo:ABCD:23")).thenReturn(mockEntity);

        ModelAndView mav = controller.createEvent(mockRequest);

        assertCreateEventModelAndView(mav);

        verify(mockGenericDao).findByUID("urn:va:foo:ABCD:23");
        ArgumentCaptor<PatientEvent> eventArg = ArgumentCaptor.forClass(PatientEvent.class);
        verify(mockFrameRunner).pushEvent(eventArg.capture());
        assertThat(eventArg.getValue().getUID(), is("urn:va:foo:ABCD:23"));
        assertThat(eventArg.getValue().getPID(), is(MOCK_PID));
        assertThat(eventArg.getValue().getType(), is(PatientEvent.Type.EVAL));
        assertThat(eventArg.getValue().getChanges().isEmpty(), is(true));
        assertThat((String) eventArg.getValue().getParams().get("fred"), is("barney"));
    }

    @Test
    public void testCreateEventEnqueuePatientEventUidNotFound() throws Exception {
        mockRequest.addParameter("_ACTION_", "Enqueue");
        mockRequest.addParameter("eventClass", "gov.va.cpe.vpr.pom.PatientEvent");
        mockRequest.addParameter("uid", "urn:va:foo:ABCD:23");

        when(mockGenericDao.findByUID("urn:va:foo:ABCD:23")).thenReturn(null);

        ModelAndView mav = controller.createEvent(mockRequest);

        assertCreateEventModelAndView(mav);
        List msgs = (List) mav.getModel().get("msgs");
        assertThat(msgs.size(), is(1));

        verify(mockGenericDao).findByUID("urn:va:foo:ABCD:23");
        verifyZeroInteractions(mockFrameRunner);
    }

    private void assertCreateEventModelAndView(ModelAndView mav) {
        assertThat(mav.getViewName(), is("/event/createEvent"));
        List msgs = (List) mav.getModel().get("msgs");
        assertThat(msgs, notNullValue());
        Map params = (Map) mav.getModel().get("params");
        assertThat(params, notNullValue());
        Map eventParams = (Map) mav.getModel().get("eventParams");
        assertThat(eventParams, notNullValue());
    }

    @Test
    public void testCreateEventExecuteFrame() throws Exception {
        mockRequest.addParameter("_ACTION_", "Execute");
        mockRequest.addParameter("eventClass", "gov.va.cpe.vpr.frameeng.CallEvent");
        mockRequest.addParameter("frameID", "foo");
        mockRequest.addParameter("fred", "barney"); // an event param

        FrameJob mockFrameJob = new FrameJob();
        when(mockFrameRunner.exec(Matchers.<IFrameEvent[]>any())).thenReturn(mockFrameJob);

        ModelAndView mav = controller.createEvent(mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get("event"), is("gov.va.cpe.vpr.frameeng.CallEvent"));
        Map<String, Object> eventParams = (Map<String, Object>) mav.getModel().get("eventParams");
        assertThat(eventParams, notNullValue());
        assertThat((String) eventParams.get("fred"), is("barney"));
        List<FrameAction> actions = (List<FrameAction>) mav.getModel().get("actions");
        assertThat(actions, notNullValue());
        Map<String, IFrame> frames = (Map<String, IFrame>) mav.getModel().get("frames");
        assertThat(frames, notNullValue());

        ArgumentCaptor<CallEvent> eventArg = ArgumentCaptor.forClass(CallEvent.class);
        verify(mockFrameRunner).exec(eventArg.capture());
        assertThat(eventArg.getValue().getFrameID(), is("foo"));
        assertThat((String) eventArg.getValue().getParams().get("fred"), is("barney"));
    }
}
