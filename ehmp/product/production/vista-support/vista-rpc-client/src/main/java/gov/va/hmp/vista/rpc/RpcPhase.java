package gov.va.hmp.vista.rpc;

/**
 * Various phases involved in calling a VistA RPC.
 */
public enum RpcPhase {
    /**
     * Phase during which a connection is being established, including TCP handshakes/retries, DNS lookup, and authenticating with VistA.
     */
    CONNECTING,
    /**
     * Phase during which the request is waiting for an already established connection to become available for re-use.
     */
    BLOCKING,
    /**
     * Phase during which the request is being sent.
     */
    SENDING,
    /**
     * Phase during which the request is waiting for a response.
     */
    WAITING,
    /**
     * Phase during which the response is being received.
     */
    RECEIVING
}
