package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;

/**
 * TODOC: Provide summary documentation of class IntervalOfTimeFormatter
 */
public class IntervalOfTimeFormatter {

    private static final String DEFAULT_SEPARATOR = "..";
    private static final String INTERVAL_FORM_SEPARATOR = ";";

    private boolean intervalForm;

    public IntervalOfTimeFormatter() {
        this(false);
    }

    public IntervalOfTimeFormatter(boolean intervalForm) {
        this.intervalForm = intervalForm;
    }

    public IntervalOfTime parseInterval(String text) {
        if (text == null || text.length() == 0) return null;
        if (intervalForm) {
            boolean lowClosed;
            boolean highClosed;
            if (text.startsWith("[")) {
                lowClosed = true;
            } else if (text.startsWith("]")) {
                lowClosed = false;
            } else {
                throw new IllegalArgumentException("Unable to parse interval: " + text + " is not in interval form");
            }
            if (text.endsWith("[")) {
                highClosed = false;
            } else if (text.endsWith("]")) {
                highClosed = true;
            } else {
                throw new IllegalArgumentException("Unable to parse interval: " + text + " is not in interval form");
            }
            int semicolon = text.indexOf(INTERVAL_FORM_SEPARATOR);
            if (semicolon == -1)
                throw new IllegalArgumentException("Unable to parse interval: " + text + " is not in interval form");

            return create(text.substring(1, semicolon), text.substring(semicolon + INTERVAL_FORM_SEPARATOR.length(), text.length() - 1), lowClosed, highClosed);
        } else {
            int doubleDots = text.indexOf(DEFAULT_SEPARATOR);
            if (doubleDots == -1) {
                if (HL7DateTimeFormat.HL7_PATTERN.matcher(text).matches()) {
                    return HL7DateTimeFormat.parse(text).promote();
                } else if (RelativeDateTimeFormat.TODAY_PATTERN.matcher(text).matches()) {
                    return IntervalOfTime.today().toClosed();
                } else {
                    return create(text, "Today", true, true);
                }
            } else {
                return create(text.substring(0, doubleDots), text.substring(doubleDots + DEFAULT_SEPARATOR.length()), true, true);
            }
        }
    }

    public static IntervalOfTime create(String start, String stop, boolean lowClosed, boolean highClosed) {
        PointInTime low = HL7DateTimeFormat.parse(start);
        PointInTime high = HL7DateTimeFormat.parse(stop);
        return new IntervalOfTime(low, high, lowClosed, highClosed);
    }

    public String print(IntervalOfTime interval) {
        if (interval == null) return null;
        StringBuffer buf = new StringBuffer();
        printTo(buf, interval);
        return buf.toString();
    }

    public void printTo(StringBuffer buffer, IntervalOfTime interval) {
        if (interval == null) return;
        if (intervalForm) {
            if (interval.isLowClosed()) {
                buffer.append('[');
            } else {
                buffer.append(']');
            }
            buffer.append(interval.getLow().toString());
            buffer.append(INTERVAL_FORM_SEPARATOR);
            buffer.append(interval.getHigh().toString());
            if (interval.isHighClosed()) {
                buffer.append(']');
            } else {
                buffer.append('[');
            }
        } else {
            interval = interval.toClosed();
            buffer.append(interval.getLow().toString());
            buffer.append(DEFAULT_SEPARATOR);
            buffer.append(interval.getHigh().toString());
        }
    }
}
