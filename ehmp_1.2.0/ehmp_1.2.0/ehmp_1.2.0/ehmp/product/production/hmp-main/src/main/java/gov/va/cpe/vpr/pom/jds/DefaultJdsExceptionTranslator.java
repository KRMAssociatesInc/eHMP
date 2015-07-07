package gov.va.cpe.vpr.pom.jds;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.POMUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.dao.NonTransientDataAccessResourceException;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;

public class DefaultJdsExceptionTranslator implements JdsExceptionTranslator {

    @Override
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
            JsonNode json = POMUtils.parseJSONtoNode(jsonResponse);
            JsonNode firstError = json.path("error").path("errors").path(0);
            message += "; " + firstError.path("message").asText();
        }
        return "JDS error during " + task + " at \"" + url + "\": " + message;
    }
}
