package gov.va.hmp.metrics.health;


import com.codahale.metrics.health.HealthCheck;
import gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.springframework.dao.DataAccessException;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

public class VistaAccountHealthCheck extends HealthCheck {

    private VistaAccount vistaAccount;

    private RpcOperations synchronizationRpcTemplate;

    public VistaAccountHealthCheck(VistaAccount vistaAccount, RpcOperations synchronizationRpcTemplate) {
        this.vistaAccount = vistaAccount;
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Override
    protected Result check() throws Exception {
        UriComponents uri = UriComponentsBuilder.newInstance()
                .scheme(VISTA_RPC_BROKER_SCHEME)
                .userInfo(vistaAccount.getVprUserCredentials())
                .host(vistaAccount.getHost())
                .port(vistaAccount.getPort())
                .pathSegment(SynchronizationRpcConstants.VPR_SYNCHRONIZATION_CONTEXT, SynchronizationRpcConstants.VPR_DATA_VERSION).build();
        try {
            synchronizationRpcTemplate.execute(uri.toUriString());
            return Result.healthy();
        } catch (DataAccessException e) {
            return Result.unhealthy(e);
        }
    }
}
