package gov.va.hmp.vista.springframework.security.web;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import org.apache.commons.codec.binary.Base64;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;

import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.*;

/**
 * TODO: Provide summary documentation of class VistaBasicAuthenticationFilter
 */
public class VistaBasicAuthenticationFilterTest {

    private MockHttpServletRequest request = new MockHttpServletRequest();
    private MockHttpServletResponse response = new MockHttpServletResponse();
    private MockFilterChain filterChain = new MockFilterChain();
    private AuthenticationManager mockAuthenticationManager;
    private BasicAuthenticationEntryPoint authenticationEntryPoint;

    @Before
    public void setUp() throws Exception {
        authenticationEntryPoint = new BasicAuthenticationEntryPoint();
        authenticationEntryPoint.setRealmName("FOO_REALM");
        mockAuthenticationManager = mock(AuthenticationManager.class);
    }

    @Test
    public void testAttemptAuthentication() throws IOException, ServletException {
        VistaBasicAuthenticationFilter f = new VistaBasicAuthenticationFilter();
        f.setAuthenticationManager(mockAuthenticationManager);
        f.setAuthenticationEntryPoint(authenticationEntryPoint);
        f.afterPropertiesSet();

        String vistaId = "9F2B";
        String division = "500";
        String accessCode = "10VEHU";
        String verifyCode = "VEHU10";

        byte[] token = new String(vistaId + ";" + division + ":" + accessCode + ";" + verifyCode).getBytes("UTF-8");
        request.addHeader("Authorization", "Basic " + new String(Base64.encodeBase64(token), "UTF-8"));
        request.setRemoteAddr("10.0.1.34");
        request.setRemoteHost("www.example.org");
        request.setRequestURI("/foo.xml");
        request.setMethod("GET");

        VistaAuthenticationToken authRequest = new VistaAuthenticationToken("9F2B", "500", "10VEHU", "VEHU10", "10.0.1.34", "www.example.org");
        when(mockAuthenticationManager.authenticate(AuthenticationTokenMatchers.eq(authRequest))).thenReturn(new VistaAuthenticationToken(new VistaUser(new RpcHost("localhost"), "9F2B", "500", "500", "12345", "500:10VEHU;VEHU10", "Vehu,Ten", true, true, true, true, new ArrayList<GrantedAuthority>()), "500:10VEHU;VEHU10", "10.0.1.34", null, new ArrayList<GrantedAuthority>()));

        f.doFilter(request, response, filterChain);

        assertSame(request, filterChain.getRequest());
        assertSame(response, filterChain.getResponse());

        verify(mockAuthenticationManager).authenticate(AuthenticationTokenMatchers.eq(authRequest));
    }
}
