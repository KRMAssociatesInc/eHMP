package gov.va.cpe.vpr.dao.solr;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.OrderImporterTest;

import org.apache.solr.common.SolrInputDocument;

public class OrderSolrJsonViewTests extends AbstractSolrJsonViewTests {
    @Override
    public void testSolrView() throws Exception {
        Order o = POMUtils.newInstance(Order.class, OrderImporterTest.getOrderResourceAsStream());

        SolrInputDocument solrDoc = converter.convert(o);

        assertThat((String) solrDoc.getFieldValue("domain"), equalTo("order"));
        assertThat((String) solrDoc.getFieldValue("pid"), equalTo(o.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), equalTo(o.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), equalTo(o.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("order_name"), equalTo(o.getName()));
        assertThat((String) solrDoc.getFieldValue("order_start_date_time"), equalTo(o.getStart().toString()));
        assertThat((String) solrDoc.getFieldValue("order_group_va"), equalTo(o.getDisplayGroup()));
        assertThat((String) solrDoc.getFieldValue("order_status_va"), equalTo(o.getStatusName()));

        // exclusions
        assertExcluded(solrDoc,"local_id");
        assertExcluded(solrDoc,"status_code");
        assertExcluded(solrDoc,"status_vuid");
        assertExcluded(solrDoc,"location_name");
        assertExcluded(solrDoc,"location_code");
        assertExcluded(solrDoc,"entered");
        assertExcluded(solrDoc,"stop");
        assertExcluded(solrDoc,"provider_uid");
        assertExcluded(solrDoc,"provider_name");
    }
}
