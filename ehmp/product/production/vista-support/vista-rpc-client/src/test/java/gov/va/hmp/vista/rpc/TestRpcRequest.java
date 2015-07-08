package gov.va.hmp.vista.rpc;

import gov.va.hmp.vista.rpc.broker.protocol.Mult;
import gov.va.hmp.vista.rpc.broker.protocol.RpcParam;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

import static org.junit.Assert.*;

public class TestRpcRequest {

    @Test
    public void constructFromAbsoluteUri() {
        RpcRequest r = new RpcRequest("vrpcb://960:10vehu;vehu10@localhost:9060/FOO/BAR");
//        assertEquals("vrpcb://960:10vehu;vehu10@localhost:9060/FOO/BAR?timeout=30", r.getURI().toString());
        assertEquals("vrpcb://localhost:9060/FOO/BAR?timeout=30", r.getUriString());
        assertEquals("960:10vehu;vehu10", r.getCredentials().toString());
        Assert.assertEquals(new RpcHost("localhost", 9060), r.getHost());
        assertEquals("960:10vehu;vehu10", r.getCredentials());
        assertEquals("FOO", r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
        assertTrue(r.isAbsolute());
    }

    @Test
    public void constructFromAmbiguousHostUri() {
        RpcRequest r = new RpcRequest("vrpcb://9F06/FOO BAR/BAZ SPAZ");
        assertEquals("vrpcb://9F06/FOO BAR/BAZ SPAZ?timeout=30", r.getUriString());
        assertEquals(new RpcHost("9F06", -1), r.getHost());
        assertNull(r.getCredentials());
        assertEquals("FOO BAR", r.getRpcContext());
        assertEquals("BAZ SPAZ", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
        assertTrue(r.isAbsolute());
    }

    @Test
    public void constructFromFields() {
        RpcRequest r = new RpcRequest(new RpcHost("localhost", 9060), "960:10vehu;vehu10", "FOO", "BAR");
        assertEquals("vrpcb://localhost:9060/FOO/BAR?timeout=30", r.getUriString());
        assertEquals("960:10vehu;vehu10", r.getCredentials());
        assertEquals(new RpcHost("localhost", 9060), r.getHost());
        assertEquals("FOO", r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
        assertTrue(r.isAbsolute());
    }

    @Test
    public void constructFromVistaLinkUri() {
        RpcRequest r = new RpcRequest("vlink://960:10vehu;vehu10@localhost:9060/FOO/BAR");
        assertEquals("vlink://localhost:9060/FOO/BAR?timeout=30", r.getUriString());
        assertEquals(new RpcHost("localhost", 9060, "vlink"), r.getHost());
        assertEquals("960:10vehu;vehu10", r.getCredentials());
        assertEquals("FOO", r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
        assertTrue(r.isAbsolute());
    }

    @Test
    public void constructFromRelativeUri() {
        RpcRequest r = new RpcRequest("/FOO/BAR");
        assertEquals("/FOO/BAR?timeout=30", r.getUriString());
        assertNull(r.getHost());
        assertNull(r.getCredentials());
        assertEquals("FOO", r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
    }

    @Test
    public void constructFromRelativeUriNoStartingSlash() {
        RpcRequest r = new RpcRequest("FOO/BAR");
        assertEquals("/FOO/BAR?timeout=30", r.getUriString());
        assertNull(r.getHost());
        assertNull(r.getCredentials());
        assertEquals("FOO", r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
    }

    @Test
    public void constructFromRelativeUriNoRpcContext() {
        RpcRequest r = new RpcRequest("/BAR");
        assertEquals("/BAR?timeout=30", r.getUriString());
        assertNull(r.getHost());
        assertNull(r.getCredentials());
        assertNull(r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
    }

    @Test
    public void constructFromRelativeUriNoRpcContextNoStartingSlash() {
        RpcRequest r = new RpcRequest("BAR");
        assertEquals("/BAR?timeout=30", r.getUriString());
        assertNull(r.getHost());
        assertNull(r.getCredentials());
        assertNull(r.getRpcContext());
        assertEquals("BAR", r.getRpcName());
        assertTrue(r.getParams().isEmpty());
        assertEquals(RpcRequest.DEFAULT_VERSION, r.getRpcVersion());
        assertEquals(RpcRequest.DEFAULT_TIMEOUT, r.getTimeout());
    }

    @Test
    public void equalsRpcContextAndName() {
        RpcRequest r1 = new RpcRequest("FOO");
        RpcRequest r2 = new RpcRequest("BAR");
        RpcRequest r3 = new RpcRequest("FOO/BAR");
        RpcRequest r4 = new RpcRequest("BAZ/BAR");

        assertTrue(r1.equals(r1));

        assertFalse(r1.equals(r2));
        assertFalse(r2.equals(r1));

        assertFalse(r2.equals(r3));
        assertFalse(r3.equals(r2));

        assertFalse(r3.equals(r4));
        assertFalse(r4.equals(r3));
    }

    @Test
    public void equalsRpcParams() {
        RpcRequest r1 = new RpcRequest("FOO/BAR", new RpcParam("3"));
        RpcRequest r2 = new RpcRequest("FOO/BAR", new RpcParam("3"));
        RpcRequest r3 = new RpcRequest("FOO/BAR", new RpcParam("4"));

        assertTrue(r1.equals(r1));

        assertTrue(r1.equals(r2));
        assertTrue(r2.equals(r1));

        assertFalse(r2.equals(r3));
        assertFalse(r3.equals(r2));
    }

    @Test
    public void testToString() {
        RpcRequest r = new RpcRequest("FOO/BAR");
        assertEquals("/FOO/BAR?timeout=" + r.getTimeout(), r.toString());
    }

    @Test
    public void testToStringWithParams() {
        RpcRequest r = new RpcRequest("FOO/BAR", "baz", "spaz");
        assertEquals("/FOO/BAR?[1]=baz&[2]=spaz&timeout=" + r.getTimeout(), r.toString());
    }

    @Test
    public void testToStringWithNoContext() {
        RpcRequest r = new RpcRequest("BAR");
        assertEquals("/BAR?timeout=" + r.getTimeout(), r.toString());
    }

    @Test
    public void addParam() {
        RpcRequest r = new RpcRequest("FOO/BAR");
        RpcParam param = new RpcParam("baz");
        r.addParam(param);
        assertEquals(1, r.getParams().size());
        assertSame(param, r.getParams().get(0));
    }

    @Test
    public void addParamStringLiteral() {
        RpcRequest r = new RpcRequest("FOO/BAR");
        r.addParam("baz");
        assertEquals(1, r.getParams().size());
        assertSame("baz", r.getParams().get(0).getValue());
        assertSame(RpcParam.Type.LITERAL, r.getParams().get(0).getType());
    }

    @Test
    public void addParamObject() {
        TestParam p = new TestParam("baz");

        RpcRequest r = new RpcRequest("FOO/BAR");
        r.addParam(p);
        assertEquals(1, r.getParams().size());
        assertSame("baz", r.getParams().get(0).getValue());
        assertSame(RpcParam.Type.LITERAL, r.getParams().get(0).getType());
    }

    @Test
    public void addParamMap() {
        SortedMap<String, String> p = new TreeMap<String, String>();
        p.put("fred", "wilma");
        p.put("barney", "betty");

        RpcRequest r = new RpcRequest("FOO/BAR");
        r.addParam(p);
        assertEquals(1, r.getParams().size());
        assertSame(RpcParam.Type.LIST, r.getParams().get(0).getType());
        Mult m = r.getParams().get(0).getMult();
        assertEquals("\"barney\"", m.getFirst());
        assertEquals("\"fred\"", m.getLast());
        assertEquals("wilma", m.get("\"fred\""));
        assertEquals("betty", m.get("\"barney\""));
    }

    @Test
    public void addParamList() {
        List<String> p = new ArrayList<String>();
        p.add("foo");
        p.add("bar");

        RpcRequest r = new RpcRequest("FOO/BAR");
        r.addParam(p);
        assertEquals(1, r.getParams().size());
        assertSame(RpcParam.Type.LIST, r.getParams().get(0).getType());
        Mult m = r.getParams().get(0).getMult();
        assertEquals("0", m.getFirst());
        assertEquals("1", m.getLast());
        assertEquals("foo", m.get("0"));
        assertEquals("bar", m.get("1"));
    }

    @Test
    public void testAddParamRejectsNullArguments() {
        RpcRequest r = new RpcRequest("FOO", "BAR");
        try {
            r.addParam((Object) null);
            fail("expected IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            // NOOP
        }
    }

    private static class TestParam {

        private String value;

        public TestParam(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }
}
