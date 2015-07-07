package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.VisitTreatment;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.junit.Test;

public class VisitTreatmentImporterTest extends AbstractImporterTest {
    @Test
    public void testImport() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("ptf.json"), mockPatient, "ptf");

        VisitTreatment ptf = (VisitTreatment) importer.convert(chunk);
    }
}
