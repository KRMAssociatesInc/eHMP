package gov.va.hmp.vista.rpc;

import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;

public class TestRpcEvent {

    private RpcHost host;
    private RpcRequest request;
    private RpcEvent e;

    @Before
    public void setUp() throws Exception {
        host = new RpcHost("example.com", 1234);
        request = new RpcRequest(host, "foo;bar", "FOO", "BAR");
    }

    @Test
    public void testConstruct() throws Exception {
        e = new RpcEvent(request, new RpcResponse("BAZ"));

        assertThat(e.getRequest(), sameInstance(request));
        assertThat(e.getHost(), sameInstance(host));
        assertThat(e.isError(), equalTo(false));
        assertThat(e.getResponse().toString(), equalTo("BAZ"));
    }

    @Test
    public void testConstructError() throws Exception {
        e = new RpcEvent(request, new RpcException("BAZ"));

        assertThat(e.getRequest(), sameInstance(request));
        assertThat(e.getHost(), sameInstance(host));
        assertThat(e.isError(), equalTo(true));
        assertThat(e.getException().getMessage(), equalTo("BAZ"));
    }
}
