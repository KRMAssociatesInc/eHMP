package gov.va.nhin.vler.service;

import gov.va.cpe.idn.PatientIds;
import gov.va.hmp.HmpProperties;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static junit.framework.TestCase.fail;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RetrieveVlerDocumentServiceTest {
    /** The Constant C32_DATA_FOLDER. */
    private static final String C32_DATA_FOLDER = "gov/va/nhin/vler/service/";

    //private VlerService vlerService;
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
    
    private String testDocumentUniqueId = "e587bf82-bfae-4499-9ca8-6babf6eea630";
    private String testHomeCommunityId = "urn:oid:1.3.6.1.4.1.26580.10";
    private String testName = "Continuity of Care Document";
    private String testRepositoryUniqueId = "1.2.840.114350.1.13.122.3.7.2.688879.121218";
    private String testSourcePatientId = "'8394^^^&1.3.6.1.4.1.26580.10.1.100&ISO'";
    private String testAuthorInstitution = "Kaiser Permanente Southern California - RESC";
    private String testAuthorName = "Kaiser Permanente Southern California - RESC";

    private VLERDoc testVlerMetaDocument;
    private VLERDoc testVlerDocument;
    private VLERDocQueryResponse mockDocQueryResponse;
    private VLERDocRetrieveResponse mockDocRetrieveResponse;
    private RetrieveVlerDocumentService retrieveVlerDocumentService;

    private String C32;

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

        testVlerMetaDocument.setDocumentUniqueId(testDocumentUniqueId);
        testVlerMetaDocument.setHomeCommunityId(testHomeCommunityId);
        testVlerMetaDocument.setName(testName);
        testVlerMetaDocument.setRepositoryUniqueId(testRepositoryUniqueId);
        testVlerMetaDocument.setSourcePatientId(testSourcePatientId);


        testVlerMetaDocument.setCreationTime(testDocDateTime);

        Author author = new Author();
        author.setInstitution(testAuthorInstitution);
        author.setName(testAuthorName);

        testVlerMetaDocument.getAuthorList().add(author);

        testVlerDocument = new VLERDoc();
        testVlerDocument.getAuthorList().addAll(testVlerMetaDocument.getAuthorList());
        testVlerDocument.setCreationTime("20140616213908-0400");
        testVlerDocument.setDocumentUniqueId(testVlerMetaDocument.getDocumentUniqueId());
        testVlerDocument.setHomeCommunityId(testVlerMetaDocument.getHomeCommunityId());
        testVlerDocument.setMimeType("text/xml");
        testVlerDocument.setName(testVlerMetaDocument.getName());
        testVlerDocument.setRepositoryUniqueId(testVlerMetaDocument.getRepositoryUniqueId());
        testVlerDocument.setSourcePatientId(testVlerMetaDocument.getSourcePatientId());

        try {
            C32 = readFile(C32_DATA_FOLDER, "c32.xml");
        } catch (IOException e) {
            fail(e.getMessage());
        }

        testVlerDocument.setDocument(C32.getBytes());

        mockDocQueryResponse = mock(VLERDocQueryResponse.class);
        when(mockDocQueryResponse.getDocumentList()).thenReturn(Arrays.asList(testVlerMetaDocument));


        this.retrieveVlerDocumentService = mock(RetrieveVlerDocumentService.class);

        when(this.retrieveVlerDocumentService.retrieveVlerDocumentList(any(VlerQuery.class)))
                .thenReturn(mockDocQueryResponse);

        mockDocRetrieveResponse = mock(VLERDocRetrieveResponse.class);
        when(mockDocRetrieveResponse.getVlerDoc()).thenReturn(testVlerDocument);

        try {
            Future<VLERDocRetrieveResponse> mockFuture = (Future<VLERDocRetrieveResponse>) mock(Future.class);
            when(mockFuture.get()).thenReturn(mockDocRetrieveResponse);

            when(this.retrieveVlerDocumentService.retrieveVlerDocument(any(VlerQuery.class)))
                    .thenReturn(mockFuture);
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }
    }
    
    @Test
    public void testRetrieveVlerDocument() {

        VlerQuery vlerQuery = new VlerQuery();

        vlerQuery.setPatientIds(new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build());
        
        VLERDocRetrieveResponse vlerDocRetrieveResponse = null;
        try {
            Future vlerFuture = (Future) this.retrieveVlerDocumentService.retrieveVlerDocument(vlerQuery);
            vlerDocRetrieveResponse = (VLERDocRetrieveResponse) vlerFuture.get();
        } catch (InterruptedException | ExecutionException e) {
        	
        }
        
        VLERDoc vlerDoc = vlerDocRetrieveResponse.getVlerDoc();
        
        assertThat(testDocumentUniqueId, is(vlerDoc.getDocumentUniqueId()));
        assertThat(testHomeCommunityId, is(vlerDoc.getHomeCommunityId()));
        assertThat(testName, is(vlerDoc.getName()));
        assertThat(testRepositoryUniqueId, is(vlerDoc.getRepositoryUniqueId()));
        assertThat(testSourcePatientId, is(vlerDoc.getSourcePatientId()));
        assertThat("20140616213908-0400", is(vlerDoc.getCreationTime()));
        assertThat(testAuthorInstitution, is(vlerDoc.getAuthorList().get(0).getName()));
        assertThat(testAuthorName, is(vlerDoc.getAuthorList().get(0).getInstitution()));
        assertThat("text/xml", is(vlerDoc.getMimeType()));
    }
    
    @Test
    public void testRetrieveVlerDocumentList() {

        VlerQuery query = new VlerQuery();

        query.setPatientIds(new PatientIds.Builder()
                .pid(pid)
                .icn(icn)
                .uid(uid)
                .build());
        
        VLERDocQueryResponse vlerDocQueryResponse = retrieveVlerDocumentService.retrieveVlerDocumentList(query);
        
        List<VLERDoc> list = vlerDocQueryResponse.getDocumentList();
        
        assertThat(1, is(list.size()));
        
        for(VLERDoc vlerDoc:list) {
            assertThat(testDocumentUniqueId, is(vlerDoc.getDocumentUniqueId()));
            assertThat(testHomeCommunityId, is(vlerDoc.getHomeCommunityId()));
            assertThat(testName, is(vlerDoc.getName()));
            assertThat(testRepositoryUniqueId, is(vlerDoc.getRepositoryUniqueId()));
            assertThat(testSourcePatientId, is(vlerDoc.getSourcePatientId()));
            assertThat(testDocDateTime, is(vlerDoc.getCreationTime()));
            assertThat(testAuthorInstitution, is(vlerDoc.getAuthorList().get(0).getName()));
            assertThat(testAuthorName, is(vlerDoc.getAuthorList().get(0).getInstitution()));
        }
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
