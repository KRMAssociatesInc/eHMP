package gov.va.hmp.web.servlet;

import gov.va.cpe.pt.PatientContext;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AjaxHandlerExceptionResolverTests {

    private AjaxHandlerExceptionResolver exceptionResolver;
    private MockHttpServletResponse response;
    private MockHttpServletRequest request;
    private ContentNegotiationStrategy mockContentNegotiationStrategy;
    private UserContext mockUserContext;
    private PatientContext mockPatientContext;
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        mockContentNegotiationStrategy = mock(ContentNegotiationStrategy.class);
        when(mockContentNegotiationStrategy.resolveMediaTypes(any(NativeWebRequest.class))).thenReturn(Collections.<MediaType>emptyList());

        exceptionResolver = new AjaxHandlerExceptionResolver();
        mockUserContext = mock(UserContext.class);
        mockPatientContext = mock(PatientContext.class);
        mockEnvironment = mock(Environment.class);
        exceptionResolver.setUserContext(mockUserContext);
        exceptionResolver.setPatientContext(mockPatientContext);
        exceptionResolver.setEnvironment(mockEnvironment);
        exceptionResolver.setContentNegotiationStrategy(mockContentNegotiationStrategy);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    public void testResolveExceptionDuringAjaxRequest() throws Exception {
        request.addHeader("X-Requested-With", "XMLHttpRequest");

        ModelAndView mav = exceptionResolver.resolveException(request, response, null, new NullPointerException("something was null"));
        assertThat(mav, notNullValue());
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), instanceOf(JsonCResponse.class));
        assertThat(response.getStatus(), is(HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
    }

    @Test
    public void testResolveExceptionDuringNormalButContentNegotiatingRequest() throws Exception {
        when(mockContentNegotiationStrategy.resolveMediaTypes(any(NativeWebRequest.class))).thenReturn(Arrays.asList(MediaType.APPLICATION_JSON));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter("format", "json");

        ModelAndView mav = exceptionResolver.resolveException(request, response, null, new NullPointerException("something was null"));
        assertThat(mav, notNullValue());
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        assertThat(mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY), instanceOf(JsonCResponse.class));
        assertThat(response.getStatus(), is(HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
    }
    
    @Test
    public void testSavedExceptions() {
        request.addHeader("X-Requested-With", "XMLHttpRequest");
    
        // errors are wrapped in a wrapper exception, logged and recent errors returned if desired.
        assertThat(exceptionResolver.getRecentExceptions().size(), is(0));
        ModelAndView mav = exceptionResolver.resolveException(request, response, null, new NullPointerException("something was null"));
        assertThat(exceptionResolver.getRecentExceptions().size(), is(1));
        
        // can also fetch the error by request ID if desired
        Object id = mav.getModel().get("response");
        id = ((JsonCResponse) id).id;
    	gov.va.hmp.jsonc.JsonCResponse.Error error = exceptionResolver.getRecentException((String) id);
    	assertThat(error, notNullValue());
    	assertThat(error.pid, is("N/A"));
    	assertThat(error.user, is("N/A"));
    }
}
