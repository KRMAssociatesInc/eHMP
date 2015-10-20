package gov.va.hmp.healthtime.jackson;

import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class TestIntervalOfTimeDeserializer extends HealthTimeModuleTestBase {
    private IntervalOfTime ivl = new IntervalOfTime(new PointInTime(1975, 7, 23, 0, 0, 0, 0), new PointInTime(1975, 7, 29, 23, 59, 59, 999), true, true);

    @Test
    public void testDeserialize() throws Exception {
        assertThat(jsonMapper.readValue("\"19750723000000.000..19750729235959.999\"", IntervalOfTime.class), equalTo(ivl));
    }
}
