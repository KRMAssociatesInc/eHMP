package gov.va.hmp.vista.rpc;

import java.util.EventListener;

/**
 * Interface to be implemented by RPC event listeners.
 * Based on the standard <code>java.util.EventListener</code> interface
 * for the Observer design pattern.
 */
public interface RpcListener extends EventListener {
    /**
     * Receive notification of an RPC event.
     *
	 * @param rpcEvent the event that occurred.
     */
    void onRpc(RpcEvent rpcEvent);
}
