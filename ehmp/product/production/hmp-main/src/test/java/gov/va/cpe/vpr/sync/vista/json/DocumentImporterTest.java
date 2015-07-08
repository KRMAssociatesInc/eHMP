package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentClinician;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.hmp.healthtime.PointInTime;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;

import static gov.va.cpe.vpr.sync.vista.MockVistaDataChunks.VISTA_ID;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class DocumentImporterTest extends AbstractImporterTest {
    @Test
    public void testConvert() {
        Document a = (Document) importer.convert(MockVistaDataChunks.createFromJson(getDocumentResourceAsStream(), mockPatient, "document"));

        assertThat(a.getPid(), is(equalTo(MOCK_PID)));

        assertThat(a.getUid(), is(equalTo(UidUtils.getDocumentUid(VISTA_ID, "229", "4329"))));
        assertThat(a.getLocalId(), is(equalTo("3531")));
        assertThat(a.getText(), not(nullValue()));
        assertThat(a.getText().size(), is(equalTo(1)));
        assertThat(a.getText().get(0), not(nullValue()));

        for (DocumentClinician dc : a.getClinicians()) {
            if (dc.getRole().equals(DocumentClinician.Role.AUTHOR_DICTATOR)) {
                assertThat(dc.getUid(), is(equalTo(UidUtils.getUserUid(VISTA_ID, "986"))));
            } else {
                assertThat(dc.getRole(), is(DocumentClinician.Role.SIGNER));
                assertThat(dc.getSignedDateTime(), is(new PointInTime(2006, 12, 8, 18, 27, 50)));
                assertThat(dc.getSignature(), is(equalTo("THREE PROVIDER PHYSICIAN")));
                assertThat(dc.getUid(), is(equalTo(UidUtils.getUserUid(VISTA_ID, "986"))));
            }
        }

        assertThat(a.getDocumentClass(), is(equalTo("SURGICAL REPORTS")));
        assertThat(a.getEncounterUid(), is(equalTo(UidUtils.getVisitUid(VISTA_ID, "8", "5554"))));
        assertThat(a.getEncounterName(), equalTo("OR4 Dec 08, 2006"));
        assertThat(a.getFacilityName(), is(equalTo("SLC-FO HMP DEV")));
        assertThat(a.getLocalId(), is(equalTo("3531")));
        assertThat(a.getLocalTitle(), is(equalTo("ANESTHESIA REPORT")));
        assertThat(a.getReferenceDateTime(), is(new PointInTime(2006, 12, 8, 7, 30)));
        assertThat(a.getDocumentTypeName(), is(equalTo("Surgery Report")));
        assertThat(a.getDocumentTypeCode(), is(equalTo("SR")));
   }

    public static InputStream getDocumentResourceAsStream() {
        return DocumentImporterTest.class.getResourceAsStream("document.json");
    }
}
