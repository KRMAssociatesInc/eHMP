package gov.va.hmp.web.servlet;

import gov.va.hmp.auth.HmpUserDetails;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockServletContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpSessionBindingEvent;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class UserTimeoutIntegrationSessionAttributeListenerTest {

    private UserTimeoutIntegrationSessionAttributeListener listener;
    private SecurityContext mockSecurityContext;
    private MockHttpSession mockSession;
    private HmpUserDetails mockUser;
    private MockServletContext mockServletContext;
    private WebApplicationContext mockAppContext;
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        listener = new UserTimeoutIntegrationSessionAttributeListener();

        mockServletContext = new MockServletContext();

        mockSession = new MockHttpSession(mockServletContext);
        mockSession.setMaxInactiveInterval(60); // default of 1 minutes

        mockAppContext = mock(WebApplicationContext.class);
        mockEnvironment = mock(Environment.class);
        mockServletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, mockAppContext);
        when(mockAppContext.getEnvironment()).thenReturn(mockEnvironment);

        mockSecurityContext = mock(SecurityContext.class);
        Authentication mockAuth = mock(Authentication.class);
        mockUser = mock(HmpUserDetails.class);
        when(mockUser.hasVistaKey("XUPROG")).thenReturn(false);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        when(mockAuth.getPrincipal()).thenReturn(mockUser);
        when(mockUser.getTimeoutSeconds()).thenReturn(600); // CPRS setting is 10m
    }

    @Test
    public void testAttributeAdded() throws Exception {
        listener.attributeAdded(new HttpSessionBindingEvent(mockSession, HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, mockSecurityContext));
        assertThat(mockSession.getMaxInactiveInterval(), is(600));
    }

    @Test
    public void testAttributeAddedForXUProgOnly() throws Exception {
        reset(mockUser);
        when(mockUser.hasVistaKey("XUPROG")).thenReturn(true);
        when(mockEnvironment.getProperty("session.timeoutSec", Integer.class)).thenReturn(6000);
        listener.attributeAdded(new HttpSessionBindingEvent(mockSession, HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, mockSecurityContext));
        // XU PROG users should get something else
        assertThat(mockSession.getMaxInactiveInterval(), is(86400));
    }
}
