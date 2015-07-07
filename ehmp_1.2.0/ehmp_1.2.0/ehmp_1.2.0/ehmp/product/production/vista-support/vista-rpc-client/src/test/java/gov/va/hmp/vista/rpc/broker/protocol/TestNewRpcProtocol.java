package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.conn.MockSocket;
import gov.va.hmp.vista.rpc.broker.conn.SocketFactory;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;

import static org.mockito.Mockito.*;

public class TestNewRpcProtocol {

    SocketFactory mockSocketFactory;
    MockSocket mockSocket;

    @Before
    public void setUp() {
        mockSocketFactory = mock(SocketFactory.class);
    }

    @Test
    public void connect() throws RpcException, URISyntaxException, IOException {
        RpcHost host = new RpcHost("127.0.0.1", 9600);

        mockSocket = new MockSocket("\u0000\u0000" + AbstractRpcProtocol.R_ACCEPT + "\u0004");
        when(mockSocketFactory.createSocket(host)).thenReturn(mockSocket);

        NewRpcProtocol protocol = new NewRpcProtocol(this.mockSocketFactory);
        Assert.assertSame(mockSocket, protocol.connect(host, 2000, "123.45.67.89", "www.example.org"));
        Assert.assertEquals(2000, mockSocket.getSoTimeout());
        verify(mockSocketFactory).createSocket(host);
    }

}
