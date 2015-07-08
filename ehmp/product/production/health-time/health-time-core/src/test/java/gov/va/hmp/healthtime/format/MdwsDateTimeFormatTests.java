package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.MdwsDateTimeFormat;
import junit.framework.Assert;
import junit.framework.TestCase;

public class MdwsDateTimeFormatTests extends TestCase {

    public void testFormatPointInTime() {
        PointInTime t = new PointInTime(1975);
        Assert.assertEquals("1975", MdwsDateTimeFormat.forPointInTime(t).print(t));

        t = new PointInTime(1975, 7);
        assertEquals("197507", MdwsDateTimeFormat.forPointInTime(t).print(t));

        t = new PointInTime(1975, 7, 23);
        assertEquals("19750723", MdwsDateTimeFormat.forPointInTime(t).print(t));

        t = new PointInTime(1975, 7, 23, 10);
        assertEquals("19750723.10", MdwsDateTimeFormat.forPointInTime(t).print(t));

        t = new PointInTime(1975, 7, 23, 10, 56);
        assertEquals("19750723.1056", MdwsDateTimeFormat.forPointInTime(t).print(t));

        t = new PointInTime(1975, 7, 23, 10, 56, 34);
        assertEquals("19750723.105634", MdwsDateTimeFormat.forPointInTime(t).print(t));
    }

    public void testParse() {
        PointInTime t = MdwsDateTimeFormat.parse("19750723.105634");
        assertEquals(1975, t.getYear());
        assertEquals(7, t.getMonth());
        assertEquals(23, t.getDate());
        assertEquals(10, t.getHour());
        assertEquals(56, t.getMinute());
        assertEquals(34, t.getSecond());
    }

    public void testParseFilemanDateAtMidnight() {
        PointInTime t = MdwsDateTimeFormat.parse("20070917.240000");
        assertEquals(2007, t.getYear());
        assertEquals(9, t.getMonth());
        assertEquals(17, t.getDate());
        assertEquals(23, t.getHour());
        assertEquals(59, t.getMinute());
        assertEquals(59, t.getSecond());
    }
}
