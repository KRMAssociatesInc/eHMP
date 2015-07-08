package gov.va.cpe.vpr;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.LinkedHashMap;

public class PatientFacilityTests {

    private PatientDemographics pt;
    private PatientFacility f1;
    private PatientFacility f2;

    @Before
    public void setUp() {
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(1);
        map.put("id", 23);
        pt = new PatientDemographics(map);

        f1 = new PatientFacility();
        f1.setPatient(pt);
        f1.setData("code", "960");

        f2 = new PatientFacility();
        f2.setPatient(pt);
        f2.setData("code", "960");
    }

    @Test
    public void testEquals() {
        Assert.assertTrue(f1.equals(f2));
        Assert.assertTrue(f2.equals(f1));
    }

    @Test
    public void testHashcode() {
        Assert.assertTrue(f1.hashCode() == f2.hashCode());
    }

    @Test
    public void testCompareTo() {
        Assert.assertEquals(0, f1.compareTo(f2));
        Assert.assertEquals(0, f2.compareTo(f1));

        f2.setData("code", "961");
        Assert.assertEquals(-1, f1.compareTo(f2));
        Assert.assertEquals(1, f2.compareTo(f1));
    }
}
