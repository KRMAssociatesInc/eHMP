package gov.va.hmp.vista.rpc;

/**
 * Defines a general exception the VistA RPC client can throw when it encounters difficulty.
 */
public class RpcIoException extends RpcException {
    public RpcIoException() {
        super();
    }
    
    public RpcIoException(String message) {
        super(message);
    }

    public RpcIoException(String message, Throwable cause) {
        super(message, cause);
    }

    public RpcIoException(Throwable cause) {
        super(cause);
    }
}
