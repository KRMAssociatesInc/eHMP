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

public class JMeadowsRadiologyServiceTest {

    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";
    private JMeadowsData mockJMeadowsClient;
    private JMeadowsRadiologyService jMeadowsRadiologyService;
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
        this.jMeadowsRadiologyService = new JMeadowsRadiologyService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsRadiologyService.setJMeadowsClient(mockJMeadowsClient);

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
    public void testFetchPatientRadiologyReports() {
        try {

            when(this.mockJMeadowsClient.getPatientRads(any(JMeadowsQuery.class))).thenReturn(createTestData());

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
            List<VistaDataChunk> vistaDataChunkList = jMeadowsRadiologyService.fetchDodPatientRadiologyReports(query, patientIds);
            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<RadiologyReport> testDataList = createTestData();

            for(int i = 0; i < vistaDataChunkList.size(); i++) {

                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);
                assertThat(JMeadowsRadiologyService.DOMAIN_RADIOLOGY, is(vistaDataChunk.getDomain()));
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

                RadiologyReport testReport = testDataList.get(i);


                assertThat("INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC", is(jsonMap.get("imageLocation")));
                assertThat("TRANSCRIBED", is(jsonMap.get("statusName")));
                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                assertThat("urn:va:image:DOD:"+edipi+":"+ testReport.getCdrEventId(), is(jsonMap.get("uid")));
                assertThat("Radiology", is(jsonMap.get("kind")));
                assertThat(testReport.getAccessionNumber(), is(jsonMap.get("localId")));
                assertThat(testReport.getExamId(), is(jsonMap.get("encounterUid")));
                assertThat(testReport.getReasonForOrder(), is(jsonMap.get("reason")));
                assertThat(testReport.getStatus(), is(jsonMap.get("status")));

                assertThat(calendarToPointInTime(testReport.getExamDate()).toString(),
                        is(jsonMap.get("dateTime")));

                List<Map<String, Object>> providers = (List<Map<String, Object>>)jsonMap.get("providers");

                assertThat(providers.size(), is(1));

                Map<String, Object> provider = providers.get(0);
                assertThat(testReport.getInterpretingHCP(), is(provider.get("providerName")));
                assertThat(testReport.getInterpretingHCP(), is(provider.get("providerDisplayName")));

                List<Map<String, Object>> results = (List<Map<String, Object>>)jsonMap.get("results");

                assertThat(providers.size(), is(1));

                Map<String, Object> result = results.get(0);
                assertThat(testReport.getStudy(), is(result.get("localTitle")));




            }

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    //@Test
    public void testNullAndEmptyRadiologyReportList() {
        try {
            //return null list
            when(this.mockJMeadowsClient.getPatientRads(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsRadiologyService.fetchDodPatientRadiologyReports(query, patientIds);
            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

            //return empty list
            when(this.mockJMeadowsClient.getPatientRads(any(JMeadowsQuery.class))).thenReturn(new ArrayList<RadiologyReport>());

            assertNotNull(vistaDataChunkList);
            assertThat(vistaDataChunkList.size(), is(0));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private List<RadiologyReport> createTestData() throws JMeadowsException_Exception {
         //create two test radiology reports

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        RadiologyReport report1 = new RadiologyReport();
        report1.setApprovedBy("report1.approvedby");
        report1.setImpressionText("");
        report1.setInterpretingHCP("report1.interpretedby");
        report1.setPriority("report1.priority");
        report1.setReportStatus("report1.reportstatus");
        report1.setStatus("report1.status");
        report1.setResultCode("report1.resultcode");
        report1.setExamId("report1.examid");
        report1.setReasonForOrder("report1.reason");
        report1.setAccessionNumber("report1.accessionnumber");

        XMLGregorianCalendar transcribeDate1 = null;

        try {
            transcribeDate1 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            transcribeDate1.setYear(2010);
            transcribeDate1.setMonth(8);
            transcribeDate1.setDay(21);
            transcribeDate1.setHour(14);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }


        XMLGregorianCalendar examDate1 = null;

        try {
            examDate1 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            examDate1.setYear(2010);
            examDate1.setMonth(8);
            examDate1.setDay(21);
            examDate1.setHour(14);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        report1.setExamDate(examDate1);

        report1.setTranscribeDate(transcribeDate1);
        report1.setReportText("Procedure:CHEST,AP\n" +
                "20070621103000\n" +
                "Order Comment: test\n" +
                "Reason for Order: test\n" +
                "Exam #:07000073\n" +
                "Exam Date/Time:20070621103700\n" +
                "Transcription Date/Time:20070621103700\n" +
                "Provider:100000059 LARRY, PROVIDER\n" +
                "Requesting Location:INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC\n" +
                "Status:TRANSCRIBED\n" +
                "Result Code: 3 MAJOR ABNORMALITY, NO ATTN. NEEDED\n" +
                "Interpreted By:100000059 LARRY, PROVIDER\n" +
                "Report Text: test");

        report1.setStudy("report1.study");


        report1.setSite(dodSite);
        report1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        report1.setCdrEventId("1");

        RadiologyReport report2 = new RadiologyReport();
        report2.setApprovedBy("report2.approvedby");
        report2.setImpressionText("");
        report2.setInterpretingHCP("report2.interpretedby");
        report2.setPriority("report2.priority");
        report2.setReportStatus("report2.reportstatus");
        report2.setStatus("report2.status");
        report2.setResultCode("report2.resultcode");
        report2.setExamId("report2.examid");
        report2.setReasonForOrder("report2.reason");
        report2.setAccessionNumber("report2.accessionnumber");

        XMLGregorianCalendar transcribeDate2 = null;

        try {
            transcribeDate2 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            transcribeDate2.setYear(2010);
            transcribeDate2.setMonth(8);
            transcribeDate2.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }


        XMLGregorianCalendar examDate2 = null;

        try {
            examDate2 = DatatypeFactory.newInstance().newXMLGregorianCalendar();
            examDate2.setYear(2010);
            examDate2.setMonth(8);
            examDate2.setDay(21);
        }catch (DatatypeConfigurationException dce) {
            fail(dce.getMessage());
        }

        report2.setExamDate(examDate2);

        report2.setTranscribeDate(transcribeDate2);
        report2.setReportText("Procedure:CHEST,AP\n" +
                "20070621103000\n" +
                "Order Comment: test\n" +
                "Reason for Order: test\n" +
                "Exam #:07000073\n" +
                "Exam Date/Time:20070621103700\n" +
                "Transcription Date/Time:20070621103700\n" +
                "Provider:100000059 LARRY, PROVIDER\n" +
                "Requesting Location:INTERNAL MEDICINE     SEYMOUR JOHNSON AFB, NC\n" +
                "Status:TRANSCRIBED\n" +
                "Result Code: 3 MAJOR ABNORMALITY, NO ATTN. NEEDED\n" +
                "Interpreted By:100000059 LARRY, PROVIDER\n" +
                "Report Text: test");
        report2.setStudy("report2.study");


        report2.setSite(dodSite);
        report2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        report2.setCdrEventId("2");
        
        return Arrays.asList(report1,report2);
    }
}
