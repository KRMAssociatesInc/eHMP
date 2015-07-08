package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.format.Printer;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides {@link PointInTime} printers that print in the MSCUI style.
 * <p/>
 * date
 * yyyy
 * MMM-yyyy
 * dd-MMM-yyyy
 * <p/>
 * dateTime
 * dd-MMM-yyyy HH-   (?)
 * dd-MMM-yyyy HH:mm
 * <p/>
 * year
 * yyyy
 * <p/>
 * time
 * HH:mm
 *
 * @see "http://www.mscui.net/DesignGuide/DateDisplay.aspx"
 */
public class MSCUIDateTimePrinterSet extends AbstractHealthTimePrinterSet {
    @Override
    protected Printer<PointInTime> createDateTimePrinter() {
        Map<Precision, DateTimeFormatter> formatters = new HashMap<Precision, DateTimeFormatter>();
        formatters.put(Precision.YEAR, PointInTimeFormat.year());
        formatters.put(Precision.MONTH, DateTimeFormat.forPattern("MMM-yyyy"));
        formatters.put(Precision.DATE, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        formatters.put(Precision.HOUR, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        formatters.put(Precision.MINUTE, DateTimeFormat.forPattern("dd-MMM-yyyy HH:mm"));
        formatters.put(Precision.SECOND, DateTimeFormat.forPattern("dd-MMM-yyyy HH:mm"));
        formatters.put(Precision.MILLISECOND, DateTimeFormat.forPattern("dd-MMM-yyyy HH:mm"));
        return new HealthTimePrinter(formatters);
    }

    @Override
    protected Printer<PointInTime> createDatePrinter() {
        Map<Precision, DateTimeFormatter> formatters = new HashMap<Precision, DateTimeFormatter>();
        formatters.put(Precision.YEAR, PointInTimeFormat.year());
        formatters.put(Precision.MONTH, DateTimeFormat.forPattern("MMM-yyyy"));
        formatters.put(Precision.DATE, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        formatters.put(Precision.HOUR, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        formatters.put(Precision.MINUTE, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        formatters.put(Precision.SECOND, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        formatters.put(Precision.MILLISECOND, DateTimeFormat.forPattern("dd-MMM-yyyy"));
        return new HealthTimePrinter(formatters);
    }

    @Override
    protected Printer<PointInTime> createYearPrinter() {
        return new HealthTimePrinter(PointInTimeFormat.year());
    }

    @Override
    protected Printer<PointInTime> createTimePrinter() {
        return new HealthTimePrinter(PointInTimeFormat.time());
    }
}
