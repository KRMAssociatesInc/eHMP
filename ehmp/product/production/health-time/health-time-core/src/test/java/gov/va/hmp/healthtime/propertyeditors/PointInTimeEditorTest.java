package gov.va.hmp.healthtime.propertyeditors;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.propertyeditors.PointInTimeEditor;
import org.junit.Assert;
import org.junit.Test;

public class PointInTimeEditorTest {

    @Test
    public void getAsText() {
        PointInTimeEditor e = new PointInTimeEditor();
        e.setValue(new PointInTime(1975, 7, 23));
        Assert.assertEquals("19750723", e.getAsText());
    }

    @Test
    public void setAsText() {
        PointInTimeEditor e = new PointInTimeEditor();
        e.setAsText("19750723");
        Assert.assertTrue(new PointInTime(1975, 7, 23).equals(e.getValue()));
    }

}
