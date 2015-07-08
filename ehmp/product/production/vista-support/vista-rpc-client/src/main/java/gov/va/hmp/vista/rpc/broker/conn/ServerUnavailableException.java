package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;

public class ServerUnavailableException extends RpcException {
    public ServerUnavailableException(RpcHost host) {
        super("The VistA RPC Broker listener on port " + host.getPort() + " at '" + host.getHostname() + "' is not responding and is unavailable");
    }
}
