package gov.va.hmp.ptselect;

import com.google.common.collect.ImmutableMap;
import gov.va.cpe.odc.Location;
import gov.va.cpe.odc.Person;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import gov.va.hmp.vista.rpc.LineMapper;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponseExtractor;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.*;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.*;
import static gov.va.hmp.ptselect.PatientSelectService.GET_CLINIC_PATIENTS_COMMAND;
import static gov.va.hmp.ptselect.PatientSelectService.GET_CPRS_DEFAULT_LIST_PATIENTS_COMMAND;
import static gov.va.hmp.ptselect.PatientSelectService.GET_WARD_PATIENTS_COMMAND;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class PatientSelectServiceTests {

    private static final String MOCK_USER_DUZ = "1804";
    private static final String MOCK_VISTA_SYSTEM_ID = "AAAA";
    public static final String MOCK_HMP_SERVER_ID = "mock.hmp.server.id";

    private PatientSelectService s;
    private RpcOperations mockRpcTemplate;
    private IPatientSelectDAO mockPatientSelectDao;
    private IGenericPOMObjectDAO mockGenericPOMObjectDAO;
    private UserContext mockUserContext;
    private List<Map<String, Object>> mockPatientMaps;
    private List<PatientSelect> mockPatientSelects;
    private VistaPatientSelectsAndMetadata mockVistaSelects;
    private List<String> mockPids;
    private Map<String, String> mockUids2Pids;
    private Environment mockEnvironment;

    @Before
    public void setUp() throws Exception {
        Map<String, Object> pt1 = new HashMap<String, Object>();
        pt1.put("localId", "229");
        pt1.put("fullName", "ABCD");
        pt1.put("pid", PidUtils.getPid(MOCK_VISTA_SYSTEM_ID, "229"));

        Map<String, Object> pt2 = new HashMap<String, Object>();
        pt2.put("localId", "300");
        pt2.put("fullName", "EFGH");
        pt2.put("pid", PidUtils.getPid(MOCK_VISTA_SYSTEM_ID, "300"));

        mockUids2Pids = new HashMap<String, String>();

        mockPatientMaps = new ArrayList<Map<String, Object>>();
        mockPatientMaps.add(pt1);
        mockPatientMaps.add(pt2);

        mockPids = new ArrayList<String>();
        mockPids.add(pt1.get("pid").toString());
        mockPids.add(pt2.get("pid").toString());

        mockPatientSelects = new ArrayList<>();
        for (Map ptVals : mockPatientMaps) {
            mockPatientSelects.add(new PatientSelect(ptVals));

            mockUids2Pids.put((String) ptVals.get("uid"), (String) ptVals.get("pid"));
        }

        mockVistaSelects = new VistaPatientSelectsAndMetadata();
        mockVistaSelects.getPatients().add(new VistaPatientSelect(pt1.get("pid").toString(), null, "Inpatient", "1-A", null, null, null));
        mockVistaSelects.getPatients().add(new VistaPatientSelect(pt2.get("pid").toString(), null, "Outpatient", null, new PointInTime(2014, 6, 4, 10, 30), null, null));

        mockPatientSelectDao = mock(IPatientSelectDAO.class);
        mockRpcTemplate = mock(RpcOperations.class);
        mockUserContext = mock(UserContext.class);
        mockGenericPOMObjectDAO = mock(IGenericPOMObjectDAO.class);
        mockEnvironment = mock(Environment.class);

        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn(MOCK_HMP_SERVER_ID);

        HmpUserDetails mockUser = mock(HmpUserDetails.class);
        when(mockUser.getDUZ()).thenReturn(MOCK_USER_DUZ);
        when(mockUser.getVistaId()).thenReturn(MOCK_VISTA_SYSTEM_ID);
        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);

        Map<String, Object> mockRoster = new HashMap<String, Object>();
        mockRoster.put("id", "57");
        mockRoster.put("name", "dummyroster");
        mockRoster.put("patients", mockPatientMaps);

        s = new PatientSelectService();
        s.setRpcTemplate(mockRpcTemplate);
        s.setPatientSelectDAO(mockPatientSelectDao);
        s.setPOMObjectDAO(mockGenericPOMObjectDAO);
        s.setEnvironment(mockEnvironment);
    }

    @Test
    public void testFetchWardList() throws Exception {
        List<Map<String, Object>> mockWardMaps = createListOfMaps("129", "7A SURG", "229", "GEN MED");
        List<Location> mockWards = new ArrayList<Location>();
        for (Map<String, Object> ward : mockWardMaps) {
        	ward.put("displayName", VistaStringUtils.nameCase(ward.get("name").toString()));
        	ward.put("uid", UidUtils.getUserUid(MOCK_VISTA_SYSTEM_ID, ward.get("localId").toString()));
        	mockWards.add(POMUtils.newInstance(Location.class, ward));
        }
        PageRequest pageable = new PageRequest(0, 5);
        when(mockGenericPOMObjectDAO.findAllByIndexAndRange(Location.class, "locations-wards", "*", pageable)).thenReturn(new PageImpl<Location>(mockWards));

        Page<Map<String, Object>> wards = s.searchWards("", pageable);
        verify(mockGenericPOMObjectDAO).findAllByIndexAndRange(Location.class, "locations-wards", "*", pageable);
        assertThat(wards.getContent().get(0).get("uid"), is(mockWardMaps.get(0).get("uid")));
        assertThat(wards.getContent().get(0).get("name"), is(mockWardMaps.get(0).get("name")));
        assertThat(wards.getContent().get(1).get("uid"), is(mockWardMaps.get(1).get("uid")));
        assertThat(wards.getContent().get(1).get("name"), is(mockWardMaps.get(1).get("name")));
    }

    @Test
    public void testFetchClinicList() throws Exception {
    	List<Map<String, Object>> mockClinicMaps = createListOfMaps("129", "7A SURG", "229", "GEN MED");
        List<Location> mockClinics = new ArrayList<Location>();
        for (Map<String, Object> clinic : mockClinicMaps) {
        	clinic.put("displayName", VistaStringUtils.nameCase(clinic.get("name").toString()));
        	clinic.put("uid", UidUtils.getUserUid(MOCK_VISTA_SYSTEM_ID, clinic.get("localId").toString()));
        	mockClinics.add(POMUtils.newInstance(Location.class, clinic));
        }
        PageRequest pageable = new PageRequest(0, 5);
        when(mockGenericPOMObjectDAO.findAllByIndexAndRange(Location.class, "locations-clinics", "*", pageable)).thenReturn(new PageImpl<Location>(mockClinics));

        Page<Map<String, Object>> clinics = s.searchClinics("", pageable);
        verify(mockGenericPOMObjectDAO).findAllByIndexAndRange(Location.class, "locations-clinics", "*", pageable);
        assertThat(clinics.getContent().get(0).get("uid"), is(mockClinicMaps.get(0).get("uid")));
        assertThat(clinics.getContent().get(0).get("name"), is(mockClinicMaps.get(0).get("name")));
        assertThat(clinics.getContent().get(1).get("uid"), is(mockClinicMaps.get(1).get("uid")));
        assertThat(clinics.getContent().get(1).get("name"), is(mockClinicMaps.get(1).get("name")));
    }

    @Ignore
    @Test
    public void testFetchSpecialtyList() throws Exception {
        List<Map<String, Object>> mockSpecialties = createListOfMaps("129", "BLIND REHAB", "229", "CARDIOLOGY");
        when(mockRpcTemplate.execute(any(LineMapper.class), eq(ORQPT_SPECIALTIES_URI), any(List.class))).thenReturn(mockSpecialties);

        Page<Map<String, Object>> specialties = s.searchSpecialties("", new PageRequest(0, 5));

        verify(mockRpcTemplate).execute(any(LineMapper.class), eq(ORQPT_SPECIALTIES_URI), any(List.class));
        assertThat(specialties, hasItems(mockSpecialties.get(0), mockSpecialties.get(1)));
    }

    @Test
    public void testFetchProviderList() throws Exception {
        List<Map<String, Object>> mockProviderMaps = createListOfMaps("129", "AVIVAUSER,THIRTYTHREE", "229", "PHARMACIST,ONE");
        List<Person> mockProviders = new ArrayList<Person>();
        for (Map<String, Object> provider : mockProviderMaps) {
            provider.put("displayName", VistaStringUtils.nameCase(provider.get("name").toString()));
            provider.put("uid", UidUtils.getUserUid(MOCK_VISTA_SYSTEM_ID, provider.get("localId").toString()));
            mockProviders.add(POMUtils.newInstance(Person.class, provider));
        }

        PageRequest pageable = new PageRequest(0, 5);
        when(mockGenericPOMObjectDAO.findAllByIndexAndRange(Person.class, "person", "*", pageable)).thenReturn(new PageImpl<Person>(mockProviders, pageable, 23));

        Page<Map<String, Object>> providers = s.searchProviders("", pageable);

        verify(mockGenericPOMObjectDAO).findAllByIndexAndRange(Person.class, "person", "*", pageable);
        assertThat(providers.getContent().get(0).get("uid"), is(mockProviderMaps.get(0).get("uid")));
        assertThat(providers.getContent().get(0).get("name"), is(mockProviderMaps.get(0).get("name")));
        assertThat(providers.getContent().get(1).get("uid"), is(mockProviderMaps.get(1).get("uid")));
        assertThat(providers.getContent().get(1).get("name"), is(mockProviderMaps.get(1).get("name")));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSearchWithNull() throws Exception {
        s.searchPatients(null, new PageRequest(0, 5));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSearchWithEmptyString() throws Exception {
        s.searchPatients("", new PageRequest(0, 5));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testSearchWithBlankString() throws Exception {
        s.searchPatients(" ", new PageRequest(0, 5));
    }

    @Test
    public void testSearchWithPagination() throws Exception {
        when(mockPatientSelectDao.findAllByName("abcd", new PageRequest(0, 5))).thenReturn(new PageImpl<PatientSelect>(mockPatientSelects));

        Page<PatientSelect> matches = s.searchPatients("abcd", new PageRequest(0, 5));

        verify(mockPatientSelectDao).findAllByName("abcd", new PageRequest(0, 5));
        assertThat(matches.getNumberOfElements(), is(2));
    }

    @Test
    public void testSearchForSSN() throws Exception {
        when(mockPatientSelectDao.findAllBySSN("12345", new PageRequest(0, 5))).thenReturn(new PageImpl<PatientSelect>(mockPatientSelects));

        Page<PatientSelect> matches = s.searchPatients("12345", new PageRequest(0, 5));

        assertThat(matches.getNumberOfElements(), is(2));
        verify(mockPatientSelectDao).findAllBySSN("12345", new PageRequest(0, 5));
    }

    @Test
    public void testSearchForSSNWithDashes() throws Exception {
        when(mockPatientSelectDao.findAllBySSN("123-45-6789", new PageRequest(0, 5))).thenReturn(new PageImpl<PatientSelect>(mockPatientSelects));

        Page<PatientSelect> matches = s.searchPatients("123-45-6789", new PageRequest(0, 5));

        assertThat(matches.getNumberOfElements(), is(2));
        verify(mockPatientSelectDao).findAllBySSN("123-45-6789", new PageRequest(0, 5));
    }

    @Test
    public void testSearchForSSNWithP() throws Exception {
        when(mockPatientSelectDao.findAllBySSN("123-45-6789P", new PageRequest(0, 5))).thenReturn(new PageImpl<PatientSelect>(mockPatientSelects));

        Page<PatientSelect> matches = s.searchPatients("123-45-6789P", new PageRequest(0, 5));

        assertThat(matches.getNumberOfElements(), is(2));
        verify(mockPatientSelectDao).findAllBySSN("123-45-6789P", new PageRequest(0, 5));
    }

    @Test
    public void testSearchForLast4() throws Exception {
        when(mockPatientSelectDao.findAllByLast4("6789", new PageRequest(0, 5))).thenReturn(new PageImpl<PatientSelect>(mockPatientSelects));

        Page<PatientSelect> matches = s.searchPatients("6789", new PageRequest(0, 5));

        assertThat(matches.getNumberOfElements(), is(2));
        verify(mockPatientSelectDao).findAllByLast4("6789", new PageRequest(0, 5));
    }

    @Test
    public void testSearchForLast5() throws Exception {
        when(mockPatientSelectDao.findAllByLast5("B6789", new PageRequest(0, 5))).thenReturn(new PageImpl<PatientSelect>(mockPatientSelects));

        Page<PatientSelect> matches = s.searchPatients("B6789", new PageRequest(0, 5));

        assertThat(matches.getNumberOfElements(), is(2));
        verify(mockPatientSelectDao).findAllByLast5("B6789", new PageRequest(0, 5));
    }

    @Test
    public void testSearchInWard() throws Exception {
        String wardUid = "urn:va:location:DCBA:23";
        String wardRefId = "56";

        Location ward = new Location();
        ward.setData("uid", wardUid);
        ward.setData("refId", wardRefId);

        Map rpcArg = ImmutableMap.of("server", MOCK_HMP_SERVER_ID, "command", GET_WARD_PATIENTS_COMMAND, "id", wardRefId);

        when(mockGenericPOMObjectDAO.findByUID(Location.class, wardUid)).thenReturn(ward);
        when(mockRpcTemplate.execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg))).thenReturn(mockVistaSelects);
        when(mockPatientSelectDao.findAllPids(mockPids)).thenReturn(mockPatientSelects);

        PatientSelectsAndMetadata matches = s.searchPatientsInWard("b", wardUid, new PageRequest(0, 5));

        verify(mockGenericPOMObjectDAO).findByUID(Location.class, wardUid);
        verify(mockRpcTemplate).execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg));
        verify(mockPatientSelectDao).findAllPids(mockPids);

        assertThat(matches.getPatients().getNumberOfElements(), is(1)); // should only have matched 1 of 2 returned
        assertThat(matches.getPatients().getContent().get(0).getFullName().toString(), is("ABCD"));
        assertThat(matches.getPatients().getContent().get(0).getPid(), is(mockPids.get(0)));
        assertThat((String) matches.getPatients().getContent().get(0).getProperty("patientType"), is("Inpatient"));
        assertThat((String) matches.getPatients().getContent().get(0).getProperty("roomBed"), is("1-A"));
    }

    @Test(expected = NotFoundException.class)
    public void testSearchInWardNotFound() throws Exception {
        String wardUid = "urn:va:location:DCBA:23";

        when(mockGenericPOMObjectDAO.findByUID(Location.class, wardUid)).thenReturn(null);

        s.searchPatientsInWard("b", wardUid, new PageRequest(0, 5));
    }

    @Test
    public void testSearchInClinic() throws Exception {
        String clinicLocalId = "34";
        String clinicUid = "urn:va:location:" + MOCK_VISTA_SYSTEM_ID + ":" + clinicLocalId;

        Location location = new Location(Collections.<String, Object>singletonMap("uid", clinicUid));
        location.setData("localId", clinicLocalId);

        Map rpcArg = new HashMap();
        rpcArg.put("server", MOCK_HMP_SERVER_ID);
        rpcArg.put("command", GET_CLINIC_PATIENTS_COMMAND);
        rpcArg.put("id", clinicLocalId);
        rpcArg.put("start", "T+1");
        rpcArg.put("end", "T+1");

        when(mockGenericPOMObjectDAO.findByUID(Location.class, clinicUid)).thenReturn(location);
        when(mockRpcTemplate.execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg))).thenReturn(mockVistaSelects);
        when(mockPatientSelectDao.findAllPids(mockPids)).thenReturn(mockPatientSelects);

        PatientSelectsAndMetadata matches = s.searchPatientsInClinic("f", clinicUid, "T+1..T+1", new PageRequest(0, 5));

        verify(mockGenericPOMObjectDAO).findByUID(Location.class, clinicUid);
        verify(mockRpcTemplate).execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg));
        verify(mockPatientSelectDao).findAllPids(mockPids);

        assertThat(matches.getPatients().getNumberOfElements(), is(1)); // should only have matched 1 of 2 returned
        assertThat(matches.getPatients().getContent().get(0).getFullName().toString(), is("EFGH"));
        assertThat(matches.getPatients().getContent().get(0).getPid(), is(mockPids.get(1)));
        assertThat((String) matches.getPatients().getContent().get(0).getProperty("patientType"), is("Outpatient"));
        assertThat((String) matches.getPatients().getContent().get(0).getProperty("appointment"), is("201406041030"));
    }

    @Test
    public void testSearchInClinicFindsNoMatches() throws Exception {
        String clinicLocalId = "34";
        String clinicUid = "urn:va:location:" + MOCK_VISTA_SYSTEM_ID + ":" + clinicLocalId;

        Location location = new Location(Collections.<String, Object>singletonMap("uid", clinicUid));
        location.setData("localId", clinicLocalId);

        Map rpcArg = new HashMap();
        rpcArg.put("server", MOCK_HMP_SERVER_ID);
        rpcArg.put("command", GET_CLINIC_PATIENTS_COMMAND);
        rpcArg.put("id", clinicLocalId);
        rpcArg.put("start", "T+1");
        rpcArg.put("end", "T+1");

        when(mockGenericPOMObjectDAO.findByUID(Location.class, clinicUid)).thenReturn(location);
        when(mockRpcTemplate.execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg))).thenReturn(new VistaPatientSelectsAndMetadata());
        when(mockPatientSelectDao.findAllPids(mockPids)).thenReturn(mockPatientSelects);

        PatientSelectsAndMetadata matches = s.searchPatientsInClinic("f", clinicUid, "T+1..T+1", new PageRequest(0, 5));

        verify(mockGenericPOMObjectDAO).findByUID(Location.class, clinicUid);
        verify(mockRpcTemplate).execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg));

        verify(mockPatientSelectDao).findAllPids(Collections.<String>emptyList());

        assertThat(matches.getPatients().getNumberOfElements(), is(0));
        assertThat(matches.getPatients().getContent().isEmpty(), is(true));
    }

    @Test(expected = NotFoundException.class)
    public void testSearchInClinicNotFound() throws Exception {
        String clinicUid = "urn:va:location:DCBA:23";

        when(mockGenericPOMObjectDAO.findByUID(Location.class, clinicUid)).thenReturn(null);

        s.searchPatientsInClinic("f", clinicUid, "T+1..T+1", new PageRequest(0, 5));
    }

    @Ignore
    @Test
    public void testSearchInSpecialty() throws Exception {
        when(mockRpcTemplate.execute(any(LineMapper.class), eq(UserInterfaceRpcConstants.ORQPT_SPECIALTY_PATIENTS_RPC_URI), eq("45"))).thenReturn(mockPids);
        when(mockPatientSelectDao.findAllLocalIds(MOCK_VISTA_SYSTEM_ID, mockPids)).thenReturn(mockPatientSelects);

        PatientSelectsAndMetadata matches = s.searchPatientsInSpecialty("a", "45", new PageRequest(0, 5));

        verify(mockRpcTemplate).execute(any(LineMapper.class), eq(UserInterfaceRpcConstants.ORQPT_SPECIALTY_PATIENTS_RPC_URI), eq("45"));
        verify(mockPatientSelectDao).findAllLocalIds(MOCK_VISTA_SYSTEM_ID, mockPids);

        assertThat(matches.getPatients().getNumberOfElements(), is(1)); // should only have matched 1 of 2 returned by roster preview
        assertThat(matches.getPatients().getContent().get(0).getFullName().toString(), is("ABCD"));
        assertThat(matches.getPatients().getContent().get(0).getPid(), is("12"));
    }

    @Ignore
    @Test
    public void testSearchByProvider() throws Exception {
        when(mockRpcTemplate.execute(any(LineMapper.class), eq(UserInterfaceRpcConstants.ORQPT_PROVIDER_PATIENTS_RPC_URI), eq("56"))).thenReturn(mockPids);
        when(mockPatientSelectDao.findAllLocalIds(MOCK_VISTA_SYSTEM_ID, mockPids)).thenReturn(mockPatientSelects);

        PatientSelectsAndMetadata matches = s.searchPatientsByProvider("g", "56", new PageRequest(0, 5));

        verify(mockRpcTemplate).execute(any(LineMapper.class), eq(UserInterfaceRpcConstants.ORQPT_PROVIDER_PATIENTS_RPC_URI), eq("56"));
        verify(mockPatientSelectDao).findAllLocalIds(MOCK_VISTA_SYSTEM_ID, mockPids);

        assertThat(matches.getPatients().getNumberOfElements(), is(1)); // should only have matched 1 of 2
        assertThat(matches.getPatients().getContent().get(0).getFullName().toString(), is("EFGH"));
        assertThat(matches.getPatients().getContent().get(0).getPid(), is("22"));
    }

    @Test
    public void testSearchWithCPRSDefaultList() throws Exception {
        Map rpcArg = ImmutableMap.of("server", MOCK_HMP_SERVER_ID, "command", GET_CPRS_DEFAULT_LIST_PATIENTS_COMMAND);

        when(mockRpcTemplate.execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg))).thenReturn(mockVistaSelects);
        when(mockPatientSelectDao.findAllPids(mockPids)).thenReturn(mockPatientSelects);

        PatientSelectsAndMetadata matches = s.searchPatientsInCPRSDefaultList("abcd", UidUtils.getUserUid("DCBA", MOCK_USER_DUZ), new PageRequest(0, 5));

        verify(mockRpcTemplate).execute(any(RpcResponseExtractor.class), eq(CONTROLLER_RPC_URI), eq(rpcArg));
        verify(mockPatientSelectDao).findAllPids(mockPids);

        assertThat(matches.getPatients().getNumberOfElements(), is(1)); // should only have matched 1 of 2
        assertThat(matches.getPatients().getContent().get(0).getFullName().toString(), is("ABCD"));
        assertThat(matches.getPatients().getContent().get(0).getPid(), is(mockPids.get(0)));
    }

    private List<Map<String, Object>> createListOfMaps(String id1, String name1, String id2, String name2) {
        Map<String, Object> obj1 = new HashMap<String, Object>();
        obj1.put("localId", id1);
        obj1.put("name", name1);
        obj1.put("displayName", VistaStringUtils.nameCase(name1));

        Map<String, Object> obj2 = new HashMap<String, Object>();
        obj2.put("localId", id2);
        obj2.put("name", name2);
        obj2.put("displayName", VistaStringUtils.nameCase(name2));

        List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
        items.add(obj1);
        items.add(obj2);

        return items;
    }
}
