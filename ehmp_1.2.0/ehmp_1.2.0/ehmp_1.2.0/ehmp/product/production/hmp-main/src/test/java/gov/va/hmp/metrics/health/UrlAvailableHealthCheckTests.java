package gov.va.hmp.metrics.health;

import com.codahale.metrics.health.HealthCheck;
import gov.va.hmp.metrics.health.UrlAvailableHealthCheck;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.util.UriComponentsBuilder;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class UrlAvailableHealthCheckTests {

    private UrlAvailableHealthCheck healthCheck;
    private RestOperations mockRestTemplate;

    @Before
    public void setUp() throws Exception {
        healthCheck = new UrlAvailableHealthCheck();
        mockRestTemplate = mock(RestOperations.class);
        healthCheck.setRestTemplate(mockRestTemplate);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetWithNullUrl() throws Exception {
        healthCheck.afterPropertiesSet();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetWithEmptyUrl() throws Exception {
        healthCheck.setBaseUrl("");
        healthCheck.afterPropertiesSet();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetWithInvalidUrl() throws Exception {
        healthCheck.setBaseUrl("foo://example.org");
        healthCheck.afterPropertiesSet();
    }

    @Test
    public void testExecuteWithHealthyResult() throws Exception {
        String baseUrl = "http://example.org";

        ResponseEntity<String> response = new ResponseEntity<String>("Hello world!", HttpStatus.OK);
        when(mockRestTemplate.getForEntity(baseUrl, String.class)).thenReturn(response);

        healthCheck.setBaseUrl(baseUrl);
        healthCheck.afterPropertiesSet();

        HealthCheck.Result result = healthCheck.execute();

        assertThat(result.isHealthy(), is(true));
        verify(mockRestTemplate).getForEntity(baseUrl, String.class);
    }

    @Test
    public void testExecuteWithBaseUrlAndUrlPathSet() throws Exception {
        String baseUrl = "http://example.org";
        String path = "/hello/world";
        String fullUrl = UriComponentsBuilder.fromHttpUrl(baseUrl).path(path).build().toUriString();

        ResponseEntity<String> response = new ResponseEntity<String>("Hello world!", HttpStatus.OK);
        when(mockRestTemplate.getForEntity(fullUrl, String.class)).thenReturn(response);

        healthCheck.setBaseUrl(baseUrl);
        healthCheck.setUrlPath(path);
        healthCheck.afterPropertiesSet();

        HealthCheck.Result result = healthCheck.execute();

        assertThat(result.isHealthy(), is(true));
        verify(mockRestTemplate).getForEntity(fullUrl, String.class);
    }

    @Test
    public void testExecuteWithUnhealthyResultDueToErrorStatusCode() throws Exception {
        String baseUrl = "http://example.org";

        ResponseEntity<String> response = new ResponseEntity<String>("Error world!", HttpStatus.INTERNAL_SERVER_ERROR);
        when(mockRestTemplate.getForEntity(baseUrl, String.class)).thenReturn(response);

        healthCheck.setBaseUrl(baseUrl);
        healthCheck.afterPropertiesSet();

        HealthCheck.Result result = healthCheck.execute();

        assertThat(result.isHealthy(), is(false));
        verify(mockRestTemplate).getForEntity(baseUrl, String.class);
    }

    @Test
    public void testExecuteWithUnhealthyResultDueToException() throws Exception {
        String baseUrl = "http://example.org";

        RestClientException exception = new RestClientException("oh noes");
        when(mockRestTemplate.getForEntity(baseUrl, String.class)).thenThrow(exception);

        healthCheck.setBaseUrl(baseUrl);
        healthCheck.afterPropertiesSet();

        HealthCheck.Result result = healthCheck.execute();

        assertThat(result.isHealthy(), is(false));
        assertThat(result.getError(), sameInstance((Throwable) exception));
        verify(mockRestTemplate).getForEntity(baseUrl, String.class);
    }
}
