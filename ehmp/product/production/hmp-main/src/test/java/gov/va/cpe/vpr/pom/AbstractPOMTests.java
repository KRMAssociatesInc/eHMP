package gov.va.cpe.vpr.pom;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.*;

import static gov.va.cpe.vpr.pom.PatientEvent.Change;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

public class AbstractPOMTests {

    public static final int AGE = 32;
    public static final String DATE_OF_BIRTH = new PointInTime(new DateTime().minusYears(AGE).getYear(), 1, 1).toString();
    private static final Map<String, Object> PATIENT_DATA = new HashMap<String, Object>();

    static {
        PATIENT_DATA.put("uid", "urn:id:1");
        PATIENT_DATA.put("personID", "229");
        PATIENT_DATA.put("pid", 1);
        PATIENT_DATA.put("familyName", "Doe");
        PATIENT_DATA.put("givenNames", "John");
        PATIENT_DATA.put("dateOfBirth", DATE_OF_BIRTH);
        PATIENT_DATA.put("gender", "MALE");
        PATIENT_DATA.put("ssn", "123-45-6789");
        PATIENT_DATA.put("foo", "bar");
        PATIENT_DATA.put("aliases", Arrays.asList("striker1"));

        Map slc = new HashMap();
        slc.put("city", "SLC");
        slc.put("stateProvince", "UT");
        Map miami = new HashMap();
        miami.put("city", "Miami");
        miami.put("stateProvince", "FL");

        PATIENT_DATA.put("addresses", Arrays.asList(slc, miami));
    }

    @Test
    public void test() {
        TestPatientObject p = new TestPatientObject(PATIENT_DATA);

        // recognized fields are returned by regular getters and use appropriate types
        assertEquals("urn:id:1", p.getUid());
        assertEquals("Doe", p.getFamilyName());
        assertEquals("John", p.getGivenNames());
        assertEquals("229", p.getPersonID());
        assertEquals(HL7DateTimeFormat.parse(DATE_OF_BIRTH), p.getDOB());
        assertEquals(TestPatientObject.Gender.MALE, p.getGender());

        // Nested objects are returned as expected
        List<TestPatientObject.Address> addrs = p.getAddresses();
        assertEquals(2, addrs.size());
        assertEquals("SLC", addrs.get(0).getCity());
        assertEquals("UT", addrs.get(0).getStateProvince());
        assertEquals("Miami", addrs.get(1).getCity());
        assertEquals("FL", addrs.get(1).getStateProvince());

        // testing a set being returned instead of an array
        Set<String> aliases = p.getAliases();
        assertEquals(1, aliases.size());
        assertEquals("striker1", aliases.iterator().next());

        // unrecognized fields are returned as properties
        assertEquals("bar", p.getProperty("foo"));

        // virtual fields could be both regular getters and generic properties
        assertEquals(2, p.getProperties().size());
        Assert.assertTrue(p.getProperties().containsKey("ssn"));
        assertEquals("123-45-6789", p.getSSN());
        assertEquals("123-45-6789", p.getProperty("ssn"));

        // business logic methods
        assertEquals("Doe, John", p.getFullName());
        assertEquals("Doe, John (" + AGE + "yo MALE)", p.getSummary());
        assertThat(p.getAgeInYears(), is(AGE));

        // by default getData() should return all the data (fields and properties)
        // that are appropriate for serialization (mostly strings instead of objects)
        Map<String, Object> data = p.getData();
        assertEquals("urn:id:1", data.get("uid"));
        assertEquals("229", data.get("personID"));
        assertEquals("Doe", data.get("familyName"));
        assertEquals("John", data.get("givenNames"));
        assertEquals(DATE_OF_BIRTH, data.get("dateOfBirth"));// string instead of PointInTime
        assertEquals("123-45-6789", data.get("ssn"));
        assertEquals("bar", data.get("foo"));
        assertEquals("MALE", data.get("gender"));// string instead of ENUM

        // getData() should return addresses in a serialization appropriate way (lists of maps) instead of objects
        Object x = data.get("addresses");
        Assert.assertTrue(x instanceof List);
        Map addr1 = (Map) ((List) x).get(0);
        assertEquals("SLC", addr1.get("city"));
        assertEquals("UT", addr1.get("stateProvince"));
        Map addr2 = (Map) ((List) x).get(1);
        assertEquals("Miami", addr2.get("city"));
        assertEquals("FL", addr2.get("stateProvince"));

        // sets get turned into arrays after serialization, since there really isnt a set semantic in JSON
        Object y = data.get("aliases");
        Assert.assertTrue(y instanceof List);
        assertEquals(ArrayList.class, y.getClass());

        // note how ageInYears is specifically missing since its not appropriate for serialization
        Assert.assertFalse(data.containsKey("ageInYears"));

        // However, getData() can also return Views (based on Jackson Views)
        // that might be more appropriate for web services, the JSONViews.WSView
        // will include ageInYears
        data = p.getData(JSONViews.WSView.class);
        assertEquals(AGE, data.get("ageInYears"));
    }

    @Test
    public void testExceptions() {
        try {
            TestPatientObject p = new TestPatientObject(new LinkedHashMap<String, Object>());
            Assert.fail("Expected a IllegalArgument Exception");
        } catch (IllegalArgumentException ex) {
            // expected
        }

    }

    @Test
    public void testAliases() {
        // some fields may recognize multiple key values
        TestPatientObject p = new TestPatientObject(PATIENT_DATA);

        // dateOfBirth can also be specified as: born and dob
        assertEquals(HL7DateTimeFormat.parse(DATE_OF_BIRTH), p.getDOB());
        p.setData("born", "20010101");
        assertEquals(HL7DateTimeFormat.parse("20010101"), p.getDOB());
        p.setData("dob", "19990101");
        assertEquals(HL7DateTimeFormat.parse("19990101"), p.getDOB());

        // dateOfDeath can also be specified as: died and dod
        Assert.assertNull(p.getData().get("dateOfDeath"));
        p.setData("dateOfDeath", "20120601");
        assertEquals("20120601", p.getData().get("dateOfDeath"));
        p.setData("died", "20110601");
        assertEquals("20110601", p.getData().get("dateOfDeath"));
        p.setData("dod", "20100601");
        assertEquals("20100601", p.getData().get("dateOfDeath"));

        // personID can be specified as icn
        assertEquals("229", p.getPersonID());
        p.setData("icn", "123");
        assertEquals("123", p.getPersonID());

        // familyName and givenNames can be specified as family_name and given_name
        Map<String, Object> map = new LinkedHashMap<String, Object>(2);
        map.put("family_name", "foo2");
        map.put("given_name", "bar2");
        p.setData(map);
        assertEquals("foo2", p.getFamilyName());
        assertEquals("bar2", p.getGivenNames());
        Map<String, Object> map1 = new LinkedHashMap<String, Object>(2);
        map1.put("family_name", "foo");
        map1.put("given_name", "bar");
        p.setData(map1);
        assertEquals("foo", p.getFamilyName());
        assertEquals("bar", p.getGivenNames());
    }

    @Test
    public void testViews() {
        TestPatientObject p = new TestPatientObject(PATIENT_DATA);

        // age in years should only be returned for the web service view
        Assert.assertFalse(p.getData().containsKey("ageInYears"));
        Assert.assertTrue(p.getData(JSONViews.WSView.class).containsKey("ageInYears"));

        // TODO: SOLR fields, ModifiedFields

    }

    @Test
    public void testStandardEvents() {
        TestPatientObject p = new TestPatientObject(PATIENT_DATA);

        // dirty fields should be empty
        Assert.assertFalse(p.isModified());
        assertEquals(0, p.getModifiedFields().size());
        assertEquals(0, p.getEvents().size());

        // now change a few values
        p.setData("dateOfBirth", "20000101");

        // assert that everything that uses that field is dirty now
        Assert.assertTrue(p.isModified());
        assertEquals(1, p.getModifiedFields().size());
        //assertTrue(p.getModifiedFields().containsAll(['dateOfBirth', 'summary']));

        // changing a field should fire a generic PatientEvent that has 2 changes listed
        List<PatientEvent<IPatientObject>> events = p.getEvents();
        PatientEvent evt = events.get(0);
        assertEquals(1, events.size());
        assertEquals(PatientEvent.class, evt.getClass());
        assertEquals(PatientEvent.Type.UPDATE, evt.getType());
        assertEquals(1, evt.getChanges().size());

        // change is the birthdate
        List<Change> changesInEvent = evt.getChanges();
        Change change2 = changesInEvent.get(0);
        assertEquals("dateOfBirth", change2.FIELD);
        assertEquals(DATE_OF_BIRTH, change2.OLD_VALUE);
        assertEquals("20000101", change2.NEW_VALUE);
    }

    @Test
    @Ignore
    public void testCustomEvents() {
        TestPatientObject p = new TestPatientObject(PATIENT_DATA);

        // the patient object declares a custom event for PatientDeath
        // it is triggered by changing the died date on the patient from NULL to something
        p.setData("died", "20120601");
        assertEquals(1, p.getEvents().size());

        PatientEvent event = p.getEvents().get(0);
        assertEquals(TestPatientObject.PatientDeathEvent.class, event.getClass());
//        assertEquals(HL7DateTimeFormat.parse("20120601"), event.get("deathDate"));
    }

    @Test
    public void testExtractIndexDefinitions() throws NoSuchFieldException {
        Field f = TestPatientObject.class.getDeclaredField("born");

        // get the indexes on the patient class, (on the same field, a TimeJDSIndex and DateRangeJDSIndex)
        List<POMIndex<?>> indexes = POMIndex.extractIndexes(TestPatientObject.class);
        assertEquals(5, indexes.size());
        assertEquals(f, indexes.get(0).getField());
        assertEquals(f, indexes.get(1).getField());

        assertEquals(POMIndex.ValuePOMIndex.class, indexes.get(0).getClass());
        assertEquals(POMIndex.RangePOMIndex.class, indexes.get(1).getClass());
        assertEquals(POMIndex.MultiValuePOMIndex.class, indexes.get(2).getClass());
        assertEquals(POMIndex.TermPOMIndex.class, indexes.get(3).getClass());
        assertEquals(POMIndex.ValuePOMIndex.class, indexes.get(4).getClass());

        assertEquals(POMIndex.ValueJDSIndex.class, ((Annotation) indexes.get(0).getAnnotation()).annotationType());
        assertEquals(POMIndex.RangeJDSIndex.class, ((Annotation) indexes.get(1).getAnnotation()).annotationType());
        assertEquals(POMIndex.MultiValueJDSIndex.class, ((Annotation) indexes.get(2).getAnnotation()).annotationType());
        assertEquals(POMIndex.TermJDSIndex.class, ((Annotation) indexes.get(3).getAnnotation()).annotationType());
        assertEquals(POMIndex.ValueJDSIndex.class, ((Annotation) indexes.get(4).getAnnotation()).annotationType());

        // check the ValueJDSIndex on birthday
        POMIndex.ValuePOMIndex idx0 = (POMIndex.ValuePOMIndex) indexes.get(0);
        assertEquals("birthday-index", idx0.getIndexName());
        assertEquals("birthday-index", idx0.getAnnotation().name());
        assertEquals("dateOfBirth", idx0.getAnnotation().field());

        // check the DateRangeJDSIndex on birth/death range
        POMIndex.RangePOMIndex idx1 = (POMIndex.RangePOMIndex) indexes.get(1);
        assertEquals("alive-time", idx1.getIndexName());
        assertEquals("alive-time", idx1.getAnnotation().name());
        assertEquals("dateOfBirth", idx1.getAnnotation().startField());
        assertEquals("dateOfDeath", idx1.getAnnotation().endField());

        // chekc the multivalue index on addresses
        POMIndex.MultiValuePOMIndex idx2 = (POMIndex.MultiValuePOMIndex) indexes.get(2);
        assertEquals("city-list", idx2.getIndexName());
        assertEquals("city", idx2.getAnnotation().subfield());

        // check the ClioTerminology index
        POMIndex.TermPOMIndex idx3 = (POMIndex.TermPOMIndex) indexes.get(3);
        assertEquals("loinc-code-index", idx3.getIndexName());
        assertEquals("code", idx3.getAnnotation().subfield());

        // check the ValueJDSIndex on multi-facility
        POMIndex.ValuePOMIndex idx4 = (POMIndex.ValuePOMIndex) indexes.get(4);
        assertEquals("multiple-facility", idx4.getIndexName());
        assertEquals("T+30", idx4.getAnnotation().expiresat());
    }

    @Test
    public void testIndexValuesGeneration() {
        TestPatientObject p = new TestPatientObject(PATIENT_DATA);
        p.setData("died", "20120601");

        // get the data generated by the indexes
        List<Map<String, Object>> idx = p.getIDX();
        assertEquals(7, idx.size());

        // birthday-index should have a single node
        Assert.assertTrue(idx.contains(Collections.singletonMap("birthday-index", DATE_OF_BIRTH)));

        // alive-time index should have 2 nodes, one for start, one for end
        Assert.assertTrue(idx.contains(Collections.singletonMap("alive-time", DATE_OF_BIRTH)));
        Assert.assertTrue(idx.contains(Collections.singletonMap("alive-time", "20120601")));

        // multiple-facility should be true/false and have an expireat node
        Assert.assertTrue(idx.contains(Collections.singletonMap("multiple-facility", false)));

        // city-list index should have 2 cities
        Assert.assertTrue(idx.contains(Collections.singletonMap("city-list", "SLC")));
        Assert.assertTrue(idx.contains(Collections.singletonMap("city-list", "Miami")));

        // loinc-code-index should have the mocked items (and the original)
        Assert.assertTrue(idx.contains(Collections.singletonMap("loinc-code-index", "urn:lnc:2345-7")));
    }

}
