package gov.va.hmp.web.servlet.filter;

import gov.va.hmp.web.servlet.filter.BuildTimeLastModifiedResponseHeaderFilter;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.springframework.context.NoSuchMessageException;
import org.springframework.core.env.Environment;
import org.springframework.mock.web.*;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import static gov.va.hmp.web.servlet.filter.BuildTimeLastModifiedResponseHeaderFilter.*;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BuildTimeLastModifiedResponseHeaderFilterTest {
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private MockFilterChain filterChain;
    private MockServletContext servletContext;
    private WebApplicationContext appContext;
    private BuildTimeLastModifiedResponseHeaderFilter f;
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        mockEnvironment = mock(Environment.class);

        appContext = mock(WebApplicationContext.class);
        when(appContext.getMessage(anyString(), Matchers.<Object[]>any(), any(Locale.class))).thenThrow(new NoSuchMessageException(DEFAULT_BUILDTIME_DATE_FORMAT_KEY));
        when(appContext.getEnvironment()).thenReturn(mockEnvironment);

        servletContext = new MockServletContext();
        servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, appContext);
        request = new MockHttpServletRequest(servletContext);
        response = new MockHttpServletResponse();
        filterChain = new MockFilterChain();

        f = new BuildTimeLastModifiedResponseHeaderFilter();
    }

    @Test
    public void testInitWithDefaultsAndDestroy() throws ServletException {
        FilterConfig filterConfig = new MockFilterConfig(servletContext);
        f.init(filterConfig);
        assertSame(filterConfig, f.getFilterConfig());

        assertEquals(DEFAULT_BUILDTIME_DATE_FORMAT_KEY, f.getBuildTimeDateFormatKey());
        assertEquals(DEFAULT_BUILDTIME_KEY, f.getBuildTimePropertyKey());
        assertEquals(DEFAULT_VERSION_PROPERTY_KEY, f.getVersionPropertyKey());

        assertEquals(DEFAULT_BUILDTIME_DATE_FORMAT, f.getBuildTimeDateFormat());

        f.destroy();
    }

    @Test
    public void testInitParameters() throws ServletException {
        MockFilterConfig filterConfig = new MockFilterConfig(servletContext);
        filterConfig.addInitParameter("buildTimeDateFormatKey", "baz");
        filterConfig.addInitParameter("buildTimePropertyKey", "foo");
        filterConfig.addInitParameter("versionPropertyKey", "bar");

        f.init(filterConfig);
        assertSame(filterConfig, f.getFilterConfig());

        assertEquals("baz", f.getBuildTimeDateFormatKey());
        assertEquals("foo", f.getBuildTimePropertyKey());
        assertEquals("bar", f.getVersionPropertyKey());

        assertEquals(DEFAULT_BUILDTIME_DATE_FORMAT, f.getBuildTimeDateFormat());
    }

    @Test
    public void testLastModifiedAndExpiresHeadersForSnapshotVersion() throws IOException, ServletException {
        when(mockEnvironment.getProperty("dummyBuildTimePropertyKey")).thenReturn("2009-07-27 14:45:28 -0600");
        when(mockEnvironment.getProperty("dummyVersionPropertyKey")).thenReturn("bar-0.1-SNAPSHOT");

        MockFilterConfig config = new MockFilterConfig(servletContext);
        config.addInitParameter("buildTimePropertyKey", "dummyBuildTimePropertyKey"); // set up to match the message keys
        config.addInitParameter("versionPropertyKey", "dummyVersionPropertyKey");
        f.init(config);

        assertThat(f.getBuildTimeDateFormat(), is(DEFAULT_BUILDTIME_DATE_FORMAT));

        f.doFilter(request, response, filterChain);

        assertThat(response.getHeader("Last-Modified"), equalTo("1248727528000"));
        assertThat(response.getHeader("Expires"), equalTo("0"));
    }

    @Test
    public void testLastModifiedAndExpiresHeadersForVersionThatIsNotSnapshot() throws IOException, ServletException {
        when(mockEnvironment.getProperty("dummyBuildTimePropertyKey")).thenReturn("2009-07-27 14:45:28 -0600");
        when(mockEnvironment.getProperty("dummyVersionPropertyKey")).thenReturn("bar-1.1");

        MockFilterConfig config = new MockFilterConfig(servletContext);
        config.addInitParameter("buildTimePropertyKey", "dummyBuildTimePropertyKey"); // set up to match the message keys
        config.addInitParameter("versionPropertyKey", "dummyVersionPropertyKey");
        f.init(config);

        f.doFilter(request, response, filterChain);

        assertThat(response.getHeader("Last-Modified"), equalTo("1248727528000"));
        assertThat(response.getHeader("Expires"), equalTo(new Long(1248727528000L + 1000L * 60L * 60L * 24L * 365L).toString()));
    }
}