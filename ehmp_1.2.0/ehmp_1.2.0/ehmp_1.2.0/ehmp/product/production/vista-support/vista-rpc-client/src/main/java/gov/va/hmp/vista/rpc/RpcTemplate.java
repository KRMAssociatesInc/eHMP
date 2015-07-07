package gov.va.hmp.vista.rpc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.hmp.vista.rpc.broker.protocol.RpcParam;
import gov.va.hmp.vista.rpc.conn.*;
import gov.va.hmp.vista.rpc.pool.ConnectionManager;
import gov.va.hmp.vista.rpc.pool.DefaultConnectionManager;
import gov.va.hmp.vista.rpc.support.DefaultRpcExceptionTranslator;
import gov.va.hmp.vista.rpc.support.RpcExceptionTranslator;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * <b>This is the central class in the vista broker package.</b> It simplifies the use of vista RPCs and helps to avoid
 * common errors. It executes core broker workflow, leaving application code to call RPCs and extract results.  This
 * class executes RPCs, optionally initiating iteration over the result lines and catching broker exceptions and
 * translating them to the generic, more informative exception hierarchy defined in the
 * <code>org.springframework.dao</code> package.
 * <p/>
 * <p>All RPC operations performed by this class are logged at debug level, using "gov.va.cpe.vista.broker.RpcTemplate"
 * as the log category.
 * <p/>
 * <p>Can be used within a service implementation via direct instantiation with a ConnectionFactory reference, or get
 * prepared in an application context and given to services as bean reference. Note: The ConnectionFactory should always
 * be configured as a bean in the application context, in the first case given to the service directly, in the second
 * case to the prepared template.
 * <p/>
 * <p>Because this class is parameterizable by the callback interfaces and the {@link
 * gov.va.hmp.vista.rpc.support.RpcExceptionTranslator} interface, there should be no need to subclass it.
 *
 * @see gov.va.hmp.vista.rpc.conn.ConnectionFactory
 * @see gov.va.hmp.vista.rpc.support.RpcExceptionTranslator
 * @see LineMapper
 */
public class RpcTemplate implements DisposableBean, RpcOperations {

    private static final String XUS_INTRO_MSG = "XUS INTRO MSG";

    private static final Logger logger = LoggerFactory.getLogger(RpcTemplate.class);

    private ConnectionFactory connectionFactory;
    private RpcExceptionTranslator exceptionTranslator = new DefaultRpcExceptionTranslator();
    private RpcHostResolver hostResolver;
    private CredentialsProvider credentialsProvider;
    private List<RpcListener> rpcListenerList;
    private JacksonRpcResponseExtractor jsonResponseExtractor = new JacksonRpcResponseExtractor();

    /**
     * If this variable is set to a non-zero value, it will be used for setting the timeout property on
     * <code>RpcRequest</code>s used for RPC executions.
     */
    private int timeout = 0;

    /**
     * Construct a new RpcTemplate for bean usage.
     */
    public RpcTemplate() {
        this(createDefaultConnectionFactory());
    }

    private static ConnectionFactory createDefaultConnectionFactory() {
        try {
            DefaultConnectionManager connectionManager = new DefaultConnectionManager();
            connectionManager.afterPropertiesSet();
            return connectionManager;
        } catch (Exception e) {
            logger.error("Unable to create default connection Factory", e);
            throw new RuntimeException(e);
        }
    }

    /**
     * Construct a new RpcTemplate, given a ConnectionFactory to obtain VistA connections from.
     *
     * @param connectionFactory the ConnectionFactory to obtain VistA connections from
     */
    public RpcTemplate(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    /**
     * Return the ConnectionFactory used by this template.
     */
    public ConnectionFactory getConnectionFactory() {
        return connectionFactory;
    }

    /**
     * Return the exception translator for this instance.
     */
    public RpcExceptionTranslator getExceptionTranslator() {
        return exceptionTranslator;
    }

    /**
     * Set the exception translator for this instance. <p>If no custom translator is provided, a default {@link
     * gov.va.hmp.vista.rpc.support.DefaultRpcExceptionTranslator} is used which examines the RpcException's type and/or
     * error messages to carry out its exception translation.
     *
     * @see gov.va.hmp.vista.rpc.support.DefaultRpcExceptionTranslator
     */
    public void setExceptionTranslator(RpcExceptionTranslator exceptionTranslator) {
        this.exceptionTranslator = exceptionTranslator;
    }

    public RpcHostResolver getHostResolver() {
        return hostResolver;
    }

    public void setHostResolver(RpcHostResolver hostResolver) {
        this.hostResolver = hostResolver;
    }

    public CredentialsProvider getCredentialsProvider() {
        return credentialsProvider;
    }

    public void setCredentialsProvider(CredentialsProvider credentialsProvider) {
        this.credentialsProvider = credentialsProvider;
    }

    public void addRpcListener(RpcListener rpcListener) {
        if (this.rpcListenerList == null) {
            this.rpcListenerList = Collections.synchronizedList(new ArrayList());
        }
        this.rpcListenerList.add(rpcListener);
    }

    public void removeRpcListener(RpcListener rpcListener) {
        if (this.rpcListenerList == null) return;

        this.rpcListenerList.remove(rpcListener);
    }

    public List<RpcListener> getRpcListeners() {
        return Collections.unmodifiableList(this.rpcListenerList);
    }

    public void setRpcListeners(List<RpcListener> rpcListenerList) {
        this.rpcListenerList = Collections.synchronizedList(rpcListenerList);
    }

    public ObjectMapper getJsonMapper() {
        return jsonResponseExtractor.getJsonMapper();
    }

    public void setJsonMapper(ObjectMapper jsonMapper) {
        jsonResponseExtractor.setJsonMapper(jsonMapper);
    }

    /**
     * Return the timeout in seconds for RPCs that this RpcTemplate executes.
     */
    public int getTimeout() {
        return timeout;
    }

    /**
     * Set the timeout in seconds for RPCs that this RpcTemplate executes. <p>Default is 0, indicating to use the
     * RpcRequest's default.
     *
     * @see RpcRequest#setTimeout(int)
     */
    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    @Override
    public RpcResponse execute(RpcRequest request) throws DataAccessException {
        return doExecute(request);
    }
    
    private void outputRequestInfo(String sMessage, RpcRequest request) {
        String sCRLF = System.getProperty("line.separator");
        StringBuffer sbText = new StringBuffer();
        sbText.append(sMessage + sCRLF);
        sbText.append("RpcTemplate: Dumping contents of request: " + sCRLF + sCRLF);
        sbText.append("Got here by the following trace: " + Arrays.toString(Thread.currentThread().getStackTrace()) + sCRLF + sCRLF);
        
        if (request != null) {
            sbText.append("    credentials: " + request.getCredentials() + sCRLF);
            sbText.append("    rpcContext: " + request.getRpcContext() + sCRLF);
            sbText.append("    rpcName: " + request.getRpcName() + sCRLF);
            sbText.append("    rpcVersion: " + request.getRpcVersion() + sCRLF);
            sbText.append("    timeout: " + request.getTimeout() + sCRLF);
            sbText.append("    uriString: " + request.getUriString() + sCRLF);
    
            if ((request.getParams() != null) &&
                (request.getParams().size() > 0)) {
                int i = 0;
                for (RpcParam oRpcParam : request.getParams()) {
                    sbText.append("    rpcParam[" + i + "]:" + sCRLF);
                    sbText.append("        type: " + oRpcParam.getType() + sCRLF);
                    sbText.append("        value: " + oRpcParam.getValue() + sCRLF);
                    i++;
                }
            }
    
            if (request.getHost() != null) {
                sbText.append("    host:" + sCRLF);
                sbText.append("        hostname: " + request.getHost().getHostname() + sCRLF);
                sbText.append("        port: " + request.getHost().getPort() + sCRLF);
                sbText.append("        scheme: " + request.getHost().getScheme() + sCRLF);
            }
        }
        else {
            sbText.append("    request was null" + sCRLF);
        }
        
        logger.debug(sbText.toString());
    }
    
    private void outputAuthInfo(ConnectionSpec auth) {
        String sCRLF = System.getProperty("line.separator");
        StringBuffer sbText = new StringBuffer();
        sbText.append("RpcTemplate: Dumping contents of auth: " + sCRLF);

        if (auth != null) {
            sbText.append("    clientHostName: " + auth.getClientHostName() + sCRLF);
            sbText.append("    clientAddress: " + auth.getClientAddress() + sCRLF);
            sbText.append("    hashCode: " + auth.hashCode() + sCRLF);
        }
        else {
            sbText.append("    auth was null" + sCRLF);
        }

        logger.debug(sbText.toString());
        
    }

    protected RpcResponse doExecute(RpcRequest request) {
        Connection c = null;
        ConnectionSpec auth = null;
        try {
            try {
                outputRequestInfo("doExecute: Before validateRequest...", request);
                request = validateRequest(request);
                outputRequestInfo("doExecute: After validateRequest...", request);
                RpcHost host = request.getHost();
                auth = createConnectionSpec(request);
                outputAuthInfo(auth);
                c = this.connectionFactory.getConnection(host, auth);
            } catch (RpcException e) {
                logger.error("doExecute: RpcException occurred.  Error: " + e.getMessage(), e);
                fireRpcExceptionEvent(request, e);
                throw getExceptionTranslator().translate("open", RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
            try {
                logger.debug("executing {}", RpcUriUtils.sanitize(request.getUriString(), auth));

                RpcResponse response = c.send(request);

                logger.debug("received  {}", response.toString());

                fireRpcResponseEvent(request, response);

                return response;
            } catch (RpcException e) {
                fireRpcExceptionEvent(request, e);
                throw getExceptionTranslator().translate("send", RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
        } catch (DataAccessException e) {
            if (e instanceof PermissionDeniedDataAccessException) {
                logger.debug("permission denied in " + RpcUriUtils.sanitize(request.getUriString(), auth), e);
            } else {
                logger.error("error in  " + RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
            throw e;
        } finally {
            try {
                if (c != null) c.close();
            } catch (RpcException e) {
                fireRpcExceptionEvent(request, e);
                throw getExceptionTranslator().translate("close", RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
        }
    }

    protected void fireRpcResponseEvent(RpcRequest request, RpcResponse response) {
        if (rpcListenerList == null || rpcListenerList.isEmpty()) return;
        final RpcEvent event = new RpcEvent(request, response);
        dispatchEvent(event);
    }

    protected void fireRpcExceptionEvent(RpcRequest request, RpcException exception) {
        if (rpcListenerList == null || rpcListenerList.isEmpty()) return;
        final RpcEvent event = new RpcEvent(request, exception);
        dispatchEvent(event);
    }

    protected void dispatchEvent(RpcEvent event) {
        RpcListener[] listeners = rpcListenerList.toArray(new RpcListener[rpcListenerList.size()]);
        for (RpcListener listener: listeners) {
            listener.onRpc(event);
        }
    }

    protected RpcRequest validateRequest(RpcRequest request) {
        RpcHost host = request.getHost();
        if (host == null || host.getPort() == -1) {
            Assert.notNull(getHostResolver(), "[Assertion failed] - attempted to resolve ambiguous host, but hostResolver was null");
            host = getHostResolver().resolve(host != null ? host.getHostname() : null);
        }
        if (requiresCredentials(request)) {
            String credentials = request.getCredentials();
            if (!StringUtils.hasText(credentials)) {
                Assert.notNull(getCredentialsProvider(), "[Assertion failed] - attempted to provide credentials for RPC request without them, but credentialsProvider was null");
                credentials = getCredentialsProvider().getCredentials(host, credentials);
            }
            return request = new RpcRequest(host, credentials, request);
        } else {
            return request = new RpcRequest(host, null, request);
        }
    }

    private boolean requiresCredentials(RpcRequest request) {
        if (!StringUtils.hasText(request.getRpcContext()) && XUS_INTRO_MSG.equals(request.getRpcName())) {
            return false;
        } else {
            return true;
        }
    }

    protected RpcRequest createRpcRequest(String uri, Object... params) {
        return createRpcRequest(uri, Arrays.asList(params));
    }

    protected RpcRequest createRpcRequest(String uri, List params) {
        RpcRequest request = new RpcRequest(uri, params);
        if (getTimeout() > 0) request.setTimeout(getTimeout());
        return request;
    }

    protected RpcRequest createRpcRequest(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) {
        return createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, Arrays.asList(params));
    }

    protected RpcRequest createRpcRequest(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) {
        RpcRequest request = new RpcRequest(host, RpcUriUtils.toCredentials(division, accessCode, verifyCode, null, null), rpcContext, rpcName, params);
        if (getTimeout() > 0) request.setTimeout(getTimeout());
        return request;
    }

    @Override
    public RpcResponse execute(String uri, Object... params) throws DataAccessException {
        return execute(createRpcRequest(uri, params));
    }

    @Override
    public RpcResponse execute(String uri, List params) throws DataAccessException {
        return execute(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public RpcResponse execute(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return execute(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public RpcResponse execute(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return execute(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String executeForString(RpcRequest request) throws DataAccessException {
        return execute(request).toString();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String executeForString(String uri, Object... params) throws DataAccessException {
        return executeForString(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String executeForString(String uri, List params) throws DataAccessException {
        return executeForString(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String executeForString(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForString(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String executeForString(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForString(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean executeForBoolean(String uri, List params) throws DataAccessException {
        return executeForBoolean(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean executeForBoolean(String uri, Object... params) throws DataAccessException {
        return executeForBoolean(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean executeForBoolean(RpcRequest request) throws DataAccessException {
        Boolean b = executeForObject(Boolean.class, request);
        return (b != null ? b : false);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean executeForBoolean(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForBoolean(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean executeForBoolean(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForBoolean(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int executeForInt(String uri, List params) throws DataAccessException {
        return executeForInt(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int executeForInt(String uri, Object... params) throws DataAccessException {
        return executeForInt(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int executeForInt(RpcRequest request) throws DataAccessException {
        Number number = executeForObject(Integer.class, request);
        return (number != null ? number.intValue() : 0);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int executeForInt(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForInt(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int executeForInt(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForInt(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public long executeForLong(String uri, List params) throws DataAccessException {
        return executeForLong(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public long executeForLong(String uri, Object... params) throws DataAccessException {
        return executeForLong(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public long executeForLong(RpcRequest request) throws DataAccessException {
        Number number = executeForObject(Long.class, request);
        return (number != null ? number.longValue() : 0);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public long executeForLong(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForLong(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public long executeForLong(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForLong(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] executeForLines(String uri, List params) throws DataAccessException {
        return executeForLines(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] executeForLines(String uri, Object... params) throws DataAccessException {
        return executeForLines(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] executeForLines(RpcRequest request) throws DataAccessException {
        return execute(new LinesFromRpcResponseExtractor(), request);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] executeForLines(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForLines(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] executeForLines(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForLines(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JsonNode executeForJson(String uri, List params) throws DataAccessException {
        return executeForJson(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JsonNode executeForJson(String uri, Object... params) throws DataAccessException {
        return executeForJson(createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JsonNode executeForJson(RpcRequest request) throws DataAccessException {
        return execute(jsonResponseExtractor, request);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JsonNode executeForJson(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForJson(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public JsonNode executeForJson(RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForJson(createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(Class<T> requiredType, String uri, List params) throws DataAccessException {
        return executeForObject(requiredType, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(Class<T> requiredType, String uri, Object... params) throws DataAccessException {
        return executeForObject(requiredType, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(Class<T> requiredType, RpcRequest request) throws DataAccessException {
        return executeForObject(createSimpleLineMapper(requiredType), request);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(Class<T> requiredType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForObject(requiredType, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(Class<T> requiredType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForObject(requiredType, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(LineMapper<T> lineMapper, String uri, List params) throws DataAccessException {
        return executeForObject(lineMapper, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(LineMapper<T> lineMapper, String uri, Object... params) throws DataAccessException {
        return executeForObject(lineMapper, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(LineMapper<T> lineMapper, RpcRequest request) throws DataAccessException {
        List<T> results = execute(lineMapper, request);
        return DataAccessUtils.requiredSingleResult(results);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForObject(lineMapper, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T executeForObject(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForObject(lineMapper, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> executeForList(Class<T> elementType, String uri, List params) throws DataAccessException {
        return executeForList(elementType, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> executeForList(Class<T> elementType, String uri, Object... params) throws DataAccessException {
        return executeForList(elementType, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> executeForList(Class<T> elementType, RpcRequest request) throws DataAccessException {
        return execute(createSimpleLineMapper(elementType), request);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> executeForList(Class<T> elementType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return executeForList(elementType, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> executeForList(Class<T> elementType, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return executeForList(elementType, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> execute(LineMapper<T> lineMapper, RpcRequest request) throws DataAccessException {
        return execute(new LineMapperRpcResponseExtractor<T>(lineMapper), request);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> execute(LineMapper<T> lineMapper, String uri, List params) throws DataAccessException {
        return execute(lineMapper, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> execute(LineMapper<T> lineMapper, String uri, Object... params) throws DataAccessException {
        return execute(lineMapper, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> execute(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return execute(lineMapper, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> List<T> execute(LineMapper<T> lineMapper, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return execute(lineMapper, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(RpcResponseExtractor<T> re, RpcRequest request) throws DataAccessException {
        return re.extractData(execute(request));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(RpcResponseExtractor<T> re, String uri, Object... params) throws DataAccessException {
        return execute(re, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(RpcResponseExtractor<T> re, String uri, List params) throws DataAccessException {
        return execute(re, createRpcRequest(uri, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(RpcResponseExtractor<T> re, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, Object... params) throws DataAccessException {
        return execute(re, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(RpcResponseExtractor<T> re, RpcHost host, String division, String accessCode, String verifyCode, String rpcContext, String rpcName, List params) throws DataAccessException {
        return execute(re, createRpcRequest(host, division, accessCode, verifyCode, rpcContext, rpcName, params));
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(ConnectionCallback<T> action, RpcRequest request) throws DataAccessException {
        return doExecute(action, request);
    }

    protected <T> T doExecute(ConnectionCallback<T> action, RpcRequest request) {
        Assert.notNull(action, "Callback object must not be null");

        Connection c = null;
        ConnectionSpec auth = null;
        try {

            try {
                request = validateRequest(request);
                RpcHost host = request.getHost();
                auth = createConnectionSpec(request);
                logger.debug("connect   {}", RpcUriUtils.sanitize(request.getUriString(), auth));
                c = this.connectionFactory.getConnection(host, auth);
            } catch (RpcException e) {
                throw getExceptionTranslator().translate("open", RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
            try {
                return action.doInConnection(c);
            } catch (RpcException e) {
                throw getExceptionTranslator().translate("callback", RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
        } catch (DataAccessException e) {
            if (e instanceof PermissionDeniedDataAccessException) {
                logger.debug("permission denied in " + RpcUriUtils.sanitize(request.getUriString(), auth), e);
            } else {
                logger.error("error in  " + RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
            throw e;
        } finally {
            try {
                if (c != null) c.close();
            } catch (RpcException e) {
                throw getExceptionTranslator().translate("close", RpcUriUtils.sanitize(request.getUriString(), auth), e);
            }
        }
    }

    protected ConnectionSpec createConnectionSpec(RpcRequest request) {
       return ConnectionSpecFactory.create(request.getCredentials());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(ConnectionCallback<T> action, String uri) throws DataAccessException {
        return execute(action, createRpcRequest(uri));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public <T> T execute(ConnectionCallback<T> action, RpcHost host, String division, String accessCode, String verifyCode) throws DataAccessException {
        return execute(action, new RpcRequest(host, RpcUriUtils.toCredentials(division, accessCode, verifyCode, null, null), null, null, (List) null));
    }

    /**
     * {@inheritDoc}
     */
//    @Override
//    public SystemInfo getSystemInfo(String uri) {
//        return execute(new SystemInfoConnectionCallback(), uri);
//    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SystemInfo fetchSystemInfo(RpcHost host) throws DataAccessException {
        return execute(new SystemInfoConnectionCallback(), new RpcRequest(host, null, null, XUS_INTRO_MSG));
    }

    protected <T> LineMapper<T> createSimpleLineMapper(Class<T> requiredType) {
        return new SimpleLineMapper<T>(requiredType);
    }

    @Override
    public void destroy() throws Exception {
        if (this.rpcListenerList != null) {
            this.rpcListenerList.clear();
            this.rpcListenerList = null;
        }
        if (this.connectionFactory instanceof ConnectionManager) {
            ((ConnectionManager) this.connectionFactory).shutdown();
        }
    }
}
