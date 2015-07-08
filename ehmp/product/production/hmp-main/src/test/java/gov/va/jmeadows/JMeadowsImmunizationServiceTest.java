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
import static gov.va.jmeadows.JMeadowsClientUtils.calendarToPointInTime;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsImmunizationServiceTest {
    
    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";
    private JMeadowsData mockJMeadowsClient;
    private JMeadowsImmunizationService jMeadowsImmunizationService;
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
        this.jMeadowsImmunizationService = new JMeadowsImmunizationService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsImmunizationService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientImmunizations() {
        try {
            when(this.mockJMeadowsClient.getPatientImmunizations(any(JMeadowsQuery.class))).thenReturn(createTestData());
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
            List<VistaDataChunk> vistaDataChunkList = jMeadowsImmunizationService.fetchDodPatientImmunizations(query, patientIds);
            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<Immunization> testDataList = createTestData();
            for(int i = 0; i < vistaDataChunkList.size(); i++) {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);
                assertThat(JMeadowsImmunizationService.DOMAIN_IMMUNIZATION, is(vistaDataChunk.getDomain()));
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

                Immunization testImmunization = testDataList.get(i);

                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:immunization:DOD:"+edipi+":"+testImmunization.getCdrEventId(), is(jsonMap.get("uid")));

                assertThat(testImmunization.getName(), is(jsonMap.get("name")));
                assertThat(testImmunization.getSeries(), is(jsonMap.get("seriesName")));

                assertThat(calendarToPointInTime(testImmunization.getDateTime()).toString(),
                        is(jsonMap.get("administeredDateTime")));


            }
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyImmunizationList() {
        try {
            //return null list
            when(this.mockJMeadowsClient.getPatientImmunizations(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsImmunizationService.fetchDodPatientImmunizations(query, patientIds);
            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

            //return empty list
            when(this.mockJMeadowsClient.getPatientImmunizations(any(JMeadowsQuery.class))).thenReturn(new ArrayList<Immunization>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));
        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<Immunization> createTestData() throws JMeadowsException_Exception {

        //create two test Immunizations

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        Immunization immunization1 = new Immunization();
        immunization1.setName("immunization1.name");
        immunization1.setSeries("immunization1.series");

        XMLGregorianCalendar cal1 = null;
        try {
            cal1 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        }catch (DatatypeConfigurationException dce) {
            throw new JMeadowsException_Exception("data type factory error", null);
        }

        cal1.setDay(11);
        cal1.setMonth(3);
        cal1.setYear(2012);

        immunization1.setDateTime(cal1);

        immunization1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        immunization1.setSite(dodSite);
        immunization1.setCdrEventId("123456789");

        Immunization immunization2 = new Immunization();

        immunization2.setName("immunization2.name");
        immunization2.setSeries("immunization2.series");

        XMLGregorianCalendar cal2 = null;
        try {
            cal2 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        }catch (DatatypeConfigurationException dce) {
            throw new JMeadowsException_Exception("data type factory error", null);
        }

        cal2.setDay(23);
        cal2.setMonth(9);
        cal2.setYear(2011);

        immunization2.setDateTime(cal2);

        immunization2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        immunization2.setSite(dodSite);
        immunization2.setCdrEventId("987654321");

        return Arrays.asList(immunization1, immunization2);
    }
}

