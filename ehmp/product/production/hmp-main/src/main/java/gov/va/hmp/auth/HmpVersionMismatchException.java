package gov.va.hmp.auth;

import gov.va.hmp.vista.rpc.RpcHost;

public class HmpVersionMismatchException extends RuntimeException {
    public HmpVersionMismatchException(String webHmpVersion, String vistaHmpVersion, RpcHost host, String vistaId, String division) {
        super("This is version '" + webHmpVersion + "', VistA server is running version '" + vistaHmpVersion + "'.");
    }
}
