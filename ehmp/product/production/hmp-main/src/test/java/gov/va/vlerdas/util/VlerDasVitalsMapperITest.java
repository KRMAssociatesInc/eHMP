package gov.va.vlerdas.util;

import gov.va.cpe.idn.MockPatientIdentityService;
import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertNotNull;

// TODO: Auto-generated Javadoc
/**
 * This an integration test for the VlerDas Mapper
 * (but no infrastructure for separate HMP integration tests exist).
 *
 * @author r_rockenbaugh
 */
public class VlerDasVitalsMapperITest {
    
    /** The Constant VITALS_DATA_FOLDER. */
    private static final String VITALS_DATA_FOLDER = "gov/va/vlerdas/util/vitals/";
    
    /** The Constant DATA_FILE_TYPES. */
    private static final String[] DATA_FILE_TYPES = {"xml"};
       
    /**
     * Test vitals mapping.
     *
     * @throws Exception the exception
     */
    @Test
    public void testVitalsMapping() throws Exception {
        final List<String> saFile = getFileList(VITALS_DATA_FOLDER);
        MockPatientIdentityService mockPatientIdentityService = new MockPatientIdentityService();
        
        for (final String sFile : saFile) {
            final String feedContent = readFile(VITALS_DATA_FOLDER, sFile);
            assertNotNull("The feedContent text should not have been null.", feedContent);
 
            for (String pid : mockPatientIdentityService.getAllPatientIdentifiers()) {
                //mock patient identity service doesn't need valid vista id value
                PatientIds patientIds = mockPatientIdentityService.getPatientIdentifiers("", pid);
                List<VistaDataChunk> list = VlerDasVitalsMapper.getVistaDataChunks(feedContent, patientIds);
                
                assertNotNull("The list should not have been null.", list);
                for (VistaDataChunk chunk : list) {
                    System.out.println(chunk.getContent());
                }
            }         
        }
    }
    
    /**
     * Gets the file list.
     *
     * @param testDataFolder the test data folder
     * @return the file list
     */
    private List<String> getFileList(final String testDataFolder) {
        final List<String> saFile = new ArrayList<>();
        final URL urlTestDataFolder = VlerDasVitalsMapperITest.class.getClassLoader().getResource(testDataFolder);
        final File fTestDataFolder = new File(urlTestDataFolder.getFile());
        final Collection<File> faTestDataFiles = FileUtils.listFiles(fTestDataFolder, DATA_FILE_TYPES, false);
        for (final File fTestDataFile : faTestDataFiles) {
            saFile.add(fTestDataFile.getName());
        }
        return saFile;
    }

    /**
     * Read file.
     *
     * @param testDataFolder the test data folder
     * @param sFile the s file
     * @return the string
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private String readFile(final String testDataFolder, final String sFile) throws IOException {
        final InputStream isFileData = VlerDasVitalsMapperITest.class.getClassLoader().getResourceAsStream(testDataFolder + sFile);
        final StringWriter swFileData = new StringWriter();
        String sFileData;
        IOUtils.copy(isFileData, swFileData);
        sFileData = swFileData.toString();

        return sFileData;
    }
    
}
