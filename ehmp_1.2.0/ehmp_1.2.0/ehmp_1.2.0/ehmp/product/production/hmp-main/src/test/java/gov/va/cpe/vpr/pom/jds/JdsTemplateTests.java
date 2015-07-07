package gov.va.cpe.vpr.pom.jds;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.Foo;
import gov.va.hmp.jsonc.JsonCCollection;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RequestCallback;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestOperations;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class JdsTemplateTests {
    private static final String JDS_URL = "http://localhost:9080";

    private RestOperations mockRestTemplate;
    private JdsTemplate t;
    private URI uri;

    @Before
    public void setUp() throws Exception {
        mockRestTemplate = mock(RestOperations.class);

        t = new JdsTemplate();
        t.setJdsUrl(JDS_URL);
        t.setRestTemplate(mockRestTemplate);
        uri = t.toUri("/vpr/34");
    }

    @Test
    public void testSetJdsUrlAddsTrailingSlash() throws Exception {
        assertThat(t.jdsUrl, equalTo(JDS_URL + "/"));
    }

    @Test
    public void testAfterPropertiesTestsConnectionToJds() throws Exception {
        t.afterPropertiesSet();
        verify(mockRestTemplate).getForObject(t.jdsUrl + "ping", String.class);
    }

    @Test
    public void testConnectOnInitializationFalse() throws Exception {
        t.setConnectOnInitialization(false);
        t.afterPropertiesSet();
        verifyZeroInteractions(mockRestTemplate);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetMissingJdsUrl() throws Exception {
        t.setJdsUrl(null);
        t.afterPropertiesSet();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetMissingRestTemplate() throws Exception {
        t.setRestTemplate(null);
        t.afterPropertiesSet();
    }

    @Test
    public void testGetForMap() throws Exception {
        Map mockResponse = new HashMap();
        mockResponse.put("apiVersion", "2.1");
        when(mockRestTemplate.getForObject(JDS_URL + "/vpr/34", Map.class)).thenReturn(mockResponse);

        Map map = t.getForMap("/vpr/34");
        assertThat((String) map.get("apiVersion"), equalTo("2.1"));

        verify(mockRestTemplate).getForObject(JDS_URL + "/vpr/34", Map.class);
    }

    @Test
    public void testGetForJsonC() throws Exception {
        JsonNode mockResponse = new ObjectMapper().readTree("{\"apiVersion\":\"4.2\",\"data\":{\"items\":[{\"foo\":\"bar\"}]}}");
        when(mockRestTemplate.execute(eq(uri), eq(HttpMethod.GET), (RequestCallback) any(), (ResponseExtractor<Object>) any())).thenReturn(mockResponse);

        JsonCCollection r = t.getForJsonC("/vpr/34");
        assertThat(r.apiVersion, is("4.2"));
        assertThat(r.getItems().size(), equalTo(1));
        verify(mockRestTemplate).execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForJsonCNotFound() throws Exception {
        when(mockRestTemplate.execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class))).thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));

        JsonCCollection r = t.getForJsonC("/vpr/34");
        assertThat(r, nullValue());
        verify(mockRestTemplate).execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForJsonCWithConcreteItemType() throws Exception {
        JsonNode mockResponse = new ObjectMapper().readTree("{\"apiVersion\":\"2.3\",\"data\":{\"items\":[{\"bar\":\"fred\",\"baz\":true},{\"bar\":\"wilma\",\"baz\":false}]}}");
        when(mockRestTemplate.execute(eq(URI.create(JDS_URL + "/vpr/34/find/foo")), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class))).thenReturn(mockResponse);

        JsonCCollection<Foo> r = t.getForJsonC(Foo.class, "/vpr/34/find/foo");

        assertThat(r.apiVersion, is("2.3"));
        assertThat(r.getItems().size(), equalTo(2));
        assertThat(r.getItems().get(0).getBar(), is("fred"));
        assertThat(r.getItems().get(0).isBaz(), is(true));
        assertThat(r.getItems().get(1).getBar(), is("wilma"));
        assertThat(r.getItems().get(1).isBaz(), is(false));

        verify(mockRestTemplate).execute(eq(URI.create(JDS_URL + "/vpr/34/find/foo")), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForJsonNode() throws Exception {
        JsonNode mockResponse = new ObjectMapper().readTree("{\"apiVersion\":\"1.0\",\"data\":{\"items\":[{\"icn\":\"foo\"}]}}");
        when(mockRestTemplate.execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class))).thenReturn(mockResponse);

        JsonNode json = t.getForJsonNode("/vpr/34");
        assertThat(json.path("apiVersion").asText(), is("1.0"));
        verify(mockRestTemplate).execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForObject() throws Exception {
        JsonNode mockResponse = new ObjectMapper().readTree("{\"apiVersion\":\"1.0\",\"data\":{\"items\":[{\"icn\":\"foo\"}]}}");
        when(mockRestTemplate.execute(eq(uri), eq(HttpMethod.GET), (RequestCallback) any(), (ResponseExtractor<Object>) any())).thenReturn(mockResponse);

        PatientDemographics pt = t.getForObject(PatientDemographics.class, "/vpr/34");
        assertThat(pt.getIcn(), equalTo("foo"));
        verify(mockRestTemplate).execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForObjectNotFound() throws Exception {
        when(mockRestTemplate.execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class))).thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));
        PatientDemographics pt = t.getForObject(PatientDemographics.class, "/vpr/34");
        assertThat(pt, nullValue());
        verify(mockRestTemplate).execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForObjectReturnsEmptyList() throws Exception {
        JsonNode mockResponse = new ObjectMapper().readTree("{\"apiVersion\":\"1.0\",\"data\":{\"items\":[]}}");
        when(mockRestTemplate.execute(eq(uri), eq(HttpMethod.GET), (RequestCallback) any(), (ResponseExtractor<Object>) any())).thenReturn(mockResponse);

        PatientDemographics pt = t.getForObject(PatientDemographics.class, "/vpr/34");
        assertThat(pt, nullValue());
        verify(mockRestTemplate).execute(eq(uri), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testGetForList() throws Exception {
        JsonNode mockResponse = new ObjectMapper().readTree("{\"apiVersion\":\"2.3\",\"data\":{\"items\":[{\"bar\":\"fred\",\"baz\":true},{\"bar\":\"wilma\",\"baz\":false}]}}");
        when(mockRestTemplate.execute(eq(URI.create(JDS_URL + "/vpr/34/find/foo")), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class))).thenReturn(mockResponse);

        List<Foo> items = t.getForList(Foo.class, "/vpr/34/find/foo");

        assertThat(items.size(), equalTo(2));
        assertThat(items.get(0).getBar(), is("fred"));
        assertThat(items.get(0).isBaz(), is(true));
        assertThat(items.get(1).getBar(), is("wilma"));
        assertThat(items.get(1).isBaz(), is(false));

        verify(mockRestTemplate).execute(eq(URI.create(JDS_URL + "/vpr/34/find/foo")), eq(HttpMethod.GET), any(RequestCallback.class), any(ResponseExtractor.class));
    }

    @Test
    public void testPostForLocation() throws Exception {
        Foo foo = new Foo();
        foo.setBar("spaz");

        when(mockRestTemplate.postForLocation(eq(JDS_URL + "/vpr/34"), any(HttpEntity.class))).thenReturn(URI.create("/vpr/34/foo"));

        URI uri = t.postForLocation("/vpr/34", foo);
        assertThat(uri.getPath(), equalTo("/vpr/34/foo"));

        ArgumentCaptor<HttpEntity> httpEntity = ArgumentCaptor.forClass(HttpEntity.class);
        verify(mockRestTemplate).postForLocation(eq(JDS_URL + "/vpr/34"), httpEntity.capture());
        assertThatHttpEntityIsJSONRequest(httpEntity.getValue());
    }

    @Test
    public void testToUri() throws Exception {
        //Scenarios where special characters get treated differently in URI
        // This is important when sending uri with special characters to the JDS store using rest client

        // Handle curly braces in url - encoded {}
        uri = t.toUri("/vpr/uid:urn:va:obs:F484:100845:{914D8B94-68F2-44CB-885E-859196F0D4D8}");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:obs:F484:100845:{914D8B94-68F2-44CB-885E-859196F0D4D8}"));
        assertThat(uri.getQuery(), equalTo(null));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:obs:F484:100845:%7B914D8B94-68F2-44CB-885E-859196F0D4D8%7D"));

        // Special characters for URIComponents with care for special chars in vri variables: \\{([^/]+?)\\}
        // they are treated diferently get encoded
        uri = t.toUri("/vpr/uid:urn:va:F484:100845:obs#abc");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:F484:100845:obs"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:F484:100845:obs"));

        uri = t.toUri("/vpr/uid:urn:va:F484:100845:o?asd");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:F484:100845:o"));
        assertThat(uri.getQuery(), equalTo("asd"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:F484:100845:o?asd"));

        // '%' gets encodded
        uri = t.toUri("/vpr/uid:urn:va:obs:F484:100845:%123");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:obs:F484:100845:%123"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:obs:F484:100845:%25123"));

        // double forward slash is semantically equivalent to a single slash in URIs (empty path segment should be dropped)
        uri = t.toUri("/vpr/uid:urn:va:obs:F484:100845:/123");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:obs:F484:100845:/123"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:obs:F484:100845:/123"));

        // '\\' get encoded
        uri = t.toUri("/vpr/uid:urn:va:obs:F484:100845:\\123");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:obs:F484:100845:\\123"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:obs:F484:100845:%5C123"));

        uri = t.toUri("/vpr/uid:urn:va:obs:F484:100845:(123)");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:obs:F484:100845:(123)"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:obs:F484:100845:(123)"));

        uri = t.toUri("/vpr/uid:urn:va:obs:F484:100845:123+abc");
        assertThat(uri.getPath(), equalTo("/vpr/uid:urn:va:obs:F484:100845:123+abc"));
        assertThat(uri.getRawSchemeSpecificPart(), equalTo("//localhost:9080/vpr/uid:urn:va:obs:F484:100845:123+abc"));

//        uri = t.toUri("/data/index/team-categories.qry?range=a==&start=0&limit=25");
//        assertThat(uri.getPath(), equalTo("/data/index/team-categories.qry"));
//        assertThat(uri.getQuery(), equalTo("range%3Da%3D%3D%26start%3D0%26limit%3D25"));

        /*
        URLCodec codec = new URLCodec();
        String encoded = codec.encode("/data/index/team-categories.qry?range=a====&start=0&limit=25");
        assertThat(encoded, equalTo("/data/index/team-categories.qry?range=a====&start=0&limit=25"));
        */


    }

    private void assertThatHttpEntityIsJSONRequest(HttpEntity httpEntity) {
        assertThat(httpEntity.getHeaders().getContentType(), is(MediaType.APPLICATION_JSON));
        assertThat(httpEntity.getBody().toString().startsWith("{"), is(true));
        assertThat(httpEntity.getBody().toString().endsWith("}"), is(true));
    }
}
