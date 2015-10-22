package gov.va.hmp.healthtime.jackson;

import com.fasterxml.jackson.databind.SerializationFeature;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class TestIntervalOfTimeSerializer extends HealthTimeModuleTestBase {

    private IntervalOfTime ivl;

    @Before
    public void setUp() throws Exception {
        super.setUp();

        ivl = new IntervalOfTime(new PointInTime(1975, 7, 23, 0, 0, 0, 0), new PointInTime(1975, 7, 29, 23, 59, 59, 999), true, true);
    }

    @Test
    public void testSerialize() throws Exception {
        jsonMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        assertThat(jsonMapper.writeValueAsString(ivl), is("\"19750723000000.000..19750729235959.999\""));
    }

    @Test
    public void testSerializeTimestamp() throws Exception {
        assertThat(jsonMapper.writeValueAsString(ivl), is("{\"low\":[1975,7,23,0,0,0,0],\"high\":[1975,7,29,23,59,59,999]}"));
    }
}
