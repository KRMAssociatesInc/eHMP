package gov.va.hmp.healthtime.propertyeditors;

import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.propertyeditors.IntervalOfTimeEditor;
import org.junit.Assert;
import org.junit.Test;

public class IntervalOfTimeEditorTests {

    @Test
    public void getAsText() {
        IntervalOfTimeEditor e = new IntervalOfTimeEditor();
        e.setValue(new IntervalOfTime(new PointInTime(1975, 7, 23), new PointInTime(1984, 3, 11)));
        Assert.assertEquals("19750723000000.000..19840311235959.999", e.getAsText());
    }

    @Test
    public void setAsText() {
        IntervalOfTimeEditor e = new IntervalOfTimeEditor();
        e.setAsText("19750723..19840311");
        Assert.assertTrue(new IntervalOfTime(new PointInTime(1975, 7, 23, 0, 0, 0, 0), new PointInTime(1984, 3, 11, 23, 59, 59, 999), true, true).equals(e.getValue()));
    }

}
