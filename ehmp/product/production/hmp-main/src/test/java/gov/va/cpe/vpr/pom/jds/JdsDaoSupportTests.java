package gov.va.cpe.vpr.pom.jds;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class JdsDaoSupportTests {
    @Test
    public void testQuoteAndWildcardQuery() throws Exception {
        assertThat(JdsDaoSupport.quoteAndWildcardQuery("foo"), is("\"foo\"*"));
    }
}
