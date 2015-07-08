package gov.va.cpe.roster;

import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.sync.vista.IImportPostProcessor;
import gov.va.cpe.vpr.vistasvc.CacheMgrTests;
import gov.va.cpe.vpr.vistasvc.EhCacheTestUtils;
import gov.va.cpe.vpr.vistasvc.ICacheMgr;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Matchers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_DELETE_ROSTER_URI;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class RosterServiceTests {
    public static final String MOCK_UID = "urn:va:roster:ABCD:1234";
    public static final String MOCK_PID = "10104";
    RpcOperations mockRpcTemplate;
    IGenericPOMObjectDAO mockJdsDao;
    IImportPostProcessor<Roster> mockRosterPostProcessor;
    RosterService s;

    @BeforeClass
    public static void init() throws IOException {
        EhCacheTestUtils.setUp();
    }

    @AfterClass
    public static void shutdown() throws IOException {
        EhCacheTestUtils.tearDown();
    }

    public String getResourceString(String str) {
        try {
            return FileCopyUtils.copyToString(new InputStreamReader(getClass().getResourceAsStream(str)));
        } catch (IOException e) {
        }
        return null;
    }

    @Before
    public void setUp() {
        new CacheMgrTests().setup();

        mockRpcTemplate = mock(RpcOperations.class);
        mockJdsDao = mock(IGenericPOMObjectDAO.class);
        mockRosterPostProcessor = mock(IImportPostProcessor.class);

        s = new RosterService();
        s.setRpcTemplate(mockRpcTemplate);
        s.setGenericDao(mockJdsDao);
//        s.setPostProc(mockRosterPostProcessor);

        when(mockRpcTemplate.execute(eq("/HMP UI CONTEXT/HMP ROSTERS"), Matchers.anyList())).thenReturn(new RpcResponse(getResourceString("VPR ROSTERS.xml")));
        when(mockRpcTemplate.execute(eq("/HMP UI CONTEXT/HMP ROSTER PATIENTS"), Matchers.anyVararg())).thenReturn(new RpcResponse(getResourceString("VPR ROSTER PATIENTS.xml")));
        when(mockRpcTemplate.executeForString(eq("/HMP UI CONTEXT/HMP GET SOURCE"), Matchers.anyList())).thenReturn(getResourceString("VPR GET SOURCE.xml"));
    }

    @Test
    public void testGetRosters() {
        Pageable pageable = new PageRequest(1, 100);
        // make sure rosters list work
        Page<Roster> rosters = s.getRosters(pageable);
//		assertTrue(l.size() > 0);
        verify(mockJdsDao).findAll(Roster.class, pageable);
    }

    @Test
    public void testPatientSearch() {
        // patient search results
        List<Map<String, Object>> r = s.searchRosterSource("Patient", "aviva");
        assertTrue(r.size() > 0);
        Map r1 = r.get(0);
        assertEquals("AVIVAPATIENT,EIGHT", r1.get("name"));
        assertEquals("100848", r1.get("dfn"));
        assertEquals("5000000347", r1.get("icn"));
        assertEquals("MALE", r1.get("gender"));
        assertEquals("19331001", r1.get("dob"));
        assertEquals("666000928", r1.get("ssn"));

        // TODO: Test other searchRosterSource's (including bad ones)
    }

    @Test
    public void testRosterToRPCDefinition() throws Exception {
        Map rstr1 = new HashMap<String, Map>();
        rstr1.put("id", "39");
        rstr1.put("name", "test");
        rstr1.put("display", "test1");
        rstr1.put("ownerid", "1084");
        rstr1.put("ownername", null);
        HashMap pat1 = new HashMap<String, Object>();
        pat1.put("uid", UidUtils.getPatientUid("foo", "8"));
        pat1.put("dfn", "8");
        pat1.put("icn", "10110");
        pat1.put("name", "AVIVAPATIENT,X");
        pat1.put("gender", "urn:va:pat-gender:M");
        pat1.put("age", 77);
        List pts = new ArrayList();
        pts.add(pat1);
        rstr1.put("patients", pts);

        List<Map> cache = new ArrayList<Map>();
        cache.add(rstr1);

        String[] definition = s.buildRPCDefenition(cache.get(0), "1287");
        assertNotNull(definition);
        assertEquals("test^^test1^^1084", definition[0]);
        assertEquals("Patient^UNION^8", definition[1]);
        assertEquals("Patient^UNION^1287", definition[2]);
    }

    @Test
    public void testDeleteRoster() throws Exception {
        Roster mockRoster = new Roster();
        mockRoster.setData("uid", MOCK_UID);
        mockRoster.setData("localId", "39");
        when(mockJdsDao.findByUID(Roster.class, MOCK_UID)).thenReturn(mockRoster);
        when(mockRpcTemplate.executeForString(VPR_DELETE_ROSTER_URI, Arrays.asList("39"))).thenReturn("foo");

        String response = s.deleteRoster(MOCK_UID);

        assertThat(response, is("foo"));

        verify(mockJdsDao).findByUID(Roster.class, MOCK_UID);
        verify(mockJdsDao).delete(mockRoster);
        verify(mockRpcTemplate).executeForString(VPR_DELETE_ROSTER_URI, Arrays.asList("39"));
    }

    @Test
    public void testUpdateRoster() throws Exception {
        ICacheMgr mockCache = mock(ICacheMgr.class);
        s.cache = mockCache;

        String[] definition = new String[]{"test^^test1^^1084", "Patient^UNION^8", "Patient^UNION^1287"};
        List<String[]> params = new ArrayList();
        params.add(definition);
        when(mockRpcTemplate.execute(UserInterfaceRpcConstants.VPR_UPDATE_ROSTER_URI, params)).thenReturn(new RpcResponse("{\"data\":{\"items\":[{\"uid\":\"" + MOCK_UID + "\"}]}}"));

        Roster roster = s.updateRoster(definition);

        assertThat(roster, notNullValue());
        assertThat(roster.getUid(), is(MOCK_UID));

        verify(mockCache).removeAll();
        verify(mockRpcTemplate).execute(UserInterfaceRpcConstants.VPR_UPDATE_ROSTER_URI, params);
        verify(mockJdsDao).save(roster);
    }

    @Test
    public void testGetRosterPatients() throws Exception {
        RosterPatient pt1 = new RosterPatient();
        RosterPatient pt2 = new RosterPatient();
        RosterPatient pt3 = new RosterPatient();

        Roster mockRoster = new Roster();
        mockRoster.setData("uid", MOCK_UID);
        mockRoster.addPatient(pt1);
        mockRoster.addPatient(pt2);
        mockRoster.addPatient(pt3);
        when(mockJdsDao.findByUID(Roster.class, MOCK_UID)).thenReturn(mockRoster);

        List<RosterPatient> patients = s.getRosterPatients(MOCK_UID);

        assertThat(patients.size(), is(3));
        assertThat(patients, hasItems(mockRoster.getPatients().get(0),mockRoster.getPatients().get(1),mockRoster.getPatients().get(2)));

        verify(mockJdsDao).findByUID(Roster.class, MOCK_UID);
    }

    @Test(expected = NotFoundException.class)
    public void testGetRosterPatientsWithUnknownUID() throws Exception {
        when(mockJdsDao.findByUID(Roster.class, MOCK_UID)).thenReturn(null);
        s.getRosterPatients(MOCK_UID);
    }

    @Test
    public void testGetRostersForPatient() throws Exception {
        Roster mockRoster = new Roster();
        mockRoster.setData("uid", MOCK_UID);

        Roster mockRoster2 = new Roster();
        mockRoster2.setData("uid", "urn:va:roster:ABCD:56");

        List<Roster> mockRosters = Arrays.asList(mockRoster, mockRoster2);
        when(mockJdsDao.findAllByIndexAndRange(Roster.class, RosterService.ROSTERS_BY_PATIENT_INDEX, MOCK_PID)).thenReturn(mockRosters);

        List<Roster> rosters = s.getRostersForPatient(MOCK_PID);

        assertThat(rosters, sameInstance(mockRosters));
        verify(mockJdsDao).findAllByIndexAndRange(Roster.class, RosterService.ROSTERS_BY_PATIENT_INDEX, MOCK_PID);
    }
}