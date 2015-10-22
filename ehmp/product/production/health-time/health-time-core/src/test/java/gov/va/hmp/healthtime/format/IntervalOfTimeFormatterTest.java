package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.IntervalOfTimeFormatter;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class IntervalOfTimeFormatterTest {

    private static final IntervalOfTime INTERVAL = new PointInTime(1975, 7, 23).promote();
    private IntervalOfTimeFormatter formatter = new IntervalOfTimeFormatter();

    @Test
    public void testPrint() {
        assertEquals("19750723000000.000..19750723235959.999", formatter.print(INTERVAL));
        assertNull(formatter.print(null));
    }

    @Test
    public void testPrintIntervalForm() {
        formatter = new IntervalOfTimeFormatter(true);
        assertEquals("[19750723000000.000;19750724000000.000[", formatter.print(INTERVAL));
        assertNull(formatter.print(null));
    }

    @Test
    public void testPrintToStringBuffer() {
        StringBuffer buf = new StringBuffer();
        formatter.printTo(buf, INTERVAL);
        assertEquals("19750723000000.000..19750723235959.999", buf.toString());
    }

    @Test
    public void testPrintToStringBufferIntervalForm() {
        StringBuffer buf = new StringBuffer();
        formatter = new IntervalOfTimeFormatter(true);
        formatter.printTo(buf, INTERVAL);
        assertEquals("[19750723000000.000;19750724000000.000[", buf.toString());
    }

    @Test
    public void testParseNullOrEmptyString() {
        assertNull(formatter.parseInterval(null));
        assertNull(formatter.parseInterval(""));
    }

    @Test
    public void testParseImprecise() {
        IntervalOfTime interval = formatter.parseInterval("19750723");
        assertEquals(INTERVAL, interval);
    }

    @Test
    public void testParseStartStop() {
        IntervalOfTime interval = formatter.parseInterval("19750723000000.000..19750723235959.999");
        assertEquals(INTERVAL.toClosed(), interval);
    }

    @Test
    public void testParseStartStopImprecise() {
        IntervalOfTime interval = formatter.parseInterval("19750723..19750729");
        assertEquals(new IntervalOfTime(new PointInTime(1975, 7, 23, 0, 0, 0, 0), new PointInTime(1975, 7, 29, 23, 59, 59, 999), true, true), interval);

        interval = formatter.parseInterval("19750723..1984");
        assertEquals(new IntervalOfTime(new PointInTime(1975, 7, 23, 0, 0, 0, 0), new PointInTime(1984, 12, 31, 23, 59, 59, 999), true, true), interval);
    }

    @Test
    public void testParseStartStopIntervalForm() {
        formatter = new IntervalOfTimeFormatter(true);
        IntervalOfTime interval = formatter.parseInterval("[19750723000000.000;19750724000000.000[");
        assertEquals(INTERVAL, interval);
        interval = formatter.parseInterval("[19750723000000.000;19750723235959.999]");
        assertEquals(INTERVAL.toClosed(), interval);
    }

}
