package gov.va.hmp.web.servlet.resource;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockServletContext;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.Controller;

import javax.servlet.ServletException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.TimeZone;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class ResourceHttpRequestHandlerTests {

    private ResourceHttpRequestHandler handler;
    private HttpRequestHandler mockAlternateResourceHandler;
    private Resource mockResourceDirectory;
    private Resource mockResource;
    private long lastModified;

    @Before
    public void setUp() throws Exception {
        GregorianCalendar t = new GregorianCalendar(2012, Calendar.NOVEMBER, 20, 3, 47, 0);
        t.setTimeZone(TimeZone.getTimeZone("GMT"));
        lastModified = t.getTimeInMillis();

        mockResourceDirectory = mock(Resource.class);
        mockResource = mock(Resource.class);

        when(mockResource.getFilename()).thenReturn("foo.png");
        when(mockResource.getInputStream()).thenReturn(new ByteArrayInputStream("foo bar baz".getBytes()));
        when(mockResource.lastModified()).thenReturn(lastModified);
        when(mockResource.isReadable()).thenReturn(true);
        when(mockResource.exists()).thenReturn(true);

        when(mockResourceDirectory.getFilename()).thenReturn("/resources");
        when(mockResourceDirectory.createRelative("/foo.png")).thenReturn(mockResource);

        mockAlternateResourceHandler = mock(HttpRequestHandler.class);

        handler = new ResourceHttpRequestHandler();
        handler.setLocations(Collections.singletonList(mockResourceDirectory));
        handler.setServletContext(new MockServletContext());
        handler.setAlternateResourceHttpRequestHandler(mockAlternateResourceHandler);
        handler.afterPropertiesSet();
    }

    @Test
    public void testWriteLastModifiedHeader() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        request.setRequestURI("/app/resources/foo.png");
        request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/foo.png");
        MockHttpServletResponse response = new MockHttpServletResponse();

        handler.handleRequest(request, response);

        assertThat(response.getHeader("Last-Modified"), is("Tue, 20 Nov 2012 03:47:00 GMT"));
        verifyZeroInteractions(mockAlternateResourceHandler);
    }

    @Test
    public void testRequestDelegatesToAlternateRequestHandlerIfResourceNotFound() throws Exception {
        Resource nonExistantResource = mock(Resource.class);
        when(nonExistantResource.exists()).thenReturn(false);
        when(mockResourceDirectory.createRelative("/bar.png")).thenReturn(nonExistantResource);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        request.setRequestURI("/app/resources/bar.png");
        request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/bar.png");
        MockHttpServletResponse response = new MockHttpServletResponse();

        handler.handleRequest(request, response);

        verify(mockAlternateResourceHandler).handleRequest(request, response);
    }
}
