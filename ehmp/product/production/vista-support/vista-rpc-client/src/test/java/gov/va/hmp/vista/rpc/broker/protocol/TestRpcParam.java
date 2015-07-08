package gov.va.hmp.vista.rpc.broker.protocol;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.TreeMap;

import static org.junit.Assert.*;

public class TestRpcParam {
    @Test
    public void testConstructValue() {
        RpcParam p = new RpcParam("foo");
        assertEquals("foo", p.getValue());
        assertEquals(RpcParam.Type.LITERAL, p.getType());
    }

    @Test
    public void testConstructValueAndType() {
        RpcParam p = new RpcParam("foo", RpcParam.Type.REFERENCE);
        assertEquals("foo", p.getValue());
        assertEquals(RpcParam.Type.REFERENCE, p.getType());
    }

    @Test
    public void testConstructMult() {
        Mult m = new Mult();
        RpcParam p = new RpcParam(m);
        assertEquals(m, p.getMult());
        assertEquals(RpcParam.Type.LIST, p.getType());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testConstructNullString() {
        new RpcParam((String) null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testConstructNullMult() {
        new RpcParam((Mult) null);
    }

    @Test
    public void testEquals() {
        RpcParam p1 = new RpcParam("foo");
        RpcParam p2 = new RpcParam("foo");
        RpcParam p3 = new RpcParam("bar");

        assertTrue(p1.equals(p1));

        assertTrue(p1.equals(p2));
        assertTrue(p2.equals(p1));

        assertFalse(p2.equals(p3));
        assertFalse(p3.equals(p2));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateFromNull() {
        RpcParam.create((Object) null);
    }

    @Test
    public void testCreateFromString() {
        RpcParam p = RpcParam.create("foo");
        assertEquals(RpcParam.Type.LITERAL, p.getType());
        assertEquals("foo", p.getValue());
        assertNull(p.getMult());
    }

    @Test
    public void testCreateFromList() {
        RpcParam p = RpcParam.create(Arrays.asList("foo", "bar", "baz"));
        assertEquals(RpcParam.Type.LIST, p.getType());
        assertEquals("", p.getValue());
        assertNotNull(p.getMult());
    }

    @Test
    public void testCreateFromMap() {
        Map m = new TreeMap();
        m.put("foo", "bar");
        m.put("baz", "spaz");

        RpcParam p = RpcParam.create(m);
        assertEquals(RpcParam.Type.LIST, p.getType());
        assertEquals("", p.getValue());
        assertNotNull(p.getMult());
    }

    @Test
    public void testCreateFromArray() {
        RpcParam p = RpcParam.create(new Integer[]{9, 23, 42});
        assertEquals(RpcParam.Type.LIST, p.getType());
        assertEquals("", p.getValue());
        assertNotNull(p.getMult());
    }

    @Test
    public void testCreateFromPrimitiveArray() {
        RpcParam p = RpcParam.create(new int[]{9, 23, 42});
        assertEquals(RpcParam.Type.LIST, p.getType());
        assertEquals("", p.getValue());
        assertNotNull(p.getMult());
    }

    @Test
    public void testCreateFromBoolean() {
        RpcParam p = RpcParam.create(true);
        assertEquals(RpcParam.Type.LITERAL, p.getType());
        assertEquals("1", p.getValue());

        p = RpcParam.create(false);
        assertEquals(RpcParam.Type.LITERAL, p.getType());
        assertEquals("0", p.getValue());

        p = RpcParam.create(Boolean.TRUE);
        assertEquals(RpcParam.Type.LITERAL, p.getType());
        assertEquals("1", p.getValue());

        p = RpcParam.create(Boolean.FALSE);
        assertEquals(RpcParam.Type.LITERAL, p.getType());
        assertEquals("0", p.getValue());
    }

    @Test
    public void testCreateFromJsonNode() throws IOException {
        JsonNode json = new ObjectMapper().readTree("{\"foo\":\"bar\",\"baz\":\"spaz\"}");
        RpcParam p = RpcParam.create(json);
        assertEquals(RpcParam.Type.LIST, p.getType());
        assertEquals("", p.getValue());
        assertNotNull(p.getMult());
    }
}
