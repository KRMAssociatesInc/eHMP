package gov.va.cpe.vpr.sync.vista;

import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class VprUpdateTests {
    @Test
    public void testConstruct() throws Exception {
        VprUpdate update = new VprUpdate("A1B2", "bar");

        assertThat(update.getSystemId(), is("A1B2"));
        assertThat(update.getTimestamp(), is("bar"));
        assertThat(update.getUid(), is("urn:va:vprupdate:A1B2"));
    }
}
