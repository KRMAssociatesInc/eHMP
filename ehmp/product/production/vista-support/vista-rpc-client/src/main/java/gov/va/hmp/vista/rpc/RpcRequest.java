package gov.va.hmp.vista.rpc;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import gov.va.hmp.vista.rpc.broker.protocol.RpcParam;
import gov.va.hmp.vista.rpc.jackson.SanitizeCredentialsSerializer;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.web.util.UriComponents;

import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * Defines an object to provide RPC execution information to VistA.
 * <p/>
 * <p>An <code>RpcRequest</code> object provides data including
 * hostname, port, credentials, RPC Context, RPC name, timeout and RPC parameter names, types and values.
 *
 * @see RpcTemplate
 * @see gov.va.hmp.vista.rpc.conn.Connection
 */
public class RpcRequest implements Serializable {
    public static final int MINIMUM_TIMEOUT = 14; // seconds
    public static final int DEFAULT_TIMEOUT = 30; // seconds

    public static final String DEFAULT_VERSION = "0";

    private RpcHost host;
    private String credentials;
    private String rpcContext;
    private String rpcName;
    private String rpcVersion = DEFAULT_VERSION;
    private List<RpcParam> params;

    private int timeout = DEFAULT_TIMEOUT;

    /**
     * Constructs an RpcRequest from the given URI.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri the URI from which to create an RpcRequest
     */
    public RpcRequest(String uri) {
        this(uri, (List) null);
    }

    /**
     * Constructs an RpcRequest from the given URI and parameter list.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    the URI from which to create an RpcRequest
     * @param params the paramters to bind to the RPC
     */
    public RpcRequest(String uri, Object... params) {
        this(uri, Arrays.asList(params));
    }

    /**
     * Construct an RpcRequest from the given URI and parameter list.
     * <p>VistA RPC URIs are of the form:
     * <code>[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}</code>
     *
     * @param uri    the URI from which to create an RpcRequest
     * @param params the paramters to bind to the RPC
     * @throws URISyntaxException 
     */
    public RpcRequest(String uri, List params) {
    	this.credentials = RpcUriUtils.extractUserInfo(uri);
    	this.host = RpcUriUtils.extractHost(uri);
        this.rpcContext = RpcUriUtils.extractRpcContext(uri);
        this.rpcName = RpcUriUtils.extractRpcName(uri);
        this.params = new ArrayList<RpcParam>();
        if (params != null) {
            for (Object p : params) {
                addParam(p);
            }
        }
    }

    public RpcRequest(RpcHost host, String credentials, RpcRequest request) {
        this(host, credentials != null ? credentials : request.getCredentials(), request.getRpcContext(), request.getRpcName(), request.params);
        this.timeout = request.timeout;
    }

    public RpcRequest(RpcHost host, String credentials, String rpcContext, String rpcName) {
        this(host, credentials, rpcContext, rpcName, (List) null);
    }

    public RpcRequest(RpcHost host, String credentials, String rpcContext, String rpcName, Object... params) {
        this(host, credentials, rpcContext, rpcName, Arrays.asList(params));
    }

    public RpcRequest(RpcHost host, String credentials, String rpcContext, String rpcName, List params) {
        this.host = host;
        this.credentials = credentials;
        this.rpcContext = rpcContext;
        this.rpcName = rpcName;
        this.params = new ArrayList<RpcParam>();
        if (params != null) {
            for (Object p : params) {
                addParam(p);
            }
        }
    }

    @Deprecated
    public URI getURI() {
        return RpcUriUtils.toURI(this);
    }

    public String getUriString() {
        return this.getUriComponents().toUriString();
    }

    public UriComponents getUriComponents() {
        return RpcUriUtils.toUriComponents(this);
    }

    public RpcHost getHost() {
        return host;
    }

    @JsonSerialize(using = SanitizeCredentialsSerializer.class)
    public String getCredentials() {
        return credentials;
    }

    /**
     * Return the name of the context of the RPC
     */
    public String getRpcContext() {
        return rpcContext;
    }

    /**
     * Return the name of the RPC
     */
    public String getRpcName() {
        return rpcName;
    }

    /**
     * Return the list of params associated with this request.
     *
     * @see RpcParam
     */
    public List<RpcParam> getParams() {
        return Collections.unmodifiableList(params);
    }

    /**
     * Return the RPC version.
     */
    public String getRpcVersion() {
        return rpcVersion;
    }

    /**
     * Specifies the RPC version.
     * <p/>
     * <p>Default is {@link RpcRequest#DEFAULT_VERSION}
     *
     * @param rpcVersion a string representing the RPC version.
     */
    public void setRpcVersion(String rpcVersion) {
        this.rpcVersion = rpcVersion;
    }

    /**
     * Return the timeout in seconds for this RPC.
     */
    public int getTimeout() {
        return timeout;
    }

    /**
     * Specifies the time, in seconds, to wait before this request should time out.
     * <p>Default is {@link RpcRequest#DEFAULT_TIMEOUT}.
     *
     * @param timeout An integer specifying the number of seconds.
     */
    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public RpcRequest addParam(RpcParam rpcParam) {
        params.add(rpcParam);
        return this;
    }

    public RpcRequest addParam(String literal) {
        params.add(RpcParam.create(literal));
        return this;
    }

    public RpcRequest addParam(Map m) {
        params.add(RpcParam.create(m));
        return this;
    }

    public RpcRequest addParam(List l) {
        params.add(RpcParam.create(l));
        return this;
    }

    public RpcRequest addParam(Object o) {
        params.add(RpcParam.create(o));
        return this;
    }

    public boolean isAbsolute() {
        return getURI().isAbsolute();
    }

    @Override
    public String toString() {
        return getURI().toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RpcRequest that = (RpcRequest) o;
        return this.toString().equals(that.toString());
    }

    @Override
    public int hashCode() {
        return this.toString().hashCode();
    }
}
