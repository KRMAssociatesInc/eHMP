package gov.va.hmp.vista.rpc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JacksonRpcResponseExtractor implements RpcResponseExtractor<JsonNode> {

    private ObjectMapper mapper = new ObjectMapper();

    public ObjectMapper getJsonMapper() {
        return mapper;
    }

    public void setJsonMapper(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public JsonNode extractData(RpcResponse response) throws RpcResponseExtractionException {
        try {
            return mapper.readValue(response.toString(), JsonNode.class);
        } catch (IOException e) {
            throw new RpcResponseExtractionException(response, "error mapping RPC response to JsonNode", e);
        }
    }
}

