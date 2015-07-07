
package gov.va.hmp.web.converter.healthtime;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.core.convert.converter.Converter;

public class PointInTimeToStringConverter implements Converter<PointInTime, String> {

    public PointInTimeToStringConverter() {

    }

    public PointInTimeToStringConverter(String format) {
        this.format = format;
    }

    private String format = null;

    private static final String NA_VALUE = "";

    @Override
    public String convert(PointInTime source) {
        if (source == null) {
            return NA_VALUE;
        }
        DateTimeFormatter fmt = null;
        Precision p = source.getPrecision();
        if (format != null) {
            fmt = DateTimeFormat.forPattern(format);
        } else {
            switch (p) {
                case MILLISECOND:
                case SECOND:
                case MINUTE:
                    fmt = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm");
                    break;
                case HOUR:
                case DATE:
                    fmt = DateTimeFormat.forPattern("yyyy-MM-dd");
                    break;
                case MONTH:
                    fmt = DateTimeFormat.forPattern("yyyy-MM");
                    break;
                default:
                    fmt = DateTimeFormat.forPattern("yyyy");
            }
        }
        return fmt.print(source);
    }
}
