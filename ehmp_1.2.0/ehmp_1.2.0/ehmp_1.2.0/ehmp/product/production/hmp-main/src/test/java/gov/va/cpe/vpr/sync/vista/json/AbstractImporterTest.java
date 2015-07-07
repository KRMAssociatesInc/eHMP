package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.convert.VistaDataChunkToPOMObjectConverter;
import gov.va.cpe.vpr.termeng.ITermDataSource;
import gov.va.cpe.vpr.termeng.TermEng;
import org.junit.Before;
import org.junit.BeforeClass;

public abstract class AbstractImporterTest {
    protected static final String MOCK_PID = "34";

    protected PatientDemographics mockPatient;

    protected VistaDataChunkToPOMObjectConverter importer;

    @BeforeClass
    public static void setUpEmptyMockTermEng() {
        TermEng.createInstance(new ITermDataSource[] {});
    }

    @Before
    public void setUp() throws Exception {
        mockPatient = new PatientDemographics();
        mockPatient.setData("pid", MOCK_PID);

        importer = new VistaDataChunkToPOMObjectConverter();
    }
}
