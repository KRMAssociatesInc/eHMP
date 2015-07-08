package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.HealthFactor;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;

import static org.junit.Assert.assertEquals;

public class HealthFactorImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getHealthFactorResourceAsStream(), mockPatient, "factor");
        fragment.setLocalPatientId("100846");
        fragment.setSystemId("112");

        HealthFactor hf = (HealthFactor) importer.convert(fragment);
        Assert.assertNotNull(hf);
        assertEquals(MOCK_PID, hf.getPid());
        assertEquals("THESE ARE COMMENTS FOR A HEALTH FACTOR", hf.getComment());
        assertEquals(UidUtils.getHealthFactorUid("F484", fragment.getLocalPatientId(), fragment.getSystemId()), hf.getUid());
        assertEquals("CAMP MASTER", hf.getFacilityName());
        assertEquals("500", hf.getFacilityCode());
        assertEquals("Health Factor", hf.getKind());
        assertEquals("112", hf.getLocalId());
        assertEquals("PREVIOUS SMOKER", hf.getName());
        assertEquals(new PointInTime(2010, 6, 4, 13, 0), hf.getEntered());
        //assertEquals("",hf.severity)
        assertEquals("PREVIOUS SMOKER", hf.getSummary());
        assertEquals(UidUtils.getVisitUid("F484", fragment.getLocalPatientId(), "7142"), hf.getEncounterUid());
    }

    public static InputStream getHealthFactorResourceAsStream() {
        return HealthFactorImporterTest.class.getResourceAsStream("healthFactor.json");
    }
}
