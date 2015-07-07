package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import org.junit.Test;

import java.io.InputStream;

import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.*;

public class InterdisciplinaryDocTests extends AbstractImporterTest {
    @Test
    public void testInterdisciplinaryParent() {
        Document a = (Document) importer.convert(MockVistaDataChunks.createFromJson(getDocumentResourceAsStream("interdisc_doc_parent.json"), mockPatient, "document"));
        assertThat(a.getInterdisciplinaryType(), is(equalTo("parent")));
        assertThat(a.getIsInterdisciplinary(), is(equalTo("true")));
    }

    @Test
    public void testInterdisciplinaryChild() {
        Document a = (Document) importer.convert(MockVistaDataChunks.createFromJson(getDocumentResourceAsStream("interdisc_doc_child.json"), mockPatient, "document"));
        assertThat(a.getInterdisciplinaryType(), is(equalTo("child")));
        assertThat(a.getIsInterdisciplinary(), is(equalTo("true")));
    }

    @Test
    public void testNonInterdisciplinary() {
        Document a = (Document) importer.convert(MockVistaDataChunks.createFromJson(getDocumentResourceAsStream("document.json"), mockPatient, "document"));
        assertThat(a.getIsInterdisciplinary(), is(equalTo("false")));
    }

    public static InputStream getDocumentResourceAsStream(String doc) {
        return DocumentImporterTest.class.getResourceAsStream(doc);

    }
}
