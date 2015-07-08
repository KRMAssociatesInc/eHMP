package gov.va.hmp.auth;

import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSetHolder;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class HmpUserContextTests {

    private HmpUserContext userContext;
    private AuthenticationTrustResolver mockTrustResolver;
    private HmpUserDetails mockUser;
    private Authentication mockAuthentication;

    @Before
    public void setUp() throws Exception {
        mockTrustResolver = mock(AuthenticationTrustResolver.class);
        mockUser = mock(HmpUserDetails.class, Mockito.withSettings().extraInterfaces(HealthTimePrinterSetHolder.class));
        mockAuthentication = mock(Authentication.class);

        userContext = new HmpUserContext(mockTrustResolver);
    }

    private void setUpMockAuthentication() {
        SecurityContextHolder.getContext().setAuthentication(mockAuthentication);
        when(mockAuthentication.isAuthenticated()).thenReturn(true);
        when(mockAuthentication.getPrincipal()).thenReturn(mockUser);
        when(mockTrustResolver.isAnonymous(mockAuthentication)).thenReturn(false);
    }

    private void setUpMockAnonymousAuthentication() {
        SecurityContextHolder.getContext().setAuthentication(mockAuthentication);
        when(mockAuthentication.isAuthenticated()).thenReturn(true);
        when(mockAuthentication.getPrincipal()).thenReturn(mockUser);
        when(mockTrustResolver.isAnonymous(mockAuthentication)).thenReturn(true);
    }

    @After
    public void tearDown() throws Exception {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testIsLoggedIn() throws Exception {
        setUpMockAuthentication();

        assertThat(userContext.isLoggedIn(), is(true));
    }

    @Test
    public void testIsLoggedInWithNullSpringSecurityAuthentication() throws Exception {
        assertThat(userContext.isLoggedIn(), is(false));
    }

    @Test
    public void testIsLoggedInWithAnonymousAuthentication() throws Exception {
        setUpMockAnonymousAuthentication();

        assertThat(userContext.isLoggedIn(), is(false));
    }

    @Test
    public void testGetCurrentUser() throws Exception {
        setUpMockAuthentication();

        assertThat(userContext.getCurrentUser(), is(sameInstance(mockUser)));
    }

    @Test
    public void testGetCurrentUserWithAnonymousUser() throws Exception {
        setUpMockAnonymousAuthentication();

        assertThat(userContext.getCurrentUser(), is(nullValue()));
    }

    @Test
    public void testGetHealthTimePrinterSet() throws Exception {
        setUpMockAuthentication();

        HealthTimePrinterSet mockPrinterSet = mock(HealthTimePrinterSet.class);
        when(((HealthTimePrinterSetHolder) mockUser).getHealthTimePrinterSet()).thenReturn(mockPrinterSet);

        assertThat(userContext.getHealthTimePrinterSet(), is(sameInstance(mockPrinterSet)));
    }

    @Test
    public void testSetHealthTimePrinterSet() throws Exception {
        setUpMockAuthentication();

        HealthTimePrinterSet mockPrinterSet = mock(HealthTimePrinterSet.class);

        userContext.setHealthTimePrinterSet(mockPrinterSet);

        verify((HealthTimePrinterSetHolder) mockUser).setHealthTimePrinterSet(mockPrinterSet);
    }
}
