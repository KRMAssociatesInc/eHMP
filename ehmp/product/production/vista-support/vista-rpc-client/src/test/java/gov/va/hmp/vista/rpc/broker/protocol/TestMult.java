package gov.va.hmp.vista.rpc.broker.protocol;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import junit.framework.TestCase;
import org.junit.Test;

import java.io.IOException;
import java.util.*;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

/**
 * TODO: Document gov.va.cpe.vista.protocol
 */
public class TestMult extends TestCase {

    private Mult m = new Mult();

    @Test
    public void testConstruct() {
        assertEquals(0, m.getCount());
        assertEquals("", m.getFirst());
        assertEquals("", m.getLast());
//        assertFalse(m.isSorted()); TODO: implement isSorted()
    }

    @Test
    public void testGetPut() {
        m.put("foo", "bar");
        assertEquals(1, m.getCount());
        assertEquals("foo", m.getFirst());
        assertEquals("foo", m.getLast());
        assertEquals("bar", m.get("foo"));
    }

    @Test
    public void testPosition() {
        m.put("foo", "fred");
        m.put("bar", "barney");
        m.put("baz", "wilma");
        assertEquals(0, m.position("foo"));
        assertEquals(1, m.position("bar"));
        assertEquals(2, m.position("baz"));
        assertEquals(-1, m.position("taz"));
    }

    @Test
    public void testSubscript() {
        m.put("foo", "fred");
        m.put("bar", "barney");
        m.put("baz", "wilma");
        assertEquals("foo", m.subscript(0));
        assertEquals("bar", m.subscript(1));
        assertEquals("baz", m.subscript(2));
        assertEquals("", m.subscript(-1));
    }

    @Test
    public void testOrder() {
        m.put("foo", "fred");
        m.put("bar", "barney");
        m.put("baz", "wilma");
        assertEquals("foo", m.order("", 1));
        assertEquals("bar", m.order("foo", 1));
        assertEquals("baz", m.order("bar", 1));
        assertEquals("", m.order("baz", 1));
        assertEquals("baz", m.order("", -1));
        assertEquals("bar", m.order("baz", -1));
        assertEquals("foo", m.order("bar", -1));
        assertEquals("", m.order("foo", -1));
    }

    @Test
    public void testEquals() {
        Mult m1 = new Mult();
        m1.put("foo", "bar");
        m1.put("baz", "spaz");

        Mult m2 = new Mult();
        m2.put("foo", "bar");
        m2.put("baz", "spaz");

        Mult m3 = new Mult();
        m3.put("foo", "bar");

        Mult m4 = new Mult();
        m4.put("foo", "bar");
        m4.put("baz", "waz");

        assertTrue(m1.equals(m1));

        assertTrue(m2.equals(m1));
        assertTrue(m1.equals(m2));

        assertFalse(m3.equals(m1));
        assertFalse(m1.equals(m3));

        assertFalse(m4.equals(m1));
        assertFalse(m1.equals(m4));
    }

    @Test
    public void testFromMap() {
        SortedMap<String, String> p = new TreeMap<String, String>();
        p.put("fred", "wilma");
        p.put("barney", "betty");

        Mult m = Mult.create(p);
        assertEquals("\"barney\"", m.getFirst());
        assertEquals("\"fred\"", m.getLast());
        assertEquals("wilma", m.get("\"fred\""));
        assertEquals("betty", m.get("\"barney\""));
    }

    @Test
    public void testFromList() {
        List<String> p = new ArrayList<String>();
        p.add("foo");
        p.add("bar");

        Mult m = Mult.create(p);
        assertEquals("0", m.getFirst());
        assertEquals("1", m.getLast());
        assertEquals("foo", m.get("0"));
        assertEquals("bar", m.get("1"));
    }

    @Test
    public void testFromMapWithNestedList() {
        SortedMap p = new TreeMap();
        p.put("fred", "wilma");
        p.put("foo", Arrays.asList("bar", "baz"));
        p.put("barney", "betty");

        Mult m = Mult.create(p);
        assertEquals(4, m.getCount());
        assertEquals("\"barney\"", m.getFirst());
        assertEquals("\"foo\",0", m.subscript(1));
        assertEquals("\"foo\",1", m.subscript(2));
        assertEquals("\"fred\"", m.getLast());
        assertEquals("wilma", m.get("\"fred\""));
        assertEquals("bar", m.get("\"foo\",0"));
        assertEquals("baz", m.get("\"foo\",1"));
        assertEquals("betty", m.get("\"barney\""));
    }

    @Test
    public void testFromListWithNestedMap() {
        SortedMap m = new TreeMap();
        m.put("fred", "wilma");
        m.put("barney", "betty");

        List p = new ArrayList();
        p.add("foo");
        p.add(m);
        p.add("bar");

        Mult mult = Mult.create(p);
        assertEquals(4, mult.getCount());
        assertEquals("0", mult.subscript(0));
        assertEquals("1,\"barney\"", mult.subscript(1));
        assertEquals("1,\"fred\"", mult.subscript(2));
        assertEquals("2", mult.subscript(3));

        assertEquals("foo", mult.get("0"));
        assertEquals("wilma", mult.get("1,\"fred\""));
        assertEquals("betty", mult.get("1,\"barney\""));
        assertEquals("bar", mult.get("2"));
    }

    @Test
    public void testFromMapWithNestedMap() {
        SortedMap p = new TreeMap();
        p.put("foo", "bar");
        p.put("baz", "spaz");

        SortedMap m = new TreeMap();
        m.put("fred", "wilma");
        m.put("yope", p);
        m.put("barney", "betty");

        Mult mult = Mult.create(m);
        assertEquals(4, mult.getCount());
        assertEquals("\"barney\"", mult.subscript(0));
        assertEquals("\"fred\"", mult.subscript(1));
        assertEquals("\"yope\",\"baz\"", mult.subscript(2));
        assertEquals("\"yope\",\"foo\"", mult.subscript(3));

        assertEquals("betty", mult.get("\"barney\""));
        assertEquals("wilma", mult.get("\"fred\""));
        assertEquals("bar", mult.get("\"yope\",\"foo\""));
        assertEquals("spaz", mult.get("\"yope\",\"baz\""));
    }

    @Test
    public void testFromMapWithNestedJson() throws IOException {
        SortedMap p = new TreeMap();
        p.put("fred", "wilma");
        p.put("yope", new ObjectMapper().readTree("{\"foo\": \"bar\",\"baz\": \"spaz\"}"));
        p.put("barney", "betty");

        Mult m = Mult.create(p);
        assertEquals(4, m.getCount());
        assertEquals("\"barney\"", m.getFirst());
        assertEquals("\"fred\"", m.subscript(1));
        assertEquals("\"yope\",\"foo\"", m.subscript(2));
        assertEquals("\"yope\",\"baz\"", m.getLast());

        assertEquals("wilma", m.get("\"fred\""));
        assertEquals("betty", m.get("\"barney\""));
        assertEquals("bar", m.get("\"yope\",\"foo\""));
        assertEquals("spaz", m.get("\"yope\",\"baz\""));
    }

    @Test
    public void testFromListWithNestedJson() throws IOException {
        JsonNode m = new ObjectMapper().readTree("{\"fred\": \"wilma\",\"barney\": \"betty\"}");

        List p = new ArrayList();
        p.add("foo");
        p.add(m);
        p.add("bar");

        Mult mult = Mult.create(p);
        assertEquals(4, mult.getCount());
        assertEquals("0", mult.subscript(0));
        assertEquals("1,\"fred\"", mult.subscript(1));
        assertEquals("1,\"barney\"", mult.subscript(2));
        assertEquals("2", mult.subscript(3));

        assertEquals("foo", mult.get("0"));
        assertEquals("wilma", mult.get("1,\"fred\""));
        assertEquals("betty", mult.get("1,\"barney\""));
        assertEquals("bar", mult.get("2"));
    }

    @Test
    public void testToMap() {
        SortedMap<String, String> p = new TreeMap<String, String>();
        p.put("fred", "wilma");
        p.put("barney", "betty");

        Mult mult = Mult.create(p);

        Map<String,Object> map = mult.toMap();
        assertThat(map.size(), is(mult.getCount()));
        assertThat((String) map.get("fred"), is("wilma"));
        assertThat((String) map.get("barney"), is("betty"));
    }

    @Test
    public void testToMapFromList() {
        List<String> p = new ArrayList<String>();
        p.add("foo");
        p.add("bar");

        Mult mult = Mult.create(p);
        Map<String,Object> map = mult.toMap();
        assertThat(map.size(), is(mult.getCount()));
        assertThat((String) map.get("0"), is("foo"));
        assertThat((String) map.get("1"), is("bar"));
    }

    @Test
    public void testToMapWithNestedMap() {
        SortedMap p = new TreeMap();
        p.put("foo", "bar");
        p.put("baz", "spaz");

        SortedMap m = new TreeMap();
        m.put("fred", "wilma");
        m.put("yope", p);
        m.put("barney", "betty");

        Mult mult = Mult.create(m);

        Map<String,Object> map = mult.toMap();
        assertThat((String) map.get("fred"), is("wilma"));
        assertThat((String) ((Map) map.get("yope")).get("foo"), is("bar"));
        assertThat((String) ((Map) map.get("yope")).get("baz"), is("spaz"));
        assertThat((String) map.get("barney"), is("betty"));
    }

    @Test
    public void testToMapWithNestedList() {
        SortedMap p = new TreeMap();
        p.put("fred", "wilma");
        p.put("foo", Arrays.asList("bar", "baz"));
        p.put("barney", "betty");

        Mult mult = Mult.create(p);

        Map<String,Object> map = mult.toMap();
        assertThat((String) map.get("fred"), is("wilma"));
        assertThat(((List<String>) map.get("foo")).get(0), is("bar"));
        assertThat(((List<String>) map.get("foo")).get(1), is("baz"));
        assertThat((String) map.get("barney"), is("betty"));
    }

    @Test
    public void testToJsonNodeWithNestedMap() {
        SortedMap p = new TreeMap();
        p.put("foo", "bar");
        p.put("baz", "spaz");

        SortedMap m = new TreeMap();
        m.put("fred", "wilma");
        m.put("yope", p);
        m.put("barney", "betty");

        Mult mult = Mult.create(m);

        JsonNode json = mult.toJsonNode();
        assertThat(json.get("fred").textValue(), is("wilma"));
        assertThat(json.get("yope").get("foo").textValue(), is("bar"));
        assertThat(json.get("yope").get("baz").textValue(), is("spaz"));
        assertThat(json.get("barney").textValue(), is("betty"));
    }

    @Test
    public void testToJsonNodeWithNestedList() {
        SortedMap p = new TreeMap();
        p.put("fred", "wilma");
        p.put("foo", Arrays.asList("bar", "baz"));
        p.put("barney", "betty");

        Mult mult = Mult.create(p);

        JsonNode json = mult.toJsonNode();
        assertThat(json.get("fred").textValue(), is("wilma"));
        assertThat(json.get("foo").get(0).textValue(), is("bar"));
        assertThat(json.get("foo").get(1).textValue(), is("baz"));
        assertThat(json.get("barney").textValue(), is("betty"));
    }
}
