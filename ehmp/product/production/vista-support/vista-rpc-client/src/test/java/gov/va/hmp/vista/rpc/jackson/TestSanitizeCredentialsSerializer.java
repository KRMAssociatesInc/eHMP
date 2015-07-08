package gov.va.hmp.vista.rpc.jackson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.junit.Test;
import org.springframework.util.DigestUtils;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class TestSanitizeCredentialsSerializer {

    @Test
    public void testSanitize() throws Exception {
        JsonNode json = new ObjectMapper().convertValue(new Foo(), JsonNode.class);
        assertThat(json.get("bar").textValue(), is(DigestUtils.md5DigestAsHex("bar;baz".getBytes("UTF-8"))));
    }

    public static class Foo {
        @JsonSerialize(using = SanitizeCredentialsSerializer.class)
        public String bar = "foo:bar;baz";
    }
}
