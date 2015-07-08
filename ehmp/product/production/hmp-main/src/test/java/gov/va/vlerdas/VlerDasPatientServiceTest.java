package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;

import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.vlerdas.service.VlerDasVitalsService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 */
public class VlerDasPatientServiceTest {

    private static final String TEST_ICN = "123456789";
    private static final String TEST_EDIPI = "ABCD123";

    private static String MOCK_VITAL_JSON_CONTENT = "{test:vital.json}";

    private VlerDasPatientService patientService;
    private PatientIds patientIds;

    @Before
    public void setUp() {
        patientService = new VlerDasPatientService();
        patientIds = createMockPatientIds(TEST_ICN, TEST_EDIPI);
    }

    @Test
    public void testFetchPatient() {
        patientService.setVitalsService(createMockVitalService());

        List<VistaDataChunk> chunks = patientService.fetchVlerDasPatientData(patientIds);

        assertNotNull(chunks);

        assertEquals(1, chunks.size());
        assertThat(chunks.get(0).getContent(), is(MOCK_VITAL_JSON_CONTENT));
    }

    @Test
    public void testFetchPatientInvalidIds() {

        PatientIds nullIcn = createMockPatientIds(null, null);
        PatientIds emptyIcn = createMockPatientIds("", null);
        PatientIds nullIcnWithEmptyEdipi = createMockPatientIds(null, "");

        patientService.setVitalsService(createMockVitalService());

        try {
            patientService.fetchVlerDasPatientData(nullIcn);
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException iae) {
            // this was expected
        }

        try {
            patientService.fetchVlerDasPatientData(emptyIcn);
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException iae) {
            // this was expected
        }

        try {
            patientService.fetchVlerDasPatientData(nullIcnWithEmptyEdipi);
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException iae) {
            // this was expected
        }
    }

    private PatientIds createMockPatientIds(String icn, String edipi) {
        PatientIds mockIds = Mockito.mock(PatientIds.class);
        Mockito.when(mockIds.getIcn()).thenReturn(icn);
        Mockito.when(mockIds.getEdipi()).thenReturn(edipi);
        return mockIds;
    }

    private VlerDasVitalsService createMockVitalService() {
        // setup mock vital service
        VlerDasVitalsService vitalsService = mock(VlerDasVitalsService.class);

        // create fetchData return value
        VistaDataChunk vistaDataChunk = new VistaDataChunk();
        vistaDataChunk.setContent(MOCK_VITAL_JSON_CONTENT);
        List<VistaDataChunk> vistaDataChunkList = Arrays.asList(vistaDataChunk);

        try {
            //mock fetchDodPatientVitals method
            when(vitalsService
                    .fetchData(any(VlerDasQuery.class)))
                    .thenReturn(vistaDataChunkList);

        } catch (VlerDasException e) {
            fail(e.getMessage());
        }
        return vitalsService;
    }
}
