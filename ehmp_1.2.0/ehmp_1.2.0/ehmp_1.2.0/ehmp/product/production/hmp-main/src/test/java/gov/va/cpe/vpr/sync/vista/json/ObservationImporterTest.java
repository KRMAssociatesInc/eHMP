package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.PatientFacility;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import java.io.InputStream;
import java.util.LinkedHashMap;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class ObservationImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() throws Exception {
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(3);
        map.put("systemId", "F484");
        map.put("code", "500D");
        map.put("localPatientId", "100847");
        mockPatient.addToFacilities(new PatientFacility(map));
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getObservationResourceAsStream(), mockPatient, "observation");
        fragment.setLocalPatientId("100847");

        Observation observation = (Observation) importer.convert(fragment);
        assertNotNull(observation);
        assertEquals(MOCK_PID, observation.getPid());
        assertEquals("500D", observation.getFacilityCode());
        assertEquals("SLC-FO HMP DEV", observation.getFacilityName());
        assertEquals("urn:va:location:F484:5", observation.getLocationUid());
        assertEquals("3N SURGERY", observation.getLocationName());
        assertEquals(UidUtils.getObservationUid("F484", fragment.getLocalPatientId(), observation.getLocalId()), observation.getUid());
        assertEquals("{F7A04600-1F7E-4DC7-B71C-136647E76C8A}", observation.getLocalId());
        assertEquals("Clinical Observation", observation.getKind());
        assertEquals("urn:va:clioterminology:{56BD11AB-FE61-4785-B3CA-C528A5F4EBD6}", observation.getTypeCode());
        assertEquals("OUTPUT - EMESIS", observation.getTypeName());
        assertEquals("1000", observation.getResult());
        assertEquals("ml", observation.getUnits());
        assertEquals("urn:hl7:observation-interpretation:N", observation.getInterpretationCode());
        assertEquals("Normal", observation.getInterpretationName());
        assertEquals(new PointInTime(2011, 11, 18, 13, 17), observation.getObserved());
        assertEquals(new PointInTime(2011, 11, 30, 13, 21, 26), observation.getEntered());
        assertEquals("complete", observation.getStatusName());
        assertNull(observation.getMethodCode());
        assertNull(observation.getMethodName());
        assertNull(observation.getBodySiteCode());
        assertNull(observation.getBodySiteName());

        assertNull(observation.getComment());
        assertNull(observation.getVaStatus());
        assertNull(observation.getQualifierText());
    }

    @Test
    public void testConvertWithQualifiers() throws Exception {
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(3);
        map.put("systemId", "F484");
        map.put("code", "500D");
        map.put("localPatientId", "231");
        mockPatient.addToFacilities(new PatientFacility(map));
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getObservationWithQualifiersResourceAsStream(), mockPatient, "observation");
        fragment.setLocalPatientId("231");

        Observation observation = (Observation) importer.convert(fragment);
        assertNotNull(observation);
        assertEquals(MOCK_PID, observation.getPid());
        assertEquals("500D", observation.getFacilityCode());
        assertEquals("SLC-FO HMP DEV", observation.getFacilityName());
        assertEquals("urn:va:location:F484:56", observation.getLocationUid());
        assertEquals("5TH FLOOR", observation.getLocationName());
        assertEquals(UidUtils.getObservationUid("F484", fragment.getLocalPatientId(), observation.getLocalId()), observation.getUid());
        assertEquals("{D4953826-902D-4722-9520-BE1916BF739B}", observation.getLocalId());
        assertEquals("Clinical Observation", observation.getKind());
        assertEquals("urn:va:clioterminology:{0F33223E-DF2C-6B8B-5201-5E091C5F9065}", observation.getTypeCode());
        assertEquals("TEMPERATURE", observation.getTypeName());
        assertEquals("102.5", observation.getResult());
        assertEquals("F", observation.getUnits());
        assertEquals("urn:hl7:observation-interpretation:H", observation.getInterpretationCode());
        assertEquals("High", observation.getInterpretationName());
        assertEquals(new PointInTime(2012, 6, 29, 16, 14), observation.getObserved());
        assertEquals(new PointInTime(2012, 6, 29, 16, 17, 29), observation.getEntered());
        assertEquals("complete", observation.getStatusName());
        assertNull(observation.getMethodCode());
        assertNull(observation.getMethodName());
        assertEquals("4500642", observation.getBodySiteCode());
        assertEquals("ORAL", observation.getBodySiteName());

        assertNull(observation.getComment());
        assertNull(observation.getVaStatus());
        assertEquals("quality: ACTUAL", observation.getQualifierText());

        assertEquals(1, observation.getQualifiers().size());
        assertEquals("4688634", observation.getQualifiers().iterator().next().getCode());
        assertEquals("ACTUAL", observation.getQualifiers().iterator().next().getName());
        assertEquals("quality", observation.getQualifiers().iterator().next().getType());
    }

    @Test
    public void testConvertInSet() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getObservationInSetResourceAsStream(), mockPatient, "observation");
        fragment.setLocalPatientId("25");

        Observation observation = (Observation) importer.convert(fragment);
        assertThat(observation.getPid(), is(MOCK_PID));
        assertThat(observation.getUid(), is(UidUtils.getObservationUid(fragment.getSystemId(), fragment.getLocalPatientId(), observation.getLocalId())));
        assertThat(observation.getEntered(), is(new PointInTime(2013,2,15,14,31,50)));
        assertThat(observation.getFacilityCode(), is("500D"));
        assertThat(observation.getFacilityName(), is("SLC-FO HMP DEV"));
        assertThat(observation.getInterpretationCode(), is("urn:hl7:observation-interpretation:U"));
        assertThat(observation.getInterpretationName(), is("Unknown"));
        assertThat(observation.getLocalId(), is("{B14A750E-9849-4A50-9725-95EBD2289526}"));
        assertThat(observation.getLocationName(), is("GEN MED"));
        assertThat(observation.getLocationUid(), is("urn:va:location:F484:9"));
        assertThat(observation.getObserved(), is(new PointInTime(2013,2,15,6,53)));
        assertThat(observation.getResult(), is("TRIPLE"));
        assertThat(observation.getSetID(), is("{1BDC4488-C9CD-415E-BB93-F52C5945CB1A}"));
        assertThat(observation.getSetName(), is("triple lumen cath L Subclavian"));
        assertThat(observation.getSetStart(), is(new PointInTime(2013, 2, 14, 14, 27)));
        assertThat(observation.getSetType(), is("IV"));
        assertThat(observation.getStatusCode(), is("urn:va:observation-status:complete"));
        assertThat(observation.getStatusName(), is("complete"));
        assertThat(observation.getTypeCode(), is("urn:va:clioterminology:{E038D201-2840-B759-4D91-44A093768F8B}"));
        assertThat(observation.getTypeName(), is("CENTRAL LINE TYPE"));
    }

    public static InputStream getObservationResourceAsStream() {
        return ObservationImporterTest.class.getResourceAsStream("observation.json");
    }

    public static InputStream getObservationWithQualifiersResourceAsStream() {
        return ObservationImporterTest.class.getResourceAsStream("observation2.json");
    }

    public static InputStream getObservationInSetResourceAsStream() {
        return ObservationImporterTest.class.getResourceAsStream("observation3.json");
    }
}
