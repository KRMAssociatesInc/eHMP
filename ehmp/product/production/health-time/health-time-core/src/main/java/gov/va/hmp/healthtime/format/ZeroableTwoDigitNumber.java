package gov.va.hmp.healthtime.format;

import org.joda.time.Chronology;
import org.joda.time.DateTimeFieldType;
import org.joda.time.DateTimeZone;
import org.joda.time.ReadablePartial;

import java.io.IOException;
import java.io.Writer;
import java.util.Locale;

/**
 * TODO: Complete documentation for ZeroableTwoDigitNumber
 */
class ZeroableTwoDigitNumber extends TwoDigitNumber {

    private Character fillChar = '0';

    public ZeroableTwoDigitNumber(DateTimeFieldType type, Character fillChar) {
        super(type);
        this.fillChar = fillChar;
    }

    @Override
    public void printTo(StringBuffer buf, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) {
        int value = getValue(instant, chrono);
        if (value < 0) {
            if (fillChar != null) {
                buf.append(fillChar);
                buf.append(fillChar);
            }
        } else {
            super.printTo(buf, instant, chrono, displayOffset, displayZone,
                    locale);
        }
    }

    @Override
    public void printTo(Writer out, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) throws
            IOException {
        int value = getValue(instant, chrono);
        if (value < 0) {
            if (fillChar != null) {
                out.write(fillChar);
                out.write(fillChar);
            }
        } else {
            super.printTo(out, instant, chrono, displayOffset, displayZone,
                    locale);
        }
    }

    @Override
    public void printTo(StringBuffer buf, ReadablePartial partial, Locale locale) {
        int value = getValue(partial);
        if (value < 0) {
            if (fillChar != null) {
                buf.append(fillChar);
                buf.append(fillChar);
            }
        } else {
            super.printTo(buf, partial,
                    locale);
        }
    }

    @Override
    public void printTo(Writer out, ReadablePartial partial, Locale locale) throws IOException {
        int value = getValue(partial);
        if (value < 0) {
            if (fillChar != null) {
                out.write(fillChar);
                out.write(fillChar);
            }
        } else {
            super.printTo(out, partial,
                    locale);
        }

    }
}
