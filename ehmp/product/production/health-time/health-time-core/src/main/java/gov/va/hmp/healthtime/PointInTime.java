package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.joda.time.*;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Class supporting the HL7 time stamp (TS) data type.
 * <p/>
 * Format: YYYY[MM[DD[HHMM[SS[.S[S[S[S]]]]]]]][+/-ZZZZ]^<degree of precision>
 * <p/>
 * Contains the exact time of an event, including the date and time. The date portion of a time stamp follows the rules
 * of a date field and the time portion follows the rules of a time field. The specific data representations used in the
 * HL7 encoding rules are compatible with ISO 8824-1987(E).
 * <p/>
 * In prior versions of HL7, an optional second component indicates the degree of precision of the time stamp (Y = year,
 * L = month, D = day, H = hour, M = minute, S = second). This optional second component is retained only for purposes
 * of backward compatibility.
 * <p/>
 * By site-specific agreement, YYYY[MM[DD[HHMM[SS[.S[S[S[S]]]]]]]][+/-ZZZZ]^<degree of precision> may be used where
 * backward compatibility must be maintained.
 * <p/>
 * In the current and future versions of HL7, the precision is indicated by limiting the number of digits used, unless
 * the optional second component is present. Thus, YYYY is used to specify a precision of "year," YYYYMM specifies a
 * precision of "month," YYYYMMDD specifies a precision of "day," YYYYMMDDHH is used to specify a precision of "hour,"
 * YYYYMMDDHHMM is used to specify a precision of "minute," YYYYMMDDHHMMSS is used to specify a precision of seconds,
 * and YYYYMMDDHHMMSS.SSSS is used to specify a precision of ten thousandths of a second. In each of these cases, the
 * time zone is an optional component. Maximum length of the time stamp is 26. Examples:
 * <p/>
 * <samp> |19760704010159-0600| 1:01:59 on July 4, 1976 in the Eastern Standard Time zone.
 * <p/>
 * |19760704010159-0500| 1:01:59 on July 4, 1976 in the Eastern Daylight Saving Time zone.
 * <p/>
 * |198807050000|   Midnight of the night extending from July 4 to July 5, 1988 in the local time zone of the sender.
 * <p/>
 * |19880705|    Same as prior example, but precision extends only to the day.  Could be used for a birthdate, if the
 * time of birth is unknown. </samp>
 * <p/>
 * The HL7 Standard strongly recommends that all systems routinely send the time zone offset but does not require it.
 * All HL7 systems are required to accept the time zone offset, but its implementation is application specific. For many
 * applications the time of interest is the local time of the sender. For example, an application in the Eastern
 * Standard Time zone receiving notification of an admission that takes place at 11:00 PM in San Francisco on December
 * 11 would prefer to treat the admission as having occurred on December 11 rather than advancing the date to December
 * 12.
 * <p/>
 * One exception to this rule would be a clinical system that processed patient data collected in a clinic and a nearby
 * hospital that happens to be in a different time zone. Such applications may choose to convert the data to a common
 * representation. Similar concerns apply to the transitions to and from daylight saving time. HL7 supports such
 * requirements by requiring that the time zone information be present when the information is sent. It does not,
 * however, specify which of the treatments discussed here will be applied by the receiving system. </p> <p>FIXME:
 * PointInTime's should be immutable once created...  Remove public "set<>" methods.</p> <p>FIXME: Default constructor
 * that uses local VM's Date.now() as opposed to some kind of "server time" might cause nasty bugs...  Consider making
 * package private.</p>
 */
public final class PointInTime implements ReadablePartial, Serializable, Cloneable {

    private static AtomicReference<NowStrategy> nowStrategy = new AtomicReference<NowStrategy>(new DefaultNowStrategy());

    private static PointInTime lessPrecise(PointInTime t1, PointInTime t2) {
        if (t2.getPrecision().lessThan(t1.getPrecision()))
            return t2;
        return t1;
    }

    private static PointInTime mostPrecise(PointInTime t1, PointInTime t2) {
        if (t2.getPrecision().greaterThan(t1.getPrecision()))
            return t2;
        return t1;
    }

    public static String toString(PointInTime t) {
        return t.toString();
    }

    private Partial partial;
    private Precision precision;

    private PointInTime() {
        partial = new Partial(new LocalDateTime());
        calculatePrecision();
    }

    public PointInTime(ReadablePartial readablePartial) {
        if (!DateTimeUtils.isContiguous(readablePartial))
            throw new IllegalArgumentException("partial's fields must be contiguous");
        partial = new Partial(readablePartial);
        calculatePrecision();
    }

    private PointInTime(ReadablePartial readablePartial, Precision precision) {
        DateTimeFieldType[] fieldTypes = precision.toFieldTypes();
        int[] values = new int[fieldTypes.length];
        for (int i = 0; i < fieldTypes.length; i++) {
            values[i] = readablePartial.get(fieldTypes[i]);
        }
        this.partial = new Partial(fieldTypes, values, readablePartial.getChronology());
        if (!DateTimeUtils.isContiguous(this.partial))
            throw new IllegalArgumentException("partial's fields must be contiguous");
        this.precision = precision;
    }

    public PointInTime(String hl7DateTime) {
        PointInTime t = HL7DateTimeFormat.parse(hl7DateTime);
        this.partial = t.partial;
        this.precision = t.precision;
    }

    public PointInTime(int year) {
        precision = Precision.YEAR;
        partial = new Partial().with(DateTimeFieldType.year(), year);
    }

    public PointInTime(int year, int month) {
        precision = Precision.MONTH;
        partial = new Partial().with(DateTimeFieldType.year(), year).with(DateTimeFieldType.monthOfYear(), month);
    }

    public PointInTime(int year, int month, int date) {
        precision = Precision.DATE;
        partial = new Partial().with(DateTimeFieldType.year(), year).with(DateTimeFieldType.monthOfYear(), month)
                .with(DateTimeFieldType.dayOfMonth(), date);
    }

    public PointInTime(int year, int month, int date, int hour) {
        precision = Precision.HOUR;
        partial = new Partial().with(DateTimeFieldType.year(), year).with(DateTimeFieldType.monthOfYear(), month)
                .with(DateTimeFieldType.dayOfMonth(), date).with(DateTimeFieldType.hourOfDay(), hour);
    }

    public PointInTime(int year, int month, int date, int hour, int minute) {
        precision = Precision.MINUTE;
        partial = new Partial().with(DateTimeFieldType.year(), year).with(DateTimeFieldType.monthOfYear(), month)
                .with(DateTimeFieldType.dayOfMonth(), date).with(DateTimeFieldType.hourOfDay(), hour)
                .with(DateTimeFieldType.minuteOfHour(), minute);
    }

    public PointInTime(int year, int month, int date, int hour, int minute,
                       int second) {
        precision = Precision.SECOND;
        partial = new Partial().with(DateTimeFieldType.year(), year).with(DateTimeFieldType.monthOfYear(), month)
                .with(DateTimeFieldType.dayOfMonth(), date).with(DateTimeFieldType.hourOfDay(), hour)
                .with(DateTimeFieldType.minuteOfHour(), minute).with(DateTimeFieldType.secondOfMinute(), second);
    }

    public PointInTime(int year, int month, int date, int hour, int minute,
                       int second, int millisecond) {
        precision = Precision.MILLISECOND;
        partial = new Partial().with(DateTimeFieldType.year(), year).with(DateTimeFieldType.monthOfYear(), month)
                .with(DateTimeFieldType.dayOfMonth(), date).with(DateTimeFieldType.hourOfDay(), hour)
                .with(DateTimeFieldType.minuteOfHour(), minute).with(DateTimeFieldType.secondOfMinute(), second)
                .with(DateTimeFieldType.millisOfSecond(), millisecond);
    }

    public PointInTime add(ReadablePeriod p) {
        Period period = p.toPeriod().normalizedStandard(PeriodType.yearMonthDayTime());
        Partial newPartial = this.partial.plus(period);
        return new PointInTime(newPartial);
    }

    public PointInTime add(ReadableDuration d) {
        return add(d.toPeriod());
    }

    public PointInTime addYears(int years) {
        return add(Period.years(years));
    }

    public PointInTime addMonths(int months) {
        return add(Period.months(months));
    }

    public PointInTime addWeeks(int weeks) {
        return add(Period.weeks(weeks));
    }

    public PointInTime addDays(int days) {
        return add(Period.days(days));
    }

    public PointInTime addHours(int hours) {
        return add(Period.hours(hours));
    }

    public PointInTime addMilliseconds(int milliseconds) {
        return add(Period.millis(milliseconds));
    }

    public PointInTime addMinutes(int minutes) {
        return add(Period.minutes(minutes));
    }

    public PointInTime addSeconds(int seconds) {
        return add(Period.seconds(seconds));
    }

    public PointInTime subtract(ReadablePeriod p) {
       return new PointInTime(this.partial.minus(p.toPeriod().normalizedStandard(PeriodType.yearMonthDayTime())));
    }

    public PointInTime subtract(ReadableDuration d) {
        return subtract(d.toPeriod());
    }

    public PointInTime subtractYears(int years) {
        return subtract(Period.years(years));
    }

    public PointInTime subtractMonths(int months) {
        return subtract(Period.months(months));
    }

    public PointInTime subtractWeeks(int weeks) {
        return subtract(Period.weeks(weeks));
    }

    public PointInTime subtractDays(int days) {
        return subtract(Period.days(days));
    }

    public PointInTime subtractHours(int hours) {
        return subtract(Period.hours(hours));
    }

    public PointInTime subtractMilliseconds(int milliseconds) {
        return subtract(Period.millis(milliseconds));
    }

    public PointInTime subtractMinutes(int minutes) {
        return subtract(Period.minutes(minutes));
    }

    public PointInTime subtractSeconds(int seconds) {
        return subtract(Period.seconds(seconds));
    }

    public ReadableDuration subtract(PointInTime t) {
        if (!t.getPrecision().equals(getPrecision())) throw new ImprecisePointInTimeException(lessPrecise(this, t));
        LocalDateTime t1 = this.promote().getLow().toLocalDateTime();
        LocalDateTime t2 = t.promote().getLow().toLocalDateTime();
        return new Duration(t2.toDateTime(), t1.toDateTime());
    }

    public boolean after(PointInTime t) {
        if (getPrecision().lessThan(t.getPrecision())) {
            IntervalOfTime interval = promote();
            if (interval.contains(t))
                return false;
            return interval.getHigh().compareTo(t) > 0;
        } else if (getPrecision().greaterThan(t.getPrecision())) {
            IntervalOfTime interval = t.promote();
            if (interval.contains(this))
                return false;
            return compareTo(interval.getLow()) > 0;
        } else {
            return compareTo(t) > 0;
        }
    }

    public boolean before(PointInTime t) {
        if (getPrecision().lessThan(t.getPrecision())) {
            IntervalOfTime interval = promote();
            if (interval.contains(t))
                return false;
            return interval.getLow().compareTo(t) < 0;
        } else if (getPrecision().greaterThan(t.getPrecision())) {
            IntervalOfTime interval = t.promote();
            if (interval.contains(this))
                return false;
            return compareTo(interval.getHigh()) < 0;
        } else {
            return compareTo(t) < 0;
        }
    }


    public PointInTime clone() {
        PointInTime t = new PointInTime();
        t.precision = this.precision;
        t.partial = new Partial(this.partial);
        return t;
    }

    /**
     * Comparison of two PointInTimes of differing precisions will place the lower precision time before the higher
     * precision time.
     * <p/>
     * For example: July 23rd, 1975 compared to July 23rd, 1975 10:00am will return -1
     */
    public int compareTo(ReadablePartial o) {
        return compareTo((PointInTime) o);
    }

    public int compareTo(PointInTime t) {
        if (t == null)
            return 1;
        if (getPrecision().equals(t.getPrecision())) {
            return partial.compareTo(t.partial);
        }
        PointInTime leastPrecise = lessPrecise(this, t);
        PointInTime mostPrecise = mostPrecise(this, t);
        IntervalOfTime i = leastPrecise.promote();
        if (i.contains(mostPrecise)) {
            return getPrecision().compareTo(t.getPrecision());
        }
        PointInTime lcd = mostPrecise.toPrecision(leastPrecise.getPrecision());
        if (this == leastPrecise)
            return compareTo(lcd);
        else
            return lcd.compareTo(leastPrecise);
    }

    private PointInTime toPrecision(Precision precision) {
        if (precision.equals(getPrecision())) return this;
        if (precision.greaterThan(getPrecision())) throw new IllegalArgumentException();
        switch (precision) {
            case SECOND:
                return new PointInTime(getYear(), getMonth(), getDate(), getHour(), getMinute(), getSecond());
            case MINUTE:
                return new PointInTime(getYear(), getMonth(), getDate(), getHour(), getMinute());
            case HOUR:
                return new PointInTime(getYear(), getMonth(), getDate(), getHour());
            case DATE:
                return new PointInTime(getYear(), getMonth(), getDate());
            case MONTH:
                return new PointInTime(getYear(), getMonth());
            case YEAR:
            default:
                return new PointInTime(getYear());
        }
    }

    private PointInTime createHigh() {
        Partial p = null;
        if (Precision.YEAR.equals(getPrecision())) {
            p = this.partial.withFieldAddWrapped(DurationFieldType.years(), 1);
        } else if (Precision.MONTH.equals(getPrecision())) {
            p = this.partial.withFieldAddWrapped(DurationFieldType.months(), 1);
        } else if (Precision.DATE.equals(getPrecision())) {
            p = this.partial.withFieldAddWrapped(DurationFieldType.days(), 1);
        } else if (Precision.HOUR.equals(getPrecision())) {
            p = this.partial.withFieldAddWrapped(DurationFieldType.hours(), 1);
        } else if (Precision.MINUTE.equals(getPrecision())) {
            p = this.partial.withFieldAddWrapped(DurationFieldType.minutes(), 1);
        } else if (Precision.SECOND.equals(getPrecision())) {
            p = this.partial.withFieldAddWrapped(DurationFieldType.seconds(), 1);
        } else {
            p = this.partial.withFieldAddWrapped(DurationFieldType.millis(), 1);
        }

        if (!p.isSupported(DateTimeFieldType.monthOfYear()))
            p = p.with(DateTimeFieldType.monthOfYear(), 1);
        if (!p.isSupported(DateTimeFieldType.dayOfMonth()))
            p = p.with(DateTimeFieldType.dayOfMonth(), 1);
        if (!p.isSupported(DateTimeFieldType.hourOfDay()))
            p = p.with(DateTimeFieldType.hourOfDay(), 0);
        if (!p.isSupported(DateTimeFieldType.minuteOfHour()))
            p = p.with(DateTimeFieldType.minuteOfHour(), 0);
        if (!p.isSupported(DateTimeFieldType.secondOfMinute()))
            p = p.with(DateTimeFieldType.secondOfMinute(), 0);
        if (!p.isSupported(DateTimeFieldType.millisOfSecond()))
            p = p.with(DateTimeFieldType.millisOfSecond(), 0);

        return new PointInTime(p);
    }

    private PointInTime createLow() {
        Partial p = new Partial(this.partial);
        if (!p.isSupported(DateTimeFieldType.monthOfYear()))
            p = p.with(DateTimeFieldType.monthOfYear(), 1);
        if (!p.isSupported(DateTimeFieldType.dayOfMonth()))
            p = p.with(DateTimeFieldType.dayOfMonth(), 1);
        if (!p.isSupported(DateTimeFieldType.hourOfDay()))
            p = p.with(DateTimeFieldType.hourOfDay(), 0);
        if (!p.isSupported(DateTimeFieldType.minuteOfHour()))
            p = p.with(DateTimeFieldType.minuteOfHour(), 0);
        if (!p.isSupported(DateTimeFieldType.secondOfMinute()))
            p = p.with(DateTimeFieldType.secondOfMinute(), 0);
        if (!p.isSupported(DateTimeFieldType.millisOfSecond()))
            p = p.with(DateTimeFieldType.millisOfSecond(), 0);
        return new PointInTime(p);
    }

    public int size() {
        return partial.size();
    }

    public DateTimeFieldType getFieldType(int index) {
        return partial.getFieldType(index);
    }

    public DateTimeField getField(int index) {
        return partial.getField(index);
    }

    public int getValue(int index) {
        return partial.getValue(index);
    }

    public Chronology getChronology() {
        return partial.getChronology();
    }

    public int get(DateTimeFieldType field) {
        return partial.get(field);
    }

    public boolean isSupported(DateTimeFieldType field) {
        return partial.isSupported(field);
    }

    public DateTime toDateTime(ReadableInstant baseInstant) {
        return partial.toDateTime(baseInstant);
    }

    public LocalDateTime toLocalDateTime() {
        if (!getPrecision().equals(Precision.MILLISECOND)) throw new ImprecisePointInTimeException(this);
        return new LocalDateTime(getYear(), getMonth(), getDate(), getHour(), getMinute(), getSecond(),
                getMillisecond());
    }

    public LocalDate toLocalDate() {
        if (getPrecision().lessThan(Precision.DATE)) throw new ImprecisePointInTimeException(this);
        return new LocalDate(getYear(), getMonth(), getDate());
    }

    public PointInTime toPointInTimeAtMidnight() {
        if (getPrecision().lessThan(Precision.DATE)) throw new ImprecisePointInTimeException(this);
        PointInTime date = new PointInTime(getYear(), getMonth(), getDate());
        IntervalOfTime day = date.promote();
        PointInTime midnight = day.getHigh();
        return midnight.clone();
    }

    public PointInTime toPointInTimeAtNoon() {
        if (getPrecision().lessThan(Precision.DATE)) throw new ImprecisePointInTimeException(this);
        PointInTime date = new PointInTime(getYear(), getMonth(), getDate());
        IntervalOfTime day = date.promote();
        PointInTime noon = day.getCenter();
        return noon.clone();
    }

    public boolean equals(Object obj) {
        return partial.equals(obj);
    }

    public int getDate() {
        if (!isDateSet())
            throw new ImprecisePointInTimeException(this);
        return partial.get(DateTimeFieldType.dayOfMonth());
    }

    public int getHour() {
        if (!isHourSet())
            throw new ImprecisePointInTimeException(this);
        return partial.get(DateTimeFieldType.hourOfDay());
    }

    public int getMillisecond() {
        if (!isMillisecondSet())
            throw new ImprecisePointInTimeException(this);
        return partial.get(DateTimeFieldType.millisOfSecond());
    }

    public int getMinute() {
        if (!isMinuteSet())
            throw new ImprecisePointInTimeException(this);
        return partial.get(DateTimeFieldType.minuteOfHour());
    }

    public int getMonth() {
        if (!isMonthSet())
            throw new ImprecisePointInTimeException(this);
        return partial.get(DateTimeFieldType.monthOfYear());
    }

    public Precision getPrecision() {
        return precision;
    }

    private void calculatePrecision() {
        if (isMillisecondSet())
            precision = Precision.MILLISECOND;
        else if (isSecondSet())
            precision = Precision.SECOND;
        else if (isMinuteSet())
            precision = Precision.MINUTE;
        else if (isHourSet())
            precision = Precision.HOUR;
        else if (isDateSet())
            precision = Precision.DATE;
        else if (isMonthSet())
            precision = Precision.MONTH;
        else
            precision = Precision.YEAR;
    }

    public int getSecond() {
        if (!isSecondSet())
            throw new ImprecisePointInTimeException(this);
        return partial.get(DateTimeFieldType.secondOfMinute());
    }

    public int getYear() {
        return partial.get(DateTimeFieldType.year());
    }

    public int hashCode() {
        return partial.hashCode();
    }

    public boolean isDateSet() {
        return partial.isSupported(DateTimeFieldType.dayOfMonth());
    }

    public boolean isHourSet() {
        return partial.isSupported(DateTimeFieldType.hourOfDay());
    }

    public boolean isMillisecondSet() {
        return partial.isSupported(DateTimeFieldType.millisOfSecond());
    }

    public boolean isMinuteSet() {
        return partial.isSupported(DateTimeFieldType.minuteOfHour());
    }

    public boolean isMonthSet() {
        return partial.isSupported(DateTimeFieldType.monthOfYear());
    }

    public boolean isSecondSet() {
        return partial.isSupported(DateTimeFieldType.secondOfMinute());
    }

    public IntervalOfTime promote() {
        PointInTime low = createLow();
        PointInTime high = createHigh();
        return new IntervalOfTime(low, high);
    }

    /**
     * <p>Returns a string representation of this point in time.</p> <p>Default format is HL7 timestamp:
     * YYYY[MM[DD[HHMM[SS[.S[S[S[S]]]]]]]][+/-ZZZZ]
     * <p/>
     * <p>In the current and future versions of HL7, the precision is indicated by limiting the number of digits used.
     * Thus, YYYY is used to specify a precision of "year," YYYYMM specifies a precision of "month," YYYYMMDD specifies
     * a precision of "day," YYYYMMDDHH is used to specify a precision of "hour," YYYYMMDDHHMM is used to specify a
     * precision of "minute," YYYYMMDDHHMMSS is used to specify a precision of seconds, and YYYYMMDDHHMMSS.SSSS is used
     * to specify a precision of ten thousandths of a second. In each of these cases, the time zone is an optional
     * component. Maximum length of the time stamp is 26 characters. </p>
     * <p/>
     * <p>Examples: <samp> |19760704010159-0600| 1:01:59 on July 4, 1976 in the Eastern Standard Time zone.
     * |19760704010159-0500| 1:01:59 on July 4, 1976 in the Eastern Daylight Saving Time zone. |198807050000|   Midnight
     * of the night extending from July 4 to July 5, 1988 in the local time zone of the sender. |19880705|    Same as
     * prior example, but precision extends only to the day.  Could be used for a birthdate, if the time of birth is
     * unknown. </samp> </p>
     */
    public String toString() {
        return HL7DateTimeFormat.forPointInTime(this).print(this);
    }

    /**
     * Constructs a PointInTime from a <code>java.util.Calendar</code>
     * using exactly the same field values avoiding any time zone effects.
     * <p/>
     * Each field is queried from the Calendar and assigned to the PointInTime.
     * This is useful if you have been using the Calendar as a local date,
     * ignoring the zone.
     * <p/>
     * This factory method ignores the type of the calendar and always
     * creates a PointInTime with ISO chronology. It is expected that you
     * will only pass in instances of <code>GregorianCalendar</code> however
     * this is not validated.
     *
     * @param calendar the Calendar to extract fields from
     * @return the created PointInTime
     * @throws IllegalArgumentException if the calendar is null
     * @throws IllegalArgumentException if the date is invalid for the ISO chronology
     */
    public static PointInTime fromCalendarFields(Calendar calendar) {
        if (calendar == null) {
            throw new IllegalArgumentException("The calendar must not be null");
        }
        return new PointInTime(
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH),
                calendar.get(Calendar.HOUR_OF_DAY),
                calendar.get(Calendar.MINUTE),
                calendar.get(Calendar.SECOND),
                calendar.get(Calendar.MILLISECOND)
        );
    }

    /**
     * Constructs a PointInTime from a <code>java.util.Date</code>
     * using exactly the same field values avoiding any time zone effects.
     * <p/>
     * Each field is queried from the Date and assigned to the PointInTime.
     * This is useful if you have been using the Date as a local date,
     * ignoring the zone.
     * <p/>
     * This factory method always creates a PointInTime with ISO chronology.
     *
     * @param date the Date to extract fields from
     * @return the created PointInTime
     * @throws IllegalArgumentException if the calendar is null
     * @throws IllegalArgumentException if the date is invalid for the ISO chronology
     */
    public static PointInTime fromDateFields(Date date) {
        if (date == null) {
            throw new IllegalArgumentException("The date must not be null");
        }
        return new PointInTime(
                date.getYear() + 1900,
                date.getMonth() + 1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                (int) (date.getTime() % 1000)
        );
    }

    public static PointInTime fromLocalDate(LocalDate t) {
        return new PointInTime(t.getYear(), t.getMonthOfYear(), t.getDayOfMonth());
    }

    public static PointInTime fromLocalDateTime(LocalDateTime t) {
        return new PointInTime(t.getYear(), t.getMonthOfYear(), t.getDayOfMonth(), t.getHourOfDay(),
                t.getMinuteOfHour(), t.getSecondOfMinute(), t.getMillisOfSecond());
    }

    public static PointInTime now() {
        return nowStrategy.get().now();
    }

    public static PointInTime today() {
        return new PointInTime(now(), Precision.DATE);
    }

    public static void setNowStrategy(NowStrategy factory) {
        if (factory != null) {
            nowStrategy.set(factory);
        } else if (!(nowStrategy.get() instanceof DefaultNowStrategy)) {
            nowStrategy.set(new DefaultNowStrategy());
        }
    }

    public static void setDefaultNowStrategy() {
        setNowStrategy(null);
    }
}
