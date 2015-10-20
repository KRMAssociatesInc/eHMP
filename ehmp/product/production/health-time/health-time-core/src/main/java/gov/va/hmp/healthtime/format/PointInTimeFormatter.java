package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.Chronology;
import org.joda.time.DateTimeUtils;
import org.joda.time.ReadablePartial;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeParser;
import org.joda.time.format.DateTimePrinter;

/**
 * TODO: Complete documentation for PointInTimeFormatter
 */
public class PointInTimeFormatter extends DateTimeFormatter {
    /**
     * Creates a new formatter, however you will normally use the factory
     * or the builder.
     *
     * @param printer the internal printer, null if cannot print
     * @param parser  the internal parser, null if cannot parse
     */
    public PointInTimeFormatter(DateTimePrinter printer, DateTimeParser parser) {
        super(printer, parser);
    }

    public PointInTimeFormatter(DateTimeFormatter formatter) {
        super(formatter.getPrinter(), formatter.getParser());
    }

    public PointInTime parsePointInTime(String text) {
        if (getParser() == null) {
            throw new UnsupportedOperationException("Parsing not supported");
        }

        text = truncateTimeZone(text);

        Chronology chrono = selectChronology();
        PointInTimeParserBucket bucket = new PointInTimeParserBucket(0, chrono, getLocale());
        int newPos = getParser().parseInto(bucket, text, 0);
        if (newPos >= 0) {
            if (newPos >= text.length()) {
                ReadablePartial partial = bucket.toPartial();
                return new PointInTime(partial);
            }
        } else {
            newPos = ~newPos;
        }
        throw new IllegalArgumentException(createErrorMessage(text, newPos));
    }

    // PointInTime's are always local time (no accidental time zones)

    private String truncateTimeZone(String text) {
        if (text.contains("+")) {
            int plus = text.indexOf("+");
            return text.substring(0, plus);
        } else if (text.contains("-")) {
            int minus = text.indexOf("-");
            return text.substring(0, minus);
        }
        return text;
    }

    private Chronology selectChronology() {
        Chronology chrono = DateTimeUtils.getChronology(null);
        if (getChronolgy() != null) {
            chrono = getChronolgy();
        }
        if (getZone() != null) {
            chrono = chrono.withZone(getZone());
        }
        return chrono;
    }

    private String createErrorMessage(String text, int errorPos) {
        int sampleLen = errorPos + 32;
        String sampleText;
        if (text.length() <= sampleLen + 3) {
            sampleText = text;
        } else {
            sampleText = text.substring(0, sampleLen).concat("...");
        }

        if (errorPos <= 0) {
            return "Invalid format: \"" + sampleText + '"';
        }

        if (errorPos >= text.length()) {
            return "Invalid format: \"" + sampleText + "\" is too short";
        }

        return "Invalid format: \"" + sampleText + "\" is malformed at \"" +
                sampleText.substring(errorPos) + '"';
    }
}
