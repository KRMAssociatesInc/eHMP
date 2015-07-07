package gov.va.hmp.vista.rpc.conn;

import java.io.Serializable;

/**
 * <code>ConnectionSpec</code> is used by an application component to pass broker connection request-specific properties to the
 * {@link ConnectionFactory#getConnection(gov.va.hmp.vista.rpc.RpcHost, ConnectionSpec)} method.
 *
 * @see ConnectionFactory
 */
public interface ConnectionSpec extends Serializable {

    String getClientAddress();

    String getClientHostName();

    boolean equals(Object o);

    int hashCode();
}
