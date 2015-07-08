package gov.va.hmp.healthtime;

import org.junit.Ignore;
import org.junit.Test;

import java.util.Locale;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class MSCUIDateTimePrinterSetTests {
    private MSCUIDateTimePrinterSet printers = new MSCUIDateTimePrinterSet();

    @Test
    public void testDateTimePrinter() throws Exception {
        PointInTime t = new PointInTime(1984, 3, 11, 22, 56, 56);
        assertThat(printers.dateTime().print(t, Locale.ENGLISH), is("11-Mar-1984 22:56"));
        t = new PointInTime(1984, 3, 11, 22, 56);
        assertThat(printers.dateTime().print(t, Locale.ENGLISH), is("11-Mar-1984 22:56"));
        t = new PointInTime(1984, 3, 11, 22);
        assertThat(printers.dateTime().print(t, Locale.ENGLISH), is("11-Mar-1984")); // Mar 11,84 22-23 maybe?
        t = new PointInTime(1984, 3, 11);
        assertThat(printers.dateTime().print(t, Locale.ENGLISH), is("11-Mar-1984"));
        t = new PointInTime(1984, 3);
        assertThat(printers.dateTime().print(t, Locale.ENGLISH), is("Mar-1984"));
        t = new PointInTime(1984);
        assertThat(printers.dateTime().print(t, Locale.ENGLISH), is("1984"));
    }

    @Test
    public void testDatePrinter() throws Exception {
        PointInTime t = new PointInTime(1975, 7, 23);
        assertThat(printers.date().print(t, Locale.ENGLISH), is("23-Jul-1975"));
        t = new PointInTime(1975, 7, 23, 10, 23);
        assertThat(printers.date().print(t, Locale.ENGLISH), is("23-Jul-1975"));
        t = new PointInTime(1975, 7, 23, 10, 23, 55, 0);
        assertThat(printers.date().print(t, Locale.ENGLISH), is("23-Jul-1975"));
        t = new PointInTime(1975, 7);
        assertThat(printers.date().print(t, Locale.ENGLISH), is("Jul-1975"));
        t = new PointInTime(1975);
        assertThat(printers.date().print(t, Locale.ENGLISH), is("1975"));
    }

    @Test
    public void testYearPrinter() {
        PointInTime t = new PointInTime(1984, 3, 11, 22, 56, 56);
        assertThat(printers.year().print(t, Locale.ENGLISH), is("1984"));
    }

    @Test
    public void testTimePrinter() throws Exception {
        PointInTime t = new PointInTime(1984, 3, 11, 22, 56, 56);
        assertThat(printers.time().print(t, Locale.ENGLISH), is("22:56"));
    }

    @Ignore
    @Test
    public void testTimePrinterImprecise() throws Exception {
        PointInTime t = new PointInTime(1984, 3, 11);
        assertThat(printers.time().print(t, Locale.ENGLISH), is("22:56"));
    }
}
