package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.Socket;

import java.io.IOException;

/**
 * TODOC: Provide summary documentation of class RpcProtocol
 */
public interface RpcProtocol {

    // TODO: consider adding TimeUnit to signature of connect()
    Socket connect(RpcHost host, int timeout, String clientAddress, String clientHostName) throws IOException;

    RpcMessageReader createReader(Socket socket);

    RpcMessageWriter createWriter(Socket socket);
}
