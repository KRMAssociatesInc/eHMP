package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.DateTimeFieldType;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;

/**
 * Class for parsing and formatting VPR dates.
 * <p/>
 * VPR dates are stored internally as SQL INTEGERs of the form "YYYYMMDD" where <ul> <li>YYYY is number of years since
 * the beginning of the Common Era (C.E.) (hence always 4 digits)</li> <li>MM is month number (00-12)</li> <li>DD is day
 * number (00-31)</li> </ul> <p>This format allows for representation of imprecise dates like JULY '78 or 1978 (which
 * would be equivalent to 19780700 and 19780000, respectively).  More precise times are stored internally in the VPR
 * utilizing the SQL TIMESTAMP type.</p>
 *
 * @deprecated
 */
@Deprecated
public class VPRDateTimeFormat {
    private static final int VPR_DATE_LENGTH = 8;

    protected VPRDateTimeFormat() {
        super();
    }

    private static DateTimeFormatter
            ye,  // year element (yyy)
            mye, // monthOfYear element (MM)
            dme, // dayOfMonth element (dd)
            d;

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


    public static PointInTimeFormatter pointInTimeParser() {
        if (ptp == null) {
            DateTimeFormatter f = new DateTimeFormatterBuilder()
                    .append(date())
                    .toFormatter();
            ptp = new PointInTimeFormatter(f.getPrinter(), f.getParser());
        }
        return ptp;
    }

    public static PointInTime parse(String text) {
        if (text == null) return null;
        if (text.isEmpty()) return null;
        if (text.length() != VPR_DATE_LENGTH) {
            throw new IllegalArgumentException(
                    "VPR date time '" + text + "' must be 8 characters long.");
        }
        return pointInTimeParser().parsePointInTime(text);
    }

    public static PointInTime toPointInTime(String text) {
        return parse(text);
    }

    private static DateTimeFormatter year() {
        if (ye == null) {
            ye = new DateTimeFormatterBuilder().appendYear(4, 4).toFormatter();
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

    private static DateTimeFormatter element(DateTimeFieldType type, Character fillChar) {
        ZeroableTwoDigitNumber twoDigitNumber = new ZeroableTwoDigitNumber(type, fillChar);
        return new DateTimeFormatter(twoDigitNumber, twoDigitNumber);
    }
}
