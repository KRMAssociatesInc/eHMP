package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.joda.time.format.DateTimeFormatter;
import org.junit.Assert;
import org.junit.Test;

public class PointInTimeFormatTest {

    @Test
    public void testDefaultDateFormat() {
        PointInTime t = new PointInTime(1975, 7, 23);
        Assert.assertEquals("Jul 23,75", PointInTimeFormat.date().print(t));
        LocalDateTime ldt = new LocalDateTime(1975, 7, 23, 10, 23);
        Assert.assertEquals("Jul 23,75", PointInTimeFormat.date().print(ldt));
        DateTime dt = new DateTime(1975, 7, 23, 10, 23, 55, 0);
        Assert.assertEquals("Jul 23,75", PointInTimeFormat.date().print(dt));
    }

    @Test
    public void testDefaultDateTimeFormat() {
        PointInTime t = new PointInTime(1984, 3, 11, 22, 56, 56);
        Assert.assertEquals("Mar 11,84 22:56", PointInTimeFormat.dateTime().print(t));
    }

    @Test
    public void testDefaultTimeFormat() {
        PointInTime t = new PointInTime(1984, 3, 11, 22, 56, 56);
        Assert.assertEquals("22:56", PointInTimeFormat.time().print(t));
    }

    @Test
    public void testFormatWithLowerPrecisionThanTime() {
        PointInTime t = new PointInTime(1984, 3, 11, 10, 56);
        Assert.assertEquals("03-11-84", PointInTimeFormat.forPattern("MM-dd-yy").print(t));
    }

    @Test
    public void testFormatWithHigherPrecisionThanTime() {
        DateTimeFormatter format = PointInTimeFormat.forPattern("MMM yyyy");
        PointInTime t = new PointInTime(1975, 7);
        Assert.assertEquals("Jul 1975", format.print(t));
        t = new PointInTime(1975);
        Assert.assertEquals("\ufffd 1975", format.print(t));
    }

    @Test
    public void testDefaultFormatForPrecision() {
        PointInTime t = new PointInTime(1975, 7, 23, 10, 23, 55, 123);
        Assert.assertEquals("1975", PointInTimeFormat.forPrecision(Precision.YEAR).print(t));
        Assert.assertEquals("Jul 1975", PointInTimeFormat.forPrecision(Precision.MONTH).print(t));
        Assert.assertEquals("Jul 23,75", PointInTimeFormat.forPrecision(Precision.DATE).print(t));
        Assert.assertEquals("Jul 23,75", PointInTimeFormat.forPrecision(Precision.HOUR).print(t));
        Assert.assertEquals("Jul 23,75 10:23", PointInTimeFormat.forPrecision(Precision.MINUTE).print(t));
        Assert.assertEquals("Jul 23,75 10:23", PointInTimeFormat.forPrecision(Precision.SECOND).print(t));
        Assert.assertEquals("Jul 23,75 10:23", PointInTimeFormat.forPrecision(Precision.MILLISECOND).print(t));
    }

//    public void testFMExternalDateTimeParse() {
//        SimplePointInTimeFormat format = new SimplePointInTimeFormat("MMM dd, yyyy@HH:mm", Precision.MINUTE);
//        PointInTime p = new PointInTime(2001, 10, 3, 23, 40);
//        try {
//            assertEquals(p, format.parse("Oct 03, 2001@23:40"));
//        } catch (ParseException e) {
//            fail("ParseException caught: " + e.getMessage());
//        }
//    }
//
//    public void testParseForMilliseconds() {
//        SimplePointInTimeFormat format = new SimplePointInTimeFormat("dd MMM yyyy@HH:mm:ss.SSS", Precision.MILLISECOND);
//        PointInTime et = new PointInTime(1975, 7, 4, 14, 45, 15, 955);
//        try {
//            PointInTime at = format.parse("4 Jul 1975@14:45:15.955");
//            assertEquals(et, at);
//            assertEquals(Precision.MILLISECOND, at.getPrecision());
//        } catch (ParseException e) {
//            fail("Caught ParseException: " + e.getMessage());
//        }
//    }
//
//    public void testParseForDate() {
//        SimplePointInTimeFormat format = new SimplePointInTimeFormat("MMM dd yyyy", Precision.DATE);
//        PointInTime et = new PointInTime(1975, 7, 4);
//        try {
//            PointInTime at = format.parse("Jul 4 1975");
//            assertEquals(et, at);
//            assertEquals(at.getPrecision(), Precision.DATE);
//        } catch (ParseException e) {
//            fail("Caught ParseException: " + e.getMessage());
//        }
//    }
//
//    public void testParseForYear() {
//        SimplePointInTimeFormat format = new SimplePointInTimeFormat("yy", Precision.YEAR);
//        PointInTime et = new PointInTime(1975);
//        try {
//            PointInTime at = format.parse("75");
//            assertEquals(et, at);
//            assertEquals(at.getPrecision(), Precision.YEAR);
//        } catch (ParseException e) {
//            fail("Caught ParseException: " + e.getMessage());
//        }
//    }
}
