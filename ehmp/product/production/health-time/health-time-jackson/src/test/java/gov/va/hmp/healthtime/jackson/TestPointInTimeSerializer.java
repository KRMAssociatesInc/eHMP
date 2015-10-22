package gov.va.hmp.healthtime.jackson;

import com.fasterxml.jackson.databind.SerializationFeature;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class TestPointInTimeSerializer extends HealthTimeModuleTestBase {

    @Test
    public void testSerialize() throws Exception {
        jsonMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        assertThat(jsonMapper.writeValueAsString(new PointInTime(1997, 1, 23)), is("\"19970123\""));
    }

    @Test
    public void testSerializeTimestamp() throws Exception {
        assertThat(jsonMapper.writeValueAsString(new PointInTime(1997, 1, 23)), is("[1997,1,23]"));
    }
}
