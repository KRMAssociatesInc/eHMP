package us.vistacore.asu.time;

import org.joda.time.*;

public final class IntervalOfTime implements Cloneable {
    private PointInTime low;

    private PointInTime high;

    private boolean lowClosed;

    private boolean highClosed;

    public IntervalOfTime(PointInTime low, PointInTime high) {
        this(low, high, false);
    }

    public IntervalOfTime(PointInTime low, PointInTime high, boolean lowClosed,
                          boolean highClosed) {
        this(low, high, lowClosed, highClosed, false);
    }

    public IntervalOfTime(PointInTime low, PointInTime high,
                          boolean equalEndpointsAllowed) {
        this(low, high, true, false, equalEndpointsAllowed);
    }

    public IntervalOfTime(PointInTime low, PointInTime high, boolean lowClosed,
                          boolean highClosed, boolean equalEndpointsAllowed) {
        if (high.equals(low) && !equalEndpointsAllowed) {
            throw new IllegalArgumentException(
                    "The end point should be unequal to the low point in time when equalEndpointsAllowed is false");
        }
        this.lowClosed = lowClosed;
        this.highClosed = highClosed;
        if (low.after(high)) {
            setLow(high);
            setHigh(low);
        } else {
            setLow(low);
            setHigh(high);
        }
    }

    private void setLow(PointInTime low) {
        if (Precision.MILLISECOND.equals(low.getPrecision())) {
            this.low = low.clone();
        } else {
            this.low = low.promote().getLow();
        }
    }

    private void setHigh(PointInTime high) {
        if (Precision.MILLISECOND.equals(high.getPrecision())) {
            this.high = high.clone();
        } else {
            this.high = high.promote().getHigh();
            if (isHighClosed()) {
                this.high = this.high.subtract(Period.millis(1));
            }
        }
    }

    public PointInTime getLow() {
        return low;
    }

    public PointInTime getHigh() {
        return high;
    }

    public PointInTime getCenter() {
        PointInTime center = getLow().clone();
        return center.add(new Duration(getWidth().getMillis() / 2L));
    }

    public Duration getWidth() {
        int millis = new Period(low, high, PeriodType.millis()).getMillis();
        return new Duration(millis);
    }

    public Period toPeriod() {
        Period rslt = new Period(lowClosed?low:low.addMilliseconds(1), highClosed?high:high.subtractMilliseconds(1));
        return rslt;
    }

    public Period toPeriod(PeriodType periodType) {
        return new Period(lowClosed?low:low.addMilliseconds(1), highClosed?high:high.subtractMilliseconds(1), periodType);
    }

    public boolean isLowClosed() {
        return low != null && lowClosed;
    }

    public boolean isHighClosed() {
        return high != null && highClosed;
    }

    public PointInTime demote() {
        return getCenter();
    }

    /**
     * Returns an IntervalOfTime that has both endpoints closed.  If the low endpoint is open it will move it forward by one millisecond.
     * If the high endpoint is closed, it will move it backward by one millisecond.
     *
     * @return an IntervalOfTime with closed endpoints baed on the endpoints of this interval.
     */
    public IntervalOfTime toClosed() {
        PointInTime t1 = getLow();
        if (!isLowClosed()) {
            t1 = t1.addMilliseconds(1);
        }
        PointInTime t2 = getHigh();
        if (!isHighClosed()) {
            t2 = t2.subtractMilliseconds(1);
        }
        return new IntervalOfTime(t1, t2, true, true);
    }

    public String toString() {
        return "";// IntervalOfTimeFormat.intervalForm().print(this);
    }




    public boolean contains(PointInTime t) {
        return contains(t.promote());
    }

    public boolean contains(IntervalOfTime i) {
        return getLow().before(i.getLow()) && getHigh().after(i.getLow());
    }

    public Object clone() {
        try {
            IntervalOfTime i = (IntervalOfTime) super.clone();
            i.low = i.low.clone();
            i.high = i.high.clone();
            return i;
        } catch (CloneNotSupportedException e) {
            return null; // should never occur
        }
    }

    public IntervalOfTime intersection(IntervalOfTime i) {
        return intersection(this, i);
    }

    public IntervalOfTime hull(IntervalOfTime i) {
        return convexHull(this, i);
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof IntervalOfTime))
            return false;
        IntervalOfTime i = (IntervalOfTime) obj;
        return isLowClosed() == i.isLowClosed()
                && isHighClosed() == i.isHighClosed()
                && getLow().equals(i.getLow()) && getHigh().equals(i.getHigh());
    }

    public int hashCode() {
        return (highClosed ? 1 : 0) + (lowClosed ? 1 : 0)
                + (low != null ? low.hashCode() : 0)
                + (high != null ? high.hashCode() : 0);
    }


    public static IntervalOfTime intersection(IntervalOfTime i1,
                                              IntervalOfTime i2) {
        if (i1.getLow().before(i2.getLow())) {
            if (i2.getLow().after(i1.getHigh())) {
                return null;
            }
            return new IntervalOfTime(i2.getLow(), i1.getHigh());
        }
        if (i1.getLow().after(i2.getHigh())) {
            return null;
        }
        return new IntervalOfTime(i1.getLow(), i2.getHigh());
    }

    public static IntervalOfTime convexHull(IntervalOfTime i1, IntervalOfTime i2) {
        PointInTime t1;
        PointInTime t2;
        boolean lowClosed;
        boolean highClosed;
        if (i1.low.before(i2.low)) {
            t1 = i1.low;
            lowClosed = i1.isLowClosed();
        } else {
            t1 = i2.low;
            lowClosed = i2.isLowClosed();
        }
        if (i1.high.after(i2.high)) {
            t2 = i1.high;
            highClosed = i1.isHighClosed();
        } else {
            t2 = i2.high;
            highClosed = i2.isHighClosed();
        }
        return new IntervalOfTime(t1, t2, lowClosed, highClosed);
    }

    public static IntervalOfTime today() {
        return PointInTime.today().promote();
    }

    public static IntervalOfTime thisMonth() {
        PointInTime today = PointInTime.today();
        return new PointInTime(today.getYear(), today.getMonth()).promote();
    }

    public static IntervalOfTime thisYear() {
        PointInTime today = PointInTime.today();
        return new PointInTime(today.getYear()).promote();
    }

    public static IntervalOfTime yearToDate() {
        PointInTime now = PointInTime.now();
        return new IntervalOfTime(new PointInTime(now.getYear()), now);
    }

    public static IntervalOfTime forYear(int year) {
        return new PointInTime(year).promote();
    }

    public static IntervalOfTime forMonth(int year, int month) {
        return new PointInTime(year, month).promote();
    }

    public static IntervalOfTime forDay(int year, int month, int date) {
        return new PointInTime(year, month, date).promote();
    }

    public static IntervalOfTime forTheLast(ReadablePeriod p) {
        PointInTime now = PointInTime.now();
        return new IntervalOfTime(now.subtract(p), now, true, true);
    }

    public static IntervalOfTime forTheLast(int years) {
        return forTheLast(Period.years(years));
    }

    public static IntervalOfTime forTheLast(int years, int months) {
        return forTheLast(Period.years(years).plusMonths(months));
    }

    public static IntervalOfTime forTheLast(int years, int months, int days) {
        return forTheLast(Period.years(years).plusMonths(months).plusDays(days));
    }

    public static IntervalOfTime forTheLast(int years, int months, int days, int hours, int minutes, int seconds, int milliseconds) {
        return forTheLast(new Period(years, months, 0, days, hours, minutes, seconds, milliseconds));
    }

    public static IntervalOfTime forTheNext(ReadablePeriod p) {
        PointInTime now = PointInTime.now();
        return new IntervalOfTime(now, now.add(p), true, true);
    }

    public static IntervalOfTime forTheNext(int years) {
        return forTheNext(Period.years(years));
    }

    public static IntervalOfTime forTheNext(int years, int months) {
        return forTheNext(Period.years(years).plusMonths(months));
    }

    public static IntervalOfTime forTheNext(int years, int months, int days) {
        return forTheNext(Period.years(years).plusMonths(months).plusDays(days));
    }

    public static IntervalOfTime forTheNext(int years, int months, int days, int hours, int minutes, int seconds, int milliseconds) {
        return forTheNext(new Period(years, months, 0, days, hours, minutes, seconds, milliseconds));
    }

    public static IntervalOfTime since(PointInTime t) {
        return new IntervalOfTime(t, PointInTime.now(), true, true);
    }

    public static IntervalOfTime since(int year) {
        return since(new PointInTime(year));
    }

    public static IntervalOfTime since(int year, int month) {
        return since(new PointInTime(year, month));
    }

    public static IntervalOfTime since(int year, int month, int date) {
        return since(new PointInTime(year, month, date));
    }

    public static IntervalOfTime since(int year, int month, int date, int hour) {
        return since(new PointInTime(year, month, date, hour));
    }

    public static IntervalOfTime since(int year, int month, int date, int hour, int minute) {
        return since(new PointInTime(year, month, date, hour, minute));
    }

    public static IntervalOfTime since(int year, int month, int date, int hour, int minute, int second) {
        return since(new PointInTime(year, month, date, hour, minute, second));
    }

    public static IntervalOfTime since(int year, int month, int date, int hour, int minute, int second, int millisecond) {
        return since(new PointInTime(year, month, date, hour, minute, second, millisecond));
    }

    public static IntervalOfTime untilNow(ReadablePeriod p) {
        PointInTime now = PointInTime.now();
        return new IntervalOfTime(now.subtract(p), now, true, true);
    }

    public static IntervalOfTime untilToday(ReadablePeriod p) {
        PointInTime today = PointInTime.today();
        return new IntervalOfTime(today.subtract(p), today, true, true);
    }
}
