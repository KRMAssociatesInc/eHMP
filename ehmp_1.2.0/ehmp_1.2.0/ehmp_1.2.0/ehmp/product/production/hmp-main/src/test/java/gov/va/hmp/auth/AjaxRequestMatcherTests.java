package gov.va.hmp.auth;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class AjaxRequestMatcherTests {
    @Test
    public void testMatches() throws Exception {
        AjaxRequestMatcher m = new AjaxRequestMatcher();

        MockHttpServletRequest request = new MockHttpServletRequest();
        assertThat(m.matches(request), equalTo(false));

        request.addHeader("X-Requested-With", "XMLHttpRequest");
        assertThat(m.matches(request), equalTo(true));

        request.addHeader("x-requested-with", "XMLHttpRequest"); // IE sends lower case header
        assertThat(m.matches(request), equalTo(true));
    }
}
