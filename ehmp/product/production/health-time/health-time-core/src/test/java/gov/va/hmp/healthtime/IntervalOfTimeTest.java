package gov.va.hmp.healthtime;

import org.joda.time.Duration;
import org.joda.time.Period;
import org.joda.time.PeriodType;
import org.junit.Assert;
import org.junit.Test;

import java.util.Date;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class IntervalOfTimeTest {

    @Test
    public void testCreateWithSamePrecision() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1981, 8, 12);
        IntervalOfTime i = new IntervalOfTime(t1, t2);
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals("[19750723000000.000;19810813000000.000[", i.toString());
        Assert.assertNotSame(t1, i.getLow());
        Assert.assertNotSame(t2, i.getHigh());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        assertEquals(1975, 7, 23, 0, 0, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        assertEquals(1981, 8, 13, 0, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testToPeriodWithLowClosedHighOpenDate() {
        PointInTime start = new PointInTime(2000, 1, 2);
        PointInTime stop = new PointInTime(2001, 1, 1);
        Period expected = new Period(start.promote().getLow(), stop.promote().getHigh().subtractMilliseconds(1));
        Period actual = new IntervalOfTime(start, stop).toPeriod();
        assertThat(expected.getYears(), is(actual.getYears()));
        assertThat(expected.getMonths(), is(actual.getMonths()));
        assertThat(expected.getDays(), is(actual.getDays()));
        assertThat(expected.getHours(), is(actual.getHours()));
        assertThat(expected.getMinutes(), is(actual.getMinutes()));
        assertThat(expected.getSeconds(), is(actual.getSeconds()));
        assertThat(expected.getMillis(), is(actual.getMillis()));
        expected = new Period(start.promote().getLow(), stop.promote().getHigh().subtractMilliseconds(1), PeriodType.yearMonthDay());
        actual = new IntervalOfTime(start, stop).toPeriod(PeriodType.yearMonthDay());
        assertThat(expected.getYears(), is(actual.getYears()));
        assertThat(expected.getMonths(), is(actual.getMonths()));
        assertThat(expected.getDays(), is(actual.getDays()));
        assertThat(expected.getHours(), is(actual.getHours()));
        assertThat(expected.getMinutes(), is(actual.getMinutes()));
        assertThat(expected.getSeconds(), is(actual.getSeconds()));
        assertThat(expected.getMillis(), is(actual.getMillis()));
    }

    @Test
    public void testToPeriodWithLowOpenHighClosedDate() {
        PointInTime start = new PointInTime(2000, 1, 2);
        PointInTime stop = new PointInTime(2001, 1, 1);
        IntervalOfTime iot = stop.promote();
        PointInTime iota = iot.getHigh();
        Period expected = new Period(start.promote().getLow().addMilliseconds(1), iota.subtractMilliseconds(1));
        Period actual = new IntervalOfTime(start, stop, false, true, false).toPeriod();
        assertThat(expected.getYears(), is(actual.getYears()));
        assertThat(expected.getMonths(), is(actual.getMonths()));
        assertThat(expected.getDays(), is(actual.getDays()));
        assertThat(expected.getHours(), is(actual.getHours()));
        assertThat(expected.getMinutes(), is(actual.getMinutes()));
        assertThat(expected.getSeconds(), is(actual.getSeconds()));
        assertThat(expected.getMillis(), is(actual.getMillis()));
        expected = new Period(start.promote().getLow().addMilliseconds(1), iota.subtractMilliseconds(1), PeriodType.yearMonthDay());
        actual = new IntervalOfTime(start, stop, false, true, false).toPeriod(PeriodType.yearMonthDay());
        assertThat(expected.getYears(), is(actual.getYears()));
        assertThat(expected.getMonths(), is(actual.getMonths()));
        assertThat(expected.getDays(), is(actual.getDays()));
        assertThat(expected.getHours(), is(actual.getHours()));
        assertThat(expected.getMinutes(), is(actual.getMinutes()));
        assertThat(expected.getSeconds(), is(actual.getSeconds()));
        assertThat(expected.getMillis(), is(actual.getMillis()));
    }

    @Test
    public void testCreateWithDifferentPrecision() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1981, 8, 11, 10, 35, 54, 134);
        IntervalOfTime i = new IntervalOfTime(t1, t2);
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertNotSame(t1, i.getLow());
        Assert.assertNotSame(t2, i.getHigh());
        Assert.assertEquals("[19750723000000.000;19810811103554.134[", i.toString());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        assertEquals(1975, 7, 23, 0, 0, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        assertEquals(1981, 8, 11, 10, 35, 54, 134, i.getHigh());
    }

    @Test
    public void testCreateWithLowAndHighClosed() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1981, 3, 11);
        IntervalOfTime i = new IntervalOfTime(t1, t2, true, true);
        Assert.assertTrue(i.isLowClosed());
        Assert.assertTrue(i.isHighClosed());
        assertEquals(1975, 7, 23, 0, 0, 0, 0, i.getLow());
        assertEquals(1981, 3, 11, 23, 59, 59, 999, i.getHigh());
    }

    @Test
    public void testCreateWithLowAndHighOpen() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1981, 3, 11);
        IntervalOfTime i = new IntervalOfTime(t1, t2, false, false);
        Assert.assertFalse(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        assertEquals(1975, 7, 23, 0, 0, 0, 0, i.getLow());
        assertEquals(1981, 3, 12, 0, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testCreateWithHighBeforeLow() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1981, 3, 11);
        IntervalOfTime i = new IntervalOfTime(t2, t1);
        Assert.assertTrue(Precision.MILLISECOND == i.getLow().getPrecision());
        assertEquals(1975, 7, 23, 0, 0, 0, 0, i.getLow());
        Assert.assertTrue(Precision.MILLISECOND == i.getHigh().getPrecision());
        assertEquals(1981, 3, 12, 0, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testIntervalPeriod() {
        PointInTime t1 = PointInTime.fromDateFields(new Date(1111111111L));
        PointInTime t2 = PointInTime.fromDateFields(new Date(2222222222L));
        IntervalOfTime i = new IntervalOfTime(t1, t2);
        Duration width = i.getWidth();
        Assert.assertEquals(1111111111L, width.getMillis());

        PointInTime t3 = new PointInTime(1975, 7, 23);
        i = t3.promote();
        Assert.assertEquals(0, i.toPeriod().getDays());
        Assert.assertEquals(23, i.toPeriod().getHours());
        Assert.assertEquals(59, i.toPeriod().getMinutes());
        Assert.assertEquals(59, i.toPeriod().getSeconds());
        Assert.assertEquals(999, i.toPeriod().getMillis());
    }

    @Test
    public void testCenterOfEqualPrecision() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1975, 7, 25);
        IntervalOfTime i = new IntervalOfTime(t1, t2);
        PointInTime center = i.getCenter();
        Assert.assertEquals(Precision.MILLISECOND, center.getPrecision());
        assertEquals(1975, 7, 24, 12, 0, 0, 0, center);
    }

    @Test
    public void testContains() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1984, 3, 11);
        IntervalOfTime i = new IntervalOfTime(t1, t2);
        Assert.assertTrue(i.contains(new PointInTime(1980)));
        Assert.assertFalse(i.contains(new PointInTime(1974)));
    }

    @Test
    public void testClone() {
        PointInTime t1 = new PointInTime(1975, 7, 23, 0, 0, 0, 0);
        PointInTime t2 = new PointInTime(1984, 3, 11, 0, 0, 0, 0);
        IntervalOfTime i = new IntervalOfTime(t1, t2);
        IntervalOfTime clonedInterval = (IntervalOfTime) i.clone();
        Assert.assertEquals(i.getLow(), clonedInterval.getLow());
        Assert.assertEquals(i.getHigh(), clonedInterval.getHigh());
        Assert.assertNotSame(i.getLow(), clonedInterval.getLow());
        Assert.assertNotSame(i.getHigh(), clonedInterval.getHigh());
    }

    @Test
    public void testIntersection() {
        PointInTime t1 = new PointInTime(1975);
        PointInTime t2 = new PointInTime(1984);
        Assert.assertNull(t1.promote().intersection(t2.promote()));

        IntervalOfTime i1 = new IntervalOfTime(new PointInTime(1975), new PointInTime(1984));
        IntervalOfTime i2 = new IntervalOfTime(new PointInTime(1980), new PointInTime(1990));
        IntervalOfTime intersection1 = i1.intersection(i2);
        Assert.assertTrue(intersection1.isLowClosed());
        Assert.assertFalse(intersection1.isHighClosed());
        assertEquals(1980, 1, 1, 0, 0, 0, 0, intersection1.getLow());
        assertEquals(1985, 1, 1, 0, 0, 0, 0, intersection1.getHigh());

        IntervalOfTime intersection2 = i2.intersection(i1);
        Assert.assertTrue(intersection1.equals(intersection2));
    }

    @Test
    public void testConvexHull() {
        PointInTime t1 = new PointInTime(1975);
        PointInTime t2 = new PointInTime(1990);
        Assert.assertNotNull(t1.promote().hull(t2.promote()));

        IntervalOfTime i1 = new IntervalOfTime(new PointInTime(1975), new PointInTime(1984));
        IntervalOfTime i2 = new IntervalOfTime(new PointInTime(1980), new PointInTime(1990));

        IntervalOfTime h1 = i1.hull(i2);
        Assert.assertTrue(h1.isLowClosed());
        Assert.assertFalse(h1.isHighClosed());
        assertEquals(1975, 1, 1, 0, 0, 0, 0, h1.getLow());
        assertEquals(1991, 1, 1, 0, 0, 0, 0, h1.getHigh());

        IntervalOfTime h2 = i2.hull(i1);
        Assert.assertTrue(h1.equals(h2));
    }


    @Test
    public void testNullIntervalOfTime() {
        PointInTime pit = new PointInTime(2000, 1, 1, 0, 0, 0, 0);
        IntervalOfTime interval = null;
        try {
            interval = new IntervalOfTime(pit, pit);
            Assert.fail("should have thrown an exception");
        } catch (IllegalArgumentException e) {
        } catch (Exception e) {
            Assert.fail("wrong exception thrown: " + e);
        }
        interval = new IntervalOfTime(pit, pit, true);
        Assert.assertEquals(interval.getLow(), interval.getHigh());
    }

    @Test
    public void testToClosedFromLowClosedHighOpen() {
        PointInTime t1 = new PointInTime(1975, 7, 23, 0, 0, 0, 0);
        PointInTime t2 = new PointInTime(1981, 3, 11, 0, 0, 0, 0);
        IntervalOfTime i1 = new IntervalOfTime(t1, t2, true, false);
        IntervalOfTime i2 = i1.toClosed();
        Assert.assertTrue(i2.isLowClosed());
        Assert.assertTrue(i2.isHighClosed());
        assertEquals(1975, 7, 23, 0, 0, 0, 0, i2.getLow());
        assertEquals(1981, 3, 10, 23, 59, 59, 999, i2.getHigh());
    }

    @Test
    public void testToClosedFromLowOpenHighOpen() {
        PointInTime t1 = new PointInTime(1975, 7, 23, 0, 0, 0, 0);
        PointInTime t2 = new PointInTime(1981, 3, 11, 0, 0, 0, 0);
        IntervalOfTime i1 = new IntervalOfTime(t1, t2, false, false);
        IntervalOfTime i2 = i1.toClosed();
        Assert.assertTrue(i2.isLowClosed());
        Assert.assertTrue(i2.isHighClosed());
        assertEquals(1975, 7, 23, 0, 0, 0, 1, i2.getLow());
        assertEquals(1981, 3, 10, 23, 59, 59, 999, i2.getHigh());
    }

    public static void assertEquals(
            int year,
            int month,
            int date,
            int hours,
            int minutes,
            int seconds,
            int milliseconds,
            PointInTime t) {
        Assert.assertEquals(year, t.getYear());
        Assert.assertEquals(month, t.getMonth());
        Assert.assertEquals(date, t.getDate());
        Assert.assertEquals(hours, t.getHour());
        Assert.assertEquals(minutes, t.getMinute());
        Assert.assertEquals(seconds, t.getSecond());
        Assert.assertEquals(milliseconds, t.getMillisecond());
    }
}
