package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.ResultImporterTest;
import gov.va.cpe.vpr.sync.vista.json.VitalSignImporterTest;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Assert;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class VitalSignSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        VitalSign v = POMUtils.newInstance(VitalSign.class, VitalSignImporterTest.getVitalSignResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(v);

        assertThat((String) solrDoc.getFieldValue("domain"), is("vital"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(v.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(v.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(v.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("vital_sign_type"), is(v.getTypeName()));
        assertThat((String) solrDoc.getFieldValue("interpretation"), is(v.getInterpretationName()));
        assertThat((String) solrDoc.getFieldValue("status"), is(v.getResultStatusName()));
        assertThat((String) solrDoc.getFieldValue("body"), is(v.getDocument()));

        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "type_name");
        assertExcluded(solrDoc, "interpretation_name");
        assertExcluded(solrDoc, "organizer");
        assertExcluded(solrDoc, "type_code");
        assertExcluded(solrDoc, "method");
        assertExcluded(solrDoc, "body_site");
    }
}
