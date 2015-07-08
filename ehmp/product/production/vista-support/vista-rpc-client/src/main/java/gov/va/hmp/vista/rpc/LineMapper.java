package gov.va.hmp.vista.rpc;

/**
 * An interface used by RpcTemplate for mapping lines of an RpcResponse on a per-line basis. Implementations of this
 * interface perform the actual work of mapping each line to a result object, but don't need to worry about exception
 * handling. {@link RpcException BrokerExceptions} will be caught and handled by the calling
 * RpcTemplate.
 * <p>Typically used for {@link RpcTemplate}'s execute methods.  LineMapper objects are
 * typically stateless and thus reusable; they are an ideal choice for
 * implementing line-mapping logic in a single place.
 *
 * @see RpcTemplate
 * @see RpcResponseExtractor
 */
public interface LineMapper<T> {

    /**
     * Implementations must implement this method to map each line of data in the RpcResponse.
     *
     * @param line    the line of the response to map
     * @param lineNum the number of the current line
     * @return the result object for the current line
     */
    T mapLine(String line, int lineNum);
}
