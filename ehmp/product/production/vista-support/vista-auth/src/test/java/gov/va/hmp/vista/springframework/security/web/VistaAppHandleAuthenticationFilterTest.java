package gov.va.hmp.vista.springframework.security.web;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import java.util.ArrayList;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class VistaAppHandleAuthenticationFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();
    private MockHttpServletResponse response = new MockHttpServletResponse();
    private MockFilterChain filterChain = new MockFilterChain();
    private AuthenticationManager mockAuthenticationManager;

    @Before
    public void setUp() throws Exception {
        mockAuthenticationManager = mock(AuthenticationManager.class);
    }

    @Test
    public void testAttemptAuthentication() throws Exception {
        VistaAppHandleAuthenticationFilter f = new VistaAppHandleAuthenticationFilter();
        f.setFilterProcessesUrl("/welcome.jsp");
        f.setAuthenticationFailureHandler(new SimpleUrlAuthenticationFailureHandler("/authenticationFailed.jsp"));
        f.setAuthenticationManager(mockAuthenticationManager);
        f.afterPropertiesSet();

        request.addParameter(VistaAppHandleAuthenticationFilter.VISTA_ID_KEY, "9F2A");
        request.addParameter(VistaAppHandleAuthenticationFilter.DIVISION_KEY, "500");
        request.addParameter(VistaAppHandleAuthenticationFilter.APP_HANDLE_KEY, "1AB2C3D4E5F6");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("POST");

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2A", "500", "1AB2C3D4E5F6", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), "9F2A", "500", "500", "12345", "500:10VEHU;VEHU10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", "www.example.org", new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        assertNull(filterChain.getRequest());
        assertNull(filterChain.getResponse());

        ArgumentCaptor<VistaAuthenticationToken> arg = ArgumentCaptor.forClass(VistaAuthenticationToken.class);
        verify(mockAuthenticationManager).authenticate(arg.capture());

        assertThat(arg.getValue().getVistaId(), equalTo("9F2A"));
        assertThat(arg.getValue().getDivision(), equalTo("500"));
        assertThat(arg.getValue().getAppHandle(), equalTo("1AB2C3D4E5F6"));
        assertThat(arg.getValue().getRemoteAddress(), equalTo("10.0.1.34"));
        assertThat(arg.getValue().getRemoteHostName(), equalTo("www.example.org"));
        assertThat(arg.getValue().getAccessCode(), nullValue());
        assertThat(arg.getValue().getVerifyCode(), nullValue());
        assertThat(arg.getValue().getNewVerifyCode(), nullValue());
        assertThat(arg.getValue().getConfirmVerifyCode(), nullValue());
    }

}
