package gov.va.hmp.healthtime;

import gov.va.hmp.healthtime.Precision;
import org.junit.Assert;
import org.junit.Test;

import java.util.Date;

public class PrecisionTest {

    @Test
    public void testEqualsObject() {
        Precision pDefault = Precision.DATE;
        Precision p = Precision.YEAR;
        Assert.assertFalse(pDefault.equals(p));
        Assert.assertFalse(p.equals(pDefault));

        Assert.assertFalse(p.equals(null));
        Assert.assertFalse(p.equals(new Date()));
        Assert.assertTrue(pDefault.equals(Precision.DATE));
        Assert.assertTrue(p.equals(p));
    }

    @Test
    public void testCompareTo() {
        Precision pDefault = Precision.DATE;
        Precision p = Precision.YEAR;
        Assert.assertTrue(p.compareTo(pDefault) != 0);
        Assert.assertTrue(pDefault.compareTo(p) != 0);
        Assert.assertTrue(p.compareTo(p) == 0);
        Precision m = Precision.MILLISECOND;
        Assert.assertTrue(m.compareTo(p) > 0);
        Assert.assertTrue(m.compareTo(pDefault) > 0);
        Assert.assertTrue(p.compareTo(m) < 0);
        try {
            Assert.assertTrue(m.compareTo(null) > 0);
            Assert.fail("expected " + NullPointerException.class.getName());
        } catch (NullPointerException e) {
        }
    }

    @Test
    public void testHashCode() {
        Precision p1 = Precision.DATE;
        Precision p2 = Precision.MONTH;
        Assert.assertFalse(p1.hashCode() == p2.hashCode());
        Assert.assertTrue(p1.hashCode() == p1.hashCode());
    }

    @Test
    public void testLesser() {
        Precision p1 = Precision.DATE;
        Precision p2 = Precision.MONTH;
        Assert.assertSame(Precision.lesser(p1, p2), p2);
        Assert.assertSame(Precision.lesser(p2, p1), p2);

        Assert.assertSame(Precision.lesser(p2, p2), p2);
    }

    @Test
    public void testGreater() {
        Precision p1 = Precision.DATE;
        Precision p2 = Precision.MONTH;
        Assert.assertSame(Precision.greater(p1, p2), p1);
        Assert.assertSame(Precision.greater(p2, p1), p1);

        Assert.assertSame(Precision.greater(p1, p1), p1);
    }

    @Test
    public void testGreaterThanOrEquals() {
        Precision p1 = Precision.DATE;
        Precision p2 = Precision.MONTH;
        Assert.assertTrue(p1.greaterThanOrEquals(p2));
        Assert.assertFalse(p2.greaterThanOrEquals(p1));

        p2 = Precision.DATE;
        Assert.assertTrue(p1.greaterThanOrEquals(p2));
        Assert.assertTrue(p2.greaterThanOrEquals(p1));
    }

    @Test
    public void testLessThanOrEquals() {
        Precision p1 = Precision.MONTH;
        Precision p2 = Precision.DATE;
        Assert.assertTrue(p1.lessThanOrEquals(p2));
        Assert.assertFalse(p2.lessThanOrEquals(p1));

        p2 = Precision.MONTH;
        Assert.assertTrue(p1.lessThanOrEquals(p2));
        Assert.assertTrue(p2.lessThanOrEquals(p1));
    }
}
