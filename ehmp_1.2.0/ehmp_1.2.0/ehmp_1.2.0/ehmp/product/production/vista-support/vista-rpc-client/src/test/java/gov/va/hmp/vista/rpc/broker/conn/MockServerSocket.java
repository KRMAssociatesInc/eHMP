package gov.va.hmp.vista.rpc.broker.conn;

import java.io.IOException;
import java.net.SocketException;

public class MockServerSocket implements ServerSocket {

    private Socket socket;
    private int soTimeout = -1;

    public MockServerSocket(Socket socket) {
        this.socket = socket;
    }

    @Override
    public Socket accept() throws IOException {
        return socket;
    }

    @Override
    public int getSoTimeout() throws IOException {
        return soTimeout;
    }

    @Override
    public void setSoTimeout(int timeout) throws SocketException {
        soTimeout = timeout;
    }

    @Override
    public int getLocalPort() {
        return 5678;
    }
}
