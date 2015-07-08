package gov.va.hmp.vista.rpc;

/**
 * Implementations of CredentialsProvider are called by {@link RpcTemplate} to supply the credentials for VistA RPC requests that are
 * missing them.
 * <p/>
 * For example, the VistA RPC URI:
 * <code>vrpcb://localhost:9060/FOO/BAR</code>
 * is valid but not sufficient for executing the BAR remote procedure call in the FOO context at localhost port 9060.
 * {@link RpcTemplate} delegates the addition of replacement of the userInfo part of the URI to implementations of this interface.
 * <code>vrpcb://{userInfo}@localhost:9060/FOO/BAR</code>
 *
 * @see RpcTemplate
 */
public interface CredentialsProvider {
    String getCredentials(RpcHost host, String userInfo);
}
