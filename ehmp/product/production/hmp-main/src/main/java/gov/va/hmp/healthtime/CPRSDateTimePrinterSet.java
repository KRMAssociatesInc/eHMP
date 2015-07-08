package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.format.Printer;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides {@link PointInTime} printers that print in the style of CPRS.
 * <p/>
 * date
 * yyyy
 * MMM yy
 * MMM dd,yy
 * <p/>
 * dateTime
 * MMM dd,yy HH-   (?)
 * MMM dd,yy HH:mm
 * <p/>
 * year
 * yyyy
 * <p/>
 * time
 * HH:mm
 */
public class CPRSDateTimePrinterSet extends AbstractHealthTimePrinterSet {

    @Override
    protected Printer<PointInTime> createDateTimePrinter() {
        Map<Precision, DateTimeFormatter> formatters = new HashMap<Precision, DateTimeFormatter>();
        formatters.put(Precision.YEAR, PointInTimeFormat.year());
        formatters.put(Precision.MONTH, PointInTimeFormat.monthAndYear());
        formatters.put(Precision.DATE, PointInTimeFormat.date());
        formatters.put(Precision.HOUR, PointInTimeFormat.date());
        formatters.put(Precision.MINUTE, PointInTimeFormat.dateTime());
        formatters.put(Precision.SECOND, PointInTimeFormat.dateTime());
        formatters.put(Precision.MILLISECOND, PointInTimeFormat.dateTime());
        return new HealthTimePrinter(formatters);
    }

    @Override
    protected Printer<PointInTime> createDatePrinter() {
        Map<Precision, DateTimeFormatter> formatters = new HashMap<Precision, DateTimeFormatter>();
        formatters.put(Precision.YEAR, PointInTimeFormat.year());
        formatters.put(Precision.MONTH, PointInTimeFormat.monthAndYear());
        formatters.put(Precision.DATE, PointInTimeFormat.date());
        formatters.put(Precision.HOUR, PointInTimeFormat.date());
        formatters.put(Precision.MINUTE, PointInTimeFormat.date());
        formatters.put(Precision.SECOND, PointInTimeFormat.date());
        formatters.put(Precision.MILLISECOND, PointInTimeFormat.date());
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
