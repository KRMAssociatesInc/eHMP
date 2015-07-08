package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import java.io.InputStream;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class VitalSignImporterTest extends AbstractImporterTest {
    @Test
    public void testImport() {
        VistaDataChunk chunk = MockVistaDataChunks.createFromJson(getVitalSignResourceAsStream(), mockPatient, "vital");
        VitalSign temperature = (VitalSign) importer.convert(chunk);

        assertThat(temperature.getFacilityCode(), equalTo("500D"));
        assertThat(temperature.getFacilityName(), equalTo("SLC-FO HMP DEV"));
        assertThat(temperature.getHigh(), equalTo("102"));
        assertThat(temperature.getKind(), equalTo("Vital Sign"));
        assertThat(temperature.getLocalId(), equalTo("298"));
        assertThat(temperature.getLocationCode(), equalTo("urn:va:location:121"));
        assertThat(temperature.getLocationName(), equalTo("MIKE'S IP SUBSPECIALTY"));
        assertThat(temperature.getLow(), equalTo("95"));
        assertThat(temperature.getMetricResult(), equalTo("36.7"));
        assertThat(temperature.getMetricUnits(), equalTo("C"));
        assertThat(temperature.getObserved(), equalTo(new PointInTime(1999, 2, 26, 9, 22)));
        assertThat(temperature.getResult(), equalTo("98"));
        assertThat(temperature.getResulted(), equalTo(new PointInTime(1999, 2, 26, 9, 22, 39)));
        assertThat(temperature.getSummary(), equalTo("TEMPERATURE 98 F"));
        assertThat(temperature.getTypeCode(), equalTo("urn:va:vuid:4500638"));
        assertThat(temperature.getTypeName(), equalTo("TEMPERATURE"));
        assertThat(temperature.getUid(), equalTo(UidUtils.getVitalSignUid("F484", "229", "298")));
        assertThat(temperature.getUnits(), equalTo("F"));
    }

    public static InputStream getVitalSignResourceAsStream() {
        return VitalSignImporterTest.class.getResourceAsStream("vital.json");
    }

}
