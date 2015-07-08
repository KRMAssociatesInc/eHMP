package gov.va.cpe.vpr.pom.jds;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class JdsPatientDAOTests {

    private static final String JDS_URL = "http://localhost:9080";
    private static final String MOCK_PID = "23";
    private static final String MOCK_ICN = "123123123";
    private static final String MOCK_QDFN = "F484;321";

    private JdsOperations mockJdsTemplate;
    private IGenericPatientObjectDAO mockGenericDao;
    private JdsPatientDAO dao;

    @Before
    public void setUp() throws Exception {
        mockJdsTemplate = mock(JdsOperations.class);
        mockGenericDao = mock(IGenericPatientObjectDAO.class);

        dao = new JdsPatientDAO();
        dao.setJdsTemplate(mockJdsTemplate);
        dao.setGenericDao(mockGenericDao);
    }

    @Test
    public void testSave() throws Exception {
        PatientDemographics pt = new PatientDemographics();
        pt.setData("uid", UidUtils.getPatientUid("ABCD", "229"));
        pt.setData("familyName", "Bar");
        pt.setData("givenNames", "Foo");
        pt.setData("dateOfBirth", new PointInTime(1934, 11, 11));

        when(mockGenericDao.save(pt)).thenReturn(pt);

        PatientDemographics returnPt = dao.save(pt);

        assertThat(returnPt, sameInstance(pt));
        verify(mockGenericDao).save(pt);
    }

    @Test
    public void testFindByIcn() {
        PatientDemographics mockPatient = new PatientDemographics();
        mockPatient.setData("pid", MOCK_PID);
        mockPatient.setData("icn", MOCK_ICN);

        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_ICN)).thenReturn(mockPatient);

        PatientDemographics pt = dao.findByIcn(MOCK_ICN);
        assertThat(pt, sameInstance(mockPatient));

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_ICN);
    }

    @Test
    public void testFindByNullOrEmptyIcn() {
        PatientDemographics pt = dao.findByIcn(null);
        assertThat(pt, nullValue());
        pt = dao.findByIcn("");
        assertThat(pt, nullValue());

        verifyZeroInteractions(mockJdsTemplate, mockGenericDao);
    }

    @Test
    public void testFindByPid() {
        PatientDemographics mockPatient = new PatientDemographics();
        mockPatient.setData("pid", MOCK_PID);
        mockPatient.setData("icn", MOCK_ICN);

        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_PID)).thenReturn(mockPatient);

        PatientDemographics pt = dao.findByPid(MOCK_PID);
        assertThat(pt, sameInstance(mockPatient));

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_PID);
    }

    @Test
    public void testFindByNullOrEmptyPid() {
        PatientDemographics pt = dao.findByPid(null);
        assertThat(pt, nullValue());
        pt = dao.findByPid("");
        assertThat(pt, nullValue());

        verifyZeroInteractions(mockJdsTemplate, mockGenericDao);
    }

    @Test
    public void testFindByPidNotFound() {
        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_PID)).thenReturn(null);

        PatientDemographics pt = dao.findByPid(MOCK_PID);
        assertThat(pt, nullValue());

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_PID);
    }

    @Test
    public void testFindByPidWithQualifiedDfn() {
        PatientDemographics mockPatient = new PatientDemographics();
        mockPatient.setData("pid", MOCK_PID);

        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_QDFN)).thenReturn(mockPatient);

        PatientDemographics pt = dao.findByPid(MOCK_QDFN);
        assertThat(pt, sameInstance(mockPatient));

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_QDFN);
    }

    @Test
    public void testFindByPidWithQualifiedDfnNotFound() {
        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_QDFN)).thenReturn(null);

        PatientDemographics pt = dao.findByPid(MOCK_QDFN);
        assertThat(pt, nullValue());

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_QDFN);
    }

    @Test
    public void testFindByPidNullOrEmpty() {
        PatientDemographics pt = dao.findByPid(null);
        assertThat(pt, nullValue());
        pt = dao.findByPid("");
        assertThat(pt, nullValue());

        verifyZeroInteractions(mockJdsTemplate, mockGenericDao);
    }

    @Test
    public void testFindByLocalIdWithVistaIdAndDfn() throws Exception {
        PatientDemographics mockPatient = new PatientDemographics();
        mockPatient.setData("pid", MOCK_PID);

        when(mockJdsTemplate.getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_QDFN)).thenReturn(mockPatient);

        PatientDemographics pt = dao.findByLocalId("F484", "321");
        assertThat(pt, sameInstance(mockPatient));

        verify(mockJdsTemplate).getForObject(PatientDemographics.class, "/vpr/mpid/" + MOCK_QDFN);
    }

    @Test
    public void testFindByNullOrEmptyLocalId() {
        PatientDemographics pt = dao.findByLocalId("F484", null);
        assertThat(pt, nullValue());
        pt = dao.findByLocalId("F484", "");
        assertThat(pt, nullValue());

        verifyZeroInteractions(mockJdsTemplate, mockGenericDao);

        pt = dao.findByLocalId("F484", null);
        assertThat(pt, nullValue());

        verifyZeroInteractions(mockJdsTemplate, mockGenericDao);
    }

    @Test
    public void testCount() {
        Map<String, Object> topicCount = new HashMap<String, Object>();
        topicCount.put("topic", "patient");
        topicCount.put("count", 34);
        JsonCCollection<Map<String, Object>> mockResponse = JsonCCollection.create(Collections.singletonList(topicCount));
        when(mockJdsTemplate.getForJsonC("/vpr/all/count/patient")).thenReturn(mockResponse);

        assertThat(dao.count(), is(equalTo(34)));
    }

    @Test
    public void testCountLoaded() {
        SyncStatus p1 = new SyncStatus();
        p1.setData("pid", "12");
        SyncStatus p2 = new SyncStatus();
        p2.setData("pid", "22");
        SyncStatus p3 = new SyncStatus();
        p3.setData("pid", "32");

        JsonCCollection<Map<String, Object>> mockResponse = JsonCCollection.create(Arrays.asList(p1.getData(), p2.getData(), p3.getData()));
        when(mockJdsTemplate.getForJsonC("/data/index/status-loaded")).thenReturn(mockResponse);

        // TODO: Refactor this test for sync status / index changes
        assertThat(dao.listLoadedPatientIds().size(), is(equalTo(3)));

        verify(mockJdsTemplate).getForJsonC("/data/index/status-loaded");
    }

    @Test
    public void testFindAll() throws Exception {
        PatientDemographics p1 = new PatientDemographics();
        p1.setData("pid", "12");
        PatientDemographics p2 = new PatientDemographics();
        p2.setData("pid", "22");

        PageRequest pageRequest = new PageRequest(0, 5);
        when(mockGenericDao.findAll(PatientDemographics.class, pageRequest)).thenReturn(new PageImpl<PatientDemographics>(Arrays.asList(p1, p2)));

        Page<PatientDemographics> expected = dao.findAll(pageRequest);
        assertThat(expected.getTotalElements(), is(equalTo(2L)));

        verify(mockGenericDao).findAll(PatientDemographics.class, pageRequest);
    }
}
