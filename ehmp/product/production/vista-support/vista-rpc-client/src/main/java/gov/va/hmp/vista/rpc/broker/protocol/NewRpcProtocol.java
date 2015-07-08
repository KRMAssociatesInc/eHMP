package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.ServerNotFoundException;
import gov.va.hmp.vista.rpc.broker.conn.ServerUnavailableException;
import gov.va.hmp.vista.rpc.broker.conn.Socket;
import gov.va.hmp.vista.rpc.broker.conn.SocketFactory;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.net.ConnectException;
import java.net.NoRouteToHostException;
import java.net.PortUnreachableException;
import java.net.SocketException;

/**
 * TODOC: Provide summary documentation of class NewRpcProtocol
 */
public class NewRpcProtocol extends AbstractRpcProtocol implements RpcProtocol {

    public NewRpcProtocol(SocketFactory socketFactory) {
        super(socketFactory);
    }

    @Override
    public Socket connect(RpcHost host, int timeout, String clientAddress, String clientHostName) throws IOException {
        Socket socket = null;
        try {
            try {
                socket = socketFactory.createSocket(host);
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
                socket.setSoTimeout(timeout);
            } catch (SocketException e) {
                throw new RpcException("error setting socket timeout millis to " + timeout, e);
            }

            log.debug("Starting connection at {}/{}", socket.getRemoteHostName(), socket.getRemoteHostAddress());

            RpcMessageWriter writer = createWriter(socket);
            writer.writeStartConnection(clientHostName != null ? clientHostName :socket.getLocalHostName(),
                    clientAddress != null ? clientAddress : socket.getLocalHostAddress(),
                    socket.getLocalPort());
            writer.flush();

            String response = createReader(socket).readResponse().toString();
            if (!R_ACCEPT.equalsIgnoreCase(response)) {
                throw new RpcException("error starting connection, response was: " + response);
            }

            return socket;
        } catch (RpcException e) {
            if (socket != null) {
                try {
                    socket.close();
                } catch (IOException ioe) {
                    // NOOP
                }
            }
            throw e;
        }
    }

    @Override
    protected RpcMessageReader createReader(Reader r) {
        return new DefaultRpcMessageReader(r);
    }

    @Override
    protected RpcMessageWriter createWriter(Writer w) {
        return new NewRpcMessageWriter(w);
    }
}
