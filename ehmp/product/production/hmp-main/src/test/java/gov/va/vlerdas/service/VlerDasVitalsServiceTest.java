package gov.va.vlerdas.service;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.vlerdas.VlerDasDomain;
import gov.va.vlerdas.VlerDasException;
import gov.va.vlerdas.VlerDasQuery;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static junit.framework.TestCase.fail;

/**
 */
public class VlerDasVitalsServiceTest {

    private static final String TEST_ICN = "123456789";

    private VlerDasVitalsService vitalsService;
    private VlerDasQuery query;

    @Before
    public void setUp() {
        vitalsService = new VlerDasVitalsService();
        PatientIds patientIds = new PatientIds.Builder().icn(TEST_ICN).build();
        query = new VlerDasQuery(patientIds, VlerDasDomain.VITALS);
    }

    @Test
    public void testFetchVitals() {
//        try {
//            List<VistaDataChunk> chunks = vitalsService.fetchData(query);
//
//            for (VistaDataChunk chunk : chunks) {
//                //TODO
//            }
//
//
//
//        } catch (VlerDasException vde) {
//            fail(vde.getMessage());
//        }
    }
}
