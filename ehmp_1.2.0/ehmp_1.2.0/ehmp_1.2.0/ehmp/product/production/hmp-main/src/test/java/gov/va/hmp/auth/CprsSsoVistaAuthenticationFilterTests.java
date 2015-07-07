package gov.va.hmp.auth;

import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.web.util.UriUtils;

import java.util.ArrayList;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class CprsSsoVistaAuthenticationFilterTests {
    private MockHttpServletRequest request = new MockHttpServletRequest();
    private MockHttpServletResponse response = new MockHttpServletResponse();
    private MockFilterChain filterChain = new MockFilterChain();
    private AuthenticationManager mockAuthenticationManager;
    private AuthenticationFailureHandler mockFailureHandler;
    private IVistaAccountDao mockVistaAccountDao;
    private CprsSsoVistaAuthenticationFilter f;

    @Before
    public void setUp() throws Exception {
        mockAuthenticationManager = mock(AuthenticationManager.class);
        mockFailureHandler = mock(AuthenticationFailureHandler.class);
        mockVistaAccountDao = mock(IVistaAccountDao.class);

        f = new CprsSsoVistaAuthenticationFilter();
        f.setFilterProcessesUrl("/welcome.jsp");
        f.setAuthenticationFailureHandler(mockFailureHandler);
        f.setAuthenticationManager(mockAuthenticationManager);
        f.setVistaAccountDao(mockVistaAccountDao);
        f.afterPropertiesSet();
    }

    @Test
    public void testAttemptAuthentication() throws Exception {
        request.addParameter(CprsSsoVistaAuthenticationFilter.SERVER_KEY, "example.org");
        request.addParameter(CprsSsoVistaAuthenticationFilter.PORT_KEY, "9060");
        request.addParameter(CprsSsoVistaAuthenticationFilter.USER_DUZ_KEY, "1089");
        request.addParameter(CprsSsoVistaAuthenticationFilter.APP_HANDLE_KEY, "~2xwbccw58-43436_1");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("GET");
        request.setScheme("https");
        request.setSecure(true);

        VistaAccount mockVistaAccount = new VistaAccount();
        mockVistaAccount.setVistaId("9F2A");
        mockVistaAccount.setDivision("500D");
        mockVistaAccount.setHost("example.org");
        mockVistaAccount.setPort(9060);
        when(mockVistaAccountDao.findAllByHostAndPort("example.org", 9060)).thenReturn(Collections.singletonList(mockVistaAccount));

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2A", "500D", "001F06F8", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), "9F2A", "500", "500D", "1089", "500D:10VEHU;VEHU10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", "www.example.org", new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        assertNull(filterChain.getRequest());
        assertNull(filterChain.getResponse());

        verifyZeroInteractions(mockFailureHandler);

        ArgumentCaptor<VistaAuthenticationToken> arg = ArgumentCaptor.forClass(VistaAuthenticationToken.class);
        verify(mockAuthenticationManager).authenticate(arg.capture());

        assertThat(arg.getValue().getVistaId(), equalTo("9F2A"));
        assertThat(arg.getValue().getAppHandle(), equalTo("~2xwbccw58-43436_1"));
        assertThat(arg.getValue().getRemoteAddress(), equalTo("10.0.1.34"));
        assertThat(arg.getValue().getRemoteHostName(), equalTo("www.example.org"));
        assertThat(arg.getValue().getDivision(), equalTo(""));
        assertThat(arg.getValue().getAccessCode(), nullValue());
        assertThat(arg.getValue().getVerifyCode(), nullValue());
        assertThat(arg.getValue().getNewVerifyCode(), nullValue());
        assertThat(arg.getValue().getConfirmVerifyCode(), nullValue());
    }

    @Test
    public void testAttemptNonSecureAuthentication() throws Exception {
        request.addParameter(CprsSsoVistaAuthenticationFilter.SERVER_KEY, "example.org");
        request.addParameter(CprsSsoVistaAuthenticationFilter.PORT_KEY, "9060");
        request.addParameter(CprsSsoVistaAuthenticationFilter.USER_DUZ_KEY, "1089");
        request.addParameter(CprsSsoVistaAuthenticationFilter.APP_HANDLE_KEY, "~2xwbccw58-43436_1");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("GET");
        request.setScheme("http");
        request.setSecure(false);

        f.doFilter(request, response, filterChain);

        verify(mockFailureHandler).onAuthenticationFailure(eq(request), eq(response), any(AuthenticationServiceException.class));
    }

    @Test
    public void testAttemptAuthenticationWithMissingServer() throws Exception {
//        request.addParameter(CprsSsoVistaAuthenticationFilter.SERVER_KEY, "example.org");
        request.addParameter(CprsSsoVistaAuthenticationFilter.PORT_KEY, "9060");
        request.addParameter(CprsSsoVistaAuthenticationFilter.USER_DUZ_KEY, "1089");
        request.addParameter(CprsSsoVistaAuthenticationFilter.APP_HANDLE_KEY, "~2xwbccw58-43436_1");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("GET");
        request.setScheme("https");
        request.setSecure(true);

        when(mockVistaAccountDao.findAllByHostAndPort("example.org", 9060)).thenReturn(Collections.<VistaAccount>emptyList());

        f.doFilter(request, response, filterChain);

        ArgumentCaptor<VistaHostValidationException> exceptionCaptor = ArgumentCaptor.forClass(VistaHostValidationException.class);
        verify(mockFailureHandler).onAuthenticationFailure(eq(request), eq(response), exceptionCaptor.capture());
        Assert.assertThat(exceptionCaptor.getValue().getHost(), nullValue());
    }

    @Test
    public void testAttemptAuthenticationWithMissingPort() throws Exception {
        request.addParameter(CprsSsoVistaAuthenticationFilter.SERVER_KEY, "example.org");
//        request.addParameter(CprsSsoVistaAuthenticationFilter.PORT_KEY, "9060");
        request.addParameter(CprsSsoVistaAuthenticationFilter.USER_DUZ_KEY, "1089");
        request.addParameter(CprsSsoVistaAuthenticationFilter.APP_HANDLE_KEY, "~2xwbccw58-43436_1");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("GET");
        request.setScheme("https");
        request.setSecure(true);

        when(mockVistaAccountDao.findAllByHostAndPort("example.org", 9060)).thenReturn(Collections.<VistaAccount>emptyList());

        f.doFilter(request, response, filterChain);

        ArgumentCaptor<VistaHostValidationException> exceptionCaptor = ArgumentCaptor.forClass(VistaHostValidationException.class);
        verify(mockFailureHandler).onAuthenticationFailure(eq(request), eq(response), exceptionCaptor.capture());
        Assert.assertThat(exceptionCaptor.getValue().getHost(), nullValue());
    }

    @Test
    public void testAttemptAuthenticationWithUnknownVistaHost() throws Exception {
        request.addParameter(CprsSsoVistaAuthenticationFilter.SERVER_KEY, "example.org");
        request.addParameter(CprsSsoVistaAuthenticationFilter.PORT_KEY, "9060");
        request.addParameter(CprsSsoVistaAuthenticationFilter.USER_DUZ_KEY, "1089");
        request.addParameter(CprsSsoVistaAuthenticationFilter.APP_HANDLE_KEY, "~2xwbccw58-43436_1");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("GET");
        request.setScheme("https");
        request.setSecure(true);

        when(mockVistaAccountDao.findAllByHostAndPort("example.org", 9060)).thenReturn(Collections.<VistaAccount>emptyList());

        f.doFilter(request, response, filterChain);

        ArgumentCaptor<VistaHostValidationException> exceptionCaptor = ArgumentCaptor.forClass(VistaHostValidationException.class);
        verify(mockFailureHandler).onAuthenticationFailure(eq(request), eq(response), exceptionCaptor.capture());
        Assert.assertThat(exceptionCaptor.getValue().getHost().getHostname(), is("example.org"));
        Assert.assertThat(exceptionCaptor.getValue().getHost().getPort(), is(9060));
    }

    @Test
    public void testAttemptAuthenticationWithUserDUZMismatch() throws Exception {
        request.addParameter(CprsSsoVistaAuthenticationFilter.SERVER_KEY, "example.org");
        request.addParameter(CprsSsoVistaAuthenticationFilter.PORT_KEY, "9060");
        request.addParameter(CprsSsoVistaAuthenticationFilter.USER_DUZ_KEY, "1089");
        request.addParameter(CprsSsoVistaAuthenticationFilter.APP_HANDLE_KEY, "~1xwbccw58-43436_1");
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI(f.getFilterProcessesUrl());
        request.setMethod("GET");
        request.setScheme("https");
        request.setSecure(true);

        VistaAccount mockVistaAccount = new VistaAccount();
        mockVistaAccount.setVistaId("9F2A");
        mockVistaAccount.setDivision("500");
        mockVistaAccount.setHost("example.org");
        mockVistaAccount.setPort(9060);
        when(mockVistaAccountDao.findAllByHostAndPort("example.org", 9060)).thenReturn(Collections.singletonList(mockVistaAccount));

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2A", "", "~1xwbccw58-43436_1", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), "9F2A", "500", "500D", "12345", "500:10VEHU;VEHU10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", "www.example.org", new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        ArgumentCaptor<UserDUZMismatchException> exceptionCaptor = ArgumentCaptor.forClass(UserDUZMismatchException.class);
        verify(mockFailureHandler).onAuthenticationFailure(eq(request), eq(response), exceptionCaptor.capture());
    }

    @Test
    public void testUrlEncodePercentH() throws Exception {
        String foo = UriUtils.encodeQueryParam("~1xwbccw58-43436_1", "UTF8");
        assertThat(foo, is("~1xwbccw58-43436_1"));
    }
}
