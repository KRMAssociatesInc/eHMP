package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.VPRDateTimeFormat;
import org.joda.time.LocalDateTime;
import org.junit.Assert;
import org.junit.Test;

import java.text.ParseException;
import java.util.Calendar;
import java.util.GregorianCalendar;

public class VPRDateTimeFormatTest {

    @Test
    public void testParseDate() throws ParseException {
        org.junit.Assert.assertEquals(new PointInTime(1996, 3, 11), VPRDateTimeFormat.parse("19960311"));
    }

    @Test
    public void testParseMonth() throws ParseException {
        org.junit.Assert.assertEquals(new PointInTime(1996, 3), VPRDateTimeFormat.parse("19960300"));
    }

    @Test
    public void testParseYear() throws ParseException {
        org.junit.Assert.assertEquals(new PointInTime(1996), VPRDateTimeFormat.parse("19960000"));
    }

    @Test
    public void testParseNullOrEmptyString() {
        Assert.assertNull(VPRDateTimeFormat.parse(null));
        Assert.assertNull(VPRDateTimeFormat.parse(""));
    }

    @Test
    public void testFormatYear() {
        org.junit.Assert.assertEquals("19960000", VPRDateTimeFormat.date().print(new PointInTime(1996)));
    }

    @Test
    public void testFormatMonth() {
        org.junit.Assert.assertEquals("19960300", VPRDateTimeFormat.date().print(new PointInTime(1996, 3)));
    }

    @Test
    public void testFormatDate() {
        org.junit.Assert.assertEquals("19960311", VPRDateTimeFormat.date().print(new PointInTime(1996, 3, 11)));
    }

    @Test
    public void testFormatDateTime() {
        org.junit.Assert.assertEquals("19960311", VPRDateTimeFormat.date().print(new PointInTime(1996, 3, 11, 10, 23, 35)));
    }

    @Test
    public void testFormatJavaUtilDate() {
        GregorianCalendar c = new GregorianCalendar(1996, Calendar.MARCH, 11, 10, 23, 35);
        org.junit.Assert.assertEquals("19960311", VPRDateTimeFormat.date().print(LocalDateTime.fromCalendarFields(c)));
    }
}
