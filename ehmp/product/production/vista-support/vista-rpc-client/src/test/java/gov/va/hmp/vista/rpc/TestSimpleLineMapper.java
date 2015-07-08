package gov.va.hmp.vista.rpc;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TestSimpleLineMapper {

    @Test
    public void mapString() {
        SimpleLineMapper<String> mapper = new SimpleLineMapper<String>(String.class);
        assertEquals("foo", mapper.mapLine("foo", 3));
    }

    @Test
    public void mapInteger() {
        SimpleLineMapper<Integer> mapper = new SimpleLineMapper<Integer>(Integer.class);
        assertTrue(23 == mapper.mapLine("23", 3));
    }

    @Test
    public void mapLong() {
        SimpleLineMapper<Long> mapper = new SimpleLineMapper<Long>(Long.class);
        assertTrue(42L == mapper.mapLine("42", 3));
    }
}
