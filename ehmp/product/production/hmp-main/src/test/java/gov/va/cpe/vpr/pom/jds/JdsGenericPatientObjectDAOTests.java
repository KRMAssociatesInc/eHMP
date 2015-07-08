package gov.va.cpe.vpr.pom.jds;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.queryeng.query.QueryDef;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class JdsGenericPatientObjectDAOTests {

    private static final String MOCK_MED_UID = "urn:va:medication:F484:100845:33571";
    private static final String MOCK_PID = "34";
    private JdsOperations mockJdsTemplate;
    private JdsGenericDAO dao;
    private PatientDemographics mockPt;

    @Before
    public void setUp() throws Exception {
        mockPt = new PatientDemographics();
        mockPt.setData("pid", "34");
        mockPt.setData("uid", "urn:va:patient:ABCD:229:229");

        mockJdsTemplate = mock(JdsOperations.class);

        dao = new JdsGenericDAO();
        dao.setJdsTemplate(mockJdsTemplate);
    }

    @Test
    public void testSavePatient() throws Exception {
        String patientUid = UidUtils.getPatientUid("ABCD", "229");

        when(mockJdsTemplate.postForLocation(eq("/vpr"), any(HttpEntity.class))).thenReturn(URI.create("/vpr/34/" + patientUid));

        PatientDemographics pt = new PatientDemographics();
        pt.setData("pid", MOCK_PID);
        pt.setData("uid", UidUtils.getPatientUid("ABCD", "229"));
        pt.setData("familyName", "Bar");
        pt.setData("givenNames", "Foo");
//        pt.setDateOfBirth(new PointInTime(1934, 11, 11));

        pt = dao.save(pt);
        assertThat(pt.getPid(), equalTo("34"));

        ArgumentCaptor<PatientDemographics> ptArg = ArgumentCaptor.forClass(PatientDemographics.class);
        verify(mockJdsTemplate).postForLocation(eq("/vpr"), ptArg.capture());

        assertThat(ptArg.getValue(), sameInstance(pt));
    }

    @Test
    public void testFindPatientByUID() {
        String patientUid = UidUtils.getPatientUid("ABCD", "34");

        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/uid/" + patientUid)).thenReturn(mockPt);

        PatientDemographics pt = dao.findByUID(PatientDemographics.class, patientUid);
        assertThat(pt, sameInstance(mockPt));

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/uid/" + patientUid);
    }

    @Test
    public void testDeletePatientByPID() {
        dao.deleteByPID(PatientDemographics.class, MOCK_PID);

        verify(mockJdsTemplate).delete("/vpr/" + MOCK_PID);
    }

    @Test
    public void testDetivativeSave() {
    	Medication.ENABLE_SAVE_DERIVATIVES=true; // enable experimental feature
        Medication mockMed = new Medication();
        mockMed.setData("pid", MOCK_PID);
        mockMed.setData("uid", MOCK_MED_UID);
        mockMed.setData("overallStart", new PointInTime("20000101"));
        mockMed.setData("overallStop", new PointInTime("20000102"));

		dao.save(mockMed);
		
		ArgumentCaptor<IPatientObject> arg = ArgumentCaptor.forClass(IPatientObject.class);
		verify(mockJdsTemplate, times(2)).postForLocation(eq("/vpr/" + MOCK_PID), arg.capture());

		// first one is the med, 2nd is the derivative DrugTherapy
        assertThat(arg.getAllValues().get(0), instanceOf(Medication.class));
        assertThat(arg.getAllValues().get(1), instanceOf(DrugTherapy.class));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSaveWithMissingPid() {
        Medication mockMed = new Medication();
        mockMed.setData("uid", MOCK_MED_UID);

        dao.save(mockMed);
    }

    @Test
    public void testFindMedicationByUID() {
        Medication mockMed = new Medication();
        mockMed.setData("pid", MOCK_PID);
        mockMed.setData("uid", MOCK_MED_UID);
        when(mockJdsTemplate.getForObject(Medication.class, "/vpr/uid/" + MOCK_MED_UID)).thenReturn(mockMed);

        Medication m = dao.findByUID(Medication.class, MOCK_MED_UID);

        assertThat(m, sameInstance(mockMed));

        verify(mockJdsTemplate).getForObject(Medication.class, "/vpr/uid/" + MOCK_MED_UID);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testFindByUIDWithNullClass() {
        Medication m = dao.findByUID(null, MOCK_MED_UID);
    }

    @Test
    public void testFindByUidWithTemplate() {
        Medication mockMed = new Medication();
        mockMed.setData("pid", MOCK_PID);
        mockMed.setData("uid", MOCK_MED_UID);

        String expectedJdsUri = "/vpr/uid/" + MOCK_MED_UID + "/bar";

        when(mockJdsTemplate.getForObject(Medication.class, expectedJdsUri)).thenReturn(mockMed);

        Medication m = dao.findByUidWithTemplate(Medication.class, MOCK_MED_UID, "bar");

        assertThat(m, sameInstance(mockMed));

        verify(mockJdsTemplate).getForObject(Medication.class, expectedJdsUri);
    }

    @Test
    public void testCountByPID() {
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(getClass().getResourceAsStream("count-domains.json"));

        when(mockJdsTemplate.getForJsonC("/vpr/" + MOCK_PID + "/count/domain")).thenReturn(jsonc);

        assertThat(dao.countByPID(Allergy.class, MOCK_PID), is(2));
        assertThat(dao.countByPID(Document.class, MOCK_PID), is(18));
        assertThat(dao.countByPID(Encounter.class, MOCK_PID), is(45));
        assertThat(dao.countByPID(HealthFactor.class, MOCK_PID), is(2));
        assertThat(dao.countByPID(Result.class, MOCK_PID), is(337));
        assertThat(dao.countByPID(Medication.class, MOCK_PID), is(20));
        assertThat(dao.countByPID(Order.class, MOCK_PID), is(199));
        assertThat(dao.countByPID(Problem.class, MOCK_PID), is(6));
        assertThat(dao.countByPID(Result.class, MOCK_PID), is(337));
        assertThat(dao.countByPID(VitalSign.class, MOCK_PID), is(177));

        verify(mockJdsTemplate, times(10)).getForJsonC("/vpr/" + MOCK_PID + "/count/domain");
    }

    @Test
    public void testDeleteByUID() {
        dao.deleteByUID(Medication.class, MOCK_MED_UID);

        verify(mockJdsTemplate).delete("/vpr/uid/" + MOCK_MED_UID);
    }

    @Test
    public void testDelete() {
        Medication mockMed = new Medication();
        mockMed.setData("pid", MOCK_PID);
        mockMed.setData("uid", MOCK_MED_UID);

        dao.delete(mockMed);

        verify(mockJdsTemplate).delete("/vpr/uid/" + MOCK_MED_UID);
    }

    @Test
    public void testFindAllByIndex() {
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(getClass().getResourceAsStream("result-summary.json"));
        when(mockJdsTemplate.getForJsonC(eq("/vpr/" + MOCK_PID + "/index/lab-type/summary?range=GLUCOSE&start=0&limit=100"), anyMap())).thenReturn(jsonc);
        List<Result> result = dao.findAllByIndex(Result.class, MOCK_PID, "lab-type/summary", "GLUCOSE", null, null);
        assertThat(result.size(), is(2));
        verify(mockJdsTemplate).getForJsonC(eq("/vpr/" + MOCK_PID + "/index/lab-type/summary?range=GLUCOSE&start=0&limit=100"), anyMap());
    }

    @Test
    public void testFindAllByIndexAndRange() {
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(getClass().getResourceAsStream("result-summary.json"));
        when(mockJdsTemplate.getForJsonC(eq("/vpr/" + MOCK_PID + "/index/lab-type/summary?range=GLUCOSE"))).thenReturn(jsonc);
        List<Result> result = dao.findAllByPIDIndexAndRange(Result.class, MOCK_PID, "lab-type/summary", "GLUCOSE");
        assertThat(result.size(), is(2));
        verify(mockJdsTemplate).getForJsonC("/vpr/" + MOCK_PID + "/index/lab-type/summary?range=GLUCOSE");
    }

    @Test
    public void testFindAllByIndexAndRangeWithPagination() {
        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(getClass().getResourceAsStream("result-summary.json"));
        when(mockJdsTemplate.getForJsonC("/vpr/" + MOCK_PID + "/index/lab-type/summary?range=GLUCOSE&start=350&limit=50")).thenReturn(jsonc);
        Page<Result> result = dao.findAllByPIDIndexAndRange(Result.class, MOCK_PID, "lab-type/summary", "GLUCOSE", new PageRequest(7, 50));
        assertThat(result.getNumberOfElements(), is(2));
        verify(mockJdsTemplate).getForJsonC("/vpr/" + MOCK_PID + "/index/lab-type/summary?range=GLUCOSE&start=350&limit=50");
    }

    @Test
    public void testFindAllByQuery() {
        QueryDef qry = new QueryDef();
        PageRequest page = new PageRequest(0, 100);
        qry.namedIndexRange("result", String.valueOf(page.getOffset()), String.valueOf(page.getPageSize()));
        qry.skip(page.getOffset());
        qry.limit(page.getPageSize());


        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(getClass().getResourceAsStream("result-summary.json"));
        when(mockJdsTemplate.getForJsonC(eq("/vpr/" + MOCK_PID + "/index/result?range=0..100&start=0&limit=100"), anyMap())).thenReturn(jsonc);
        Map params = new HashMap();
        params.put("pid", MOCK_PID);
        List<Result> result = dao.findAllByQuery(Result.class, qry, params);
        assertThat(result.size(), is(2));
    }

    @Test
    public void testFindAllByPID() {

        JsonCCollection<Map<String, Object>> jsonc = JsonCCollection.create(getClass().getResourceAsStream("result-summary.json"));
        when(mockJdsTemplate.getForJsonC(eq("/vpr/" + MOCK_PID + "/index/result"), anyMap())).thenReturn(jsonc);

        PageRequest page = new PageRequest(0, 100);
        Page result = dao.findAllByPID(Result.class, MOCK_PID, page);
        assertThat(result.getContent().size(), is(2));

    }

}
