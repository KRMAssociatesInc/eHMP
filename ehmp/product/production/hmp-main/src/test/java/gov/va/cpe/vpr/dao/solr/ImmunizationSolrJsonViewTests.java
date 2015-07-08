package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Immunization;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.ImmunizationImporterTest;
import org.apache.solr.common.SolrInputDocument;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class ImmunizationSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Immunization i = POMUtils.newInstance(Immunization.class, ImmunizationImporterTest.getImmunizationResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(i);

        assertThat((String) solrDoc.getFieldValue("domain"), equalTo("immunization"));
        assertThat((String) solrDoc.getFieldValue("pid"), equalTo(i.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), equalTo(i.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(i.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("immunization_name"), is(i.getName()));
        assertThat((String) solrDoc.getFieldValue("comment"), is(i.getComments()));

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "name");
        assertExcluded(solrDoc, "comments");
        assertExcluded(solrDoc, "contraindicated");
        assertExcluded(solrDoc, "series_uid");
        assertExcluded(solrDoc, "series_name");
        assertExcluded(solrDoc, "reaction_uid");
        assertExcluded(solrDoc, "reaction_name");
    }
}
