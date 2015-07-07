package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.*;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.cpe.vpr.sync.vista.json.PatientDemographicsImporter;
import org.junit.runner.RunWith;


@RunWith(ImporterIntegrationTestRunner.class)
@ImportTestSession(connectionUri = "vrpcb://10vehu;vehu10@localhost:29060")
@TestPatients(dfns = {"229", "100846"})
@VprExtract(domain = "demographics")
@Importer(PatientDemographicsImporter.class)
public class ImportDemographicsITCase extends AbstractImporterITCase<PatientDemographics> {
	
	public ImportDemographicsITCase(VistaDataChunk chunk) {
        super(chunk);
    }
}
