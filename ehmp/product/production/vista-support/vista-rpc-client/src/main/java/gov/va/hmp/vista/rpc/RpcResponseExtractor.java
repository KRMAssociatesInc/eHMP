package gov.va.hmp.vista.rpc;

import org.springframework.dao.DataAccessException;

/**
 * Callback interface used by {@link RpcTemplate}'s execute methods.
 * Implementations of this interface perform the actual work of extracting
 * results from a {@link RpcResponse}, but don't need to worry
 * about exception handling. {@link RpcException BrokerExceptions}
 * will be caught and handled by the calling RpcTemplate.
 * <p/>
 * <p>This interface is mainly used within the VistA RPC framework itself.
 * A {@link LineMapper} is usually a simpler choice for RpcResponse processing,
 * mapping one result object per line instead of one result object for the entire RpcResponse.
 *
 * @see RpcTemplate
 * @see LineMapper
 */
public interface RpcResponseExtractor<T> {
    /**
     * Implementations must implement this method to process the entire RpcResponse.
     *
     * @param response RpcResponse to extract data from.
     * @return an arbitrary result object, or <code>null</code> if none
     * @throws DataAccessException in case of custom exceptions
     */
    T extractData(RpcResponse response) throws RpcResponseExtractionException;
}

