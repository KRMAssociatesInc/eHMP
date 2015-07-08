package gov.va.hmp.vista.rpc.jackson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.vista.rpc.broker.protocol.RpcParam;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class TestRpcParamSerializer {

    @Test
    public void testSerializeLiteral() throws Exception {
        RpcParam p = new RpcParam("foo");
        JsonNode json = new ObjectMapper().convertValue(p, JsonNode.class);
        assertThat(json.get("type").textValue(), is(RpcParam.Type.LITERAL.toString()));
        assertThat(json.get("value").textValue(), is("foo"));
    }

    @Test
    public void testSerializeMap() throws Exception {
        Map map = new HashMap();
        map.put("foo", "spaz");
        map.put("bar", "waz");
        map.put("baz", "klaz");

        RpcParam p = RpcParam.create(map);
        JsonNode json = new ObjectMapper().convertValue(p, JsonNode.class);

        assertThat(json.get("type").textValue(), is(RpcParam.Type.LIST.toString()));
        assertThat(json.get("value").get("foo").textValue(), is("spaz"));
        assertThat(json.get("value").get("bar").textValue(), is("waz"));
        assertThat(json.get("value").get("baz").textValue(), is("klaz"));
    }
}
