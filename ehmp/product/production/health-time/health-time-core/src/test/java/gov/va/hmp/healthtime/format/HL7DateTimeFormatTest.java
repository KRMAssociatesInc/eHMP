package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDateTime;
import org.joda.time.format.DateTimeFormat;
import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class HL7DateTimeFormatTest {

    @Test
    public void testFormatForPrecision() {
        PointInTime t = new PointInTime(1975, 7, 23, 10, 23, 55, 123);
        Assert.assertEquals("1975", HL7DateTimeFormat.forPrecision(Precision.YEAR).print(t));
        Assert.assertEquals("197507", HL7DateTimeFormat.forPrecision(Precision.MONTH).print(t));
        Assert.assertEquals("19750723", HL7DateTimeFormat.forPrecision(Precision.DATE).print(t));
        Assert.assertEquals("1975072310", HL7DateTimeFormat.forPrecision(Precision.HOUR).print(t));
        Assert.assertEquals("197507231023", HL7DateTimeFormat.forPrecision(Precision.MINUTE).print(t));
        Assert.assertEquals("19750723102355", HL7DateTimeFormat.forPrecision(Precision.SECOND).print(t));
        Assert.assertEquals("19750723102355.123", HL7DateTimeFormat.forPrecision(Precision.MILLISECOND).print(t));
    }

    @Test
    public void testFormatDateTimeWithTimeZoneOffset() {
        DateTimeZone tz = DateTimeZone.forID("America/Chicago");
        DateTime t = new DateTime(1975, 7, 23, 10, 23, 55, 123, tz);
        String withTimeZoneOffset = "19750723102355.123" + DateTimeFormat.forPattern("Z").print(t);
        Assert.assertEquals(withTimeZoneOffset,
                HL7DateTimeFormat.dateTime().print(t));
    }

    @Test
    public void testFormatLocalDateTime() {
        LocalDateTime t = new LocalDateTime(1975, 7, 23, 10, 23, 55, 123);
        Assert.assertEquals("19750723102355.123", HL7DateTimeFormat.dateTime().print(t));
    }

    @Test
    public void testParseLocalDateTime() {
        LocalDateTime t = HL7DateTimeFormat.toLocalDateTime("19750723105614.123");
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonthOfYear());
        Assert.assertEquals(23, t.getDayOfMonth());
        Assert.assertEquals(10, t.getHourOfDay());
        Assert.assertEquals(56, t.getMinuteOfHour());
        Assert.assertEquals(14, t.getSecondOfMinute());
        Assert.assertEquals(123, t.getMillisOfSecond());
    }

    @Test
    public void testParsePointInTime() {
        PointInTime t = HL7DateTimeFormat.toPointInTime("1975");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = HL7DateTimeFormat.toPointInTime("197507");
        Assert.assertEquals(Precision.MONTH, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        t = HL7DateTimeFormat.toPointInTime("19750723");
        Assert.assertEquals(Precision.DATE, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        t = HL7DateTimeFormat.toPointInTime("1975072315");
        Assert.assertEquals(Precision.HOUR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        t = HL7DateTimeFormat.toPointInTime("197507231057");
        Assert.assertEquals(Precision.MINUTE, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(57, t.getMinute());
        t = HL7DateTimeFormat.toPointInTime("19750723105713");
        Assert.assertEquals(Precision.SECOND, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(57, t.getMinute());
        Assert.assertEquals(13, t.getSecond());
        t = HL7DateTimeFormat.toPointInTime("19981118071");
        Assert.assertEquals(Precision.MINUTE, t.getPrecision());
        Assert.assertEquals(1998, t.getYear());
        Assert.assertEquals(11, t.getMonth());
        Assert.assertEquals(18, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(10, t.getMinute());
        t = HL7DateTimeFormat.toPointInTime("1997071107171");
        Assert.assertEquals(Precision.SECOND, t.getPrecision());
        Assert.assertEquals(1997, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(17, t.getMinute());
        Assert.assertEquals(10, t.getSecond());
        t = HL7DateTimeFormat.toPointInTime("199901211");
        Assert.assertEquals(Precision.HOUR, t.getPrecision());
        Assert.assertEquals(1999, t.getYear());
        Assert.assertEquals(1, t.getMonth());
        Assert.assertEquals(21, t.getDate());
        Assert.assertEquals(10, t.getHour());
        t = HL7DateTimeFormat.toPointInTime("1999012110");
        Assert.assertEquals(Precision.HOUR, t.getPrecision());
        Assert.assertEquals(1999, t.getYear());
        Assert.assertEquals(1, t.getMonth());
        Assert.assertEquals(21, t.getDate());
        Assert.assertEquals(10, t.getHour());
        t = HL7DateTimeFormat.toPointInTime("19990121100");
        Assert.assertEquals(Precision.MINUTE, t.getPrecision());
        Assert.assertEquals(1999, t.getYear());
        Assert.assertEquals(1, t.getMonth());
        Assert.assertEquals(21, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(0, t.getMinute());
        t = HL7DateTimeFormat.toPointInTime("197500000");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = HL7DateTimeFormat.toPointInTime("19750000000");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = HL7DateTimeFormat.toPointInTime("19981118070");
        Assert.assertEquals(Precision.MINUTE, t.getPrecision());
        Assert.assertEquals(1998, t.getYear());
        Assert.assertEquals(11, t.getMonth());
        Assert.assertEquals(18, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(0, t.getMinute());
        t = HL7DateTimeFormat.toPointInTime("1997071107170");
        Assert.assertEquals(Precision.SECOND, t.getPrecision());
        Assert.assertEquals(1997, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(17, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        t = HL7DateTimeFormat.toPointInTime("1975000000000");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = HL7DateTimeFormat.toPointInTime("200704111432-0700");
        Assert.assertEquals(Precision.MINUTE, t.getPrecision());
        Assert.assertEquals(2007, t.getYear());
        Assert.assertEquals(4, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        Assert.assertEquals(14, t.getHour());
        Assert.assertEquals(32, t.getMinute());
    }

    @Test
    public void testParsePointInTimeWithNullOrEmptyString() {
        Assert.assertNull(HL7DateTimeFormat.parse(null));
        Assert.assertNull(HL7DateTimeFormat.parse(""));
    }

    @Test
    public void testParseRelativeDateExpressionsFromToday() {
        PointInTime t = HL7DateTimeFormat.parse("T");
        assertThat(t, is(PointInTime.today()));
        t = HL7DateTimeFormat.parse("T+3d");
        assertThat(t, is(PointInTime.today().addDays(3)));
        t = HL7DateTimeFormat.parse("TODAY-4M");
        assertThat(t, is(PointInTime.today().subtractMonths(4)));
    }

    @Test
    public void testParseRelativeDateExpressionsFromAnHL7Date() {
        PointInTime t = HL7DateTimeFormat.parse("2012+1Y");
        assertThat(t, is(new PointInTime(2012).addYears(1)));
        t = HL7DateTimeFormat.parse("201205+1Y");
        assertThat(t, is(new PointInTime(2012, 5).addYears(1)));
        t = HL7DateTimeFormat.parse("20120524+1Y");
        assertThat(t, is(new PointInTime(2012, 5, 24).addYears(1)));
        t = HL7DateTimeFormat.parse("2012052412+1Y");
        assertThat(t, is(new PointInTime(2012, 5, 24, 12).addYears(1)));
        t = HL7DateTimeFormat.parse("20120524120000+1Y");
        assertThat(t, is(new PointInTime(2012, 5, 24, 12, 0, 0).addYears(1)));
    }
}