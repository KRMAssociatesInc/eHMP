package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.med.jmeadows.webservice.*;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static gov.va.jmeadows.JMeadowsClientUtils.SOURCE_PROTOCOL_DODADAPTER;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsVitalServiceTest {
    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";
    private JMeadowsData mockJMeadowsClient;
    private JMeadowsVitalService jMeadowsVitalService;
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
        this.jMeadowsVitalService = new JMeadowsVitalService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsVitalService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientVitals() {
        try {
            when(this.mockJMeadowsClient.getPatientVitals(any(JMeadowsQuery.class))).thenReturn(createTestData());
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
            List<VistaDataChunk> vistaDataChunkList = jMeadowsVitalService.fetchDodPatientVitals(query, patientIds);
            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<Vitals> testDataList = createTestData();
            for(int i = 0; i < vistaDataChunkList.size(); i++) {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);
                assertThat(JMeadowsVitalService.DOMAIN_VITAL, is(vistaDataChunk.getDomain()));
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
                Vitals testVital = testDataList.get(i);
                assertThat("Vital Sign", is(jsonMap.get("kind")));
                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:vital:DOD:"+edipi+":"+testVital.getCdrEventId(), is(jsonMap.get("uid")));
                assertThat(testVital.getVitalType(), is(jsonMap.get("typeName")));
                assertThat(testVital.getRate(), is(jsonMap.get("result")));
                assertThat(testVital.getUnits(), is(jsonMap.get("units")));

                List<Map<String, Object>> codes = (List<Map<String, Object>>)jsonMap.get("codes");

                assertThat(JLVTerminologySystem.LOINC.getUrn(), is(codes.get(0).get("system")));
            }
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyVitalList() {
        try {
            //return null list
            when(this.mockJMeadowsClient.getPatientVitals(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsVitalService.fetchDodPatientVitals(query, patientIds);
            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

            //return empty list
            when(this.mockJMeadowsClient.getPatientVitals(any(JMeadowsQuery.class))).thenReturn(new ArrayList<Vitals>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<Vitals> createTestData() throws JMeadowsException_Exception {
        XMLGregorianCalendar cal = null;
        try {
            cal = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        }catch (DatatypeConfigurationException dce) {
            throw new JMeadowsException_Exception("data type factory error", null);
        }

        //create two test vitals

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        Vitals vital1 = new Vitals();
        vital1.setVitalType("PULSE");
        vital1.setRate("96");
        vital1.setUnits("/min");
        vital1.setDateTimeTaken(cal);
        Code code1 = new Code();
        code1.setCode("1000");
        code1.setDisplay("test.code.display.1");
        code1.setSystem("LOINC");
        vital1.getCodes().add(code1);
        vital1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        vital1.setSite(dodSite);
        vital1.setCdrEventId("123456789");

        Vitals vital2 = new Vitals();
        vital2.setVitalType("WEIGHT");
        vital2.setRate("210");
        vital2.setUnits("lb");
        vital2.setDateTimeTaken(cal);
        Code code2 = new Code();
        code2.setCode("1001");
        code2.setDisplay("test.code.display.2");
        code2.setSystem("VITALS");
        vital2.getCodes().add(code2);
        vital2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        vital2.setSite(dodSite);
        vital2.setCdrEventId("987654321");

        //generate dod status report beans
        Vitals dodStatusReport1 = new Vitals();
        dodStatusReport1.setVitalType("status.report.text");
        Site dodStatusSite = new Site();
        dodStatusSite.setMoniker(DOD_STATUS_REPORT_FLAG);
        dodStatusSite.setName(DOD_STATUS_REPORT_FLAG);
        dodStatusSite.setSiteCode(DOD_STATUS_REPORT_FLAG);
        dodStatusReport1.setSite(dodStatusSite);

        //generate connection unavailable bean
        Vitals connectionUnavailable = new Vitals();
        connectionUnavailable.setRate("Connection unavailable.");
        Site caSite = new Site();
        caSite.setMoniker("DOD");
        caSite.setName("DOD");
        caSite.setAgency("DOD");
        caSite.setSiteCode("DOD");
        connectionUnavailable.setSite(caSite);

        return Arrays.asList(vital1, vital2, dodStatusReport1, connectionUnavailable);
    }
}
