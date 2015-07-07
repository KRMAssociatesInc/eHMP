package gov.va.hmp.vista.rpc;

import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;
import gov.va.hmp.vista.rpc.broker.protocol.VerifyCodeExpiredException;
import gov.va.hmp.vista.rpc.conn.*;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.dao.PermissionDeniedDataAccessException;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.*;

public class TestRpcTemplate {
    private ConnectionFactory mockConnectionFactory;
    private Connection mockConnection;
    private ConnectionUserDetails mockUserDetails;

    @Before
    public void setUp() {
        mockConnectionFactory = mock(ConnectionFactory.class);
        mockConnection = mock(Connection.class);
        mockUserDetails = mock(ConnectionUserDetails.class);
    }

    @Test
    public void executeWithAccessVerifyCredentials() throws RpcException, IOException {
        RpcResponse mockResponse = new RpcResponse("fred\r\nbarney\r\nwilma\r\nbetty");
        RpcRequest rpc = new RpcRequest("vrpcb://960:foo;bar@localhost:1234/FOOBAR");

        whenRpcThenReturn(rpc, mockResponse);

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);

        RpcResponse response = t.execute(rpc);
        assertSame(mockResponse, response);

        verifyRpc(rpc);
    }

    @Test
    public void executeWithAppHandleCredentials() throws RpcException, IOException {
        RpcResponse mockResponse = new RpcResponse("fred\r\nbarney\r\nwilma\r\nbetty");
        RpcRequest rpc = new RpcRequest("vrpcb://www.example.org(123.45.67.89)1A2B3C4D5E6F@localhost:1234/FOOBAR");

        whenRpcThenReturn(rpc, mockResponse);

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);

        RpcResponse response = t.execute(rpc);
        assertSame(mockResponse, response);

        verifyRpc(rpc);
    }

    private void whenRpcThenReturn(RpcRequest rpc, RpcResponse response) throws RpcException, IOException {
        RpcHost host = RpcUriUtils.extractHost(rpc.getUriString());
        ConnectionSpec auth = ConnectionSpecFactory.create(rpc.getCredentials());

        when(mockUserDetails.getDUZ()).thenReturn("12345");
        if (auth instanceof  AccessVerifyConnectionSpec) {
            AccessVerifyConnectionSpec av = (AccessVerifyConnectionSpec) auth;
            when(mockUserDetails.getDivision()).thenReturn(av.getDivision());
        } else if (auth instanceof AppHandleConnectionSpec) {
            when(mockUserDetails.getDivision()).thenReturn("500");
        }
        when(mockUserDetails.getCredentials()).thenReturn(auth.toString());

        when(mockConnectionFactory.getConnection(host, auth)).thenReturn(mockConnection);
        when(mockConnection.getUserDetails()).thenReturn(mockUserDetails);
        when(mockConnection.getHost()).thenReturn(host);
        when(mockConnection.send(rpc)).thenReturn(response);
    }

    private void verifyRpc(RpcRequest rpc) throws RpcException, IOException {
        RpcHost host = RpcUriUtils.extractHost(rpc.getUriString());
        ConnectionSpec auth = ConnectionSpecFactory.create(rpc.getCredentials());

        verify(mockConnectionFactory).getConnection(host, auth);
        verify(mockConnection).send(rpc);
        verify(mockConnection).close();
    }

    @Test
    public void executeWithTimeout() throws RpcException, IOException {
        RpcRequest expectedRequest = new RpcRequest("vrpcb://960:foo;bar@localhost:9200/FOOBAR");
        expectedRequest.setTimeout(7);
        whenRpcThenReturn(expectedRequest, new RpcResponse("fred\r\nbarney\r\nwilma\r\nbetty"));

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.setTimeout(7);

        t.execute(new RpcHost("localhost", 9200), "960", "foo", "bar", "", "FOOBAR");

        verifyRpc(expectedRequest);
    }

    @Test(expected = PermissionDeniedDataAccessException.class)
    public void verifyCodeNeedsChanging() throws RpcException, IOException {
        when(mockConnectionFactory.getConnection(new RpcHost("localhost"), new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org"))).thenThrow(new VerifyCodeExpiredException(VerifyCodeExpiredException.VERIFY_CODE_EXPIRED_MESSAGE));

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);

        t.execute("vrpcb://960:foo;bar@localhost:9200/FOOBAR");
    }

    @Test
    public void executeWithConnectionCallback() throws RpcException, IOException {
        RpcHost host = new RpcHost("localhost", 9060);
        AccessVerifyConnectionSpec auth = new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org");
        when(mockConnectionFactory.getConnection(host, auth)).thenReturn(mockConnection);

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);

        ConnectionCallback<String> callback = new ConnectionCallback<String>() {
            @Override
            public String doInConnection(Connection con) throws RpcException, DataAccessException {
                assertSame(mockConnection, con);
                return "w00t";
            }
        };
        String result = t.execute(callback, "vrpcb://960:foo;bar@localhost:9060");
        assertEquals("w00t", result);

        verify(mockConnectionFactory).getConnection(host, auth);
        verify(mockConnection).close();
    }

    @Test
    public void executeWithLineMapper() throws RpcException, IOException {
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@localhost:9200/FOOBAR");
        whenRpcThenReturn(request, new RpcResponse("fred\r\nbarney\r\nwilma\r\nbetty"));

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);

        List<Foo> fooList = t.execute(new FooLineMapper(), request);
        assertEquals(4, fooList.size());
        assertEquals("fred", fooList.get(0).getText());
        assertEquals("barney", fooList.get(1).getText());
        assertEquals("wilma", fooList.get(2).getText());
        assertEquals("betty", fooList.get(3).getText());

        verifyRpc(request);
    }

    @Test
    public void executeForLong() throws IOException {
        assertLongResult(3147483647L, "3147483647");
        assertLongResult(42L, "42");
        assertLongResult(-23L, "-23");
        assertLongResult(0L, "0");
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void executeForLongEmptyResponse() throws IOException {
        assertLongResult(4L, "");
    }

    @Test(expected = IncorrectResultSizeDataAccessException.class)
    public void executeForLongIncorrectResultSize() throws IOException {
        assertLongResult(4L, "1\r\n2");
    }

    private void assertLongResult(long value, String response) throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@localhost:9200/FOOBAR");
        whenRpcThenReturn(request, new RpcResponse(response));
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        assertEquals(value, t.executeForLong(new RpcHost("localhost"), "960", "foo", "bar", "", "FOOBAR"));
        verifyRpc(request);
    }

    @Test
    public void executeForInt() throws IOException {
        assertIntResult(4, "4");
        assertIntResult(42, "42");
        assertIntResult(-23, "-23");
        assertIntResult(0, "0");
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void executeForIntEmptyResponse() throws IOException {
        assertIntResult(4, "");
    }

    @Test(expected = IncorrectResultSizeDataAccessException.class)
    public void executeForIntIncorrectResultSize() throws IOException {
        assertIntResult(4, "1\r\n2");
    }

    private void assertIntResult(int value, String response) throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@localhost:9200/FOOBAR");
        whenRpcThenReturn(request, new RpcResponse(response));
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        assertEquals(value, t.executeForInt(new RpcHost("localhost"), "960", "foo", "bar", "", "FOOBAR"));
        verifyRpc(request);
    }

    @Test
    public void executeForBoolean() throws RpcException, IOException {
        assertBooleanResult(true, "true");
        assertBooleanResult(false, "false");
        assertBooleanResult(false, "yes");
        assertBooleanResult(false, "no");
        assertBooleanResult(false, "off");
        assertBooleanResult(false, "on");
        assertBooleanResult(false, "1");
        assertBooleanResult(false, "0");
    }

    private void assertBooleanResult(boolean value, String response) throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@localhost:9200/FOOBAR");
        whenRpcThenReturn(request, new RpcResponse(response));
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);

        boolean b = t.executeForBoolean(new RpcHost("localhost"), "960", "foo", "bar", "", "FOOBAR");
        assertEquals(value, b);

        verifyRpc(request);
    }

    @Test
    public void executeWithHostResolver() throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@fubar:1234/FOOBAR");
        whenRpcThenReturn(request, new RpcResponse("foo"));

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.setHostResolver(new RpcHostResolver() {
            @Override
            public RpcHost resolve(String vistaId) throws VistaIdNotFoundException {
                return new RpcHost("fubar", 1234);
            }
        });

        t.execute("vrpcb://960:foo;bar@3B1D/FOOBAR");

        verifyRpc(request);
    }

    @Test(expected = IllegalArgumentException.class)
    public void executeWithAmbiguousHostAndNoHostResolver() throws IOException {
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.execute("vrpcb://960:foo;bar@3B1D/FOOBAR");
    }

    @Test
    public void executeWithCredentialsProvider() throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@localhost:9060/FOOBAR");
        whenRpcThenReturn(request, new RpcResponse("foo"));

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.setCredentialsProvider(new CredentialsProvider() {
            @Override
            public String getCredentials(RpcHost host, String userInfo) {
                return "960:foo;bar";
            }
        });

        t.execute("vrpcb://localhost:9060/FOOBAR");

        verifyRpc(request);
    }

    @Test(expected = IllegalArgumentException.class)
    public void executeWithNoCredentialsAndNoCredentialsProvider() throws IOException {
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.execute("vrpcb://localhost:9060/FOOBAR");
    }

    @Test
    public void executeRelativeUriWithHostResolverAndCredentialsProvider() throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@fubar:1234/FOO/BAR");
        whenRpcThenReturn(request, new RpcResponse("foo"));
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.setHostResolver(new RpcHostResolver() {
            @Override
            public RpcHost resolve(String vistaId) throws VistaIdNotFoundException {
                return new RpcHost("fubar", 1234);
            }
        });
        t.setCredentialsProvider(new CredentialsProvider() {
            @Override
            public String getCredentials(RpcHost host, String userInfo) {
                return "960:foo;bar";
            }
        });
        t.execute("/FOO/BAR");
        verifyRpc(request);
    }

    @Test
    public void executeWithConnectionCallbackAndHostResolver() throws IOException {
        final RpcHost host = new RpcHost("fubar", 1234);
        AccessVerifyConnectionSpec auth = new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org");
        when(mockConnectionFactory.getConnection(host, auth)).thenReturn(mockConnection);

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.setHostResolver(new RpcHostResolver() {
            @Override
            public RpcHost resolve(String vistaId) throws VistaIdNotFoundException {
                return host;
            }
        });
        t.execute(new ConnectionCallback<String>() {
            @Override
            public String doInConnection(Connection con) throws RpcException, DataAccessException {
                assertSame(mockConnection, con);
                return "w00t";
            }
        }, "vrpcb://960:foo;bar@3B1D");

        verify(mockConnectionFactory).getConnection(host, auth);
        verify(mockConnection).close();
    }

    @Test(expected = IllegalArgumentException.class)
    public void executeWithWithConnectionCallbackAmbiguousHostAndNoHostResolver() throws IOException {
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.execute(new ConnectionCallback<Object>() {
            @Override
            public Object doInConnection(Connection con) throws RpcException, DataAccessException {
                return null;  //To change body of implemented methods use File | Settings | File Templates.
            }
        }, "vrpcb://960:foo;bar@3B1D");
    }

    @Test
    public void executeWithConnectionCallbackAndCredentialsProvider() throws IOException {
        reset(mockConnectionFactory, mockConnection, mockUserDetails);
        RpcRequest request = new RpcRequest("vrpcb://960:foo;bar@localhost:9060");
        whenRpcThenReturn(request, new RpcResponse("foo"));

        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.setCredentialsProvider(new CredentialsProvider() {
            @Override
            public String getCredentials(RpcHost host, String userInfo) {
                return "960:foo;bar";
            }
        });

        t.execute("vrpcb://localhost:9060");

        verifyRpc(request);
    }

    @Test(expected = IllegalArgumentException.class)
    public void executeWithConnectionCallbackNoCredentialsAndNoCredentialsProvider() throws IOException {
        RpcTemplate t = new RpcTemplate(mockConnectionFactory);
        t.execute(new ConnectionCallback<Object>() {
            @Override
            public Object doInConnection(Connection con) throws RpcException, DataAccessException {
                return null;  //To change body of implemented methods use File | Settings | File Templates.
            }
        }, "vrpcb://localhost:9060");
    }
}
