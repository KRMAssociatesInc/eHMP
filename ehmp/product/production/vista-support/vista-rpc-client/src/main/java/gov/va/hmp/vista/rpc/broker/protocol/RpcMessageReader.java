package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcResponse;

/**
 * TODOC: Provide summary documentation of class gov.va.cpe.vista.protocol.impl.RpcProtocolReader
 */
public interface RpcMessageReader {
    RpcResponse readResponse() throws RpcException;
}
