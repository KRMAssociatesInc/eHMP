package gov.va.cpe.rpc;

import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.hub.dao.json.JsonAssert;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.*;
import gov.va.hmp.vista.rpc.support.InMemoryRpcLog;
import gov.va.hmp.vista.util.RpcUriUtils;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import gov.va.hmp.web.servlet.view.StringView;
import org.custommonkey.xmlunit.Diff;
import org.custommonkey.xmlunit.XMLAssert;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class RpcControllerTests {
    private RpcController controller;
    private MockHttpServletRequest mockRequest;
    private InMemoryRpcLog mockRpcLog;
    private IVistaAccountDao mockVistaAccountDao;
    private UserContext mockUserContext;
    private HmpUserDetails mockUser;
    private RpcOperations mockRpcTemplate;

    @Before
    public void setUp() throws Exception {
        XMLUnit.setIgnoreWhitespace(true);

        mockRequest = new MockHttpServletRequest();
        mockRpcLog = mock(InMemoryRpcLog.class);
        mockVistaAccountDao = mock(IVistaAccountDao.class);
        mockUserContext = mock(UserContext.class);
        mockUser = mock(HmpUserDetails.class);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);
        mockRpcTemplate = mock(RpcOperations.class);

        controller = new RpcController();
        controller.setRpcLog(mockRpcLog);
        controller.setVistaAccountDao(mockVistaAccountDao);
        controller.setUserContext(mockUserContext);
        controller.setRpcTemplate(mockRpcTemplate);
    }

    @Test
    public void testGetIndex() throws Exception {
        List<VistaAccount> mockVistaAccountList = Arrays.asList(new VistaAccount());
        when(mockVistaAccountDao.findAllByVistaIdIsNotNull()).thenReturn(mockVistaAccountList);
        when(mockUser.getDivision()).thenReturn("500");

        ModelAndView mav = controller.index();
        assertThat(mav.getViewName(), is("/rpc/index"));
        assertThat(mav.getModel().get("rpc"), is(instanceOf(RpcCommand.class)));
        assertThat(((RpcCommand) mav.getModel().get("rpc")).getDivision(), is("500"));
        assertThat((HmpUserDetails) mav.getModel().get("user"), is(sameInstance(mockUser)));
        assertThat((List<VistaAccount>) mav.getModel().get("accounts"), is(sameInstance(mockVistaAccountList)));

        verify(mockVistaAccountDao).findAllByVistaIdIsNotNull();
    }

    @Test
    public void testExecuteRpcUsingCurrentUserCredentials() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setContext("FOO");
        rpc.setName("BAR");
        rpc.getParams().add("baz");
        rpc.getParams().add("spaz");

        when(mockRpcTemplate.execute("FOO/BAR", rpc.getParams())).thenReturn(new RpcResponse("w00t"));

        ModelAndView mav = controller.execute(rpc, new BeanPropertyBindingResult(rpc, "rpc"));

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("text/plain"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is("w00t"));

        verify(mockRpcTemplate).execute("FOO/BAR", rpc.getParams());
    }

    @Test
    public void testExecuteRpcWithJsonResponse() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setContext("FOO");
        rpc.setName("BAR");
        rpc.getParams().add("baz");
        rpc.getParams().add("spaz");
        rpc.setFormat("json");

        when(mockRpcTemplate.execute("FOO/BAR", rpc.getParams())).thenReturn(new RpcResponse("{\"foo\":\"w00t\"}"));

        ModelAndView mav = controller.execute(rpc, new BeanPropertyBindingResult(rpc, "rpc"));

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/json"));
        JsonAssert.assertJsonEquals("{\"foo\":\"w00t\"}", (String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY));

        verify(mockRpcTemplate).execute("FOO/BAR", rpc.getParams());
    }

    @Test
    public void testExecuteRpcWithXmlResponse() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setContext("FOO");
        rpc.setName("BAR");
        rpc.getParams().add("baz");
        rpc.getParams().add("spaz");
        rpc.setFormat("xml");

        when(mockRpcTemplate.execute("FOO/BAR", rpc.getParams())).thenReturn(new RpcResponse("<foo><bar>w00t</bar></foo>"));

        ModelAndView mav = controller.execute(rpc, new BeanPropertyBindingResult(rpc, "rpc"));

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("application/xml"));
        Diff xmlDiff = new Diff("<?xml version=\"1.0\" encoding=\"utf-8\"?><foo><bar>w00t</bar></foo>", (String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY));
        assertTrue(xmlDiff.toString(), xmlDiff.similar());

        verify(mockRpcTemplate).execute("FOO/BAR", rpc.getParams());
    }

    @Test
    public void testExecuteRpcUsingOtherCredentials() throws Exception {
        RpcCommand rpc = new RpcCommand();
        rpc.setContext("FOO");
        rpc.setName("BAR");
        rpc.getParams().add("baz");
        rpc.getParams().add("spaz");
        rpc.setDivision("500");
        rpc.setAccessCode("10vehu");
        rpc.setVerifyCode("vehu10");
        when(mockUser.getVistaId()).thenReturn("ABCD");

        when(mockRpcTemplate.execute("vrpcb://500:10vehu;vehu10@ABCD/FOO/BAR", rpc.getParams())).thenReturn(new RpcResponse("w00t"));

        ModelAndView mav = controller.execute(rpc, new BeanPropertyBindingResult(rpc, "rpc"));

        assertThat(mav.getViewName(), is(StringView.DEFAULT_VIEW_NAME));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_CONTENT_TYPE_KEY), is("text/plain"));
        assertThat((String) mav.getModel().get(StringView.DEFAULT_MODEL_KEY), is("w00t"));

        verify(mockRpcTemplate).execute("vrpcb://500:10vehu;vehu10@ABCD/FOO/BAR", rpc.getParams());
    }

    @Test
    public void testGetRpcLogWithAllUsersEnabled() throws Exception {
        mockRpcLog.setAllEnabled(true);

        List<RpcEvent> mockRpcEvents = Arrays.asList(new RpcEvent(new RpcRequest("FOO/BAR"), new RpcResponse("w00t")));
        when(mockRpcLog.getRpcEvents()).thenReturn(mockRpcEvents);
        when(mockRpcLog.isAllEnabled()).thenReturn(true);

        ModelAndView mav = controller.log(new PageRequest(0, 5), mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(instanceOf(JsonCCollection.class)));

        JsonCCollection<RpcEvent> jsonc = (JsonCCollection) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat((Boolean) jsonc.getAdditionalData().get("enabledForAllUsers"), is(true));
        assertThat((Boolean) jsonc.getAdditionalData().get("enabledForCurrentUser"), is(false));
        assertThat(jsonc.getCurrentItemCount(), is(1));
        assertThat(jsonc.getItems().get(0), is(sameInstance(mockRpcEvents.get(0))));

        verify(mockRpcLog, times(2)).isAllEnabled();
        verify(mockRpcLog).getRpcEvents();
    }

    @Test
    public void testGetRpcLogWithCurrentUserEnabled() throws Exception {
        RpcHost mockHost = new RpcHost("example.org");

        when(mockUser.getVistaId()).thenReturn("ABCD");
        when(mockUser.getDivision()).thenReturn("500");
        String mockCredentials = RpcUriUtils.toCredentials(mockUser.getDivision(), "10vehu", "vehu10", "123.45.67.89", "www.example.org");
        when(mockUser.getCredentials()).thenReturn(mockCredentials);
        when(mockUser.getHost()).thenReturn(mockHost);

        mockRpcLog.setAllEnabled(false);
        mockRpcLog.enableFor(mockHost, mockCredentials);

        List<RpcEvent> mockRpcEvents = Arrays.asList(new RpcEvent(new RpcRequest("FOO/BAR"), new RpcResponse("w00t")));
        when(mockRpcLog.getRpcEvents(eq(mockHost), eq(mockCredentials))).thenReturn(mockRpcEvents);
        when(mockRpcLog.isEnabledFor(eq(mockHost), eq(mockCredentials))).thenReturn(true);

        ModelAndView mav = controller.log(new PageRequest(0, 5), mockRequest);

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(instanceOf(JsonCCollection.class)));

        JsonCCollection<RpcEvent> jsonc = (JsonCCollection) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat((Boolean) jsonc.getAdditionalData().get("enabledForAllUsers"), is(false));
        assertThat((Boolean) jsonc.getAdditionalData().get("enabledForCurrentUser"), is(true));
        assertThat(jsonc.getCurrentItemCount(), is(1));
        assertThat(jsonc.getItems().get(0), is(sameInstance(mockRpcEvents.get(0))));

        verify(mockRpcLog).isEnabledFor(mockHost, mockCredentials);
        verify(mockRpcLog, times(2)).isAllEnabled();
        verify(mockRpcLog).getRpcEvents(mockHost, mockCredentials);
    }

    @Test
    public void testToggleRpcLoggingForAllUsers() throws Exception {
        mockRequest.setMethod("POST");

        ModelAndView mav = controller.toggle(false, true, mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(instanceOf(JsonCResponse.class)));

        verify(mockRpcLog).enableForAll();
    }

    @Test
    public void testToggleRpcLoggingForCurrentUser() throws Exception {
        mockRequest.setMethod("POST");

        RpcHost mockHost = new RpcHost("example.org");

        when(mockUser.getVistaId()).thenReturn("ABCD");
        when(mockUser.getDivision()).thenReturn("500");
        String mockCredentials = RpcUriUtils.toCredentials(mockUser.getDivision(), "10vehu", "vehu10", "123.45.67.89", "www.example.org");
        when(mockUser.getCredentials()).thenReturn(mockCredentials);
        when(mockUser.getHost()).thenReturn(mockHost);



        ModelAndView mav = controller.toggle(true, false, mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(instanceOf(JsonCResponse.class)));

        verify(mockRpcLog).enableFor(mockHost, mockCredentials);
    }

    @Test
    public void testClearRpcLog() throws Exception {
        mockRequest.setMethod("POST");

        ModelAndView mav = controller.clear(mockRequest);
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), is(instanceOf(JsonCResponse.class)));

        verify(mockRpcLog).clear();
    }
}
