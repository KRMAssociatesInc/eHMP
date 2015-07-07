package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.PatientFacility;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Assert;
import org.junit.Test;

import java.util.LinkedHashMap;

import static org.junit.Assert.assertEquals;

public class AppointmentImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() throws Exception {
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(3);
        map.put("systemId", "F484");
        map.put("code", "500");
        map.put("localPatientId", "100842");
        mockPatient.addToFacilities(new PatientFacility(map));

        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("appointment.json"), mockPatient, "appointment");
        fragment.setLocalPatientId("100842");
        fragment.setSystemId("F484");

        Encounter encounter = (Encounter) importer.convert(fragment);

        Assert.assertNotNull(encounter);

        assertEquals(MOCK_PID, encounter.getPid());
        assertEquals(UidUtils.getAppointmentUid(fragment.getSystemId(), fragment.getLocalPatientId(), "A;3120727.12;195"), encounter.getUid());

        assertEquals("CAMP MASTER", encounter.getFacilityName());
        assertEquals("500", encounter.getFacilityCode());

        assertEquals(new PointInTime(2012, 7, 27, 12, 0), encounter.getDateTime());

        assertEquals("SCHEDULED/KEPT", encounter.getAppointmentStatus());
        assertEquals("Outpatient Visit", encounter.getCategoryName());
        assertEquals("urn:va:encounter-category:OV", encounter.getCategoryCode());
        assertEquals("A;3120727.12;195", encounter.getLocalId());
        assertEquals("AMB", encounter.getPatientClassCode());
        assertEquals("Ambulatory", encounter.getPatientClassName());
        assertEquals("MEDICINE", encounter.getService());
        assertEquals("303", encounter.getStopCode());
        assertEquals("CARDIOLOGY", encounter.getStopCodeName());
        assertEquals("9", encounter.getTypeCode());
        assertEquals("REGULAR", encounter.getTypeName());
        assertEquals(1, encounter.getProviders().size());
        assertEquals("urn:va:user:F484:11256", encounter.getProviders().iterator().next().getProviderUid());
        assertEquals("WARDCLERK,FIFTYEIGHT", encounter.getProviders().iterator().next().getProviderName());
        assertEquals("", encounter.getLocationName());
        assertEquals("urn:va:location:500:0", encounter.getLocationUid());
    }

}
