package gov.va.hmp.vista.springframework.security.userdetails.rpc;

import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.broker.protocol.BadCredentialsException;
import gov.va.hmp.vista.rpc.broker.protocol.LockedException;
import gov.va.hmp.vista.rpc.broker.protocol.VerifyCodeExpiredException;
import gov.va.hmp.vista.rpc.conn.ConnectionUserDetails;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.security.authentication.CredentialsExpiredException;

import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class TestRpcTemplateUserDetailService {

    public static final String MOCK_REMOTE_ADDRESS = "123.45.67.89";
    public static final String MOCK_REMOTE_HOSTNAME = "www.example.org";

    public static final String MOCK_VISTA_ID = "9F2B";

    public static final String MOCK_DIVISION = "960";
    public static final String MOCK_ACCESS_CODE = "10vehu";
    public static final String MOCK_VERIFY_CODE = "vehu10";

    public static final String MOCK_APP_HANDLE = "1A2B3C4D5E6F";

    private RpcOperations mockRpcTemplate;
    private RpcTemplateUserDetailService s;

    @Before
    public void setUp() {
        mockRpcTemplate = mock(RpcOperations.class);

        s = new RpcTemplateUserDetailService();
        s.setRpcTemplate(mockRpcTemplate);
    }

    @Test
    public void testBadCredentials() {
        when(mockRpcTemplate.execute(any(ConnectionCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)))).thenThrow(new PermissionDeniedDataAccessException("", new BadCredentialsException()));

        try {
            s.login(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, null, null, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME);
            fail("expected a Spring Security BadCredentialsException");
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // NOOP
        }

        verify(mockRpcTemplate).execute(any(ConnectionCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)));
    }

    @Test
    public void testVerifyCodeExpired() {
        when(mockRpcTemplate.execute(any(ConnectionCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)))).thenThrow(new PermissionDeniedDataAccessException("",new VerifyCodeExpiredException()));

        try {
            s.login(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, null, null, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME);
            fail("expected a Spring Security BadCredentialsException");
        } catch (CredentialsExpiredException e) {
            // NOOP
        }

        verify(mockRpcTemplate).execute(any(ConnectionCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)));
    }

    @Test
    public void testLoginWithAppHandleWithNoDivision() {
        ConnectionUserDetails mockUserDetails = mock(ConnectionUserDetails.class);
        RpcTemplateUserDetailService.ConnectionInfo info = new RpcTemplateUserDetailService.ConnectionInfo(new RpcHost("example.org", 9060), mockUserDetails);
        when(mockRpcTemplate.execute(any(RpcTemplateUserDetailService.ConnectionInfoCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, null, MOCK_APP_HANDLE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)))).thenReturn(info);

        s.login(MOCK_VISTA_ID, null, MOCK_APP_HANDLE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME);

        verify(mockRpcTemplate).execute(any(RpcTemplateUserDetailService.ConnectionInfoCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, null, MOCK_APP_HANDLE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)));
    }

    @Test
    public void testLocked() {
        when(mockRpcTemplate.execute(any(ConnectionCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)))).thenThrow(new PermissionDeniedDataAccessException("", new LockedException("sfdsfwesdfsdf")));

        try {
            s.login(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, null, null, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME);
            fail("expected a Spring Security BadCredentialsException");
        } catch (org.springframework.security.authentication.LockedException e) {
            // NOOP
        }

        verify(mockRpcTemplate).execute(any(ConnectionCallback.class), eq("vrpcb://" + RpcUriUtils.toAuthority(MOCK_VISTA_ID, MOCK_DIVISION, MOCK_ACCESS_CODE, MOCK_VERIFY_CODE, MOCK_REMOTE_ADDRESS, MOCK_REMOTE_HOSTNAME)));
    }
}
