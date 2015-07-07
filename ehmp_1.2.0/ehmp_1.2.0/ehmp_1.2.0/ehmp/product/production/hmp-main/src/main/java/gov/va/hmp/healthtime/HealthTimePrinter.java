package gov.va.hmp.healthtime;

import org.joda.time.format.DateTimeFormatter;
import org.springframework.format.Printer;
import org.springframework.format.datetime.joda.JodaTimeContextHolder;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Prints a PointInTime using a different {@link DateTimeFormatter} for each {@link Precision}
 */
public class HealthTimePrinter implements Printer<PointInTime> {

    private Map<Precision, DateTimeFormatter> formatters;

    public HealthTimePrinter(Map<Precision, DateTimeFormatter> formatters) {
        this.formatters = formatters;
    }

    public HealthTimePrinter(DateTimeFormatter formatter) {
        formatters = new HashMap<Precision, DateTimeFormatter>();
        for (Precision p : Precision.values()) {
            formatters.put(p, formatter);
        }
    }

    @Override
    public String print(PointInTime t, Locale locale) {
        if (t == null) return "";
        return JodaTimeContextHolder.getFormatter(forPrecision(t.getPrecision()), locale).print(t);
    }

    private DateTimeFormatter forPrecision(Precision precision) {
        return formatters.get(precision);
    }
}
