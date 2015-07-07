package gov.va.cpe.vpr.dao.solr;

import gov.va.cpe.vpr.sync.vista.Foo;
import org.apache.solr.common.SolrInputDocument;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class DomainObjectToSolrInputDocumentTests {
    private DomainObjectToSolrInputDocument converter;

    @Before
    public void setUp() throws Exception {
        converter = new DomainObjectToSolrInputDocument();
    }

    @Test
    public void convertNull() {
        Assert.assertThat(converter.convert(null), CoreMatchers.nullValue());
    }

    @Test
    public void convert() {
        Foo foo = new Foo();
        foo.setData("uid", "urn:va:foo:1");
        foo.setData("pid", "12345");
        foo.setData("summary", "fubar");
        foo.setData("bazSpaz", "monkeys in space");

        SolrInputDocument solrInputDocument = converter.convert(foo);

        Assert.assertThat((String) solrInputDocument.getFieldValue("uid"), CoreMatchers.is(foo.getUid()));
        Assert.assertThat((String) solrInputDocument.getFieldValue("pid"), CoreMatchers.is(foo.getPid()));
        Assert.assertThat((String) solrInputDocument.getFieldValue("domain"), CoreMatchers.is(foo.getDomain()));
        Assert.assertThat((String) solrInputDocument.getFieldValue("summary"), CoreMatchers.is("fubar"));
        Assert.assertThat((String) solrInputDocument.getFieldValue("baz_spaz"), CoreMatchers.is("monkeys in space"));
        
        if (converter.storeSMILEDocument) {
        	Assert.assertThat(solrInputDocument.getFieldValue("smile"), CoreMatchers.notNullValue());
        	Assert.assertThat((byte[]) solrInputDocument.getFieldValue("smile"), CoreMatchers.isA(byte[].class));
        }
        if (converter.storeJSONDocument) {
        	Assert.assertThat(solrInputDocument.getFieldValue("json"), CoreMatchers.notNullValue());
        	Assert.assertThat((String) solrInputDocument.getFieldValue("json"), CoreMatchers.isA(String.class));
        }
        
    }
    
    @Test
    public void convertWithSIMLE() {
    	// enable SMILE document storage and repeat
    	converter.setStoreSMILEDocument(true);
    	convert();
    }
    
    @Test
    public void convertWithJSON() {
    	// enable JSON document storage and repeat
    	converter.setStoreJSONDocument(true);
    	convert();
    }
}
