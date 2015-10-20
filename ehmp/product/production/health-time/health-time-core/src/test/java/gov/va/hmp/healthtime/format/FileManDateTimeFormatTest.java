package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.FileManDateTimeFormat;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class FileManDateTimeFormatTest {

    @Test
    public void testFormatPointInTime() {
        Assert.assertEquals("2750000", FileManDateTimeFormat.dateTime().print(new PointInTime(1975)));
        Assert.assertEquals("2750700", FileManDateTimeFormat.dateTime().print(new PointInTime(1975, 7)));
        Assert.assertEquals("2750723", FileManDateTimeFormat.dateTime().print(new PointInTime(1975, 7, 23)));
        Assert.assertEquals("2750723.10", FileManDateTimeFormat.dateTime().print(new PointInTime(1975, 7, 23, 10)));
        Assert.assertEquals("2750723.1056", FileManDateTimeFormat.dateTime().print(new PointInTime(1975, 7, 23, 10, 56)));
        Assert.assertEquals("2750723.105614",
                FileManDateTimeFormat.dateTime().print(new PointInTime(1975, 7, 23, 10, 56, 14)));
        Assert.assertEquals("2750723.105614",
                FileManDateTimeFormat.dateTime().print(new PointInTime(1975, 7, 23, 10, 56, 14, 456)));
        Assert.assertEquals("3010000", FileManDateTimeFormat.dateTime().print(new PointInTime(2001)));
    }

    @Test
    public void testFormatDateTime() {
        Assert.assertEquals("3010911.000000",
                FileManDateTimeFormat.dateTime().print(new DateTime(2001, 9, 11, 0, 0, 0, 0)));
    }

    @Test
    public void testFormatLocalDateTime() {
        Assert.assertEquals("2750723", FileManDateTimeFormat.date().print(new LocalDateTime(1975, 7, 23, 10, 56)));
        Assert.assertEquals("2750723.105600", FileManDateTimeFormat.dateTime().print(new LocalDateTime(1975, 7, 23, 10, 56)));
    }

    @Test
    public void testFormatLocalDate() {
        Assert.assertEquals("2750723", FileManDateTimeFormat.date().print(new LocalDate(1975, 7, 23)));
    }

    @Test
    public void testParseDateTime() {
        DateTime t = FileManDateTimeFormat.dateTime().parseDateTime("2750723.105614");
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonthOfYear());
        Assert.assertEquals(23, t.getDayOfMonth());
        Assert.assertEquals(10, t.getHourOfDay());
        Assert.assertEquals(56, t.getMinuteOfHour());
        Assert.assertEquals(14, t.getSecondOfMinute());
        Assert.assertEquals(0, t.getMillisOfSecond());
    }

    @Test
    public void testParseLocalDateTime() {
        LocalDateTime t = FileManDateTimeFormat.parseLocalDateTime("2750723.105614");
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonthOfYear());
        Assert.assertEquals(23, t.getDayOfMonth());
        Assert.assertEquals(10, t.getHourOfDay());
        Assert.assertEquals(56, t.getMinuteOfHour());
        Assert.assertEquals(14, t.getSecondOfMinute());
        Assert.assertEquals(0, t.getMillisOfSecond());
    }

    @Test
    public void testParsePointInTime() {
        PointInTime t = FileManDateTimeFormat.parse("2750000");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = FileManDateTimeFormat.parse("2750700");
        Assert.assertEquals(Precision.MONTH, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        t = FileManDateTimeFormat.parse("2750723");
        Assert.assertEquals(Precision.DATE, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        t = FileManDateTimeFormat.parse("2750723.15");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(15, t.getHour());
        Assert.assertEquals(0, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2750723.1057");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(57, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2750723.105713");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(23, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(57, t.getMinute());
        Assert.assertEquals(13, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2981118.071");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1998, t.getYear());
        Assert.assertEquals(11, t.getMonth());
        Assert.assertEquals(18, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(10, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2970711.07171");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1997, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(17, t.getMinute());
        Assert.assertEquals(10, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2990121.1");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1999, t.getYear());
        Assert.assertEquals(1, t.getMonth());
        Assert.assertEquals(21, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(0, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2990121.10");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1999, t.getYear());
        Assert.assertEquals(1, t.getMonth());
        Assert.assertEquals(21, t.getDate());
        Assert.assertEquals(10, t.getHour());
        t = FileManDateTimeFormat.parse("2990121.100");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1999, t.getYear());
        Assert.assertEquals(1, t.getMonth());
        Assert.assertEquals(21, t.getDate());
        Assert.assertEquals(10, t.getHour());
        Assert.assertEquals(0, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2750000.0");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = FileManDateTimeFormat.parse("2750000.000");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
        t = FileManDateTimeFormat.parse("2981118.070");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1998, t.getYear());
        Assert.assertEquals(11, t.getMonth());
        Assert.assertEquals(18, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(0, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2970711.07170");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(1997, t.getYear());
        Assert.assertEquals(7, t.getMonth());
        Assert.assertEquals(11, t.getDate());
        Assert.assertEquals(7, t.getHour());
        Assert.assertEquals(17, t.getMinute());
        Assert.assertEquals(0, t.getSecond());
        Assert.assertEquals(0, t.getMillisecond());
        t = FileManDateTimeFormat.parse("2750000.00000");
        Assert.assertEquals(Precision.YEAR, t.getPrecision());
        Assert.assertEquals(1975, t.getYear());
    }

    @Test
    public void testParsePointInTimeWithNullOrEmptyString() {
        Assert.assertNull(FileManDateTimeFormat.parse(null));
        Assert.assertNull(FileManDateTimeFormat.parse(""));
    }

    @Test
    public void testParseLocalDateTimeWithNullOrEmptyString() {
        Assert.assertNull(FileManDateTimeFormat.parseLocalDateTime(null));
        Assert.assertNull(FileManDateTimeFormat.parseLocalDateTime(""));
    }

    @Test
    public void testParsePointInTimeWithInvalidStrings() {
        try {
            FileManDateTimeFormat.parse("275");
            Assert.fail("expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) {
            // NOOP
        }
        try {
            FileManDateTimeFormat.parse("2750000.");
            Assert.fail("expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) {
            // NOOP
        }
    }

    @Test
    public void testParseMidnight() {
        PointInTime t = FileManDateTimeFormat.parse("3060924.24");
        Assert.assertEquals(Precision.MILLISECOND, t.getPrecision());
        Assert.assertEquals(2006, t.getYear());
        Assert.assertEquals(9, t.getMonth());
        Assert.assertEquals(24, t.getDate());
        Assert.assertEquals(23, t.getHour());
        Assert.assertEquals(59, t.getMinute());
        Assert.assertEquals(59, t.getSecond());
        Assert.assertEquals(999, t.getMillisecond());
    }

    @Test
    public void testParseRelativeDateExpressions() {
        PointInTime t = FileManDateTimeFormat.parse("T");
        assertThat(t, is(PointInTime.today()));
        t = HL7DateTimeFormat.parse("T+3d");
        assertThat(t, is(PointInTime.today().addDays(3)));
        t = FileManDateTimeFormat.parse("TODAY-4M");
        assertThat(t, is(PointInTime.today().subtractMonths(4)));
    }
}
