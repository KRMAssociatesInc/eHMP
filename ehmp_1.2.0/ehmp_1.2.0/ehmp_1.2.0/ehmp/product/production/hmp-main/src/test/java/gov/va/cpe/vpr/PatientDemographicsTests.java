package gov.va.cpe.vpr;

import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.Period;
import org.junit.Test;

import java.util.Set;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.*;
import static org.junit.Assert.assertTrue;

public class PatientDemographicsTests {
    
    @Test
    public void testAge() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("birthDate",new PointInTime(1975, 7, 23));
        PointInTime today = PointInTime.today();
        int age = new Period(pt.getBirthDate(), today).getYears();

        assertThat(pt.getAge(), is(age));
    }

    @Test
    public void testAgeOnDate() {
        // Failing unit test in S54 release
        PatientDemographics pt = new PatientDemographics();
        PointInTime birthDate = new PointInTime(1975, 7, 23);
        PointInTime today = new PointInTime(2014, 7, 22);
        int age = new Period(birthDate, today).getYears();
        assertThat(pt.calculateAge(birthDate, today), is(age));
    }

    @Test
    public void testAgeWhenDead() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("birthDate",new PointInTime(1975, 7, 23));
        pt.setData("deceased",new PointInTime(1984, 3, 11));

        assertThat(pt.getAge(), is(8));
    }

    @Test
    public void testAgeWithDisparatePrecision() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("birthDate", new PointInTime(1968, 12, 28));
        pt.setData("deceased", new PointInTime(1999, 8));
        assertThat(pt.getAge(), is(30));
    }

    @Test
    public void testLast4() {
        PatientDemographics pt = new PatientDemographics();
        assertThat(pt.getLast4(), nullValue());

        pt.setData("ssn","123456789");
        assertThat(pt.getLast4(), is("6789"));
    }

    @Test
    public void testLast5() {
        PatientDemographics pt = new PatientDemographics();
        assertThat(pt.getLast5(), nullValue());

        pt.setData("familyName","FOOBAR");
        pt.setData("ssn","123456789");
        assertThat(pt.getLast5(), is("F6789"));
    }

    @Test
    public void testPatientIds() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("icn","12345");
        pt.setData("ssn", "555555555");
        pt.setData("uid", UidUtils.getPatientUid("9F06","229"));

        Set<String> ptIds = pt.getPatientIds();
        assertThat(ptIds.size(), is(3));
        assertThat(ptIds, hasItems("12345", "9F06;229", "555555555"));

        pt.setData("icn",null);
        pt.setData("ssn", null);
        pt.setData("uid", UidUtils.getPatientUid("9F06","229"));

        assertThat(pt.getPatientIds(), hasItems("9F06;229"));
    }

    @Test
    public void testPatientIdsWithFacilities() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("icn","12345");
        PatientFacility home = new PatientFacility();
        home.setData("code","960");
        home.setData("name","FOO");
        home.setData("homeSite",true);
        home.setData("systemId","9F06");
        home.setData("localPatientId","229");

        pt.addToFacilities(home);
        PatientFacility facility = new PatientFacility();
        facility.setData("code","961");
        facility.setData("name","BAR");
        facility.setData("localPatientId","301");
        facility.setData("systemId","8636");
        pt.addToFacilities(facility);

        Set<String> ptIds = pt.getPatientIds();
        assertThat(ptIds.size(), is(5));
        assertTrue(ptIds.contains("12345"));
        assertTrue(ptIds.contains("960;229"));
        assertTrue(ptIds.contains("961;301"));
        assertTrue(ptIds.contains("9F06;229"));
        assertTrue(ptIds.contains("8636;301"));
    }

    @Test
    public void testPatientIdsWithNoIdsSet() {
        PatientDemographics pt = new PatientDemographics();

        Set<String> ptIds = pt.getPatientIds();
        assertThat(ptIds.size(), is(0));
    }

    @Test
    public void testGetLocalPatientIdForSystem() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("uid", UidUtils.getPatientUid("9F06","229"));
        pt.setData("pid", "42");
        pt.setData("icn", "12345");

        assertEquals("229", pt.getLocalPatientIdForSystem("9F06"));
        assertNull(pt.getLocalPatientIdForSystem("ABCD"));
    }

    @Test
    public void testGetLocalPatientIdForSystemForPatientWithFacilities() {
        PatientDemographics pt = createFacilityLadenPatientDemographics();

        assertEquals("229", pt.getLocalPatientIdForSystem("9F06"));
        assertEquals("301", pt.getLocalPatientIdForSystem("3663"));
        assertNull(pt.getLocalPatientIdForSystem("ABCD"));
    }

    @Test
    public void testEqualsAndHashCode() {
        PatientDemographics pt1 = new PatientDemographics();
        PatientDemographics pt2 = new PatientDemographics();

        // same PIDs, same ICNs
        pt1.setData("pid", "42");
        pt1.setData("icn", "12345");

        pt2.setData("pid", "42");
        pt2.setData("icn", "12345");

        assertThat(pt1.equals(pt2), is(true));
        assertThat(pt2.equals(pt1), is(true));
        assertThat(pt1.hashCode(), is(equalTo(pt2.hashCode())));

        // same PIDs, no ICNs
        pt1 = new PatientDemographics();
        pt2 = new PatientDemographics();

        pt1.setData("pid", "42");

        pt2.setData("pid", "42");

        assertThat(pt1.equals(pt2), is(true));
        assertThat(pt2.equals(pt1), is(true));
        assertThat(pt1.hashCode(), is(equalTo(pt2.hashCode())));

        // no PIDs, same ICNs
        pt1 = new PatientDemographics();
        pt2 = new PatientDemographics();

        pt1.setData("icn", "12345");

        pt2.setData("icn", "12345");

        assertThat(pt1.equals(pt2), is(true));
        assertThat(pt2.equals(pt1), is(true));
        assertThat(pt1.hashCode(), is(equalTo(pt2.hashCode())));
    }

    @Test
    public void testNotEqualsAndHashCode() {
        PatientDemographics pt1 = new PatientDemographics();
        PatientDemographics pt2 = new PatientDemographics();

        // different PIDs, different ICNs
        pt1.setData("pid", "23");
        pt1.setData("icn", "12345");

        pt2.setData("pid", "42");
        pt2.setData("icn", "56789");

        assertThat(pt1.equals(pt2), is(false));
        assertThat(pt2.equals(pt1), is(false));
        assertThat(pt1.hashCode(), is(not(equalTo(pt2.hashCode()))));

        // same PIDs, different ICNs
        pt1 = new PatientDemographics();
        pt2 = new PatientDemographics();

        pt1.setData("pid", "42");
        pt1.setData("icn", "12345");

        pt2.setData("pid", "42");
        pt2.setData("icn", "56789");

        assertThat(pt1.equals(pt2), is(false));
        assertThat(pt2.equals(pt1), is(false));
        assertThat(pt1.hashCode(), is(not(equalTo(pt2.hashCode()))));

        // same ICNs, different PIDs
        pt1 = new PatientDemographics();
        pt2 = new PatientDemographics();

        pt1.setData("pid", "42");
        pt1.setData("icn", "12345");

        pt2.setData("pid", "23");
        pt2.setData("icn", "12345");

        assertThat(pt1.equals(pt2), is(false));
        assertThat(pt2.equals(pt1), is(false));
        assertThat(pt1.hashCode(), is(not(equalTo(pt2.hashCode()))));

        // no PIDs, no ICNs
        pt1 = new PatientDemographics();
        pt2 = new PatientDemographics();

        assertThat(pt1.equals(pt2), is(false));
        assertThat(pt2.equals(pt1), is(false));
        assertThat(pt1.hashCode(), is(not(equalTo(pt2.hashCode()))));
    }

    @Test
    public void testToString() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "42");
        pt.setData("icn", "12345");

        PatientFacility home = new PatientFacility();
        home.setData("code", "960");
        home.setData("name","FOO");
        home.setData("homeSite", true);
        home.setData("localPatientId","229");
        home.setData("systemId","9F06");
        pt.addToFacilities(home);

        PatientFacility facility = new PatientFacility();
        facility.setData("code","961");
        facility.setData("name","BAR");
        facility.setData("localPatientId","301");
        facility.setData("systemId","8636");
        pt.addToFacilities(facility);

        assertThat(pt.toString(), is(PatientDemographics.class.getName() + "{pids=[12345, 42, 8636;301, 960;229, 961;301, 9F06;229]}"));
    }

    @Test
    public void testHomeFacility() {
        PatientFacility home = new PatientFacility();
        home.setData("code","960");
        home.setData("name","FOO");
        home.setData("homeSite", true);
        PatientDemographics pt = new PatientDemographics();
        pt.setData("icn","12345");
        pt.addToFacilities(home);
        PatientFacility facility = new PatientFacility();
        facility.setData("code","961");
        facility.setData("name","BAR");
        pt.addToFacilities(facility);
        assertSame(home, pt.getHomeFacility());
    }

    @Test
    public void testPatientIdsWithNullIcn() {
        PatientDemographics pt = new PatientDemographics();
        PatientFacility home = new PatientFacility();
        home.setData("code","960");
        home.setData("name","FOO");
        home.setData("homeSite",true);
        home.setData("localPatientId","229");
        home.setData("systemId","9F06");
        pt.addToFacilities(home);

        PatientFacility facility = new PatientFacility();
        facility.setData("code","961");
        facility.setData("name","BAR");
        facility.setData("localPatientId","301");
        facility.setData("systemId","8636");
        pt.addToFacilities(facility);//(code: '961', name: 'BAR')

        Set<String> ptIds = pt.getPatientIds();
        assertThat(ptIds.size(), is(4));
        assertTrue(ptIds.contains("960;229"));
        assertTrue(ptIds.contains("961;301"));
        assertTrue(ptIds.contains("9F06;229"));
        assertTrue(ptIds.contains("8636;301"));
    }

    @Test
    public void testGetLocalPatientIdForSystemForPatientWithNoFacilities() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "42");
        pt.setData("icn", "12345");

        assertNull(pt.getLocalPatientIdForSystem("ABCD"));
    }

    @Test
    public void testGetLocalPatientIdForFacility() {
        PatientDemographics pt = createFacilityLadenPatientDemographics();

        assertThat(pt.getLocalPatientIdForFacility("960"), is("229"));
        assertThat(pt.getLocalPatientIdForFacility("961"), is("229"));
        assertThat(pt.getLocalPatientIdForFacility("500"), is("301"));
        assertThat(pt.getLocalPatientIdForFacility("971"), nullValue());
    }

    @Test
    public void testGetLocalPatientIdForFacilityForPatientWithNoFacilities() {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", "42");
        pt.setData("icn", "12345");

        assertNull(pt.getLocalPatientIdForFacility("500"));
    }

    /*
    	assertEquals("10104", p.getIcn());
		assertEquals("AVIVAPATIENT", p.getFamilyName());
		assertEquals("TWENTYFOUR", p.getGivenNames());
		assertEquals("A0004", p.getBriefId());
		assertEquals("666000004", p.getSsn());
		assertTrue(p.isSensitive());
		assertEquals(new PointInTime(1935, 4, 7), p.getBirthDate());
     */

    private PatientDemographics createFacilityLadenPatientDemographics() {
        PatientDemographics pt = new PatientDemographics();

        PatientFacility facility1 = new PatientFacility();
        facility1.setData("code","960");
        facility1.setData("name","FOO");
        facility1.setData("systemId","9F06");
        facility1.setData("localPatientId","229");
        pt.addToFacilities(facility1);

        PatientFacility facility2 = new PatientFacility();
        facility2.setData("code","961");
        facility2.setData("name","BAR");
        facility2.setData("localPatientId","229");
        facility2.setData("systemId","9F06");
        pt.addToFacilities(facility2);

        PatientFacility facility3 = new PatientFacility();
        facility3.setData("code","500");
        facility3.setData("name","BAZ");
        facility3.setData("localPatientId","301");
        facility3.setData("systemId","3663");
        pt.addToFacilities(facility3);

        return pt;
    }
}
