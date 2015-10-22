package gov.va.hmp.healthtime.format;

import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.PrecisionEditor;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class PrecisionEditorTest {
    protected PrecisionEditor editor;

    @Before
    public void setUp() throws Exception {
        editor = new PrecisionEditor();
    }

    /*
      * Class under test for String getAsText()
      */
    @Test
    public void testGetAsText() {
        editor.setValue(Precision.MILLISECOND);
        Assert.assertEquals("millisecond", editor.getAsText());

        editor.setValue(Precision.SECOND);
        Assert.assertEquals("second", editor.getAsText());

        editor.setValue(Precision.MINUTE);
        Assert.assertEquals("minute", editor.getAsText());

        editor.setValue(Precision.HOUR);
        Assert.assertEquals("hour", editor.getAsText());

        editor.setValue(Precision.DATE);
        Assert.assertEquals("date", editor.getAsText());

        editor.setValue(Precision.MONTH);
        Assert.assertEquals("month", editor.getAsText());

        editor.setValue(Precision.YEAR);
        Assert.assertEquals("year", editor.getAsText());
    }

    /*
      * Class under test for void setAsText(String)
      */
    @Test
    public void testSetAsTextString() {
        editor.setAsText("month");
        Assert.assertEquals(Precision.MONTH, editor.getValue());

        editor.setAsText(" month");
        Assert.assertEquals(Precision.MONTH, editor.getValue());

        editor.setAsText("month ");
        Assert.assertEquals(Precision.MONTH, editor.getValue());

        editor.setAsText("Month");
        Assert.assertEquals(Precision.MONTH, editor.getValue());

        editor.setAsText("MONTH");
        Assert.assertEquals(Precision.MONTH, editor.getValue());

        editor.setAsText("YEAR");
        Assert.assertEquals(Precision.YEAR, editor.getValue());

        editor.setAsText("date");
        Assert.assertEquals(Precision.DATE, editor.getValue());

        editor.setAsText("hour");
        Assert.assertEquals(Precision.HOUR, editor.getValue());

        editor.setAsText("minute");
        Assert.assertEquals(Precision.MINUTE, editor.getValue());

        editor.setAsText("Second");
        Assert.assertEquals(Precision.SECOND, editor.getValue());

        editor.setAsText("milliseconD");
        Assert.assertEquals(Precision.MILLISECOND, editor.getValue());

        editor.setAsText("fred");
        Assert.assertNull(editor.getValue());
    }

    @Test
    public void testSetAsTextString_invalid() {
        editor.setAsText("fred");
        Assert.assertNull(editor.getValue());
    }

}
