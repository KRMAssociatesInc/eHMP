package gov.va.cpe.vpr.queryeng.query;

import static gov.va.cpe.vpr.queryeng.query.QueryDefCriteria.where;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.queryeng.query.QueryDefFilter.QueryDefClientFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

public class QueryDefFilterTests {
	
	List<Map<String,Object>> data;
	Map<String, Object> params = new HashMap<String, Object>();
	
	@Before
	public void setup() {
		params.put("pid", "1");
		
		// create a data structure with 3 rows of 3 fields
		data = new ArrayList<Map<String, Object>>();
		data.add(Table.buildRow("row", 1, "field1", "r1f1", "field2", "r1f2", "field3", "r1f3"));
		data.add(Table.buildRow("row", 2, "field1", "r2f1", "field2", "r2f2", "field3", "r2f3"));
		data.add(Table.buildRow("row", 3, "field1", "r3f1", "field2", "r3f2", "field3", "r3f3"));
	}
	
	@Test
	public void testQueryString() {
		String prefix = "/vpr/666/index/foo-idx?range=bar";
		String suffix = "&start=123&limit=456";
		Map<String, Object> params = Table.buildRow("pid", "666", "foo", "bar");
		
		// with no filters defined...
		QueryDef qd = new QueryDef("foo-idx", "bar");
		String url = qd.getQueryString(params,  123,  456);
		
		// test eq
		qd.clearCriteria();
		qd.where("field").is(1);
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=eq(field,1)" + suffix, url);
		
		// test GT + LT
		qd.clearCriteria();
		qd.where("field").gt("aaa").lt("bbb");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=gt(field,\"aaa\"),lt(field,\"bbb\")" + suffix, url);
		
		// test LTE + GTE
		qd.clearCriteria();
		qd.where("field").gte("aaa").lte("bbb");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=gte(field,\"aaa\"),lte(field,\"bbb\")" + suffix, url);
		
		// test IN + NIN
		qd.clearCriteria();
		qd.where("field").in(1,2,3);
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=in(\"field\",[1,2,3])" + suffix, url);

		// test BETWEEN
		qd.clearCriteria();
		qd.where("field").between(1,10);
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=between(field,1,10)" + suffix, url);
		
		// test eq on 2+ fields
		qd.clearCriteria();
		qd.where("field1").is("aaa");
		qd.where("field2").is("bbb");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=eq(field1,\"aaa\"),eq(field2,\"bbb\")" + suffix, url);
	}
	
	// test server-side filtering ---------------------------------------------
	
	@Test
	public void testQueryStringConditionals() {
		Map<String, Object> params = Table.buildRow("pid", "666", "foo", "bar");
		String prefix = "/vpr/666/index/foo-idx?range=bar";
		String suffix = "&start=123&limit=456";
		QueryDef qd = new QueryDef();
		qd.usingIndex("foo-idx", "bar");
		
		// test conditionals
		qd.where("field").is("?:foo");
		qd.where("field2").gte("?:bar");
		qd.where("field3").gte(":baz");
		String url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=eq(field,\"bar\"),gte(field3,\"\")" + suffix, url);
	}

	@Test
	public void testQueryStringCombos() {
		
		// test multiple fields/criteria
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefCriteria.where("field1").is("r3f1"));
		qd.addCriteria(QueryDefCriteria.where("field2").is("r3f2"));
		assertTrue(qd.getQueryString(params, 123, 456).contains("filter=eq(field1,\"r3f1\"),eq(field2,\"r3f2\")"));

		// test one field/criteria with multiple items
		qd = new QueryDef("foo");
		qd.addCriteria(QueryDefCriteria.where("row").gt(1).lt(3));
		assertTrue(qd.getQueryString(params, 123, 456).contains("filter=gt(row,1),lt(row,3)"));
		
		
	}
	
	@Test
	public void testQueryStringMultiIN() {
		Map<String, Object> params = Table.buildRow("pid", "666", "list1", 1, "list2", 2, "list3", 3);
		Map<String, Object> params2 = Table.buildRow("pid", "666", 
				"list1", Arrays.asList(1, 2, 3), 
				"list2", Arrays.asList(4, 5, 6), 
				"list3", Arrays.asList(7, 8, 9));
		QueryDef qd = new QueryDef();
		qd.usingIndex("foo-idx", "bar");
		
		// specify IN's on the same field
		qd.where("field").in(1).in(2).in(3);
		String url = qd.getQueryString(params,  123,  456);
		assertTrue(url.contains("&filter=eq(field,1),eq(field,2),eq(field,3)"));

		// method 2
		qd = new QueryDef();
		qd.usingIndex("foo-idx", "bar");
		qd.where("field").in(":list1");
		qd.where("field").in(":list2");
		qd.where("field").in(":list3");
		qd.where("field").in(":list4"); // resolves to empty
		qd.where("field").in("?:list5"); // ignored since it doesn't exist
		url = qd.getQueryString(params2,  123,  456);
		assertTrue(url.contains("&filter=in(\"field\",[1,2,3]),in(\"field\",[4,5,6]),in(\"field\",[7,8,9]),eq(field,\"\")"));
		
		// method 3: doesn't work because EvalRef's are not recognized inside of collections
		qd = new QueryDef();
		qd.usingIndex("foo-idx", "bar");
		qd.where("field").in(":list1", ":list2", ":list3");
		url = qd.getQueryString(params2,  123,  456);
		assertTrue(url.contains("&filter=in(\"field\",[\":list1\",\":list2\",\":list3\"])"));
		
		// method 4: works same was as #2
		qd = new QueryDef();
		qd.usingIndex("foo-idx", "bar");
		qd.where("field").in(":list1").in(":list2").in(":list3");
		url = qd.getQueryString(params2,  123,  456);
		assertTrue(url.contains("&filter=in(\"field\",[1,2,3]),in(\"field\",[4,5,6]),in(\"field\",[7,8,9])"));
	}
	
	@Test
	public void testQueryStringV2Fixes() {
		QueryDef qd = new QueryDef("foo-idx", "bar");

		// these were broken in V1 and fixed in V2
		qd.where("field").gte("aaa");
		qd.where("field").gte("bbb");
		
		// test IN + NIN (this is broken)
		qd.clearCriteria();
		qd.where("field").in(1,2,3).nin("a","b","c");
		String url = qd.getQueryString(params,  123,  456);
		assertEquals("/vpr/1/index/foo-idx?range=bar&filter=in(\"field\",[1,2,3]),nin(\"field\",[\"a\",\"b\",\"c\"])&start=123&limit=456", url);
	}
	
	@Test
	public void testQueryString_InWithListsAndSets() {
		HashSet<Object> set = new HashSet<Object>();
		Collections.addAll(set, 1,2,3);
		Map<String, Object> params = Table.buildRow("pid", "666", "foo", "bar",
				"list1", Arrays.asList(1,2,3), // lists
				"list2", new Integer[] { new Integer(1), new Integer(2), new Integer(3) }, // non-primitive
				"list3", set, // sets/collections
				"list4", Arrays.asList(), "list5", null); // empty lists
		
		String prefix = "/vpr/666/index/foo-idx?range=bar";
		String suffix = "&start=123&limit=456";
		QueryDef qd = new QueryDef();
		qd.usingIndex("foo-idx", "bar");
		
		// test IN/NIN with different list types
		qd.clearCriteria();
		qd.where("row").in(":list1");
		String url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=in(\"row\",[1,2,3])" + suffix, url);
		
		qd.clearCriteria();
		qd.where("row").in(":list2");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=in(\"row\",[1,2,3])" + suffix, url);
		
		qd.clearCriteria();
		qd.where("row").in(":list3");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=in(\"row\",[1,2,3])" + suffix, url);
		
		qd.clearCriteria();
		qd.where("row").in(":list4");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=in(\"row\",[])" + suffix, url);

		qd.clearCriteria();
		qd.where("row").in(":list5");
		url = qd.getQueryString(params,  123,  456);
		assertEquals(prefix + "&filter=eq(row,\"\")" + suffix, url);

	}
	
	// Test client-side matching ----------------------------------------------
	
	@Test
	public void testMatchesIS() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("field1").is("r3f1"));
		qd.applyFilters(data, null);
		
		// expect only the last row to be returned
		assertEquals(1, data.size());
		assertEquals("r3f1", data.get(0).get("field1"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesVarIS() {
		Map<String, Object> params = Table.buildRow("pid", "1", "filter1", "r3f1", "filter2", "r3f2");

		QueryDef qd = new QueryDef("foo");
		// filter1 should be applied (since its non-conditional)
		// filter2 should be applied (since its conditional and specified)
		// filter3 should be ignored (since its conditional and not-specified)
		qd.addCriteria(QueryDefClientFilter.where("field1").is(":filter1"));
		qd.addCriteria(QueryDefClientFilter.where("field2").is("?:filter2"));
		qd.addCriteria(QueryDefClientFilter.where("field3").is("?:filter3"));
		qd.applyFilters(data, params);
		
		// expect only the last row to be returned
		assertEquals(1, data.size());
		assertEquals("r3f1", data.get(0).get("field1"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}

	
	@Test
	public void testMatchesNE() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("field1").ne("r3f1"));
		qd.applyFilters(data, null);
		
		// expect rows 1,2 to be returned
		assertEquals(2, data.size());
		assertEquals("r1f1", data.get(0).get("field1"));
		assertEquals("r2f1", data.get(1).get("field1"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesIN() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("field1").in("r1f1","r3f1"));
		qd.applyFilters(data, null);
		
		// expect rows 1,3 to be returned
		assertEquals(2, data.size());
		assertEquals("r1f1", data.get(0).get("field1"));
		assertEquals("r3f1", data.get(1).get("field1"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesNIN() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("field1").nin("r1f1","r3f1"));
		qd.applyFilters(data, null);
		
		// expect row 2 to be returned
		assertEquals(1, data.size());
		assertEquals("r2f1", data.get(0).get("field1"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesGTE() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("row").gte(2));
		qd.applyFilters(data, null);
		
		// expect rows 2,3 to be returned
		assertEquals(2, data.size());
		assertEquals(2, data.get(0).get("row"));
		assertEquals(3, data.get(1).get("row"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesLTE() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("row").lte(2));
		qd.applyFilters(data, null);
		
		// expect rows 1,2 to be returned
		assertEquals(2, data.size());
		assertEquals(1, data.get(0).get("row"));
		assertEquals(2, data.get(1).get("row"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesGT() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("row").gt(2));
		qd.applyFilters(data, null);
		
		// expect row 3 to be returned
		assertEquals(1, data.size());
		assertEquals(3, data.get(0).get("row"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesLT() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("row").lt(2));
		qd.applyFilters(data, null);
		
		// expect row 1 to be returned
		assertEquals(1, data.size());
		assertEquals(1, data.get(0).get("row"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	@Test
	public void testMatchesBETWEEN() {
		QueryDef qd = new QueryDef("foo");
		qd.addCriteria(QueryDefClientFilter.where("row").between(1,2));
		qd.applyFilters(data, null);
		
		// expect rows 1,2 to be returned
		assertEquals(2, data.size());
		assertEquals(1, data.get(0).get("row"));
		assertEquals(2, data.get(1).get("row"));
		
		// filter adds nothing to queryString
		assertFalse(qd.getQueryString(params, 123, 456).contains("&filter"));
	}
	
	// big goal of v2: OR! ----------------------------------------------------
	
	@Test
	public void testWhereAny() {
		QueryDef qd = new QueryDef("foo-idx", "bar");
		
		// test OR query string, should not filter any rows
		qd.whereAny(where("field").is("r1f1"), where("field2").is("r2f2"));
		String url = qd.getQueryString(params,  123,  456);
		assertTrue(url.contains("&filter=or(eq(field,\"r1f1\"),eq(field2,\"r2f2\"))"));
		qd.applyFilters(data, params);
		assertEquals(3, data.size());
		
		// test middle-tier filtering: only matches rows 1,2
		qd.clearCriteria();
		qd.whereAny(QueryDefClientFilter.where("field1").is("r1f1"),
				QueryDefClientFilter.where("field2").is("r2f2"));
		url = qd.getQueryString(params,  123,  456);
		assertEquals("/vpr/1/index/foo-idx?range=bar&start=123&limit=456", url);
		qd.applyFilters(data, params);
		assertEquals(2, data.size());
	}

}
