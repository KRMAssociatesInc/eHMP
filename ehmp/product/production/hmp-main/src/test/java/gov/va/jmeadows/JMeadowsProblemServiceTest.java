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

public class JMeadowsProblemServiceTest {

    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";

    private JMeadowsData mockJMeadowsClient;
    private JMeadowsProblemService jMeadowsProblemService;
    private Environment mockEnvironment;

    private String vistaId = "B362";
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

   /* @Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn("http://10.4.4.104/jMeadows/JMeadowsDataService?wsdl");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" +4500);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn("VEHU,TEN");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn("20012");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn("200");
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn("CAMP MASTER");


        this.mockJMeadowsClient = JMeadowsClientFactory.getInstance(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsProblemService = new JMeadowsProblemService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsProblemService.setJMeadowsClient(mockJMeadowsClient);

        user = new User();
        user.setUserIen("20012");
        Site hostSite = new Site();
        hostSite.setSiteCode("200");
        hostSite.setAgency("VA");
        hostSite.setMoniker("CAMP MASTER");
        hostSite.setName("CAMP MASTER");
        user.setHostSite(hostSite);

        patient = new Patient();
        patient.setEDIPI("test.edipi");
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
        this.jMeadowsProblemService = new JMeadowsProblemService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsProblemService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientProblems() {
        try {

            when(this.mockJMeadowsClient.getPatientProblemList(any(JMeadowsQuery.class))).thenReturn(createTestData());

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsProblemService.fetchDodPatientProblems(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(2));

            List<Problem> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++)
            {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);

                assertThat(JMeadowsProblemService.DOMAIN_PROBLEM, is(vistaDataChunk.getDomain()));
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

                ProblemDetail testProblem = (ProblemDetail) testDataList.get(i);

                //do test problem
                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat(testProblem.getHospitalLocation(), is(jsonMap.get("locationName")));
                assertThat("urn:va:problem:DOD:"+edipi+":"+testProblem.getCdrEventId(), is(jsonMap.get("uid")));
                assertThat(testProblem.getDescription(), is(jsonMap.get("problemText")));
                assertThat(testProblem.getEnteredBy(), is(jsonMap.get("providerName")));
                assertThat(testProblem.getEnteredBy(), is(jsonMap.get("providerDisplayName")));
                assertThat(testProblem.getIcdCode(), is(jsonMap.get("icdCode")));
                assertThat(testProblem.getStatus(), is(jsonMap.get("statusName")));
                assertThat(testProblem.getAcuity(), is(jsonMap.get("acuityName")));

                assertThat(calendarToPointInTime(testProblem.getEnteredDate()).toString(),
                        is(jsonMap.get("entered")));

                assertThat(calendarToPointInTime(testProblem.getLastModifiedDate()).toString(),
                        is(jsonMap.get("updated")));

                assertThat(calendarToPointInTime(testProblem.getOnsetDate()).toString(),
                        is(jsonMap.get("onset")));


                List<ProblemNote> notes = testProblem.getNotes();
                List<Map<String, Object>> comments = (List<Map<String, Object>>)jsonMap.get("comments");

                assertThat(comments.size(), is(2));

                int j = 0;
                for(ProblemNote note : notes)
                {
                    Map<String, Object> comment = comments.get(j);
                    assertThat(note.getNoteText(), is(comment.get("comment")));

                    j++;
                }


            }


        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyProblemList()
    {
        try {

            //return null list
            when(this.mockJMeadowsClient.getPatientProblemList(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsProblemService.fetchDodPatientProblems(query, patientIds);

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));


            //return empty list
            when(this.mockJMeadowsClient.getPatientProblemList(any(JMeadowsQuery.class))).thenReturn(new ArrayList<Problem>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<Problem> createTestData()   {

        //create 2 jmeadows problems

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        ProblemDetail problem1 = new ProblemDetail();
        problem1.setHospitalLocation("problem.1.hospital.location");
        problem1.setLocationIEN("problem.1.location.ien");
        problem1.setDescription("problem.1.detail.text");
        problem1.setEnteredBy("problem.1.provider");
        problem1.setIcdCode("problem.1.icd.code");
        problem1.setStatus("problem.1.status");
        problem1.setAcuity("problem.1.acuity");

        XMLGregorianCalendar problemEnteredDate = null;

        try {
            problemEnteredDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            problemEnteredDate.setYear(2010);
            problemEnteredDate.setMonth(8);
            problemEnteredDate.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        problem1.setEnteredDate(problemEnteredDate);

        XMLGregorianCalendar problemUpdatedDate = null;

        try {
            problemUpdatedDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            problemUpdatedDate.setYear(2011);
            problemUpdatedDate.setMonth(8);
            problemUpdatedDate.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        problem1.setLastModifiedDate(problemUpdatedDate);

        XMLGregorianCalendar problemOnsetDate = null;

        try {
            problemOnsetDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            problemOnsetDate.setYear(2009);
            problemOnsetDate.setMonth(3);
            problemOnsetDate.setDay(14);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        problem1.setOnsetDate(problemOnsetDate);

        problem1.setCdrEventId("987654321");

        //create 2 notes

        ProblemNote n11 = new ProblemNote();
        n11.setNoteText("problem.1.note.1.text");

        problem1.getNotes().add(n11);

        ProblemNote n12 = new ProblemNote();
        n12.setNoteText("problem.1.note.2.text");

        problem1.getNotes().add(n12);

        problem1.setSite(dodSite);
        problem1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);


        //problem 2

        ProblemDetail problem2 = new ProblemDetail();
        problem2.setHospitalLocation("problem.2.hospital.location");
        problem2.setDescription("problem.2.detail.text");
        problem2.setEnteredBy("problem.2.provider");
        problem2.setIcdCode("problem.2.icd.code");
        problem2.setStatus("problem.2.status");
        problem2.setAcuity("problem.2.acuity");

        XMLGregorianCalendar problem2EnteredDate = null;

        try {
            problem2EnteredDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            problem2EnteredDate.setYear(2011);
            problem2EnteredDate.setMonth(4);
            problem2EnteredDate.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        problem2.setEnteredDate(problem2EnteredDate);

        XMLGregorianCalendar problem2UpdatedDate = null;

        try {
            problem2UpdatedDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            problem2UpdatedDate.setYear(2011);
            problem2UpdatedDate.setMonth(8);
            problem2UpdatedDate.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        problem2.setLastModifiedDate(problem2UpdatedDate);

        XMLGregorianCalendar problem2OnsetDate = null;

        try {
            problem2OnsetDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            problem2OnsetDate.setYear(2012);
            problem2OnsetDate.setMonth(3);
            problem2OnsetDate.setDay(14);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        problem2.setOnsetDate(problem2OnsetDate);
        problem2.setCdrEventId("123456789");

        //create 2 notes

        ProblemNote n21 = new ProblemNote();
        n21.setNoteText("problem.2.note.1.text");

        problem2.getNotes().add(n21);

        ProblemNote n22 = new ProblemNote();
        n22.setNoteText("problem.2.note.2.text");

        problem2.getNotes().add(n22);

        problem2.setSite(dodSite);
        problem2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);


        return Arrays.asList((Problem)problem1, (Problem)problem2);
    }
}
