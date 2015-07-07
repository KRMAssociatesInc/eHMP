package gov.va.hmp.auth;

import gov.va.hmp.vista.rpc.RpcHost;
import org.springframework.security.core.AuthenticationException;

public class VistaHostValidationException extends AuthenticationException {

    private final RpcHost host;

    public VistaHostValidationException(String msg) {
        super("Invalid VistA host: " + msg);
        this.host = null;
    }

    public VistaHostValidationException(RpcHost host) {
        super("Invalid VistA host: " + host.toHostString());
        this.host = host;
    }

    public RpcHost getHost() {
        return host;
    }
}
