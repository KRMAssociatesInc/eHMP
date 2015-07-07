package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.*;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.net.ConnectException;
import java.net.NoRouteToHostException;
import java.net.PortUnreachableException;
import java.net.SocketException;

/**
 * TODOC: Provide summary documentation of class OldRpcProtocol
 */
public class OldRpcProtocol extends AbstractRpcProtocol implements RpcProtocol {

    public OldRpcProtocol(SocketFactory socketFactory) {
        super(socketFactory);
    }

    @Override
    public Socket connect(RpcHost host, int timeout, String clientAddress, String clientHostName) throws IOException {
        try {
            Socket handshakeSocket = null;
            ServerSocket callbackSocket = null;
            try {
                handshakeSocket = socketFactory.createSocket(host);
                callbackSocket = socketFactory.createServerSocket();
            } catch (ConnectException e) {
                throw new ServerUnavailableException(host);
            } catch (PortUnreachableException e) {
                throw new ServerUnavailableException(host);
            } catch (NoRouteToHostException e) {
                throw new ServerNotFoundException(host);
            } catch (IOException e) {
                throw e;
            }
            try {
                handshakeSocket.setSoTimeout(timeout);
                callbackSocket.setSoTimeout(timeout);
            } catch (SocketException e) {
                throw new RpcException("error setting socket timeout millis to " + timeout, e);
            }

            log.debug("Starting connection at {}/{}", handshakeSocket.getRemoteHostName(), handshakeSocket.getRemoteHostAddress());

            RpcMessageWriter writer = createWriter(handshakeSocket);
            writer.writeStartConnection(clientHostName != null ? clientHostName : handshakeSocket.getLocalHostName(),
                    clientAddress != null ? clientAddress : handshakeSocket.getLocalHostAddress(),
                    callbackSocket.getLocalPort());
            writer.flush();

            String response = createReader(handshakeSocket).readResponse().toString();
            if (!R_ACCEPT.equalsIgnoreCase(response)) {
                throw new RpcException("error starting connection, response was: " + response);
            }

            try {
                return callbackSocket.accept();
            } catch (IOException e) {
                throw new RpcException("error creating callback socket", e);
            } finally {
                try {
                    handshakeSocket.close();
                } catch (IOException e) {
                    log.warn("error closing handshake socket", e);
                }
            }
        } catch (RpcException e) {
            log.error("unable to connect to " + host, e);
            throw e;
        }
    }

    public RpcMessageReader createReader(Reader r) {
        return new DefaultRpcMessageReader(r);
    }

    public RpcMessageWriter createWriter(Writer w) {
        return new OldRpcMessageWriter(w);
    }
}
