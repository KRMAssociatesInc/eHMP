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

public class ConsultImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() {
        Procedure a = (Procedure) importer.convert(MockVistaDataChunks.createFromJson(getConsultResourceAsStream(), mockPatient, "consult"));

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));

        assertThat(a.getUid(), is(equalTo(UidUtils.getConsultUid(MockVistaDataChunks.VISTA_ID, "229", "373"))));
        assertThat(a.getLocalId(), is(equalTo("373")));
        assertThat(a.getCategory(), is(equalTo("C")));
        assertThat(a.getResults().size(), is(1));
        assertThat(a.getResults().iterator().next().getUid(), is(equalTo(UidUtils.getDocumentUid(MockVistaDataChunks.VISTA_ID, "229", "3108"))));
        /*
         * TODO: Need a consult with an encounter on it.
         * Provider(s)
         * Modifier(s)
         * /assertThat(a.encounter.uid, is(equalTo(UidUtils.getVisitUid(MockVistaDataChunks.VISTA_ID, "229", "7297"))))
         */
        assertThat(a.getFacilityName(), is(equalTo("CAMP MASTER")));
        assertThat(a.getFacilityCode(), is(equalTo("CM")));
        assertThat(a.getTypeName(), is(equalTo("AUDIOLOGY OUTPATIENT Cons")));
        assertThat(a.getOrderUid(), is(equalTo(UidUtils.getOrderUid(MockVistaDataChunks.VISTA_ID, "229", "15471"))));
        assertThat(a.getConsultProcedure(), is(equalTo("Consult")));
        assertThat(a.getDateTime(), is(new PointInTime(2001, 1, 1, 1, 1, 1)));
        assertThat(a.getService(), is(equalTo("AUDIOLOGY OUTPATIENT")));
        assertThat(a.getStatus(), is(equalTo("COMPLETE")));
    }

    public static InputStream getConsultResourceAsStream() {
        return ConsultImporterTest.class.getResourceAsStream("consult.json");
    }
}
