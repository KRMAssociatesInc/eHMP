package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.NowStrategy;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.RelativeDateTimeFormat;
import org.joda.time.LocalDateTime;
import org.joda.time.Weeks;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RelativeDateTimeFormatTest {

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
    public void testParseNullOrEmptyText() throws Exception {
        assertThat(RelativeDateTimeFormat.parse(null), is(nullValue()));
        assertThat(RelativeDateTimeFormat.parse(""), is(nullValue()));
    }

    @Test
    public void testParseToday() {
        PointInTime expectedToday = PointInTime.today();

        PointInTime today = RelativeDateTimeFormat.parse("TODAY");
        assertThat(today, is(expectedToday));
        assertThat(today.getPrecision(), is(Precision.DATE));

        today = RelativeDateTimeFormat.parse("Today");
        assertThat(today, is(expectedToday));
        assertThat(today.getPrecision(), is(Precision.DATE));

        today = RelativeDateTimeFormat.parse("T");
        assertThat(today, is(expectedToday));
        assertThat(today.getPrecision(), is(Precision.DATE));

        today = RelativeDateTimeFormat.parse("t");
        assertThat(today, is(expectedToday));
        assertThat(today.getPrecision(), is(Precision.DATE));
    }

    @Test
    public void testParseTomorrow() {
        PointInTime expectedTomorrow = PointInTime.today().addDays(1);

        PointInTime tomorrow = RelativeDateTimeFormat.parse("TODAY+1");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("Today+1");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("T+1");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("t+1");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("t+1d");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("t+1D");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("+1d");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));

        tomorrow = RelativeDateTimeFormat.parse("+1");
        assertThat(tomorrow, is(expectedTomorrow));
        assertThat(tomorrow.getPrecision(), is(Precision.DATE));
    }

    @Test
    public void testParseOneWeekAgo() {
        PointInTime expectedLastWeek = PointInTime.today().subtract(Weeks.weeks(1));

        PointInTime lastWeek = RelativeDateTimeFormat.parse("TODAY-7");
        assertThat(lastWeek, is(expectedLastWeek));
        assertThat(lastWeek.getPrecision(), is(Precision.DATE));

        lastWeek = RelativeDateTimeFormat.parse("Today-7");
        assertThat(lastWeek, is(expectedLastWeek));
        assertThat(lastWeek.getPrecision(), is(Precision.DATE));

        lastWeek = RelativeDateTimeFormat.parse("T-7");
        assertThat(lastWeek, is(expectedLastWeek));
        assertThat(lastWeek.getPrecision(), is(Precision.DATE));

        lastWeek = RelativeDateTimeFormat.parse("t-7");
        assertThat(lastWeek, is(expectedLastWeek));
        assertThat(lastWeek.getPrecision(), is(Precision.DATE));

        lastWeek = RelativeDateTimeFormat.parse("t-1W");
        assertThat(lastWeek, is(expectedLastWeek));
        assertThat(lastWeek.getPrecision(), is(Precision.DATE));

        lastWeek = RelativeDateTimeFormat.parse("t-1w");
        assertThat(lastWeek, is(expectedLastWeek));
        assertThat(lastWeek.getPrecision(), is(Precision.DATE));
    }

    @Test
    public void testParseThreeWeeksHence() {
        PointInTime expected3WeeksHence = PointInTime.today().addWeeks(3);

        PointInTime threeWeeksHence = RelativeDateTimeFormat.parse("TODAY+3w");
        assertThat(threeWeeksHence, is(expected3WeeksHence));
        assertThat(threeWeeksHence.getPrecision(), is(Precision.DATE));

        threeWeeksHence = RelativeDateTimeFormat.parse("Today+3W");
        assertThat(threeWeeksHence, is(expected3WeeksHence));
        assertThat(threeWeeksHence.getPrecision(), is(Precision.DATE));

        threeWeeksHence = RelativeDateTimeFormat.parse("T+3W");
        assertThat(threeWeeksHence, is(expected3WeeksHence));
        assertThat(threeWeeksHence.getPrecision(), is(Precision.DATE));

        threeWeeksHence = RelativeDateTimeFormat.parse("t+3W");
        assertThat(threeWeeksHence, is(expected3WeeksHence));
        assertThat(threeWeeksHence.getPrecision(), is(Precision.DATE));

        threeWeeksHence = RelativeDateTimeFormat.parse("t+3w");
        assertThat(threeWeeksHence, is(expected3WeeksHence));
        assertThat(threeWeeksHence.getPrecision(), is(Precision.DATE));

        threeWeeksHence = RelativeDateTimeFormat.parse("+3w");
        assertThat(threeWeeksHence, is(expected3WeeksHence));
        assertThat(threeWeeksHence.getPrecision(), is(Precision.DATE));
    }

    @Test
    public void testParseNow() {
        PointInTime expectedNow = mockNow;

        PointInTime now = RelativeDateTimeFormat.parse("NOW");
        assertThat(now, is(expectedNow));
        assertThat(now.getPrecision(), is(Precision.MILLISECOND));

        now = RelativeDateTimeFormat.parse("Now");
        assertThat(now, is(expectedNow));
        assertThat(now.getPrecision(), is(Precision.MILLISECOND));
    }

    @Test
    public void testParseThreeMinutesFromNow() {
        PointInTime expectedThreeMinutesFromNow = mockNow.addMinutes(3);

        PointInTime threeMinutesFromNow = RelativeDateTimeFormat.parse("NOW+3'");
        assertThat(threeMinutesFromNow, is(expectedThreeMinutesFromNow));
        assertThat(threeMinutesFromNow.getPrecision(), is(Precision.MILLISECOND));

        threeMinutesFromNow = RelativeDateTimeFormat.parse("Now+3'");
        assertThat(threeMinutesFromNow, is(expectedThreeMinutesFromNow));
        assertThat(threeMinutesFromNow.getPrecision(), is(Precision.MILLISECOND));
    }

    @Test
    public void testParseAnHourFromNow() {
        PointInTime expectedHourFromNow = mockNow.addHours(1);

        PointInTime hourFromNow = RelativeDateTimeFormat.parse("NOW+1H");
        assertThat(hourFromNow, is(expectedHourFromNow));
        assertThat(hourFromNow.getPrecision(), is(Precision.MILLISECOND));

        hourFromNow = RelativeDateTimeFormat.parse("Now+1h");
        assertThat(hourFromNow, is(expectedHourFromNow));
        assertThat(hourFromNow.getPrecision(), is(Precision.MILLISECOND));
    }

    @Test
    public void testParse3DaysFromNow() {
        PointInTime expected3DaysFromNow = mockNow.addDays(3);

        PointInTime threeDaysFromNow = RelativeDateTimeFormat.parse("NOW+3D");
        assertThat(threeDaysFromNow, is(expected3DaysFromNow));
        assertThat(threeDaysFromNow.getPrecision(), is(Precision.MILLISECOND));

        threeDaysFromNow = RelativeDateTimeFormat.parse("Now+3d");
        assertThat(threeDaysFromNow, is(expected3DaysFromNow));
        assertThat(threeDaysFromNow.getPrecision(), is(Precision.MILLISECOND));
    }

    @Test
    public void testParse4MonthsFromNow() {
        PointInTime expected4MonthsFromNow = mockNow.addMonths(4);

        PointInTime fourMonthsFromNow = RelativeDateTimeFormat.parse("NOW+4M");
        assertThat(fourMonthsFromNow, is(expected4MonthsFromNow));
        assertThat(fourMonthsFromNow.getPrecision(), is(Precision.MILLISECOND));

        fourMonthsFromNow = RelativeDateTimeFormat.parse("Now+4m");
        assertThat(fourMonthsFromNow, is(expected4MonthsFromNow));
        assertThat(fourMonthsFromNow.getPrecision(), is(Precision.MILLISECOND));
    }

    @Test
    public void testParseMidnight() {
        PointInTime expectedMidnight = mockNow.toPointInTimeAtMidnight();

        PointInTime midnight = RelativeDateTimeFormat.parse("MID");
        assertThat(midnight, is(expectedMidnight));
        assertThat(midnight.getPrecision(), is(Precision.MILLISECOND));
    }

    @Test
    public void testParseNoon() {
        PointInTime expectedNoon = mockNow.toPointInTimeAtNoon();

        PointInTime noon = RelativeDateTimeFormat.parse("NOON");
        assertThat(noon, is(expectedNoon));
        assertThat(noon.getPrecision(), is(Precision.MILLISECOND));
    }
}
