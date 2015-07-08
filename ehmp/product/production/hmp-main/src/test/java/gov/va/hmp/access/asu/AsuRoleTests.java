package gov.va.hmp.access.asu;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class AsuRoleTests {
    @Test
    public void testForName() throws Exception {
         assertThat(AsuRole.forName("AUTHOR/DICTATOR"), is(AsuRole.AUTHOR_DICTATOR));
        assertThat(AsuRole.forName("EXPECTED COSIGNER"), is(AsuRole.EXPECTED_COSIGNER));
        assertThat(AsuRole.forName("Expected Cosigner"), is(AsuRole.EXPECTED_COSIGNER));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testForNameWithUnrecognizedName() throws Exception {
        AsuRole.forName("FOO BAR");
    }

    @Test
    public void testForAbbreviation() throws Exception {
        assertThat(AsuRole.forAbbreviation("X"), is(AsuRole.ADDITIONAL_SIGNER));
        assertThat(AsuRole.forAbbreviation("TR"), is(AsuRole.TRANSCRIBER));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testForAbbreviationWithUnrecognizedAbbreviation() throws Exception {
        AsuRole.forAbbreviation("FO");
    }
}
