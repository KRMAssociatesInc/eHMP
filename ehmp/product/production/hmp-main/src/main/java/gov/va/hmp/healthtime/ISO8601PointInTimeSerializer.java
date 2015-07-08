package gov.va.hmp.healthtime;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.joda.time.format.ISODateTimeFormat;

import java.io.IOException;

public class ISO8601PointInTimeSerializer extends JsonSerializer<PointInTime> {
    @Override
    public void serialize(PointInTime t, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException, JsonProcessingException {
        jsonGenerator.writeString(ISODateTimeFormat.dateTime().print(t));
    }
}
