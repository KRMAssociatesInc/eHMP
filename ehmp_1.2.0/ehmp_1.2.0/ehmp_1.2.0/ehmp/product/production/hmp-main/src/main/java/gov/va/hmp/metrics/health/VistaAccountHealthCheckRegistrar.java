package gov.va.hmp.metrics.health;

import com.codahale.metrics.health.HealthCheckRegistry;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class VistaAccountHealthCheckRegistrar implements InitializingBean {

    public static final String VISTA_CONNECTION_HEALTH_PREFIX = "vistaConnectionHealth-";

    private HealthCheckRegistry healthCheckRegistry;
    private IVistaAccountDao vistaAccountDao;
    private RpcOperations synchronizationRpcTemplate;

    @Autowired
    public void setHealthCheckRegistry(HealthCheckRegistry healthCheckRegistry) {
        this.healthCheckRegistry = healthCheckRegistry;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setSynchronizationRpcTemplate(RpcOperations synchronizationRpcTemplate) {
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        List<VistaAccount> accounts = vistaAccountDao.findAll();
        for (VistaAccount account : accounts) {
            VistaAccountHealthCheck healthCheck = new VistaAccountHealthCheck(account, this.synchronizationRpcTemplate);
            healthCheckRegistry.register(VISTA_CONNECTION_HEALTH_PREFIX + account.getVistaId(), healthCheck);
        }
    }
}
