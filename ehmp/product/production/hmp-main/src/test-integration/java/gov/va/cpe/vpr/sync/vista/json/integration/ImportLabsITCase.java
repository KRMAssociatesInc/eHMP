package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.ImportTestSession;
import gov.va.cpe.test.junit4.runners.ImporterIntegrationTestRunner;
import gov.va.cpe.test.junit4.runners.TestPatients;
import gov.va.cpe.test.junit4.runners.VprExtract;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.hamcrest.CoreMatchers;
import org.hamcrest.core.IsNot;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(ImporterIntegrationTestRunner.class)
@ImportTestSession(connectionUri = "vrpcb://10vehu;vehu10@localhost:29060")
@TestPatients(dfns = {"129", "1"})
@VprExtract(domain = "lab")
public class ImportLabsITCase extends AbstractImporterITCase<Result> {
    public ImportLabsITCase(VistaDataChunk chunk) {
        super(chunk);
    }

    @Test
    public void testAccessionImporter() {
        Assert.assertThat(getDomainInstance(), IsNot.not(CoreMatchers.nullValue()));
    }

}
