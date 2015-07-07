package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.DocumentImporterTest;
import org.apache.solr.common.SolrInputDocument;

import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class DocumentSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Document d = POMUtils.newInstance(Document.class, DocumentImporterTest.getDocumentResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(d);

        // values
        assertThat((String) solrDoc.getFieldValue("domain"), is("document"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(d.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(d.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(d.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("document_type"), is(d.getDocumentTypeName()));
        assertThat((String) solrDoc.getFieldValue("local_title"), is(d.getLocalTitle()));
        assertThat((String) solrDoc.getFieldValue("document_entered"), is(d.getEntered().toString()));
        assertThat((String) solrDoc.getFieldValue(Document.SOLR_DOCUMENT_STATUS_FIELD), is("completed"));
        assertThat((String) solrDoc.getFieldValue(Document.SOLR_DOC_DEF_UID_FIELD), is("urn:va:doc-def:F484:1281"));
        assertThat((String) solrDoc.getFieldValue(Document.SOLR_AUTHOR_UID_FIELD), is("urn:va:user:F484:986"));
        assertThat((String) solrDoc.getFieldValue("author_display_name"), is("Provider,Three"));
        List<String> body = d.getBody();
        for (String text : body) {
            assertThat(solrDoc.getFieldValues("body"), hasItem(text));
        }

        // excluded by aliasing
        assertExcluded(solrDoc,"text");
        assertExcluded(solrDoc,"entered");

        // exclusions
        assertExcluded(solrDoc,"local_id");
        assertExcluded(solrDoc,"encounter_uid");
        assertExcluded(solrDoc,"encounter_name");
        assertExcluded(solrDoc,"clinicians");
        assertExcluded(solrDoc,"links");
        assertExcluded(solrDoc,"status");
        assertExcluded(solrDoc,"status_display_name");
        assertExcluded(solrDoc,"author");
        assertExcluded(solrDoc,"signer");
        assertExcluded(solrDoc,"cosigner");
        assertExcluded(solrDoc,"attending");
    }
}
