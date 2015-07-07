package gov.va.jmeadows.util.document.convert;

import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.va.hmp.HmpProperties;
import org.apache.commons.io.FilenameUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.StandardEnvironment;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.Future;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ConvertDocumentServiceTest {

    private ConvertDocumentCommand testConvertCmdHtml;
    private ConvertDocumentCommand testConvertCmdPdf;
    private ConvertDocumentCommand testConvertCmdText;

    private ConvertDocumentService testConvertDocumentService;

    private Environment mockEnvironment;
    private ConvertDocumentConfiguration config;

    private static final String INPUT_FILEPATH = "/home/myaccount/input";
    private static final String INPUT_FILENAME = "testFile.rtf";

    private static final String OUTPUT_FILEPATH = "/home/myaccount/convert";
    private static final String OUTPUT_FILENAME = "testFile.";

    private static final String USER_PROFILE_FILEPATH = "/home/myaccount/profileInstall";

    private Runtime mockRuntime;
    private Process mockProcess;
    private File mockInputFile;
    private File mockOutputDir;
    private File mockOutputFileHtml;
    private File mockOutputFilePdf;
    private File mockOutputFileText;
    private File mockUserProfileDir;

    private String officeVersion;

    @Before
    public void setup() {

        mockEnvironment = mock(StandardEnvironment.class);

        when(mockEnvironment.getProperty(HmpProperties.DOC_CONVERT_OFFICE_HOME)).thenReturn("/opt/officehome");
        when(mockEnvironment.getProperty(HmpProperties.DOC_CONVERT_MAX_THREADS)).thenReturn("2");
        when(mockEnvironment.getProperty(HmpProperties.DOC_CONVERT_TIMEOUT_MS)).thenReturn("30000");

        config = new ConvertDocumentConfiguration(mockEnvironment);

        mockInputFile = mock(File.class);
        mockOutputDir = mock(File.class);
        mockOutputFileHtml = mock(File.class);
        mockOutputFilePdf = mock(File.class);
        mockOutputFileText = mock(File.class);
        mockUserProfileDir = mock(File.class);

        when(mockInputFile.getAbsolutePath()).thenReturn(INPUT_FILEPATH + "/" + INPUT_FILENAME);
        when(mockInputFile.getName()).thenReturn(INPUT_FILENAME);
        when(mockOutputDir.getAbsolutePath()).thenReturn(OUTPUT_FILEPATH);

        when(mockOutputFileHtml.getAbsolutePath()).thenReturn(OUTPUT_FILEPATH + "/" + OUTPUT_FILENAME + DocumentType.HTML.getFileExtension());
        when(mockOutputFileHtml.getName()).thenReturn(OUTPUT_FILENAME + DocumentType.HTML.getFileExtension());
        when(mockOutputFileHtml.exists()).thenReturn(true);

        when(mockOutputFilePdf.getAbsolutePath()).thenReturn(OUTPUT_FILEPATH + "/" + OUTPUT_FILENAME + DocumentType.PDF.getFileExtension());
        when(mockOutputFilePdf.getName()).thenReturn(OUTPUT_FILENAME + DocumentType.PDF.getFileExtension());
        when(mockOutputFilePdf.exists()).thenReturn(true);

        when(mockOutputFileText.getAbsolutePath()).thenReturn(OUTPUT_FILEPATH + "/" + OUTPUT_FILENAME + DocumentType.TEXT.getFileExtension());
        when(mockOutputFileText.getName()).thenReturn(OUTPUT_FILENAME + DocumentType.TEXT.getFileExtension());
        when(mockOutputFileText.exists()).thenReturn(true);

        when(mockUserProfileDir.getAbsolutePath()).thenReturn(USER_PROFILE_FILEPATH);
        when(mockUserProfileDir.exists()).thenReturn(false);

        mockRuntime = mock(Runtime.class);
        mockProcess = mock(Process.class);

        officeVersion = "LibreOffice 4.2.4.2 63150712c6d317d27ce2db16eb94c2f3d7b699f8";

        try {
            when(mockProcess.waitFor()).thenReturn(0);
            when(mockProcess.getInputStream()).thenReturn(new ByteArrayInputStream(officeVersion.getBytes()));
            when(mockRuntime.exec(any(String.class))).thenReturn(mockProcess);
        } catch (IOException | InterruptedException e) {
            fail(e.getMessage());
        }

        testConvertCmdHtml = new ConvertDocumentCommand(DocumentType.HTML, config.getOfficeHome(),
                mockInputFile, mockOutputDir, config.getMaxThreads(), config.getTimeoutMS()) {
            @Override
            protected File createUniqueUserProfileDir() {
                return mockUserProfileDir;
            }

            @Override
            protected Runtime getRuntime() {
                return mockRuntime;
            }

            @Override
            protected File retrieveConvertedFile() {
                return mockOutputFileHtml;
            }
        };

        testConvertCmdPdf = new ConvertDocumentCommand(DocumentType.PDF, config.getOfficeHome(),
                mockInputFile, mockOutputDir, config.getMaxThreads(), config.getTimeoutMS()) {
            @Override
            protected File createUniqueUserProfileDir() {
                return mockUserProfileDir;
            }

            @Override
            protected Runtime getRuntime() {
                return mockRuntime;
            }

            @Override
            protected File retrieveConvertedFile() {
                return mockOutputFilePdf;
            }
        };

        testConvertCmdText = new ConvertDocumentCommand(DocumentType.TEXT, config.getOfficeHome(),
                mockInputFile, mockOutputDir, config.getMaxThreads(), config.getTimeoutMS()) {
            @Override
            protected File createUniqueUserProfileDir() {
                return mockUserProfileDir;
            }

            @Override
            protected Runtime getRuntime() {
                return mockRuntime;
            }

            @Override
            protected File retrieveConvertedFile() {
                return mockOutputFileText;
            }
        };

        testConvertDocumentService = new ConvertDocumentService(config) {
            @Override
            protected ConvertDocumentCommand createConvertDocCommand(DocumentType documentType, File inputFile, File outputDir) {
                if (documentType == DocumentType.HTML) return testConvertCmdHtml;
                else if (documentType == DocumentType.PDF) return testConvertCmdPdf;
                else if (documentType == DocumentType.TEXT) return testConvertCmdText;

                return null;
            }

            @Override
            protected Runtime getRuntime() {
                return mockRuntime;
            }

            ;
        };
    }

    @Test
    public void testConvert2HTML() {
        Future<File> future = testConvertDocumentService.convert2HTML(mockInputFile, mockOutputDir);
        assertNotNull(future);

        try {
            assertThat(mockOutputFileHtml, is(future.get()));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testConvert2PDF() {
        Future<File> future = testConvertDocumentService.convert2PDF(mockInputFile, mockOutputDir);
        assertNotNull(future);

        try {
            assertThat(mockOutputFilePdf, is(future.get()));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testConvert2Text() {
        Future<File> future = testConvertDocumentService.convert2Text(mockInputFile, mockOutputDir);
        assertNotNull(future);

        try {
            assertThat(mockOutputFileText, is(future.get()));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testConvert() {
        List<Future<File>> futures = testConvertDocumentService.convert(
                mockInputFile, mockOutputDir, DocumentType.HTML, DocumentType.PDF, DocumentType.TEXT);

        for (Future<File> future : futures) {

            try {
                assertTrue(FilenameUtils.getExtension(future.get().getName()).matches("(html|pdf|txt)"));
            } catch (Exception e) {
                fail(e.getMessage());
            }
        }
    }

    @Test
    public void testFailure() {
        try {
            when(mockRuntime.exec(any(String.class))).thenThrow(new RuntimeException("Exception"));
        } catch (IOException e) {
            fail(e.getMessage());
        }

        Future<File> future = testConvertDocumentService.convert2Text(mockInputFile, mockOutputDir);
        assertNotNull(future);

        try {
            future.get();
            fail("Exception should have been thrown");
        } catch (Exception e) {
            assertTrue(e.getCause() instanceof HystrixRuntimeException);
        }
    }
}
