package gov.va.cpe.vpr.pom.jds;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.util.LoggingUtil;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMObjectMapper;
import gov.va.hmp.jsonc.JsonCCollection;
import org.apache.commons.lang.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * <strong>HMP's central class for JDS access.</strong>
 * It simplifies communication with JDS servers, and enforces RESTful principles.
 *
 * @see org.springframework.web.client.RestTemplate
 */
public class JdsTemplate implements JdsOperations, InitializingBean {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    protected RestOperations restTemplate;

    protected String jdsUrl;

    private ObjectMapper jsonMapper;

    private ResponseExtractor<JsonNode> jsonNodeResponseExtractor;

    private JdsExceptionTranslator exceptionTranslator = new DefaultJdsExceptionTranslator();

    private boolean connectOnInitialization = true;

    public JdsTemplate() {
        jsonMapper = new POMObjectMapper();
        jsonNodeResponseExtractor = new ResponseExtractor<JsonNode>() {
            public JsonNode extractData(ClientHttpResponse response)
                    throws IOException {
                return jsonMapper.readTree(new InputStreamReader(response.getBody(), Charset.forName("ISO-8859-1")));
            }
        };
    }

    @Required
    public void setRestTemplate(RestOperations restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Required
    public void setJdsUrl(String jdsUrl) {
        this.jdsUrl = jdsUrl;
        if (this.jdsUrl != null && !this.jdsUrl.endsWith("/")) this.jdsUrl = this.jdsUrl + "/";
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Assert.notNull(this.restTemplate, "[Assertion failed] - 'restTemplate' is required; it must not be null");
        Assert.hasText(this.jdsUrl, "[Assertion failed] - 'jdsUrl' must have length; it must not be null or empty");

        if (connectOnInitialization) {
            ping();
        }
    }

    public void setExceptionTranslator(JdsExceptionTranslator exceptionTranslator) {
        this.exceptionTranslator = exceptionTranslator;
    }

    public void setConnectOnInitialization(boolean connectOnInitialization) {
        this.connectOnInitialization = connectOnInitialization;
    }

    protected <T> HttpEntity<String> createHttpEntity(T entity) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        try {
            String json = null;
            if (entity instanceof IPOMObject) {
                json = ((IPOMObject) entity).toJSON(JSONViews.JDBView.class);
            } else {
                json = jsonMapper.writeValueAsString(entity);
            }
            return new HttpEntity<String>(json, headers);
        } catch (IOException e) {
            throw new DataAccessResourceFailureException("unable to convert entity to JSON", e);
        }
    }

    @Override
    public void ping() throws DataAccessException {
        String url = this.jdsUrl + "ping";
        try {
            long startNS = System.nanoTime();
            restTemplate.getForObject(url, String.class);
            long elapsedNS = System.nanoTime() - startNS;
            logResponseSuccess(HttpMethod.GET, "ping", url, elapsedNS);
        } catch (RestClientException e) {
            if (!isNotFound(e))
                throw handleResponseError(HttpMethod.GET, "ping", url, e);
        }
    }

    @Override
    public JsonCCollection<Map<String, Object>> getForJsonC(String url, Object... uriVariables) {
        try {
            long startNS = System.nanoTime();
            JsonNode jsonNode = doGetForJsonNode(url, uriVariables);
            JsonCCollection response = jsonMapper.convertValue(jsonNode, JsonCCollection.class);
            long elapsedNS = System.nanoTime() - startNS;
            logResponseSuccess(HttpMethod.GET, "getForJsonC", url, elapsedNS);
            return response;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForJsonC", url, e);
        }
    }

    @Override
    public JsonCCollection<Map<String, Object>> getForJsonC(String url, Map<String, ?> uriVariables) throws DataAccessException {
        try {
            long startNS = System.nanoTime();
            JsonNode jsonNode = doGetForJsonNode(url, uriVariables);
            JsonCCollection<Map<String, Object>> response = JsonCCollection.create(jsonNode);
            long elapsedNS = System.nanoTime() - startNS;
            logResponseSuccess(HttpMethod.GET, "getForJsonC", url, elapsedNS);
            return response;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForJsonC", url, e);
        }
    }

    @Override
    public <T> JsonCCollection<T> getForJsonC(Class<T> itemType, String url) throws DataAccessException {
        return getForJsonC(itemType, url, null);
    }

    @Override
    public <T> JsonCCollection<T> getForJsonC(Class<T> itemType, String url, Map<String, ?> uriVariables) throws DataAccessException {
        try {
            long startNS = System.nanoTime();
            JsonNode jsonNode = doGetForJsonNode(url, uriVariables);
            JsonCCollection<T> response = JsonCCollection.create(itemType, jsonNode);
            long elapsedNS = System.nanoTime() - startNS;
            logResponseSuccess(HttpMethod.GET, "getForJsonC", url, elapsedNS);
            return response;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForJsonC", url, e);
        }
    }

    @Override
    public JsonNode getForJsonNode(String url) throws DataAccessException {
        try {
            long startNS = System.nanoTime();
            JsonNode jsonNode = doGetForJsonNode(url);
            long elapsedNS = System.nanoTime() - startNS;

            logResponseSuccess(HttpMethod.GET, "getForJsonNode", url, elapsedNS);
            return jsonNode;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForJsonNode", url, e);
        }
    }

    @Override
    public Map getForMap(String url) {
        try {
            long startNS = System.nanoTime();
            Map m = restTemplate.getForObject(getAbsoluteUrl(url), Map.class);
            long elapsedNS = System.nanoTime() - startNS;

            logResponseSuccess(HttpMethod.GET, "getForMap", url, elapsedNS);
            return m;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForMap", url, e);
        }
    }

    @Override
    public String getForString(String url) {
        try {
            long startNS = System.nanoTime();
            String s = restTemplate.getForObject(getAbsoluteUrl(url), String.class);
            long elapsedNS = System.nanoTime() - startNS;

            logResponseSuccess(HttpMethod.GET, "getForString", url, elapsedNS);
            return s;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForString", url, e);
        }
    }

    public <T> List<T> getForList(Class<T> itemType, String url) {
        return getForList(itemType, url, null);
    }

    public <T> List<T> getForList(Class<T> itemType, String url, Map<String, ?> uriVariables) {
        logger.debug("getForList: Entered method.  responseType: " + itemType.getCanonicalName() + "; url: " + url + 
                        "; uriVariables: " + LoggingUtil.mapContentsOutput("   ", "uriVariables: ", uriVariables));
        try {
            long startNS = System.nanoTime();
            JsonNode jsonNode = doGetForJsonNode(url, uriVariables);
            logger.debug("getForList: response: " + ((jsonNode==null)?"null":jsonNode.toString()));
            
            JsonCCollection response = JsonCCollection.create(itemType, jsonNode);
            long elapsedNS = System.nanoTime() - startNS;

            logResponseSuccess(HttpMethod.GET, "getForList", url, elapsedNS);

            if (response.getItems() != null) {
                logger.debug("getForObject: returning response (" + response.getItems().getClass().getCanonicalName() + "): " + response.getItems().toString());
                logger.debug("getForObject: returning response item count: " + response.getItems().size());
            }
            else {
                logger.debug("getForObject: returning response (" + response.getItems().getClass().getCanonicalName() + "): response.getItems() was null.");
            }
            
            return response.getItems();
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else
                throw handleResponseError(HttpMethod.GET, "getForList", url, e);
        }
    }

    @Override
    public <T> T getForObject(Class<T> responseType, String url) {
        return getForObject(responseType, url, null);
    }

    @Override
    public <T> T getForObject(Class<T> responseType, String url, Map<String, ?> uriVariables) throws DataAccessException {
        try {
            logger.debug("getForObject: Entered method.  responseType: " + responseType.getCanonicalName() + "; url: " + url + 
                         "; uriVariables: " + LoggingUtil.mapContentsOutput("   ", "uriVariables: ", uriVariables));
            long startNS = System.nanoTime();
            JsonNode json = doGetForJsonNode(url, uriVariables);
            if (json == null) return null;
            // TODO: check for errors
//        if (json.has("error")) throw new exception;
//        if (json.get("data").get("items").get(0))
            
            logger.debug("getForObject: response: " + json.toString());
            
            JsonNode item = json.path("data").path("items").path(0);
            logger.debug("getForObject: response - data.items.path(0): " + item.toString());
            if (item.isMissingNode()) return null;

            T returnValue = jsonMapper.convertValue(item, responseType);
            
            if ((returnValue != null) && (returnValue instanceof PatientDemographics)) {
                logger.debug("getForObject: returning patient response: " + ((PatientDemographics) returnValue).toJSON());
            }
            else if (returnValue != null) {
                logger.debug("getForObject: returning response (" + returnValue.getClass().getCanonicalName() + "): " + returnValue.toString());
            }
            long elapsedNS = System.nanoTime() - startNS;

            logResponseSuccess(HttpMethod.GET, "getForObject", url, elapsedNS);
            return returnValue;
        } catch (RestClientException e) {
            if (isNotFound(e))
                return null;
            else {
                logger.error("getForObject: RestClientException occurred.  Error: " + e.getMessage(), e);
                throw handleResponseError(HttpMethod.GET, "getForObject", url, e);
            }
        }
    }

    @Override
    public <T> URI postForLocation(String url, T item) {
        try {
            long startNS = System.nanoTime();
            logger.debug("JdsTemplate.postForLocation: Service URL: " + getAbsoluteUrl(url));
            logger.debug("JdsTemplate.postForLocation: Item type: " + item.getClass().getCanonicalName());
            URI uri = restTemplate.postForLocation(getAbsoluteUrl(url), createHttpEntity(item));
            long elapsedNS = System.nanoTime() - startNS;
            logResponseSuccess(HttpMethod.POST, "postForLocation(" + uri.getPath().substring(uri.getPath().lastIndexOf('/') + 1) + ")", url, elapsedNS);
            return uri;
        } catch (RestClientException e) {
            throw handleResponseError(HttpMethod.POST, "postForLocation", url, e);
        }
    }

    @Override
    public <T> URI putForLocation(String url, T item) {
        throw new NotImplementedException();
    }

    @Override
    public void delete(String url) {
        this.delete(url, null);
    }

    @Override
    public void delete(String url, Map<String, Object> params) {
        try {
            long startNS = System.nanoTime();
            if(params!=null) {
                restTemplate.delete(getAbsoluteUrl(url), params);
            } else {
                restTemplate.delete(getAbsoluteUrl(url));
            }
            long elapsedNS = System.nanoTime() - startNS;

            logResponseSuccess(HttpMethod.DELETE, "delete", url, elapsedNS);
        } catch (RestClientException e) {
            if (isNotFound(e)) {
                logger.warn("delete request for \"{}\" resulted in 404 (Not Found)", url);
            } else {
                throw handleResponseError(HttpMethod.DELETE, "delete", url, e);
            }
        }
    }

    protected JsonNode doGetForJsonNode(String url, Object... uriVariables) {
        // Make distinction between uri variables explicitly send and not
        // This helps with passing special characters in uri- ex {} in observations uid
        if (uriVariables != null && uriVariables.length > 0) {
            //return restTemplate.getForObject(getAbsoluteUrl(url), JsonNode.class, uriVariables);
            return restTemplate.execute(getAbsoluteUrl(url), HttpMethod.GET, null, jsonNodeResponseExtractor, uriVariables);
        } else {
            return doGetForJsonNode(url);
        }
    }

    protected JsonNode doGetForJsonNode(String url, Map<String, ?> uriVariables) {
        // Make distinction between uri variables explicitly send and not
        // This helps with passing special characters in uri- ex {} in observations uid
        if (uriVariables != null && !uriVariables.isEmpty()) {
            return restTemplate.execute(getAbsoluteUrl(url), HttpMethod.GET, null, jsonNodeResponseExtractor, uriVariables);
        } else {
            return doGetForJsonNode(url);
        }
    }

    protected JsonNode doGetForJsonNode(String url) {
        return restTemplate.execute(toUri(url), HttpMethod.GET, null, jsonNodeResponseExtractor);
    }

    private boolean isNotFound(RestClientException e) {
        return e instanceof HttpClientErrorException && ((HttpClientErrorException) e).getStatusCode().equals(HttpStatus.NOT_FOUND);
    }

    protected URI toUri(String url) {
        UriComponentsBuilder ucb = UriComponentsBuilder.fromUriString(getAbsoluteUrl(url));
        return ucb.build().toUri();
    }

    private String getAbsoluteUrl(String url) {
        return StringUtils.applyRelativePath(jdsUrl, url);
    }

    private void logResponseSuccess(HttpMethod httpMethod, String jdsTemplateMethod, String url, long elapsedNS) {
        if (logger.isDebugEnabled()) {
            logger.debug(httpMethod.name() + " " + url + " [200 OK " + jdsTemplateMethod + " " + TimeUnit.NANOSECONDS.toMillis(elapsedNS) + "ms]");
        }
    }

    private DataAccessException handleResponseError(HttpMethod httpMethod, String jdsTemplateMethod, String url, RestClientException e) {
        if (logger.isErrorEnabled()) {
            if (e instanceof HttpStatusCodeException) {
                HttpStatusCodeException ex = (HttpStatusCodeException) e;
                ;
                logger.error("{} {} [{} {} {}]", httpMethod.name(), StringUtils.deleteAny(url, "\n\r"), 
                		ex.getStatusCode(), ex.getStatusText(), StringUtils.deleteAny(url, "\n\r"));
//                logger.error(httpMethod.name() + " " + url + " [" + ex.getStatusCode() + " " + ex.getStatusText() + " " + jdsTemplateMethod + "]");
            } else {
            	logger.error("{} {} [{} {}]", httpMethod.name(), StringUtils.deleteAny(url, "\n\r"), 
            			e.getClass().getSimpleName(), StringUtils.deleteAny(url, "\n\r"));
//                logger.error(httpMethod.name() + " " + url + " [" + e.getClass().getSimpleName() + " " + jdsTemplateMethod + "]");
            }
        }
        return exceptionTranslator.translate(jdsTemplateMethod, url, e);
    }
}
