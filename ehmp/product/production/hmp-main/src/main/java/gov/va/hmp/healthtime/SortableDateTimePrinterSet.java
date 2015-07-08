package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.format.Printer;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides {@link PointInTime} printers that print in the 'sortable' style.
 * <p/>
 * date
 * yyyy
 * yyyy-MM-dd
 * yyyy-MM-dd
 * <p/>
 * dateTime
 * yyyy-MM-dd HH-   (?)
 * yyyy-MM-dd HH:mm
 * <p/>
 * year
 * yyyy
 * <p/>
 * time
 * HH:mm
 */
public class SortableDateTimePrinterSet extends AbstractHealthTimePrinterSet {

    public static final String DEFAULT_HMP_DATE_PATTERN = "yyyy-MM-dd";
    public static final String DEFAULT_HMP_DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm";

    @Override
    protected Printer<PointInTime> createDateTimePrinter() {
        final DateTimeFormatter d = PointInTimeFormat.forPattern(DEFAULT_HMP_DATE_PATTERN);
        final DateTimeFormatter dt = PointInTimeFormat.forPattern(DEFAULT_HMP_DATE_TIME_PATTERN);

        Map<Precision, DateTimeFormatter> formatters = new HashMap<Precision, DateTimeFormatter>();
        formatters.put(Precision.YEAR, PointInTimeFormat.forPattern("yyyy"));
        formatters.put(Precision.MONTH, PointInTimeFormat.forPattern("yyyy-MM"));
        formatters.put(Precision.DATE, d);
        formatters.put(Precision.HOUR, d);
        formatters.put(Precision.MINUTE, dt);
        formatters.put(Precision.SECOND, dt);
        formatters.put(Precision.MILLISECOND, dt);
        return new HealthTimePrinter(formatters);
    }

    @Override
    protected Printer<PointInTime> createDatePrinter() {
        final DateTimeFormatter d = PointInTimeFormat.forPattern(DEFAULT_HMP_DATE_PATTERN);

        Map<Precision, DateTimeFormatter> formatters = new HashMap<Precision, DateTimeFormatter>();
        formatters.put(Precision.YEAR, PointInTimeFormat.forPattern("yyyy"));
        formatters.put(Precision.MONTH, PointInTimeFormat.forPattern("yyyy-MM"));
        formatters.put(Precision.DATE, d);
        formatters.put(Precision.HOUR, d);
        formatters.put(Precision.MINUTE, d);
        formatters.put(Precision.SECOND, d);
        formatters.put(Precision.MILLISECOND, d);
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
