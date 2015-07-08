package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.SkinTest;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class SkinTestImporterTest extends AbstractImporterTest {
    @Test
    public void testImport() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("skin.json"), mockPatient, "skin");

        SkinTest skin = (SkinTest) importer.convert(chunk);
        assertThat(skin.getPid(), is(equalTo(MOCK_PID)));
        assertThat(skin.getUid(), is(UidUtils.getSkinTestUid("F484", "100846", "10")));
        assertThat(skin.getLocalId(), is("10"));
        assertThat(skin.getFacilityCode(), is("500D"));
        assertThat(skin.getFacilityName(), is("SLC-FO HMP DEV"));
        assertThat(skin.getEncounterUid(), is(UidUtils.getVisitUid("F484", "100846", "7233")));
        assertThat(skin.getEncounterName(), is("PC MD SEVEN Nov 16, 2011"));
        assertThat(skin.getName(), is("PPD"));
        assertThat(skin.getComment(), is("Negative (0 mm induration)"));
        assertThat(skin.getLocationName(), is("PC MD SEVEN"));
        assertThat(skin.getEntered(), is(new PointInTime(2011, 11, 16, 12, 46, 52)));
    }
}
