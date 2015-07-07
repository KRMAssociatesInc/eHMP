package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Procedure;
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

public class RadiologyImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() {
        Procedure a = (Procedure) importer.convert(MockVistaDataChunks.createFromJson(getImageResourceAsStream(), mockPatient, "rad"));

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));

        assertThat(a.getUid(), is(equalTo(UidUtils.getRadiologyUid(MockVistaDataChunks.VISTA_ID, "100847", "6888880.8869-1"))));
        assertThat(a.getCategory(), is(equalTo("RA")));
        assertThat(a.getDateTime(), is(new PointInTime(2011, 11, 19, 11, 30)));
        assertThat(a.getEncounterUid(), is(equalTo(UidUtils.getVisitUid(MockVistaDataChunks.VISTA_ID, "100847", "7289"))));

        assertThat(a.getFacilityName(), is(equalTo("SLC-FO HMP DEV")));
        assertThat(a.getFacilityCode(), is(equalTo("SLC")));
        assertThat(a.getImageLocation(), is(equalTo("RADIOLOGY MAIN FLOOR")));
        assertThat(a.getHasImages(), is(false));
        assertThat(a.getImagingTypeUid(), is(equalTo("urn:va:imaging-Type:GENERAL RADIOLOGY")));
        assertThat(a.getKind(), is(equalTo("Radiology")));
        assertThat(a.getLocalId(), is(equalTo("6888880.8869-1")));
        assertThat(a.getLocationUid(), is(equalTo("urn:va:location:40")));
        assertThat(a.getOrderUid(), is(equalTo(UidUtils.getOrderUid(MockVistaDataChunks.VISTA_ID, "100847", "34937"))));
        assertThat(a.getProviders().size(), is(1));
        assertThat(a.getProviders().iterator().next().getUid(), is(equalTo(UidUtils.getUserUid(MockVistaDataChunks.VISTA_ID, "1122"))));
        assertThat(a.getResults().size(), is(1));
        assertThat(a.getResults().iterator().next().getUid(), is(equalTo(UidUtils.getDocumentUid(MockVistaDataChunks.VISTA_ID, "100847", "6888880.8869-1"))));
        assertThat(a.getStatus(), is(equalTo("COMPLETE")));
        assertThat(a.getSummary(), is(equalTo("RADIOLOGIC EXAMINATION, CHEST, 2 VIEWS, FRONTAL AND LATERAL;")));
        assertThat(a.getTypeName(), is(equalTo("RADIOLOGIC EXAMINATION, CHEST, 2 VIEWS, FRONTAL AND LATERAL;")));
        assertThat(a.getVerified(), is(true));

    }

    public static InputStream getImageResourceAsStream() {
        return RadiologyImporterTest.class.getResourceAsStream("image.json");
    }

}
