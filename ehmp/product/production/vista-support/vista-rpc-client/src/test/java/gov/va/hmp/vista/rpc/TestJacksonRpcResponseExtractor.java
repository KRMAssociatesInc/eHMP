package gov.va.hmp.vista.rpc;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class TestJacksonRpcResponseExtractor {
    @Test
    public void testExtractData() throws Exception {
        JacksonRpcResponseExtractor e = new JacksonRpcResponseExtractor();
        JsonNode json = e.extractData(new RpcResponse("{\"foo\":\"bar\",\"baz\":23}"));

        assertThat(json.get("foo").asText(), equalTo("bar"));
        assertThat(json.get("baz").asInt(), equalTo(23));
    }
}
