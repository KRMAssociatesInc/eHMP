package gov.va.cpe.vpr.dao.solr;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.ProblemComment;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.ProblemImporterTest;

import org.apache.solr.common.SolrInputDocument;

public class ProblemSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Problem p = POMUtils.newInstance(Problem.class, ProblemImporterTest.getProblemResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(p);

        assertThat((String) solrDoc.getFieldValue("domain"), is("problem"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(p.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(p.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(p.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("problem_status"), is(p.getStatusDisplayName()));
        assertThat((String) solrDoc.getFieldValue("location_name"), is(p.getLocationName()));
        assertThat((String) solrDoc.getFieldValue("service"), is(p.getService()));
        assertThat((String) solrDoc.getFieldValue("provider_name"), is(p.getProviderName()));
        assertThat((String) solrDoc.getFieldValue("problem_text"), is(p.getProblemText()));
        assertThat((String) solrDoc.getFieldValue("icd_name"), is(p.getIcdName()));
        assertThat((String) solrDoc.getFieldValue("onset"), is(p.getOnset().toString()));
        assertThat((String) solrDoc.getFieldValue("kind"), is(p.getKind()));
        assertThat((String) solrDoc.getFieldValue("summary"), is(p.getSummary()));
        for (ProblemComment comment : p.getComments()) {
            assertThat(solrDoc.getFieldValues("comment"), hasItem(comment.getComment()));
        }

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "status_code");
        assertExcluded(solrDoc, "status_name");
        assertExcluded(solrDoc, "status_display_name");
        assertExcluded(solrDoc, "predecessor");
        assertExcluded(solrDoc, "successor");
        assertExcluded(solrDoc, "location_code");
        assertExcluded(solrDoc, "location_display_name");
        assertExcluded(solrDoc, "problem_type");
        assertExcluded(solrDoc, "provider_code");
        assertExcluded(solrDoc, "code");
        assertExcluded(solrDoc, "history");
        assertExcluded(solrDoc, "unverified");
        assertExcluded(solrDoc, "resolved");
        assertExcluded(solrDoc, "service_connected");
        assertExcluded(solrDoc, "comments");
        assertThat(solrDoc.size(), is(23)); // double-check all exclusions
    }
}
