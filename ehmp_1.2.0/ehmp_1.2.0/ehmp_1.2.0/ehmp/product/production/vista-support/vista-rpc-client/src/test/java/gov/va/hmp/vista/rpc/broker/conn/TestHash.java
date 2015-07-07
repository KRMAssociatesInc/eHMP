package gov.va.hmp.vista.rpc.broker.conn;

import junit.framework.TestCase;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

public class TestHash extends TestCase {

    @Test
    public void testHashIdempotent() {
        String foo = "foo";
        TestCase.assertEquals(foo, Hash.decrypt(Hash.encrypt(foo)));
    }

    @Test
    public void testHashNullSafe() {
        assertThat(Hash.decrypt(Hash.encrypt(null)), nullValue());
    }

    @Test
    public void testHashEmptyString() {
        assertThat(Hash.decrypt(Hash.encrypt("")), is(""));
    }
}
