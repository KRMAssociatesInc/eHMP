package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;

/**
 * TODO: Document Socket
 */
public interface Socket {
    InputStream in() throws IOException;

    OutputStream out() throws IOException;

    void close() throws IOException;

    boolean isClosed();

    String getRemoteHostName();

    String getRemoteHostAddress();

    int getRemotePort();

    String getLocalHostName();

    String getLocalHostAddress();

    int getLocalPort();

    int getSoTimeout() throws SocketException;

    void setSoTimeout(int timeout) throws SocketException;

    TransportMetrics getInTransportMetrics();

    TransportMetrics getOutTransportMetrics();
}
