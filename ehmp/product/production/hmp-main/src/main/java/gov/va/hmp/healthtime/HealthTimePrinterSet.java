package gov.va.hmp.healthtime;

import org.springframework.format.Printer;

public interface HealthTimePrinterSet {
    Printer<PointInTime> dateTime();

    Printer<PointInTime> date();

    Printer<PointInTime> year();

    Printer<PointInTime> time();
}
