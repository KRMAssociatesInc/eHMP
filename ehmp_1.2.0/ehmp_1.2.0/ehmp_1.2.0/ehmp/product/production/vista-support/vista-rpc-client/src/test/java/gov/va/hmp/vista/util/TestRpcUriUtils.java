package gov.va.hmp.vista.util;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.conn.*;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.Collections;

import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.core.StringStartsWith.startsWith;
import static org.junit.Assert.*;

public class TestRpcUriUtils {

    @Test
    public void testToCredentials() {
        Assert.assertEquals("960:10vehu;vehu10", RpcUriUtils.toCredentials("960", "10vehu", "vehu10", null, null));
        assertEquals("10vehu;vehu10", RpcUriUtils.toCredentials(null, "10vehu", "vehu10", null, null));
        assertThat(RpcUriUtils.toCredentials(null, "10vehu", null, null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials(null, null, "vehu10", null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials(null, null, null, null, null), nullValue());

        assertThat(RpcUriUtils.toCredentials(new AccessVerifyConnectionSpec("960", "10vehu", "vehu10", "123.45.67.89", "www.example.org")), is(RpcUriUtils.toCredentials("960", "10vehu", "vehu10", "123.45.67.89", "www.example.org")));
    }

    @Test
    public void testToCredentialsWithNewVerifyCode() {
        assertEquals("960:10vehu;vehu10", RpcUriUtils.toCredentials("960", "10vehu", "vehu10", null, null, null, null));
        assertEquals("10vehu;vehu10", RpcUriUtils.toCredentials(null, "10vehu", "vehu10", null, null, null, null));
        assertEquals("960:10vehu;vehu10;newvehu10;newvehu10", RpcUriUtils.toCredentials("960", "10vehu", "vehu10", "newvehu10", "newvehu10", null, null));
        assertEquals("10vehu;vehu10;newvehu10;newvehu10", RpcUriUtils.toCredentials(null, "10vehu", "vehu10", "newvehu10", "newvehu10", null, null));
        assertEquals("10vehu;vehu10", RpcUriUtils.toCredentials(null, "10vehu", "vehu10", "newvehu10", null, null, null));
        assertEquals("10vehu;vehu10", RpcUriUtils.toCredentials(null, "10vehu", "vehu10", null, "newvehu10", null, null));

        assertThat(RpcUriUtils.toCredentials(null, "10vehu", null, null, null, null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials(null, null, "vehu10", null, null, null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials(null, null, null, null, null, null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials(null, "10vehu", null, "newvehu10", "newvehu10", null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials(null, null, "vehu10", "newvehu10", "newvehu10", null, null), nullValue());

        assertThat(RpcUriUtils.toCredentials(new ChangeVerifyCodeConnectionSpec("960", "10vehu", "vehu10", "newvehu10", "newvehu10", null, null)), is(RpcUriUtils.toCredentials("960", "10vehu", "vehu10", "newvehu10", "newvehu10", null, null)));
    }

    @Test
    public void testToCredentialsWithAppHandle() {
        assertThat(RpcUriUtils.toCredentials("960", "1A2B3C4D5E6F", "93.184.216.119", "www.example.org"), is("www.example.org(93.184.216.119)960:1A2B3C4D5E6F"));
        assertThat(RpcUriUtils.toCredentials(null, "1A2B3C4D5E6F", "93.184.216.119", "www.example.org"), is("www.example.org(93.184.216.119)1A2B3C4D5E6F"));
        assertThat(RpcUriUtils.toCredentials(null, null, null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials("960", null, null, null), nullValue());
        assertThat(RpcUriUtils.toCredentials("960", "1A2B3C4D5E6F", null, null), nullValue());

        assertThat(RpcUriUtils.toCredentials(new AppHandleConnectionSpec("1A2B3C4D5E6F", "93.184.216.119", "www.example.org")), is(RpcUriUtils.toCredentials(null, "1A2B3C4D5E6F", "93.184.216.119", "www.example.org")));
    }

    @Test
    public void testToAuthority() {
        assertThat(RpcUriUtils.toAuthority("9F2B", "960", "10vehu", "vehu10", null, null), equalTo("960:10vehu;vehu10@9F2B"));
        assertThat(RpcUriUtils.toAuthority("9F2B", "960", "10vehu", "vehu10", "newvehu10", "newvehu10", null, null), equalTo("960:10vehu;vehu10;newvehu10;newvehu10@9F2B"));
        assertThat(RpcUriUtils.toAuthority(new RpcHost("example.org", 9060), "960", "10vehu", "vehu10"), equalTo("960:10vehu;vehu10@example.org:9060"));
        assertThat(RpcUriUtils.toAuthority(new RpcHost("example.org", 9060), "foo;bar"), equalTo("foo;bar@example.org:9060"));
        assertThat(RpcUriUtils.toAuthority(new RpcHost("example.org", 9060), AnonymousConnectionSpec.ANONYMOUS), equalTo(AnonymousConnectionSpec.ANONYMOUS + "@example.org:9060"));
        assertThat(RpcUriUtils.toAuthority("9F2B", "960", "1A2B3C4D5E6F", "123.45.67.89", "www.example.org"), equalTo("www.example.org(123.45.67.89)960:1A2B3C4D5E6F@9F2B"));
        assertThat(RpcUriUtils.toAuthority("9F2B", null, "1A2B3C4D5E6F", "123.45.67.89", "www.example.org"), equalTo("www.example.org(123.45.67.89)1A2B3C4D5E6F@9F2B"));
    }

    @Test
    public void testToPath() {
        assertEquals("/FOO/BAR", RpcUriUtils.toPath("FOO", "BAR"));
        assertEquals("/BAR", RpcUriUtils.toPath(null, "BAR"));
        assertThat(RpcUriUtils.toPath(null, null), nullValue());
    }

    @Test
    public void testToQuery() {
        assertEquals("[1]=baz&[2]=spaz&timeout=30", RpcUriUtils.toQuery(new RpcRequest("FOO/BAR", Arrays.asList(new String[]{"baz", "spaz"}))));
    }

    @Test
    public void testExtractScheme() {
        assertEquals("vrpcb", RpcUriUtils.extractScheme("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("vlink", RpcUriUtils.extractScheme("vlink://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractAccessCode() {
        assertEquals("10vehu", RpcUriUtils.extractAccessCode("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractVerifyCode() {
        assertEquals("vehu10", RpcUriUtils.extractVerifyCode("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractHostname() {
        assertEquals("serverserv.vha.domain.ext", RpcUriUtils.extractHostname("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("9F06", RpcUriUtils.extractHostname("vrpcb://9F06/FOO/BAR"));
    }

    @Test
    public void testExtractHost() {
        RpcHost host = RpcUriUtils.extractHost("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR");
        assertEquals("serverserv.vha.domain.ext", host.getHostname());
        assertEquals(9060, host.getPort());
        assertEquals("vrpcb", host.getScheme());
        host = RpcUriUtils.extractHost("vrpcb://9F06/FOO/BAR");
        assertEquals("9F06", host.getHostname());
        assertEquals(-1, host.getPort());
        host = RpcUriUtils.extractHost("vrpcb://9F06/FOO BAR/BAZ SPAZ");
        assertEquals("9F06", host.getHostname());
        assertEquals(-1, host.getPort());
    }

    @Test
    public void testExtractPort() {
        assertThat(RpcUriUtils.extractPort("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/960"), is(9060));
        assertThat(RpcUriUtils.extractPort("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext"), is(RpcUriUtils.DEFAULT_PORT));
    }

    @Test
    public void testExtractDivision() {
        assertEquals("960", RpcUriUtils.extractDivision("vrpcb://960:10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertThat(RpcUriUtils.extractDivision("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060"), nullValue());
        assertThat(RpcUriUtils.extractDivision("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"), nullValue());
        assertThat(RpcUriUtils.extractDivision("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/BAR"), nullValue());
    }

    @Test
    public void testExtractDivisionWithCredentials() {
        assertEquals("960", RpcUriUtils.extractDivision("vrpcb://960:10vehu;vehu10%@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertThat(RpcUriUtils.extractDivision("vrpcb://10vehu;vehu10%@serverserv.vha.domain.ext:9060"), nullValue());
        assertThat(RpcUriUtils.extractDivision("vrpcb://10vehu;vehu10%@serverserv.vha.domain.ext:9060/FOO/BAR"), nullValue());
        assertThat(RpcUriUtils.extractDivision("vrpcb://10vehu;vehu10%@serverserv.vha.domain.ext:9060/BAR"), nullValue());
    }

    @Test
    public void testExtractCredentials() {
        assertEquals("10vehu;vehu10", RpcUriUtils.extractCredentials("vrpcb://960:10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("10vehu;vehu10", RpcUriUtils.extractCredentials("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractCredentialsWithAtSignInThem() {
        assertEquals("10@vehu;vehu@10", RpcUriUtils.extractCredentials("vrpcb://10@vehu;vehu@10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractCredentialsWithPercentSignInThem() {
        assertEquals("10%vehu;vehu%10", RpcUriUtils.extractCredentials("vrpcb://10%vehu;vehu%10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractCredentialsWithNewVerifyCodeAndConfirmVerifyCodeInThem() {
        assertEquals("10vehu;vehu10;newvehu10;newvehu10", RpcUriUtils.extractCredentials("vrpcb://960:10vehu;vehu10;newvehu10;newvehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("10vehu;vehu10;newvehu10;newvehu10", RpcUriUtils.extractCredentials("vrpcb://10vehu;vehu10;newvehu10;newvehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testExtractCredentialsWhenCredentialsAreMissing() {
        RpcUriUtils.extractCredentials("vrpcb://serverserv.vha.domain.ext:9060/BAR");
    }

    @Test
    public void testExtractUserInfoContainingAtSign() {
        assertEquals("10@vehu;vehu@10", RpcUriUtils.extractUserInfo("vrpcb://10@vehu;vehu@10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("960:10@vehu;vehu@10", RpcUriUtils.extractUserInfo("vrpcb://960:10@vehu;vehu@10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractUserInfoContainingPercentSign() {
        assertEquals("10%vehu;vehu%10", RpcUriUtils.extractUserInfo("vrpcb://10%vehu;vehu%10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("960:10%vehu;vehu%10", RpcUriUtils.extractUserInfo("vrpcb://960:10%vehu;vehu%10@serverserv.vha.domain.ext:9060/FOO/BAR"));
    }

    @Test
    public void testExtractRpcContext() {
        assertEquals("FOO", RpcUriUtils.extractRpcContext("vrpcb://960:10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("FOO", RpcUriUtils.extractRpcContext("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("FOO BAR", RpcUriUtils.extractRpcContext("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO BAR/BAZ SPAZ"));
        assertThat(RpcUriUtils.extractRpcContext("vrpcb://960:10vehu;vehu10@serverserv.vha.domain.ext:9060//BAR"), nullValue());
        assertThat(RpcUriUtils.extractRpcContext("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/BAR"), nullValue());
        assertThat(RpcUriUtils.extractRpcContext("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060//BAR"), nullValue());
    }

    @Test
    public void testExtractRpcName() {
        assertEquals("BAR", RpcUriUtils.extractRpcName("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/960/FOO/BAR"));
        assertEquals("BAR", RpcUriUtils.extractRpcName("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO/BAR"));
        assertEquals("BAZ SPAZ", RpcUriUtils.extractRpcName("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO BAR/BAZ SPAZ"));
        assertEquals("FOO", RpcUriUtils.extractRpcName("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO"));
        assertEquals("FOO BAR", RpcUriUtils.extractRpcName("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060/FOO BAR"));
        assertThat(RpcUriUtils.extractRpcName("vrpcb://10vehu;vehu10@serverserv.vha.domain.ext:9060"), nullValue());
    }

    @Test
    public void testSanitize() {
        String uri = RpcUriUtils.sanitize("vrpcb://serverserv.vha.domain.ext:9060/FOO/BAR BAZ", ConnectionSpecFactory.create("960:10vehu;vehu10"));

        assertThat(uri, startsWith("vrpcb://960"));
        assertThat(uri, endsWith("@serverserv.vha.domain.ext:9060/FOO/BAR BAZ"));
    }

    @Test
    public void testSanitizeNoDivision() {
        String uri = RpcUriUtils.sanitize("vrpcb://serverserv.vha.domain.ext:9060/FOO/BAR BAZ", ConnectionSpecFactory.create("10vehu;vehu10"));

        assertThat(uri, startsWith("vrpcb://"));
        assertThat(uri, endsWith("@serverserv.vha.domain.ext:9060/FOO/BAR BAZ"));
    }

    @Test
    public void testSanitizeNoCredentials() {
        String uri = RpcUriUtils.sanitize("vrpcb://serverserv.vha.domain.ext:9060/FOO/BAR BAZ", new AnonymousConnectionSpec());

        assertThat(uri, startsWith("vrpcb://"));
        assertThat(uri, endsWith("@serverserv.vha.domain.ext:9060/FOO/BAR BAZ"));
    }

    @Test
    public void testSanitizeWithPercentSignInCredentials() {
        // So here is what we are trying to fix - special character '%' in credentials.
        // For example password such us 'vehu10%#' will cause a URI Malformed exception and so will not be encoded.
        try {
            UriComponentsBuilder.fromUriString("vrpcb://960/vehu10,vehu10%#@serverserv.vha.domain.ext:9060/FOO/BAR BAZ").build(true);
            fail();
        } catch (Exception e) {
            assertEquals("Invalid encoded sequence \"%\"", e.getMessage());
        }

        String uri = RpcUriUtils.sanitize("vrpcb://serverserv.vha.domain.ext:9060/FOO/BAR BAZ", ConnectionSpecFactory.create("960/10vehu;vehu10%#"));
        assertThat(uri, startsWith("vrpcb://"));
        assertThat(uri, endsWith("@serverserv.vha.domain.ext:9060/FOO/BAR BAZ"));
    }

    @Test
    public void testSanitizeWithPercentSignInCredentialsAndNoDivision() {
        // So here is what we are trying to fix - special character '%' in credentials.
        // For example password such us 'vehu10%#' will cause a URI Malformed exception and so will not be encoded.
        try {
            UriComponentsBuilder.fromUriString("vrpcb://vehu10,vehu10%#@serverserv.vha.domain.ext:9060/FOO/BAR BAZ").build(true);
            fail();
        } catch (Exception e) {
            assertEquals("Invalid encoded sequence \"%#\"", e.getMessage());
        }

        String uri = RpcUriUtils.sanitize("vrpcb://@serverserv.vha.domain.ext:9060/FOO/BAR BAZ", ConnectionSpecFactory.create("960%3A10vehu%3;Bvehu10%25"));
        assertThat(uri, startsWith("vrpcb://"));
        assertThat(uri, endsWith("@serverserv.vha.domain.ext:9060/FOO/BAR BAZ"));
    }

    @Test
    public void testToUriComponents() {
        UriComponents uri = RpcUriUtils.toUriComponents(new RpcHost("serverserv.vha.domain.ext", 9060), "FOO", "BAR BAZ", Collections.emptyList(), 23);
        assertThat(uri.getScheme(), is(VISTA_RPC_BROKER_SCHEME));
        assertThat(uri.getHost(), is("serverserv.vha.domain.ext"));
        assertThat(uri.getPort(), is(9060));
        assertThat(uri.getPathSegments(), hasItems("FOO", "BAR BAZ"));
        assertThat(uri.getQueryParams().get("timeout"), hasItem("23"));
        assertThat(uri.toString(), is("vrpcb://serverserv.vha.domain.ext:9060/FOO/BAR BAZ?timeout=23"));
    }

    @Test
    public void testToUriComponentsEncodeSpaces() {
        UriComponents uri = RpcUriUtils.toUriComponents("vrpcb://example.org:1234/FOO BAR/BAZ SPAZ");
        uri = uri.encode();
        assertThat(uri.getScheme(), is(VISTA_RPC_BROKER_SCHEME));
        assertThat(uri.getHost(), is("example.org"));
        assertThat(uri.getPort(), is(1234));
        assertThat(uri.getPathSegments(), hasItems("FOO%20BAR", "BAZ%20SPAZ"));
    }

    @Test
    public void testToUriComponentsFromHostAndAccessVerifyConnectionSpec() {
        UriComponents uri = RpcUriUtils.toUriComponents(new RpcHost("serverserv.vha.domain.ext", 9060), new AccessVerifyConnectionSpec("960", "foo", "bar", "123.45.67.89", "www.example.org"));
        assertEquals(VISTA_RPC_BROKER_SCHEME + "://www.example.org(123.45.67.89)960:foo;bar@serverserv.vha.domain.ext:9060", uri.toString());
    }

    @Test
    public void testToUriComponentsWithCredentialsContainingAtSigns() {
        UriComponents uri = RpcUriUtils.toUriComponents("vrpcb://10@vehu;vehu@10@example.org:1234/FOO BAR/BAZ SPAZ");
        assertThat(uri.getScheme(), is(VISTA_RPC_BROKER_SCHEME));
        assertThat(uri.getUserInfo(), is("10@vehu;vehu@10"));
        assertThat(uri.getHost(), is("example.org"));

//        assertEquals("vrpcb://10@vehu;vehu@10@example.org:1234/FOO BAR/BAZ SPAZ", uri.toString());
//        uri = uri.encode();
//        assertEquals("vrpcb://10@vehu;vehu@10@example.org:1234/FOO BAR/BAZ SPAZ", uri.toString());
    }
}
