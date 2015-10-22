package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.Precision;

import java.beans.PropertyEditorSupport;

public class PrecisionEditor extends PropertyEditorSupport {

    public PrecisionEditor() {
        super();
    }

    public PrecisionEditor(Object source) {
        super(source);
    }

    public String getAsText() {
        if (getValue() != null) {
            return getValue().toString();
        }
        return null;
    }

    public void setAsText(String text) throws IllegalArgumentException {
        if (text == null) {
            throw new IllegalArgumentException("String is 'null'");
        }
        text = text.trim().toUpperCase();
        if (text.equals("YEAR")) {
            setValue(Precision.YEAR);
        } else if (text.equals("MONTH")) {
            setValue(Precision.MONTH);
        } else if (text.equals("DATE")) {
            setValue(Precision.DATE);
        } else if (text.equals("HOUR")) {
            setValue(Precision.HOUR);
        } else if (text.equals("MINUTE")) {
            setValue(Precision.MINUTE);
        } else if (text.equals("SECOND")) {
            setValue(Precision.SECOND);
        } else if (text.equals("MILLISECOND")) {
            setValue(Precision.MILLISECOND);
        } else {
            setValue(null);
        }
    }

}
