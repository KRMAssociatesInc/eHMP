package gov.va.hmp.jsonc;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.util.WebUtils;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class JsonCResponseTests {

    @Test
    public void testSetError() throws Exception {
        RuntimeException ex = new RuntimeException("bar");
        JsonCResponse jsonc = new JsonCResponse();
        jsonc.setError("foo", ex);
        JsonCAssert.assertExceptionError(jsonc, "foo", ex);
    }

    @Test
    public void testSetErrorWithNestedException() throws Exception {
        RuntimeException ex = new RuntimeException("bar", new RuntimeException("baz"));
        JsonCResponse jsonc = new JsonCResponse();
        jsonc.setError("foo", ex);
        JsonCAssert.assertExceptionError(jsonc, "foo", ex);
    }


    @Test
    public void testCreateError() throws Exception {
        RuntimeException ex = new RuntimeException("bar");
        JsonCError jsonc = JsonCResponse.createError("foo", ex);
        JsonCAssert.assertExceptionError(jsonc, "foo", ex);
    }

    @Test
    public void testCreateFromHttpServletRequest() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setMethod("GET");
        mockRequest.setRequestURI("/foo/bar/baz");
        mockRequest.setParameter("foo", "fred");
        mockRequest.setParameter("bar", "barney");
        mockRequest.setParameter("baz", "betty");

        JsonCResponse jsonc = JsonCResponse.create(mockRequest);

        assertThat(jsonc.method, is("GET /foo/bar/baz"));
        assertThat(jsonc.params.get("foo").toString(), is("fred"));
        assertThat(jsonc.params.get("bar").toString(), is("barney"));
        assertThat(jsonc.params.get("baz").toString(), is("betty"));
    }

    @Test
    public void testCreateFromHttpServletRequestWithError() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setAttribute(WebUtils.ERROR_MESSAGE_ATTRIBUTE, "foo");

        JsonCResponse jsonc = JsonCResponse.create(mockRequest);

        assertThat(jsonc.getSuccess(), is(false));
        assertThat(jsonc.error.code, is("500"));
        assertThat(jsonc.error.message, is("foo"));
    }
}
