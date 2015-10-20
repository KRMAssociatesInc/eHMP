package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.format.RFC822DateTimeFormat;
import org.joda.time.LocalDate;
import org.joda.time.LocalDateTime;
import org.junit.Assert;
import org.junit.Test;


public class RFC822DateTimeFormatTest {

    @Test
    public void testDateFormat() {
        Assert.assertEquals("23 Jul 1975", RFC822DateTimeFormat.date().print(new LocalDate(1975, 7, 23)));
        Assert.assertEquals("23 Jul 1975", RFC822DateTimeFormat.date().print(new LocalDateTime(1975, 7, 23, 10, 23, 55)));
    }

    @Test
    public void testDateTimeFormat() {
        Assert.assertEquals("23 Jul 1975 10:23:55",
                RFC822DateTimeFormat.dateTime().print(new LocalDateTime(1975, 7, 23, 10, 23, 55)));
//        assertEquals("23 Jul 1975 10:23:55 -0600",
//                RFC822DateTimeFormat.dateTime().print(
//                        new DateTime(1975, 7, 23, 10, 23, 55, 123, DateTimeZone.forOffsetHours(-6))));

    }
}
