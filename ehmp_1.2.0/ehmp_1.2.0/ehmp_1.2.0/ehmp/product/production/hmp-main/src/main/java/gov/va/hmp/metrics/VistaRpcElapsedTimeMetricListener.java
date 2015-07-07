package gov.va.hmp.metrics;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcListener;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.broker.protocol.Mult;
import org.springframework.web.util.UriComponents;

import java.util.concurrent.TimeUnit;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_OPERATIONAL_DATA_RPC;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON;

public class VistaRpcElapsedTimeMetricListener implements RpcListener {
    private MetricRegistry metricRegistry;

    public VistaRpcElapsedTimeMetricListener(MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    @Override
    public void onRpc(RpcEvent rpcEvent) {
        if (rpcEvent.getResponse() == null) return;

        RpcRequest request = rpcEvent.getRequest();
        UriComponents uriComponents = request.getUriComponents();
        String name = MetricRegistry.name("rpc", rpcEvent.getHost().toHostString() + uriComponents.getPath());

        // selectively add certain request params to timer name depending on RPC
        if (VPR_GET_VISTA_DATA_JSON.equalsIgnoreCase(request.getRpcName()) || VPR_GET_OPERATIONAL_DATA_RPC.equalsIgnoreCase(request.getRpcName())) {
            Mult m = request.getParams().get(0).getMult();
            if (m != null) {
                String domain = m.get("\"domain\"");
                name += "?domain=" + domain;
            }
        } else if (UserInterfaceRpcConstants.FRONT_CONTROLLER_RPC.equalsIgnoreCase(request.getRpcName())) {
            Mult m = request.getParams().get(0).getMult();
            if (m != null) {
                String command = m.get("\"command\"");
                name += "?command=" + command;
            }
        } else {

        }
        Timer timer = metricRegistry.timer(name);
        timer.update(rpcEvent.getResponse().getElapsedMillis(), TimeUnit.MILLISECONDS);
    }
}
