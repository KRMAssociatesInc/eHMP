package gov.va.cpe.vpr.pom.jds;

import org.springframework.dao.DataAccessException;
import org.springframework.web.client.RestClientException;

/**
 * Strategy interface for translating between <code>RpcException</code>s and Spring's data access strategy-agnostic
 * {@link org.springframework.dao.DataAccessException} hierarchy.
 *
 * @see org.springframework.dao.DataAccessException
 */
public interface JdsExceptionTranslator {
    /**
     * Translate the given RestClientException into a generic DataAccessException.
     * <p>The returned DataAccessException is supposed to contain the original RestClientException as root cause. However, client code may not
     * generally rely on this due to DataAccessExceptions possibly being caused by other resource APIs as well. That said, a getRootCause()
     * instanceof RestClientException check (and subsequent cast) is considered reliable when expecting RestTemplate-based access to have happened.
     *
     * @param task readable text describing the task being attempted
     * @param url  the url
     * @param e    the offending RestClientException
     * @return the DataAccessException, wrapping the RestClientException
     */
    DataAccessException translate(String task, String url, RestClientException e);
}
