package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import org.joda.time.*;
import org.joda.time.format.*;

import java.io.IOException;
import java.io.Writer;
import java.util.Arrays;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Class for parsing and formatting VA FileMan Dates and Date/Times. <p/> FileMan stores dates and date/times of the
 * form "YYYMMDD.HHMMSS", where: <ul> <li>YYY is number of years since 1700 (hence always 3 digits)</li> <li>MM is month
 * number (00-12)</li> <li>DD is day number (00-31)</li> <li>HH is hour number (00-23)</li> <li>MM is minute number
 * (01-59)</li> <li>SS is the seconds number (01-59)</li> </ul> <p>This format allows for representation of imprecise
 * dates like JULY '78 or 1978 (which would be equivalent to 2780700 and 2780000, respectively). Dates are always
 * returned as a canonic number (no trailing zeroes after the decimal).  This implies that if there are any digits after
 * the decimal we are dealing with an implicitly precise date/time with millisecond precision.</p>
 */
public class FileManDateTimeFormat {

    private static final int MIN_FILE_MAN_DATE_LENGTH = 7;
    private static final int MAX_FILE_MAN_DATE_LENGTH = 14;
    private static final Pattern FILE_MAN_DATE_PATTERN = Pattern.compile("\\d{7}(\\.\\d{1,6})?");
    private static final int YEARS_PER_CENTURY = 100;
    private static final int BASE_CENTURY = 17;

    protected FileManDateTimeFormat() {
        super();
    }

    private static DateTimeFormatter
            ye,  // year element (yyy)
            mye, // monthOfYear element (MM)
            dme, // dayOfMonth element (dd)
            lde, // literal dot element (.)
            lhe, // literal dot and hour element (.HH)
            d,
            t,
            dt;

    private static PointInTimeFormatter ptp; // point in time parser

    public static DateTimeFormatter date() {
        if (d == null) {
            d = new DateTimeFormatterBuilder()
                    .append(year())
                    .append(monthOfYear())
                    .append(dayOfMonth())
                    .toFormatter();
        }
        return d;
    }

    public static DateTimeFormatter time() {
        if (t == null) {
            t = new DateTimeFormatterBuilder()
                    .append(element(DateTimeFieldType.hourOfDay(), null))
                    .append(element(DateTimeFieldType.minuteOfHour(), null))
                    .append(element(DateTimeFieldType.secondOfMinute(), null))
                    .toFormatter();
        }
        return t;
    }


    /**
     * Returns a formatter that combines a full date and time, separated by a '.' (yyyMMdd.HHmmss)
     *
     * @return a formatter for yyyMMdd.HHmmss
     */
    public static DateTimeFormatter dateTime() {
        if (dt == null) {
            dt = new DateTimeFormatterBuilder()
                    .append(date())
                    .append(dot())
                    .append(time())
                    .toFormatter();
        }
        return dt;
    }

    public static PointInTimeFormatter pointInTimeParser() {
        if (ptp == null) {
            DateTimeFormatter f = new DateTimeFormatterBuilder()
                    .append(date())
                    .appendOptional(dotHour())
                    .appendOptional(parser(DateTimeFieldType.minuteOfHour()))
                    .appendOptional(parser(DateTimeFieldType.secondOfMinute()))
                    .toFormatter();
            ptp = new PointInTimeFormatter(f.getPrinter(), f.getParser());
        }
        return ptp;
    }

    private static DateTimeParser dotHour() {
        if (lhe == null) {
            lhe = new DateTimeFormatterBuilder()
                    .append(dot())
                    .append(element(DateTimeFieldType.hourOfDay(), null))
                    .toFormatter();
        }
        return lhe.getParser();

    }

    private static ParseUtils.CharacterLiteral dotLiteral() {
        return new ParseUtils.CharacterLiteral('.', Arrays.asList(new DateTimeFieldType[]{DateTimeFieldType.hourOfDay(),
                DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute()}));
    }

    private static DateTimeFormatter year() {
        if (ye == null) {
            ThreeDigitYear threeDigitYear = new ThreeDigitYear();
            ye = new DateTimeFormatter(threeDigitYear, threeDigitYear);
        }
        return ye;
    }

    private static DateTimeFormatter monthOfYear() {
        if (mye == null) {
            mye = element(DateTimeFieldType.monthOfYear(), '0');
        }
        return mye;
    }

    private static DateTimeFormatter dayOfMonth() {
        if (dme == null) {
            dme = element(DateTimeFieldType.dayOfMonth(), '0');
        }
        return dme;
    }

    private static DateTimeFormatter dot() {
        if (lde == null) {
            ParseUtils.CharacterLiteral dot =
                    dotLiteral();
            lde = new DateTimeFormatter(dot, dot);
        }
        return lde;
    }

    private static DateTimeParser parser(DateTimeFieldType type) {
        return new ZeroableTwoDigitNumber(type, null);
    }

    private static DateTimeFormatter element(DateTimeFieldType type, Character fillChar) {
        ZeroableTwoDigitNumber twoDigitNumber = new ZeroableTwoDigitNumber(type, fillChar);
        return new DateTimeFormatter(twoDigitNumber, twoDigitNumber);
    }

    static class ThreeDigitYear implements DateTimePrinter, DateTimeParser {

        public int estimatePrintedLength() {
            return 3;
        }

        public void printTo(StringBuffer buf, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) {
            int year = getThreeDigitYear(instant, chrono);
            if (year < 0) {
                buf.append('\ufffd');
                buf.append('\ufffd');
            } else {
                FormatUtils.appendPaddedInteger(buf, year, 3);
            }
        }

        public void printTo(Writer out, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) throws
                IOException {
            int year = getThreeDigitYear(instant, chrono);
            if (year < 0) {
                out.write('\ufffd');
                out.write('\ufffd');
            } else {
                FormatUtils.writePaddedInteger(out, year, 3);
            }
        }

        public void printTo(StringBuffer buf, ReadablePartial partial, Locale locale) {
            int year = getThreeDigitYear(partial);
            if (year < 0) {
                buf.append('\ufffd');
                buf.append('\ufffd');
            } else {
                FormatUtils.appendPaddedInteger(buf, year, 3);
            }
        }

        public void printTo(Writer out, ReadablePartial partial, Locale locale) throws IOException {
            int year = getThreeDigitYear(partial);
            if (year < 0) {
                out.write('\ufffd');
                out.write('\ufffd');
            } else {
                FormatUtils.writePaddedInteger(out, year, 3);
            }
        }

        private int getThreeDigitYear(long instant, Chronology chrono) {
            try {
                int year = DateTimeFieldType.year().getField(chrono).get(instant);
                if (year < 0) {
                    year = -year;
                }
                int century = year / YEARS_PER_CENTURY;
                century -= BASE_CENTURY;
                century *= YEARS_PER_CENTURY;
                return century + (year % YEARS_PER_CENTURY);
            } catch (RuntimeException e) {
                return -1;
            }
        }

        private int getThreeDigitYear(ReadablePartial partial) {
            if (partial.isSupported(DateTimeFieldType.year())) {
                try {
                    int year = partial.get(DateTimeFieldType.year());
                    if (year < 0) {
                        year = -year;
                    }
                    int century = year / YEARS_PER_CENTURY;
                    return (century - BASE_CENTURY) * YEARS_PER_CENTURY + year % YEARS_PER_CENTURY;
                } catch (RuntimeException e) {
                }
            }
            return -1;
        }

        public int estimateParsedLength() {
            return 3;
        }

        public int parseInto(DateTimeParserBucket bucket, String text, int position) {
            int years = Integer.parseInt(text.substring(position, position + 3)) + BASE_CENTURY * YEARS_PER_CENTURY;
            bucket.saveField(DateTimeFieldType.year(), years);
            return position + 3;
        }
    }

    public static PointInTime parse(String text) {
        if (text == null) return null;
        if (text.isEmpty()) return null;

        Matcher fileManMatcher = FILE_MAN_DATE_PATTERN.matcher(text);
        if (!fileManMatcher.matches()) {
            try {
                // try this out as a relative date time expression if it doesn't match FileMan pattern
                PointInTime t = RelativeDateTimeFormat.parse(text);
                return t;
            } catch (IllegalArgumentException relativeParseException) {
                // NOOP
            }
            throw new IllegalArgumentException("'" + text + "' is not a recognized FileMan date/time pattern");
        }
//        IllegalArgumentException e = null;  // TODO: consider doing regex pattern here instead
//        if (text.length() < MIN_FILE_MAN_DATE_LENGTH || text.length() > MAX_FILE_MAN_DATE_LENGTH) {
//            e = new IllegalArgumentException(
//                    "FileMan date time '" + text + "' is not between " + MIN_FILE_MAN_DATE_LENGTH + " and " + MAX_FILE_MAN_DATE_LENGTH + " characters in length.");
//        }
//        if (text.length() == 8) {
//            e = new IllegalArgumentException(
//                    "FileMan date time '" + text + "' cannot be 8 characters long.");
//        }
//        if (e != null) {
//            try {
//                // try this out as a relative date time expression if it doesn't match FileMan pattern
//                PointInTime t = RelativeDateTimeFormat.parse(text);
//                return t;
//            } catch (IllegalArgumentException relativeParseException) {
//                // NOOP
//            }
//            throw e;
//        }

        if (isMidnight(text)) {
            return convertMidnightToOneMillisecondBefore(text);
        }
        PointInTime t = pointInTimeParser().parsePointInTime(text);
        if (t.getPrecision().greaterThanOrEquals(Precision.HOUR))
            t = t.promote().getLow();
        return t;
    }

    private static PointInTime convertMidnightToOneMillisecondBefore(String text) {
        int dot = text.indexOf('.');
        text = text.substring(0, dot);
        return parse(text).toPointInTimeAtMidnight().subtractMilliseconds(1);
    }

    private static boolean isMidnight(String text) {
        return text.contains(".24");
    }

    public static PointInTime toPointInTime(String text) {
        return parse(text);
    }

    public static PointInTime parsePointInTime(String text) {
        return parse(text);
    }

    public static LocalDateTime parseLocalDateTime(String text) {
        PointInTime t = parse(text);
        if (t == null) return null;
        return t.toLocalDateTime();
    }
}

