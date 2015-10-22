package us.vistacore.asu.dao;

import com.codahale.metrics.json.HealthCheckModule;
import com.codahale.metrics.json.MetricsModule;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.*;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import us.vistacore.asu.time.IntervalOfTime;
import us.vistacore.asu.time.PointInTime;
import us.vistacore.asu.time.PointInTimeSerializer;
import us.vistacore.asu.time.IntervalOfTimeSerializer;
import us.vistacore.asu.time.IntervalOfTimeDeserializer;
import us.vistacore.asu.time.ModuleVersion;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * ObjectMapper configured with POM and VPR defaults.
 */
public class POMObjectMapper extends ObjectMapper {

    private Class<?> serializationView;

    public POMObjectMapper() {
    	this((JsonFactory) null);
    }
    
    public POMObjectMapper(JsonFactory fact) {
        super(fact);

        this.registerModule(new TolerantHealthTimeModule());


        this.registerModule(new MetricsModule(TimeUnit.SECONDS, TimeUnit.MILLISECONDS, false));
        //ASU CHANGE this.registerModule(new HealthCheckModule());
//        this.registerModule(new ViewDefDefModule());

        // the following config could be in its own Jackson Module ("VPRModule") if this list gets unwieldy or we want to
        // externalize the VPR's JSON serialization configuration more or not have dependencies on 3rd party libs.  No need right now, though.
        this.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        this.enable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
        this.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        /*
        this.addMixInAnnotations(VistaUserDetails.class, VistaUserDetailsJacksonAnnotations.class);
        this.addMixInAnnotations(UserDetails.class, UserDetailsJacksonAnnotations.class);
        this.addMixInAnnotations(GrantedAuthority.class, GrantedAuthorityJacksonAnnotations.class);
        */
    }

    /**
     * Constructs an ObjectMapper instance that will serialize objects using specified JSON View (filter).
     *
     * @see "http://wiki.fasterxml.com/JacksonJsonViews"
     */
    public POMObjectMapper(Class<?> serializationView) {
        this();
        this.serializationView = serializationView;
    }

    @Override
    public void writeValue(JsonGenerator jgen, Object value) throws IOException, JsonGenerationException, JsonMappingException {
        if (serializationView != null) {
            try {
                this.enable(SerializationFeature.INDENT_OUTPUT);
                writerWithView(serializationView).writeValue(jgen, value);
            } finally {
                this.disable(SerializationFeature.INDENT_OUTPUT);
            }
        } else {
            super.writeValue(jgen, value);
        }
    }


    public static class TolerantHealthTimeModule extends SimpleModule {
        public TolerantHealthTimeModule() {
            super("HealthTimeModule", ModuleVersion.instance.version());

            addDeserializer(PointInTime.class, new TolerantPointInTimeDeserializer());
            addDeserializer(IntervalOfTime.class, new IntervalOfTimeDeserializer());

            addSerializer(PointInTime.class, new PointInTimeSerializer());
            addSerializer(IntervalOfTime.class, new IntervalOfTimeSerializer());
        }
    }


    public static class TolerantPointInTimeDeserializer extends StdScalarDeserializer<PointInTime> {
        public TolerantPointInTimeDeserializer() {
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
            try {
                return new PointInTime(str);
            }catch(Exception e) {
                str = str.substring(0, str.length()-1);
                return createPointInTime(str);
            }
        }

    }
}
