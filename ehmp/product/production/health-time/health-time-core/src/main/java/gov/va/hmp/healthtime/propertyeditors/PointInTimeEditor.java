package gov.va.hmp.healthtime.propertyeditors;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;

import java.beans.PropertyEditorSupport;

/**
 * Editor for PointInTime's.  Instances are converted to Strings and vice-versa using HL7DateTimeFormat.
 *
 * @see gov.va.hmp.healthtime.PointInTime
 * @see gov.va.hmp.healthtime.format.HL7DateTimeFormat
 */
public class PointInTimeEditor extends PropertyEditorSupport {

    @Override
    public String getAsText() {
        PointInTime t = (PointInTime) getValue();
        if (t == null)
            return super.getAsText();
        else
            return t.toString();
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        PointInTime t = HL7DateTimeFormat.parse(text);
        setValue(t);
    }
}
