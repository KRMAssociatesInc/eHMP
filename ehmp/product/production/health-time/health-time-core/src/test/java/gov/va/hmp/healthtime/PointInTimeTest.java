package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.*;
import org.joda.time.*;
import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class PointInTimeTest {

    @Test
    public void testClone() {
        PointInTime t = new PointInTime(1975, 7, 23, 3, 52);
        PointInTime clonedT = t.clone();
        assertEquals(t, clonedT);
        Assert.assertNotSame(t, clonedT);
    }

    @Test
    public void testCreateWithYear() {
        PointInTime t = new PointInTime(1975);
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertFalse(t.isMonthSet());
        Assert.assertFalse(t.isDateSet());
        Assert.assertFalse(t.isHourSet());
        Assert.assertFalse(t.isMinuteSet());
        Assert.assertFalse(t.isSecondSet());
        Assert.assertFalse(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals("1975", t.toString());

        try {
            t.getMonth();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getDate();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getHour();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMinute();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getSecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMillisecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
    }

    @Test
    public void testCreateWithYearAndMonth() {
        PointInTime t = new PointInTime(1975, 7);
        Assert.assertEquals(Precision.MONTH, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertFalse(t.isDateSet());
        Assert.assertFalse(t.isHourSet());
        Assert.assertFalse(t.isMinuteSet());
        Assert.assertFalse(t.isSecondSet());
        Assert.assertFalse(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals("197507", t.toString());

        try {
            t.getDate();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getHour();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMinute();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getSecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMillisecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
    }

    @Test
    public void testCreateWithYearMonthAndDate() {
        PointInTime t = new PointInTime(1975, 7, 23);
        Assert.assertEquals(Precision.DATE, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertTrue(t.isDateSet());
        Assert.assertFalse(t.isHourSet());
        Assert.assertFalse(t.isMinuteSet());
        Assert.assertFalse(t.isSecondSet());
        Assert.assertFalse(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals("19750723", t.toString());

        try {
            t.getHour();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMinute();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getSecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMillisecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
    }

    @Test
    public void testCreateWithYearMonthDateAndHour() {
        PointInTime t = new PointInTime(1975, 7, 23, 15);
        Assert.assertEquals(Precision.HOUR, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertTrue(t.isDateSet());
        Assert.assertTrue(t.isHourSet());
        Assert.assertFalse(t.isMinuteSet());
        Assert.assertFalse(t.isSecondSet());
        Assert.assertFalse(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        Assert.assertEquals("1975072315", t.toString());

        try {
            t.getMinute();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getSecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMillisecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
    }

    @Test
    public void testCreateWithYearMonthDateHourAndMinute() {
        PointInTime t = new PointInTime(1975, 7, 23, 15, 23);
        Assert.assertEquals(Precision.MINUTE, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertTrue(t.isDateSet());
        Assert.assertTrue(t.isHourSet());
        Assert.assertTrue(t.isMinuteSet());
        Assert.assertFalse(t.isSecondSet());
        Assert.assertFalse(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        Assert.assertEquals(23, t.getMinute());
        Assert.assertEquals("197507231523", t.toString());

        try {
            t.getSecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
        try {
            t.getMillisecond();
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
            Assert.assertTrue(t == ex.getPointInTime());
        }
    }

    @Test
    public void testCreateWithYearMonthDateHourMinuteAndSecond() {
        PointInTime t = new PointInTime(1975, 7, 23, 15, 23, 42);
        Assert.assertEquals(Precision.SECOND, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertTrue(t.isDateSet());
        Assert.assertTrue(t.isHourSet());
        Assert.assertTrue(t.isMinuteSet());
        Assert.assertTrue(t.isSecondSet());
        Assert.assertFalse(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        Assert.assertEquals(23, t.getMinute());
        Assert.assertEquals(42, t.getSecond());
        Assert.assertEquals("19750723152342", t.toString());
    }

    @Test
    public void testCreateWithYearMonthDateHourMinuteSecondAndMillisecond() {
        PointInTime t = new PointInTime(1975, 7, 23, 15, 23, 42, 398);
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertTrue(t.isDateSet());
        Assert.assertTrue(t.isHourSet());
        Assert.assertTrue(t.isMinuteSet());
        Assert.assertTrue(t.isSecondSet());
        Assert.assertTrue(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        Assert.assertEquals(23, t.getMinute());
        Assert.assertEquals(42, t.getSecond());
        Assert.assertEquals(398, t.getMillisecond());
        Assert.assertEquals("19750723152342.398", t.toString());
    }

    @Test
    public void testCreateFromHL7String() throws Exception {
        PointInTime t = new PointInTime("19750723152342.398");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertTrue(t.isMonthSet());
        Assert.assertTrue(t.isDateSet());
        Assert.assertTrue(t.isHourSet());
        Assert.assertTrue(t.isMinuteSet());
        Assert.assertTrue(t.isSecondSet());
        Assert.assertTrue(t.isMillisecondSet());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        Assert.assertEquals(23, t.getMinute());
        Assert.assertEquals(42, t.getSecond());
        Assert.assertEquals(398, t.getMillisecond());
        Assert.assertEquals("19750723152342.398", t.toString());
    }

    @Test
    public void testEquality() {
        PointInTime t1 = new PointInTime(1975);
        PointInTime t2 = new PointInTime(1975);
        Assert.assertEquals(t1.getPrecision(), t2.getPrecision());
        assertEquals(t1, t2);

        t1 = new PointInTime(1975, 7);
        t2 = new PointInTime(1975, 7);
        assertEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23);
        t2 = new PointInTime(1975, 7, 23);
        assertEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23, 10);
        t2 = new PointInTime(1975, 7, 23, 10);
        assertEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23, 10, 54);
        t2 = new PointInTime(1975, 7, 23, 10, 54);
        assertEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23, 10, 54, 41);
        t2 = new PointInTime(1975, 7, 23, 10, 54, 41);
        assertEquals(t1, t2);
    }

    @Test
    public void testInequalityOfValue() {
        PointInTime t1 = new PointInTime(1975);
        PointInTime t2 = new PointInTime(1984);
        assertNotEquals(t1, t2);

        t1 = new PointInTime(1975, 7);
        t2 = new PointInTime(1975, 3);
        assertNotEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23);
        t2 = new PointInTime(1975, 7, 11);
        assertNotEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23, 10);
        t2 = new PointInTime(1975, 7, 23, 6);
        assertNotEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23, 10, 54);
        t2 = new PointInTime(1975, 7, 23, 10, 31);
        assertNotEquals(t1, t2);

        t1 = new PointInTime(1975, 7, 23, 10, 54, 17);
        t2 = new PointInTime(1975, 7, 23, 10, 54, 47);
        assertNotEquals(t1, t2);
    }

    @Test
    public void testInequalityOfDifferentPrecision() {
        PointInTime[] times = new PointInTime[6];
        times[0] = new PointInTime(1975);
        times[1] = new PointInTime(1975, 7);
        times[2] = new PointInTime(1975, 7, 23);
        times[3] = new PointInTime(1975, 7, 23, 10);
        times[4] = new PointInTime(1975, 7, 23, 10, 54);
        times[5] = new PointInTime(1975, 7, 23, 10, 54, 41);
        for (int i = 0; i < times.length; i++) {
            for (int j = 0; j < times.length; j++) {
                if (i == j)
                    continue;
                assertNotEquals(times[i], times[j]);
            }
        }
    }

    @Test
    public void testComparisonOfSamePrecision() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1984, 3, 11);
        Assert.assertTrue(t1.compareTo(t2) < 0);
        Assert.assertTrue(t2.compareTo(t1) > 0);

        t1 = new PointInTime(1975, 7, 23, 10, 30);
        t2 = new PointInTime(1984, 7, 23, 10, 30);
        Assert.assertTrue(t1.compareTo(t2) < 0);
        Assert.assertTrue(t2.compareTo(t1) > 0);

        t1 = new PointInTime(1984, 7, 22, 10);
        t2 = new PointInTime(1984, 7, 23, 10);
        Assert.assertTrue(t1.compareTo(t2) < 0);
        Assert.assertTrue(t2.compareTo(t1) > 0);

        t1 = new PointInTime(1984, 7, 23, 10);
        t2 = new PointInTime(1984, 7, 23, 10);
        Assert.assertTrue(t1.compareTo(t2) == 0);
        Assert.assertTrue(t2.compareTo(t1) == 0);
    }

    @Test
    public void testComparisonOfDifferentPrecision() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1984, 3, 11, 10);
        Assert.assertTrue(t1.compareTo(t2) < 0);
        Assert.assertTrue(t2.compareTo(t1) > 0);

        t1 = new PointInTime(2004, 12, 16, 18, 0);
        t2 = new PointInTime(2004, 12, 16, 18, 0, 1);
        Assert.assertTrue(t1.getPrecision().compareTo(t2.getPrecision()) < 0);
        Assert.assertTrue(t2.getPrecision().compareTo(t1.getPrecision()) > 0);
        Assert.assertTrue(t1.compareTo(t2) < 0);
        Assert.assertTrue(t2.compareTo(t1) > 0);

        t1 = new PointInTime(2004, 12, 15);
        t2 = new PointInTime(2004, 12, 16, 18, 0, 1);
        Assert.assertTrue(t1.compareTo(t2) < 0);
        Assert.assertTrue(t2.compareTo(t1) > 0);

        t1 = new PointInTime(2004, 12, 17);
        t2 = new PointInTime(2004, 12, 16, 18, 0);
        Assert.assertTrue(t1.compareTo(t2) > 0);
        Assert.assertTrue(t2.compareTo(t1) < 0);
    }

    @Test
    public void testComparisonWithNull() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        Assert.assertTrue(t1.compareTo(null) > 0);
    }

    @Test
    public void testAddPeriod() {
        PointInTime t = new PointInTime(2003, 9, 9);
        t = t.add(Period.days(60));
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(11, t.getMonth());
        Assert.assertEquals(8, t.getDate());
    }

    @Test
    public void testAddYears() {
        PointInTime t = new PointInTime(2003, 9, 9);
        t = t.add(Period.years(2));
        Assert.assertEquals(2005, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(9, t.getDate());
    }

    @Test
    public void testAddMonths() {
        PointInTime t = new PointInTime(2003, 9, 9);
        t = t.add(Period.months(18));
        Assert.assertEquals(2005, t.getYear());
        Assert.assertEquals(3, t.getMonth());
        Assert.assertEquals(9, t.getDate());
    }

    @Test
    public void testAddWeeks() {
        PointInTime t = new PointInTime(2003, 9, 9);
        t = t.addWeeks(2);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        assertThat(t.getPrecision(), is(Precision.DATE));

        t = new PointInTime(2003, 9, 9);
        t = t.add(Weeks.weeks(2));
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        assertThat(t.getPrecision(), is(Precision.DATE));

        t = new PointInTime(2003, 9);
        t = t.addWeeks(2);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        assertThat(t.getPrecision(), is(Precision.MONTH));
    }

    @Test
    public void testAddDays() {
        PointInTime t = new PointInTime(2003, 9, 9);
        t = t.add(Period.days(60));
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(11, t.getMonth());
        Assert.assertEquals(8, t.getDate());
    }

    @Test
    public void testAddHours() {
        PointInTime t = new PointInTime(2003, 9, 9, 18, 25);
        t = t.addHours(7);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(10, t.getDate());
        Assert.assertEquals(1, t.getHour());
        Assert.assertEquals(25, t.getMinute());
    }

    @Test
    public void testAddMinutes() {
        PointInTime t = new PointInTime(2003, 9, 9, 18, 25);
        t = t.addMinutes(82);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(9, t.getDate());
        Assert.assertEquals(19, t.getHour());
        Assert.assertEquals(47, t.getMinute());
    }

    @Test
    public void testAddSeconds() {
        PointInTime t = new PointInTime(2003, 9, 9, 18, 25, 56);
        t = t.addSeconds(93);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(9, t.getDate());
        Assert.assertEquals(18, t.getHour());
        Assert.assertEquals(27, t.getMinute());
        Assert.assertEquals(29, t.getSecond());
    }

    @Test
    public void testAddMilliseconds() {
        PointInTime t = new PointInTime(2003, 9, 9, 18, 25, 56, 672);
        t = t.addMilliseconds(567);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(9, t.getDate());
        Assert.assertEquals(18, t.getHour());
        Assert.assertEquals(25, t.getMinute());
        Assert.assertEquals(57, t.getSecond());
        Assert.assertEquals(239, t.getMillisecond());
    }

    @Test
    public void testSubtractPeriod() {
        PointInTime t = new PointInTime(2003, 9, 25);
        t = t.subtract(Period.days(30));
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(8, t.getMonth());
        Assert.assertEquals(26, t.getDate());

        // precision doesn't change
        t = t.subtract(new Period(0, 0, 0, 10, 23, 50, 40, 0));
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(8, t.getMonth());
        Assert.assertEquals(16, t.getDate());
    }

    @Test
    public void testSubtractWeeks() {
        PointInTime t = new PointInTime(2003, 9, 25);
        t = t.subtractWeeks(2);
        Assert.assertEquals(2003, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        assertThat(t.getPrecision(), is(Precision.DATE));

        t = new PointInTime(2005, 7, 25);
        t = t.subtract(Weeks.weeks(2));
        Assert.assertEquals(2005, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        assertThat(t.getPrecision(), is(Precision.DATE));
    }

    @Test
    public void testSubtractPointInTimeWithSamePrecision() {
        PointInTime t1 = new PointInTime(2003, 9, 25);
        PointInTime t2 = new PointInTime(2003, 8, 26);
        ReadableDuration d = t1.subtract(t2);
        Period p = d.toPeriod();
        Assert.assertEquals(720, p.getHours());
        Assert.assertEquals(0, p.getMinutes());
        Assert.assertEquals(0, p.getSeconds());
        Assert.assertEquals(0, p.getMillis());
        Assert.assertEquals(30, Days.standardDaysIn(p).getDays());

        t1 = new PointInTime(2003, 9, 25, 10, 35, 12);
        t2 = new PointInTime(2003, 9, 25, 18, 12, 10);
        d = t1.subtract(t2);
        p = d.toPeriod();
        Assert.assertEquals(0, p.getDays());
        Assert.assertEquals(-7, p.getHours());
        Assert.assertEquals(-36, p.getMinutes());
        Assert.assertEquals(-58, p.getSeconds());
        Assert.assertEquals(0, p.getMillis());
    }

    @Test
    public void testSubtractPointInTimeWithDifferentPrecision() {
        PointInTime t1 = new PointInTime(2003, 9, 25);
        PointInTime t2 = new PointInTime(2003, 8, 26, 8, 30);
        try {
            t1.subtract(t2);
            Assert.fail("expected " + ImprecisePointInTimeException.class);
        } catch (ImprecisePointInTimeException ex) {
        }
    }

    @Test
    public void testPromoteYearPrecision() {
        PointInTime t = new PointInTime(1975);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 1, 1, 0, 0, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1976, 1, 1, 0, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testPromoteMonthPrecision() {
        PointInTime t = new PointInTime(1975, 7);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 1, 0, 0, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 8, 1, 0, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testPromoteDatePrecision() {
        PointInTime t = new PointInTime(1975, 7, 23);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 0, 0, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 24, 0, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testPromoteHourPrecision() {
        PointInTime t = new PointInTime(1975, 7, 23, 10);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 0, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 11, 0, 0, 0, i.getHigh());
    }

    @Test
    public void testPromoteMinutePrecision() {
        PointInTime t = new PointInTime(1975, 7, 23, 10, 42);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 42, 0, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 43, 0, 0, i.getHigh());
    }

    @Test
    public void testPromoteSecondPrecision() {
        PointInTime t = new PointInTime(1975, 7, 23, 10, 42, 15);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 42, 15, 0, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 42, 16, 0, i.getHigh());
    }

    @Test
    public void testPromoteMillisecondPrecision() {
        PointInTime t = new PointInTime(1975, 7, 23, 10, 42, 15, 532);
        IntervalOfTime i = t.promote();
        Assert.assertTrue(i.isLowClosed());
        Assert.assertFalse(i.isHighClosed());
        Assert.assertEquals(Precision.MILLISECOND, i.getLow().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 42, 15, 532, i.getLow());
        Assert.assertEquals(Precision.MILLISECOND, i.getHigh().getPrecision());
        IntervalOfTimeTest.assertEquals(1975, 7, 23, 10, 42, 15, 533, i.getHigh());
    }

    @Test
    public void testBefore() {
        PointInTime t1 = new PointInTime(1975, 7, 24);
        PointInTime t2 = new PointInTime(1975, 7, 23);
        Assert.assertTrue(t2.before(t1));
        Assert.assertFalse(t2.before(t2));
        t2 = new PointInTime(1975, 7, 24, 10, 0, 0, 0);
        Assert.assertFalse(t2.before(t1));
        t2 = new PointInTime(1975, 7, 22, 23, 59, 59, 999);
        Assert.assertTrue(t2.before(t1));

        t1 = new PointInTime(2004, 12, 15, 11, 39, 05);
        t2 = new PointInTime(2004, 12, 15, 16, 37, 25);
        Assert.assertTrue(t1.before(t2));
        Assert.assertTrue(t1.compareTo(t2) < 0);
    }

    @Test
    public void testAfter() {
        PointInTime t1 = new PointInTime(1975, 7, 23);
        PointInTime t2 = new PointInTime(1975, 7, 24);
        Assert.assertTrue(t2.after(t1));
        Assert.assertFalse(t2.after(t2));
        t2 = new PointInTime(1975, 7, 23, 23, 59, 59, 999);
        Assert.assertFalse(t2.after(t1));
        t2 = new PointInTime(1975, 7, 24, 0, 0, 0, 0);
        Assert.assertTrue(t2.after(t1));
    }

    @Test
    public void testMidnight() {
        PointInTime midnight = new PointInTime(1984, 3, 31).toPointInTimeAtMidnight();

        Assert.assertEquals(1984, midnight.getYear());
        Assert.assertEquals(4, midnight.getMonth());
        Assert.assertEquals(1, midnight.getDate());
        Assert.assertEquals(0, midnight.getHour());
        Assert.assertEquals(0, midnight.getMinute());
        Assert.assertEquals(0, midnight.getSecond());
        Assert.assertEquals(0, midnight.getMillisecond());
    }

    @Test
    public void testNoon() {
        PointInTime noon = new PointInTime(1984, 3, 31).toPointInTimeAtNoon();

        Assert.assertEquals(1984, noon.getYear());
        Assert.assertEquals(3, noon.getMonth());
        Assert.assertEquals(31, noon.getDate());
        Assert.assertEquals(12, noon.getHour());
        Assert.assertEquals(0, noon.getMinute());
        Assert.assertEquals(0, noon.getSecond());
        Assert.assertEquals(0, noon.getMillisecond());
    }

    @Test
    public void testNow() {
        NowStrategy f = mock(NowStrategy.class);
        PointInTime.setNowStrategy(f);

        LocalDateTime now = new LocalDateTime();
        when(f.now()).thenReturn(PointInTime.fromLocalDateTime(now));

        PointInTime n = PointInTime.now();

        verify(f).now();

        Assert.assertEquals(Precision.MILLISECOND, n.getPrecision());
        Assert.assertEquals(now.getYear(), n.getYear());
        Assert.assertEquals(now.getMonthOfYear(), n.getMonth());
        Assert.assertEquals(now.getDayOfMonth(), n.getDate());
        Assert.assertEquals(now.getHourOfDay(), n.getHour());
        Assert.assertEquals(now.getMinuteOfHour(), n.getMinute());
        Assert.assertEquals(now.getSecondOfMinute(), n.getSecond());
        Assert.assertEquals(now.getMillisOfSecond(), n.getMillisecond());

        PointInTime.setNowStrategy(null);
    }

    @Test
    public void testToday() {
        NowStrategy f = mock(NowStrategy.class);
        PointInTime.setNowStrategy(f);

        LocalDateTime now = new LocalDateTime();
        when(f.now()).thenReturn(PointInTime.fromLocalDateTime(now));

        PointInTime t = PointInTime.today();

        verify(f).now();

        Assert.assertEquals(Precision.DATE, t.getPrecision());
        Assert.assertEquals(now.getYear(), t.getYear());
        Assert.assertEquals(now.getMonthOfYear(), t.getMonth());
        Assert.assertEquals(now.getDayOfMonth(), t.getDate());

        PointInTime.setNowStrategy(null);
    }

    @Test
    public void testToLocalDateTime() {
        PointInTime t = new PointInTime(1975, 7, 23);
        try {
            LocalDateTime t1 = t.toLocalDateTime();
            Assert.fail("expected " + ImprecisePointInTimeException.class.getName());
        } catch (ImprecisePointInTimeException e) {
            // NOOP
        }
        t = new PointInTime(1975, 7, 23, 10, 55, 34, 123);
        LocalDateTime t1 = t.toLocalDateTime();
        Assert.assertEquals(1975, t1.getYear());
        Assert.assertEquals(7, t1.getMonthOfYear());
        Assert.assertEquals(23, t1.getDayOfMonth());
        Assert.assertEquals(10, t1.getHourOfDay());
        Assert.assertEquals(55, t1.getMinuteOfHour());
        Assert.assertEquals(34, t1.getSecondOfMinute());
        Assert.assertEquals(123, t1.getMillisOfSecond());
    }

    public static void assertNotEquals(PointInTime t1, PointInTime t2) {
        Assert.assertFalse(t1.equals(t2));
        Assert.assertFalse(t2.equals(t1));
    }

    public static void assertEquals(PointInTime t1, PointInTime t2) {
        Assert.assertTrue(t1.equals(t2));
        Assert.assertTrue(t2.equals(t1));
    }
}