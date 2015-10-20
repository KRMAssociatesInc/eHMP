package us.vistacore.asu.dao;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.dao.NonTransientDataAccessResourceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;
import us.vistacore.asu.rules.AsuRuleDef;
import us.vistacore.asu.rules.DocumentDefinition;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Constructor;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by kumblep on 4/20/15.
 */

@Component
public class JdsDao {

    protected RestTemplate restTemplate=new RestTemplate();
    protected POMObjectMapper jsonMapper = new POMObjectMapper();
    ResponseExtractor<JsonNode> jsonNodeResponseExtractor;
    private static final Logger log = LoggerFactory.getLogger(JdsDao.class);
    protected static POMObjectMapper MAPPER = new POMObjectMapper();
    @Value("${jds.url}")
    private String jdsUrl;

    public JdsDao(){


        jsonNodeResponseExtractor = new ResponseExtractor<JsonNode>() {
            public JsonNode extractData(ClientHttpResponse response)
                    throws IOException {
                return jsonMapper.readTree(new InputStreamReader(response.getBody(), Charset.forName("ISO-8859-1")));
            }
        };
    }

    public <T extends IPOMObject> List<T> findAll(Class<T> type) {
        return findAll(type, (Sort) null);
    }

    public <T extends IPOMObject> List<T> findAll(Class<T> type, Sort sort) {
        String collectionName = getCollectionName(type);
        UriComponentsBuilder uri = UriComponentsBuilder.fromPath("/data/find/" + collectionName);
        addSortQueryParams(sort, uri);
        return findAllInternal(type, uri.build().toUriString()).getContent();
    }

    protected <T extends IPOMObject> Page<T> findAllInternal(Class<T> type, String uri) {
        Page<T> page = findAllInternal(type, uri,null);
        if (!page.hasContent()) return page;

        List<T> validatedItems = new ArrayList<T>(page.getNumberOfElements());
        for (T item : page.getContent()) {

            validatedItems.add(item);
        }
        PageRequest pageable = page.getSize() > 0 ? new PageRequest(page.getNumber(), page.getSize(), page.getSort()) : null;
        return new PageImpl<T>(validatedItems, pageable, page.getTotalElements());
    }

    /*
    private <T extends IPOMObject> T validateOne(T val) {
        if (val instanceof Team) {
            Team t = (Team) val;
            if (t.getStaff() != null) {
                for (Team.StaffAssignment sa : t.getStaff()) {
                    String buid = sa.getBoardUid();
                    if (buid != null && !buid.equals("")) {
                        ViewDefDef vdd = findByUID(ViewDefDef.class, buid);
                        if (vdd == null) {
                            sa.setBoard(new ViewDefDef());
                        }
                    }
                }
            }
        }
        return val;
    }
    */


    protected String getCollectionName(Class type) {

        if(type==null)
            return null;

        if(type.equals(AsuRuleDef.class))
            return "asu-rule";

        if(type.equals(DocumentDefinition.class))
            return "doc-def";

        return null;
    }

    protected <T extends IPOMObject> Page<T> findAllInternal(Class<T> type, String uri, Map<String, Object> uriVariables) {
        JsonCCollection<Map<String, Object>> jsonc = uriVariables == null ? getForJsonC(uri) : getForJsonC(uri, uriVariables);
        if (jsonc == null) throw new DataRetrievalFailureException("JDS getForJsonC at '" + uri + "' returned null");

        List<T> list = new ArrayList<T>(jsonc.getItems().size());
        for (Map<String, Object> item : jsonc.getItems()) {
            list.add(newInstance(type, item));
        }
        if (jsonc.getStartIndex() != null && jsonc.getItemsPerPage() != null && jsonc.getItemsPerPage() > 0) {
            int pageNum = jsonc.getStartIndex() / jsonc.getItemsPerPage();
            return new PageImpl<T>(list, new PageRequest(pageNum, jsonc.getItemsPerPage()), jsonc.getTotalItems());
        } else {
            return new PageImpl<T>(list, null, jsonc.getTotalItems());
        }
    }

    public static final <T extends IPOMObject> T newInstance(Class<T> clazz, Map<String, Object> data) {
        if (data == null) return null;
        try {
            Constructor<T> c = (Constructor<T>) clazz.getConstructor(Map.class);
            return c.newInstance(data);
        } catch (Exception ex) {
            // this shouldn't happen b/c we are using very explicit type safety/genetics
            throw new RuntimeException(ex);
        }
    }


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

    private boolean isNotFound(RestClientException e) {
        return e instanceof HttpClientErrorException && ((HttpClientErrorException) e).getStatusCode().equals(HttpStatus.NOT_FOUND);
    }


    private void logResponseSuccess(HttpMethod httpMethod, String jdsTemplateMethod, String url, long elapsedNS) {
        if (log.isDebugEnabled()) {
            log.debug(httpMethod.name() + " " + url + " [200 OK " + jdsTemplateMethod + " " + TimeUnit.NANOSECONDS.toMillis(elapsedNS) + "ms]");
        }
    }


    private DataAccessException handleResponseError(HttpMethod httpMethod, String jdsTemplateMethod, String url, RestClientException e) {
        if (log.isErrorEnabled()) {
            if (e instanceof HttpStatusCodeException) {
                HttpStatusCodeException ex = (HttpStatusCodeException) e;
                ;
                log.error("{} {} [{} {} {}]", httpMethod.name(), StringUtils.deleteAny(url, "\n\r"),
                        ex.getStatusCode(), ex.getStatusText(), StringUtils.deleteAny(url, "\n\r"));
            } else {
                log.error("{} {} [{} {}]", httpMethod.name(), StringUtils.deleteAny(url, "\n\r"),
                        e.getClass().getSimpleName(), StringUtils.deleteAny(url, "\n\r"));
            }
        }
        return translate(jdsTemplateMethod, url, e);
    }

    public DataAccessException translate(String task, String url, RestClientException e) {
        if (e instanceof ResourceAccessException) {
            return new DataAccessResourceFailureException(getMessage(task, url), e);
        } else if (e instanceof HttpStatusCodeException) {
            return new DataRetrievalFailureException(getMessage(task, url, (HttpStatusCodeException) e), e);
        } else {
            return new NonTransientDataAccessResourceException(getMessage(task, url), e);
        }
    }

    private String getMessage(String task, String url) {
        return "JDS error during " + task + " at \"" + url + "\"";
    }

    private String getMessage(String task, String url, HttpStatusCodeException e) {
        String message = e.getMessage();
        String jsonResponse = e.getResponseBodyAsString();
        if (StringUtils.hasText(jsonResponse)) {
            JsonNode json = parseJSONtoNode(jsonResponse);
            JsonNode firstError = json.path("error").path("errors").path(0);
            message += "; " + firstError.path("message").asText();
        }
        return "JDS error during " + task + " at \"" + url + "\": " + message;
    }

    public static final JsonNode parseJSONtoNode(String jsonString) {
        try {
            return MAPPER.readTree(jsonString);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
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
    protected JsonNode doGetForJsonNode(String url) {
        return restTemplate.execute(toUri(url), HttpMethod.GET, null, jsonNodeResponseExtractor);
    }
    protected URI toUri(String url) {
        UriComponentsBuilder ucb = UriComponentsBuilder.fromUriString(getAbsoluteUrl(url));
        return ucb.build().toUri();
    }

    private String getAbsoluteUrl(String url) {
        return StringUtils.applyRelativePath(jdsUrl, url);
    }

    protected static void addSortQueryParams(Sort sort, UriComponentsBuilder uri) {
        if (sort == null) return;

        for (Sort.Order order : sort) {
            uri.queryParam("order", order.getProperty());
        }
    }


}
