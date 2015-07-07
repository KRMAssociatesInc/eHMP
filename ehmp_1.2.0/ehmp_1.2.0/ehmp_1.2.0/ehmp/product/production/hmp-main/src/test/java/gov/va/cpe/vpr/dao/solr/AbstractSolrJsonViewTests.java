package gov.va.cpe.vpr.dao.solr;

import org.apache.solr.common.SolrInputDocument;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertThat;

public abstract class AbstractSolrJsonViewTests {

    protected DomainObjectToSolrInputDocument converter;

    @Before
    public void setUp() throws Exception {
        converter = new DomainObjectToSolrInputDocument();
    }

    @Test
    public abstract void testSolrView() throws Exception;

    public void assertExcluded(SolrInputDocument doc, String fieldName) {
        assertThat("The field '" + fieldName + "' is not excluded from Solr JSON", doc.keySet(), not(hasItem(fieldName)));
    }
}
