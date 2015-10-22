package gov.va.hmp.healthtime.format;

import org.joda.time.*;
import org.joda.time.format.DateTimeParserBucket;

import java.util.Locale;

/**
 * TODO: Complete documentation for PointInTimeParserBucket
 */
class PointInTimeParserBucket extends DateTimeParserBucket {

    private Partial fields = new Partial();

    public PointInTimeParserBucket(long instantLocal, Chronology chrono, Locale locale) {
        super(instantLocal, chrono, locale);
    }

    @Override
    public void saveField(DateTimeFieldType fieldType, int value) {
        super.saveField(fieldType, value);
        save(fieldType, value);
    }

    //-----------------------------------------------------------------------

    @Override
    public void saveField(DateTimeField field, int value) {
        super.saveField(field, value);
        save(field.getType(), value);
    }

    public ReadablePartial toPartial() {
        return fields;
    }

    private void save(DateTimeFieldType fieldType, int value) {
        fields = fields.with(fieldType, value);
        if (!DateTimeUtils.isContiguous(fields)) {
            fields = fields.without(fieldType);
        }
    }
}
