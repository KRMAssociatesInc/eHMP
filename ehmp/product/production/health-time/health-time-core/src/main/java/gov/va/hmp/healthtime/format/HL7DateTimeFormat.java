package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import org.joda.time.DateTimeFieldType;
import org.joda.time.LocalDateTime;
import org.joda.time.Period;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.joda.time.format.DateTimeParser;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <p>DateTime format for HL7 timestamp: YYYY[MM[DD[HHMM[SS[.S[S[S[S]]]]]]]][+/-ZZZZ] <p/> <p>In the current and future
 * versions of HL7, the precision is indicated by limiting the number of digits used. Thus, YYYY is used to specify a
 * precision of "year," YYYYMM specifies a precision of "month," YYYYMMDD specifies a precision of "day," YYYYMMDDHH is
 * used to specify a precision of "hour," YYYYMMDDHHMM is used to specify a precision of "minute," YYYYMMDDHHMMSS is
 * used to specify a precision of seconds, and YYYYMMDDHHMMSS.SSSS is used to specify a precision of ten thousandths of
 * a second. In each of these cases, the time zone is an optional component. Maximum length of the time stamp is 26
 * characters. </p> <p/> <p>Examples: <samp> |19760704010159-0600| 1:01:59 on July 4, 1976 in the Eastern Standard Time
 * zone. |19760704010159-0500| 1:01:59 on July 4, 1976 in the Eastern Daylight Saving Time zone. |198807050000| Midnight
 * of the night extending from July 4 to July 5, 1988 in the local time zone of the sender. |19880705|    Same as prior
 * example, but precision extends only to the day.  Could be used for a birthdate, if the time of birth is unknown.
 * </samp> </p>
 */
public class HL7DateTimeFormat {
    static final String HL7_DATETIME_PATTERN = "\\d{4,14}(\\.\\d{1,3})?";
    static final String TIME_ZONE_OFFSET_PATTERN = "((\\-|\\+)\\d{4})?";
    static final Pattern HL7_PATTERN = Pattern.compile(HL7_DATETIME_PATTERN + TIME_ZONE_OFFSET_PATTERN);
    static final Pattern HL7_AND_PERIOD_PATTERN = Pattern.compile("(" + HL7_DATETIME_PATTERN + ")(\\-|\\+)(" + PeriodParser.PERIOD_PATTERN + ")?");

    private static DateTimeFormatter hl7;

    private static PointInTimeFormatter ptp;

    protected HL7DateTimeFormat() {
        super();
    }

    public static DateTimeFormatter dateTime() {
        if (hl7 == null) {
            hl7 = new DateTimeFormatterBuilder()
                    .appendYear(4, 4)
                    .appendMonthOfYear(2)
                    .appendDayOfMonth(2)
                    .appendHourOfDay(2)
                    .appendMinuteOfHour(2)
                    .appendSecondOfMinute(2)
                    .appendLiteral('.')
                    .appendMillisOfSecond(3)
                    .appendTimeZoneOffset(null, false, 2, 2)
                    .toFormatter();
        }
        return hl7;
    }

    public static DateTimeFormatter forPointInTime(PointInTime t) {
        return forPrecision(t.getPrecision());
    }

    public static DateTimeFormatter forPrecision(Precision p) {
        switch (p) {
            case MILLISECOND:
                return dateTime();
            case SECOND:
                return PointInTimeFormat.forPattern("yyyyMMddHHmmss");
            case MINUTE:
                return PointInTimeFormat.forPattern("yyyyMMddHHmm");
            case HOUR:
                return PointInTimeFormat.forPattern("yyyyMMddHH");
            case DATE:
                return PointInTimeFormat.forPattern("yyyyMMdd");
            case MONTH:
                return PointInTimeFormat.forPattern("yyyyMM");
            default:
                return PointInTimeFormat.forPattern("yyyy");
        }
    }

    public static PointInTimeFormatter pointInTimeParser() {
        if (ptp == null) {
            DateTimeFormatter f = new DateTimeFormatterBuilder()
                    .appendYear(4, 4)
                    .appendOptional(twoDigitNumber(DateTimeFieldType.monthOfYear()))
                    .appendOptional(twoDigitNumber(DateTimeFieldType.dayOfMonth()))
                    .appendOptional(twoDigitNumber(DateTimeFieldType.hourOfDay()))
                    .appendOptional(twoDigitNumber(DateTimeFieldType.minuteOfHour()))
                    .appendOptional(twoDigitNumber(DateTimeFieldType.secondOfMinute()))
                    .appendOptional(dotMilliseconds())
                    .toFormatter();
            ptp = new PointInTimeFormatter(f.getPrinter(), f.getParser());
        }
        return ptp;
    }

    public static PointInTime parse(String text) {
        if (text == null) return null;
        if (text.isEmpty()) return null;

        Matcher hl7Matcher = HL7_PATTERN.matcher(text);
        if (!hl7Matcher.matches()) {
            try {
                // try this out as a relative date time expression if it doesn't match HL7 pattern
                PointInTime t = RelativeDateTimeFormat.parse(text);
                return t;
            } catch (IllegalArgumentException relativeParseException) {
                // NOOP
            }
            // try as an HL7 datetime and a period (maybe move this elsewhere?)
            Matcher hl7AndPeriodMatcher = HL7_AND_PERIOD_PATTERN.matcher(text);
            if (hl7AndPeriodMatcher.matches()) {
                String hl7DateStr = hl7AndPeriodMatcher.group(1);
                String operator = hl7AndPeriodMatcher.group(3);
                String periodStr = hl7AndPeriodMatcher.group(4);
                PointInTime t = HL7DateTimeFormat.parse(hl7DateStr);
                Period p = RelativeDateTimeFormat.getPeriodFormatter().parsePeriod(periodStr);
                if (operator.equals(RelativeDateTimeFormat.MINUS)) {
                    t = t.subtract(p);
                } else if (operator.equals(RelativeDateTimeFormat.PLUS)) {
                    t = t.add(p);
                }
                return t;
            }
            throw new IllegalArgumentException("'" + text + "' is not a recognized HL7 date time pattern");
        }

        return pointInTimeParser().parsePointInTime(text);
    }

    public static PointInTime toPointInTime(String text) {
        return parse(text);
    }

    private static DateTimeParser twoDigitNumber(DateTimeFieldType fieldType) {
        return new TwoDigitNumber(fieldType);
    }

    private static DateTimeParser dotMilliseconds() {
        return new DateTimeFormatterBuilder().appendLiteral('.').appendMillisOfSecond(3).toParser();
    }

    public static LocalDateTime toLocalDateTime(String text) {
        return toPointInTime(text).toLocalDateTime();
    }
}
