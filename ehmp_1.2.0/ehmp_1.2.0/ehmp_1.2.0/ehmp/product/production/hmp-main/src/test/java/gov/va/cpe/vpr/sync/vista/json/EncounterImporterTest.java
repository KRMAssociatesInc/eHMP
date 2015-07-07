package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.EncounterProvider;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class EncounterImporterTest extends AbstractImporterTest {
    private List<String> expectedUids = Arrays.asList(
            "urn:va:document:F484:229:4191",
            "urn:va:document:F484:229:4232",
            "urn:va:document:F484:229:4236",
            "urn:va:document:F484:229:4248",
            "urn:va:document:F484:229:4277",
            "urn:va:document:F484:229:4297",
            "urn:va:document:F484:229:4308",
            "urn:va:document:F484:229:4309",
            "urn:va:document:F484:229:4310",
            "urn:va:document:F484:229:4311");

    @Test
    public void testConvert() {
        Encounter a = (Encounter) importer.convert(MockVistaDataChunks.createFromJson(getVisitResourceAsStream(), mockPatient, "visit"));

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));
        assertThat(a.getData().containsKey("current"), is(equalTo(Boolean.TRUE)));
        assertThat(a.getData().get("current").toString(), is(equalTo("false")));

        assertThat(a.getUid(), is(equalTo(UidUtils.getVisitUid(MockVistaDataChunks.VISTA_ID, "229", "7193"))));
        assertThat(a.getLocalId(), is(equalTo("7193")));
        assertThat(a.getCategoryName(), is(equalTo("Admission")));
        assertThat(a.getCategoryCode(), is(equalTo("AD")));
        assertThat(a.getDateTime(), is(new PointInTime(2011, 7, 1, 10, 0)));
        assertThat(a.getDocumentUids().size(), is(10));

        for (Map<String, Object> mp : a.getDocumentUids()) {
            assertThat(expectedUids, hasItem((String) mp.get("uid")));
        }

        assertThat(a.getFacilityName(), is(equalTo("SLC-FO HMP DEV")));
        //assertThat(a.location, is(equalTo("7A GEN MED")))
        assertThat(a.getPatientClassCode(), is(equalTo("IMP")));
        assertThat(a.getLocalId(), is(equalTo("7193")));
        assertThat(a.getStay().getArrivalDateTime(), is(new PointInTime(2011, 7, 1, 10, 0)));
        assertThat(a.getStay().getDischargeDateTime(), is(new PointInTime(2011, 7, 2, 10, 0)));
        for (EncounterProvider ep : a.getProviders()) {
            assertThat(ep.getUid(), is(equalTo(ep.getRole().equals("A") ? "urn:va:user:F484:20006" : "urn:va:user:F484:20001")));
            assertThat(ep.getPrimary(), is(equalTo(ep.getRole().equals("A") ? null : true)));
        }

        assertThat(a.getReason(), is(equalTo(null)));
        assertThat(a.getRoomBed(), is(equalTo("")));
        assertThat(a.getService(), is(equalTo("MEDICINE")));
        assertThat(a.getSpecialty(), is(equalTo("CARDIOLOGY")));
        assertThat(a.getTypeName(), is(equalTo("HOSPITALIZATION")));
    }

    public static InputStream getVisitResourceAsStream() {
        return EncounterImporterTest.class.getResourceAsStream("visit.json");
    }
}
