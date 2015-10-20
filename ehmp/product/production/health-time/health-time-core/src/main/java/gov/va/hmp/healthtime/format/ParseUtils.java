package gov.va.hmp.healthtime.format;

import org.joda.time.Chronology;
import org.joda.time.DateTimeFieldType;
import org.joda.time.DateTimeZone;
import org.joda.time.ReadablePartial;
import org.joda.time.format.DateTimeParser;
import org.joda.time.format.DateTimeParserBucket;
import org.joda.time.format.DateTimePrinter;

import java.io.IOException;
import java.io.Writer;
import java.util.Collection;
import java.util.Locale;

/**
 * TODO: Complete documentation for ParseUtils
 */
public class ParseUtils {
    static int parseTwoDigits(String text, int position) {
        if (position >= text.length()) return -1;
        if (position + 2 > text.length()) return Integer.parseInt(text.substring(position, position + 1) + '0');
        return Integer.parseInt(text.substring(position, position + 2));
    }


    static class CharacterLiteral implements DateTimePrinter, DateTimeParser {
        private Character literal;
        private Collection<DateTimeFieldType> contingentOnFields;

        public CharacterLiteral(Character literal, Collection<DateTimeFieldType> fields) {
            this.literal = literal;
            this.contingentOnFields = fields;
        }

        public int estimatePrintedLength() {
            return 1;
        }

        public void printTo(StringBuffer buf, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) {
            buf.append(literal);
        }

        public void printTo(Writer out, long instant, Chronology chrono, int displayOffset, DateTimeZone displayZone, Locale locale) throws
                IOException {
            out.write(literal);
        }

        public void printTo(StringBuffer buf, ReadablePartial partial, Locale locale) {
            for (DateTimeFieldType type : contingentOnFields) {
                if (partial.isSupported(type)) {
                    buf.append(literal);
                    return;
                }
            }
        }

        public void printTo(Writer out, ReadablePartial partial, Locale locale) throws IOException {
            for (DateTimeFieldType type : contingentOnFields) {
                if (partial.isSupported(type)) {
                    out.write(literal);
                    return;
                }
            }
        }

        public int estimateParsedLength() {
            return 1;
        }

        public int parseInto(DateTimeParserBucket bucket, String text, int position) {
            return position + 1;
        }
    }

}
