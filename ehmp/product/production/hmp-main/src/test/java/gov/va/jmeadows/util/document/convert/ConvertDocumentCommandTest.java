package gov.va.jmeadows.util.document.convert;

import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.Future;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ConvertDocumentCommandTest {

    private ConvertDocumentCommand testConvertCmdHtml;
    private ConvertDocumentCommand testConvertCmdPdf;
    private ConvertDocumentCommand testConvertCmdText;

    private String officeHome = "/opt/officehome";

    private static final String INPUT_FILEPATH = "/home/myaccount/input";
    private static final String INPUT_FILENAME = "testFile.rtf";

    private static final String OUTPUT_FILEPATH = "/home/myaccount/convert";
    private static final String OUTPUT_FILENAME = "testFile.";

    private static final String USER_PROFILE_FILEPATH = "/home/myaccount/profileInstall";

    private static final Integer MAX_THREADS = 2;
    private static final Integer TIMEOUT_MS = 30 * 1000;

    private Runtime mockRuntime;
    private Process mockProcess;
    private File mockInputFile;
    private File mockOutputDir;
    private File mockOutputFileHtml;
    private File mockOutputFilePdf;
    private File mockOutputFileText;
    private File mockUserProfileDir;


    @Before
    public void setup() {

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

        try {
            when(mockProcess.waitFor()).thenReturn(0);
            when(mockRuntime.exec(any(String.class))).thenReturn(mockProcess);
        } catch (IOException | InterruptedException e) {
            fail(e.getMessage());
        }

        testConvertCmdHtml = new ConvertDocumentCommand(DocumentType.HTML, officeHome, mockInputFile,
                mockOutputDir, MAX_THREADS, TIMEOUT_MS) {
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

        testConvertCmdPdf = new ConvertDocumentCommand(DocumentType.PDF, officeHome, mockInputFile,
                mockOutputDir, MAX_THREADS, TIMEOUT_MS) {
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

        testConvertCmdText = new ConvertDocumentCommand(DocumentType.TEXT, officeHome, mockInputFile,
                mockOutputDir, MAX_THREADS, TIMEOUT_MS) {
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

    }

    @Test
    public void testConvert() {
        File output = testConvertCmdHtml.convert();
        assertThat(output.getAbsolutePath(), is(mockOutputFileHtml.getAbsolutePath()));
    }

    @Test
    public void testBadParams() {

        try {
            testConvertCmdHtml = new ConvertDocumentCommand(DocumentType.HTML, "", null, null, 0, 0);
            fail("Exception should have been thrown");
        } catch (Exception e) {
            assertTrue(e instanceof IllegalArgumentException);
        }
    }

    @Test
    public void testHystrixThreadPool() {
        try {
            Future<File> futureHtml = testConvertCmdHtml.queue();
            Future<File> futurePdf = testConvertCmdPdf.queue();
            Future<File> futureText = testConvertCmdText.queue();

            assertThat(futureHtml.get().getAbsolutePath(), is(mockOutputFileHtml.getAbsolutePath()));
            assertThat(futurePdf.get().getAbsolutePath(), is(mockOutputFilePdf.getAbsolutePath()));
            assertThat(futureText.get().getAbsolutePath(), is(mockOutputFileText.getAbsolutePath()));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
}
