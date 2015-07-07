package gov.va.cpe.vpr.web;

import gov.va.cpe.param.IParamService;

import org.apache.commons.lang.StringEscapeUtils;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class ParamControllerTests {

    private ParamController controller;
    private IParamService mockParamService;

    @Before
    public void setUp() throws Exception {
        mockParamService = mock(IParamService.class);

        controller = new ParamController();
        controller.setParamService(mockParamService);
    }

    @Test
    public void testGetWithNoKey() throws Exception {
        when(mockParamService.getUserParam("FOO BAR", "23")).thenReturn("baz");

        String responseBody = controller.get("FOO BAR", "23", null, null);

        assertThat(responseBody, is("baz"));
    }

    @Test
    public void testGetNoWithKeyAndDefault() throws Exception {
        when(mockParamService.getUserParam("FOO BAR", "23")).thenReturn(null);

        String responseBody = controller.get("FOO BAR", "23", null, "spaz");

        assertThat(responseBody, is("spaz"));
    }

    @Test
    public void testGetWithKey() throws Exception {
        when(mockParamService.getUserParamVal("FOO BAR", "fred", "23")).thenReturn("baz");

        String responseBody = controller.get("FOO BAR", "23", "fred", null);

        assertThat(responseBody, is("baz"));
    }

    @Test
    public void testGetWithKeyAndDefault() throws Exception {
        when(mockParamService.getUserParamVal("FOO BAR", "fred", "23")).thenReturn(null);

        String responseBody = controller.get("FOO BAR", "23", "fred", "spaz");

        assertThat(responseBody, is("spaz"));
    }

    @Test
    public void testSet() throws Exception {
        Map params = new HashMap();
        params.put("fred", "wilma");
        params.put("betty", "barney");

        String viewName = controller.set("FOO BAR", "23", params);

        assertThat(viewName, is("redirect:/param/get/FOO BAR"));
        verify(mockParamService).setUserParamVals("FOO BAR", "23", params);
    }

    @Test
    public void testReplace() throws Exception {
        Map params = new HashMap();
        params.put("fred", "wilma");
        params.put("betty", "barney");

        String viewName = controller.replace("FOO BAR", "23", params);

        assertThat(viewName, is("redirect:/param/get/FOO BAR"));
        verify(mockParamService).clearUserParam("FOO BAR", "23");
        verify(mockParamService).setUserParamVals("FOO BAR", "23", params);
    }

    @Test
    public void testPut() throws Exception {
        Map params = new HashMap();
        params.put("fred", "wilma");
        params.put("betty", "barney");

        String viewName = controller.put("FOO BAR", "23", params);

        assertThat(viewName, is("redirect:/param/get/FOO BAR"));
        verify(mockParamService).setUserParamVals("FOO BAR", "23", params);
    }

    @Test
    public void testList() throws Exception {
        when(mockParamService.getUserParamInstanceIDs("FOO BAR")).thenReturn(Arrays.asList("23", "42", "56"));

        String responseBody = controller.list("FOO BAR");

        assertThat(responseBody, is("[23, 42, 56]"));
        verify(mockParamService).getUserParamInstanceIDs("FOO BAR");
    }

    @Test
    public void testDelete() throws Exception {
        String responseBody = controller.delete("FOO BAR", "23");

        assertThat(responseBody, is(""));
        verify(mockParamService).clearUserParam("FOO BAR", "23");
    }
    
    /** Attempts to store HTML tags should be escaped */
    @Test
    public void testEscapingOfHTML() {
    	String bad = "<script>alert(1)</script>";
    	String resp = controller.get("FOO", "BAR", "BAZ", bad);
    	
    	// as a defaultValue
    	assertThat(resp, is(StringEscapeUtils.escapeHtml(bad)));
    	
    	// as a stored value
    	when(mockParamService.getUserParamVal("HACKER", "payload", "43")).thenReturn(bad);
    	when(mockParamService.getUserParam("HACKER", "43")).thenReturn(bad);
    	resp = controller.get("HACKER", "43", null, null);
    	assertThat(resp, is(StringEscapeUtils.escapeHtml(bad)));
    	resp = controller.get("HACKER", "43", "payload", null);
    	assertThat(resp, is(StringEscapeUtils.escapeHtml(bad)));
    }
}
