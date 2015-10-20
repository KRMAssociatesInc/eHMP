package us.vistacore.vxsync.vler;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import static junit.framework.TestCase.fail;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.hamcrest.core.StringStartsWith.startsWith;

public class VlerDocumentUtilTest
{
    /** The Constant VLER_DATA_FOLDER. */
    private static final String VLER_DATA_FOLDER = "vler/";

    private String C32;
    private String CCDA;

    @Before
    public void setup() {
        try {
            C32 = readFile(VLER_DATA_FOLDER, "c32.xml");
            CCDA = readFile(VLER_DATA_FOLDER, "ccda.xml");
        } catch (IOException e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void testXsltCcdaDocument() {
        String html = VlerDocumentUtil.xsltCcdaDocument(CCDA);
        assertThat(html, notNullValue());
        assertThat(html, startsWith("<!DOCTYPE html PUBLIC"));
    }

    @Test
    public void testXsltC32Document() {
        String html = VlerDocumentUtil.xsltCcdaDocument(C32);
        assertThat(html, notNullValue());
        assertThat(html, startsWith("<!DOCTYPE html PUBLIC"));
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
        final InputStream isFileData = VlerDocumentUtilTest.class.getClassLoader().getResourceAsStream(testDataFolder + sFile);
        final StringWriter swFileData = new StringWriter();
        String sFileData;
        IOUtils.copy(isFileData, swFileData);
        sFileData = swFileData.toString();

        return sFileData;
    }
}
