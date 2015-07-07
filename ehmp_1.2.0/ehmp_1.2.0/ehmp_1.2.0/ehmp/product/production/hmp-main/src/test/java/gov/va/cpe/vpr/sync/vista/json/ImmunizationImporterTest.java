package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Immunization;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.hmp.healthtime.PointInTime;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class ImmunizationImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() {
        Immunization a = (Immunization) importer.convert(MockVistaDataChunks.createFromJson(getImmunizationResourceAsStream(), mockPatient, "immunization"));

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));
        assertThat(a.getUid(), is(equalTo(UidUtils.getImmunizationUid(MockVistaDataChunks.VISTA_ID, "229", "44"))));
        assertThat(a.getLocalId(), is(equalTo("44")));
        assertThat(a.getAdministeredDateTime(), is(new PointInTime(2000, 4, 4, 10, 55, 6)));
        assertThat(a.getComments(), is(equalTo("")));
        assertThat(a.getContraindicated(), is(false));
        assertThat(a.getCptName(), is(equalTo("CHOLERA VACCINE, ORAL")));
        assertThat(a.getCptCode(), is(equalTo("???")));
        assertThat(a.getEncounterUid(), is(equalTo(UidUtils.getVisitUid(MockVistaDataChunks.VISTA_ID, "229", "1975"))));
        assertThat(a.getFacilityName(), is(equalTo("FT. LOGAN")));
        assertThat(a.getFacilityCode(), is(equalTo("???")));
        assertThat(a.getLocation(), is(equalTo("AUDIOLOGY")));
        /*
		 * TODO: Find data for:
		 * - Reaction
		 * - Series
		 */
        assertThat(a.getName(), is(equalTo("PNEUMOCOCCAL")));
        assertThat(a.getPerformerUid(), is(equalTo(UidUtils.getUserUid(MockVistaDataChunks.VISTA_ID, "11278"))));
        assertThat(a.getSummary(), is(equalTo(a.getName())));

    }

    public static InputStream getImmunizationResourceAsStream() {
        return ImmunizationImporterTest.class.getResourceAsStream("immunization.json");
    }
}
