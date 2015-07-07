package gov.va.cpe.vpr;

import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

public class DocumentTextTests {

    private DocumentText dt = new DocumentText();

    @Test
    public void testConstruct() throws Exception {
        assertThat(dt.getAuthorUid(), nullValue());
        assertThat(dt.getAuthor(), nullValue());
        assertThat(dt.getAuthorDisplayName(), nullValue());

        assertThat(dt.getSignerUid(), nullValue());
        assertThat(dt.getSigner(), nullValue());
        assertThat(dt.getSignerDisplayName(), nullValue());

        assertThat(dt.getCosignerUid(), nullValue());
        assertThat(dt.getCosigner(), nullValue());
        assertThat(dt.getCosignerDisplayName(), nullValue());

        assertThat(dt.getAttendingUid(), nullValue());
        assertThat(dt.getAttending(), nullValue());
        assertThat(dt.getAttendingDisplayName(), nullValue());
    }

    @Test
    public void testGetAuthor() throws Exception {
        dt = createDocumentTextWithClinician("foo", "FOO",  DocumentClinician.Role.AUTHOR_DICTATOR);
        assertThat(dt.getAuthor(), is("FOO"));
        assertThat(dt.getAuthorDisplayName(), is("Foo"));
    }

    @Test
    public void testGetCosigner() throws Exception {
        dt = createDocumentTextWithClinician("foo", "BAR", DocumentClinician.Role.COSIGNER);
        assertThat(dt.getCosigner(), is("BAR"));
        assertThat(dt.getCosignerDisplayName(), is("Bar"));
    }

    @Test
    public void testGetAttending() throws Exception {
        dt = createDocumentTextWithClinician("attending", "BAZ", DocumentClinician.Role.ATTENDING_PHYSICIAN);
        assertThat(dt.getAttending(), is("BAZ"));
        assertThat(dt.getAttendingDisplayName(), is("Baz"));
    }

    public static DocumentText createDocumentTextWithClinician(String docUid, String clinicianName, DocumentClinician.Role clinicianRole) {
        Map clinicianVals = new HashMap();
        clinicianVals.put("name", clinicianName);
        clinicianVals.put("role", clinicianRole.getAbbreviation());

        DocumentText dtxt = new DocumentText();
        dtxt.setData("uid", docUid);
        dtxt.setData("clinicians", Collections.singletonList(new DocumentClinician(clinicianVals)));
        return dtxt;
    }
}
