package gov.va.hmp.healthtime.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.format.IntervalOfTimeFormat;

import java.io.IOException;

public class IntervalOfTimeDeserializer extends StdDeserializer<IntervalOfTime> {

    public IntervalOfTimeDeserializer() {
        super(IntervalOfTime.class);
    }

    @Override
    public IntervalOfTime deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        JsonToken t = jp.getCurrentToken();
        if (t == JsonToken.VALUE_STRING) {
            String str = jp.getText().trim();
            if (str.length() == 0) { // [JACKSON-360]
                return null;
            }
            return IntervalOfTimeFormat.parse(str);
        }
        throw ctxt.mappingException(getValueClass());
    }
}
