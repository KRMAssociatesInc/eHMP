package gov.va.hmp.auth;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class VistaUserClassAuthorityTests {
    @Test
    public void testConstruct() throws Exception {
        VistaUserClassAuthority userClass = new VistaUserClassAuthority("urn:va:asu-class:ABCD:23", "CLINICAL COORDINATOR");

        assertThat(userClass.getUid(), equalTo("urn:va:asu-class:ABCD:23"));
        assertThat(userClass.getUserClass(), equalTo("CLINICAL COORDINATOR"));
        assertThat(userClass.getAuthority(), equalTo(VistaUserClassAuthority.VISTA_USER_CLASS_PREFIX + "CLINICAL_COORDINATOR"));
    }
}
