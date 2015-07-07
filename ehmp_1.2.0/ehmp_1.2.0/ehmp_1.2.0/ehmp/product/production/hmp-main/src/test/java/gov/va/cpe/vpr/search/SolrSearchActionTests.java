package gov.va.cpe.vpr.search;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;

import java.net.URISyntaxException;
import java.util.List;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.Group;
import org.apache.solr.client.solrj.response.GroupCommand;
import org.apache.solr.client.solrj.response.GroupResponse;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.velocity.Template;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Mockito;

public class SolrSearchActionTests {
	
	private static QueryResponse r;
	private static QueryResponse rGroup;
	private static SolrQuery q;
	private static VelocityEngine ve;

	@BeforeClass
	public static void beforeClass() {
		
		// setup a doc list with 2 documents
		SolrDocumentList docs = new SolrDocumentList();
		SolrDocument doc1 = new SolrDocument();
		doc1.setField("uid", "urn:a:b:c");
		doc1.setField("domain", "test");
		doc1.setField("kind", "unit test case");
		doc1.setField("facility_name", "facility x");
		doc1.setField("summary", "foo bar baz");
		doc1.setField("foo", "bar");
		docs.add(doc1);
		
		SolrDocument doc2 = new SolrDocument();
		doc2.setField("uid", "urn:1:2:3");
		doc2.setField("domain", "test");
		doc2.setField("kind", "unit test case");
		doc2.setField("facility_name", "facility x");
		doc2.setField("summary", "foo bar baz");
		doc2.setField("datetime", "20140101");
		docs.add(doc2);
		
		// setup a group response where the 2 documents are grouped
		GroupResponse gresp = new GroupResponse();
		GroupCommand gcmd = new GroupCommand("kind", 2);
		gcmd.add(new Group("unit test case", docs));
		gresp.add(gcmd);
		
		// setup mock objects
		q = new SolrQuery();
		r = Mockito.mock(QueryResponse.class);
		rGroup = Mockito.mock(QueryResponse.class);
		Mockito.when(r.getResults()).thenReturn(docs);
		Mockito.when(r.getGroupResponse()).thenReturn(null);
		Mockito.when(rGroup.getResults()).thenReturn(docs);
		Mockito.when(rGroup.getGroupResponse()).thenReturn(gresp);
		
		// setup velocity engine
		ve = new VelocityEngine();
		ve.setProperty(VelocityEngine.RESOURCE_LOADER, "class");
		ve.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
		ve.init();
	}
	
	@Test
	public void testNonGroupedResponse() {
		SolrSearchAction act = new SolrSearchAction(q, r);
		assertSame(act.getQuery(), q);
		assertSame(act.getResponse(), r);
		
		// verify summary items created
		List<SummaryItem> ret = act.createSummaryItems(r);
		assertNotNull(ret);
		assertEquals(2, ret.size());
		
		// verify solr document to summary item field mappings
		SummaryItem item = ret.get(0);
		assertEquals(item.uid, "urn:a:b:c");
		assertEquals(item.type, "test");
		assertEquals(item.kind, "unit test case");
		assertEquals(item.where, "facility x");
		assertEquals(item.summary, "foo bar baz");
		assertEquals("Unknown Time", item.datetime);
		assertEquals(1, item.count);
		
		// if set, datetime should be passed through
		SummaryItem item2 = ret.get(1);
		assertEquals("20140101", item2.datetime);
		// TODO: how to test setSummaryItemHighlight()?
	}
	
	@Test
	public void testGroupedResponse() {
		SolrSearchAction act = new SolrSearchAction(q, rGroup);
		assertSame(act.getQuery(), q);
		assertSame(act.getResponse(), rGroup);
		
		// verify summary items created
		List<SummaryItem> ret = act.createSummaryItems(rGroup);
		assertNotNull(ret);
		assertEquals(1, ret.size());
		SummaryItem item = ret.get(0);
		
		// verify solr fields for grouped item
		assertEquals(item.uid, "urn:a:b:c");
		assertEquals(2, item.count);
	}
	
	@Test
	public void testVM() throws URISyntaxException {
		Template tpl = ve.getTemplate("gov/va/cpe/vpr/search/test_search_tpl.vm");
		SolrSearchAction act = new SolrSearchAction(q, rGroup, tpl);
		assertSame(act.getQuery(), q);
		
		// test that the velocity macro generated a custom summary
		List<SummaryItem> ret = act.createSummaryItems(rGroup);
		SummaryItem item = ret.get(0);
		assertEquals("urn:a:b:c|facility x|bar", item.summary);
	}

}
