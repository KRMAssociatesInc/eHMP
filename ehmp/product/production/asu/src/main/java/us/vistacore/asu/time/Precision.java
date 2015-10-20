package us.vistacore.asu.time;

import org.joda.time.DateTimeFieldType;


public enum Precision {
    YEAR,
    MONTH,
    DATE,
    HOUR,
    MINUTE,
    SECOND,
    MILLISECOND;

    @Override
    public String toString() {
        return super.toString().toLowerCase();
    }

    public boolean lessThan(Precision p) {
        return compareTo(p) < 0;
    }

    public boolean lessThanOrEquals(Precision p) {
        return compareTo(p) <= 0;
    }

    public boolean greaterThan(Precision p) {
        return compareTo(p) > 0;
    }

    public boolean greaterThanOrEquals(Precision p) {
        return compareTo(p) >= 0;
    }

    public DateTimeFieldType[] toFieldTypes() {
        return toFieldTypes(this);
    }

    public static Precision lesser(Precision p1, Precision p2) {
        if (p2.lessThan(p1)) {
            return p2;
        }
        return p1;
    }

    public static Precision greater(Precision p1, Precision p2) {
        if (p2.greaterThan(p1)) {
            return p2;
        }
        return p1;
    }

    public static DateTimeFieldType[] toFieldTypes(Precision p) {
        switch (p) {
            case MILLISECOND:
                return new DateTimeFieldType[]{DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                        DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay(),
                        DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute(),
                        DateTimeFieldType.millisOfSecond()};
            case SECOND:
                return new DateTimeFieldType[]{DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                        DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay(),
                        DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute()};
            case MINUTE:
                return new DateTimeFieldType[]{DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                        DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay(),
                        DateTimeFieldType.minuteOfHour()};
            case HOUR:
                return new DateTimeFieldType[]{DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                        DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay()};
            case DATE:
                return new DateTimeFieldType[]{DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(),
                        DateTimeFieldType.dayOfMonth()};
            case MONTH:
                return new DateTimeFieldType[]{DateTimeFieldType.year(), DateTimeFieldType.monthOfYear()};
            case YEAR:
            default:
                return new DateTimeFieldType[]{DateTimeFieldType.year()};
        }
    }


}
