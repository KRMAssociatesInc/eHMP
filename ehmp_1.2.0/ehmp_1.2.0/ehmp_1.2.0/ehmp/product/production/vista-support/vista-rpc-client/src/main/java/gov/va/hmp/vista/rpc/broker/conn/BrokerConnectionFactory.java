package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.broker.protocol.*;
import gov.va.hmp.vista.rpc.conn.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import java.io.IOException;

/**
 * This class is responsible for opening and authenticating connections to VistA systems using
 * the VistA Remote Procedure Call Broker protocol.
 */
public class BrokerConnectionFactory implements ConnectionFactory {

    private static final int DEFAULT_CONNECT_TIMEOUT_MILLISECONDS = 10000; // milliseconds

    protected Logger log = LoggerFactory.getLogger(getClass());

    private boolean oldProtocolOnly = false;
    private boolean backwardsCompatible = true;
    private SocketFactory socketFactory;

    public BrokerConnectionFactory() {
        this(new DefaultSocketFactory());
    }

    public BrokerConnectionFactory(SocketFactory socketFactory) {
        Assert.notNull(socketFactory, "[Assertion failed] - socketFactory must not be null");
        this.socketFactory = socketFactory;
    }

    public boolean isBackwardsCompatible() {
        return backwardsCompatible;
    }

    public void setBackwardsCompatible(boolean backwardsCompatible) {
        this.backwardsCompatible = backwardsCompatible;
    }

    public boolean isOldProtocolOnly() {
        return oldProtocolOnly;
    }

    public void setOldProtocolOnly(boolean oldProtocolOnly) {
        this.oldProtocolOnly = oldProtocolOnly;
    }

    public synchronized Connection getConnection(RpcHost host, ConnectionSpec auth) throws RpcException {
        if (auth == null) throw new IllegalArgumentException("connectionSpec must not be null");
        if (!(auth instanceof AccessVerifyConnectionSpec) && !(auth instanceof AnonymousConnectionSpec) && !(auth instanceof AppHandleConnectionSpec))
            throw new UnsupportedOperationException("only access/verify, app handle and anonymous authentication currently supported");

        long start = System.currentTimeMillis();
        log.debug("Creating connection to " + host.toString());

        RpcProtocol protocol = isOldProtocolOnly() ? new OldRpcProtocol(socketFactory) : new NewRpcProtocol(socketFactory);

        Socket socket = null;
        try {
            socket = protocol.connect(host, DEFAULT_CONNECT_TIMEOUT_MILLISECONDS, auth.getClientAddress(), auth.getClientHostName());
        } catch (ServiceTemporarilyDownException e) {
            throw e;
        } catch (IOException e) {
            throw new RpcException(e);
        } catch (EOFException e) {
            if (protocol instanceof NewRpcProtocol && isBackwardsCompatible()) {
                protocol = new OldRpcProtocol(socketFactory);
                try {
                    socket = protocol.connect(host, DEFAULT_CONNECT_TIMEOUT_MILLISECONDS, auth.getClientAddress(), auth.getClientHostName());
                } catch (IOException ex) {
                    throw new RpcException(ex);
                }
            } else {
                throw new UnsupportedProtocolException();
            }
        } catch (RpcException e) {
            throw e;
        }
        if (socket == null) throw new RpcException("unable to connect");
        BrokerConnection connection = new BrokerConnection(host, socket, protocol);
        try {
            connection.getSystemInfo();

            if (auth instanceof AccessVerifyConnectionSpec) {
                connection.authenticate((AccessVerifyConnectionSpec) auth);
            } else if (auth instanceof AppHandleConnectionSpec) {
                connection.authenticate((AppHandleConnectionSpec) auth);
            }
//            else {
//                TODO: implement other authentication schemes here (NTLogon?)
//            }
        } catch (RpcException e) {
            connection.close();
            throw e;
        }
        connection.setElapsedMillis(System.currentTimeMillis() - start);
        return connection;
    }

}
