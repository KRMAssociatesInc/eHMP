package gov.va.hmp.vista.rpc.conn;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcHost;

/**
 * <code>ConnectionFactory</code> provides an interface for getting a connection to a VistA instance.
 * <p/>
 * Note: this is a little bit like a JDBC {@link javax.sql.DataSource})
 */
public interface ConnectionFactory {
    /**
     * Gets a connection to a VistA instance.
     *
     * @param host
     * @param auth Connection parameters and security information specified as ConnectionSpec instance
     * @return a <code>Connection</code> instance
     * @throws gov.va.hmp.vista.rpc.RpcException if there is an error during the attempt to get the connection.
     */
    Connection getConnection(RpcHost host, ConnectionSpec auth) throws RpcException;
}

