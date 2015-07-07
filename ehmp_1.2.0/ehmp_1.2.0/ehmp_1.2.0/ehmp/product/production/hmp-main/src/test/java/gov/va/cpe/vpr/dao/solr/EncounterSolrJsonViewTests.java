package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.EncounterImporterTest;
import org.apache.solr.common.SolrInputDocument;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class EncounterSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Encounter e = POMUtils.newInstance(Encounter.class, EncounterImporterTest.getVisitResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(e);

        assertThat((String) solrDoc.getFieldValue("domain"), is("encounter"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(e.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(e.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(e.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("encounter_type"), is(e.getTypeDisplayName()));
        assertThat((String) solrDoc.getFieldValue("patient_class"), is(e.getPatientClassName()));
        assertThat((String) solrDoc.getFieldValue("encounter_category"), is(e.getCategoryName()));
        assertThat((String) solrDoc.getFieldValue("discharge_disposition"), is(e.getDispositionName()));
        assertThat((String) solrDoc.getFieldValue("referrer_name"), is(e.getReferrerName()));
        assertThat((String) solrDoc.getFieldValue("visit_date_time"), is(e.getDateTime().toString()));
        assertThat((String) solrDoc.getFieldValue("primary_provider_name"), is(e.getPrimaryProvider().getProviderName()));

        // exclusions
        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "type_code");
        assertExcluded(solrDoc, "type_name");
        assertExcluded(solrDoc, "type_display_name");
        assertExcluded(solrDoc, "category_code");
        assertExcluded(solrDoc, "category_name");
        assertExcluded(solrDoc, "patient_class_code");
        assertExcluded(solrDoc, "patient_class_name");
        assertExcluded(solrDoc, "primary_provider");
        assertExcluded(solrDoc, "referrer_code");
        assertExcluded(solrDoc, "duration");
        assertExcluded(solrDoc, "specialty");
        assertExcluded(solrDoc, "reason_code");
        assertExcluded(solrDoc, "providers");
        assertExcluded(solrDoc, "parent");
        assertExcluded(solrDoc, "stay");
    }
}
