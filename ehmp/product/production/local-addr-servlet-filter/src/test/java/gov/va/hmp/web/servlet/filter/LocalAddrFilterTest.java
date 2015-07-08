package gov.va.hmp.web.servlet.filter;

import org.hamcrest.Matcher;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockFilterConfig;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class LocalAddrFilterTest {

    private LocalAddrFilter filter;

    private MockFilterConfig mockFilterConfig;
    private FilterChain mockFilterChain;
    private MockHttpServletRequest mockRequest;
    private MockHttpServletResponse mockResponse;

    @Before
    public void setUp() throws Exception {
        mockFilterConfig = new MockFilterConfig();
        mockFilterChain = new MockFilterChain();
        mockRequest = new MockHttpServletRequest();
        mockResponse = new MockHttpServletResponse();

        filter = new LocalAddrFilter();
        filter.init(mockFilterConfig);
    }

    @After
    public void tearDown() throws Exception {
        filter.destroy();
    }

    @Test
    public void testFilterRejectsRemoteAddressesThatAreNotLocal() throws IOException, ServletException {
        mockRequest.setRemoteAddr("74.125.227.84");
        filter.doFilter(mockRequest, mockResponse, mockFilterChain);
        assertThat(mockResponse.getStatus(), is(HttpServletResponse.SC_FORBIDDEN));
    }

    @Test
    public void testFilterAcceptsRemoteAddressesThatAreLocal() throws IOException, ServletException {
        mockRequest.setRemoteAddr(LocalAddrFilter.getLocalAddr());
        filter.doFilter(mockRequest, mockResponse, mockFilterChain);
        assertThat(mockResponse.getStatus(), is(HttpServletResponse.SC_OK));
    }
}
