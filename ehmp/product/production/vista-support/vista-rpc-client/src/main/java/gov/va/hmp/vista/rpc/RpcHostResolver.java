package gov.va.hmp.vista.rpc;

import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;

/**
 * Implementations of RpcHostResolver are called by {@link RpcTemplate} to resolve ambiguous or encoded hostnames into RpcHost instances that contain
 * VistA connection information.
 * <p/>
 * For example, the VistA RPC URI:
 * <code>vrpcb://ABC/FOO/BAR</code>
 * is valid but not sufficient for executing the BAR remote procedure call in the FOO context.  {@link RpcTemplate} delegates
 * the resolution of <code>ABC</code> into a hostname and port (an instance of {@link RpcHost} so the RPC can be executed.
 *
 * @see RpcTemplate
 */
public interface RpcHostResolver {
    RpcHost resolve(String vistaId) throws VistaIdNotFoundException;
}
