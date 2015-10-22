package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

/**
 * Class for parsing and formatting MDWS Dates and Date/Times.
 * <p/>
 * MDWS date/times are a variation on VA FileMan date/times that use a 4 digit year instead of a 3 digit year, formatted
 * like "YYYMMDD.HHMMSS".  This means MDWS dates look like HL7 dates, but for date/times, MDWS includes the FileMan style
 * '.' character, which HL7 date/times do not.
 */
public class MdwsDateTimeFormat {

    private static DateTimeFormatter dt;

    public static DateTimeFormatter dateTime() {
        if (dt == null)
            dt = DateTimeFormat.forPattern("yyyyMMdd.HHmmss");
        return dt;
    }

    public static DateTimeFormatter forPointInTime(PointInTime t) {
        return forPrecision(t.getPrecision());
    }

    public static DateTimeFormatter forPrecision(Precision p) {
        switch (p) {
            case MILLISECOND:
                return dateTime();
            case SECOND:
                return PointInTimeFormat.forPattern("yyyyMMdd.HHmmss");
            case MINUTE:
                return PointInTimeFormat.forPattern("yyyyMMdd.HHmm");
            case HOUR:
                return PointInTimeFormat.forPattern("yyyyMMdd.HH");
            case DATE:
                return PointInTimeFormat.forPattern("yyyyMMdd");
            case MONTH:
                return PointInTimeFormat.forPattern("yyyyMM");
            default:
                return PointInTimeFormat.forPattern("yyyy");
        }
    }

    public static PointInTime parse(String text) {
        if (text == null || text.length() == 0) return null;
        String yearStr = text.substring(0, 4);
        int year = Integer.parseInt(yearStr);
        year -= 1700;

        String filemanHourStr = text.substring(text.indexOf(".") + 1, text.length());
        if (filemanHourStr.equals("240000")) filemanHourStr = "235959";
        String filemanDate = Integer.toString(year) + text.substring(4, 9) + filemanHourStr;
        return FileManDateTimeFormat.parse(filemanDate);
    }

}
