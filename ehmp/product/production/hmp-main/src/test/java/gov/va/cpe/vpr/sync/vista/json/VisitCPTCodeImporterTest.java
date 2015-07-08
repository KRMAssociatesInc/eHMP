package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VisitCPTCode;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import java.math.BigDecimal;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class VisitCPTCodeImporterTest extends AbstractImporterTest {

    @Test
    public void testImport() throws Exception {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("cpt.json"), mockPatient, "cpt");

        VisitCPTCode cpt = (VisitCPTCode) importer.convert(chunk);

        assertThat(cpt.getPid(), is(equalTo(MOCK_PID)));
        assertThat(cpt.getUid(), is(UidUtils.getVisitCPTCodeUid("F484", "229", "449")));
        assertThat(cpt.getLocalId(), is("449"));
        assertThat(cpt.getFacilityCode(), is("500"));
        assertThat(cpt.getFacilityName(), is("CAMP MASTER"));
        assertThat(cpt.getEncounterUid(), is(UidUtils.getVisitUid("F484", "229", "786")));
        assertThat(cpt.getEncounterName(), is("LAB DIV 500 OOS ID 108 Sep 17, 1997"));
        assertThat(cpt.getName(), is("HEMATOLOGY PROCEDURE"));
        assertThat(cpt.getType(), is("U"));
        assertThat(cpt.getLocationName(), is("LAB DIV 500 OOS ID 108"));
        assertThat(cpt.getEntered(), is(new PointInTime(1997, 9, 17, 10, 51)));
        assertThat(cpt.getCptCode(), is("urn:cpt:85999"));
        assertThat(cpt.getQuantity(), is(equalTo(new BigDecimal("1.0"))));
    }
}
