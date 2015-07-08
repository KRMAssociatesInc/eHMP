package gov.va.hmp.web.converter.healthtime;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.core.convert.converter.Converter;

public class StringToPointInTimeConverter implements Converter<String, PointInTime> {
    @Override
    public PointInTime convert(String s) {
        return HL7DateTimeFormat.parse(s);
    }
}
