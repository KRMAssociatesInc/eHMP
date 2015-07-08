package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentText;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.jmeadows.util.document.DodDocumentService;
import gov.va.jmeadows.util.document.IDodDocumentService;
import gov.va.med.jmeadows.webservice.*;
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
import static gov.va.jmeadows.JMeadowsNoteService.NoteType.INPATIENT;
import static gov.va.jmeadows.JMeadowsNoteService.NoteType.OUTPATIENT;
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

public class JMeadowsNoteServiceTest {

    private String CDA_NOTE = "<?xml version='1.0' encoding='UTF-8'?><ClinicalDocument xsi:schemaLocation=\"xmlns='urn:hl7-org:v3' xmlns:crs='urn:hl7-org:crs' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'\" xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n   <typeId extension=\"POCD_HD000040\" root=\"2.16.840.1.113883.1.3\"/>\n   <id extension=\"50402157_20110502113900_125\" root=\"2.16.840.1.113883.3.42.144.100001.17\"/>\n   <code codeSystem=\"2.16.840.1.113883.6.1\" codeSystemName=\"LOINC\" code=\"28636-9\" displayName=\"&quot;Initial Evaluation Note&quot;\"/>\n   <title>Pulmonary Nursing Follow-Up</title>\n   <effectiveTime value=\"20120829151904\"/>\n   <confidentialityCode code=\"N\" codeSystem=\"2.16.840.1.113883.5.25\"/>\n   <versionNumber value=\"8\"/>\n   <recordTarget>\n      <patientRole>\n         <id extension=\"786724\" root=\"2.16.840.1.113883.3.42.127.125.2\"/>\n         <id extension=\"000-00-1102\" root=\"2.16.840.1.113883.4.1\"/>\n         <addr>\n            <streetAddressLine>1234 Cherry Blossom Lane</streetAddressLine>\n            <city/>\n            <state/>\n            <postalCode/>\n            <country/>\n         </addr>\n         <telecom use=\"HP\" value=\"tel:\"/>\n         <patient>\n            <name>\n               <delimiter/>\n               <prefix/>\n               <suffix/>\n               <given>BOB</given>\n               <family>BTEST</family>\n            </name>\n            <administrativeGenderCode codeSystem=\"2.16.840.1.113883.5.1\" code=\"F\"/>\n            <birthTime value=\"19450101\"/>\n         </patient>\n      </patientRole>\n   </recordTarget>\n   <author>\n      <time value=\"20110502114150\"/>\n      <assignedAuthor>\n         <id extension=\"\" root=\"2.16.840.1.113883.3.42.127.125.3\"/>\n         <addr>\n            <streetAddressLine>9040 Fitzsimmons Ave</streetAddressLine>\n            <city>Tacoma</city>\n            <state>WA</state>\n            <postalCode>98431</postalCode>\n            <country>USA</country>\n         </addr>\n         <telecom use=\"WP\" value=\"tel:(253) 968-1110\"/>\n         <assignedPerson>\n            <name>\n               <delimiter/>\n               <prefix/>\n               <suffix/>\n               <given/>\n               <family>DEMO USER</family>\n            </name>\n         </assignedPerson>\n      </assignedAuthor>\n   </author>\n   <custodian>\n      <assignedCustodian>\n         <representedCustodianOrganization>\n            <id root=\"2.16.840.1.113883.3.42.127.125.13\"/>\n         </representedCustodianOrganization>\n      </assignedCustodian>\n   </custodian>\n   <component>\n      <structuredBody>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" align=\"center\" width=\"1050\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">PULMONARY NURSING FOLLOW-UP NOTE</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"390\"/>\n                     <col valign=\"top\" width=\"139\"/>\n                     <col valign=\"top\" width=\"521\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">- POST OPERATIVE FOLLOW UP PHONE CALL -</td>\n                           <td>Phone number</td>\n                           <td>800-555-4444</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"49\"/>\n                     <col valign=\"top\" width=\"138\"/>\n                     <col valign=\"top\" width=\"124\"/>\n                     <col valign=\"top\" width=\"498\"/>\n                     <col valign=\"top\" width=\"241\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>Date</td>\n                           <td>Time</td>\n                           <td>Results</td>\n                           <td>Initials</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"103\"/>\n                     <col valign=\"top\" width=\"134\"/>\n                     <col valign=\"top\" width=\"536\"/>\n                     <col valign=\"top\" width=\"238\"/>\n                     <tbody>\n                        <tr>\n                           <td>02May</td>\n                           <td>0600</td>\n                           <td>Left message</td>\n                           <td>DEMO</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1050\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">- ATTEMPTS TO CONTACT PATIENT -</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"91\"/>\n                     <col valign=\"top\" width=\"96\"/>\n                     <col valign=\"top\" width=\"124\"/>\n                     <col valign=\"top\" width=\"498\"/>\n                     <col valign=\"top\" width=\"241\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>Date</td>\n                           <td>Time</td>\n                           <td>Results</td>\n                           <td>Initials</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"40\"/>\n                     <col valign=\"top\" width=\"107\"/>\n                     <col valign=\"top\" width=\"108\"/>\n                     <col valign=\"top\" width=\"521\"/>\n                     <col valign=\"top\" width=\"238\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>#1</td>\n                           <td>02May</td>\n                           <td>0900</td>\n                           <td>Reached patient and discussed.</td>\n                           <td>DEMO</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"33\"/>\n                     <col valign=\"top\" width=\"195\"/>\n                     <col valign=\"top\" width=\"822\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>PATIENT RESPONSE</td>\n                           <td>* Additional Comments Required For All Yes Responses *</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[X]</td>\n                           <td>YES</td>\n                           <td>[ ]</td>\n                           <td>Color and amount of sputum produced with cough</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[X]</td>\n                           <td>YES</td>\n                           <td>[ ]</td>\n                           <td>Unusual Pain</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[X]</td>\n                           <td>YES</td>\n                           <td>[ ]</td>\n                           <td>Fever</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"36\"/>\n                     <col valign=\"top\" width=\"27\"/>\n                     <col valign=\"top\" width=\"42\"/>\n                     <col valign=\"top\" width=\"35\"/>\n                     <col valign=\"top\" width=\"47\"/>\n                     <col valign=\"top\" width=\"863\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>NO</td>\n                           <td>[ ]</td>\n                           <td>YES</td>\n                           <td>[X]</td>\n                           <td>Other Problems:</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1014\"/>\n                     <tbody>\n                        <tr>\n                           <td>A little tired today.</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1014\"/>\n                     <tbody>\n                        <tr>\n                           <td>Patient / Significant Other communicates knowledge of and understands follow-up instructions.</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"251\"/>\n                     <col valign=\"top\" width=\"799\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">Patient's condition:</td>\n                           <td>Good</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"251\"/>\n                     <col valign=\"top\" width=\"799\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">Additional information</td>\n                           <td/>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col valign=\"top\" width=\"1050\"/>\n                     <tbody>\n                        <tr>\n                           <td styleCode=\"Bold\">Signature of Nurse/Physician: See above electronic signature.</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n         <component>\n            <section>\n               <text>\n                  <table>\n                     <col width=\"1\"/>\n                     <col valign=\"top\" width=\"1049\"/>\n                     <tbody>\n                        <tr>\n                           <td align=\"center\"/>\n                           <td>SF 509 - E - Progress Notes</td>\n                        </tr>\n                     </tbody>\n                  </table>\n               </text>\n            </section>\n         </component>\n      </structuredBody>\n   </component>\n</ClinicalDocument>";
    private String NOTE_PLAIN_TEXT = "plain.text.version.of.note";
    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";
    private JMeadowsData mockJMeadowsClient;
    private JMeadowsNoteService jMeadowsNoteService;
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
                docText.setData("content", NOTE_PLAIN_TEXT);
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

        when(this.mockDodDocumentService.convertAndStoreCDADocument(
                any(String.class), any(PatientIds.class), any(String.class), any(Document.class))).then(new Answer() {
            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Object[] args = invocation.getArguments();
                Document vprDocument = (Document) args[3];

                DocumentText docText = new DocumentText();
                docText.setData("content", NOTE_PLAIN_TEXT);
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
        this.jMeadowsNoteService = new JMeadowsNoteService(new JMeadowsConfiguration(mockEnvironment));
        this.jMeadowsNoteService.setJMeadowsClient(mockJMeadowsClient);
        this.jMeadowsNoteService.setDodDocumentService(mockDodDocumentService);

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
    public void testFetchDodNotesOutpatient() {
        try {
            when(this.mockJMeadowsClient.getPatientProgressNotes(any(JMeadowsQuery.class))).thenReturn(createTestData());
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

            testTransformations(jMeadowsNoteService.fetchDodNotes(OUTPATIENT, query, patientIds));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testFetchDodNotesInpatient() {
        try {
            when(this.mockJMeadowsClient.getPatientDischargeSummaries(any(JMeadowsQuery.class))).thenReturn(createTestData());
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

            testTransformations(jMeadowsNoteService.fetchDodNotes(INPATIENT, query, patientIds));

        } catch (JMeadowsException_Exception e) {
            fail(e.getMessage());
        }
    }

    private ProgressNote getNoteByTitle(List<ProgressNote> notes, String title) {
        for(ProgressNote note : notes) {
            if (title.equals(note.getNoteTitle())) return note;
        }

        return null;
    }


    private void testTransformations(List<VistaDataChunk> vistaDataChunkList) {

        try {
            assertNotNull(vistaDataChunkList);

            //dod status report should have been removed
            assertThat(vistaDataChunkList.size(), is(2));

            List<ProgressNote> testDataList = createTestData();
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
                ProgressNote testProgressNote = getNoteByTitle(testDataList, (String) jsonMap.get("localTitle"));

                assertThat("DOD", is(jsonMap.get("facilityCode")));
                assertThat("DOD", is(jsonMap.get("facilityName")));

                if (testProgressNote.getCdrEventId() == null && "CDA".equalsIgnoreCase(testProgressNote.getStatus())) {

                    MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
                    messageDigest.update(testProgressNote.getNoteText().getBytes("UTF-8"));
                    byte[] bHash = messageDigest.digest();
                    BigInteger bigInteger = new BigInteger(1, bHash);
                    String sHash = bigInteger.toString(16);
                    String eventId = String.format("%s_%s", sHash, "20110502114150");

                    assertThat("urn:va:document:DOD:" + edipi + ":" + eventId, is(jsonMap.get("uid")));
                }
                else {
                    assertThat("urn:va:document:DOD:" + edipi + ":" + testProgressNote.getCdrEventId(), is(jsonMap.get("uid")));
                }

                assertThat(testProgressNote.getNoteTitle(), is(jsonMap.get("localTitle")));
                assertThat(testProgressNote.getNoteType(), is(jsonMap.get("documentTypeName")));
                assertThat(testProgressNote.getProvider(), is(jsonMap.get("author")));
                if (testProgressNote.getNoteDate() != null) {
                    assertThat(formatCalendar(testProgressNote.getNoteDate().toGregorianCalendar()), is(jsonMap.get("referenceDateTime")));
                }
                else assertThat("20110502114150", is(jsonMap.get("referenceDateTime")));

                List<Map<String, Object>> documentTextList = (List<Map<String, Object>>) jsonMap.get("text");

                Map<String, Object> docTextJsonMap = documentTextList.get(0);

                if ("RTF".equalsIgnoreCase(testProgressNote.getStatus())) {
                    assertNotNull(docTextJsonMap.get("content"));
                    assertThat(formatCalendar(testProgressNote.getNoteDate().toGregorianCalendar()), is(docTextJsonMap.get("dateTime")));
                    assertNotNull(jsonMap.get("dodComplexNoteUri"));
                } else {
                    if ("CDA".equalsIgnoreCase(testProgressNote.getStatus())) {
                        assertThat(NOTE_PLAIN_TEXT, is(docTextJsonMap.get("content")));
                    }
                    else assertThat(testProgressNote.getNoteText(), is(docTextJsonMap.get("content")));
                    if (testProgressNote.getNoteDate() != null) {
                        assertThat(formatCalendar(testProgressNote.getNoteDate().toGregorianCalendar()), is(docTextJsonMap.get("dateTime")));
                    }
                    else assertThat("20110502114150", is(jsonMap.get("referenceDateTime")));
                }

                List<Map<String, Object>> codes = (List<Map<String, Object>>) jsonMap.get("codes");

                assertThat(JLVTerminologySystem.LOINC.getUrn(), is(codes.get(0).get("system")));
            }
        } catch (Exception e) {
            e.printStackTrace();
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

            List<VistaDataChunk> vistaDataChunkList = jMeadowsNoteService.fetchDodNotes(OUTPATIENT, query, patientIds);
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

    private List<ProgressNote> createTestData() throws JMeadowsException_Exception {
        XMLGregorianCalendar cal = null;
        try {
            cal = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        } catch (DatatypeConfigurationException dce) {
            throw new JMeadowsException_Exception("data type factory error", null);
        }

        //create three test notes

        Site dodSite = new Site();
        dodSite.setMoniker("DOD");
        dodSite.setSiteCode("DOD");
        dodSite.setName("DOD");

        //CDA note
        ProgressNote progressNote1 = new ProgressNote();
        progressNote1.setNoteTitle("note.title.1");
        progressNote1.setStatus("CDA");
        progressNote1.setProvider("note.provider.1");
        progressNote1.setNoteDate(null);
        progressNote1.setNoteText(CDA_NOTE);

        Code code1 = new Code();
        code1.setCode("1000");
        code1.setDisplay("test.code.display.1");
        code1.setSystem("LOINC");
        progressNote1.getCodes().add(code1);
        progressNote1.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        progressNote1.setSite(dodSite);
        //TMDS notes will not have an eventId
        progressNote1.setCdrEventId(null);

        ProgressNote progressNote2 = new ProgressNote();
        progressNote2.setNoteTitle("note.title.2");
        progressNote2.setStatus("rtf");
        progressNote2.setProvider("note.provider.2");
        progressNote2.setStatus("plain-text.2");
        progressNote2.setNoteDate(cal);
        progressNote2.setNoteText("note.text.2");

        Code code2 = new Code();
        code2.setCode("1000");
        code2.setDisplay("test.code.display.2");
        code2.setSystem("LOINC");
        progressNote2.getCodes().add(code2);
        progressNote2.setSourceProtocol(SOURCE_PROTOCOL_DODADAPTER);
        progressNote2.setSite(dodSite);
        progressNote2.setCdrEventId("987654321");
        progressNote2.setComplexDataUrl("complex.note.url.2");

        //generate connection unavailable bean
        ProgressNote connectionUnavailable = new ProgressNote();
        connectionUnavailable.setNoteTitle("Connection unavailable.");
        connectionUnavailable.setNoteType("Connection unavailable.");
        Site caSite = new Site();
        caSite.setMoniker("DOD");
        caSite.setName("DOD");
        caSite.setAgency("DOD");
        caSite.setSiteCode("DOD");
        connectionUnavailable.setSite(caSite);


        return Arrays.asList(progressNote1, progressNote2, connectionUnavailable);
    }
}
