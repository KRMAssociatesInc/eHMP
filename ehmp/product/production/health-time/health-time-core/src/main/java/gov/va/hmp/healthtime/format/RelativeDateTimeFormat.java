package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.Period;
import org.joda.time.format.PeriodFormatter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static gov.va.hmp.healthtime.format.PeriodParser.PERIOD_PATTERN;

public class RelativeDateTimeFormat {

    public static final Pattern TODAY_PATTERN = Pattern.compile("[Tt]([Oo][Dd][Aa][Yy])?");
    public static final Pattern NOW_PATTERN = Pattern.compile("[Nn][Oo][Ww]");
    public static final Pattern MIDNIGHT_PATTERN = Pattern.compile("[Mm][Ii][Dd]");
    public static final Pattern NOON_PATTERN = Pattern.compile("[Nn][Oo][Oo][Nn]");
    public static final Pattern RELATIVE_DATETIME_PATTERN = Pattern.compile("(" + TODAY_PATTERN + "|" + NOW_PATTERN + "|" + MIDNIGHT_PATTERN + "|" + NOON_PATTERN + ")?((\\+|\\-)(" + PERIOD_PATTERN + "))?");
    public static final String MINUS = "-";
    public static final String PLUS = "+";

    private static PeriodFormatter periodFormatter;

    public static PeriodFormatter getPeriodFormatter() {
        if (periodFormatter == null) {
            periodFormatter = new PeriodFormatter(null, new PeriodParser());
        }
        return periodFormatter;
    }

    public static PointInTime parse(String text) {
        if (text == null) return null;
        if (text.length() == 0) return null;

        Matcher m = RELATIVE_DATETIME_PATTERN.matcher(text);
        if (!m.matches()) {
            throw new IllegalArgumentException("'" + text + "' is not a recognizable relative date/time pattern");
        }
        String todayOrNowOrNoonOrMidnight = m.group(1);
        PointInTime t = null;
        if (todayOrNowOrNoonOrMidnight == null || todayOrNowOrNoonOrMidnight.startsWith("T") || todayOrNowOrNoonOrMidnight.startsWith("t")) {
            t = PointInTime.today();
        } else if (todayOrNowOrNoonOrMidnight.startsWith("N") || todayOrNowOrNoonOrMidnight.startsWith("n")) {
            if (todayOrNowOrNoonOrMidnight.endsWith("N") || todayOrNowOrNoonOrMidnight.endsWith("n")) {
                t = PointInTime.now().toPointInTimeAtNoon();
            } else {
                t = PointInTime.now();
            }
        } else if (todayOrNowOrNoonOrMidnight.equalsIgnoreCase("MID")) {
            t = PointInTime.now().toPointInTimeAtMidnight();
        }
        if (t == null) throw new IllegalArgumentException();

        String operator = m.group(4);

        String periodStr = m.group(5);
        Period period = hasLength(periodStr) ? getPeriodFormatter().parsePeriod(periodStr) : null;

        if (hasLength(operator) && period != null) {
            if (operator.equals(MINUS)) {
                t = t.subtract(period);
            } else if (operator.equals(PLUS)) {
                t = t.add(period);
            }
        }

        return t;
    }

    private static boolean hasLength(String s) {
        return s != null && s.length() > 0;
    }
}
