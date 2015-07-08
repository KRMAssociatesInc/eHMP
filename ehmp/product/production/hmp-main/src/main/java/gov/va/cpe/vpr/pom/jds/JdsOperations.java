package gov.va.cpe.vpr.pom.jds;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.hmp.jsonc.JsonCCollection;
import org.springframework.dao.DataAccessException;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Interface specifying a basic set of JSON Data Store (JDS) operations. Implemented by {@link JdsTemplate}.
 * Not often used directly, but a useful option to enhance testability, as it can easily
 * be mocked or stubbed.
 *
 * @see JdsTemplate
 */
public interface JdsOperations {
    /**
     * Tests availability of JDS by executing a GET to the <code>/ping</code> URI. If JDS is unreachable or unavailable, an exception is thrown.
     * @throws DataAccessException
     */
    void ping() throws DataAccessException;

    /**
     * Retrieve a JSON-C collection representation by doing a GET on the relative JDS URI and parsing the response as a JSON-C collection.
     * The items in the collection are returned as {@link Map<String,Object>}s.
     *
     * @param uri the URI
     * @param uriVariables the variables to expand in the JDS URI template
     * @return a {@link JsonCCollection} containing the response from the JDS
     */
    JsonCCollection<Map<String, Object>> getForJsonC(String uri, Object... uriVariables) throws DataAccessException;

    /**
     * Retrieve a JSON-C collection representation by doing a GET on the relative JDS URI and parsing the response as a JSON-C collection.
     * The items in the collection are returned as {@link Map<String,Object>}s.
     *
     * @param uri the URI
     * @param uriVariables the map containing variables for the URI template
     * @return a {@link JsonCCollection} containing the response from the JDS
     */
    JsonCCollection<Map<String, Object>> getForJsonC(String uri, Map<String, ?> uriVariables) throws DataAccessException;

    /**
     * Retrieve a JSON-C collection representation by doing a GET on the relative JDS URI and parsing the response as a JSON-C collection.
     * The items in the collection are returned as the specified itemType.
     *
     * @param itemType the type of the items in the returned collection
     * @param uri the URI
     * @return a {@link JsonCCollection} containing the response from the JDS
     */
    <T> JsonCCollection<T> getForJsonC(Class<T> itemType, String uri) throws DataAccessException;

    /**
     * Retrieve a JSON-C collection representation by doing a GET on the relative JDS URI and parsing the response as a JSON-C collection.
     * The items in the collection are returned as the specified itemType.
     *
     * @param itemType the type of the items in the returned collection
     * @param uri the URI
     * @param uriVariables the map containing variables for the URI template
     * @return a {@link JsonCCollection} containing the response from the JDS
     */
    <T> JsonCCollection<T> getForJsonC(Class<T> itemType, String uri, Map<String, ?> uriVariables) throws DataAccessException;

    /**
     * Retrieve a JSON representation by doing a GET on the relative JDS URI and parsing the response as JSON.
     *
     * @param uri the URI
     * @return a JsonNode representing the JSON response returned by the JDS
     */
    JsonNode getForJsonNode(String uri) throws DataAccessException;

    /**
     * Retrieve a representation by doing a GET on the relative JDS URI.
     * The JSON-C response is parsed and the item at the <code>data.items[0]</code> node (if any) is converted and returned.
     *
     * @param responseType the type of the return value
     * @param uri the URI
     * @return the converted object or null if the JDS returns a 404 or its response JSON doesn't contain a data.items[0] node.
     */
    <T> T getForObject(Class<T> responseType, String uri) throws DataAccessException;

    /**
     * Retrieve a representation by doing a GET on the relative JDS URI template.
     * The response (if any) is converted and returned.
     * <p>URI Template variables are expanded using the given map.
     *
     * @param responseType the type of the return value
     * @param uri the URI
     * @param uriVariables the map containing variables for the URI template
     * @return the converted object or null if the JDS returns a 404 or its response JSON doesn't contain a data.items[0] node.
     */
    <T> T getForObject(Class<T> responseType, String uri, Map<String, ?> uriVariables) throws DataAccessException;

    /**
     * Retrieve a list of items by doing a GET on the relative JDS URI.
     * The JSON-C response is parsed and the items at the <code>data.items</code> node (if any) are converted and returned.
     *
     * @param itemType the type of the items in the returned list
     * @param uri the URI
     * @return
     */
    <T> List<T> getForList(Class<T> itemType, String uri) throws DataAccessException;

    /**
     * Retrieve a list of items by doing a GET on the relative JDS URI.
     * The JSON-C response is parsed and the items at the <code>data.items</code> node (if any) are converted and returned.
     * <p>URI Template variables are expanded using the given map.
     *
     * @param itemType the type of the items in the returned list
     * @param uri the URI
     * @param uriVariables the map containing variables for the URI template
     * @return
     */
    <T> List<T> getForList(Class<T> itemType, String uri, Map<String, ?> uriVariables) throws DataAccessException;

    /**
     * Create a new or replace an existing resource in the JDS by POSTing a JSON representation of the given object to the URI, and returns the value of the Location header.
     * <p/>
     * This header typically indicates where the new resource is stored.
     *
     * @param uri
     * @param item
     * @return
     */
    <T> URI postForLocation(String uri, T item) throws DataAccessException;

    // TODOC: write Javadoc for this
    <T> URI putForLocation(String uri, T item) throws DataAccessException;

    /**
     * Delete the resource(s) at the specified relative JDS URI.
     *
     * @param uri
     */
    void delete(String uri) throws DataAccessException;
    void delete(String uri, Map<String, Object> params) throws DataAccessException;

    Map getForMap(String url);

    String getForString(String url);
}
