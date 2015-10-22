package gov.va.hmp.healthtime.propertyeditors;

import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.format.IntervalOfTimeFormat;

import java.beans.PropertyEditorSupport;

/**
 * Editor for IntervalOfTime.  IntervalsOfTime instances will be converted to their string representations and vice-versa
 * with IntervalOfTimeFormat.
 *
 * @see gov.va.hmp.healthtime.IntervalOfTime
 * @see gov.va.hmp.healthtime.format.IntervalOfTimeFormat
 */
public class IntervalOfTimeEditor extends PropertyEditorSupport {
    @Override
    public String getAsText() {
        IntervalOfTime i = (IntervalOfTime) getValue();
        if (i == null)
            return super.getAsText();
        else
            return IntervalOfTimeFormat.print(i);
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        IntervalOfTime i = IntervalOfTimeFormat.parse(text);
        setValue(i);
    }
}
