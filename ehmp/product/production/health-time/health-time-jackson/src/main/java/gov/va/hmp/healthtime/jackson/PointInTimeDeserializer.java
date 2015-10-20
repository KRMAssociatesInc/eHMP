package gov.va.hmp.healthtime.jackson;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import gov.va.hmp.healthtime.PointInTime;

import java.io.IOException;

public class PointInTimeDeserializer extends StdScalarDeserializer<PointInTime> {

    public PointInTimeDeserializer() {
        super(PointInTime.class);
    }

    @Override
    public PointInTime deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        JsonToken t = jp.getCurrentToken();
        if (jp.isExpectedStartArrayToken()) {
            jp.nextToken(); // VALUE_NUMBER_INT
            int year = jp.getIntValue();
            int month = -1;
            if (jp.nextToken() != JsonToken.END_ARRAY) { // VALUE_NUMBER_INT
                month = jp.getIntValue();
            } else {
                if (jp.getCurrentToken() != JsonToken.END_ARRAY) {
                    throw ctxt.wrongTokenException(jp, JsonToken.END_ARRAY, "after PointInTime ints");
                }
                return new PointInTime(year);
            }
            int day = -1;
            if (jp.nextToken() != JsonToken.END_ARRAY) { // VALUE_NUMBER_INT
                day = jp.getIntValue();
            } else {
                if (jp.getCurrentToken() != JsonToken.END_ARRAY) {
                    throw ctxt.wrongTokenException(jp, JsonToken.END_ARRAY, "after PointInTime ints");
                }
                return new PointInTime(year, month);
            }
            int hour = -1;
            if (jp.nextToken() != JsonToken.END_ARRAY) { // VALUE_NUMBER_INT
                hour = jp.getIntValue();
            } else {
                if (jp.getCurrentToken() != JsonToken.END_ARRAY) {
                    throw ctxt.wrongTokenException(jp, JsonToken.END_ARRAY, "after PointInTime ints");
                }
                return new PointInTime(year, month, day);
            }
            int minute = -1;
            if (jp.nextToken() != JsonToken.END_ARRAY) { // VALUE_NUMBER_INT
                minute = jp.getIntValue();
            } else {
                if (jp.getCurrentToken() != JsonToken.END_ARRAY) {
                    throw ctxt.wrongTokenException(jp, JsonToken.END_ARRAY, "after PointInTime ints");
                }
                return new PointInTime(year, month, day, hour);
            }

            int second = -1;
            if (jp.nextToken() != JsonToken.END_ARRAY) { // VALUE_NUMBER_INT
                second = jp.getIntValue();
            } else {
                if (jp.getCurrentToken() != JsonToken.END_ARRAY) {
                    throw ctxt.wrongTokenException(jp, JsonToken.END_ARRAY, "after PointInTime ints");
                }
                return new PointInTime(year, month, day, hour, minute);
            }

            int millisecond = -1;
            if (jp.nextToken() != JsonToken.END_ARRAY) { // VALUE_NUMBER_INT
                millisecond = jp.getIntValue();
            } else {
                return new PointInTime(year, month, day, hour, minute, second);
            }
            if (jp.nextToken() != JsonToken.END_ARRAY) {
                throw ctxt.wrongTokenException(jp, JsonToken.END_ARRAY, "after PointInTime ints");
            }
            return new PointInTime(year, month, day, hour, minute, second, millisecond);
        }
        if (t == JsonToken.VALUE_NUMBER_INT) {
            String str = jp.getBigIntegerValue().toString();
            return createPointInTime(str);
        }
        if (t == JsonToken.VALUE_NUMBER_FLOAT) {
            String str = jp.getDecimalValue().toString();
            return createPointInTime(str);
        }
        if (t == JsonToken.VALUE_STRING) {
            String str = jp.getText().trim();
            return createPointInTime(str);
        }
        throw ctxt.wrongTokenException(jp, JsonToken.START_ARRAY, "expected JSON Array, Number, Float or String");
    }

    private PointInTime createPointInTime(String str) {
        if (str.length() == 0) { // [JACKSON-360]
            return null;
        }
        return new PointInTime(str);
    }
}
