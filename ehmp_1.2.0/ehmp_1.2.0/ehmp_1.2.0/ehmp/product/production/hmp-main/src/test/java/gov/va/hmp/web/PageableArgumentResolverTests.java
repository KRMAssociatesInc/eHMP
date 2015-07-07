package gov.va.hmp.web;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.context.request.ServletWebRequest;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PageableArgumentResolverTests {

    private MockHttpServletRequest mockRequest = new MockHttpServletRequest();
    private PageableArgumentResolver r = new PageableArgumentResolver();
    private MethodParameter mockControllerMethodParameter;

    @Before
    public void setUp() throws Exception {
        mockControllerMethodParameter = new MethodParameter(this.getClass().getMethod("mockControllerMethod", String.class, Pageable.class), 1);
    }

    // this here to create mock MetodParameter in @Tests
    public void mockControllerMethod(@PathVariable String id, Pageable pageable) {
        // NOOP
    }

    @Test
    public void testResolveGrailsPagingParams() throws NoSuchMethodException {
        mockRequest.setParameter("offset", "80");
        mockRequest.setParameter("max", "20");

        Pageable pageable = (Pageable) r.resolveArgument(mockControllerMethodParameter, new ServletWebRequest(mockRequest));

        assertThat(pageable.getPageNumber(), equalTo(4));
        assertThat(pageable.getPageSize(), equalTo(20));
    }

    @Test
    public void testResolveJSONCPagingParams() throws NoSuchMethodException {
        mockRequest.setParameter("startIndex", "100");
        mockRequest.setParameter("count", "50");

        Pageable pageable = (Pageable) r.resolveArgument(mockControllerMethodParameter, new ServletWebRequest(mockRequest));

        assertThat(pageable.getPageNumber(), equalTo(2));
        assertThat(pageable.getPageSize(), equalTo(50));
    }

    @Test
    public void testResolveExtJSPagingParams() throws NoSuchMethodException {
        mockRequest.setParameter("start", "180");
        mockRequest.setParameter("limit", "60");

        Pageable pageable = (Pageable) r.resolveArgument(mockControllerMethodParameter, new ServletWebRequest(mockRequest));

        assertThat(pageable.getPageNumber(), equalTo(3));
        assertThat(pageable.getPageSize(), equalTo(60));
    }

    @Test
    public void testResolveExtJSPagingParamsWithOneBasedPageNumber() throws NoSuchMethodException {
        mockRequest.setParameter("page", "1");
        mockRequest.setParameter("start", "0");
        mockRequest.setParameter("limit", "25");

        Pageable pageable = (Pageable) r.resolveArgument(mockControllerMethodParameter, new ServletWebRequest(mockRequest));

        assertThat(pageable.getPageNumber(), equalTo(0));
        assertThat(pageable.getPageSize(), equalTo(25));
    }

    @Test
    public void testSupportsParameter() {
        assertThat(r.supportsParameter(mockControllerMethodParameter), is(true));
    }
}
