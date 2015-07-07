package gov.va.cpe.vpr.sync.vista.json;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VLERDocument;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;

public class VLERDocumentImporterTest extends AbstractImporterTest {
	
	
	@Test
	public void testImportVLERDocument() {
		InputStream stream = getVLERDocumentResourceAsStream();
	    VistaDataChunk chunk = MockVistaDataChunks.createFromJson(stream, mockPatient, "vlerdocument");
	    if (stream != null) {
	        try {
	            stream.close();
	        } catch (IOException e) {
	            fail("Issue closing the VLERDocumentResource");
	        }
	    }
		
		VLERDocument v = (VLERDocument) importer.convert(chunk);
		
		assertThat(v.getPid(), is(equalTo(MOCK_PID)));
		assertThat(v.getUid(), is(equalTo(UidUtils.getVLERDocumentUid(MockVistaDataChunks.VISTA_ID, "1234", "56789"))));
		assertThat(v.getLocalId(), is(equalTo("56789")));
		assertThat(v.getKind(), is(equalTo("C32 Document")));
		assertThat(v.getSummary(), is(equalTo("Continuity of Care Document")));
		
		assertThat(v.getAuthorList().get(0).getInstitution(), is(equalTo("Kaiser Permanente Southern California - RESC")));
		assertThat(v.getAuthorList().get(0).getName(), is(equalTo("7.9^Epic - Version 7.9^^^^^^^&1.2.840.114350.1.1&ISO")));
		
		assertThat(v.getCreationTime().toString(), is(equalTo("20140809101112")));
		assertThat(v.getDocumentUniqueId(), is(equalTo("e587bf82-bfae-4499-9ca8-6babf6eea630")));
		assertThat(v.getHomeCommunityId(), is(equalTo("urn:oid:1.3.6.1.4.1.26580.10")));
		assertThat(v.getMimeType(), is(equalTo("text/xml")));
		assertThat(v.getName(), is(equalTo("Continuity of Care Document")));
		assertThat(v.getRepositoryUniqueId(), is(equalTo("1.2.840.114350.1.13.122.3.7.2.688879.121218")));
		assertThat(v.getSourcePatientId(), is(equalTo("'8394^^^&1.3.6.1.4.1.26580.10.1.100&ISO'")));
		
		assertThat(v.getSections().get(0).getTemplateIds().get(0).getRoot(), is(equalTo("1100101203")));
		assertThat(v.getSections().get(0).getCode().getCode(), is(equalTo("insert code here")));
		assertThat(v.getSections().get(0).getCode().getSystem(), is(equalTo("insert system here")));
		assertThat(v.getSections().get(0).getCode().getDisplay(), is(equalTo("insert display here")));
		
		assertThat(v.getSections().get(0).getTitle(), is(equalTo("Section 00")));
		assertThat(v.getSections().get(0).getText(), is(equalTo("Lorem ipsum dolor sit amet...")));
	}

	public static InputStream getVLERDocumentResourceAsStream() {
		return VLERDocumentImporterTest.class.getResourceAsStream("vlerdocument1.json");
	}
}