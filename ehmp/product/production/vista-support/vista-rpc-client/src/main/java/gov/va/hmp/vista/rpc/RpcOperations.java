package gov.va.hmp.vista.rpc;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.hmp.vista.rpc.conn.SystemInfo;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * Interface specifying a basic set of RPC operations.
 * Implemented by {@link RpcTemplate}. Not often used directly, but a useful
 * option to enhance testability, as it can easily be mocked or stubbed.
 * <p/>
 * <p>Alternatively, the VistA connection factory/connection infrastructure can be mocked.
 * However, mocking this interface constitutes significantly less work.
 *
 * @see RpcTemplate
 */
public interface RpcOperations {
    /**
     * Executes an RPC request returning a raw {@link RpcResponse}.
     * <p/>
     * Most of the other methods in this interface delegate to this one.
     *
     * @param request the request to execute
     * @return the response to the request
     * @throws DataAccessException if there is any problem executing the RPC
     */
    RpcResponse execute(RpcRequest request) throws DataAccessException;

    /**
     * Executes the RPC at the specified URI, returning a raw {@link RpcResponse}.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    the URI
     * @param params parameters to bind to the RPC
     * @return an RpcResponse representation
     * @throws DataAccessException if there is any problem executing the RPC
     * @see gov.va.hmp.vista.util.RpcUriUtils
     */
    RpcResponse execute(String uri, Object... params) throws DataAccessException;

    /**
     * Executes the RPC at the specified URI, returning a raw {@link RpcResponse}.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    the URI
     * @param params parameters to bind to the RPC
     * @return an RpcResponse representation
     * @throws DataAccessException if there is any problem executing the RPC
     * @see gov.va.hmp.vista.util.RpcUriUtils
     */
    RpcResponse execute(String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC, returning a raw {@link RpcResponse}.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return an RpcResponse representation
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    RpcResponse execute(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC, expecting a raw RpcResponse.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return an RpcResponse representation
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    RpcResponse execute(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request expecting the response as a string value.
     *
     * @param request the request to execute
     * @return a String representation of the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String executeForString(RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as a string value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return a String representation of the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String executeForString(String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as a string value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    the URI
     * @param params parameters to bind to the RPC
     * @return a String representation of the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String executeForString(String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC expecting the response as a string value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return a String representation of the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String executeForString(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC expecting the response as a string value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return a String representation of the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String executeForString(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request expecting the response as a boolean value.
     *
     * @param request the request to execute
     * @return the boolean value, or <code>false</code> in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    boolean executeForBoolean(RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as a boolean value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the boolean value, or <code>false</code> in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    boolean executeForBoolean(String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as a boolean value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the boolean value, or <code>false</code> in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    boolean executeForBoolean(String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC that results in a boolean value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the boolean value, or <code>false</code> in case of an empty response
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    boolean executeForBoolean(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC that results in a boolean value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the boolean value, or <code>false</code> in case of an empty response
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    boolean executeForBoolean(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request expecting the response as an <code>int</code> value.
     *
     * @param request the request to execute
     * @return the int value, or 0 in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    int executeForInt(RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as an <code>int</code> value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the int value, or 0 in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    int executeForInt(String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as an <code>int</code> value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the int value, or 0 in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    int executeForInt(String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC that results in an int value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the int value, or 0 in case of an empty response
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    int executeForInt(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC that results in an int value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the int value, or 0 in case of an empty response
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    int executeForInt(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request expecting the response as an <code>long</code> value.
     *
     * @param request the request to execute
     * @return the long value, or 0 in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    long executeForLong(RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as an <code>long</code> value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the long value, or 0 in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    long executeForLong(String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI expecting the response as an <code>long</code> value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the int value, or 0 in case of an empty response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    long executeForLong(String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC that results in a long value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the long value, or 0 in case of an empty response
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    long executeForLong(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC that results in a long value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the long value, or 0 in case of an empty response
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    long executeForLong(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request for an array of Strings, one for each line in the response.
     *
     * @param request the request to execute
     * @return an array of Strings, one for each line in the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String[] executeForLines(RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI for an array of Strings, one for each line in the response.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return an array of Strings, one for each line in the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String[] executeForLines(String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI for an array of Strings, one for each line in the response.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return an array of Strings, one for each line in the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String[] executeForLines(String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC for an array of Strings, one for each line in the response.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return an array of Strings, one for each line in the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String[] executeForLines(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC for an array of Strings, one for each line in the response.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return an array of Strings, one for each line in the response
     * @throws DataAccessException if there is any problem executing the RPC
     */
    String[] executeForLines(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI for JSON resulting in a {@link JsonNode} value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return  the {@link JsonNode} value
     * @throws DataAccessException if there is any problem executing the RPC or parsing the JSON response
     */
    JsonNode executeForJson(String uri, List params) throws DataAccessException;
    /**
     * Execute an RPC at the specified URI for JSON resulting in a {@link JsonNode} value.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return  the {@link JsonNode} value
     * @throws DataAccessException if there is any problem executing the RPC or parsing the JSON response
     */
    JsonNode executeForJson(String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC request expecting the response as JSON in a <code>JsonNode</code> value.
     *
     * @param request the request to execute
     * @return the {@link JsonNode} value
     * @throws DataAccessException if there is any problem executing the RPC or parsing the JSON response
     */
    JsonNode executeForJson(RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC for JSON, resulting in a {@link JsonNode} value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return a {@link JsonNode} representation of the response
     * @throws DataAccessException if there is any problem executing the RPC or parsing the JSON response
     */
    JsonNode executeForJson(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC for JSON returned via a {@link JsonNode} value.
     *
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return a {@link JsonNode} representation of the response
     * @throws DataAccessException if there is any problem executing the RPC or parsing the JSON response
     */
    JsonNode executeForJson(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request for a result object of the specified type.
     * <p>This method is useful for running an RPC with a known outcome.
     * The response is expected to be a single line result; the returned
     * result will be directly mapped to the corresponding object type.
     *
     * @param requiredType the type that the result object is expected to match
     * @param request      the request to execute
     * @return the result object of the required type, or <code>null</code> in case of an empty response.
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(Class<T> requiredType, RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI for a resylt object of the specified type.
     * <p>This method is useful for running an RPC with a known outcome.
     * The response is expected to be a single line result; the returned
     * result will be directly mapped to the corresponding object type.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the result object of the required type, or <code>null</code> in case of an empty response.
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(Class<T> requiredType, String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI for a resylt object of the specified type.
     * <p>This method is useful for running an RPC with a known outcome.
     * The response is expected to be a single line result; the returned
     * result will be directly mapped to the corresponding object type.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    uri the URI
     * @param params parameters to bind to the RPC
     * @return the result object of the required type, or <code>null</code> in case of an empty response.
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(Class<T> requiredType, String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC for a result object.
     * <p>This method is useful for running an RPC with a known outcome.
     * The response is expected to be a single line result; the returned
     * result will be directly mapped to the corresponding object type.
     *
     * @param requiredType the type that the result object is expected to match
     * @param host         hostname, port and scheme with which to excecute the RPC
     * @param division     division of the user with which to execute the RPC
     * @param accessCode   access code of the user with which to execute the RPC
     * @param verifyCode   verify code of the user with which to execute the RPC
     * @param rpcContext   name of the RPC Context
     * @param rpcName      name of the RPC
     * @param params       parameters to bind to the RPC
     * @return the result object of the required type, or <code>null</code> in case of an empty response.
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(Class<T> requiredType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC for a result object.
     * <p>This method is useful for running an RPC with a known outcome.
     * The response is expected to be a single line result; the returned
     * result will be directly mapped to the corresponding object type.
     *
     * @param requiredType the type that the result object is expected to match
     * @param host
     * @param division     division of the user with which to execute the RPC
     * @param accessCode   access code of the user with which to execute the RPC
     * @param verifyCode   verify code of the user with which to execute the RPC
     * @param rpcContext   name of the RPC Context
     * @param rpcName      name of the RPC
     * @param params       parameters to bind to the RPC
     * @return the result object of the required type, or <code>null</code> in case of an empty response.
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(Class<T> requiredType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request, mapping a single line response to a Java object via a <code>LineMapper</code>.
     *
     * @param lineMapper object that will map one object per line
     * @param request    the request to execute
     * @return the single mapped object
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(LineMapper<T> lineMapper, RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI, mapping a single line response to a Java object via a <code>LineMapper</code>.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param lineMapper object that will map one object per line
     * @param uri        uri the URI
     * @param params     parameters to bind to the RPC
     * @return the single mapped object
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(LineMapper<T> lineMapper, String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI, mapping a single line response to a Java object via a <code>LineMapper</code>.
     * <p/>
     * VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param lineMapper object that will map one object per line
     * @param uri        uri the URI
     * @param params     parameters to bind to the RPC
     * @return the single mapped object
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(LineMapper<T> lineMapper, String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC, mapping a single line response to a Java object via a <code>LineMapper</code>.
     *
     * @param lineMapper object that will map one object per line
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the single mapped object
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC, mapping a single line response to a Java object via a <code>LineMapper</code>.
     *
     * @param lineMapper object that will map one object per line
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the single mapped object
     * @throws org.springframework.dao.IncorrectResultSizeDataAccessException
     *                             if the RPC does not return exactly one line
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> T executeForObject(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request for a result list.
     * <p>The response will be mapped to a List (one entry for each line) of
     * result objects, each of them matching the specified element type.
     *
     * @param elementType the required type of element in the result list
     * @param request     the request to execute
     * @return a List of objects that match the specified element type
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> List<T> executeForList(Class<T> elementType, RpcRequest request) throws DataAccessException;

    /**
     * Execute the RPC at the specified URI for a result list.
     * <p>The response will be mapped to a List (one entry for each line) of
     * result objects, each of them matching the specified element type.
     * <p> VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param elementType the required type of element in the result list
     * @param uri         uri the URI
     * @param params      parameters to bind to the RPC
     * @return a List of objects that match the specified element type
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> List<T> executeForList(Class<T> elementType, String uri, Object... params) throws DataAccessException;

    /**
     * Execute the RPC at the specified URI for a result list.
     * <p>The response will be mapped to a List (one entry for each line) of
     * result objects, each of them matching the specified element type.
     * <p> VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param elementType the required type of element in the result list
     * @param uri         uri the URI
     * @param params      parameters to bind to the RPC
     * @return a List of objects that match the specified element type
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> List<T> executeForList(Class<T> elementType, String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC for a result list.
     * <p>The response will be mapped to a List (one entry for each line) of
     * result objects, each of them matching the specified element type.
     *
     * @param elementType the required type of element in the result list
     * @param host        hostname, port and scheme with which to excecute the RPC
     * @param division    division of the user with which to execute the RPC
     * @param accessCode  access code of the user with which to execute the RPC
     * @param verifyCode  verify code of the user with which to execute the RPC
     * @param rpcContext  name of the RPC Context
     * @param rpcName     name of the RPC
     * @param params      parameters to bind to the RPC
     * @return a List of objects that match the specified element type
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> List<T> executeForList(Class<T> elementType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC for a result list.
     * <p>The response will be mapped to a List (one entry for each line) of
     * result objects, each of them matching the specified element type.
     *
     * @param elementType the required type of element in the result list
     * @param host        hostname, port and scheme with which to excecute the RPC
     * @param division    division of the user with which to execute the RPC
     * @param accessCode  access code of the user with which to execute the RPC
     * @param verifyCode  verify code of the user with which to execute the RPC
     * @param rpcContext  name of the RPC Context
     * @param rpcName     name of the RPC
     * @param params      parameters to bind to the RPC
     * @return a List of objects that match the specified element type
     * @throws DataAccessException if there is any problem executing the RPC
     */
    <T> List<T> executeForList(Class<T> elementType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request, mapping each line of the response to a Java object via a <code>LineMapper</code>.
     *
     * @param lineMapper object that will map one line per row
     * @param request    the request to execute
     * @return the result List, containing mapped objects
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> List<T> execute(LineMapper<T> lineMapper, RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI, mapping each line of the response to a Java object via a <code>LineMapper</code>.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param lineMapper object that will map one line per row
     * @param uri        the URI
     * @param params     parameters to bind to the RPC
     * @return the result List, containing mapped objects
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> List<T> execute(LineMapper<T> lineMapper, String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI, mapping each line of the response to a Java object via a <code>LineMapper</code>.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param lineMapper object that will map one line per row
     * @param uri        the URI
     * @param params     parameters to bind to the RPC
     * @return the result List, containing mapped objects
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> List<T> execute(LineMapper<T> lineMapper, String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC, mapping each line of the response to a Java object via a <code>LineMapper</code>.
     *
     * @param lineMapper object that will map one line per row
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the result List, containing mapped objects
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> List<T> execute(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC, mapping each line of the response to a Java object via a <code>LineMapper</code>.
     *
     * @param lineMapper object that will map one line per row
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return the result List, containing mapped objects
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> List<T> execute(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute an RPC request, reading the RpcResponse with an <code>RpcResponseExtractor</code>.
     *
     * @param re      object that will extract all lines of the response
     * @param request the request to execute
     * @return an arbitrary result object, as returned by the RpcResponseExtractor
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> T execute(RpcResponseExtractor<T> re, RpcRequest request) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI, reading the RpcResponse with an <code>RpcResponseExtractor</code>.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param re     object that will extract all lines of the response
     * @param uri    the URI
     * @param params parameters to bind to the RPC
     * @return an arbitrary result object, as returned by the RpcResponseExtractor
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> T execute(RpcResponseExtractor<T> re, String uri, Object... params) throws DataAccessException;

    /**
     * Execute an RPC at the specified URI, reading the RpcResponse with an <code>RpcResponseExtractor</code>.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param re     object that will extract all lines of the response
     * @param uri    the URI
     * @param params parameters to bind to the RPC
     * @return an arbitrary result object, as returned by the RpcResponseExtractor
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> T execute(RpcResponseExtractor<T> re, String uri, List params) throws DataAccessException;

    /**
     * Execute an RPC, reading the RpcResponse with an <code>RpcResponseExtractor</code>.
     *
     * @param re         object that will extract all lines of the response
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return an arbitrary result object, as returned by the RpcResponseExtractor
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> T execute(RpcResponseExtractor<T> re, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException;

    /**
     * Execute an RPC, reading the RpcResponse with an <code>RpcResponseExtractor</code>.
     *
     * @param re         object that will extract all lines of the response
     * @param host
     * @param division   division of the user with which to execute the RPC
     * @param accessCode access code of the user with which to execute the RPC
     * @param verifyCode verify code of the user with which to execute the RPC
     * @param rpcContext name of the RPC Context
     * @param rpcName    name of the RPC
     * @param params     parameters to bind to the RPC
     * @return an arbitrary result object, as returned by the RpcResponseExtractor
     * @throws org.springframework.dao.DataAccessException
     *          if there is any problem executing the RPC
     */
    <T> T execute(RpcResponseExtractor<T> re, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException;

    /**
     * Execute a VistA data access operation via an {@link RpcRequest}, implemented as callback action
     * working on a VistA Connection. This allows for implementing arbitrary
     * data access operations, within Spring style managed VistA RPC environment:
     * translating RpcExceptions into Spring's DataAccessException hierarchy.
     * <p>The callback action can return a result object, for example a
     * domain object or a collection of domain objects.
     *
     * @param action  the callback object that specifies the action
     * @param request the request to execute
     * @return a result object returned by the action, or <code>null</code>
     * @throws DataAccessException if there is any problem
     */
    <T> T execute(ConnectionCallback<T> action, RpcRequest request) throws DataAccessException;

    /**
     * Execute a VistA data access operation at the specified URI, implemented as callback action
     * working on a VistA Connection. This allows for implementing arbitrary
     * data access operations, within Spring style managed VistA RPC environment:
     * translating RpcExceptions into Spring's DataAccessException hierarchy.
     * <p>The callback action can return a result object, for example a
     * domain object or a collection of domain objects.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param action the callback object that specifies the action
     * @param uri    the URI
     * @return a result object returned by the action, or <code>null</code>
     * @throws DataAccessException if there is any problem
     */
    <T> T execute(ConnectionCallback<T> action, String uri) throws DataAccessException;

    /**
     * Execute a VistA data access operation, implemented as callback action
     * working on a VistA Connection. This allows for implementing arbitrary
     * data access operations, within Spring style managed VistA RPC environment:
     * translating RpcExceptions into Spring's DataAccessException hierarchy.
     * <p>The callback action can return a result object, for example a
     * domain object or a collection of domain objects.
     *
     * @param action     the callback object that specifies the action
     * @param host       hostname, port and scheme with which to excecute the RPC
     * @param division   division of the user with which to obtain the connection
     * @param accessCode access code of the user with which to obtain the connection
     * @param verifyCode verify code of the user with which to obtain the connection
     * @return a result object returned by the action, or <code>null</code>
     * @throws DataAccessException if there is any problem
     */
    <T> T execute(ConnectionCallback<T> action, RpcHost host, String division, String accessCode, String verifyCode) throws DataAccessException;

    /**
     * Fetches information about the specified VistA system, including intro text, without requiring an authenticated user.
     * <p/>
     * Clients can use this method to test availability/connectivity of the specified system.
     *
     * @param host hostname, port and scheme from which to fetch the system info.
     * @return an instance of {@link gov.va.hmp.vista.rpc.conn.SystemInfo}
     * @throws DataAccessException if there is any problem
     * @see gov.va.hmp.vista.rpc.conn.SystemInfo
     */
    SystemInfo fetchSystemInfo(RpcHost host) throws DataAccessException;
}
