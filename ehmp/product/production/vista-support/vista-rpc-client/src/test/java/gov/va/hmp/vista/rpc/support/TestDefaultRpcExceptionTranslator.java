package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.*;
import gov.va.hmp.vista.rpc.broker.protocol.*;
import gov.va.hmp.vista.rpc.pool.TimeoutWaitingForIdleConnectionException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.*;

public class TestDefaultRpcExceptionTranslator {

    private RpcExceptionTranslator translator;

    @Before
    public void setUp() {
        translator = new DefaultRpcExceptionTranslator();
    }

    @Test
    public void translateUnknownDivision() {
        Assert.assertTrue(translator.translate("open", null, new DivisionNotFoundException("foo")) instanceof InvalidDataAccessResourceUsageException);
    }

    @Test
    public void translateProductionMismatch() {
        Assert.assertTrue(translator.translate("open", null, new ProductionMismatchException(false, true)) instanceof InvalidDataAccessResourceUsageException);
    }

    @Test
    public void translateServiceTemporarilyDown() {
        Assert.assertTrue(translator.translate("open", null, new ServiceTemporarilyDownException()) instanceof DataAccessResourceFailureException);
    }

    @Test
    public void translateExceptionDuringSend() {
        Assert.assertTrue(translator.translate("send", null, new RpcException("foo")) instanceof DataRetrievalFailureException);
    }

    @Test
    public void translateVerifyCodeExpired() {
        Assert.assertTrue(translator.translate("open", null, new VerifyCodeExpiredException(VerifyCodeExpiredException.VERIFY_CODE_EXPIRED_MESSAGE)) instanceof PermissionDeniedDataAccessException);
    }

    @Test
    public void translateInvalidCredentials() {
        Assert.assertTrue(translator.translate("open", null, new BadCredentialsException()) instanceof PermissionDeniedDataAccessException);
    }

    @Test
    public void translateLockedUserAccouunt() {
        Assert.assertTrue(translator.translate("open", null, new LockedException("foo")) instanceof PermissionDeniedDataAccessException);
    }

    @Test
    public void translateServerUnavailable() {
        Assert.assertTrue(translator.translate("open", null, new ServerUnavailableException(new RpcHost("example.org", 1234))) instanceof DataAccessResourceFailureException);
    }

    @Test
    public void translateServerNotFound() {
        Assert.assertTrue(translator.translate("open", null, new ServerNotFoundException(new RpcHost("non.existant.domain.org", 1234))) instanceof DataAccessResourceFailureException);
    }

    @Test
    public void translateRpcContextAccessDenied() {
        Assert.assertTrue(translator.translate("send", null, new RpcContextAccessDeniedException("foo")) instanceof PermissionDeniedDataAccessException);
    }

    @Test
    public void translateDivisionMismatch() {
        Assert.assertTrue(translator.translate("send", null, new DivisionMismatchException("foo")) instanceof InvalidDataAccessApiUsageException);
    }

    @Test
    public void translateRpcContextNotFound() {
        Assert.assertTrue(translator.translate("send", null, new RpcContextNotFoundException("foo")) instanceof InvalidDataAccessResourceUsageException);
    }

    @Test
    public void translateRpcNotFound() {
        Assert.assertTrue(translator.translate("send", null, new RpcNotFoundException("foo")) instanceof InvalidDataAccessResourceUsageException);
    }

    @Test
    public void translateConnectionClosed() {
        Assert.assertTrue(translator.translate("send", null, new ConnectionClosedException("foo")) instanceof InvalidDataAccessApiUsageException);
    }

    @Test
    public void translateExceptionDuringClose() {
        Assert.assertTrue(translator.translate("close", null, new RpcException("foo")) instanceof CleanupFailureDataAccessException);
    }

    @Test
    public void translateTimeoutWaitingForIdleConnection() {
        Assert.assertTrue(translator.translate("send", null, new TimeoutWaitingForIdleConnectionException()) instanceof TransientDataAccessResourceException);
    }
}
