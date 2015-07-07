package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.ImportTestSession;
import gov.va.cpe.test.junit4.runners.ImporterIntegrationTestRunner;
import gov.va.cpe.test.junit4.runners.TestPatients;
import gov.va.cpe.test.junit4.runners.VprExtract;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.core.IsNot.not;
import static org.junit.Assert.assertThat;

@RunWith(ImporterIntegrationTestRunner.class)
@ImportTestSession(connectionUri = "vrpcb://10vehu;vehu10@localhost:29060")
@TestPatients(dfns = {"1", "236", "8", "40"})
@VprExtract(domain = "order")
public class ImportOrdersITCase extends AbstractImporterITCase<Order> {

    public ImportOrdersITCase(VistaDataChunk chunk) {
        super(chunk);
    }

    @Test
    public void testOrderImporter() {
        assertThat(getDomainInstance(), not(nullValue()));
    }
}