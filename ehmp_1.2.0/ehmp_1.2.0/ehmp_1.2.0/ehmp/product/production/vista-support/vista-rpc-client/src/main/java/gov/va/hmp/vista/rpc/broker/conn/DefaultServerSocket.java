package gov.va.hmp.vista.rpc.broker.conn;

import java.io.IOException;
import java.net.SocketException;

public class DefaultServerSocket implements ServerSocket {

    private java.net.ServerSocket serverSocket;

    public DefaultServerSocket(java.net.ServerSocket serverSocket) {
        this.serverSocket = serverSocket;
    }

    @Override
    public Socket accept() throws IOException {
        return new DefaultSocket(serverSocket.accept(), serverSocket);
    }

    @Override
    public int getSoTimeout() throws IOException {
        return serverSocket.getSoTimeout();
    }

    @Override
    public void setSoTimeout(int timeout) throws SocketException {
        serverSocket.setSoTimeout((int) timeout);
    }

    @Override
    public int getLocalPort() {
        return serverSocket.getLocalPort();
    }
}
