package gov.va.hmp.auth;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;

public class CprsSsoAuthenticationFailureHandlerTests {

    private MockHttpServletRequest mockRequest = new MockHttpServletRequest();
    private MockHttpServletResponse mockResponse = new MockHttpServletResponse();
    private CprsSsoAuthenticationFailureHandler failureHandler = new CprsSsoAuthenticationFailureHandler();

    @Test
    public void testAuthenticationFailure() throws Exception {
        failureHandler.onAuthenticationFailure(mockRequest, mockResponse, new BadCredentialsException("blah blah blah"));

        Assert.assertThat(mockResponse.getRedirectedUrl(), is("/auth/login?msg=SSO_FAIL"));
    }
}
