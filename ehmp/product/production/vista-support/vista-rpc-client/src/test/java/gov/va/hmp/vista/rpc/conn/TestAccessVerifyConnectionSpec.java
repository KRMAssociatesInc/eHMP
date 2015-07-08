package gov.va.hmp.vista.rpc.conn;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class TestAccessVerifyConnectionSpec {
    @Test
    public void testEquals() {
        AccessVerifyConnectionSpec av1 = new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org");
        AccessVerifyConnectionSpec av2 = new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org");
        AccessVerifyConnectionSpec av3 = new AccessVerifyConnectionSpec("960", "foo", "baz", "123.45.67.89", "www.example.org");
        AccessVerifyConnectionSpec av4 = new AccessVerifyConnectionSpec("960", "bar", "foo", "123.45.67.89", "www.example.org");

        assertThat(av1, equalTo(av2));
        assertThat(av2, equalTo(av1));

        assertThat(av3, not(equalTo(av1)));
        assertThat(av1, not(equalTo(av3)));

        assertThat(av4, not(equalTo(av1)));
        assertThat(av1, not(equalTo(av4)));
    }

    @Test
    public void testToString() {
        AccessVerifyConnectionSpec av = new AccessVerifyConnectionSpec("960", "foo", "bar","123.45.67.89", "www.example.org");
        assertEquals("960:foo;bar", av.toString());
    }

    @Test
    public void testChangeVerifyCodeToString() {
        ChangeVerifyCodeConnectionSpec cvc = new ChangeVerifyCodeConnectionSpec("960", "foo", "bar", "baz", "baz", "123.45.67.89", "www.example.org");
        assertEquals("960:foo;bar;baz;baz", cvc.toString());
    }

    @Test
    public void testToStringNoDivision() {
        AccessVerifyConnectionSpec av = new AccessVerifyConnectionSpec(null, "foo", "bar", "123.45.67.89", "www.example.org");
        assertEquals("foo;bar", av.toString());
    }

    @Test
    public void testGetCredentials() {
        AccessVerifyConnectionSpec av = new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org");
        assertEquals("foo;bar", av.getCredentials());
    }
}
