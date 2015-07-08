package gov.va.hmp.auth;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.protocol.VerifyCodeExpiredException;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.http.HttpServletResponse;

import static gov.va.hmp.hub.dao.json.JsonAssert.assertJsonEquals;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class AjaxAuthenticationFailureHandlerTests {

    private MockHttpServletRequest mockRequest;
    private MockHttpServletResponse mockResponse;
    private AuthenticationFailureHandler delegateFailureHandler;

    private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockRequest.addHeader("X-Requested-With", "XMLHttpRequest");

        mockResponse = new MockHttpServletResponse();

        delegateFailureHandler = mock(AuthenticationFailureHandler.class);

        ajaxAuthenticationFailureHandler = new AjaxAuthenticationFailureHandler(delegateFailureHandler);
    }

    @Test
    public void testNonAjaxAuthenticationFailure() throws Exception {
        mockRequest = new MockHttpServletRequest();

        AuthenticationServiceException foo = new AuthenticationServiceException("foo");
        ajaxAuthenticationFailureHandler.onAuthenticationFailure(mockRequest, mockResponse, foo);

        verify(delegateFailureHandler).onAuthenticationFailure(mockRequest, mockResponse, foo);
    }

    @Test
    public void testAjaxAuthenticationFailureDefault() throws Exception {
        ajaxAuthenticationFailureHandler.onAuthenticationFailure(mockRequest, mockResponse, new AuthenticationServiceException("foo bar"));

        assertThat(mockResponse.getContentType(), equalTo("application/json"));
        assertThat(mockResponse.getStatus(), equalTo(HttpServletResponse.SC_UNAUTHORIZED));

        assertJsonEquals("{\"apiVersion\":\"1\",\"success\":false,\"error\":{\"code\":401,\"message\":\"foo bar\"}}", mockResponse.getContentAsString());
    }

    @Test
    public void testVersionMismatch() throws Exception {
        HmpVersionMismatchException versionMismatchException = new HmpVersionMismatchException("foo", "bar", new RpcHost("example.org"), "ABCD", "500");
        ajaxAuthenticationFailureHandler.onAuthenticationFailure(mockRequest, mockResponse, new AuthenticationServiceException(versionMismatchException.getMessage(), versionMismatchException));

        assertThat(mockResponse.getContentType(), equalTo("application/json"));
        assertThat(mockResponse.getStatus(), equalTo(HttpServletResponse.SC_FORBIDDEN));

        assertJsonEquals("{\"apiVersion\":\"1\",\"success\":false,\"error\":{\"code\":403,\"message\":\"" + versionMismatchException.getMessage() + "\"}}", mockResponse.getContentAsString());
    }

    @Test
    public void testVerifyCodeExpired() throws Exception {
        VerifyCodeExpiredException verifyCodeExpiredException = new VerifyCodeExpiredException();

        ajaxAuthenticationFailureHandler.onAuthenticationFailure(mockRequest, mockResponse, new CredentialsExpiredException(verifyCodeExpiredException.getMessage(), verifyCodeExpiredException));

        assertThat(mockResponse.getContentType(), equalTo("application/json"));
        assertThat(mockResponse.getStatus(), equalTo(HttpServletResponse.SC_UNAUTHORIZED));

        assertJsonEquals("{\"apiVersion\":\"1\",\"success\":false,\"error\":{\"code\":\"" + AjaxAuthenticationFailureHandler.VERIFY_CODE_EXPIRED + "\",\"message\":\"" + verifyCodeExpiredException.getMessage() + "\"}}", mockResponse.getContentAsString());
    }
}
