package gov.va.hmp.web.velocity.tools;

import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;

public class EscapeToolTests {

    private EscapeTool escape = new EscapeTool();

    @Test
    public void testJqId() throws Exception {
       Assert.assertThat(escape.jqId("urn:va:foo:bar"), is("urn-va-foo-bar"));
    }
}
