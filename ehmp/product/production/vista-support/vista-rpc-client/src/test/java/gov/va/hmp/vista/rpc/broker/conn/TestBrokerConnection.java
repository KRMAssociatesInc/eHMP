package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.broker.protocol.*;
import gov.va.hmp.vista.rpc.conn.*;
import org.hamcrest.Matcher;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatcher;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URISyntaxException;

import static gov.va.hmp.vista.rpc.RpcResponse.LINE_DELIMITER;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class TestBrokerConnection {
    private RpcHost host;
    private RpcProtocol mockProtocol;
    private RpcMessageReader mockReader;
    private RpcMessageWriter mockWriter;
    private MockSocket mockSocket;
    private BrokerConnection c;

    @Before
    public void setUp() throws RpcException, URISyntaxException {
        host = new RpcHost("127.0.0.1");

        mockSocket = new MockSocket(new byte[0]);
        mockProtocol = mock(RpcProtocol.class);
        mockReader = mock(RpcMessageReader.class);
        mockWriter = mock(RpcMessageWriter.class);

        when(mockProtocol.createReader(mockSocket)).thenReturn(mockReader);
        when(mockProtocol.createWriter(mockSocket)).thenReturn(mockWriter);
        c = new BrokerConnection(host, mockSocket, mockProtocol);
    }

    @Test(expected = IllegalArgumentException.class)
    public void constructWithNullSocket() throws RpcException {
        c = new BrokerConnection(host, null, mockProtocol);
    }

    @Test(expected = IllegalArgumentException.class)
    public void constructWithNullProtocol() throws RpcException {
        c = new BrokerConnection(host, mockSocket, null);
    }

    @Test
    public void construct() {
        verify(mockProtocol).createReader(mockSocket);
        verify(mockProtocol).createWriter(mockSocket);
        try {
            assertThat(c.getUserDetails(), nullValue());
            assertThat(c.isAuthenticated(), is(false));
        } catch (RpcException e) {
            e.printStackTrace();  // TODO: replace default exception handling
        }
        assertNull(c.getCurrentRpcContext());
    }

    @Test
    public void stop() throws RpcException {
        when(mockReader.readResponse()).thenReturn(new RpcResponse(AbstractRpcProtocol.R_ACCEPT));

        c.stop();

        verify(mockWriter).writeStopConnection();
        verify(mockWriter).flush();
        verify(mockReader).readResponse();
    }

    @Test
    public void stopWithEOFException() throws RpcException {
        when(mockReader.readResponse()).thenThrow(new EOFException());

        c.stop();

        verify(mockWriter).writeStopConnection();
        verify(mockWriter).flush();
        verify(mockReader).readResponse();
    }

    @Ignore
    @Test
    public void close() {

    }

    @Test
    public void send() throws RpcException {
        ReflectionTestUtils.setField(c, "user", new ConnectionUser()); // just so connection is considered authenticated

        RpcRequest request = new RpcRequest("BAZ/FOO BAR");
        RpcResponse response = new RpcResponse("foobar");
        when(mockReader.readResponse())
                .thenReturn(new RpcResponse("1"))   // response to createContext
                .thenReturn(response);              // response to send

        RpcResponse r = c.send(request);
        assertThat(r, is(sameInstance(response)));
        assertThat(c.getCurrentRpcContext(), is("BAZ"));

        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(2)).write(requestsWritten.capture());
        assertThat(requestsWritten.getAllValues().get(0), encryptedArgRpcEq(getCreateContextRequest("BAZ")));
        assertThat(requestsWritten.getAllValues().get(1), is(request));

        verify(mockWriter, times(2)).flush();
        verify(mockReader, times(2)).readResponse();
    }

    @Test
    public void sendNoContext() throws RpcException {
        ReflectionTestUtils.setField(c, "user", new ConnectionUser()); // just so connection is considered authenticated

        RpcRequest request = new RpcRequest("FOO BAR");
        RpcResponse response = new RpcResponse("foobar");
        when(mockReader.readResponse())
                .thenReturn(new RpcResponse("1")) // response to first create context
                .thenReturn(new RpcResponse("1")) // response to second create context
                .thenReturn(response);            // response to send

        c.setCurrentRpcContext("BAZ");

        RpcResponse r = c.send(request);
        assertThat(r, sameInstance(response));

        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(3)).write(requestsWritten.capture());
        assertThat(requestsWritten.getAllValues().get(0), encryptedArgRpcEq(getCreateContextRequest("BAZ")));
        assertThat(requestsWritten.getAllValues().get(1), encryptedArgRpcEq(getCreateContextRequest("")));
        assertThat(requestsWritten.getAllValues().get(2), is(request));
        verify(mockWriter, times(3)).flush();
        verify(mockReader, times(3)).readResponse();

        assertThat(c.getCurrentRpcContext(), nullValue());
    }

    @Test
    public void unknownRpcContext() throws RpcException {
        ReflectionTestUtils.setField(c, "user", new ConnectionUser()); // just so connection is considered authenticated

        when(mockReader.readResponse()).thenReturn(new RpcResponse("The context 'FOO' does not exist on server.", "", "The context 'FOO' does not exist on server."));
        try {
            c.send(new RpcRequest("FOO/BAR"));
            Assert.fail("expected " + RpcContextNotFoundException.class);
        } catch (RpcContextNotFoundException e) {
            // NOOP
        }
        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter).write(requestsWritten.capture());
        assertThat(requestsWritten.getValue(), encryptedArgRpcEq(getCreateContextRequest("FOO")));
        assertNull(c.getCurrentRpcContext());
    }

    @Test
    public void unknownRpc() throws RpcException {
        ReflectionTestUtils.setField(c, "user", new ConnectionUser()); // just so connection is considered authenticated

        when(mockReader.readResponse()).thenReturn(new RpcResponse("1"));
        RpcRequest request = new RpcRequest("FOO/BAR");
        RpcResponse response = new RpcResponse("Remote Procedure 'BAR' doesn't exist on the server.", "", "");
        when(mockReader.readResponse())
                .thenReturn(new RpcResponse("1"))
                .thenReturn(response);
        try {
            c.send(request);
            Assert.fail("expected " + RpcNotFoundException.class);
        } catch (RpcNotFoundException e) {
            // NOOP
        }
        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(2)).write(requestsWritten.capture());
        assertThat(requestsWritten.getAllValues().get(0), encryptedArgRpcEq(getCreateContextRequest("FOO")));
        assertThat(requestsWritten.getAllValues().get(1), is(request));
        verify(mockWriter, times(2)).flush();
        verify(mockReader, times(2)).readResponse();
        assertThat(c.getCurrentRpcContext(), is("FOO"));
    }

    @Test
    public void rpcContextAccessDenied() throws RpcException {
        ReflectionTestUtils.setField(c, "user", new ConnectionUser()); // just so connection is considered authenticated

        when(mockReader.readResponse()).thenReturn(new RpcResponse("User FOO,BAR does not have access to option BAZ", "", "User FOO,BAR does not have access to option BAZ"));
        try {
            c.send(new RpcRequest("FOO/BAR"));
            Assert.fail("expected " + RpcContextAccessDeniedException.class);
        } catch (RpcContextAccessDeniedException e) {
            // NOOP
        }
        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter).write(requestsWritten.capture());
        assertThat(requestsWritten.getValue(), encryptedArgRpcEq(getCreateContextRequest("FOO")));
        assertThat(c.getCurrentRpcContext(), nullValue());
    }

    @Test
    public void fetchSystemInfo() throws RpcException {
        RpcRequest request1 = new RpcRequest("XUS SIGNON SETUP");
        RpcRequest request2 = new RpcRequest("XUS INTRO MSG");
        RpcRequest request3 = new RpcRequest("XWB GET BROKER INFO");
        when(mockReader.readResponse())
                .thenReturn(buildMockSignOnSetupResponse().toRpcResponse())
                .thenReturn(buildMockIntroMessageResponse().toRpcResponse())
                .thenReturn(buildMockBrokerInfoResponse().toRpcResponse());

        SystemInfo info = c.fetchSystemInfo();
        assertThat(info.getServer(), is("foobar.vha.domain.ext"));
        assertThat(info.getDevice(), is("/dev/null:25522"));
        assertThat(info.getUCI(), is("FOO"));
        assertThat(info.getVolume(), is("FOO"));
        assertThat(info.getDomainName(), is("FOOBAR.server.DOMAIN.EXT"));
        assertThat(info.getIntroText(), is((char) 13 + "Hello world" + LINE_DELIMITER));

        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(3)).write(requestsWritten.capture());
        assertThat(requestsWritten.getAllValues().get(0), is(request1));
        assertThat(requestsWritten.getAllValues().get(1), is(request2));
        assertThat(requestsWritten.getAllValues().get(2), is(request3));
        verify(mockWriter, times(3)).flush();
        verify(mockReader, times(3)).readResponse();
    }

    @Test
    public void authenticateSuccessfully() throws RpcException {
        RpcRequest request1 = new RpcRequest("XUS AV CODE", new RpcParam(Hash.encrypt("foo;bar")));
        RpcRequest request2 = new RpcRequest("XUS GET USER INFO");
        RpcRequest request3 = new RpcRequest("XUS DIVISION GET");
        RpcRequest request4 = new RpcRequest("XUS DIVISION SET", new RpcParam("960"));

        when(mockReader.readResponse())
                .thenReturn(buildMockAVCodeResponse().toRpcResponse())
                .thenReturn(buildMockUserInfoResponse().toRpcResponse())
                .thenReturn(buildMockDivisionGetResponse().toRpcResponse())
                .thenReturn(buildMockDivisionSetResponse().toRpcResponse());

        assertThat(c.getUserDetails(), nullValue());
        AccessVerifyConnectionSpec av = new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org");
        c.authenticate(av);

        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(4)).write(requestsWritten.capture());
        assertThat(requestsWritten.getAllValues().get(0), encryptedArgRpcEq(request1));
        assertThat(requestsWritten.getAllValues().get(1), is(request2));
        assertThat(requestsWritten.getAllValues().get(2), is(request3));
        assertThat(requestsWritten.getAllValues().get(3), is(request4));
        verify(mockWriter, times(4)).flush();
        verify(mockReader, times(4)).readResponse();

        ConnectionUserDetails user = c.getUserDetails();

        assertThat(user, not(nullValue()));
        assertThat(user.getDUZ(), is("12345"));
        assertThat(user.getCredentials(), is(av.toString()));
        assertThat(user.getName(), is("BAR,FOO"));
        assertThat(user.getStandardName(), is("Foo Bar"));
        assertThat(user.getServiceSection(), is("MEDICINE"));
        assertThat(user.getDivision(), is("960"));
        assertThat(user.getDivisionNames().get("960"), is("SLC-FO EDIS DEV"));
        assertThat(user.getLanguage(), is(""));
        assertThat(user.getTitle(), is("Scholar Extraordinaire"));
        assertThat(user.getDTime(), is("5400"));
    }

    @Ignore
    @Test
    public void authenticateAndChangeVerifyCode() throws RpcException {
        RpcRequest request1 = new RpcRequest("XUS AV CODE", new RpcParam(Hash.encrypt("foo;bar")));
        RpcRequest request2 = new RpcRequest("XUS CVC");
        RpcRequest request3 = new RpcRequest("XUS GET USER INFO");
        RpcRequest request4 = new RpcRequest("XUS DIVISION GET");
        RpcRequest request5 = new RpcRequest("XUS DIVISION SET", new RpcParam("960"));
        when(mockReader.readResponse())
                .thenReturn(buildMockAVCodeResponse().toRpcResponse())
                .thenReturn(buildMockChangeVerifyCodeResponse().toRpcResponse())
                .thenReturn(buildMockUserInfoResponse().toRpcResponse())
                .thenReturn(buildMockDivisionGetResponse().toRpcResponse())
                .thenReturn(buildMockDivisionSetResponse().toRpcResponse());

        assertNull(c.getUserDetails());

        ChangeVerifyCodeConnectionSpec cvc = new ChangeVerifyCodeConnectionSpec("960", "foo", "bar", "baz", "baz", null, null);
        c.authenticate(cvc);

        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(5)).write(requestsWritten.capture());
        assertThat(requestsWritten.getAllValues().get(0), encryptedArgRpcEq(request1));
        assertThat(requestsWritten.getAllValues().get(1), is(request2));
        assertThat(requestsWritten.getAllValues().get(2), is(request3));
        assertThat(requestsWritten.getAllValues().get(3), is(request4));
        assertThat(requestsWritten.getAllValues().get(4), is(request5));
        verify(mockWriter, times(5)).flush();
        verify(mockReader, times(5)).readResponse();

        ConnectionUserDetails user = c.getUserDetails();

        assertThat(user, notNullValue());
        assertEquals("12345", user.getDUZ());
        assertEquals(cvc.toString(), user.getCredentials());
        assertEquals("BAR,FOO", user.getName());
        assertEquals("Foo Bar", user.getStandardName());
        assertEquals("MEDICINE", user.getServiceSection());
        assertEquals("960", user.getDivision());
        assertEquals("SLC-FO EDIS DEV", user.getDivisionNames().get("960"));
        assertEquals("", user.getLanguage());
        assertEquals("Scholar Extraordinaire", user.getTitle());
        assertEquals("5400", user.getDTime());
    }

    @Test
    public void authenticateWithAppHandleSuccessfully() throws RpcException {
        RpcRequest request1 = new RpcRequest("XUS AV CODE", new RpcParam("00106F8"));
        RpcRequest request2 = new RpcRequest("XUS GET USER INFO");
        RpcRequest request3 = new RpcRequest("XUS DIVISION GET");
        RpcRequest request4 = new RpcRequest("XUS DIVISION SET", new RpcParam("960"));

        when(mockReader.readResponse())
                .thenReturn(buildMockAuthWithAppHandleResponse().toRpcResponse())
                .thenReturn(buildMockUserInfoResponse().toRpcResponse())
                .thenReturn(buildMockDivisionGetResponse().toRpcResponse())
                .thenReturn(buildMockDivisionSetResponse().toRpcResponse());

        assertThat(c.getUserDetails(), nullValue());
        c.authenticate(new AppHandleConnectionSpec("00106F8", "960", "123.45.67.89", "www.example.org"));

        ArgumentCaptor<RpcRequest> requestsWritten = ArgumentCaptor.forClass(RpcRequest.class);
        verify(mockWriter, times(4)).write(requestsWritten.capture());

        assertThat(requestsWritten.getAllValues().get(0), is(request1));
        assertThat(requestsWritten.getAllValues().get(1), is(request2));
        assertThat(requestsWritten.getAllValues().get(2), is(request3));
        assertThat(requestsWritten.getAllValues().get(3), is(request4));

        ConnectionUserDetails user = c.getUserDetails();

        assertThat(user, not(nullValue()));
        assertThat(user.getDUZ(), is("12345"));
        assertThat(user.getName(), is("BAR,FOO"));
        assertThat(user.getStandardName(), is("Foo Bar"));
        assertThat(user.getServiceSection(), is("MEDICINE"));
        assertThat(user.getDivision(), is("960"));
        assertThat(user.getDivisionNames().get("960"), is("SLC-FO EDIS DEV"));
        assertThat(user.getLanguage(), is(""));
        assertThat(user.getTitle(), is("Scholar Extraordinaire"));
        assertThat(user.getDTime(), is("5400"));
    }

    public static RpcResponseBuilder buildMockSignOnSetupResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("foobar.vha.domain.ext");
        rb.appendLine("FOO");
        rb.appendLine("FOO");
        rb.appendLine("/dev/null:25522");
        rb.appendLine("5");
        rb.appendLine("0");
        rb.appendLine("FOOBAR.server.DOMAIN.EXT");
        rb.appendLine("0");
        return rb;
    }

    public static RpcResponseBuilder buildMockIntroMessageResponse() {
        return new RpcResponseBuilder(NewRpcMessageWriter.SPack("Hello world" + LINE_DELIMITER));
    }

    public static RpcResponseBuilder buildMockAVCodeResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("12345");
        rb.appendLine("0");
        rb.appendLine("0");
        rb.appendLine();
        rb.appendLine("0");
        rb.appendLine("0");
        rb.appendLine();
        rb.appendLine("Good evening foo");
        rb.appendLine("     You last signed on today at 17:21");
        return rb;
    }

    public static RpcResponseBuilder buildMockAppHandleResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("12345");
//        rb.appendLine("0");
//        rb.appendLine("0");
//        rb.appendLine();
//        rb.appendLine("0");
//        rb.appendLine("0");
//        rb.appendLine();
//        rb.appendLine("Good evening foo");
//        rb.appendLine("     You last signed on today at 17:21");
        return rb;
    }


    public static RpcResponseBuilder buildMockDivisionGetResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("2");
        rb.appendLine("500^CAMP MASTER^500^1");
        rb.appendLine("21787^SLC-FO EDIS DEV^960");
        return rb;
    }

    public static RpcResponseBuilder buildMockDivisionSetResponse() {
        return new RpcResponseBuilder("1");
    }

    public static RpcResponseBuilder buildMockUserInfoResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("12345");
        rb.appendLine("BAR,FOO");
        rb.appendLine("Foo Bar");
        rb.appendLine("12345^SLC-FO EDIS DEV^960");
        rb.appendLine("Scholar Extraordinaire");
        rb.appendLine("MEDICINE");
        rb.appendLine();
        rb.appendLine("5400");
        rb.appendLine();
        return rb;
    }

    public static RpcResponseBuilder buildMockBrokerInfoResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("3600");
        return rb;
    }

    public static RpcResponseBuilder buildMockChangeVerifyCodeResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        return rb;
    }

//    @Test
//    public void testRpcRequestEncoding() {
//        MockSocket s = new MockSocket(new byte[0]);
//        VistaConnectionImpl c = new VistaConnectionImpl(s);
//
//        List<ParamRecord> params = new ArrayList<ParamRecord>();
//        params.add(new ParamRecord("baz"));
//        params.add(new ParamRecord("spaz"));
//        c.send(new RpcRequest("FOO BAR", params));
//
//        assertEquals(32, s.getBytesSent().length);
//    }

    public RpcRequest getCreateContextRequest(String rpcContext) throws RpcException {
        RpcRequest request = new RpcRequest("XWB CREATE CONTEXT", new RpcParam(Hash.encrypt(rpcContext)));
        return request;
    }

    public static RpcResponseBuilder buildMockAuthWithAppHandleResponse() {
        RpcResponseBuilder rb = new RpcResponseBuilder();
        rb.appendLine("12345");
        rb.appendLine("0");
        rb.appendLine("0");
        return rb;
    }


    public static Matcher<RpcRequest> encryptedArgRpcEq(RpcRequest in) {
        return new EncryptedArgRpcRequestEquals(in);
    }

    public static class EncryptedArgRpcRequestEquals extends ArgumentMatcher<RpcRequest> {

        private RpcRequest expected;

        public EncryptedArgRpcRequestEquals(RpcRequest expected) {
            this.expected = expected;
        }

        @Override
        public boolean matches(Object actual) {
            RpcRequest that = (RpcRequest) actual;

            if (expected.equals(that)) return true;
            if (expected.getParams().isEmpty() && that.getParams().isEmpty()) return true;
            if (expected.getParams().size() != that.getParams().size()) return false;

            String expectedEncryptedValue = expected.getParams().get(0).getValue();
            String expectedValue = Hash.decrypt(expectedEncryptedValue);
            String thatEncryptedValue = that.getParams().get(0).getValue();
            String thatValue = Hash.decrypt(thatEncryptedValue);

            return expectedValue.equals(thatValue);
        }
    }
}