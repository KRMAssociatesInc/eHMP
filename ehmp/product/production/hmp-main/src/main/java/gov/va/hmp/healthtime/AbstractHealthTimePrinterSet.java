package gov.va.hmp.healthtime;

import org.springframework.format.Printer;

import java.io.Serializable;

public abstract class AbstractHealthTimePrinterSet implements HealthTimePrinterSet, Serializable {

    private static final long serialVersionUID = -6245634323903332719L;

    private transient Printer<PointInTime> d;
    private transient Printer<PointInTime> dt;
    private transient Printer<PointInTime> t;
    private transient Printer<PointInTime> y;

    @Override
    public final Printer<PointInTime> dateTime() {
        if (dt == null) {
            dt = createDateTimePrinter();
        }
        return dt;
    }

    @Override
    public final Printer<PointInTime> date() {
        if (d == null) {
            d = createDatePrinter();
        }
        return d;
    }

    @Override
    public Printer<PointInTime> year() {
        if (y == null) {
            y = createYearPrinter();
        }
        return y;
    }

    @Override
    public final Printer<PointInTime> time() {
        if (t == null) {
            t = createTimePrinter();
        }
        return t;
    }

    protected abstract Printer<PointInTime> createDateTimePrinter();
    protected abstract Printer<PointInTime> createDatePrinter();
    protected abstract Printer<PointInTime> createYearPrinter();
    protected abstract Printer<PointInTime> createTimePrinter();
}
