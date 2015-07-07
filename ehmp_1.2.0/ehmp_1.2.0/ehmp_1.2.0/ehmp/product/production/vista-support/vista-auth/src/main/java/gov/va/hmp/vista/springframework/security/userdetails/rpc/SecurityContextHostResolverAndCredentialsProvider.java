package gov.va.hmp.vista.springframework.security.userdetails.rpc;

import gov.va.hmp.vista.rpc.CredentialsProvider;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcHostResolver;
import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityContextHostResolverAndCredentialsProvider implements RpcHostResolver, CredentialsProvider {

    @Override
    public RpcHost resolve(String vistaId) throws VistaIdNotFoundException {
        return getVistaUserDetails() != null ? getVistaUserDetails().getHost() : null;
    }

    @Override
    public String getCredentials(RpcHost host, String userInfo) {
        VistaUserDetails u = getVistaUserDetails();
        if (u == null) return null;
        return u.getCredentials();
    }

    private VistaUserDetails getVistaUserDetails() {
        return (VistaUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
