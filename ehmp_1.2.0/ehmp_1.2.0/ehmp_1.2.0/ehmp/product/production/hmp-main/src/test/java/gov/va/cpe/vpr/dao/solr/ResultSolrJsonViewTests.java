package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.ResultImporterTest;
import org.apache.solr.common.SolrInputDocument;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class ResultSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Result r = POMUtils.newInstance(Result.class, ResultImporterTest.getResultResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(r);

        assertThat((String) solrDoc.getFieldValue("domain"), is("result"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(r.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(r.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(r.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("lab_result_type"), is(r.getTypeName()));
        assertThat((String) solrDoc.getFieldValue("interpretation"), is(r.getInterpretationName()));
        assertThat((String) solrDoc.getFieldValue("status"), is(r.getResultStatusName()));

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "interpretation_name");
        assertExcluded(solrDoc, "organizers");
        assertExcluded(solrDoc, "method");
        assertExcluded(solrDoc, "body_site");
        assertExcluded(solrDoc, "accession");
    }
}
