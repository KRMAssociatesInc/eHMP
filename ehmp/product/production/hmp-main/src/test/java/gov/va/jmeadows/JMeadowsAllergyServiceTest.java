package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.med.jmeadows.webservice.*;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static gov.va.jmeadows.JMeadowsClientUtils.*;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsAllergyServiceTest {

    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";

    private JMeadowsData mockJMeadowsClient;
    private JMeadowsAllergyService jMeadowsAllergyService;
    private Environment mockEnvironment;

    private String vistaId = "9E7A";
    private String icn = "123456789";
    private String dfn = "4321";
    private String pid = vistaId +";"+ dfn;
    private String uid = "urn:va:patient:"+vistaId+":"+ dfn +":"+ icn;
    private String edipi = "0000000001";

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
        this.jMeadowsAllergyService = new JMeadowsAllergyService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsAllergyService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientAllergies() {
        try {
            when(this.mockJMeadowsClient.getPatientAllergies(any(JMeadowsQuery.class))).thenReturn(createTestData());

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsAllergyService.fetchDodPatientAllergies(query, patientIds);

            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<Allergy> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);

                assertThat(JMeadowsAllergyService.DOMAIN_ALLERGY, is(vistaDataChunk.getDomain()));
                assertThat(2, is(vistaDataChunk.getItemCount()));
                assertThat(i+1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat("DOD;" + edipi, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));

                Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

                Allergy testAllergy = testDataList.get(i);

                assertThat("Allergy/Adverse Reaction", is(jsonMap.get("kind")));
                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:allergy:DOD:"+edipi+":"+testAllergy.getCdrEventId(), is(jsonMap.get("uid")));
                assertThat(testAllergy.getAllergyName(), is(jsonMap.get("summary")));

                List<Map<String, Object>> products = (List<Map<String, Object>>)jsonMap.get("products");

                Map<String, Object> product = products.get(0);
                assertThat(testAllergy.getAllergyName(), is(product.get("name")));

                List<Map<String, Object>> comments = (List<Map<String, Object>>)jsonMap.get("comments");

                Map<String, Object> comment = comments.get(0);
                assertThat(testAllergy.getComment(), is(comment.get("comment")));

                List<Map<String, Object>> codes = (List<Map<String, Object>>)jsonMap.get("codes");

                assertThat(JLVTerminologySystem.UMLS.getUrn(), is(codes.get(0).get("system")));
            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyAllergyList()
    {
        try {

            //return null list
            when(this.mockJMeadowsClient.getPatientAllergies(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsAllergyService.fetchDodPatientAllergies(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));


            //return empty list
            when(this.mockJMeadowsClient.getPatientAllergies(any(JMeadowsQuery.class))).thenReturn(new ArrayList<Allergy>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<Allergy> createTestData() {


        //create two test allergies

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        Allergy allergy1 = new Allergy();
        allergy1.setAllergyName("Aspirin.1");
        allergy1.setComment("test.comments.1");
        Code code1 = new Code();
        code1.setCode("1000");
        code1.setDisplay("test.code.display.1");
        code1.setSystem("UMLS");
        allergy1.getCodes().add(code1);
        allergy1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        allergy1.setSite(dodSite);
        allergy1.setCdrEventId("123456789");

        Allergy allergy2 = new Allergy();
        allergy2.setAllergyName("Aspirin.2");
        allergy2.setComment("test.comments.2");
        Code code2 = new Code();
        code2.setCode("1001");
        code2.setDisplay("test.code.display.2");
        code2.setSystem("UMLS");
        allergy2.getCodes().add(code2);
        allergy2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        allergy2.setSite(dodSite);
        allergy2.setCdrEventId("987654321");

        //generate dod status report beans
        Allergy dodStatusReport1 = new Allergy();
        dodStatusReport1.setAllergyName("status.report.text");
        Site dodStatusSite = new Site();
        dodStatusSite.setMoniker(DOD_STATUS_REPORT_FLAG);
        dodStatusSite.setName(DOD_STATUS_REPORT_FLAG);
        dodStatusSite.setSiteCode(DOD_STATUS_REPORT_FLAG);
        dodStatusReport1.setSite(dodStatusSite);

        //generate connection unavailable bean
        Allergy connectionUnavailable = new Allergy();
        connectionUnavailable.setAllergyName("Connection unavailable.");
        Site caSite = new Site();
        caSite.setMoniker("DOD");
        caSite.setName("DOD");
        caSite.setAgency("DOD");
        caSite.setSiteCode("DOD");
        connectionUnavailable.setSite(caSite);

        return Arrays.asList(allergy1, allergy2, dodStatusReport1, connectionUnavailable);
    }
}
