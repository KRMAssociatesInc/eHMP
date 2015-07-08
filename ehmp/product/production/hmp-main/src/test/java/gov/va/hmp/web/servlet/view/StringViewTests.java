package gov.va.hmp.web.servlet.view;

import gov.va.hmp.web.servlet.view.StringView;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class StringViewTests {

    private MockHttpServletRequest mockRequest = new MockHttpServletRequest();
    private MockHttpServletResponse mockResponse = new MockHttpServletResponse();
    private StringView view = new StringView();

    @Test
    public void testPlainString() throws Exception {
        Map<String, String> model = new HashMap<String, String>();
        model.put(StringView.DEFAULT_MODEL_KEY, "Here is a plain text string.");

        view.render(model, mockRequest, mockResponse);

        assertThat(mockResponse.getContentType(), equalTo("text/plain"));
        assertThat(mockResponse.getContentAsString(), equalTo("Here is a plain text string."));
    }

    @Test
    public void testStringAndContentType() throws Exception {
        Map<String, String> model = new HashMap<String, String>();
        model.put(StringView.DEFAULT_MODEL_KEY, "{ data: \"Here is a string in some JSON.\"}");
        model.put(StringView.DEFAULT_CONTENT_TYPE_KEY, "application/json");

        view.render(model, mockRequest, mockResponse);

        assertThat(mockResponse.getContentType(), equalTo("application/json"));
        assertThat(mockResponse.getContentAsString(), equalTo("{ data: \"Here is a string in some JSON.\"}"));
    }
}
