package gov.va.hmp.healthtime;

import org.joda.time.format.DateTimeFormat;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.Locale;

import static org.hamcrest.CoreMatchers.is;

public class HealthTimePrinterTests {

    private HealthTimePrinter printer;

    @Before
    public void setUp() throws Exception {
        printer = new HealthTimePrinter(DateTimeFormat.forPattern("YYYY-MMM-dd"));

    }

    @Test
    public void testNullPrintsEmptyString() throws Exception {
        Assert.assertThat(printer.print(null, Locale.ENGLISH), is(""));
    }
}
