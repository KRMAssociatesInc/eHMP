package gov.va.hmp.web;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.web.PortResolver;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.security.web.savedrequest.SavedRequest;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

public class WebUtilsTests {

    private PortResolver mockPortResolver;

    @Before
    public void setUp() throws Exception {
        mockPortResolver = mock(PortResolver.class);
    }

    @Test
    public void testIsAjax() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();

        request.addHeader("X-Requested-With", "XMLHttpRequest");

        assertThat(WebUtils.isAjax(request), equalTo(true));

        request.addHeader("x-requested-with", "XMLHttpRequest"); // IE sends lower case header

        assertThat(WebUtils.isAjax(request), equalTo(true));
    }

    @Test
    public void testIsNotAjax() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        assertThat(WebUtils.isAjax(request), equalTo(false));
    }

    @Test
    public void testSavedRequestIsAjax() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Requested-With", "XMLHttpRequest");

        SavedRequest savedRequest = new DefaultSavedRequest(request, mockPortResolver);

        assertThat(WebUtils.isAjax(savedRequest), equalTo(true));

        request.addHeader("x-requested-with", "XMLHttpRequest"); // IE sends lower case header
        savedRequest = new DefaultSavedRequest(request, mockPortResolver);

        assertThat(WebUtils.isAjax(savedRequest), equalTo(true));
    }

    @Test
    public void testSavedRequestIsNotAjax() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        SavedRequest savedRequest = new DefaultSavedRequest(request, mockPortResolver);
        assertThat(WebUtils.isAjax(savedRequest), equalTo(false));
    }
    
    @Test
    public void testsantize() {
    	// does nothing
    	assertEquals("foo", WebUtils.sanitizeInput("foo"));
    	
    	// for now, newlines are ok (unless at the end of the line (trimmed)
    	assertEquals("a\nb", WebUtils.sanitizeInput("a\nb"));
    	assertEquals("a\rb", WebUtils.sanitizeInput("a\rb"));
    	assertEquals("", WebUtils.sanitizeInput("\n"));
    	assertEquals("", WebUtils.sanitizeInput("\r"));
    	
    	// strip html characters
    	assertEquals("div", WebUtils.sanitizeInput("<div>"));
    	
    	// &lt; &gt;
    	assertEquals("ltdivgt", WebUtils.sanitizeInput("&lt;div&gt;"));
    	
    	// also should trim
    	assertEquals("foo", WebUtils.sanitizeInput("  foo  "));
    	
    	// XSS attack 
    	assertEquals("img src=\"fake.jpg\" onerror=\"alert('attack')\"/", WebUtils.sanitizeInput("<img src=\"fake.jpg\" onerror=\"alert('attack')\"/>"));
    	
    	// unprintable characters
    	assertEquals("beepbeep", WebUtils.sanitizeInput("beep\007beep"));
    }
}
