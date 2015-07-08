package gov.va.hmp.vista.rpc;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;

public class TestRpcResponse {
    @Test
    public void construct() {
        RpcResponse r = new RpcResponse("foo", "bar", "baz");
        assertEquals("foo", r.getSecuritySegment());
        assertEquals("bar", r.getApplicationSegment());
        assertEquals("baz", r.toString());
        assertEquals(-1L, r.getElapsedMillis());
        for (RpcPhase phase : RpcPhase.values()) {
            assertEquals(-1L, r.getElapsedMillis(phase));
        }
    }

    @Test
    public void toLines() {
        RpcResponse r = new RpcResponse("sec", "app", "foo\r\nbar\r\nbaz\r\n");
        assertArrayEquals(new String[]{"foo", "bar", "baz"}, r.toLines());
    }

    @Test
    public void elapsedMillis() {
        RpcResponse r = new RpcResponse("foo", "bar", "baz");
        r.setElapsedMillis(RpcPhase.CONNECTING, 10L);
        r.setElapsedMillis(RpcPhase.BLOCKING, 20L);
        r.setElapsedMillis(RpcPhase.SENDING, 30L);
        r.setElapsedMillis(RpcPhase.WAITING, 40L);
        r.setElapsedMillis(RpcPhase.RECEIVING, 50L);
        assertThat(r.getElapsedMillis(RpcPhase.CONNECTING), is(10L));
        assertThat(r.getElapsedMillis(RpcPhase.BLOCKING), is(20L));
        assertThat(r.getElapsedMillis(RpcPhase.SENDING), is(30L));
        assertThat(r.getElapsedMillis(RpcPhase.WAITING), is(40L));
        assertThat(r.getElapsedMillis(RpcPhase.RECEIVING), is(50L));
        assertThat(r.getElapsedMillis(), is(150L));

        r.setElapsedMillis(RpcPhase.RECEIVING, 250L);
        assertThat(r.getElapsedMillis(RpcPhase.RECEIVING), is(250L));
        assertThat(r.getElapsedMillis(), is(350L));
    }
}
