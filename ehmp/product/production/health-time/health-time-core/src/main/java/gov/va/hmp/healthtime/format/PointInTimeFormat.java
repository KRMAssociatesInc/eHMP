package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class PointInTimeFormat {

    private static final String DEFAULT_DATE_PATTERN = "MMM dd,yy";
    private static final String DEFAULT_DATE_TIME_PATTERN = "MMM dd,yy HH:mm";
    private static final String DEFAULT_TIME_PATTERN = "HH:mm";

    protected PointInTimeFormat() {
        super();
    }

    private static DateTimeFormatter
            ye, // year element
            yme,
            d,
            dt,
            t;

    public static DateTimeFormatter forPattern(String pattern) {
        return DateTimeFormat.forPattern(pattern);
    }

    public static DateTimeFormatter date() {
        if (d == null) {
            d = forPattern(DEFAULT_DATE_PATTERN);
        }
        return d;
    }

    public static DateTimeFormatter dateTime() {
        if (dt == null) {
            dt = forPattern(DEFAULT_DATE_TIME_PATTERN);
        }
        return dt;
    }

    public static DateTimeFormatter time() {
        if (t == null) {
            t = forPattern(DEFAULT_TIME_PATTERN);
        }
        return t;
    }

    public static DateTimeFormatter year() {
        if (ye == null) {
            ye = forPattern("yyyy");
        }
        return ye;
    }

    public static DateTimeFormatter monthAndYear() {
        if (yme == null) {
            yme = forPattern("MMM yyyy");
        }
        return yme;
    }

    public static DateTimeFormatter forPointInTime(PointInTime t) {
        return forPrecision(t.getPrecision());
    }

    public static DateTimeFormatter forPrecision(Precision p) {
        switch (p) {
            case MILLISECOND:
                return dateTime();
            case SECOND:
                return dateTime();
            case MINUTE:
                return dateTime();
            case HOUR:
                return date();
            case DATE:
                return date();
            case MONTH:
                return monthAndYear();
            default:
                return year();
        }
    }
}