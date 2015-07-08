package gov.va.jmeadows;

import static gov.va.jmeadows.JMeadowsClientUtils.SOURCE_PROTOCOL_DODADAPTER;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
//import gov.va.med.jmeadows.webservice.Allergy;
import gov.va.med.jmeadows.webservice.Code;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import gov.va.med.jmeadows.webservice.JMeadowsException_Exception;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.Patient;
import gov.va.med.jmeadows.webservice.PatientEncounter;
import gov.va.med.jmeadows.webservice.Site;
import gov.va.med.jmeadows.webservice.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

public class JMeadowsEncounterServiceTest {

    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";

    private JMeadowsData mockJMeadowsClient;
    private JMeadowsEncounterService jMeadowsEncounterService;
    private Environment mockEnvironment;

    private String vistaId = "9E7A";
    private String icn = "123456789";
    private String dfn = "4321";
    private String edipi = "0000000001";
    private String pid = "DOD" +";"+ edipi;
    private String uid = "urn:va:patient:"+vistaId+":"+ dfn +":"+ icn;

    private String url = "test.url";
    private long timeoutMS = 45000;
    private String userName = "test.username";
    private String userIen = "test.ien";
    private String userSiteCode = "test.sitecode";
    private String userSiteName = "test.sitename";

    private User user;
    private Patient patient;

    @Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn(userName);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn(userIen);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn(userSiteCode);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn(userSiteName);

        this.mockJMeadowsClient = mock(JMeadowsData.class);
        this.jMeadowsEncounterService = new JMeadowsEncounterService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsEncounterService.setJMeadowsClient(mockJMeadowsClient);

        user = new User();
        user.setUserIen("test.ien");
        Site hostSite = new Site();
        hostSite.setSiteCode("test.site.code");
        hostSite.setAgency("VA");
        hostSite.setMoniker("test.moniker");
        hostSite.setName("test.site.name");
        user.setHostSite(hostSite);

        patient = new Patient();
        patient.setEDIPI("test.edipi");
    }

    @Test
    public void testFetchPatientEncounters() {
        try {
            when(this.mockJMeadowsClient.getPatientEncounters(any(JMeadowsQuery.class))).thenReturn(createTestData());

            JMeadowsQuery query = new JMeadowsQueryBuilder()
                    .user(user)
                    .patient(patient)
                    .build();


            PatientIds patientIds = new PatientIds.Builder()
                    .pid(pid)
                    .icn(icn)
                    .uid(uid)
                    .edipi(edipi)
                    .build();

            List<VistaDataChunk> vistaDataChunkList = jMeadowsEncounterService.fetchDodPatientEncounters(query, patientIds);

            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<PatientEncounter> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);

                assertThat(JMeadowsEncounterService.DOMAIN_ENCOUNTER_VISIST, is(vistaDataChunk.getDomain()));
                assertThat(2, is(vistaDataChunk.getItemCount()));
                assertThat(i+1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat(pid, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));

                Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

                PatientEncounter testPatientEncounter = testDataList.get(i);

                //assertThat("Allergy/Adverse Reaction", is(jsonMap.get("kind")));
                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:visit:DOD:"+edipi+":"+testPatientEncounter.getCdrEventId(), is(jsonMap.get("uid")));

                List<Map<String, Object>> providers = (List<Map<String, Object>>)jsonMap.get("providers");

                Map<String, Object> provider = providers.get(0);
                assertThat(testPatientEncounter.getProvider(), is(provider.get("name")));
            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyPatientEncounterList()
    {
        try {

            //return null list
            when(this.mockJMeadowsClient.getPatientEncounters(any(JMeadowsQuery.class))).thenReturn(null);

            JMeadowsQuery query = new JMeadowsQueryBuilder()
                    .user(user)
                    .patient(patient)
                    .build();

            PatientIds patientIds = new PatientIds.Builder()
                    .pid(pid)
                    .icn(icn)
                    .uid(uid)
                    .edipi(edipi)
                    .build();

            List<VistaDataChunk> vistaDataChunkList = jMeadowsEncounterService.fetchDodPatientEncounters(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));


            //return empty list
            when(this.mockJMeadowsClient.getPatientEncounters(any(JMeadowsQuery.class))).thenReturn(new ArrayList<PatientEncounter>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<PatientEncounter> createTestData() {


        //create two test Encounters

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        PatientEncounter encounter1 = new PatientEncounter();
        encounter1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        encounter1.setSite(dodSite);
        encounter1.setCdrEventId("123456789");

        PatientEncounter encounter2 = new PatientEncounter();
        encounter2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        encounter2.setSite(dodSite);
        encounter2.setCdrEventId("987654321");

        //generate dod status report beans
        PatientEncounter dodStatusReport1 = new PatientEncounter();
        //dodStatusReport1.setAllergyName("status.report.text");
        Site dodStatusSite = new Site();
        dodStatusSite.setMoniker(DOD_STATUS_REPORT_FLAG);
        dodStatusSite.setName(DOD_STATUS_REPORT_FLAG);
        dodStatusSite.setSiteCode(DOD_STATUS_REPORT_FLAG);
        dodStatusReport1.setSite(dodStatusSite);

        //generate connection unavailable bean
        PatientEncounter connectionUnavailable = new PatientEncounter();
        Site caSite = new Site();
        caSite.setMoniker("DOD");
        caSite.setName("DOD");
        caSite.setAgency("DOD");
        caSite.setSiteCode("DOD");
        connectionUnavailable.setSite(caSite);

        return Arrays.asList(encounter1, encounter2, dodStatusReport1, connectionUnavailable);
    }

}
