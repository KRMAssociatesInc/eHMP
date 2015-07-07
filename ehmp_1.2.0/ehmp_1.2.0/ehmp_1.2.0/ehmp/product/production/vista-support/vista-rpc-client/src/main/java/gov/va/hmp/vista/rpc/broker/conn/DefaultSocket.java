package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;
import gov.va.hmp.vista.util.RpcUriUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.SocketException;

/**
 * TODOC: Provide summary documentation of class DefaultSocket
 */
public class DefaultSocket implements Socket {

    private java.net.Socket socket;
    private java.net.ServerSocket serverSocket;

    private CountingInputStreamTransportMetrics inTransportMetrics;
    private CountingOutputStreamTransportMetrics outTransportMetrics;

    public DefaultSocket(String host, int port) throws IOException {
        if (port == -1) port = RpcUriUtils.DEFAULT_PORT;
        this.socket = new java.net.Socket(host, port);
    }

    public DefaultSocket(java.net.Socket socket, java.net.ServerSocket serverSocket) {
        this.socket = socket;
        this.serverSocket = serverSocket;
    }

    public void close() throws IOException {
        if (!socket.isClosed())
            socket.close();
        if (serverSocket != null) {
            if (!serverSocket.isClosed())
                serverSocket.close();
        }
    }

    public InputStream in() throws IOException {
        if (inTransportMetrics == null) {
            inTransportMetrics = new CountingInputStreamTransportMetrics(socket.getInputStream());
        }
        return inTransportMetrics.in();
    }

    public OutputStream out() throws IOException {
        if (outTransportMetrics == null) {
            outTransportMetrics = new CountingOutputStreamTransportMetrics(socket.getOutputStream());
        }
        return outTransportMetrics.out();
    }

    public boolean isClosed() {
        return socket.isClosed();
    }

    public InetAddress getLocalAddress() {
        return socket.getLocalAddress();
    }

    public InetAddress getInetAddress() {
        return socket.getInetAddress();
    }

    public String getLocalHostName() {
        return socket.getLocalAddress().getCanonicalHostName();
    }

    public String getRemoteHostName() {
        return socket.getInetAddress().getCanonicalHostName();
    }

    public String getRemoteHostAddress() {
        return socket.getInetAddress().getHostAddress();
    }

    public String getLocalHostAddress() {
        return socket.getLocalAddress().getHostAddress();
    }

    public int getRemotePort() {
        return socket.getPort();
    }

    public int getLocalPort() {
        return socket.getLocalPort();
    }

    public int getSoTimeout() throws SocketException {
        return socket.getSoTimeout();
    }

    public void setSoTimeout(int timeout) throws SocketException {
        socket.setSoTimeout((int) timeout);
    }

    public TransportMetrics getInTransportMetrics() {
        return inTransportMetrics;
    }

    public TransportMetrics getOutTransportMetrics() {
        return outTransportMetrics;
    }
}
