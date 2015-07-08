package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.ImportTestSession;
import gov.va.cpe.test.junit4.runners.ImporterIntegrationTestRunner;
import gov.va.cpe.test.junit4.runners.TestPatients;
import gov.va.cpe.test.junit4.runners.VprExtract;
import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.hamcrest.CoreMatchers;
import org.hamcrest.core.IsNot;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(ImporterIntegrationTestRunner.class)
@ImportTestSession(connectionUri = "vrpcb://10vehu;vehu10@localhost:29060")
@TestPatients(dfns = {"229", "100846"})
@VprExtract(domain = "allergy")
public class ImportAllergiesITCase extends AbstractImporterITCase<Allergy> {
    public ImportAllergiesITCase(VistaDataChunk chunk) {
        super(chunk);
    }

    @Test
    public void testAllergyImporter() {
        Assert.assertThat(getDomainInstance(), IsNot.not(CoreMatchers.nullValue()));
    }

}
