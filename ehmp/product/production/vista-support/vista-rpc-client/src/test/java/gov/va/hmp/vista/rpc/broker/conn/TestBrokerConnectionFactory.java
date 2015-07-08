package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.protocol.*;
import gov.va.hmp.vista.rpc.conn.AccessVerifyConnectionSpec;
import gov.va.hmp.vista.rpc.conn.AnonymousConnectionSpec;
import gov.va.hmp.vista.rpc.conn.AppHandleConnectionSpec;
import gov.va.hmp.vista.rpc.conn.Connection;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class TestBrokerConnectionFactory {

    private RpcHost host;
    private SocketFactory mockSocketFactory;

    @Before
    public void setUp() throws URISyntaxException {
        host = new RpcHost("localhost", 9001);
        mockSocketFactory = mock(SocketFactory.class);
    }

    @Test
    public void constructDefaults() {
        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);
        Assert.assertTrue(cf.isBackwardsCompatible());
        Assert.assertFalse(cf.isOldProtocolOnly());
    }

    @Test(expected = IllegalArgumentException.class)
    public void constructWithUnsupportedUriScheme() throws URISyntaxException {
        host = new RpcHost("www.google.com", 80, "http");
        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);
    }

    @Test(expected = IllegalArgumentException.class)
    public void constructWithNullSocketFactory() {
        BrokerConnectionFactory cf = new BrokerConnectionFactory(null);
    }

    @Test
    public void getConnectionWithDivisionAccessAndVerifyCodes() throws IOException, RpcException {
        when(mockSocketFactory.createSocket(host)).thenReturn(new MockSocket(getAcceptMessage() +
                getSignOnSetupMessage() +
                getIntroMessage() +
                getBrokerInfoMessage() +
                getAVCodeMessage() +
                getUserInfoMessage() +
                getDivisionGetMessage() +
                getDivisionSetMessage()));

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);

        Connection c = cf.getConnection(host, new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org"));
        assertNotNull(c);

        verify(mockSocketFactory).createSocket(host);
    }

    @Test
    public void getConnectionWithAccessVerifyCodesAndNoDivision() throws IOException, RpcException {
        when(mockSocketFactory.createSocket(host)).thenReturn(new MockSocket(getAcceptMessage() +
                getSignOnSetupMessage() +
                getIntroMessage() +
                getBrokerInfoMessage() +
                getAVCodeMessage() +
                getUserInfoMessage() +
                getDivisionGetMessage()));

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);

        Connection c = cf.getConnection(host, new AccessVerifyConnectionSpec(null, "foo", "bar", "123.45.67.89", "www.example.org"));
        assertNotNull(c);

        verify(mockSocketFactory).createSocket(host);
    }

    @Test
    public void getConnectionWithAnonymousConnectionSpec() throws IOException, RpcException {
        when(mockSocketFactory.createSocket(host)).thenReturn(new MockSocket(getAcceptMessage() +
                // these three called by fetchSystemInfo()
                getSignOnSetupMessage() +
                getIntroMessage() +
                getBrokerInfoMessage()));

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);

        Connection c = cf.getConnection(host, new AnonymousConnectionSpec());
        assertNotNull(c);

        verify(mockSocketFactory).createSocket(host);
    }

    @Test
    public void getConnectionWithAppHandleConnectionSpec() throws IOException, RpcException {
        MockSocket mockSocket = new MockSocket(getAcceptMessage() +
                getSignOnSetupMessage() +
                getIntroMessage() +
                getBrokerInfoMessage() +
                getAppHandleMessage() +
                getUserInfoMessage() +
                getDivisionGetMessage());
        when(mockSocketFactory.createSocket(host)).thenReturn(mockSocket);

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);

        Connection c = cf.getConnection(host, new AppHandleConnectionSpec("A1B2C3D4E5F6", "123.45.67.89", "www.example.org"));
        assertNotNull(c);

        verify(mockSocketFactory).createSocket(host);
        assertThat(mockSocket.getBytesSentAsString(), containsString("123.45.67.89"));
        assertThat(mockSocket.getBytesSentAsString(), containsString("www.example.org"));
    }

    @Test
    public void backwardsCompatibility() throws IOException {
        MockSocket mockNoResponseSocket = new MockSocket(new byte[0]);
        MockSocket mockHandshakeSocket = new MockSocket(getAcceptMessage());
        MockSocket mockCallbackSocket = new MockSocket(getSignOnSetupMessage() +
                getIntroMessage() +
                getBrokerInfoMessage() +
                getAVCodeMessage() +
                getUserInfoMessage() +
                getDivisionGetMessage() +
                getDivisionSetMessage());
        when(mockSocketFactory.createSocket(host))
                .thenReturn(mockNoResponseSocket)
                .thenReturn(mockHandshakeSocket);
        when(mockSocketFactory.createServerSocket()).thenReturn(new MockServerSocket(mockCallbackSocket));

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);

        Connection c = cf.getConnection(host, new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org"));
        assertNotNull(c);

        verify(mockSocketFactory, times(2)).createSocket(host);
        verify(mockSocketFactory).createServerSocket();

        Assert.assertTrue(mockNoResponseSocket.getBytesSentAsString().startsWith(NewRpcMessageWriter.PREFIX));
        Assert.assertTrue(mockNoResponseSocket.isClosed());
        Assert.assertTrue(mockHandshakeSocket.getBytesSentAsString().startsWith(OldRpcMessageWriter.PREFIX));
        Assert.assertTrue(mockHandshakeSocket.isClosed());
    }

    @Test
    public void oldProtocolOnly() throws IOException {
        MockSocket mockHandshakeSocket = new MockSocket(getAcceptMessage());
        MockSocket mockCallbackSocket = new MockSocket(getSignOnSetupMessage() +
                getIntroMessage() +
                getBrokerInfoMessage() +
                getAVCodeMessage() +
                getUserInfoMessage() +
                getDivisionGetMessage() +
                getDivisionSetMessage());
        MockServerSocket mockServerSocket = new MockServerSocket(mockCallbackSocket);
        when(mockSocketFactory.createSocket(host)).thenReturn(mockHandshakeSocket);
        when(mockSocketFactory.createServerSocket()).thenReturn(mockServerSocket);

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);
        cf.setOldProtocolOnly(true);

        Connection c = cf.getConnection(host, new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org"));
        assertNotNull(c);

        verify(mockSocketFactory).createSocket(host);
        verify(mockSocketFactory).createServerSocket();

        Assert.assertTrue(mockHandshakeSocket.getBytesSentAsString().startsWith(OldRpcMessageWriter.PREFIX));
        Assert.assertTrue(mockHandshakeSocket.isClosed());
    }

    @Test
    public void newProtocolOnly() throws IOException {
        MockSocket mockSocket = new MockSocket(new byte[0]);
        when(mockSocketFactory.createSocket(host)).thenReturn(mockSocket);

        BrokerConnectionFactory cf = new BrokerConnectionFactory(mockSocketFactory);
        cf.setBackwardsCompatible(false);
        try {
            cf.getConnection(host, new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org"));
            Assert.fail("expected " + UnsupportedProtocolException.class);
        } catch (UnsupportedProtocolException e) {
            // NOOP
        }

        verify(mockSocketFactory).createSocket(host);
        Assert.assertTrue(mockSocket.isClosed());
    }

    private String getIntroMessage() {
        return TestBrokerConnection.buildMockIntroMessageResponse().toString();
    }

    private String getSignOnSetupMessage() {
        return TestBrokerConnection.buildMockSignOnSetupResponse().toString();
    }

    private String getAcceptMessage() {
        return new RpcResponseBuilder(AbstractRpcProtocol.R_ACCEPT).toString();
    }

    private String getDivisionGetMessage() {
        return TestBrokerConnection.buildMockDivisionGetResponse().toString();
    }

    private String getDivisionSetMessage() {
        return TestBrokerConnection.buildMockDivisionSetResponse().toString();
    }

    private String getAVCodeMessage() {
        return TestBrokerConnection.buildMockAVCodeResponse().toString();
    }

    private String getAppHandleMessage() {
        return TestBrokerConnection.buildMockAppHandleResponse().toString();
    }

    private String getUserInfoMessage() {
        return TestBrokerConnection.buildMockUserInfoResponse().toString();
    }

    private String getBrokerInfoMessage() {
        return TestBrokerConnection.buildMockBrokerInfoResponse().toString();
    }
}
