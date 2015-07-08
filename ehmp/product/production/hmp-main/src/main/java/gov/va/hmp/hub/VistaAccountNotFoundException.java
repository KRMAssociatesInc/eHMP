package gov.va.hmp.hub;

import gov.va.hmp.vista.rpc.RpcHost;

public class VistaAccountNotFoundException extends RuntimeException {
    public VistaAccountNotFoundException(RpcHost rpcHost) {
        super("");
    }
}
