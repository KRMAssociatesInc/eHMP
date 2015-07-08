package gov.va.hmp.vista.rpc;

import gov.va.hmp.vista.rpc.conn.Connection;
import org.springframework.dao.DataAccessException;

/**
 * Generic callback interface for code that operates on a VistA Connection.
 * Allows to execute any number of operations on a single Connection.
 *
 * <p>This is particularly useful for lumping together several RPCs into one block
 * that expects a Connection to work on and throws RpcException. However, it is
 * strongly recommended to use RpcTemplate's more specific
 * operations, for example a <code>executeForString</code> or <code>executeForObject</code> variant.
 *
 * @author Juergen Hoeller
 * @since 1.1.3
 * @see RpcOperations#execute(ConnectionCallback, String)
 * @see RpcOperations#executeForString(String, Object...)
 */
public interface ConnectionCallback<T> {
    /**
	 * Gets called by <code>RpcTemplate.execute</code> with an active VistA
	 * Connection. Does not need to care about activating or closing the
	 * Connection, or handling transactions.
	 *
	 * <p>Allows for returning a result object created within the callback, i.e.
	 * a domain object or a collection of domain objects. Note that there's special
	 * support for single step actions: see <code>RpcTemplate.executeForObject</code>
	 * etc. A thrown RuntimeException is treated as application exception:
	 * it gets propagated to the caller of the template.
	 *
	 * @param con active VistA Connection
	 * @return a result object, or <code>null</code> if none
	 * @throws RpcException if thrown by an RPC method, to be auto-converted
	 * to a DataAccessException by a RpcExceptionTranslator
	 * @throws DataAccessException in case of custom exceptions
	 * @see RpcOperations#executeForObject(Class, String, Object...)
	 * @see RpcOperations#executeForList(Class, String, Object...)
	 */
    T doInConnection(Connection con) throws RpcException, DataAccessException;
}
