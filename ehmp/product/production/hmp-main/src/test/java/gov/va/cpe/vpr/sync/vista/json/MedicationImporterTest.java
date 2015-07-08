package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class MedicationImporterTest extends AbstractImporterTest {
    @Test
    public void testActiveMed() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getActiveMedicationResourceAsStream(), mockPatient, "pharmacy");
        Medication m = (Medication) importer.convert(fragment);
        Assert.assertNotNull(m);
        assertThat(m.getPid(), is(equalTo(MOCK_PID)));
        assertThat(m.getFacilityCode(), is("500"));
        assertThat(m.getFacilityName(), is("CAMP MASTER"));
        assertEquals("TAB", m.getProductFormName());
        assertEquals(m.getUid(), UidUtils.getMedicationUid("F484", "229", "34912"));
        assertEquals("urn:vuid:4020940", m.onlyProduct().getIngredientCode());
        assertEquals("urn:sct:410942007", m.onlyProduct().getIngredientRole());
        assertEquals("ACARBOSE", m.onlyProduct().getIngredientName());
        assertEquals("ORAL HYPOGLYCEMIC AGENTS,ORAL", m.onlyProduct().getDrugClassName());
        assertEquals("urn:vadc:HS502", m.onlyProduct().getDrugClassCode());
        assertNull(m.getProductFormCode());
        assertEquals("Give: 200MG PO 3ID", m.getSig());
        assertEquals("34912", m.getOrders().get(0).getOrderUid());
        assertEquals("200 MG", m.getDoseString());
    }


    @Test
    public void testMed() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("medication1.json"), mockPatient, "pharmacy");
        Medication m = (Medication) importer.convert(fragment);
        assertThat(m.getPid(), is(equalTo(MOCK_PID)));
        assertThat(m.getFacilityCode(), is("500"));
        assertThat(m.getFacilityName(), is("CAMP MASTER"));
        assertEquals(UidUtils.getMedicationUid(MockVistaDataChunks.VISTA_ID, "229", "27844"), m.getUid());
        assertEquals("403838;O", m.getLocalId());
        assertEquals(new PointInTime(2010, 5, 28), m.getOverallStop());
        assertNull(m.getStopped());
        assertEquals("active", m.getMedStatusName());
        assertEquals(CodeConstants.SCT_MED_STATUS_ACTIVE, m.getMedStatus());
//        assertEquals(CodeConstants.SCT_MED_TYPE_PRESCRIBED, m.getMedType());
    }

    @Test
    public void testExpiredOutpatientMed() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("medicationExpiredOutpt.json"), mockPatient, "pharmacy");
        Medication m = (Medication) importer.convert(fragment);
        assertThat(m.getPid(), is(equalTo(MOCK_PID)));
        assertThat(m.getFacilityCode(), is("500D"));
        assertThat(m.getFacilityName(), is("SLC-FO HMP DEV"));
        assertEquals(UidUtils.getMedicationUid(MockVistaDataChunks.VISTA_ID, "229", "27844"), m.getUid());
        assertEquals("403838;O", m.getLocalId());
        assertEquals("urn:vuid:4023979", m.onlyProduct().getIngredientCode());
        assertEquals("urn:sct:410942007", m.onlyProduct().getIngredientRole());
        assertNull(m.getProductFormCode());
        assertEquals("urn:vadc:HS502", m.onlyProduct().getDrugClassCode());
        assertEquals(new PointInTime(2010, 2, 27), m.getOverallStart());
        assertEquals(new PointInTime(2010, 5, 28), m.getOverallStop());
//        assertNull(m.getStopped());
        assertEquals(CodeConstants.SCT_MED_STATUS_HISTORY, m.getMedStatus());
        assertEquals("historical", m.getMedStatusName());
        assertEquals(CodeConstants.SCT_MED_TYPE_PRESCRIBED, m.getMedType());
        assertEquals("METFORMIN", m.onlyProduct().getIngredientName());
        assertEquals("TAB,SA", m.getProductFormName());
        assertEquals("ORAL HYPOGLYCEMIC AGENTS,ORAL", m.onlyProduct().getDrugClassName());
        assertEquals("TAKE ONE TABLET MOUTH TWICE A DAY", m.getSig());
        assertEquals("METFORMIN TAB,SA", m.getQualifiedName());
        assertEquals("METFORMIN HCL 500MG TAB,SA (EXPIRED)\n TAKE ONE TABLET MOUTH TWICE A DAY", m.getSummary());

        MedicationDose d = m.getDosages().get(0);
        assertEquals(1, m.getDosages().size());
        assertEquals("500", d.getDose());
        assertEquals("MG", d.getUnits());
        assertEquals(0, d.getRelativeStart().intValue());
        assertEquals(129600, d.getRelativeStop().intValue());
//        assertNull(d.getStartDateString());
//        assertNull(d.getStopDateString());
//
        assertEquals(1, m.getProducts().size());
        assertEquals(1, m.getOrders().size());
        Assert.assertTrue(m.getFills().isEmpty());
        MedicationOrder o = m.getOrders().get(0);
        assertEquals("urn:va:order:F484:151:27844", o.getOrderUid());

    }

    @Test
    public void testIvParser() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getClass().getResourceAsStream("medicationIV.json"), mockPatient, "pharmacy");
        Medication m = (Medication) importer.convert(fragment);
        assertThat(m.getPid(), is(equalTo(MOCK_PID)));
        assertThat(m.getFacilityCode(), is("500D"));
        assertThat(m.getFacilityName(), is("SLC-FO HMP DEV"));
        assertEquals(UidUtils.getMedicationUid(MockVistaDataChunks.VISTA_ID, "229", "10090"), m.getUid());
        Assert.assertTrue("46V;I".equals(m.getLocalId()));
        assertNull(m.getProductFormName());
        //TODO: speak to Kevin about this the old test is FUROSEMIDE IN %5 DEXTROSE
        assertEquals("FUROSEMIDE in DEXTROSE", m.getQualifiedName());
        MedicationDose d = m.getDosages().get(0);
        assertNull(d.getDose());
        assertNull(d.getIvRate());
        assertNull(d.getRelativeStart());
        assertNull(d.getRelativeStop());
        assertEquals("IV", d.getRouteName());
        assertEquals("NOW", d.getScheduleName());
        assertEquals(2, m.getProducts().size());
        MedicationProduct p = m.getProducts().get(0);
        MedicationProduct v = m.getProducts().get(1);
        assertEquals("IV SOLUTIONS WITHOUT ELECTROLYTES", v.getDrugClassName());
        assertEquals("50 ML", v.getVolume());
        assertEquals("LOOP DIURETICS", p.getDrugClassName());
        assertEquals("20 MG", p.getStrength());
    }

    public static InputStream getActiveMedicationResourceAsStream() {
        return MedicationImporterTest.class.getResourceAsStream("medication.json");
    }
}
