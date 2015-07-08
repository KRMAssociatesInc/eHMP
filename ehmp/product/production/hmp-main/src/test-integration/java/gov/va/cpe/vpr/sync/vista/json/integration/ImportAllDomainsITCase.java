package gov.va.cpe.vpr.sync.vista.json.integration;

import gov.va.cpe.test.junit4.runners.ImportTestSession;
import gov.va.cpe.test.junit4.runners.ImporterIntegrationTestRunner;
import gov.va.cpe.test.junit4.runners.TestPatients;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(ImporterIntegrationTestRunner.class)
@Suite.SuiteClasses({
        ImportVisitsITCase.class,
        ImportProblemsITCase.class,
        ImportDocumentsITCase.class,
        ImportVitalSignITCase.class,
        ImportImmunizationsITCase.class,
        ImportMedicationsITCase.class,
        ImportOrdersITCase.class,
        ImportSurgeriesITCase.class,
        ImportConsultsITCase.class,
        ImportRadiologyITCase.class,
        ImportAllergiesITCase.class,
        ImportAppointmentsITCase.class,
        ImportHealthFactorsITCase.class,
        ImportObservationsITCase.class
})
@ImportTestSession(connectionUri = "vrpcb://10vehu;vehu10@localhost:29060")
@TestPatients(dfns = {"100846", "229", "301"})
public class ImportAllDomainsITCase {
}
