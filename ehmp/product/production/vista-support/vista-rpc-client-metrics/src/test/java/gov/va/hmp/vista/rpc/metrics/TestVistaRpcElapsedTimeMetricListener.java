package gov.va.hmp.vista.rpc.metrics;

import com.codahale.metrics.MetricRegistry;
import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.Before;
import org.junit.Test;

import static gov.va.hmp.vista.rpc.metrics.VistaRpcElapsedTimeMetricListener.DEFAULT_METRICS_BASE_NAME;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class TestVistaRpcElapsedTimeMetricListener {

    private MetricRegistry metrics;
    private VistaRpcElapsedTimeMetricListener l;

    @Before
    public void setUp() throws Exception {
        metrics = new MetricRegistry();
        l = new VistaRpcElapsedTimeMetricListener(metrics, "foo");
    }

    @Test
    public void testRpcNameIncludes() throws Exception {
        RpcEvent foo = new RpcEvent(new RpcRequest("vrpcb://example.org:9600/mock/foo"), new RpcResponse("foo"));
        RpcEvent bar = new RpcEvent(new RpcRequest("vrpcb://example.org:9600/mock/bar"), new RpcResponse("bar"));
        l.onRpc(foo);
        l.onRpc(bar);

        assertThat(metrics.getTimers().containsKey(DEFAULT_METRICS_BASE_NAME + ".example.org:9600/mock/foo?timeout=30"), is(true));
        assertThat(metrics.getTimers().containsKey(DEFAULT_METRICS_BASE_NAME + ".example.org:9600/mock/bar?timeout=30"), is(false));
    }

    @Test
    public void testExceptionEvent() throws Exception {
        l.onRpc(new RpcEvent(new RpcRequest("vrpcb://example.org:9600/mock/foo"), new RpcException("foobar")));
    }
}
