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
import static org.mockito.Mockito.*;

public class VistaAccessVerifyAuthenticationFilterTest {

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
        VistaAccessVerifyAuthenticationFilter f = new VistaAccessVerifyAuthenticationFilter();
        f.setFilterProcessesUrl("/welcome.jsp");
        f.setAuthenticationFailureHandler(new SimpleUrlAuthenticationFailureHandler("/authenticationFailed.jsp"));
        f.setAuthenticationManager(mockAuthenticationManager);
        f.afterPropertiesSet();

        request.addParameter(AbstractVistaAuthenticationProcessingFilter.VISTA_ID_KEY, "9F2A");
        request.addParameter(AbstractVistaAuthenticationProcessingFilter.DIVISION_KEY, "500");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.ACCESS_CODE_KEY, "10VEHU");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.VERIFY_CODE_KEY, "VEHU10");
        request.setRemoteAddr("10.0.1.34");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("POST");

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2A", "500", "10VEHU", "VEHU10", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), "9F2A", "500", "500", "12345", "500:10VEHU;VEHU10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", null, new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        assertNull(filterChain.getRequest());
        assertNull(filterChain.getResponse());

        ArgumentCaptor<VistaAuthenticationToken> arg = ArgumentCaptor.forClass(VistaAuthenticationToken.class);
        verify(mockAuthenticationManager).authenticate(arg.capture());

        assertThat(arg.getValue().getVistaId(), equalTo("9F2A"));
        assertThat(arg.getValue().getDivision(), equalTo("500"));
        assertThat(arg.getValue().getAccessCode(), equalTo("10VEHU"));
        assertThat(arg.getValue().getVerifyCode(), equalTo("VEHU10"));
        assertThat(arg.getValue().getNewVerifyCode(), nullValue());
        assertThat(arg.getValue().getConfirmVerifyCode(), nullValue());
        assertThat(arg.getValue().getRemoteAddress(), equalTo("10.0.1.34"));
    }

    @Test
    public void testAttemptAuthenticationWithAccessAndVerifySemiColonSeparatedInTheAccess() throws Exception {
        VistaAccessVerifyAuthenticationFilter f = new VistaAccessVerifyAuthenticationFilter();
        f.setFilterProcessesUrl("/welcome.jsp");
        f.setAuthenticationFailureHandler(new SimpleUrlAuthenticationFailureHandler("/authenticationFailed.jsp"));
        f.setAuthenticationManager(mockAuthenticationManager);
        f.afterPropertiesSet();

        request.addParameter(AbstractVistaAuthenticationProcessingFilter.VISTA_ID_KEY, "9F2A");
        request.addParameter(AbstractVistaAuthenticationProcessingFilter.DIVISION_KEY, "500");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.ACCESS_CODE_KEY, "10vehu;vehu10");
        request.setRemoteAddr("10.0.1.34");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("POST");

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2A", "500", "10vehu", "vehu10", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), "9F2A", "500", "500", "12345", "500:10vehu;vehu10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", null, new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        assertNull(filterChain.getRequest());
        assertNull(filterChain.getResponse());

        ArgumentCaptor<VistaAuthenticationToken> arg = ArgumentCaptor.forClass(VistaAuthenticationToken.class);
        verify(mockAuthenticationManager).authenticate(arg.capture());

        assertThat(arg.getValue().getVistaId(), equalTo("9F2A"));
        assertThat(arg.getValue().getDivision(), equalTo("500"));
        assertThat(arg.getValue().getAccessCode(), equalTo("10vehu"));
        assertThat(arg.getValue().getVerifyCode(), equalTo("vehu10"));
        assertThat(arg.getValue().getNewVerifyCode(), nullValue());
        assertThat(arg.getValue().getConfirmVerifyCode(), nullValue());
        assertThat(arg.getValue().getRemoteAddress(), equalTo("10.0.1.34"));
    }

    @Test
    public void testAttemptChangeVerifyCode() throws Exception {
        VistaAccessVerifyAuthenticationFilter f = new VistaAccessVerifyAuthenticationFilter();
        f.setFilterProcessesUrl("/welcome.jsp");
        f.setAuthenticationFailureHandler(new SimpleUrlAuthenticationFailureHandler("/authenticationFailed.jsp"));
        f.setAuthenticationManager(mockAuthenticationManager);
        f.afterPropertiesSet();

        request.addParameter(AbstractVistaAuthenticationProcessingFilter.VISTA_ID_KEY, "9F2A");
        request.addParameter(AbstractVistaAuthenticationProcessingFilter.DIVISION_KEY, "500");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.ACCESS_CODE_KEY, "10VEHU");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.VERIFY_CODE_KEY, "VEHU10");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.NEW_VERIFY_CODE_KEY, "10UHEV");
        request.addParameter(VistaAccessVerifyAuthenticationFilter.CONFIRM_VERIFY_CODE_KEY, "UHEV10");
        request.setRemoteAddr("10.0.1.34");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("POST");

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2A", "500", "10VEHU", "VEHU10", "10UHEV", "UHEV10", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), null, "500", "500", "12345", "500:10VEHU;VEHU10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", null, new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        assertNull(filterChain.getRequest());
        assertNull(filterChain.getResponse());

        ArgumentCaptor<VistaAuthenticationToken> arg = ArgumentCaptor.forClass(VistaAuthenticationToken.class);
        verify(mockAuthenticationManager).authenticate(arg.capture());

        assertThat(arg.getValue().getVistaId(), equalTo("9F2A"));
        assertThat(arg.getValue().getDivision(), equalTo("500"));
        assertThat(arg.getValue().getAccessCode(), equalTo("10VEHU"));
        assertThat(arg.getValue().getVerifyCode(), equalTo("VEHU10"));
        assertThat(arg.getValue().getNewVerifyCode(), equalTo("10UHEV"));
        assertThat(arg.getValue().getConfirmVerifyCode(), equalTo("UHEV10"));
        assertThat(arg.getValue().getRemoteAddress(), equalTo("10.0.1.34"));
    }

}
