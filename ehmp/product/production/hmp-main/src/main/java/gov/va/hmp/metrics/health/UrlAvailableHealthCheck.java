package gov.va.hmp.metrics.health;

import com.codahale.metrics.health.HealthCheck;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

public class UrlAvailableHealthCheck extends HealthCheck implements InitializingBean {

    private RestOperations restTemplate = new RestTemplate();

    private String baseUrl;
    private String urlPath;
    private String fullUrl;

    public void setRestTemplate(RestOperations restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Assert.hasText(baseUrl, "[Assertion failed] - the 'url' property must have text; it must not be null, empty, or blank");
        fullUrl = UriComponentsBuilder.fromHttpUrl(baseUrl).path(urlPath).build().toUriString();
    }

    @Override
    protected Result check() throws Exception {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(fullUrl, String.class);
            if (HttpStatus.OK.equals(response.getStatusCode())) {
                return Result.healthy();
            }

            return Result.unhealthy(response.getStatusCode().toString());
        } catch (RestClientException e) {
            return Result.unhealthy(e);
        }
    }

    public void setUrlPath(String urlPath) {
        this.urlPath = urlPath;
    }
}
