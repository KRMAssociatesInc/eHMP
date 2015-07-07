package gov.va.hmp.vista.springframework.security.userdetails.rpc;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;

public class TestSecurityContextHostResolverAndCredentialsProvider {

    private RpcHost host;
    private static final String VISTA_ID = "3AF2";
    private static final String STATION_NUMBER = "960";
    private static final String ACCESS_CODE = "foo";
    private static final String VERIFY_CODE = "bar";

    @Before
    public void setUp() {
        host = new RpcHost("example.org", 1234);

        SecurityContextHolder.getContext().setAuthentication(new VistaAuthenticationToken(new VistaUser(host, VISTA_ID, STATION_NUMBER, STATION_NUMBER, "56789", STATION_NUMBER + ":" + ACCESS_CODE + ";" + VERIFY_CODE, "FOOBAR", true, true, true, true, Collections.<GrantedAuthority>emptySet()), STATION_NUMBER + ":" + ACCESS_CODE + ";" + VERIFY_CODE, "127.0.0.1", null, Collections.<GrantedAuthority>emptySet()));
    }

    @After
    public void tearDown() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @Test
    public void testHostResolver() {
        SecurityContextHostResolverAndCredentialsProvider it = new SecurityContextHostResolverAndCredentialsProvider();

        assertSame(host, it.resolve(null));
        assertSame(host, it.resolve(VISTA_ID));
    }

    @Test
    public void testCredentialsProvider() {
        SecurityContextHostResolverAndCredentialsProvider it = new SecurityContextHostResolverAndCredentialsProvider();

        assertEquals(RpcUriUtils.toCredentials(STATION_NUMBER, ACCESS_CODE, VERIFY_CODE, null, null), it.getCredentials(host, null).toString());
    }
}
