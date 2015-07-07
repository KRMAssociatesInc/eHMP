package gov.va.hmp.vista.rpc.jackson;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import gov.va.hmp.vista.rpc.broker.protocol.RpcParam;

import java.io.IOException;

public class RpcParamSerializer extends StdSerializer<RpcParam> {

    protected RpcParamSerializer() {
        super(RpcParam.class);
    }

    @Override
    public void serialize(RpcParam rpcParam, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonGenerationException {
        jgen.writeStartObject();
        jgen.writeStringField("type", rpcParam.getType().toString());
        if (rpcParam.getMult() != null) {
            provider.defaultSerializeField("value", rpcParam.getMult(), jgen);
        } else {
            jgen.writeStringField("value", rpcParam.getValue());
        }
        jgen.writeEndObject();
    }

}
