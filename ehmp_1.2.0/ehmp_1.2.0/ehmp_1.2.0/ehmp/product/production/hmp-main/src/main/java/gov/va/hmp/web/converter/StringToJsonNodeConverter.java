package gov.va.hmp.web.converter;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.POMUtils;
import org.springframework.core.convert.converter.Converter;

public class StringToJsonNodeConverter implements Converter<String, JsonNode> {
@Override
    public JsonNode convert(String source) {
        return POMUtils.parseJSONtoNode(source);
    }
}
