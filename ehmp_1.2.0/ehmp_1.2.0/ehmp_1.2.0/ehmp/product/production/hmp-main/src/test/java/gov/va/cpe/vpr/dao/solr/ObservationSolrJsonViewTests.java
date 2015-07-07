package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.ObservationImporterTest;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

public class ObservationSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Observation o = POMUtils.newInstance(Observation.class, ObservationImporterTest.getObservationResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(o);

        assertObservation(solrDoc, o);
    }

    @Test
    public void testSolrViewOfObservationWithQualifiers() throws Exception {
        Observation o = POMUtils.newInstance(Observation.class, ObservationImporterTest.getObservationWithQualifiersResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(o);

        assertObservation(solrDoc, o);
    }

    @Test
    public void testSolrViewOfObservationInSet() throws Exception {
        Observation o = POMUtils.newInstance(Observation.class, ObservationImporterTest.getObservationInSetResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(o);

        assertObservation(solrDoc, o);
    }

    private void assertObservation(SolrInputDocument solrDoc, Observation o) {
        assertThat((String) solrDoc.getFieldValue("domain"), equalTo("obs"));
        assertThat((String) solrDoc.getFieldValue("pid"), equalTo(o.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), equalTo(o.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(o.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("obs_type_name"), is(o.getTypeName()));
        assertThat((String) solrDoc.getFieldValue("obs_result"), is(o.getResult()));
        assertThat((String) solrDoc.getFieldValue("obs_flag"), is(o.getInterpretationName()));
        assertThat((String) solrDoc.getFieldValue("obs_status"), is(o.getStatusName()));
        assertThat((String) solrDoc.getFieldValue("obs_comment"), is(o.getComment()));
        assertThat((String) solrDoc.getFieldValue("obs_entered"), is(o.getEntered().toString()));
//        assertThat((String) solrDoc.getFieldValue("method_name"), is(o.getMethodName()));
//        assertThat((String) solrDoc.getFieldValue("body_site_name"), is(o.getBodySiteName()));

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "type_name");
        assertExcluded(solrDoc, "entered");
        assertExcluded(solrDoc, "result");
        assertExcluded(solrDoc, "interpretation_name");
        assertExcluded(solrDoc, "status_name");
        assertExcluded(solrDoc, "comment");
        assertExcluded(solrDoc, "type_code");
        assertExcluded(solrDoc, "units");
        assertExcluded(solrDoc, "method_code");
        assertExcluded(solrDoc, "body_site_code");
        assertExcluded(solrDoc, "va_status");
        assertExcluded(solrDoc, "qualifiers");
        assertExcluded(solrDoc, "set_id");
        assertExcluded(solrDoc, "set_name");
        assertExcluded(solrDoc, "set_start");
        assertExcluded(solrDoc, "set_type");
    }
}
