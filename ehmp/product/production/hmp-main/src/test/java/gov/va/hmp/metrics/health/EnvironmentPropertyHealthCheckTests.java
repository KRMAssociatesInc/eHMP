package gov.va.hmp.metrics.health;

import com.codahale.metrics.health.HealthCheck;
import gov.va.hmp.metrics.health.EnvironmentPropertyUrlHealthCheck;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestOperations;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class EnvironmentPropertyHealthCheckTests {

    private EnvironmentPropertyUrlHealthCheck healthCheck;
    private Environment mockEnvironment;
    private RestOperations mockRestTemplate;

    @Before
    public void setUp() throws Exception {
        mockEnvironment = mock(Environment.class);
        mockRestTemplate = mock(RestOperations.class);

        healthCheck = new EnvironmentPropertyUrlHealthCheck();
        healthCheck.setEnvironment(mockEnvironment);
        healthCheck.setRestTemplate(mockRestTemplate);
    }

    @Test(expected = IllegalArgumentException.class)
      public void testAfterPropertiesSetWithNullPropertyKey() throws Exception {
        healthCheck.afterPropertiesSet();
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAfterPropertiesSetWithEmptyPropertyKey() throws Exception {
        healthCheck.setPropertyKey("");
        healthCheck.afterPropertiesSet();
    }

    @Test
    public void testExecuteWithHealthyResult() throws Exception {
        String url = "http://example.org";
        String propertyKey = "foobar";

        when(mockEnvironment.getProperty(propertyKey)).thenReturn(url);
        ResponseEntity<String> response = new ResponseEntity<String>("Hello world!", HttpStatus.OK);
        when(mockRestTemplate.getForEntity(url, String.class)).thenReturn(response);

        healthCheck.setPropertyKey(propertyKey);
        healthCheck.afterPropertiesSet();

        HealthCheck.Result result = healthCheck.execute();

        assertThat(result.isHealthy(), is(true));
        verify(mockEnvironment).getProperty(propertyKey);
        verify(mockRestTemplate).getForEntity(url, String.class);
    }
}
