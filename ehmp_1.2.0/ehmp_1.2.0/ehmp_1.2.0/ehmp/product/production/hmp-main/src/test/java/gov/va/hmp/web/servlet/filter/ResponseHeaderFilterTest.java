package gov.va.hmp.web.servlet.filter;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockFilterConfig;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import java.io.IOException;

public class ResponseHeaderFilterTest {
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private MockFilterChain filterChain;

    @Before
    public void setUp() throws Exception {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        filterChain = new MockFilterChain();
    }

    @Test
    public void testInitDestroy() throws ServletException {
        FilterConfig filterConfig = new MockFilterConfig();
        ResponseHeaderFilter f = new ResponseHeaderFilter();

        f.init(filterConfig);
        Assert.assertSame(filterConfig, f.filterConfig);

        f.destroy();
        Assert.assertNull(f.filterConfig);
    }

    @Test
    public void testFilter() throws IOException, ServletException {
        ResponseHeaderFilter f = new ResponseHeaderFilter();

        MockFilterConfig config = new MockFilterConfig();
        config.addInitParameter("Foo", "Bar");
        f.init(config);

        f.doFilter(request, response, filterChain);

        Assert.assertEquals("Bar", response.getHeader("Foo"));

        Assert.assertSame(request, filterChain.getRequest());
        Assert.assertSame(response, filterChain.getResponse());
    }
}
