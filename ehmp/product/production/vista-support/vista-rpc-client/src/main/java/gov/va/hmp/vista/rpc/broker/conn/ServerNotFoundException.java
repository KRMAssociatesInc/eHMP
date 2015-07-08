package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;

public class ServerNotFoundException extends RpcException {

    public ServerNotFoundException(RpcHost host) {
        super("Can't find the server '" + host.getHostname() + "'");
    }
}
