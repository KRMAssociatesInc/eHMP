package gov.va.nhin.vler.service;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static junit.framework.TestCase.*;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class VlerServiceTest {
    /** The Constant VLER_DATA_FOLDER. */
    private static final String VLER_DATA_FOLDER = "gov/va/nhin/vler/service/";

    private VlerService vlerService;
    private Environment mockEnvironment;

    private String vistaId = "9E7A";
    private String icn = "123456789";
    private String dfn = "4321";
    private String pid = "VLER" +";"+ icn;
    private String uid = "urn:va:patient:"+vistaId+":"+ dfn +":"+ icn;

    private String url = "test.url";
    private long timeoutMS = 45000;
    private String userName = "test.username";
    private String userSiteCode = "test.sitecode";
    private String testDocDateTime = "20140616213908";

    private VLERDoc testVlerMetaDocument;
    private VLERDoc testC32Document;
    private VLERDoc testCCDADocument;
    private VLERDocQueryResponse mockDocQueryResponse;
    private VLERDocRetrieveResponse mockDocRetrieveResponse;
    private RetrieveVlerDocumentService retrieveVlerDocumentService;

    private String C32;
    private String CCDA;

    @Before
    public void setup() {
        mockEnvironment = mock(StandardEnvironment.class);
        when(mockEnvironment.getProperty(HmpProperties.VLER_DOC_QUERY_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.VLER_DOC_QUERY_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.VLER_DOC_RETRIEVE_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.VLER_DOC_RETRIEVE_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.VLER_DOC_RETRIEVE_MAX_THREADS)).thenReturn("1");
        when(mockEnvironment.getProperty(HmpProperties.VLER_SYSTEM_USER_NAME)).thenReturn(userName);
        when(mockEnvironment.getProperty(HmpProperties.VLER_SYSTEM_USER_SITE_CODE)).thenReturn(userSiteCode);

        testVlerMetaDocument = new VLERDoc();

        testVlerMetaDocument.setDocumentUniqueId("e587bf82-bfae-4499-9ca8-6babf6eea630");
        testVlerMetaDocument.setHomeCommunityId("urn:oid:1.3.6.1.4.1.26580.10");
        testVlerMetaDocument.setName("Continuity of Care Document");
        testVlerMetaDocument.setRepositoryUniqueId("1.2.840.114350.1.13.122.3.7.2.688879.121218");
        testVlerMetaDocument.setSourcePatientId("'8394^^^&1.3.6.1.4.1.26580.10.1.100&ISO'");


        testVlerMetaDocument.setCreationTime(testDocDateTime);

        Author author = new Author();
        author.setInstitution("Kaiser Permanente Southern California - RESC");
        author.setName("7.9^Epic - Version 7.9^^^^^^^&1.2.840.114350.1.1&ISO");

        testVlerMetaDocument.getAuthorList().add(author);

        testC32Document = new VLERDoc();
        testC32Document.getAuthorList().addAll(testVlerMetaDocument.getAuthorList());
        testC32Document.setCreationTime("20140616213908-0400");
        testC32Document.setDocumentUniqueId(testVlerMetaDocument.getDocumentUniqueId());
        testC32Document.setHomeCommunityId(testVlerMetaDocument.getHomeCommunityId());
        testC32Document.setMimeType("text/xml");
        testC32Document.setName(testVlerMetaDocument.getName());
        testC32Document.setRepositoryUniqueId(testVlerMetaDocument.getRepositoryUniqueId());
        testC32Document.setSourcePatientId(testVlerMetaDocument.getSourcePatientId());

        testCCDADocument = new VLERDoc();
        testCCDADocument.getAuthorList().addAll(testVlerMetaDocument.getAuthorList());
        testCCDADocument.setCreationTime("20140616213908-0400");
        testCCDADocument.setDocumentUniqueId(testVlerMetaDocument.getDocumentUniqueId());
        testCCDADocument.setHomeCommunityId(testVlerMetaDocument.getHomeCommunityId());
        testCCDADocument.setMimeType("text/xml");
        testCCDADocument.setName(testVlerMetaDocument.getName());
        testCCDADocument.setRepositoryUniqueId(testVlerMetaDocument.getRepositoryUniqueId());
        testCCDADocument.setSourcePatientId(testVlerMetaDocument.getSourcePatientId());

        try {
            C32 = readFile(VLER_DATA_FOLDER, "c32.xml");
            CCDA = readFile(VLER_DATA_FOLDER, "ccda.xml");
        } catch (IOException e) {
            fail(e.getMessage());
        }

        testC32Document.setDocument(C32.getBytes());
        testCCDADocument.setDocument(CCDA.getBytes());

        mockDocQueryResponse = mock(VLERDocQueryResponse.class);
        when(mockDocQueryResponse.getDocumentList()).thenReturn(Arrays.asList(testVlerMetaDocument));


        this.retrieveVlerDocumentService = mock(RetrieveVlerDocumentService.class);

        when(this.retrieveVlerDocumentService.retrieveVlerDocumentList(any(VlerQuery.class)))
                .thenReturn(mockDocQueryResponse);

        mockDocRetrieveResponse = mock(VLERDocRetrieveResponse.class);
        when(mockDocRetrieveResponse.getVlerDoc()).thenReturn(testC32Document);

        try {
            Future<VLERDocRetrieveResponse> mockFuture = (Future<VLERDocRetrieveResponse>) mock(Future.class);
            when(mockFuture.get()).thenReturn(mockDocRetrieveResponse);

            when(this.retrieveVlerDocumentService.retrieveVlerDocument(any(VlerQuery.class)))
                    .thenReturn(mockFuture);
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }

        this.vlerService = new VlerService(retrieveVlerDocumentService);

    }

    @Test
    public void testFetchC32Data() {

        PatientIds patientIds = new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build();

        List<VistaDataChunk> vistaDataChunkList = vlerService.fetchVlerData(patientIds);

        assertThat(vistaDataChunkList.size(), is(1));

        VistaDataChunk vistaDataChunk = vistaDataChunkList.get(0);
        assertThat(VlerService.DOMAIN_VLER_DOCUMENT, is(vistaDataChunk.getDomain()));
        assertThat(1, is(vistaDataChunk.getItemCount()));
        assertThat(1, is(vistaDataChunk.getItemIndex()));
        assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
        assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
        assertThat(vistaId, is(vistaDataChunk.getSystemId()));
        assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
        assertThat(icn, is(vistaDataChunk.getPatientIcn()));
        assertThat(pid, is(vistaDataChunk.getPatientId()));
        assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
        assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));
        Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

        assertThat("C32 Document", is(jsonMap.get("kind")));
        assertThat("urn:va:vlerdocument:VLER:"+icn+":"+testC32Document.getDocumentUniqueId(), is(jsonMap.get("uid")));
        assertThat(testC32Document.getName(), is(jsonMap.get("name")));
        assertThat(testDocDateTime, is(jsonMap.get("creationTime")));
        assertThat("Continuity of Care Document", is(jsonMap.get("summary")));
        assertThat(testC32Document.getDocumentUniqueId(), is(jsonMap.get("documentUniqueId")));
        assertThat(testC32Document.getHomeCommunityId(), is(jsonMap.get("homeCommunityId")));
        assertThat(testC32Document.getMimeType(), is(jsonMap.get("mimeType")));
        assertThat(testC32Document.getRepositoryUniqueId(), is(jsonMap.get("repositoryUniqueId")));
        assertThat(testC32Document.getSourcePatientId(), is(jsonMap.get("sourcePatientId")));
        List sectionList = (List) jsonMap.get("sections");
        assertThat(sectionList.size(), is(12));
        testC32SectionList(sectionList);
    }

    private void testC32SectionList(List sectionList) {
        final int SECTION_COMMENTS = 0;
        final int SECTION_ALLERGIES = 1;
        final int SECTION_MEDICATIONS = 2;
        final int SECTION_ACTIVE_PROBLEMS = 3;
        final int SECTION_RESOLVED_PROBLEMS = 4;
        final int SECTION_ENCOUNTERS = 5;
        final int SECTION_PLAN_OF_CARE = 6;
        final int SECTION_IMMUNIZATIONS = 7;
        final int SECTION_SOCIAL_HISTORY = 8;
        final int SECTION_PROCEDURES = 9;
        final int SECTION_STUDIES_SUMMARY = 10;
        final int SECTION_VITALS = 11;

        for(int i = 0; i < sectionList.size(); i++) {
            Map section = (Map) sectionList.get(i);

            switch (i) {
                case SECTION_COMMENTS:
                    testSection(section,
                            new String[]{},
                            "X-DOCCMT",
                            "Source Comments");
                    break;
                case SECTION_ALLERGIES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.2",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.13",
                                    "2.16.840.1.113883.3.88.11.83.102"},
                            "48765-2",
                            "Active Allergies and Adverse Reactions");
                    break;
                case SECTION_MEDICATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.8",
                                    "2.16.840.1.113883.3.88.11.83.112",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.19"},
                            "10160-0",
                            "Medications");
                    break;
                case SECTION_ACTIVE_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.11",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.6",
                                    "2.16.840.1.113883.3.88.11.83.103"},
                            "11450-4",
                            "Active Problems");
                    break;
                case SECTION_RESOLVED_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.2.9",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.8",
                                    "2.16.840.1.113883.3.88.11.83.104"},
                            "11348-0",
                            "Resolved Problems");
                    break;
                case SECTION_ENCOUNTERS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.3",
                                    "2.16.840.1.113883.3.88.11.83.127",
                                    "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.3"},
                            "46240-8",
                            "Encounters from 05/08/2014 to 08/08/2014");
                    break;
                case SECTION_PLAN_OF_CARE:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.10",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.31",
                                    "2.16.840.1.113883.3.88.11.83.124",
                                    "2.16.840.1.113883.10.20.2.7"},
                            "18776-5",
                            "Plan of Care");
                    break;
                case SECTION_IMMUNIZATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.6",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.23",
                                    "2.16.840.1.113883.3.88.11.83.117"},
                            "11369-6",
                            "Immunizations");
                    break;
                case SECTION_SOCIAL_HISTORY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.15",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.16"},
                            "29762-2",
                            "Social History");
                    break;
                case SECTION_PROCEDURES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.12",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.11",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.12",
                                    "2.16.840.1.113883.3.88.11.83.108"},
                            "47519-4",
                            "Procedures from 05/08/2014 to 08/08/2014");
                    break;
                case SECTION_STUDIES_SUMMARY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.14",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.27",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.28",
                                    "2.16.840.1.113883.3.88.11.83.122"},
                            "30954-2",
                            "Results from 05/08/2014 to 08/08/2014");
                    break;
                case SECTION_VITALS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.16",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.25",
                                    "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.2",
                                    "2.16.840.1.113883.3.88.11.83.119"},
                            "8716-3",
                            "Last Filed Vitals");
                    break;
                default:
                    fail("Section unaccounted for");
                    break;
            }
        }
    }

    private void testSection(Map section, String[] templateIdRootValues, String codeValue, String titleValue) {
        List templateIds = (List) section.get("templateIds");
        assertNotNull(templateIds);
        assertThat(templateIds.size(), is(templateIdRootValues.length));
        if (templateIds.size() > 0) {
            List<String> ids = Arrays.asList(templateIdRootValues);
            for(int i = 0; i < templateIds.size(); i++) {
                assertTrue(ids.contains(((Map)templateIds.get(i)).get("root")));
            }
        }
        Map code = (Map) section.get("code");
        assertNotNull(code);
        assertThat((String) code.get("code"), is(codeValue));
        String title = (String) section.get("title");
        assertThat(title, is(titleValue));
        String text = (String) section.get("text");
        assertNotNull(text);
        assertTrue(text.length() > 0);
        assertTrue(text.startsWith("<text"));
        assertTrue(text.endsWith("</text>"));
    }

    @Test
    public void testFetchCCDAData() {

        when(mockDocRetrieveResponse.getVlerDoc()).thenReturn(testCCDADocument);

        PatientIds patientIds = new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build();

        List<VistaDataChunk> vistaDataChunkList = vlerService.fetchVlerData(patientIds);

        assertThat(vistaDataChunkList.size(), is(1));

        VistaDataChunk vistaDataChunk = vistaDataChunkList.get(0);
        assertThat(VlerService.DOMAIN_VLER_DOCUMENT, is(vistaDataChunk.getDomain()));
        assertThat(1, is(vistaDataChunk.getItemCount()));
        assertThat(1, is(vistaDataChunk.getItemIndex()));
        assertThat(vistaId, is(vistaDataChunk.getParams().get("vistaId")));
        assertThat(dfn, is(vistaDataChunk.getParams().get("patientDfn")));
        assertThat(vistaId, is(vistaDataChunk.getSystemId()));
        assertThat(dfn, is(vistaDataChunk.getLocalPatientId()));
        assertThat(icn, is(vistaDataChunk.getPatientIcn()));
        assertThat(pid, is(vistaDataChunk.getPatientId()));
        assertThat("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API", is(vistaDataChunk.getRpcUri()));
        assertThat(VistaDataChunk.NEW_OR_UPDATE, is(vistaDataChunk.getType()));
        Map<String,Object> jsonMap = vistaDataChunk.getJsonMap();

        assertThat("C32 Document", is(jsonMap.get("kind")));
        assertThat("urn:va:vlerdocument:VLER:"+icn+":"+testCCDADocument.getDocumentUniqueId(), is(jsonMap.get("uid")));
        assertThat(testCCDADocument.getName(), is(jsonMap.get("name")));
        assertThat(testDocDateTime, is(jsonMap.get("creationTime")));
        assertThat("Continuity of Care Document", is(jsonMap.get("summary")));
        assertThat(testCCDADocument.getDocumentUniqueId(), is(jsonMap.get("documentUniqueId")));
        assertThat(testCCDADocument.getHomeCommunityId(), is(jsonMap.get("homeCommunityId")));
        assertThat(testCCDADocument.getMimeType(), is(jsonMap.get("mimeType")));
        assertThat(testCCDADocument.getRepositoryUniqueId(), is(jsonMap.get("repositoryUniqueId")));
        assertThat(testCCDADocument.getSourcePatientId(), is(jsonMap.get("sourcePatientId")));
        List sectionList = (List) jsonMap.get("sections");
        assertThat(sectionList.size(), is(13));
        testCCDASectionList(sectionList);
    }

    private void testCCDASectionList(List sectionList) {
        final int SECTION_COMMENTS = 0;
        final int SECTION_ALLERGIES = 1;
        final int SECTION_MEDICATIONS = 2;
        final int SECTION_ACTIVE_PROBLEMS = 3;
        final int SECTION_RESOLVED_PROBLEMS = 4;
        final int SECTION_ENCOUNTERS = 5;
        final int SECTION_IMMUNIZATIONS = 6;
        final int SECTION_SOCIAL_HISTORY = 7;
        final int SECTION_VITALS = 8;
        final int SECTION_PLAN_OF_CARE = 9;
        final int SECTION_PROCEDURES = 10;
        final int SECTION_STUDIES_SUMMARY = 11;
        final int SECTION_ADDITIONAL_COMMENTS = 12;

        for(int i = 0; i < sectionList.size(); i++) {
            Map section = (Map) sectionList.get(i);

            switch (i) {
                case SECTION_COMMENTS:
                    testSection(section,
                            new String[]{},
                            "X-DOCCMT",
                            "Source Comments");
                    break;
                case SECTION_ALLERGIES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.6.1"},
                            "48765-2",
                            "Active Allergies and Adverse Reactions");
                    break;
                case SECTION_MEDICATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.1.1"},
                            "10160-0",
                            "Current Medications");
                    break;
                case SECTION_ACTIVE_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.5.1"},
                            "11450-4",
                            "Active Problems");
                    break;
                case SECTION_RESOLVED_PROBLEMS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.20"},
                            "11348-0",
                            "Resolved Problems");
                    break;
                case SECTION_ENCOUNTERS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.3",
                                    "2.16.840.1.113883.3.88.11.83.127",
                                    "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.3",
                                    "2.16.840.1.113883.10.20.22.2.22"},
                            "46240-8",
                            "Most Recent Encounters");
                    break;
                case SECTION_PLAN_OF_CARE:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.10"},
                            "18776-5",
                            "Plan of Care");
                    break;
                case SECTION_IMMUNIZATIONS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.2.1"},
                            "11369-6",
                            "Immunizations");
                    break;
                case SECTION_SOCIAL_HISTORY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.1.15",
                                    "1.3.6.1.4.1.19376.1.5.3.1.3.16",
                                    "2.16.840.1.113883.10.20.22.2.17"},
                            "29762-2",
                            "Social History");
                    break;
                case SECTION_PROCEDURES:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.7.1"},
                            "47519-4",
                            "Procedures from 09/14/2014 to 12/14/2014");
                    break;
                case SECTION_STUDIES_SUMMARY:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.3.1"},
                            "30954-2",
                            "Results from 09/14/2014 to 12/14/2014");
                    break;
                case SECTION_VITALS:
                    testSection(section,
                            new String[]{"2.16.840.1.113883.10.20.22.2.4.1"},
                            "8716-3",
                            "Last Filed Vital Signs");
                    break;
                case SECTION_ADDITIONAL_COMMENTS:
                    testSection(section,
                            new String[]{},
                            "X-DOCCMT",
                            "Additional Source Comments");
                    break;
                default:
                    fail("Section unaccounted for");
                    break;
            }
        }
    }

    @Test
    public void testRetrieveVlerDocuments() {
        VlerQuery query = new VlerQuery();

        query.setPatientIds(new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build());

        List<VLERDoc> vlerDocuments = vlerService.retrieveVlerDocuments(query);

        assertNotNull(vlerDocuments);
        assertThat(vlerDocuments.size(), is(1));

        for(VLERDoc doc : vlerDocuments) {
            assertThat(doc.getMimeType(), is(testC32Document.getMimeType()));
            assertThat(doc.getCreationTime(), is(testC32Document.getCreationTime()));
            assertThat(doc.getDocument(), is(testC32Document.getDocument()));
            assertThat(doc.getDocumentUniqueId(), is(testC32Document.getDocumentUniqueId()));
            assertThat(doc.getHomeCommunityId(), is(testC32Document.getHomeCommunityId()));
            assertThat(doc.getName(), is(testC32Document.getName()));
            assertThat(doc.getRepositoryUniqueId(), is(testC32Document.getRepositoryUniqueId()));
            assertThat(doc.getSourcePatientId(), is(testC32Document.getSourcePatientId()));

            for(Author author : doc.getAuthorList()) {
                assertThat(author.getName(), is(testC32Document.getAuthorList().get(0).getName()));
                assertThat(author.getInstitution(), is(testC32Document.getAuthorList().get(0).getInstitution()));
            }
        }
    }

    @Test
    public void testNullAndEmptyVlerDocumentList() {

        //return null list
        when(mockDocQueryResponse.getDocumentList()).thenReturn(null);

        PatientIds patientIds = new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build();

        List<VistaDataChunk> vistaDataChunkList = vlerService.fetchVlerData(patientIds);
        assertNotNull(vistaDataChunkList);
        assertThat(vistaDataChunkList.size(), is(0));

        //return empty list
        when(mockDocQueryResponse.getDocumentList()).thenReturn(new ArrayList<VLERDoc>());

        assertNotNull(vistaDataChunkList);
        assertThat(vistaDataChunkList.size(), is(0));
    }

    /**
     * Read file.
     *
     * @param testDataFolder the test data folder
     * @param sFile the s file
     * @return the string
     * @throws java.io.IOException Signals that an I/O exception has occurred.
     */
    private String readFile(final String testDataFolder, final String sFile) throws IOException {
        final InputStream isFileData = VlerServiceTest.class.getClassLoader().getResourceAsStream(testDataFolder + sFile);
        final StringWriter swFileData = new StringWriter();
        String sFileData;
        IOUtils.copy(isFileData, swFileData);
        sFileData = swFileData.toString();

        return sFileData;
    }
}
