package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;

/**
 * TODOC: Provide summary documentation of class gov.va.cpe.vista.protocol.impl.RpcRequestWriter
 */
public interface RpcMessageWriter {
    void writeStartConnection(String hostname, String address, int localPort) throws RpcException;

    void writeStopConnection() throws RpcException;

    void write(RpcRequest request) throws RpcException;

    void flush() throws RpcException;
}
