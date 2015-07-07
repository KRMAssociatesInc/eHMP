package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;

public class UnsupportedProtocolException extends RpcException {
    public UnsupportedProtocolException() {
        super("Broker requires a UCX or single connection protocol and this port uses the callback protocol.  The application is specified to be non-backwards compatible.  Installing patch XWB*1.1*35 and activating this port number for UCX connections will correct the problem.");
    }
}
