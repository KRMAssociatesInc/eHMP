package us.vistacore.asu.time;

import org.joda.time.Chronology;
import org.joda.time.DateTimeFieldType;
import org.joda.time.DateTimeZone;
import org.joda.time.ReadablePartial;
import org.joda.time.format.DateTimeParser;
import org.joda.time.format.DateTimeParserBucket;
import org.joda.time.format.DateTimePrinter;
import org.joda.time.format.FormatUtils;

import java.io.IOException;
import java.io.Writer;
import java.util.Locale;

/**
 * TODO: Complete documentation for TwoDigitNumber
 */
class TwoDigitNumber implements DateTimePrinter, DateTimeParser {
    protected DateTimeFieldType type;

    public TwoDigitNumber(DateTimeFieldType type) {
        this.type = type;
    }

    public int estimatePrintedLength() {
        return 2;
    }

    public void printTo(StringBuffer buf, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) {
        int value = getValue(instant, chrono);
        FormatUtils.appendPaddedInteger(buf, value, 2);
    }

    public void printTo(Writer out, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) throws
            IOException {
        int value = getValue(instant, chrono);
        FormatUtils.writePaddedInteger(out, value, 2);
    }

    public void printTo(StringBuffer buf, ReadablePartial partial, Locale locale) {
        int value = getValue(partial);
        FormatUtils.appendPaddedInteger(buf, value, 2);
    }

    public void printTo(Writer out, ReadablePartial partial, Locale locale) throws IOException {
        int value = getValue(partial);
        FormatUtils.writePaddedInteger(out, value, 2);
    }

    protected int getValue(long instant, Chronology chrono) {
        try {
            int value = type.getField(chrono).get(instant);
            if (value < 0) {
                value = -value;
            }
            return value;
        } catch (RuntimeException e) {
            return -1;
        }
    }

    protected int getValue(ReadablePartial partial) {
        try {
            int value = partial.get(type);
            if (value < 0) {
                value = -value;
            }
            return value;
        } catch (RuntimeException e) {
            return -1;
        }
    }

    public int estimateParsedLength() {
        return 2;
    }

    public int parseInto(DateTimeParserBucket bucket, String text, int position) {
        int value = parseTwoDigits(text, position);
        if (value > 0 || (value == 0 && (type == DateTimeFieldType.hourOfDay() || type == DateTimeFieldType
                .minuteOfHour() || type == DateTimeFieldType.secondOfMinute() || type == DateTimeFieldType
                .millisOfSecond())))
            bucket.saveField(type, value);
        return position + 2 > text.length() ? position + 1 : position + 2;
    }

    static int parseTwoDigits(String text, int position) {
        if (position >= text.length()) return -1;
        if (position + 2 > text.length()) return Integer.parseInt(text.substring(position, position + 1) + '0');
        return Integer.parseInt(text.substring(position, position + 2));
    }

}
