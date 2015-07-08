package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.ProcedureResult;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.hmp.healthtime.PointInTime;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;
import org.hamcrest.CoreMatchers;

import java.io.InputStream;
import java.util.ArrayList;

import static gov.va.cpe.vpr.sync.vista.MockVistaDataChunks.VISTA_ID;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class SurgeryImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() {
        Procedure a = (Procedure) importer.convert(MockVistaDataChunks.createFromJson(getSurgeryResourceAsStream(), mockPatient, "surgery"));

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));
        assertThat(a.getUid(), is(equalTo(UidUtils.getSurgeryUid(VISTA_ID, "229", "10010"))));
        assertThat(a.getCategory(), is(equalTo("SR")));
        assertThat(a.getDateTime(), is(new PointInTime(2006, 12, 8, 7, 30)));

        // TODO: Find a surgery that has an encounter/visit associated with it.
        assertThat(a.getEncounterUid(), is(equalTo("")));

        assertThat(a.getFacilityName(), is(equalTo("CAMP MASTER")));
        assertThat(a.getFacilityCode(), is(equalTo("???")));
        assertThat(a.getKind(), is(equalTo("Surgery")));// Dictated by kind field calculations in Procedure.java; doesn't matter what comes in JSON.
        assertThat(a.getLocalId(), is(equalTo("10010")));
        assertThat(a.getProviders().size(), is(1));
        assertThat(a.getProviders().iterator().next().getUid(), is(equalTo(UidUtils.getUserUid(VISTA_ID, "983"))));
        ArrayList<String> ruids = new ArrayList<String>();
        ruids.add(UidUtils.getDocumentUid(VISTA_ID, "229", "3557"));
        ruids.add(UidUtils.getDocumentUid(VISTA_ID, "229", "3514"));
        ruids.add(UidUtils.getDocumentUid(VISTA_ID, "229", "3513"));
        assertThat(a.getResults().size(), is(3));
        for (ProcedureResult r : a.getResults()) {
            assertThat(ruids, hasItem(r.getUid()));
        }

        assertThat(a.getStatus(), is(equalTo("COMPLETE")));
    }

    public static InputStream getSurgeryResourceAsStream() {
        return SurgeryImporterTest.class.getResourceAsStream("surgery.json");
    }

}
