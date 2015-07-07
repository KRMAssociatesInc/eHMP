package gov.va.jmeadows;


import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.LoggingUtil;
import gov.va.med.jmeadows.webservice.*;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static gov.va.jmeadows.JMeadowsClientUtils.*;
import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsDemographicsServiceTest {


    private JMeadowsData mockJMeadowsClient;
    private JMeadowsDemographicsService jMeadowsDemographicsService;
    private Environment mockEnvironment;

    static final SimpleDateFormat fmt = new SimpleDateFormat("dd MMM yyyy");

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

    /*@Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn("http://10.4.4.104/jMeadows/JMeadowsDataService?wsdl");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" +4500);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn("VEHU,TEN");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn("20012");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn("200");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn("CAMP MASTER");


        this.mockJMeadowsClient = JMeadowsClientFactory.getInstance(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsDemographicsService = new JMeadowsDemographicsService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsDemographicsService.setJMeadowsClient(mockJMeadowsClient);

        user = new User();
        user.setUserIen("20012");
        Site hostSite = new Site();
        hostSite.setSiteCode("200");
        hostSite.setAgency("VA");
        hostSite.setMoniker("CAMP MASTER");
        hostSite.setName("CAMP MASTER");
        user.setHostSite(hostSite);

        patient = new Patient();
        patient.setEDIPI("666000008");
    } */



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
        this.jMeadowsDemographicsService = new JMeadowsDemographicsService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsDemographicsService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientDemographics() {
        try {

            when(this.mockJMeadowsClient.getPatientDemographics(any(JMeadowsQuery.class))).thenReturn(createTestData());

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsDemographicsService.fetchDodPatientDemographics(query, patientIds);

            assertNotNull(vistaDataChunkList);

            assertThat(vistaDataChunkList.size(), is(2));

            List<PatientDemographics> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);

                assertThat(JMeadowsDemographicsService.DOMAIN_DEMOGRAPHICS, is(vistaDataChunk.getDomain()));
                assertThat(2, is(vistaDataChunk.getItemCount()));
                assertThat(i+1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat("DOD;"+edipi, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));

                Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();
                System.out.println("VistaChunk map: " + LoggingUtil.mapContentsOutput("", "vistaDataChunk: ", jsonMap));

                PatientDemographics testDemographic = testDataList.get(i);

                assertThat(testDemographic.getName(), is(jsonMap.get("fullName")));
                assertThat(testDemographic.getName(), is(jsonMap.get("displayName")));
                assertThat(testDemographic.getSSN(), is(jsonMap.get("ssn")));
                assertThat(testDemographic.getGender(), is(jsonMap.get("genderName")));
                
                System.out.println("testDemographic.getICN(): " + testDemographic.getICN());
                System.out.println("jsonMap.get(icn): " + jsonMap.get("icn"));
                assertThat(testDemographic.getICN(), is(jsonMap.get("icn")));

                String dob = testDemographic.getDob();

                try
                {
                    Calendar cal = calendarFromString(dob);
                    PointInTime pt1 =  new PointInTime(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH));
                    assertThat(pt1.toString(), is(jsonMap.get("birthDate")));


                }catch (ParseException e)
                {
                    fail(e.getMessage());
                }


                List<Map<String, Object>> addresses = (List<Map<String, Object>>)jsonMap.get("addresses");

                assertNotNull(addresses);

                assertThat(addresses.size(), is(1));

                Map<String, Object> addr = addresses.get(0);

                assertThat(testDemographic.getCity(), is(addr.get("city")));
                assertThat(testDemographic.getAddress1(), is(addr.get("line1")));
                assertThat(testDemographic.getAddress2(), is(addr.get("line2")));
                assertThat(testDemographic.getZipCode(), is(addr.get("zip")));
                assertThat(testDemographic.getState(), is(addr.get("state")));

            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyLabList()
    {
        try {

            //return null list
            when(this.mockJMeadowsClient.getPatientDemographics(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsDemographicsService.fetchDodPatientDemographics(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));


            //return empty list
            when(this.mockJMeadowsClient.getPatientDemographics(any(JMeadowsQuery.class))).thenReturn(new ArrayList<PatientDemographics>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<PatientDemographics> createTestData()  {



        //create two test patient demographics

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        PatientDemographics patientDemographics1 = new PatientDemographics();
        patientDemographics1.setAddress1("patient.address.1");
        patientDemographics1.setAddress2("patient.address.2");
        patientDemographics1.setCity("patient.city");
        patientDemographics1.setGender("patient.gender");
        patientDemographics1.setName("patient.name");
        patientDemographics1.setPhone1("patient.phone.1");
        patientDemographics1.setSSN("patient.ssn");
        patientDemographics1.setState("patient.state");
        patientDemographics1.setZipCode("patient.zip");
        patientDemographics1.setCodeGreen("0");
        patientDemographics1.setDob("16 Jul 1971");
        patientDemographics1.setSite(dodSite);
        patientDemographics1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        patientDemographics1.setCdrEventId("123456789");
        patientDemographics1.setICN(icn);


        PatientDemographics patientDemographics2 = new PatientDemographics();
        patientDemographics2.setAddress1("patient.address.1");
        patientDemographics2.setAddress2("patient.address.2");
        patientDemographics2.setCity("patient.city");
        patientDemographics2.setGender("patient.gender");
        patientDemographics2.setName("patient.name");
        patientDemographics2.setPhone1("patient.phone.1");
        patientDemographics2.setSSN("patient.ssn");
        patientDemographics2.setState("patient.state");
        patientDemographics2.setZipCode("patient.zip");
        patientDemographics2.setCodeGreen("0");
        patientDemographics2.setDob("16 Jul 1971");
        patientDemographics2.setSite(dodSite);
        patientDemographics2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        patientDemographics2.setCdrEventId("987654321");
        patientDemographics2.setICN(icn);

        return Arrays.asList(patientDemographics1, patientDemographics2);

    }


    public Calendar calendarFromString(String dateString) throws ParseException {

        Calendar cal = Calendar.getInstance();
        cal.setTime(fmt.parse(dateString));

        return cal;

    }

}
