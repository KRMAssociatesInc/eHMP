package gov.va.hmp.vista.springframework.security.authentication;

import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetailsService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.cache.NullUserCache;

import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class VistaAuthenticationProviderTest {

    private static final String TEST_REMOTE_ADDRESS = "192.168.0.1";
    private static final String TEST_REMOTE_HOSTNAME = "www.example.org";
    private static final String TEST_VISTA_ID = "9F2B";
    private static final String TEST_DIVISION = "663";
    private static final String TEST_ACCESS = "10VEHU";
    private static final String TEST_VERIFY = "VEHU10";
    private static final String TEST_DUZ = "12345";
    private static final String TEST_APP_HANDLE = "1A2B3C4D5E6F";

    private VistaUserDetails user;
    private VistaAuthenticationProviderTest.MockUserCache mockCache;

    private VistaUserDetailsService mockUserDetailService;
    private VistaAuthenticationProvider provider;

    @Before
    public void setUp() throws Exception {
        user = createUser(TEST_VISTA_ID, TEST_DIVISION, TEST_DUZ, TEST_REMOTE_HOSTNAME + "(" + TEST_REMOTE_ADDRESS + ")" + TEST_ACCESS + ";" + TEST_VERIFY, true, true, true, true, new SimpleGrantedAuthority("ROLE_ONE"), new SimpleGrantedAuthority("ROLE_TWO"));

        mockUserDetailService = mock(VistaUserDetailsService.class);

        provider = new VistaAuthenticationProvider();
        provider.setUserDetailsService(mockUserDetailService);
        mockCache = new MockUserCache();
        provider.setUserCache(mockCache);
        provider.afterPropertiesSet();
    }

    protected VistaUserDetails createUser(String vistaId, String division, String duz, String password, boolean nonExpired, boolean nonLocked, boolean credentialsNonExpired, boolean enabled, GrantedAuthority... authorities) {
        VistaUserDetails user = mock(VistaUserDetails.class);
        when(user.getVistaId()).thenReturn(vistaId);
        when(user.getDivision()).thenReturn(division);
        when(user.getDUZ()).thenReturn(duz);
        when(user.isAccountNonExpired()).thenReturn(nonExpired);
        when(user.isAccountNonLocked()).thenReturn(nonLocked);
        when(user.isCredentialsNonExpired()).thenReturn(credentialsNonExpired);
        when(user.isEnabled()).thenReturn(enabled);
        when(user.getUsername()).thenReturn(duz + "@" + vistaId + ";" + division);
        when(user.getPassword()).thenReturn(password);
        if (password != null) {
            String[] pieces = password.split("\\)");
            String[] credentialsPieces = pieces[1].split(";");
            if (credentialsPieces.length == 2) {
                String accessCode = credentialsPieces[0];
                String verifyCode = credentialsPieces[1];
                when(user.getCredentials()).thenReturn(division + ":" + accessCode + ";" + verifyCode);
            } else if (credentialsPieces.length == 1) {
                String appHandle = credentialsPieces[0];
                when(user.getCredentials()).thenReturn(division + ":" + appHandle);
            }
        }
        when(user.getAuthorities()).thenReturn((Collection) Arrays.asList(authorities));
        return user;
    }

    @Test
    public void testSupports() {
        VistaAuthenticationProvider provider = new VistaAuthenticationProvider();

        assertTrue(provider.supports(VistaAuthenticationToken.class));
        assertFalse(provider.supports(UsernamePasswordAuthenticationToken.class));
//        assertFalse(provider.supports(X509AuthenticationToken.class));
    }

    @Test
    public void testReceivedBadCredentialsWhenCredentialsNotProvided() {
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, null, null, null, null, null)).thenThrow(new BadCredentialsException("missing credentials"));

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, null, null, null);
        try {
            provider.authenticate(token);
            fail("Expected BadCredentialsException");
        } catch (BadCredentialsException expected) {
            // NOOP
        }

        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, null, null, null, null, null);
    }

    @Test
    public void testAuthenticateFailsIfAccountExpired() {
        user = createUser("54321.123456789", TEST_DIVISION, TEST_DUZ, null, false, true, true, true);
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        try {
            provider.authenticate(token);
            fail("Should have thrown AccountExpiredException");
        } catch (AccountExpiredException expected) {
            assertTrue(true);
        }
    }

    @Test
    public void testAuthenticateFailsIfAccountLocked() {
        user = createUser("54321.123456789", TEST_DIVISION, TEST_DUZ, null, true, false, true, true);
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        try {
            provider.authenticate(token);
            fail("Should have thrown LockedException");
        } catch (LockedException expected) {
            assertTrue(true);
        }
    }

    @Test
    public void testAuthenticateFailsIfCredentialsExpired() {
        user = createUser("54321.123456789", TEST_DIVISION, TEST_DUZ, null, true, true, false, true);
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
        try {
            provider.authenticate(token);
            fail("Expected CredentialsExpiredException");
        } catch (CredentialsExpiredException expected) {
            // NOOP
        }

        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
    }

    @Test
    public void testAuthenticateFailsIfUserDisabled() {
        user = createUser("54321.123456789", TEST_DIVISION, TEST_DUZ, null, true, true, true, false);
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        try {
            provider.authenticate(token);
            fail("Should have thrown DisabledException");
        } catch (DisabledException expected) {
            assertTrue(true);
        }
    }

    @Test
    public void testAuthenticateFailsWhenAuthenticationDaoHasBackendFailure() {
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenThrow(new DataRetrievalFailureException("This mock simulator is designed to fail"));

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
        try {
            provider.authenticate(token);
            fail("Should have thrown AuthenticationServiceException");
        } catch (AuthenticationServiceException expected) {
            assertTrue(true);
        }

        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
    }

    @Test
    public void testAuthenticates() {
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
        Authentication result = provider.authenticate(token);

        if (!(result instanceof VistaAuthenticationToken)) {
            fail("Should have returned instance of VistaAuthenticationToken");
        }
        assertNotSame(token, result);

        VistaAuthenticationToken castResult = (VistaAuthenticationToken) result;
        assertTrue(VistaUserDetails.class.isAssignableFrom(castResult.getPrincipal().getClass()));
        assertEquals(TEST_VISTA_ID, castResult.getVistaId());
        assertEquals(TEST_ACCESS, castResult.getAccessCode());
        assertEquals(TEST_VERIFY, castResult.getVerifyCode());
        assertEquals(TEST_REMOTE_ADDRESS, castResult.getRemoteAddress());
        assertEquals(TEST_REMOTE_HOSTNAME, castResult.getRemoteHostName());
        assertEquals("ROLE_ONE", new ArrayList<GrantedAuthority>(castResult.getAuthorities()).get(0).getAuthority());
        assertEquals("ROLE_TWO", new ArrayList<GrantedAuthority>(castResult.getAuthorities()).get(1).getAuthority());
        assertEquals(TEST_REMOTE_HOSTNAME + "(" + TEST_REMOTE_ADDRESS + ")", castResult.getDetails());

        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
    }

    @Test
    public void testAuthenticatesASecondTime() {
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        Authentication result = provider.authenticate(token);

        if (!(result instanceof VistaAuthenticationToken)) {
            fail("Should have returned instance of VistaAuthenticationToken");
        }

        // Now try to authenticate with the previous result (with its UserDetails)
        Authentication result2 = provider.authenticate(result);

        if (!(result2 instanceof VistaAuthenticationToken)) {
            fail("Should have returned instance of VistaAuthenticationToken");
        }

        assertNotSame(result, result2);
        assertEquals(result.getCredentials(), result2.getCredentials());
    }

    @Test
    public void testDetectsNullBeingReturnedFromAuthenticationDao() {
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(null);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        try {
            provider.authenticate(token);
            fail("Should have thrown AuthenticationServiceException");
        } catch (AuthenticationServiceException expected) {
            assertEquals("VistaUserDetailsService returned null, which is an interface contract violation; it should either return an authenticated VistaUserDetails instance or throw an AuthenticationException",
                    expected.getMessage());
        }
    }

    @Test
    public void testGoesBackToAuthenticationDaoToObtainLatestVerifyCodeIfCachedVerifyCodeSeemsIncorrect() {
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        // This will work, as password still "koala"
        provider.authenticate(token);

        // Check "12345@663 = www.example.org(192.168.0.1)10VEHU;VEHU10" ended up in the cache
        assertEquals(TEST_REMOTE_HOSTNAME + "(" + TEST_REMOTE_ADDRESS + ")" + TEST_ACCESS + ";" + TEST_VERIFY, mockCache.getUserFromCache(TEST_DUZ + "@" + TEST_VISTA_ID + ";" + TEST_DIVISION).getPassword());
        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, TEST_VERIFY, null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);

        // Now change the password the AuthenticationDao will return
        reset(mockUserDetailService);
        user = createUser(TEST_VISTA_ID, TEST_DIVISION, TEST_DUZ, TEST_REMOTE_HOSTNAME + "(" + TEST_REMOTE_ADDRESS + ")" + TEST_ACCESS + ";easternLongNeckTurtle", true, true, true, true, new SimpleGrantedAuthority("ROLE_ONE"), new SimpleGrantedAuthority("ROLE_TWO"));
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, "easternLongNeckTurtle", null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        // Now try authentication again, with the new password
        token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, "easternLongNeckTurtle", TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
        provider.authenticate(token);

        // To get this far, the new password was accepted
        // Check the cache was updated
        assertEquals("www.example.org(192.168.0.1)10VEHU;easternLongNeckTurtle", mockCache.getUserFromCache(TEST_DUZ + "@" + TEST_VISTA_ID + ";" + TEST_DIVISION).getPassword());
        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_ACCESS, "easternLongNeckTurtle", null, null, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
    }

    @Test
    public void testStartupFailsIfNoVistaUserDetailsService()
            throws Exception {
        VistaAuthenticationProvider provider = new VistaAuthenticationProvider();

        try {
            provider.afterPropertiesSet();
            fail("Should have thrown IllegalArgumentException");
        } catch (IllegalArgumentException expected) {
            assertTrue(true);
        }
    }

    @Test
    public void testStartupFailsIfNoUserCacheSet() throws Exception {
        VistaAuthenticationProvider provider = new VistaAuthenticationProvider();
        provider.setUserDetailsService(mockUserDetailService);
        assertEquals(NullUserCache.class, provider.getUserCache().getClass());
        provider.setUserCache(null);

        try {
            provider.afterPropertiesSet();
            fail("Should have thrown IllegalArgumentException");
        } catch (IllegalArgumentException expected) {
            assertTrue(true);
        }
    }

    @Test
    public void testStartupSuccess() throws Exception {
        VistaAuthenticationProvider provider = new VistaAuthenticationProvider();
        provider.setUserDetailsService(mockUserDetailService);
        provider.setUserCache(new MockUserCache());
        assertSame(mockUserDetailService, provider.getUserDetailsService());
        provider.afterPropertiesSet();
    }

    @Test
    public void testAuthenticatesWithAppHandle() {
        user = createUser(TEST_VISTA_ID, TEST_DIVISION, TEST_DUZ, TEST_REMOTE_HOSTNAME + "(" + TEST_REMOTE_ADDRESS + ")" + TEST_APP_HANDLE, true, true, true, true, new SimpleGrantedAuthority("ROLE_ONE"), new SimpleGrantedAuthority("ROLE_TWO"));
        when(mockUserDetailService.login(TEST_VISTA_ID, TEST_DIVISION, TEST_APP_HANDLE, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME)).thenReturn(user);

        VistaAuthenticationToken token = new VistaAuthenticationToken(TEST_VISTA_ID, TEST_DIVISION, TEST_APP_HANDLE, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
        Authentication result = provider.authenticate(token);

        if (!(result instanceof VistaAuthenticationToken)) {
            fail("Should have returned instance of VistaAuthenticationToken");
        }
        assertNotSame(token, result);

        VistaAuthenticationToken castResult = (VistaAuthenticationToken) result;
        assertTrue(VistaUserDetails.class.isAssignableFrom(castResult.getPrincipal().getClass()));
        assertEquals(TEST_VISTA_ID, castResult.getVistaId());
        assertNull(castResult.getAccessCode());
        assertNull(castResult.getVerifyCode());
        assertEquals(TEST_APP_HANDLE, castResult.getAppHandle());
        assertEquals(TEST_REMOTE_ADDRESS, castResult.getRemoteAddress());
        assertEquals(TEST_REMOTE_HOSTNAME, castResult.getRemoteHostName());
        assertEquals("ROLE_ONE", new ArrayList<GrantedAuthority>(castResult.getAuthorities()).get(0).getAuthority());
        assertEquals("ROLE_TWO", new ArrayList<GrantedAuthority>(castResult.getAuthorities()).get(1).getAuthority());
        assertEquals(TEST_REMOTE_HOSTNAME + "(" + TEST_REMOTE_ADDRESS + ")", castResult.getDetails());

        verify(mockUserDetailService).login(TEST_VISTA_ID, TEST_DIVISION, TEST_APP_HANDLE, TEST_REMOTE_ADDRESS, TEST_REMOTE_HOSTNAME);
    }

    private class MockUserCache implements UserCache {
        private Map cache = new HashMap();

        public UserDetails getUserFromCache(String username) {
            return (UserDetails) cache.get(username);
        }

        public void putUserInCache(UserDetails user) {
            cache.put(user.getUsername(), user);
        }

        public void removeUserFromCache(String username) {
        }
    }
}
