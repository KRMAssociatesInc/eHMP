package gov.va.hmp.ptselect;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.RpcResponseExtractionException;
import gov.va.hmp.vista.rpc.RpcResponseExtractor;

public class VistaPatientSelectRpcResponseExtractor implements RpcResponseExtractor<VistaPatientSelectsAndMetadata> {
    @Override
    public VistaPatientSelectsAndMetadata extractData(RpcResponse response) throws RpcResponseExtractionException {
        JsonNode json = POMUtils.parseJSONtoNode(response.toString());
        JsonNode data = json.path("data");
        VistaPatientSelectsAndMetadata spec = null;
        if (!data.isMissingNode()) {
            spec = POMUtils.MAPPER.convertValue(data, VistaPatientSelectsAndMetadata.class);
        } else {
            spec = new VistaPatientSelectsAndMetadata();
        }
        return spec;
    }
}
