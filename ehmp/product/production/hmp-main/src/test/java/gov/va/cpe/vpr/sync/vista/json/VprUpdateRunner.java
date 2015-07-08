package gov.va.cpe.vpr.sync.vista.json;

import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.RpcTemplate;

import java.util.HashMap;

import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_GET_VISTA_DATA_JSON;
import static gov.va.cpe.vpr.sync.vista.SynchronizationRpcConstants.VPR_SYNCHRONIZATION_CONTEXT;

public class VprUpdateRunner {
    public static void main(String[] args) {
        RpcTemplate t = new RpcTemplate();
        try {
            String lastUpdate = "";

            HashMap<String, String> params = new HashMap<String, String>();
            params.put("domain", "new");
            params.put("id", lastUpdate);
            params.put("text", "1");
            params.put("systemID", "SOLS-MAC");

            RpcResponse response = t.execute("vrpcb://vpruser1;verifycode1&@localhost:29060/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_GET_VISTA_DATA_JSON, params);
//            JsonNode jsonResponse = new JacksonRpcResponseExtractor().extractData(response);

            System.out.println(response.toString());
//            System.out.println(jsonResponse.textValue());
        } finally {
            if (t != null) {
                try {
                    t.destroy();
                } catch (Exception e) {
                    // NOOP
                }
            }
        }
    }
}
