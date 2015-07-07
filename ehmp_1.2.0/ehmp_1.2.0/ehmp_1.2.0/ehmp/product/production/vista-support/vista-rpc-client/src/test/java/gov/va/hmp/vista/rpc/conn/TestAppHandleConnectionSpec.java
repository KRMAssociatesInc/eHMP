package gov.va.hmp.vista.rpc.conn;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class TestAppHandleConnectionSpec {

    @Test
    public void testEquals() {
        AppHandleConnectionSpec av1 = new AppHandleConnectionSpec("1AB2C3D4E5F6", "960", "123.45.67.89", "www.example.org");
        AppHandleConnectionSpec av2 = new AppHandleConnectionSpec("1AB2C3D4E5F6", "960", "123.45.67.89", "www.example.org");
        AppHandleConnectionSpec av3 = new AppHandleConnectionSpec("6F5E4D3C2B1A", "960", "123.45.67.89", "www.example.org");
        AppHandleConnectionSpec av4 = new AppHandleConnectionSpec("1AB2C3D4E5F6", "123.45.67.89", "www.example.org");

        assertThat(av1, equalTo(av2));
        assertThat(av2, equalTo(av1));

        assertThat(av3, not(equalTo(av1)));
        assertThat(av1, not(equalTo(av3)));

        assertThat(av4, not(equalTo(av1)));
        assertThat(av1, not(equalTo(av4)));
    }

    @Test
    public void testToString() {
        AppHandleConnectionSpec h = new AppHandleConnectionSpec("1AB2C3D4E5F6", "960", "123.45.67.89", "www.example.org");
        assertEquals("www.example.org(123.45.67.89)960:1AB2C3D4E5F6", h.toString());
    }

    @Test
    public void testToStringNoDivision() {
        AppHandleConnectionSpec h = new AppHandleConnectionSpec("1AB2C3D4E5F6", "123.45.67.89", "www.example.org");
        assertEquals("www.example.org(123.45.67.89)1AB2C3D4E5F6", h.toString());
    }
}
