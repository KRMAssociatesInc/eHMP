package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.NowStrategy;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.IntervalOfTimeFormat;
import org.joda.time.LocalDateTime;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class IntervalOfTimeFormatTest {

    private NowStrategy mockNowStrategy;
    private PointInTime mockNow;

    @Before
    public void setUp() throws Exception {
        mockNowStrategy = mock(NowStrategy.class);
        PointInTime.setNowStrategy(mockNowStrategy);
        mockNow = PointInTime.fromLocalDateTime(new LocalDateTime());
        when(mockNowStrategy.now()).thenReturn(mockNow);
    }

    @After
    public void tearDown() throws Exception {
        PointInTime.setDefaultNowStrategy();
    }

    @Test
    public void testParseToday() {
        IntervalOfTime today = IntervalOfTime.today().toClosed();

        IntervalOfTime dateRange = IntervalOfTimeFormat.parse("T");
        assertThat(dateRange.getLow(), is(today.getLow()));
        assertThat(dateRange.getHigh(), is(today.getHigh()));
        assertThat(dateRange.isLowClosed(), is(true));
        assertThat(dateRange.isHighClosed(), is(true));

        dateRange = IntervalOfTimeFormat.parse("Today");
        assertThat(dateRange.getLow(), is(today.getLow()));
        assertThat(dateRange.getHigh(), is(today.getHigh()));
        assertThat(dateRange.isLowClosed(), is(true));
        assertThat(dateRange.isHighClosed(), is(true));
    }

    @Test
    public void testParseNow() {
        IntervalOfTime today = IntervalOfTime.today().toClosed();

        IntervalOfTime dateRange = IntervalOfTimeFormat.parse("NOW");
        assertThat(dateRange.getLow(), is(mockNow));
        assertThat(dateRange.getHigh(), is(today.getHigh()));
        assertThat(dateRange.isLowClosed(), is(true));
        assertThat(dateRange.isHighClosed(), is(true));
    }

    @Test
    public void testParseIntervalExpressionRelativeToToday() {
        PointInTime today = PointInTime.today();

        IntervalOfTime dateRange = IntervalOfTimeFormat.parse("T-9..T");
        assertThat(dateRange.getLow(), is(today.subtractDays(9).promote().getLow()));
        assertThat(dateRange.getHigh(), is(today.toPointInTimeAtMidnight().subtractMilliseconds(1)));
        assertThat(dateRange.isLowClosed(), is(true));
        assertThat(dateRange.isHighClosed(), is(true));

        dateRange = IntervalOfTimeFormat.parse("T-9");
        assertThat(dateRange.getLow(), is(today.subtractDays(9).promote().getLow()));
        assertThat(dateRange.getHigh(), is(today.toPointInTimeAtMidnight().subtractMilliseconds(1)));

        dateRange = IntervalOfTimeFormat.parse("NOW-9d");
        assertThat(dateRange.getLow(), is(mockNow.subtractDays(9)));
        assertThat(dateRange.getHigh(), is(today.promote().toClosed().getHigh()));

        dateRange = IntervalOfTimeFormat.parse("-1d");
        assertThat(dateRange.getLow(), is(today.subtractDays(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(today.promote().toClosed().getHigh()));

        dateRange = IntervalOfTimeFormat.parse("T-1d");
        assertThat(dateRange.getLow(), is(today.subtractDays(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(today.promote().toClosed().getHigh()));

    }

    @Test
    public void testParseIntervalExpressionRelativeToNow() {
        IntervalOfTime dateRange = IntervalOfTimeFormat.parse("NOW-9d..NOW");
        assertThat(dateRange.getLow(), is(mockNow.subtractDays(9)));
        assertThat(dateRange.getHigh(), is(mockNow));
        assertThat(dateRange.isLowClosed(), is(true));
        assertThat(dateRange.isHighClosed(), is(true));
    }

    @Test
    public void testParseNullOrEmptyText() throws Exception {
        assertThat(IntervalOfTimeFormat.parse(null), is(nullValue()));
        assertThat(IntervalOfTimeFormat.parse(""), is(nullValue()));
    }

    @Test
    public void testParseExpressionRelativeToHL7DateTime() throws Exception {
        IntervalOfTime dateRange = IntervalOfTimeFormat.parse("2012+1Y");
        assertThat(dateRange.getLow(), is(new PointInTime(2012).addYears(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(IntervalOfTime.today().toClosed().getHigh()));
        assertThat(dateRange.isLowClosed(), is(true));
        assertThat(dateRange.isHighClosed(), is(true));

        dateRange = IntervalOfTimeFormat.parse("201205+1Y");
        assertThat(dateRange.getLow(), is(new PointInTime(2012, 5).addYears(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(IntervalOfTime.today().toClosed().getHigh()));

        dateRange = IntervalOfTimeFormat.parse("20120524+1Y");
        assertThat(dateRange.getLow(), is(new PointInTime(2012, 5, 24).addYears(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(IntervalOfTime.today().toClosed().getHigh()));

        dateRange = IntervalOfTimeFormat.parse("2012052412+1Y");
        assertThat(dateRange.getLow(), is(new PointInTime(2012, 5, 24, 12).addYears(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(IntervalOfTime.today().toClosed().getHigh()));

        dateRange = IntervalOfTimeFormat.parse("201205241200+1Y");
        assertThat(dateRange.getLow(), is(new PointInTime(2012, 5, 24, 12, 0).addYears(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(IntervalOfTime.today().toClosed().getHigh()));

        dateRange = IntervalOfTimeFormat.parse("20120524120000+1Y");
        assertThat(dateRange.getLow(), is(new PointInTime(2012, 5, 24, 12, 0, 0).addYears(1).promote().getLow()));
        assertThat(dateRange.getHigh(), is(IntervalOfTime.today().toClosed().getHigh()));
    }

    @Test
    public void testParseIllegalExpressions() throws Exception {
        try {
            IntervalOfTimeFormat.parse("asdf");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("T_123d");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("_123d");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("X+123d");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("+1ZZZ");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("1PDQ");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("+1PDQ");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("-XYZ");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("+XYZ");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("XYZ");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("200+1Y");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
        try {
            IntervalOfTimeFormat.parse("2000000000000000000000000+1Y");
            fail("Expected " + IllegalArgumentException.class);
        } catch (IllegalArgumentException e) { /* NOOP */ }
    }
}
