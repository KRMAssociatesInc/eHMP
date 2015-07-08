package gov.va.hmp.vista.springframework.security.authentication;

import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import org.junit.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collections;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VistaAuthenticationTokenTest {

    @Test
    public void testConstruct() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", "10VEHU", "VEHU10", "127.0.0.1", "www.example.org");
        assertNull(token.getDuz());
        assertEquals("9F2B", token.getVistaId());
        assertEquals("891", token.getDivision());
        assertEquals("10VEHU", token.getAccessCode());
        assertEquals("VEHU10", token.getVerifyCode());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());

        assertEquals(VistaAuthenticationToken.UNAUTHENTICATED + "@9F2B;891", token.getPrincipal());
        assertEquals("10VEHU;VEHU10", token.getCredentials());
        assertEquals("www.example.org(127.0.0.1)", token.getDetails());
        assertFalse(token.isAuthenticated());
    }

    @Test
    public void testAuthenticatedConstruct() {
        VistaUserDetails user = mock(VistaUserDetails.class);
        when(user.getVistaId()).thenReturn("9F2B");
        when(user.getDivision()).thenReturn("891");
        when(user.getDUZ()).thenReturn("101284");

        VistaAuthenticationToken token = new VistaAuthenticationToken(user, "891:10VEHU;VEHU10", "127.0.0.1", "localhost", Collections.<GrantedAuthority>emptyList());
        assertEquals(user.getVistaId(), token.getVistaId());
        assertEquals(user.getDUZ(), token.getDuz());
        assertEquals(user.getDivision(), token.getDivision());
        assertEquals("10VEHU", token.getAccessCode());
        assertEquals("VEHU10", token.getVerifyCode());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("localhost", token.getRemoteHostName());

        assertSame(user, token.getPrincipal());
        assertEquals("891:10VEHU;VEHU10", token.getCredentials());
        assertEquals("localhost(127.0.0.1)", token.getDetails());
        assertTrue(token.isAuthenticated());
    }

    @Test
    public void testConstructWithMissingAccessCode() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", null, "VEHU10", "127.0.0.1", "www.example.org");
        assertNull(token.getCredentials());
        assertEquals("VEHU10", token.getVerifyCode());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());

        token = new VistaAuthenticationToken("9F2B", "891", "", "VEHU10", "127.0.0.1", "www.example.org");
        assertNull(token.getCredentials());
        assertEquals("VEHU10", token.getVerifyCode());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());
    }

    @Test
    public void testConstructWithMissingVerifyCode() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", "10VEHU", null, "127.0.0.1", "www.example.org");
        assertNull(token.getCredentials());
        assertEquals("10VEHU", token.getAccessCode());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());

        token = new VistaAuthenticationToken("9F2B", "891", "10VEHU", "", "127.0.0.1", "www.example.org");
        assertNull(token.getCredentials());
        assertEquals("10VEHU", token.getAccessCode());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());
    }

    @Test
    public void testConstructWithMissingRemoteAddress() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", "10VEHU", "VEHU10", null, "www.example.org");
        assertNull(token.getCredentials());
        assertEquals("10VEHU", token.getAccessCode());
        assertEquals("VEHU10", token.getVerifyCode());
        assertNull(token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());

        token = new VistaAuthenticationToken("9F2B", "891", "10VEHU", "VEHU10", "", "www.example.org");
        assertNull(token.getCredentials());
        assertEquals("10VEHU", token.getAccessCode());
        assertEquals("VEHU10", token.getVerifyCode());
        assertNull(token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());
    }

    @Test
    public void testConstructWithMissingCredentials() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", null, null, null, null);
        assertNull(token.getCredentials());
        assertNull(token.getAccessCode());
        assertNull(token.getVerifyCode());
        assertNull(token.getRemoteAddress());
        assertNull(token.getRemoteHostName());
        token = new VistaAuthenticationToken("9F2B", "891", "", "", "", "");
        assertNull(token.getCredentials());
        assertNull(token.getAccessCode());
        assertNull(token.getVerifyCode());
        assertNull(token.getRemoteAddress());
        assertNull(token.getRemoteHostName());
    }

    @Test
    public void testConstructWithAppHandle() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", "1A2B3C4D5E6F", "127.0.0.1", "www.example.org");
        assertNull(token.getDuz());
        assertNull(token.getAccessCode());
        assertNull(token.getVerifyCode());
        assertEquals("1A2B3C4D5E6F", token.getAppHandle());
        assertEquals("127.0.0.1", token.getRemoteAddress());
        assertEquals("www.example.org", token.getRemoteHostName());

        assertEquals(VistaAuthenticationToken.UNAUTHENTICATED + "@9F2B;891", token.getPrincipal());
        assertEquals("1A2B3C4D5E6F", token.getCredentials());
        assertEquals("www.example.org(127.0.0.1)", token.getDetails());
        assertFalse(token.isAuthenticated());
    }

    @Test
    public void testSetDetailsIsNoop() {
        VistaAuthenticationToken token = new VistaAuthenticationToken("9F2B", "891", "10VEHU", "VEHU10", "127.0.0.1", "www.example.org");
        assertEquals("www.example.org(127.0.0.1)", token.getDetails());
        token.setDetails("foo(bar)");
        assertEquals("www.example.org(127.0.0.1)", token.getDetails());
    }
}
