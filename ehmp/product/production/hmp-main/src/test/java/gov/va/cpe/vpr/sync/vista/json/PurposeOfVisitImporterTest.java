package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.PurposeOfVisit;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PurposeOfVisitImporterTest extends AbstractImporterTest {

    @Test
    public void testImport() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("pov.json"), mockPatient, "pov");

        PurposeOfVisit pov = (PurposeOfVisit) importer.convert(chunk);

        assertThat(pov.getPid(), is(equalTo(MOCK_PID)));
        assertThat(pov.getUid(), is(UidUtils.getPurposeOfVisitUid("F484", "229", "708")));
        assertThat(pov.getLocalId(), is("708"));
        assertThat(pov.getFacilityCode(), is("888"));
        assertThat(pov.getFacilityName(), is("FT. LOGAN"));
        assertThat(pov.getEncounterUid(), is(UidUtils.getVisitUid("F484", "229", "3305")));
        assertThat(pov.getEncounterName(), is("GENERAL MEDICINE May 15, 2003"));
        assertThat(pov.getName(), is("Acute appendicitis with generalized peritonitis"));
        assertThat(pov.getType(), is("P"));
        assertThat(pov.getLocationName(), is("GENERAL MEDICINE"));
        assertThat(pov.getIcdCode(), is("urn:icd:540.0"));
        assertThat(pov.getEntered(), is(new PointInTime(2003, 5, 15, 8, 15)));
    }
}
