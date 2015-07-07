package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcHost;

import java.io.IOException;

/**
 * TODOC: Provide summary documentation of class SocketFactory
 */
public interface SocketFactory {
    Socket createSocket(RpcHost host) throws IOException;

    ServerSocket createServerSocket() throws IOException;
}
