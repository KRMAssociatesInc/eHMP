package gov.va.hmp.healthtime.jackson;

import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class TestPointInTimeDeserializer extends HealthTimeModuleTestBase {
    @Test
    public void testDeserializeString() throws Exception {
        assertThat(jsonMapper.readValue("\"19230509\"", PointInTime.class), equalTo(new PointInTime(1923, 5, 9)));
    }

    @Test
    public void testDeserializeInteger() throws Exception {
        assertThat(jsonMapper.readValue("19230509", PointInTime.class), equalTo(new PointInTime(1923, 5, 9)));
        assertThat(jsonMapper.readValue("19230509072356", PointInTime.class), equalTo(new PointInTime(1923, 5, 9, 7, 23, 56)));
    }

    @Test
    public void testDeserializeFloat() throws Exception {
        assertThat(jsonMapper.readValue("19230509072356.123", PointInTime.class), equalTo(new PointInTime(1923, 5, 9, 7, 23, 56, 123)));
    }

    @Test
    public void testDeserializeTimestamp() throws Exception {
        assertThat(jsonMapper.readValue("[1923]", PointInTime.class), equalTo(new PointInTime(1923)));
        assertThat(jsonMapper.readValue("[1923,5]", PointInTime.class), equalTo(new PointInTime(1923,5)));
        assertThat(jsonMapper.readValue("[1923,5,9]", PointInTime.class), equalTo(new PointInTime(1923, 5, 9)));
        assertThat(jsonMapper.readValue("[1923,5,9,14]", PointInTime.class), equalTo(new PointInTime(1923, 5, 9, 14)));
        assertThat(jsonMapper.readValue("[1923,5,9,14,56]", PointInTime.class), equalTo(new PointInTime(1923, 5, 9, 14, 56)));
        assertThat(jsonMapper.readValue("[1923,5,9,14,56,23]", PointInTime.class), equalTo(new PointInTime(1923, 5, 9,14, 56, 23)));
        assertThat(jsonMapper.readValue("[1923,5,9,14,56,23,768]", PointInTime.class), equalTo(new PointInTime(1923, 5, 9, 14, 56, 23, 768)));
    }
}
