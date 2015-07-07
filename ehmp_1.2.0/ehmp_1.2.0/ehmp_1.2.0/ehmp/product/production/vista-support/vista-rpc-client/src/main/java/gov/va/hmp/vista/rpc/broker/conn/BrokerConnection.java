package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.*;
import gov.va.hmp.vista.rpc.broker.protocol.*;
import gov.va.hmp.vista.rpc.conn.*;
import gov.va.hmp.vista.util.RpcUriUtils;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.SocketException;
import java.util.Collections;
import java.util.Map;

/**
 * Handle to the physical network connection for a connection opened to a VistA system with the VistA Remote Procedure
 * Call Broker protocol.
 */
public class BrokerConnection implements Connection {

    private static final String XUS_INTRO_MSG = "XUS INTRO MSG";
    private static final String XUS_SIGNON_SETUP = "XUS SIGNON SETUP";
    private static final String XUS_AV_CODE = "XUS AV CODE";
    private static final String XUS_CVC = "XUS CVC";
    private static final String XUS_GET_USER_INFO = "XUS GET USER INFO";
    private static final String XUS_DIVISION_GET = "XUS DIVISION GET";
    private static final String XUS_DIVISION_SET = "XUS DIVISION SET";

    private static final String XWB_GET_BROKER_INFO = "XWB GET BROKER INFO";
    private static final String XWB_CREATE_CONTEXT = "XWB CREATE CONTEXT";
    private static final String XWB_IM_HERE = "XWB IM HERE";

    private static final Logger log = LoggerFactory.getLogger(BrokerConnection.class);

    private RpcHost host;
    private Socket socket;
    private RpcProtocol protocol;
    private RpcMessageReader reader;
    private RpcMessageWriter writer;

    private SystemInfo systemInfo;
    private ConnectionUser user;
    private String currentRpcContext;

    private BrokerConnectionMetrics metrics;
    private long elapsedConnectingMillis = -1L;

    public BrokerConnection(RpcHost host, Socket socket, RpcProtocol protocol) {
        if (socket == null) throw new IllegalArgumentException("socket must not be null");
        if (protocol == null) throw new IllegalArgumentException("protocol must not be null");

        this.host = host;
        this.socket = socket;
        this.protocol = protocol;

        this.writer = protocol.createWriter(this.socket);
        this.reader = protocol.createReader(this.socket);

        this.metrics = new BrokerConnectionMetrics(this.socket.getInTransportMetrics(), this.socket.getOutTransportMetrics());
    }

    public RpcHost getHost() {
        return host;
    }

    public SystemInfo getSystemInfo() throws RpcException {
        if (systemInfo == null) {
            systemInfo = fetchSystemInfo();
        }
        return systemInfo;
    }

    public ConnectionUserDetails getUserDetails() throws RpcException {
        return user;
    }

    public boolean isAuthenticated() {
        return user != null;
    }

    public synchronized void stop() throws RpcException {
        log.debug("Stopping connection at {}/{}", getSocket().getRemoteHostName(), getSocket().getRemoteHostAddress());
        getWriter().writeStopConnection();
        getWriter().flush();
        try {
            getReader().readResponse();
        } catch (EOFException e) {
            log.debug("No response whilst stopping connection at " + getSocket().getRemoteHostName() + "/" + getSocket().getRemoteHostAddress(), e);
        }
    }

    public RpcResponse send(RpcRequest request) throws RpcException {
        if (!isAuthenticated() && !isAnonymousRpc(request)) {
            throw new AuthenticationException("unable to call RPC on an unauthenticated connection");
        }

//        if (request.getHost() != null && !host.equals(request.getHost()))
//            throw new IllegalArgumentException("RPC request host " + request.getHost() + " must match connection host " + host);
//        else
//            request = new RpcRequest(host, request.getCredentials(), request);
//        TODO: validate request host matches connection host turn request into absolute if relative using connection host/user details

        if (isNotInCurrentContext(request))
            setCurrentRpcContext(request.getRpcContext());

        RpcResponse response = sendInternal(request);
        if (!response.getSecuritySegment().isEmpty()) {
            if (response.getSecuritySegment().endsWith("exist on the server.")) {
                throw new RpcNotFoundException(response.getSecuritySegment());
            } else {
                throw new InternalServerException(response.getSecuritySegment());
            }
        }
        metrics.incrementResponseCount(response.getElapsedMillis());

        return response;
    }

    protected boolean isAnonymousRpc(RpcRequest request) {
        if (StringUtils.hasText(request.getRpcContext())) return false;
        // only allow following RPCs to be called without authenticating first
        if (XUS_SIGNON_SETUP.equals(request.getRpcName()) ||
                XUS_AV_CODE.equals(request.getRpcName()) ||
                XUS_INTRO_MSG.equals(request.getRpcName()) ||
                XWB_GET_BROKER_INFO.equals(request.getRpcName()) ||
                XUS_GET_USER_INFO.equals(request.getRpcName()) ||
                XUS_DIVISION_GET.equals(request.getRpcName()) ||
                XUS_DIVISION_SET.equals(request.getRpcName()))
            return true;
        else
            return false;
    }

    public synchronized RpcResponse sendInternal(RpcRequest request) throws RpcException {
        long start = System.currentTimeMillis();
        try {
            getSocket().setSoTimeout(request.getTimeout() * 1000);
        } catch (SocketException e) {
            log.warn("unable to set socket timeout", e);
        }

        String credentials = request.getCredentials();
        ConnectionSpec auth = (StringUtils.hasText(credentials)) ? ConnectionSpecFactory.create(request.getCredentials()) : new AnonymousConnectionSpec();

        if (log.isDebugEnabled()) {
            log.debug("Sending  " + RpcUriUtils.sanitize(request.getUriString(), auth));
        }
        getWriter().write(request);
        getWriter().flush();
        long sendMillis = System.currentTimeMillis() - start;
        metrics.incrementRequestCount(sendMillis);

        RpcResponse response = getReader().readResponse();
        response.setRequestUri(RpcUriUtils.sanitize(request.getUriString(), auth));
        if (user != null) {
            response.setDUZ(user.getDUZ());
            response.setDivision(user.getDivision());
            if (user.getDivision() != null) {
                response.setDivisionName(user.getDivisionNames().get(user.getDivision()));
            }
        } else if (auth instanceof AnonymousConnectionSpec) {
            response.setDUZ(AnonymousConnectionSpec.ANONYMOUS);
        }
        if (systemInfo != null)
            response.setVistaId(systemInfo.getVistaId());

        if (log.isDebugEnabled())
            log.debug("Received " + RpcUriUtils.sanitize(request.getUriString(), auth) + " in " + response.getElapsedMillis() + " milliseconds");

        response.setElapsedMillis(RpcPhase.CONNECTING, getElapsedMillis());
        response.setElapsedMillis(RpcPhase.SENDING, sendMillis);
        return response;
    }

    private boolean isNotInCurrentContext(RpcRequest request) {
        if (getCurrentRpcContext() == null && request.getRpcContext() == null)
            return false;
        else
            return !(getCurrentRpcContext() != null && request.getRpcContext() != null) || !getCurrentRpcContext().equals(request.getRpcContext());
    }

    public synchronized void close() {
        try {
            stop();
            log.debug("Closing connection to {}/{}", getSocket().getRemoteHostName(), getSocket().getRemoteHostAddress());
            getSocket().close();
        } catch (IOException e) {
            e.printStackTrace();  // TODO: replace with something reasonable
        } catch (RpcException rpcError) {
            rpcError.printStackTrace();  // TODO: replace with something reasonable
        }
    }

    public boolean isClosed() throws RpcException {
        if (getSocket() == null)
            return true;
        else
            return getSocket().isClosed();
    }

    public boolean isStale() {
        try {
            pulse();
            return false;
        } catch (RpcException e) {
            return true;
        }
    }

    @Override
    public ConnectionMetrics getMetrics() {
        return metrics;
    }

    @Override
    public long getElapsedMillis() {
        return elapsedConnectingMillis;
    }

    public void setElapsedMillis(long millis) {
        this.elapsedConnectingMillis = millis;
    }

    public SystemInfo fetchSystemInfo() throws RpcException {
        RpcResponse r = send(new RpcRequest(XUS_SIGNON_SETUP));
        VistaSystemInfo info = new VistaSystemInfoResponseExtractor().extractData(r);

        r = send(new RpcRequest(XUS_INTRO_MSG));
        info.setIntroText(r.toString());

        r = send(new RpcRequest(XWB_GET_BROKER_INFO));
        if (r.length() > 0) {
            int timeoutInSeconds = Integer.parseInt(r.toLines()[0].trim());
            info.setActivityTimeoutSeconds(timeoutInSeconds);
        }

        return info;
    }

    public void pulse() throws RpcException {
        RpcRequest rpc = new RpcRequest(XWB_IM_HERE);
        rpc.setRpcVersion("1.106");
        RpcResponse response = sendInternal(rpc);
        if (!"1".equals(response.toString())) {
            throw new RpcException("Pulse failed, response was:" + response.toString());
        }
    }

    public void authenticate(AccessVerifyConnectionSpec av) throws RpcException {
        RpcRequest rpcRequest = new RpcRequest(XUS_AV_CODE, new RpcParam(Hash.encrypt(av.getCredentials())));
        RpcResponse r = this.send(rpcRequest);
        String msg = r.toLines()[3];
        if (BadCredentialsException.INVALID_CREDENTIALS_MESSAGE.equals(msg)) {
            throw new BadCredentialsException(msg);
        }
        if (av instanceof ChangeVerifyCodeConnectionSpec) {
            // We don't care whether or not it was expired; We just did this to prime the requisite variables in VISTA.
            ChangeVerifyCodeConnectionSpec cvc = (ChangeVerifyCodeConnectionSpec) av;
            String cvcArg = getChangeVerifyCodeArgument(cvc);
            r = sendInternal(new RpcRequest(XUS_CVC, cvcArg));
            if (!"0".equals(r.toLines()[0])) {
                // Handle specific exception for specific situations
                if (r.toLines().length > 1) {
                    throw new ChangeVerifyCodeException(r.toLines()[1]);
                } else {
                    throw new ChangeVerifyCodeException("Change Verify Code failed.");
                }
            } else { // verify code change was successful
                av = new AccessVerifyConnectionSpec(cvc.getDivision(), cvc.getAccessCode(), cvc.getNewVerifyCode(), cvc.getClientAddress(), cvc.getClientHostName());
            }
        } else {
            if ("0".equals(r.toLines()[0])) {
                if ("1".equals(r.toLines()[2])) {
                    throw new VerifyCodeExpiredException(r.toLines()[3]);
                } else if ("1".equals(r.toLines()[1])) {
                    throw new LockedException(r.toLines()[3]);
                }
                LoggerFactory.getLogger(this.getClass()).warn("Unknown authentication error: " + r.toLines()[3]);
                throw new AuthenticationException(r.toLines()[3]);
            } else {
                // Sign-on was OK according to FileMan documentation on 'XUS AV CODE' rpc
            }
        }

        ConnectionUser user = fetchUserInfo(av);
        handleMultiDivisionalUser(av.getDivision(), user);
        this.user = user;
    }

    // check for multiple divisions and set appropriate one
    private void handleMultiDivisionalUser(String requestedDivision, ConnectionUser user) {
        RpcResponse r = send(new RpcRequest(XUS_DIVISION_GET));
        Map<String, String> divisions = new DivisionMapResponseExtractor().extractData(r);
        if (divisions.isEmpty()) {
            if (StringUtils.hasText(requestedDivision) && !requestedDivision.equalsIgnoreCase(user.getDivision())) {
                throw new DivisionMismatchException("Mismatch between user division '" + user.getDivision() + "' and requested division '" + requestedDivision + "'");
            }
        } else {
            if (StringUtils.hasText(requestedDivision)) {
                if (!divisions.containsKey(requestedDivision))
                    throw new DivisionMismatchException("Mismatch between user divisions '" + StringUtils.collectionToCommaDelimitedString(divisions.keySet()) + "' and requested division '" + requestedDivision + "'");

                // set correct division
                r = send(new RpcRequest(XUS_DIVISION_SET, new RpcParam(requestedDivision)));
                if (!r.toString().equals("1"))
                    throw new RpcException("Error setting division to '" + requestedDivision + "'");

                user.setDivision(requestedDivision);
            }
            user.setDivisionNames(divisions);
        }
    }

    private ConnectionUser fetchUserInfo(ConnectionSpec auth) {
        RpcResponse r = send(new RpcRequest(XUS_GET_USER_INFO));
        ConnectionUser user = new ConnectionUserResponseExtractor().extractData(r);
        user.setCredentials(auth.toString());
        return user;
    }

    public void authenticate(AppHandleConnectionSpec appHandleConnectionSpec) {
        RpcRequest rpcRequest = new RpcRequest(XUS_AV_CODE, new RpcParam(appHandleConnectionSpec.getHandle()));
        RpcResponse r = this.send(rpcRequest);
        String[] lines = r.toLines();
        String duz = lines[0];
        if (!duz.startsWith("0")) {
           // NOOP: auth successful
        } else if (duz.startsWith("0")) {
            throw new BadCredentialsException();
        } else if (lines.length >= 3 && "1".equals(lines[2])) {
           throw new VerifyCodeExpiredException();
        } else if (lines.length >= 4) {
            LoggerFactory.getLogger(this.getClass()).warn("Unknown authentication error: " + lines[3]);
            throw new AuthenticationException(lines[3]);
        }

        ConnectionUser user = fetchUserInfo(appHandleConnectionSpec);
        handleMultiDivisionalUser(appHandleConnectionSpec.getDivision(), user);
        this.user = user;
    }

    public String getCurrentRpcContext() {
        return currentRpcContext;
    }

    void setCurrentRpcContext(String rpcContext) throws RpcException {
        try {
            createContext(rpcContext);
            this.currentRpcContext = rpcContext;
        } catch (RpcException e) {
            this.currentRpcContext = null;
            throw e;
        }
    }

    String getChangeVerifyCodeArgument(ChangeVerifyCodeConnectionSpec cvc) {
        return Hash.encrypt(cvc.getVerifyCode().toUpperCase()) + VistaStringUtils.U + Hash.encrypt(cvc.getNewVerifyCode().toUpperCase()) + VistaStringUtils.U + Hash.encrypt(cvc.getConfirmNewVerifyCode());
    }

    /*
    * This function is part of the overall Broker security.
    * The passed context string is essentially a Client/Server type option
    * on the server.  The server sets up MenuMan environment variables for this
    * context which will later be used to screen RPCs.  Only those RPCs which are
    * in the multiple field of this context option will be permitted to run.
    */
    private void createContext(String rpcContext) throws RpcException {
        if (rpcContext == null) rpcContext = "";
        RpcResponse response = sendInternal(new RpcRequest(XWB_CREATE_CONTEXT, Collections.singletonList(new RpcParam(Hash.encrypt(rpcContext)))));
        String responseStr = response.toString();
        if (!"1".equals(responseStr)) {
            if (responseStr.endsWith("not exist on server.")) {
                throw new RpcContextNotFoundException(response.getSecuritySegment());
            } else if (responseStr.contains("does not have access to option")) {
                throw new RpcContextAccessDeniedException(response.getSecuritySegment());
            } else {
                throw new InternalServerException(response.getSecuritySegment());
            }
        }
    }

    protected Socket getSocket() {
        return socket;
    }

    private RpcMessageWriter getWriter() {
        return writer;
    }

    private RpcMessageReader getReader() {
        return reader;
    }
}
