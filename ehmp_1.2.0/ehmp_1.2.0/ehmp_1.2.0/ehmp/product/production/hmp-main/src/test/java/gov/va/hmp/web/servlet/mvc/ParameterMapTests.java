package gov.va.hmp.web.servlet.mvc;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;

import java.nio.charset.Charset;
import java.util.List;

import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;

public class ParameterMapTests {

    @Test
    public void testRequestParams() throws Exception {
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.addParameter("foo", "bar");
        mockRequest.addParameter("baz", "spaz");
        mockRequest.addParameter("flintstones", new String[]{"fred", "wilma", "barney", "betty"});

        ParameterMap params = new ParameterMap(mockRequest);
        assertThat((String) params.get("foo"), is("bar"));
        assertThat((String) params.get("baz"), is("spaz"));
        assertThat((List<String>) params.get("flintstones"), hasItems("fred", "wilma", "barney", "betty"));
    }

    @Test
    public void testMultipartRequest() throws Exception {
        MockMultipartFile mockMultipartFile = new MockMultipartFile("schnobb.txt", "wobb".getBytes(Charset.forName("UTF-8")));

        MockMultipartHttpServletRequest mockRequest = new MockMultipartHttpServletRequest();
        mockRequest.addFile(mockMultipartFile);

        ParameterMap params = new ParameterMap(mockRequest);
        assertThat((MockMultipartFile) params.get("schnobb.txt"), sameInstance(mockMultipartFile));
    }
}
