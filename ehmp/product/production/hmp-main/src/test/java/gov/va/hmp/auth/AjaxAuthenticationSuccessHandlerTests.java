package gov.va.hmp.auth;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class AjaxAuthenticationSuccessHandlerTests {
    private MockHttpServletRequest mockRequest;
    private MockHttpServletResponse mockResponse;
    private AuthenticationSuccessHandler delegateSuccessHandler;

    private AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockRequest.addHeader("X-Requested-With", "XMLHttpRequest");

        mockResponse = new MockHttpServletResponse();

        delegateSuccessHandler = mock(AuthenticationSuccessHandler.class);

        ajaxAuthenticationSuccessHandler = new AjaxAuthenticationSuccessHandler(delegateSuccessHandler);
    }

    @Test
    public void testNonAjaxAuthenticationFailure() throws Exception {
        mockRequest = new MockHttpServletRequest();

        TestingAuthenticationToken auth = new TestingAuthenticationToken("foo", "bar");
        ajaxAuthenticationSuccessHandler.onAuthenticationSuccess(mockRequest, mockResponse, auth);

        verify(delegateSuccessHandler).onAuthenticationSuccess(mockRequest, mockResponse, auth);
    }

}
