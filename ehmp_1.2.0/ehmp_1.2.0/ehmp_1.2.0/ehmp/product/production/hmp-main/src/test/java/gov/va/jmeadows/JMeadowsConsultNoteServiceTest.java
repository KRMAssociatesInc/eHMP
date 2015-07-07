package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentText;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.jmeadows.util.document.DodDocumentService;
import gov.va.jmeadows.util.document.IDodDocumentService;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static gov.va.jmeadows.JMeadowsClientUtils.SOURCE_PROTOCOL_DODADAPTER;
import static gov.va.jmeadows.JMeadowsClientUtils.formatCalendar;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertNull;
import static junit.framework.TestCase.assertFalse;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class JMeadowsConsultNoteServiceTest {

    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";
    private JMeadowsData mockJMeadowsClient;
    private JMeadowsConsultNoteService jMeadowsConsultNoteService;
    private IDodDocumentService mockDodDocumentService;
    private Environment mockEnvironment;

    private String vistaId = "B362";
    private String icn = "123456789";
    private String dfn = "4321";
    private String pid = vistaId + ";" + dfn;
    private String uid = "urn:va:patient:" + vistaId + ":" + dfn + ":" + icn;
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
        when(mockEnvironment.getProperty(HmpProperties.DOD_DOC_SERVICE_ENABLED)).thenReturn("true");

        this.mockDodDocumentService = mock(DodDocumentService.class);
        when(this.mockDodDocumentService.retrieveConvertAndStoreRTFDocument(
                any(String.class), any(PatientIds.class), any(String.class), any(Document.class))).then(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Object[] args = invocation.getArguments();
                Document vprDocument = (Document) args[3];

                DocumentText docText = new DocumentText();
                docText.setData("content", "plain.text.version.of.note");
                docText.setData("dateTime", vprDocument.getReferenceDateTime());
                docText.setData("status", "completed");
                docText.setData("uid", vprDocument.getUid());
                vprDocument.setData("text", Arrays.asList(docText));
                vprDocument.setData("dodComplexNoteUri", "complex.note.uri");
                Future<Document> mockFuture = (Future<Document>) mock(Future.class);
                try {
                    when(mockFuture.get()).thenReturn(vprDocument);
                } catch (InterruptedException | ExecutionException e) {
                    fail(e.getMessage());
                }

                return mockFuture;
            }
        });

        this.mockJMeadowsClient = mock(JMeadowsData.class);
        this.jMeadowsConsultNoteService = new JMeadowsConsultNoteService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsConsultNoteService.setJMeadowsClient(mockJMeadowsClient);
        this.jMeadowsConsultNoteService.setDodDocumentService(mockDodDocumentService);

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
    public void testFetchDodConsults() {
        try {
            when(this.mockJMeadowsClient.getPatientConsultRequests(any(JMeadowsQuery.class))).thenReturn(createTestData());
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
            List<VistaDataChunk> vistaDataChunkList = jMeadowsConsultNoteService.fetchDodConsults(query, patientIds);
            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<Consult> testDataList = createTestData();
            for (int i = 0; i < vistaDataChunkList.size(); i++) {
                VistaDataChunk vistaDataChunk = vistaDataChunkList.get(i);
                assertThat(JMeadowsNoteService.DOMAIN_DOCUMENT, is(vistaDataChunk.getDomain()));
                assertThat(2, is(vistaDataChunk.getItemCount()));
                assertThat(i + 1, is(vistaDataChunk.getItemIndex()));
                assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
                assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
                assertThat(vistaId, is(vistaDataChunk.getSystemId()));
                assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
                assertThat(icn, is(vistaDataChunk.getPatientIcn()));
                assertThat("DOD;" + edipi, is(vistaDataChunk.getPatientId()));
                assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
                assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));
                Map<String, Object> jsonMap = vistaDataChunk.getJsonMap();
                Consult testConsult = testDataList.get(i);

                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));
                if (testConsult.getCdrEventId() == null) {

                    MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
                    messageDigest.update(testConsult.getReport().getBytes("UTF-8"));
                    byte[] bHash = messageDigest.digest();
                    BigInteger bigInteger = new BigInteger(1, bHash);
                    String sHash = bigInteger.toString(16);
                    String eventId = String.format("%s_%s", sHash, formatCalendar(testConsult.getRequestDate().toGregorianCalendar()));

                    assertThat("urn:va:document:DOD:" + edipi + ":" + eventId, is(jsonMap.get("uid")));
                }
                else {
                    assertThat("urn:va:document:DOD:" + edipi + ":" + testConsult.getCdrEventId(), is(jsonMap.get("uid")));
                }

                assertThat(testConsult.getService(), is(jsonMap.get("localTitle")));
                assertThat(testConsult.getProcedureConsult(), is(jsonMap.get("documentTypeName")));
                assertThat(formatCalendar(testConsult.getRequestDate().toGregorianCalendar()), is(jsonMap.get("referenceDateTime")));

                List<Map<String, Object>> documentTextList = (List<Map<String, Object>>) jsonMap.get("text");

                Map<String, Object> docTextJsonMap = documentTextList.get(0);

                if (StringUtils.isNotBlank(testConsult.getComplexDataUrl())) {
                    assertNotNull(docTextJsonMap.get("content"));
                    assertThat(formatCalendar(testConsult.getRequestDate().toGregorianCalendar()), is(docTextJsonMap.get("dateTime")));
                    assertNotNull(jsonMap.get("dodComplexNoteUri"));
                } else {
                    assertThat(testConsult.getReport(), is(docTextJsonMap.get("content")));
                    assertThat(formatCalendar(testConsult.getRequestDate().toGregorianCalendar()), is(docTextJsonMap.get("dateTime")));
                }

                List<Map<String, Object>> codes = (List<Map<String, Object>>) jsonMap.get("codes");

                assertThat(JLVTerminologySystem.LOINC.getUrn(), is(codes.get(0).get("system")));
            }
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testNullAndEmptyVitalList() {
        try {
            //return null list
            when(this.mockJMeadowsClient.getPatientProgressNotes(any(JMeadowsQuery.class))).thenReturn(null);

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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsConsultNoteService.fetchDodConsults(query, patientIds);
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

    private List<Consult> createTestData() throws JMeadowsException_Exception {
        XMLGregorianCalendar cal = null;
        try {
            cal = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        } catch (DatatypeConfigurationException dce) {
            throw new JMeadowsException_Exception("data type factory error", null);
        }

        //create two test vitals

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        Consult consult1 = new Consult();
        consult1.setService("note.title.1");
        consult1.setProcedureConsult("note.type.1");
        consult1.setRequestDate(cal);
        consult1.setReport("note.text.1");

        Code code1 = new Code();
        code1.setCode("1000");
        code1.setDisplay("test.code.display.1");
        code1.setSystem("LOINC");
        consult1.getCodes().add(code1);
        consult1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        consult1.setSite(dodSite);
        //TMDS notes do not have an eventId
        consult1.setCdrEventId(null);

        Consult consult2 = new Consult();
        consult2.setService("note.title.2");
        consult2.setProcedureConsult("note.type.2");
        consult2.setStatus("plain-text.2");
        consult2.setRequestDate(cal);
        consult2.setReport("note.text.2");

        Code code2 = new Code();
        code2.setCode("1000");
        code2.setDisplay("test.code.display.2");
        code2.setSystem("LOINC");
        consult2.getCodes().add(code2);
        consult2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        consult2.setSite(dodSite);
        consult2.setCdrEventId("987654321");
        consult2.setComplexDataUrl("complex.note.url.4");

        //generate connection unavailable bean
        Consult connectionUnavailable = new Consult();
        connectionUnavailable.setService("Connection unavailable.");
        Site caSite = new Site();
        caSite.setMoniker("DOD");
        caSite.setName("DOD");
        caSite.setAgency("DOD");
        caSite.setSiteCode("DOD");
        connectionUnavailable.setSite(caSite);


        return Arrays.asList(consult1, consult2, connectionUnavailable);
    }
}
