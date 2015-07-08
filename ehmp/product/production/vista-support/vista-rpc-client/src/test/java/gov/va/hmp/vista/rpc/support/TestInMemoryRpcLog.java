package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class TestInMemoryRpcLog {

    private RpcHost mockHost;
    private RpcRequest mockRequest;
    private InMemoryRpcLog rpcLog;

    @Before
    public void setUp() throws Exception {
        mockHost = new RpcHost("example.com", 1234);
        mockRequest = new RpcRequest(mockHost, "foo;bar", "FOO", "BAR");
        rpcLog = new InMemoryRpcLog();
    }

    @Test
    public void testDefaultNotLogging() throws Exception {
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Fred")));
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Wilma")));
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Barney")));
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Betty")));

        assertThat(rpcLog.isEnabledFor(mockHost, "foo;bar"), is(false));
        assertThat(rpcLog.isAllEnabled(), is(false));

        List<RpcEvent> rpcs = rpcLog.getRpcEvents();
        assertThat(rpcs.isEmpty(), equalTo(true));

        rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");
        assertThat(rpcs.isEmpty(), equalTo(true));
    }

    @Test
    public void testEnableForAuthority() throws Exception {
        rpcLog.enableFor(mockHost, "foo;bar");
        assertThat(rpcLog.isEnabledFor(mockHost, "foo;bar"), is(true));

        RpcEvent rpc = new RpcEvent(mockRequest, new RpcResponse("Fred"));
        rpcLog.onRpc(rpc);

        List<RpcEvent> rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");
        assertThat(rpcs.size(), equalTo(1));
        assertThat(rpcs, hasItem(rpc));

        rpc = new RpcEvent(mockRequest, new RpcResponse("Wilma"));
        rpcLog.onRpc(rpc);
        rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");
        assertThat(rpcs.size(), equalTo(2));
        assertThat(rpcs, hasItem(rpc));

        rpcLog.disableFor(mockHost, "foo;bar");
        assertThat(rpcLog.isEnabledFor(mockHost, "foo;bar"), is(false));

        rpc = new RpcEvent(mockRequest, new RpcResponse("Barney"));
        rpcLog.onRpc(rpc);
        rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");
        assertThat(rpcs.size(), equalTo(0));
        assertThat(rpcs.contains(rpc), is(false));
    }

    @Test
    public void testMaxTotalWithAllEnabled() {
        rpcLog.setAllEnabled(true);
        rpcLog.setMaxTotal(2);

        assertThat(rpcLog.isAllEnabled(), is(true));
        assertThat(rpcLog.getMaxTotal(), is(2));

        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Fred")));
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Wilma")));

        RpcEvent barney = new RpcEvent(mockRequest, new RpcResponse("Barney"));
        RpcEvent betty = new RpcEvent(mockRequest, new RpcResponse("Betty"));

        rpcLog.onRpc(barney);
        rpcLog.onRpc(betty);

        assertThat(rpcLog.getRpcEvents().size(), is(2));
        assertThat(rpcLog.getRpcEvents().get(1), sameInstance(barney));
        assertThat(rpcLog.getRpcEvents().get(0), sameInstance(betty));

        rpcLog.setMaxTotal(1);

        assertThat(rpcLog.getRpcEvents().size(), is(1));
        assertThat(rpcLog.getRpcEvents().get(0), sameInstance(betty));

    }

    @Test
    public void testMaxTotalForAuthority() {
        rpcLog.enableFor(mockHost, "foo;bar");
        rpcLog.setMaxTotal(2);

        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Fred")));
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Wilma")));

        RpcEvent barney = new RpcEvent(mockRequest, new RpcResponse("Barney"));
        RpcEvent betty = new RpcEvent(mockRequest, new RpcResponse("Betty"));

        rpcLog.onRpc(barney);
        rpcLog.onRpc(betty);

        List<RpcEvent> rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");

        assertThat(rpcs.size(), is(2));
        assertThat(rpcs.get(1), sameInstance(barney));
        assertThat(rpcs.get(0), sameInstance(betty));

        rpcLog.setMaxTotal(1);

        rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");
        assertThat(rpcs.size(), is(1));
        assertThat(rpcLog.getRpcEvents().get(0), sameInstance(betty));
    }

    @Test
    public void testFilter() {
        // set up filter to reject Fred/Wilma and accept Barney/Betty
        rpcLog.setFilters(Collections.<RpcLogFilter>singletonList(new RpcLogFilter() {
            @Override
            public boolean isLoggable(RpcEvent rpcEvent) {
                String response = rpcEvent.getResponse().toString();
                return response.equals("Barney") || response.equals("Betty");
            }
        }));

        rpcLog.enableFor(mockHost, "foo;bar");
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Fred")));
        rpcLog.onRpc(new RpcEvent(mockRequest, new RpcResponse("Wilma")));
        RpcEvent barney = new RpcEvent(mockRequest, new RpcResponse("Barney"));
        RpcEvent betty = new RpcEvent(mockRequest, new RpcResponse("Betty"));
        rpcLog.onRpc(barney);
        rpcLog.onRpc(betty);

        List<RpcEvent> rpcs = rpcLog.getRpcEvents(mockHost, "foo;bar");
        assertThat(rpcs.size(), equalTo(2));
        assertThat(rpcLog.getRpcEvents().get(1), sameInstance(barney));
        assertThat(rpcLog.getRpcEvents().get(0), sameInstance(betty));

    }
}
