package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.MockServerSocket;
import gov.va.hmp.vista.rpc.broker.conn.MockSocket;
import gov.va.hmp.vista.rpc.broker.conn.Socket;
import gov.va.hmp.vista.rpc.broker.conn.SocketFactory;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;

import static org.mockito.Mockito.*;

public class TestOldRpcProtocol {
    SocketFactory mockSocketFactory;

    @Before
    public void setUp() {
        mockSocketFactory = mock(SocketFactory.class);
    }

    @Test
    public void connect() throws RpcException, URISyntaxException, IOException {
        RpcHost host = new RpcHost("127.0.0.1", 9600);

        MockSocket handshakeSocket = new MockSocket("\u0000\u0000" + AbstractRpcProtocol.R_ACCEPT + "\u0004");
        MockSocket callbackSocket = new MockSocket(new byte[0]);
        MockServerSocket mockServerSocket = new MockServerSocket(callbackSocket);

        when(mockSocketFactory.createSocket(host)).thenReturn(handshakeSocket);
        when(mockSocketFactory.createServerSocket()).thenReturn(mockServerSocket);

        OldRpcProtocol protocol = new OldRpcProtocol(mockSocketFactory);
        Socket socket = protocol.connect(host, 2000, "123.45.67.89", "www.example.org");

        Assert.assertSame(callbackSocket, socket);
        Assert.assertTrue(handshakeSocket.isClosed());
        Assert.assertEquals(2000, handshakeSocket.getSoTimeout());
        Assert.assertEquals(2000, mockServerSocket.getSoTimeout());

        String out = new String(handshakeSocket.getBytesSent(), AbstractRpcProtocol.VISTA_CHARSET);
        Assert.assertTrue(out.contains(Integer.toString(mockServerSocket.getLocalPort())));

        verify(mockSocketFactory).createSocket(host);
        verify(mockSocketFactory).createServerSocket();
    }

}
