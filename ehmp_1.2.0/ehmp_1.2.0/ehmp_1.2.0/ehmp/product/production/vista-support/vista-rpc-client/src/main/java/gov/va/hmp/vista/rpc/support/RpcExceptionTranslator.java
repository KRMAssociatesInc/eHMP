package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.RpcException;
import org.springframework.dao.DataAccessException;

/**
 * Strategy interface for translating between <code>RpcException</code>s and Spring's data access strategy-agnostic
 * {@link org.springframework.dao.DataAccessException} hierarchy.
 *
 * @see org.springframework.dao.DataAccessException
 */
public interface RpcExceptionTranslator {
    /**
     * Translate the given RpcException into a generic DataAccessException.
     * <p>The returned DataAccessException is supposed to contain the original RpcException as root cause. However, client code may not
     * generally rely on this due to DataAccessExceptions possibly being caused by other resource APIs as well. That said, a getRootCause()
     * instanceof RpcException check (and subsequent cast) is considered reliable when expecting RPC-based access to have happened.
     *
     * @param task readable text describing the task being attempted
     * @param rpc  description of RPC that caused the problem (may be null)
     * @param e    the offending RpcException
     * @return the DataAccessException, wrapping the RpcException
     */
    DataAccessException translate(String task, String rpc, RpcException e);
}
