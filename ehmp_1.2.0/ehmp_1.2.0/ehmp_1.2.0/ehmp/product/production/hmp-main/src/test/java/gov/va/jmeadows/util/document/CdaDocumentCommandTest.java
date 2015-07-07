package gov.va.jmeadows.util.document;

import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;
import gov.va.hmp.HmpProperties;
import gov.va.jmeadows.util.document.convert.ConvertDocumentService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class CdaDocumentCommandTest {

    private static final String CDA_TEXT = "test CDA note text";
    private static final String NOTE_PLAIN_TEXT = "plain text note";
    private static final String STORAGE_PATH = "/var/document/storage";
    private static final String FILENAME = "testfile";
    private static final String VPR_DOC_UID = "test.uid";
    private static final String STORAGE_SERVICE_PATH = "https://10.3.3.4:8443/dod/documents";

    private CdaDocumentCommand testCdaDocumentCmd;
    private DodDocumentConfiguration config;
    private Environment mockEnvironment;
    private ConvertDocumentService mockConvertDocumentService;

    private String url = "test.url";
    private long timeoutMS = 45000;
    private String userName = "test.username";
    private String userIen = "test.ien";
    private String userSiteCode = "test.sitecode";
    private String userSiteName = "test.sitename";

    private Document vprDocument;
    private String eventId;
    private PatientIds patientIds;

    @Before
    public void setup() {
        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_URL)).thenReturn(url);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_TIMEOUT_MS)).thenReturn("" + timeoutMS);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_NAME)).thenReturn(userName);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_IEN)).thenReturn(userIen);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_CODE)).thenReturn(userSiteCode);
        when(mockEnvironment.getProperty(HmpProperties.JMEADOWS_USER_SITE_NAME)).thenReturn(userSiteName);
        when(mockEnvironment.getProperty(HmpProperties.DOC_STORE_FILE_PATH)).thenReturn(STORAGE_PATH);

        Future<File> mockHtmlFuture = (Future<File>) mock(Future.class);
        Future<File> mockTextFuture = (Future<File>) mock(Future.class);

        File mockHtmlFile = mock(File.class);
        when(mockHtmlFile.getAbsolutePath()).thenReturn(String.format("%s/%s.html", STORAGE_PATH, FILENAME));
        when(mockHtmlFile.getName()).thenReturn(String.format("%s.html", FILENAME));
        File mockTextFile = mock(File.class);

        try {
            when(mockHtmlFuture.get()).thenReturn(mockHtmlFile);
            when(mockTextFuture.get()).thenReturn(mockTextFile);
        } catch (InterruptedException | ExecutionException e) {
            fail(e.getMessage());
        }

        mockConvertDocumentService = mock(ConvertDocumentService.class);
        when(mockConvertDocumentService.convertCDA2HTML(any(String.class), any(String.class), any(File.class))).thenReturn(mockHtmlFuture);
        when(mockConvertDocumentService.convert2Text(any(File.class), any(File.class))).thenReturn(mockTextFuture);

        vprDocument = new Document();
        vprDocument.setData("uid", VPR_DOC_UID);

        config = new DodDocumentConfiguration(mockEnvironment);
        patientIds = new PatientIds
                .Builder()
                .edipi("test.edipi")
                .pid("test.pid")
                .build();
        eventId = "test.event.id";
        config.setConvertDocumentService(mockConvertDocumentService);
        config.setDocumentStorageServicePath(STORAGE_SERVICE_PATH);

        testCdaDocumentCmd = new CdaDocumentCommand(config, CDA_TEXT, patientIds, eventId, vprDocument) {

            protected File getStorageDir() {
                return new File(STORAGE_PATH);
            }

            protected File storeHtmlFile(File htmlFile, File storageDir) {
                return htmlFile;
            }

            protected String readFileToString(File inputFile) throws IOException {
                return NOTE_PLAIN_TEXT;
            }
        };
    }

    /**
     * Returns hexadecimal representation of pid.
     * @param pid Patient identifier (ICN or a Site;DFN)
     * @return Patient Identifier hexadecimal representation.
     */
    private String pid2HexString(String pid) {
        return new BigInteger(pid.getBytes()).toString(16);
    }

    @Test
    public void testDocumentCommand() {
        try {
            Document resultVprDocument = testCdaDocumentCmd.queue().get();

            verify(mockConvertDocumentService).convertCDA2HTML(any(String.class), any(String.class), any(File.class));
            verify(mockConvertDocumentService).convert2Text(any(File.class), any(File.class));

            assertNotNull(resultVprDocument);
            assertThat(resultVprDocument.getUid(), is(VPR_DOC_UID));
            assertNotNull(resultVprDocument.getText());
            assertThat(resultVprDocument.getText().get(0).getContent(), is(NOTE_PLAIN_TEXT));
            assertThat(resultVprDocument.getDodComplexNoteUri(),
                    is(String.format("%s/%s/%s.html", STORAGE_SERVICE_PATH, pid2HexString("test.pid"), FILENAME)));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testFailure() {
        testCdaDocumentCmd = new CdaDocumentCommand(config, CDA_TEXT, patientIds, eventId, vprDocument) {

            protected File getStorageDir() {
                return new File(STORAGE_PATH);
            }

            protected File storeHtmlFile(File htmlFile, File storageDir) {
                throw new DodDocumentException("Cannot write store DoD document to disk");
            }

            protected String readFileToString(File inputFile) throws IOException {
                return NOTE_PLAIN_TEXT;
            }
        };

        try {
            testCdaDocumentCmd.queue().get();

            fail("Exception should have been thrown");
        } catch (Exception e) {
            assertTrue(e.getCause() instanceof HystrixRuntimeException);
        }
    }
}
