package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.ImportTestSession;
import gov.va.cpe.test.junit4.runners.ImporterIntegrationTestRunner;
import gov.va.cpe.test.junit4.runners.TestPatients;
import gov.va.cpe.test.junit4.runners.VprExtract;
import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.hamcrest.core.IsNot;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(ImporterIntegrationTestRunner.class)
@ImportTestSession(connectionUri = "vrpcb://10vehu;vehu10@localhost:29060")
@TestPatients(dfns = {"100847"})
@VprExtract(domain = "observation")
public class ImportObservationsITCase extends AbstractImporterITCase<Observation> {
    public ImportObservationsITCase(VistaDataChunk chunk) {
        super(chunk);
    }

    @Test
    public void testAppointmentImporter() throws Exception {
        Assert.assertThat(getDomainInstance(), IsNot.not(null));
    }

}
