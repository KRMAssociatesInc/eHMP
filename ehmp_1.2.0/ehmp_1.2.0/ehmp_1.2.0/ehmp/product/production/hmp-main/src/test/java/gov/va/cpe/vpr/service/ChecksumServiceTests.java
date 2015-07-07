package gov.va.cpe.vpr.service;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.sameInstance;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ChecksumServiceTests {

    private ChecksumService service;
    private JdsOperations mockJdsTemplate;

    @Before
    public void setUp() throws Exception {
        mockJdsTemplate = mock(JdsOperations.class);

        service = new ChecksumService();
        service.setJdsTemplate(mockJdsTemplate);
    }

//    @Test
//    public void testCompareJsonNodes() throws Exception {
//
//    }
//
//    @Test
//    public void testGetVistaChecksum() throws Exception {
//
//    }

    @Test
    public void testGetJdsChecksum() throws Exception {
        JsonNode mockJson = POMUtils.parseJSONtoNode("{\"foo\":\"bar\"}");
        when(mockJdsTemplate.getForJsonNode("/vpr/23/checksum/ABCD")).thenReturn(mockJson);
        JsonNode json = service.getJdsChecksum("23", "ABCD");
        Assert.assertThat(json, sameInstance(mockJson));
        verify(mockJdsTemplate).getForJsonNode("/vpr/23/checksum/ABCD");
    }

//    @Test
//    public void testCheckPatientData() throws Exception {
//
//    }
//
//    @Test
//    public void testFuPatientData() throws Exception {
//
//    }
//
//    @Test
//    public void testCheckAllPatientsData() throws Exception {
//
//    }
}
