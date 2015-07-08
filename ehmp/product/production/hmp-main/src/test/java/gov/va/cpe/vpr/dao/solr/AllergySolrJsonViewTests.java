package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.AllergyComment;
import gov.va.cpe.vpr.AllergyProduct;
import gov.va.cpe.vpr.AllergyReaction;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.AllergyImporterTest;
import org.apache.solr.common.SolrInputDocument;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

public class AllergySolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Allergy a = POMUtils.newInstance(Allergy.class, AllergyImporterTest.getAllergyResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(a);

        assertThat((String) solrDoc.getFieldValue("domain"), is("allergy"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(a.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(a.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(a.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("allergy_severity"), is(a.getSeverityName()));
        for (AllergyProduct product : a.getProducts()) {
            assertThat(solrDoc.getFieldValues("allergy_product"), hasItem(product.getName()));
        }
        for (AllergyReaction reaction : a.getReactions()) {
            assertThat(solrDoc.getFieldValues("allergy_reaction"), hasItem(reaction.getName()));
        }
        assertThat(solrDoc.getFieldValue("comment"), nullValue());
        // TODO: should we use an allergy with comments for these unit tests?
//        for (AllergyComment comment : a.getComments()) {
//            assertThat(solrDoc.getFieldValues("comment"), hasItem(comment.getComment()));
//        }

        // exclusions
        assertExcluded(solrDoc,"local_id");
        assertExcluded(solrDoc,"adverse_event_type_code");
        assertExcluded(solrDoc,"severity_code");
        assertExcluded(solrDoc,"severity_name");
        assertExcluded(solrDoc,"reference");
        assertExcluded(solrDoc,"products");
        assertExcluded(solrDoc,"reactions");
        assertExcluded(solrDoc, "comments");
    }

}
