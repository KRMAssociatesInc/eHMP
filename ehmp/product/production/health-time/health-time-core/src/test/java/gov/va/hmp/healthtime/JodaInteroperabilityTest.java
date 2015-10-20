package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.DateTimeFieldType;
import org.joda.time.Partial;
import org.joda.time.ReadablePartial;
import org.junit.Assert;
import org.junit.Test;

public class JodaInteroperabilityTest {

    @Test
    public void testToPartialForYear() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975);
        ReadablePartial t = new PointInTime(1975);
        Assert.assertEquals(1, t.size());
        Assert.assertTrue(t.isSupported(DateTimeFieldType.year()));
        Assert.assertEquals(1975, t.get(DateTimeFieldType.year()));

        Assert.assertTrue(p.equals(t));
    }

    @Test
    public void testToPartialForYearMonth() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975).with(DateTimeFieldType.monthOfYear(), 7);
        ReadablePartial t = new PointInTime(1975, 7);

        Assert.assertTrue(p.equals(t));
    }

    @Test
    public void testToPartialForYearMonthDay() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975).with(DateTimeFieldType.monthOfYear(), 7)
                .with(DateTimeFieldType.dayOfMonth(), 23);
        ReadablePartial t = new PointInTime(1975, 7, 23);

        Assert.assertTrue(p.equals(t));
    }

    @Test
    public void testToPartialForYearMonthDayHour() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975).with(DateTimeFieldType.monthOfYear(), 7)
                .with(DateTimeFieldType.dayOfMonth(), 23).with(DateTimeFieldType.hourOfDay(), 15);
        ReadablePartial t = new PointInTime(1975, 7, 23, 15);

        Assert.assertTrue(p.equals(t));
    }

    @Test
    public void testToPartialForYearMonthDayHourMinute() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975).with(DateTimeFieldType.monthOfYear(), 7)
                .with(DateTimeFieldType.dayOfMonth(), 23).with(DateTimeFieldType.hourOfDay(), 15)
                .with(DateTimeFieldType.minuteOfHour(), 23);
        ReadablePartial t = new PointInTime(1975, 7, 23, 15, 23);

        Assert.assertTrue(p.equals(t));
    }

    @Test
    public void testToPartialForYearMonthDayHourMinuteSecond() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975).with(DateTimeFieldType.monthOfYear(), 7)
                .with(DateTimeFieldType.dayOfMonth(), 23).with(DateTimeFieldType.hourOfDay(), 15)
                .with(DateTimeFieldType.minuteOfHour(), 23).with(DateTimeFieldType.secondOfMinute(), 42);
        ReadablePartial t = new PointInTime(1975, 7, 23, 15, 23, 42);

        Assert.assertTrue(p.equals(t));
    }

    @Test
    public void testToPartialForYearMonthDayHourMinuteSecondMillisecond() {
        ReadablePartial p = new Partial().with(DateTimeFieldType.year(), 1975).with(DateTimeFieldType.monthOfYear(), 7)
                .with(DateTimeFieldType.dayOfMonth(), 23).with(DateTimeFieldType.hourOfDay(), 15)
                .with(DateTimeFieldType.minuteOfHour(), 23).with(DateTimeFieldType.secondOfMinute(), 42)
                .with(DateTimeFieldType.millisOfSecond(), 398);
        ReadablePartial t = new PointInTime(1975, 7, 23, 15, 23, 42, 398);

        Assert.assertTrue(p.equals(t));
    }
}
