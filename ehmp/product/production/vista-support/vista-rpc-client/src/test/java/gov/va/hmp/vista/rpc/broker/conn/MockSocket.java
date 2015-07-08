package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.broker.protocol.AbstractRpcProtocol;
import gov.va.hmp.vista.rpc.broker.protocol.TransportMetrics;
import gov.va.hmp.vista.util.RpcUriUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;

/**
 * TODO: Document gov.va.cpe.vista.protocol
 */
public class MockSocket implements Socket {

    private String localHostName = "localhost";
    private String localHostAddress = "127.0.0.1";
    private String remoteHostName = "localhost";
    private String remoteHostAddress = "127.0.0.1";
    private int remotePort = RpcUriUtils.DEFAULT_PORT;
    private long soTimeout = -1;

    public boolean closed = false;

    private byte[] bytesReceived;
    private ByteArrayInputStream input;
    private ByteArrayOutputStream output = new ByteArrayOutputStream();
    private CountingInputStreamTransportMetrics inTransportMetrics;
    private CountingOutputStreamTransportMetrics outTransportMetrics;

    public MockSocket(byte[] bytesReceived) {
        this.bytesReceived = bytesReceived;
        input = new ByteArrayInputStream(bytesReceived);
        output = new ByteArrayOutputStream();
        inTransportMetrics = new CountingInputStreamTransportMetrics(input);
        outTransportMetrics = new CountingOutputStreamTransportMetrics(output);
    }

    public MockSocket(String message) {
        this(message.getBytes(AbstractRpcProtocol.VISTA_CHARSET));
    }

    public InputStream in() {
        return inTransportMetrics.in();
    }

    public OutputStream out() {
        return outTransportMetrics.out();
    }

    public void close() {
        closed = true;
    }

    public byte[] getBytesReceived() {
        return bytesReceived;
    }

    public String getBytesReceivedAsString() {
        return new String(getBytesReceived(), AbstractRpcProtocol.VISTA_CHARSET);
    }

    public byte[] getBytesSent() {
        return output.toByteArray();
    }

    public String getBytesSentAsString() {
        return new String(getBytesSent(), AbstractRpcProtocol.VISTA_CHARSET);
    }

    public String getLocalHostAddress() {
        return localHostAddress;
    }

    public String getRemoteHostName() {
        return remoteHostName;
    }

    public String getRemoteHostAddress() {
        return remoteHostAddress;
    }

    public int getRemotePort() {
        return remotePort;
    }

    public String getLocalHostName() {
        return localHostName;
    }

    public int getLocalPort() {
        return 5678;
    }

    public int getSoTimeout() throws SocketException {
        return (int) soTimeout;
    }

    public void setSoTimeout(int timeout) throws SocketException {
        this.soTimeout = timeout;
    }

    public boolean isClosed() {
        return closed;
    }

    public TransportMetrics getInTransportMetrics() {
        return inTransportMetrics;
    }

    public TransportMetrics getOutTransportMetrics() {
        return outTransportMetrics;
    }
}
