package us.vistacore.asu.time;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class PointInTimeSerializer extends StdSerializer<PointInTime> {

    public PointInTimeSerializer() {
        super(PointInTime.class);
    }

    @Override
    public void serialize(PointInTime t, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonGenerationException {
        if (provider.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)) {
            // Timestamp here actually means an array of values
            jgen.writeStartArray();
            jgen.writeNumber(t.getYear());
            if (t.isMonthSet())
                jgen.writeNumber(t.getMonth());
            if (t.isDateSet())
                jgen.writeNumber(t.getDate());
            if (t.isHourSet())
                jgen.writeNumber(t.getHour());
            if (t.isMinuteSet())
                jgen.writeNumber(t.getMinute());
            if (t.isSecondSet())
                jgen.writeNumber(t.getSecond());
            if (t.isMillisecondSet())
                jgen.writeNumber(t.getMillisecond());
            jgen.writeEndArray();
        } else {
            jgen.writeString(t.toString());
        }
    }
}
