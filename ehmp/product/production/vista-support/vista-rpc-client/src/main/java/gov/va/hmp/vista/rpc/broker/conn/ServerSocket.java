package gov.va.hmp.vista.rpc.broker.conn;

import java.io.IOException;
import java.net.SocketException;

public interface ServerSocket {

    Socket accept() throws IOException;

    int getSoTimeout() throws IOException;

    void setSoTimeout(int timeout) throws SocketException;

    int getLocalPort();
}
