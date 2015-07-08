package gov.va.hmp.vista.rpc.pool;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.conn.AnonymousConnectionSpec;
import gov.va.hmp.vista.rpc.conn.AppHandleConnectionSpec;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class TestPoolKeyUtils {

    @Test
    public void testGetKeyWithHostAndAccessVerifyCode() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "foo;bar"), equalTo("vrpcb://foo;bar@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostAndAccessVerifyCodeAndDivision() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "960:foo;bar"), equalTo("vrpcb://960:foo;bar@example.org:9060"));
    }

    @Test
    public void testGetKeyWithAccessVerifyCodeAndNewVerifyCode() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "foo;bar;baz;baz"), equalTo("vrpcb://foo;bar;baz;baz@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostAndAccessVerifyCodeAndDivisionAndNewVerifyCode() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "960:foo;bar;baz;baz"), equalTo("vrpcb://960:foo;bar;baz;baz@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostClientInfoAndAccessVerifyCode() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "www.example.org(123.45.67.89)foo;bar"), equalTo("vrpcb://www.example.org(123.45.67.89)foo;bar@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostClientInfoAndAccessVerifyCodeAndDivision() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "www.example.org(123.45.67.89)960:foo;bar"), equalTo("vrpcb://www.example.org(123.45.67.89)960:foo;bar@example.org:9060"));
    }

    @Test
    public void testGetKeyWithClientInfoAccessVerifyCodeAndNewVerifyCode() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "www.example.org(123.45.67.89)foo;bar;baz;baz"), equalTo("vrpcb://www.example.org(123.45.67.89)foo;bar;baz;baz@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostClientInfoAndAccessVerifyCodeAndDivisionAndNewVerifyCode() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "www.example.org(123.45.67.89)960:foo;bar;baz;baz"), equalTo("vrpcb://www.example.org(123.45.67.89)960:foo;bar;baz;baz@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostAndAnonymousCredentials() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), AnonymousConnectionSpec.ANONYMOUS), equalTo("vrpcb://" + AnonymousConnectionSpec.ANONYMOUS + "@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostAndAppHandle() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "www.example.org(123.45.67.89)A1B2C3D4E5F6"), equalTo("vrpcb://www.example.org(123.45.67.89)A1B2C3D4E5F6@example.org:9060"));
    }

    @Test
    public void testGetKeyWithHostAndAppHandleAndDivision() throws Exception {
        assertThat(PoolKeyUtils.getKey(new RpcHost("example.org", 9060), "www.example.org(123.45.67.89)960:A1B2C3D4E5F6"), equalTo("vrpcb://www.example.org(123.45.67.89)960:A1B2C3D4E5F6@example.org:9060"));
    }

    @Test
    public void testKeyToUriString() throws Exception {
        assertThat(PoolKeyUtils.keyToUriString("vrpcb://foo;bar@example.org:9060"), equalTo("vrpcb://example.org:9060"));
        assertThat(PoolKeyUtils.keyToConnectionSpec("vrpcb://foo;bar@example.org:9060").toString(), equalTo("foo;bar"));
    }

    @Test
    public void testAnonymousKeyToURI() throws Exception {
        assertThat(PoolKeyUtils.keyToUriString("vrpcb://" + AnonymousConnectionSpec.ANONYMOUS + "@example.org:9060").toString(), equalTo("vrpcb://example.org:9060"));
        assertThat(PoolKeyUtils.keyToConnectionSpec("vrpcb://" + AnonymousConnectionSpec.ANONYMOUS + "@example.org:9060").toString(), equalTo("ANONYMOUS"));
    }

    @Test
    public void testKeyToUriStringWithSpecialCharacters() throws Exception {
        assertThat(PoolKeyUtils.keyToUriString("vrpcb://accesscode1;verifycode1&@example.org:9060"), equalTo("vrpcb://example.org:9060"));
        assertThat(PoolKeyUtils.keyToConnectionSpec("vrpcb://accesscode1;verifycode1&@example.org:9060").toString(), equalTo("accesscode1;verifycode1&"));

    }
    
    @Test
    public void testKeyToUriStringWithSpecialCharactersPercent() throws Exception {
    	assertThat(PoolKeyUtils.keyToUriString("vrpcb://accesscode1;verifycode%&@example.org:9060"), equalTo("vrpcb://example.org:9060"));
    	assertThat(PoolKeyUtils.keyToConnectionSpec("vrpcb://accesscode1;verifycode%&@example.org:9060").toString(), equalTo("accesscode1;verifycode%&"));
    }
}
