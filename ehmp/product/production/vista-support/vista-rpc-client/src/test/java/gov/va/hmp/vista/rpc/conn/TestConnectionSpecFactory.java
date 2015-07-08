package gov.va.hmp.vista.rpc.conn;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class TestConnectionSpecFactory {

    @Test
    public void testAnonymous() throws Exception {
        ConnectionSpec auth = ConnectionSpecFactory.create(null);
        assertThat(auth, instanceOf(AnonymousConnectionSpec.class));

        auth = ConnectionSpecFactory.create("");
        assertThat(auth, instanceOf(AnonymousConnectionSpec.class));

        auth = ConnectionSpecFactory.create(AnonymousConnectionSpec.ANONYMOUS);
        assertThat(auth, instanceOf(AnonymousConnectionSpec.class));
    }

    @Test
    public void testCreateAccessVerifyDivision() {
        ConnectionSpec auth = ConnectionSpecFactory.create("960:foo;bar");
        assertThat(auth, instanceOf(AccessVerifyConnectionSpec.class));
        AccessVerifyConnectionSpec av = (AccessVerifyConnectionSpec) auth;
        assertThat(av.getDivision(), is("960"));
        assertThat(av.getAccessCode(), is("foo"));
        assertThat(av.getVerifyCode(), is("bar"));

        auth = ConnectionSpecFactory.create("www.example.org(93.184.216.119)960:foo;bar");
        assertThat(auth, instanceOf(AccessVerifyConnectionSpec.class));
        av = (AccessVerifyConnectionSpec) auth;
        assertThat(av.getClientHostName(), is("www.example.org"));
        assertThat(av.getClientAddress(), is("93.184.216.119"));
        assertThat(av.getDivision(), is("960"));
        assertThat(av.getAccessCode(), is("foo"));
        assertThat(av.getVerifyCode(), is("bar"));
    }

    @Test
    public void testCreateAccessVerifyNoDivision() {
        ConnectionSpec auth = ConnectionSpecFactory.create("foo;bar");
        assertThat(auth, instanceOf(AccessVerifyConnectionSpec.class));
        AccessVerifyConnectionSpec av = (AccessVerifyConnectionSpec) auth;
        assertThat(av.getDivision(), nullValue());
        assertThat(av.getAccessCode(), is("foo"));
        assertThat(av.getVerifyCode(), is("bar"));

        auth = ConnectionSpecFactory.create("www.example.org(93.184.216.119)foo;bar");
        assertThat(auth, instanceOf(AccessVerifyConnectionSpec.class));
        av = (AccessVerifyConnectionSpec) auth;
        assertThat(av.getClientHostName(), is("www.example.org"));
        assertThat(av.getClientAddress(), is("93.184.216.119"));
        assertThat(av.getDivision(), nullValue());
        assertThat(av.getAccessCode(), is("foo"));
        assertThat(av.getVerifyCode(), is("bar"));
    }

    @Test
    public void testCreateAccessVerifyIPv6() {
        ConnectionSpec auth = ConnectionSpecFactory.create("0:0:0:0:0:0:0:1(0:0:0:0:0:0:0:1)foo;bar");
        assertThat(auth, instanceOf(AccessVerifyConnectionSpec.class));
        AccessVerifyConnectionSpec av = (AccessVerifyConnectionSpec) auth;
        assertThat(av.getClientHostName(), is("0:0:0:0:0:0:0:1"));
        assertThat(av.getClientAddress(), is("0:0:0:0:0:0:0:1"));
        assertThat(av.getDivision(), nullValue());
        assertThat(av.getAccessCode(), is("foo"));
        assertThat(av.getVerifyCode(), is("bar"));
    }

    @Test
    public void testCreateNewVerifyCode() {
        ConnectionSpec auth = ConnectionSpecFactory.create("960:foo;bar;baz;baz");
        assertThat(auth, instanceOf(ChangeVerifyCodeConnectionSpec.class));
        ChangeVerifyCodeConnectionSpec cvc = (ChangeVerifyCodeConnectionSpec) auth;
        assertThat(cvc.getDivision(), is("960"));
        assertThat(cvc.getAccessCode(), is("foo"));
        assertThat(cvc.getVerifyCode(), is("bar"));
        assertThat(cvc.getNewVerifyCode(), is("baz"));
        assertThat(cvc.getConfirmNewVerifyCode(), is("baz"));
    }

    @Test
    public void testCreateNewVerifyCodeWithNoDivision() {
        ConnectionSpec auth = ConnectionSpecFactory.create("960:foo;bar;baz;baz");
        assertThat(auth, instanceOf(ChangeVerifyCodeConnectionSpec.class));
        ChangeVerifyCodeConnectionSpec cvc = (ChangeVerifyCodeConnectionSpec) auth;
        assertThat(cvc.getDivision(), is("960"));
        assertThat(cvc.getAccessCode(), is("foo"));
        assertThat(cvc.getVerifyCode(), is("bar"));
        assertThat(cvc.getNewVerifyCode(), is("baz"));
        assertThat(cvc.getConfirmNewVerifyCode(), is("baz"));
    }

    @Test
    public void testCreateNewVerifyCodeWithSpecialCharacters() {
        // This used to blowup trying to encode in uri. '%' is a reserved character in uri encoding.
        ConnectionSpec auth = ConnectionSpecFactory.create("960:foo;%#ar");
        assertThat(auth, instanceOf(AccessVerifyConnectionSpec.class));
        AccessVerifyConnectionSpec av = (AccessVerifyConnectionSpec) auth;
        assertThat(av.getDivision(), is("960"));
        assertThat(av.getAccessCode(), is("foo"));
        assertThat(av.getVerifyCode(), is("%#ar"));
    }

    @Test
    public void testCreateAppHandleAndDivision() {
        ConnectionSpec auth = ConnectionSpecFactory.create("www.example.org(93.184.216.119)960:1AB2C3D4E5F6");
        assertThat(auth, instanceOf(AppHandleConnectionSpec.class));
        AppHandleConnectionSpec lh = (AppHandleConnectionSpec) auth;
        assertThat(lh.getClientHostName(), is("www.example.org"));
        assertThat(lh.getClientAddress(), is("93.184.216.119"));
        assertThat(lh.getHandle(), is("1AB2C3D4E5F6"));
        assertThat(lh.getDivision(), is("960"));
    }

    @Test
    public void testCreateAppHandleNoDivision() {
        ConnectionSpec auth = ConnectionSpecFactory.create("www.example.org(93.184.216.119)1AB2C3D4E5F6");
        assertThat(auth, instanceOf(AppHandleConnectionSpec.class));
        AppHandleConnectionSpec lh = (AppHandleConnectionSpec) auth;
        assertThat(lh.getClientHostName(), is("www.example.org"));
        assertThat(lh.getClientAddress(), is("93.184.216.119"));
        assertThat(lh.getHandle(), is("1AB2C3D4E5F6"));
        assertThat(lh.getDivision(), nullValue());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateAppHandleMissingClientAddress() {
        ConnectionSpecFactory.create("www.example.org()1AB2C3D4E5F6");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateAppHandleMissingClientHostName() {
        ConnectionSpecFactory.create("(93.184.216.119)1AB2C3D4E5F6");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateAppHandleMissingClientAddressAndHostName() {
        ConnectionSpecFactory.create("1AB2C3D4E5F6");
    }
}
