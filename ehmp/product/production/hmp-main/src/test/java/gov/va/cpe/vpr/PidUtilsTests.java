package gov.va.cpe.vpr;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class PidUtilsTests {

    @Test
    public void testGetPidFromDfnAndVistaId() throws Exception {
        assertThat(PidUtils.getPid("ABCD", "56"), is("ABCD" + PidUtils.SEPARATOR + "56"));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testGetDfnFromPidThatIsIcnAndHasNoSeparator() throws Exception {
        assertThat(PidUtils.getDfn("1234"), is("1234"));
    }

    @Test
    public void testGetDfnFromPidThatIsQualifiedDfn() throws Exception {
        assertThat(PidUtils.getDfn("ABCD;56"), is("56"));
    }

    @Test
    public void testGetVistaIdFromPidThatIsQualifiedDfn() throws Exception {
        assertThat(PidUtils.getVistaId("ABCD;56"), is("ABCD"));
    }
}
