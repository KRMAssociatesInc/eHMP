package gov.va.hmp.vista.springframework.security.userdetails.rpc;

import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.broker.protocol.ChangeVerifyCodeException;
import gov.va.hmp.vista.rpc.broker.protocol.RpcContextAccessDeniedException;
import gov.va.hmp.vista.rpc.broker.protocol.VerifyCodeExpiredException;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.vista.rpc.conn.ConnectionUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetailsService;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

import static org.springframework.util.StringUtils.hasLength;

/**
 * TODOC: Provide summary documentation of class RpcTemplateUserDetailService
 */
public class RpcTemplateUserDetailService implements VistaUserDetailsService {

    private RpcOperations rpcTemplate;

    public RpcOperations getRpcTemplate() {
        return rpcTemplate;
    }

    @Required
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    public final VistaUserDetails login(final String vistaId, final String division, final String accessCode, final String verifyCode, String newVerifyCode, String confirmNewVerifyCode, final String remoteAddress, String remoteHostName) throws BadCredentialsException, DataAccessException {
        if (!hasLength(vistaId)) throw new BadCredentialsException("missing vistaId");
        if (!hasLength(division)) throw new BadCredentialsException("missing division");
        if (!hasLength(accessCode)) throw new BadCredentialsException("missing access code");
        if (!hasLength(verifyCode)) throw new BadCredentialsException("missing verify code");
        if (!hasLength(remoteAddress)) throw new BadCredentialsException("missing remote address");
        if (!hasLength(remoteHostName)) throw new BadCredentialsException("missing remote hostname");

        try {
            /*
             * We're using this special variable to get around nested connection requests (our connection pool only allows one connection for a given key at a time.)
             */
            ConnectionInfo info = getRpcTemplate().execute(new ConnectionInfoCallback(), RpcUriUtils.VISTA_RPC_BROKER_SCHEME + "://" + RpcUriUtils.toAuthority(vistaId, division, accessCode, verifyCode, newVerifyCode, confirmNewVerifyCode, remoteAddress, remoteHostName));
            if (info != null) {
            	return createVistaUserDetails(info.getHost(), vistaId, division, info.getUserDetails());
            }
        } catch (PermissionDeniedDataAccessException e) {
            translateException(e);
        }
        return null;
    }

    @Override
    public VistaUserDetails login(String vistaId, String division, String appHandle, String remoteAddress, String remoteHostName) throws DataAccessException {
        if (!hasLength(vistaId)) throw new BadCredentialsException("missing vistaId");
        if (!hasLength(appHandle)) throw new BadCredentialsException("missing handle");
        if (!hasLength(remoteAddress)) throw new BadCredentialsException("missing remote address");
        if (!hasLength(remoteHostName)) throw new BadCredentialsException("missing remote hostname");

        try {
            ConnectionInfo info = getRpcTemplate().execute(new ConnectionInfoCallback(), RpcUriUtils.VISTA_RPC_BROKER_SCHEME + "://" + RpcUriUtils.toAuthority(vistaId, division, appHandle, remoteAddress, remoteHostName));
            if (info != null) {
                return createVistaUserDetails(info.getHost(), vistaId, division, info.getUserDetails());
            }
        } catch (PermissionDeniedDataAccessException e) {
            translateException(e);
        }
        catch (NullPointerException e) {
           
           return null;
        }
        return null;
    }

    protected void translateException(PermissionDeniedDataAccessException e) throws DataAccessException {
        if (e.getCause() instanceof gov.va.hmp.vista.rpc.broker.protocol.BadCredentialsException) {
            throw new BadCredentialsException(e.getCause().getMessage());
        } else if (e.getCause() instanceof VerifyCodeExpiredException) {
            throw new CredentialsExpiredException(e.getCause().getMessage());
        } else if (e.getCause() instanceof RpcContextAccessDeniedException) {
            throw new AuthenticationServiceException(e.getCause().getMessage(), e.getCause());
        } else if (e.getCause() instanceof ChangeVerifyCodeException) {
        	throw new AuthenticationServiceException(e.getCause().getMessage(), e.getCause());
        } else if (e.getCause() instanceof gov.va.hmp.vista.rpc.broker.protocol.LockedException) {
            throw new LockedException(e.getCause().getMessage());
        } else{
        	throw e;
        }
    }

    protected VistaUserDetails createVistaUserDetails(RpcHost host, String vistaId, String division, ConnectionUserDetails userDetails) {
        VistaUser u = new VistaUser(host,
                vistaId,
                userDetails.getPrimaryStationNumber(),
                userDetails.getDivision(),
                userDetails.getDUZ(),
                userDetails.getCredentials(),
                userDetails.getName(),
                true,
                true,
                true,
                true,
                Collections.<GrantedAuthority>singleton(new SimpleGrantedAuthority("ROLE_USER")));
        u.setDivisionName(userDetails.getDivisionNames().get(userDetails.getDivision()));
        u.setTitle(userDetails.getTitle());
        u.setServiceSection(userDetails.getServiceSection());
        u.setLanguage(userDetails.getLanguage());
        u.setDTime(userDetails.getDTime());
        u.setVPID(userDetails.getVPID());
        return u;
    }

    public void logout(VistaUserDetails user) throws DataAccessException {
        // NOOP
    }

    static class ConnectionInfo {
        private RpcHost host = null;
        private ConnectionUserDetails userDetails = null;

        public ConnectionInfo(RpcHost host, ConnectionUserDetails userDetails) {
            this.host = host;
            this.userDetails = userDetails;
        }

        public RpcHost getHost() {
            return host;
        }

        public ConnectionUserDetails getUserDetails() {
            return userDetails;
        }
    }

    static class ConnectionInfoCallback implements ConnectionCallback<ConnectionInfo> {
    	@Override
    	public ConnectionInfo doInConnection(Connection con) throws RpcException, DataAccessException {
    		return new ConnectionInfo(con.getHost(), con.getUserDetails());
    	}
    }
}
