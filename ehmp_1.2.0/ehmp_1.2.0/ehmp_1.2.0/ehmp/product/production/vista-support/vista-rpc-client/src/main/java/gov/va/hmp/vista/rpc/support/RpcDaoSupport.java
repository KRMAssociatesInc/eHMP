package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.conn.ConnectionFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.dao.support.DaoSupport;

/**
 * Convenient super class for RPC RpcTemplate-based data access objects.
 *
 * <p>Requires a ConnectionFactory to be set, providing a RpcTemplate based on it to subclasses through the getRpcTemplate() method.
 */
public abstract class RpcDaoSupport extends DaoSupport implements DisposableBean {
    private RpcTemplate rpcTemplate;

    /**
     * Create an RpcTemplate for the given ConnectionFactory. Only invoked if populating the DAO with a ConnectionFactory reference!
     * Can be overridden in subclasses to provide a RpcTemplate instance with different configuration, or a custom RpcTemplate subclass.
     *
     * @param connectionFactory the ConnectionFactory to create a RpcTemplate for
     * @return the new RpcTemplate instance
     */
    protected RpcTemplate createRpcTemplate(ConnectionFactory connectionFactory) {
        return new RpcTemplate(connectionFactory);
    }

    /**
     * Return the RpcExceptionTranslator of this DAO's getRpcTemplate, for translating BrokerExceptions in custom RPC processing code.
     * @return
     */
    protected final RpcExceptionTranslator getExceptionTranslator() {
        return getRpcTemplate().getExceptionTranslator();
    }

    public final ConnectionFactory getConnectionFactory() {
        return rpcTemplate.getConnectionFactory();
    }

    public final void setConnectionFactory(ConnectionFactory connectionFactory) {
        setRpcTemplate(createRpcTemplate(connectionFactory));
    }

    public final RpcTemplate getRpcTemplate() {
        return rpcTemplate;
    }

    public final void setRpcTemplate(RpcTemplate rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
        initTemplateConfig();
    }

    /**
     * Initialize the template-based configuration of this DAO. Called after a new RpcTemplate has been set, either directly or through a ConnectionFactory.
     * <p>This implementation is empty. Subclasses may override this to configure further objects based on the RpcTemplate.
     *
     * @see #getRpcTemplate()
     */
    protected void initTemplateConfig() {
        // NOOP
    }

    @Override
    public void destroy() throws Exception {
        // NOOP
    }
}
