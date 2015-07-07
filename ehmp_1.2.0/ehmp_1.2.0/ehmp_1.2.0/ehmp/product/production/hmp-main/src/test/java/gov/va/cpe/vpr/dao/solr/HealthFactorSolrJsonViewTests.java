package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.HealthFactor;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.HealthFactorImporterTest;
import org.apache.solr.common.SolrInputDocument;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class HealthFactorSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        HealthFactor f = POMUtils.newInstance(HealthFactor.class, HealthFactorImporterTest.getHealthFactorResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(f);

        assertThat((String) solrDoc.getFieldValue("domain"), equalTo("factor"));
        assertThat((String) solrDoc.getFieldValue("pid"), equalTo(f.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), equalTo(f.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(f.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("encounter_name"), is(f.getEncounterName()));
        assertThat((String) solrDoc.getFieldValue("location_name"), is(f.getLocationName()));
        assertThat((String) solrDoc.getFieldValue("health_factor_name"), is(f.getName()));
        assertThat((String) solrDoc.getFieldValue("health_factor_date_time"), is(f.getEntered().toString()));
        assertThat((String) solrDoc.getFieldValue("category_name"), is(f.getCategoryName()));

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "encounter_uid");
        assertExcluded(solrDoc, "name");
        assertExcluded(solrDoc, "entered");
        assertExcluded(solrDoc, "location_uid");
        assertExcluded(solrDoc, "category_uid");
    }
}
