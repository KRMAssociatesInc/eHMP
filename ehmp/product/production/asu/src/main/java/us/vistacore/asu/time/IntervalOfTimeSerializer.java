package us.vistacore.asu.time;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class IntervalOfTimeSerializer extends StdSerializer<IntervalOfTime> {

    public IntervalOfTimeSerializer() {
        super(IntervalOfTime.class);
    }

    @Override
    public void serialize(IntervalOfTime ivl, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonProcessingException {
        if (provider.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)) {
            // Timestamp here actually means an array of values; for an interval of time we write out two arrays
            jgen.writeStartObject();
            jgen.writeFieldName("low");
//            jgen.writeArrayFieldStart("low");
            jgen.writeObject(ivl.getLow());
            jgen.writeFieldName("high");
//            jgen.writeArrayFieldStart("high");
            jgen.writeObject(ivl.getHigh());
            jgen.writeEndObject();

//            jgen.writeStartArray();
//            jgen.writeNumber(t.getYear());
//            if (t.isMonthSet())
//                jgen.writeNumber(t.getMonth());
//            if (t.isDateSet())
//                jgen.writeNumber(t.getDate());
//            if (t.isHourSet())
//                jgen.writeNumber(t.getHour());
//            if (t.isMinuteSet())
//                jgen.writeNumber(t.getMinute());
//            if (t.isSecondSet())
//                jgen.writeNumber(t.getSecond());
//            if (t.isMillisecondSet())
//                jgen.writeNumber(t.getMillisecond());
//            jgen.writeEndArray();
        } else {
            jgen.writeString(IntervalOfTimeFormat.print(ivl));
        }
    }
}
