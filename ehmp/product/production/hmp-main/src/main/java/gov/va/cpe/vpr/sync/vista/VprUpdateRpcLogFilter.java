package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.hmp.vista.rpc.JacksonRpcResponseExtractor;
import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.broker.protocol.Mult;
import gov.va.hmp.vista.rpc.broker.protocol.RpcParam;
import gov.va.hmp.vista.rpc.support.RpcLogFilter;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_SYNCHRONIZATION_CONTEXT;

/**
 * Filters out VPR Update RPCs from the log when there are no updates
 */
public class VprUpdateRpcLogFilter implements RpcLogFilter {

    private JacksonRpcResponseExtractor jsonExtractor = new JacksonRpcResponseExtractor();

    @Override
    public boolean isLoggable(RpcEvent rpcEvent) {
        RpcRequest request = rpcEvent.getRequest();
        if (VPR_SYNCHRONIZATION_CONTEXT.equals(request.getRpcContext()) && VPR_GET_VISTA_DATA_JSON.equals(request.getRpcName()) && request.getParams().size() >= 1) {
            RpcParam param = request.getParams().get(0);
            Mult mult = param.getMult();
            if (mult == null) return true;
            String domain = mult.get("\"domain\"");
            if ("new".equalsIgnoreCase(domain)) {
                if (rpcEvent.isError()) {
                    return true;
                }
                JsonNode json = jsonExtractor.extractData(rpcEvent.getResponse());
                if (json.path("data").path("totalItems").asInt() == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}
