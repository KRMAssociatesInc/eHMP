package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.ProcedureResult;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.ConsultImporterTest;
import gov.va.cpe.vpr.sync.vista.json.RadiologyImporterTest;
import gov.va.cpe.vpr.sync.vista.json.SurgeryImporterTest;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class ProcedureSolrJsonViewTests extends AbstractSolrJsonViewTests {

    // consults
    @Override
    public void testSolrView() throws Exception {
        Procedure p = POMUtils.newInstance(Procedure.class, ConsultImporterTest.getConsultResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(p);

        assertProcedure(solrDoc, p);
    }

    @Test
    public void testRadiologySolrView() throws Exception {
        Procedure p = POMUtils.newInstance(Procedure.class, RadiologyImporterTest.getImageResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(p);

        assertProcedure(solrDoc, p);
    }

    @Test
    public void testSurgerySolrView() throws Exception {
        Procedure p = POMUtils.newInstance(Procedure.class, SurgeryImporterTest.getSurgeryResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(p);

        assertProcedure(solrDoc, p);
    }

    private void assertProcedure(SolrInputDocument solrDoc, Procedure p) {
        assertThat((String) solrDoc.getFieldValue("domain"), is("procedure"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(p.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(p.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(p.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("procedure_date_time"), is(p.getDateTime().toString()));
        assertThat((String) solrDoc.getFieldValue("procedure_type"), is(p.getTypeName()));
        for (ProcedureResult r : p.getResults()) {
           assertThat(solrDoc.getFieldValues("body"), hasItem(r.getDocument()));
        }

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "type_name");
        assertExcluded(solrDoc, "type_code");
        assertExcluded(solrDoc, "category");
        assertExcluded(solrDoc, "body_site");
        assertExcluded(solrDoc, "status");
        assertExcluded(solrDoc, "reason");
        assertExcluded(solrDoc, "encounter");
        assertExcluded(solrDoc, "providers");
        assertExcluded(solrDoc, "results");
        assertExcluded(solrDoc, "links");
        assertExcluded(solrDoc, "consult_procedure");
        assertExcluded(solrDoc, "order_uid");
        assertExcluded(solrDoc, "service");
        assertExcluded(solrDoc, "verified");
    }
}
