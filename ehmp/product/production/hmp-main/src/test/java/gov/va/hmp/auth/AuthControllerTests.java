package gov.va.hmp.auth;

import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.PortResolver;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

import static gov.va.hmp.HmpProperties.SETUP_COMPLETE;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthControllerTests {

    private AuthController c;
    private UserContext mockUserContext;
    private RpcOperations mockAuthenticationRpcTemplate;
    private IVistaAccountDao mockVistaAccountDao;

    private ISyncService mockSyncService;
    private MockHttpServletRequest mockRequest;
    private MockHttpServletResponse mockResponse;
    private MockHttpSession mockSession;
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        mockSession = new MockHttpSession();
        mockRequest = new MockHttpServletRequest();
        mockRequest.setSession(mockSession);
        mockResponse = new MockHttpServletResponse();

        mockUserContext = mock(UserContext.class);
        mockAuthenticationRpcTemplate = mock(RpcOperations.class);
        mockVistaAccountDao = mock(IVistaAccountDao.class);
        mockEnvironment = mock(Environment.class);
        mockSyncService = mock(ISyncService.class);

        c = new AuthController();
        c.setUserContext(mockUserContext);
        c.setAuthenticationRpcTemplate(mockAuthenticationRpcTemplate);
        c.setVistaAccountDao(mockVistaAccountDao);
        c.setEnvironment(mockEnvironment);
        c.setSyncService(mockSyncService);
    }

    @Test
    public void testSetupNotCompleteRedirectsToRootSoThatSpringSecurityFilterPicksItUpRequest() throws Exception {
        when(mockEnvironment.getProperty(SETUP_COMPLETE)).thenReturn(null);

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("redirect:/"));
    }

    @Test
    public void testDisplayLoginPageWithOriginalSavedRequestIfSetupComplete() throws Exception {
        when(mockEnvironment.getProperty(SETUP_COMPLETE)).thenReturn("true");
        when(mockEnvironment.getProperty(HmpProperties.VERSION)).thenReturn("fred");
        when(mockSyncService.isOperationalSynching()).thenReturn(Boolean.FALSE);
        when(mockSyncService.isReindexAllComplete()).thenReturn(Boolean.TRUE);
        when(mockSyncService.isDataStreamEnabled()).thenReturn(Boolean.TRUE);

        MockHttpServletRequest mockOriginalRequest = new MockHttpServletRequest();
        mockOriginalRequest.setScheme("https");
        mockOriginalRequest.setServerName("example.org");
        mockOriginalRequest.setServerPort(3333);
        mockOriginalRequest.setRequestURI("/foo/bar/baz");

        PortResolver mockPortResolver = mock(PortResolver.class);
        when(mockPortResolver.getServerPort(mockOriginalRequest)).thenReturn(3333);

        // spring security will have put the original request in the session
        mockSession.setAttribute("SPRING_SECURITY_SAVED_REQUEST", new DefaultSavedRequest(mockOriginalRequest, mockPortResolver));

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("/auth/login"));
        assertThat(((String) mav.getModel().get("hmpVersion")), equalTo("fred"));
    }

    @Test
    public void testDisplayLoginPageAfterAjaxRequestWhichFailedDueToExpiredSession() throws Exception {
        when(mockEnvironment.getProperty(SETUP_COMPLETE)).thenReturn("true");
        when(mockEnvironment.getProperty(HmpProperties.VERSION)).thenReturn("fred");
        when(mockSyncService.isOperationalSynching()).thenReturn(Boolean.FALSE);
        when(mockSyncService.isReindexAllComplete()).thenReturn(Boolean.TRUE);
        when(mockSyncService.isDataStreamEnabled()).thenReturn(Boolean.TRUE);

        MockHttpServletRequest mockOriginalRequest = new MockHttpServletRequest();
        mockOriginalRequest.addHeader("X-Requested-With", "XMLHttpRequest");
        mockOriginalRequest.setScheme("https");
        mockOriginalRequest.setServerName("example.org");
        mockOriginalRequest.setServerPort(3333);
        mockOriginalRequest.setRequestURI("/foo/bar/baz");

        PortResolver mockPortResolver = mock(PortResolver.class);
        when(mockPortResolver.getServerPort(mockOriginalRequest)).thenReturn(3333);

        // spring security will have put the original request in the session
        mockSession.setAttribute("SPRING_SECURITY_SAVED_REQUEST", new DefaultSavedRequest(mockOriginalRequest, mockPortResolver));

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("/auth/login"));
        assertThat(((String) mav.getModel().get("hmpVersion")), equalTo("fred"));
    }

    @Test
    public void testDisplaySyncStatusPageWhenOperationalSyncIncomplete() throws Exception {
        when(mockEnvironment.getProperty(SETUP_COMPLETE)).thenReturn("true");
        when(mockEnvironment.getProperty(HmpProperties.VERSION)).thenReturn("fred");
        when(mockSyncService.isOperationalSynching()).thenReturn(Boolean.TRUE);

        MockHttpServletRequest mockOriginalRequest = new MockHttpServletRequest();
        mockOriginalRequest.addHeader("X-Requested-With", "XMLHttpRequest");
        mockOriginalRequest.setScheme("https");
        mockOriginalRequest.setServerName("example.org");
        mockOriginalRequest.setServerPort(3333);
        mockOriginalRequest.setRequestURI("/foo/bar/baz");

        PortResolver mockPortResolver = mock(PortResolver.class);
        when(mockPortResolver.getServerPort(mockOriginalRequest)).thenReturn(3333);

        // spring security will have put the original request in the session
        mockSession.setAttribute("SPRING_SECURITY_SAVED_REQUEST", new DefaultSavedRequest(mockOriginalRequest, mockPortResolver));

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("/auth/initializing"));
        assertThat(((String) mav.getModel().get("hmpVersion")), equalTo("fred"));
    }

    @Test
    public void testDisplayDataStreamErrorPageWhenDataStreamFailure() throws Exception {
        when(mockEnvironment.getProperty(SETUP_COMPLETE)).thenReturn("true");
        when(mockEnvironment.getProperty(HmpProperties.VERSION)).thenReturn("fred");
        when(mockSyncService.isReindexAllComplete()).thenReturn(Boolean.TRUE);
        when(mockSyncService.isOperationalSynching()).thenReturn(Boolean.FALSE);
        when(mockSyncService.isDataStreamEnabled()).thenReturn(Boolean.FALSE);
        Map<String, Object> derr = new HashMap<>();
        derr.put("disableMsg","There's a bar stuck in the foo");
        when(mockSyncService.getDataStreamErrorDetails()).thenReturn(derr);

        MockHttpServletRequest mockOriginalRequest = new MockHttpServletRequest();
        mockOriginalRequest.addHeader("X-Requested-With", "XMLHttpRequest");
        mockOriginalRequest.setScheme("https");
        mockOriginalRequest.setServerName("example.org");
        mockOriginalRequest.setServerPort(3333);
        mockOriginalRequest.setRequestURI("/foo/bar/baz");

        PortResolver mockPortResolver = mock(PortResolver.class);
        when(mockPortResolver.getServerPort(mockOriginalRequest)).thenReturn(3333);

        // spring security will have put the original request in the session
        mockSession.setAttribute("SPRING_SECURITY_SAVED_REQUEST", new DefaultSavedRequest(mockOriginalRequest, mockPortResolver));

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("/auth/dataStreamError"));
        assertThat(((String) mav.getModel().get("hmpVersion")), equalTo("fred"));
    }

    @Test
    public void testDisplayReindexStatusPageWhenReindexingIncomplete() throws Exception {
        when(mockEnvironment.getProperty(SETUP_COMPLETE)).thenReturn("true");
        when(mockEnvironment.getProperty(HmpProperties.VERSION)).thenReturn("fred");
        when(mockSyncService.isOperationalSynching()).thenReturn(Boolean.FALSE);
        when(mockSyncService.isReindexAllComplete()).thenReturn(Boolean.FALSE);

        MockHttpServletRequest mockOriginalRequest = new MockHttpServletRequest();
        mockOriginalRequest.addHeader("X-Requested-With", "XMLHttpRequest");
        mockOriginalRequest.setScheme("https");
        mockOriginalRequest.setServerName("example.org");
        mockOriginalRequest.setServerPort(3333);
        mockOriginalRequest.setRequestURI("/foo/bar/baz");

        PortResolver mockPortResolver = mock(PortResolver.class);
        when(mockPortResolver.getServerPort(mockOriginalRequest)).thenReturn(3333);

        // spring security will have put the original request in the session
        mockSession.setAttribute("SPRING_SECURITY_SAVED_REQUEST", new DefaultSavedRequest(mockOriginalRequest, mockPortResolver));

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("/auth/reindexing"));
        assertThat(((String) mav.getModel().get("hmpVersion")), equalTo("fred"));
    }

    @Test
    public void testAlreadyLoggedInRedirectsToRoot() throws Exception {
        when(mockUserContext.isLoggedIn()).thenReturn(true);

        ModelAndView mav = c.login(mockRequest, mockResponse);
        assertThat(mav.getViewName(), equalTo("redirect:/"));
    }

    @Test
    public void testLogout() throws Exception {
        assertThat(c.logout(), equalTo("redirect:/j_spring_security_logout"));
    }
}
