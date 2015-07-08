package gov.va.hmp.auth;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class UnauthorizedAjaxEntryPointTests {

    @Test
    public void testCommence() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Requested-With", "XMLHttpRequest");

        MockHttpServletResponse response = new MockHttpServletResponse();

        AuthenticationFailureHandler mockFailureHandler = mock(AuthenticationFailureHandler.class);

        UnauthorizedAjaxEntryPoint entryPoint = new UnauthorizedAjaxEntryPoint();
        entryPoint.setAuthenticationFailureHandler(mockFailureHandler);

        InsufficientAuthenticationException authException = new InsufficientAuthenticationException("foo bar");
        entryPoint.commence(request, response, authException);

        verify(mockFailureHandler).onAuthenticationFailure(request, response, authException);
    }
}
