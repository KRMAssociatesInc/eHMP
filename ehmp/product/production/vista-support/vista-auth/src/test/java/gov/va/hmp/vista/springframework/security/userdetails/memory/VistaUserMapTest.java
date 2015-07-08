package gov.va.hmp.vista.springframework.security.userdetails.memory;

import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VistaUserMapTest {

    @Test
    public void testConstruct() {
        VistaUserMap userMap = new VistaUserMap();
        assertEquals(0, userMap.getUserCount());
    }

    @Test
    public void testAddUser() {
        VistaUserMap userMap = new VistaUserMap();
        VistaUserDetails u = createUser("12345", "9F2B", "982", "FOO", "BAR");
        userMap.addUser(u);
        assertEquals(1, userMap.getUserCount());
        assertSame(u, userMap.getUser("9F2B", "982", "FOO", "BAR"));
    }

    private VistaUserDetails createUser(String duz, String vistaId, String division, String access, String verify) {
        VistaUserDetails user = mock(VistaUserDetails.class);
        when(user.getDUZ()).thenReturn(duz);
        when(user.getVistaId()).thenReturn(vistaId);
        when(user.getDivision()).thenReturn(division);
        when(user.getPassword()).thenReturn(access + ";" + verify);
        return user;
    }
}
