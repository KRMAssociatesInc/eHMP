package gov.va.cpe.vpr.sync.vista.json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.util.StringUtils;

public class UpdateImporterTest extends AbstractImporterTest {

    private ObjectMapper jsonMapper = new ObjectMapper();

    @Test
    public void testUpdate() throws Exception {
        JsonNode json = jsonMapper.readValue(getClass().getResourceAsStream("update.json"), JsonNode.class);
        JsonNode data = json.path("data");

        ArrayNode items = (ArrayNode) json.findValue("items");
        for (JsonNode item : items) {
            String domainName = item.path("collection").asText();
            String pid = item.path("pid").asText();
            if (domainName.equalsIgnoreCase("patient") || !StringUtils.hasText(pid)) {
                if (!item.path("deletes").isNull()) {
                    JsonNode deletesNode = item.path("deletes");
                    if (!deletesNode.isMissingNode()) {
                        for (JsonNode deleteNode : deletesNode) {
                            String uid = deleteNode.get("uid").textValue();
                            Assert.assertNotNull(uid);
                        }
                    }
                } else if (!item.path("error").isNull()) {
                } else {
                    //operational Data
                }
            } else {
                //patient data
            }
        }
    }
}
