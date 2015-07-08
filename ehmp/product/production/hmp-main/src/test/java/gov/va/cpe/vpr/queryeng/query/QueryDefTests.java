package gov.va.cpe.vpr.queryeng.query;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.queryeng.query.QueryDefFilter.QueryDefIndex;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.ExtractFieldTransformer;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

/**
 * TODO: Test conditional parameters
 * @author brian
 */
public class QueryDefTests {
	
	List<Map<String,Object>> data;
	Map<String, Object> params = new HashMap<String, Object>();
	
	@Before
	public void setup() {
		// create a data structure with 3 rows of 3 fields
		data = new ArrayList<Map<String, Object>>();
		data.add(Table.buildRow("row", 1, "field1", "r1f1", "field2", "r1f2", "field3", "r1f3"));
		data.add(Table.buildRow("row", 2, "field1", "r2f1", "field2", "r2f2", "field3", "r2f3"));
		data.add(Table.buildRow("row", 3, "field1", "r3f1", "field2", "r3f2", "field3", "r3f3"));
	}
	
	// Test field() include/exclude/alias/transform  --------------------------
	
	@Test
	public void testIncludes() {
		// only include field 1,3
		QueryDef qd = new QueryDef();
		qd.fields().include("field1","field3");
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		for (Map<String, Object> row : data) {
			assertEquals(2, row.size());
			assertTrue(row.containsKey("field1"));
			assertFalse(row.containsKey("field2"));
			assertTrue(row.containsKey("field3"));
		}
	}
	
	@Test
	public void testExcludes() {
		// exclude fields 1,3
		QueryDef qd = new QueryDef();
		qd.fields().exclude("row", "field1","field3");
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		for (Map<String, Object> row : data) {
			assertEquals(1, row.size());
			assertFalse(row.containsKey("field1"));
			assertTrue(row.containsKey("field2"));
			assertFalse(row.containsKey("field3"));
		}
	}
	
	@Test
	public void testMixedIncludesExcludes() {
		// exclude fields 1,3
		QueryDef qd = new QueryDef();
		qd.fields().exclude("field1","field3").include("field2");
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		for (Map<String, Object> row : data) {
			assertEquals(1, row.size());
			assertFalse(row.containsKey("field1"));
			assertTrue(row.containsKey("field2"));
			assertFalse(row.containsKey("field3"));
		}
	}
	
	@Test
	public void testQueryDefAlias() {
		// alias field1-3 as fielda-c and apply the query filters
		QueryDef qd = new QueryDef();
		qd.fields().alias("field1", "fielda").alias("field2", "fieldb").alias("field3", "fieldc");
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		for (Map<String, Object> row : data) {
			assertEquals(4, row.size());
			assertTrue(row.containsKey("fielda"));
			assertTrue(row.containsKey("fieldb"));
			assertTrue(row.containsKey("fieldc"));
			assertFalse(row.containsKey("field1"));
			assertFalse(row.containsKey("field2"));
			assertFalse(row.containsKey("field3"));
		}
	}
	
	@Test
	public void testAliasIncludes() {
		// aliases should work even if you dont explicitly include the field
		QueryDef qd = new QueryDef();
		qd.fields().include("field1").alias("field2", "fieldb");
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		for (Map<String, Object> row : data) {
			assertEquals(2, row.size());
			assertTrue(row.containsKey("field1"));
			assertTrue(row.containsKey("fieldb"));
			assertFalse(row.containsKey("field2"));
			assertFalse(row.containsKey("field3"));
		}
	}
	
	@Test
	public void testReplaceFieldTransformer() {
		// define a couple field transformers
		QueryDef qd = new QueryDef();
		qd.fields().exclude("row");
		qd.fields().transform(new QueryFieldTransformer("field1") {
			@Override
			public Object transform(Object value) {
				return "prefix:" + value;
			}
		});
		qd.fields().transform(new QueryFieldTransformer.ReplaceTransformer("field2", "f2","foo"));
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		Map<String, Object> row1 = data.get(0);
		Map<String, Object> row2 = data.get(1);
		Map<String, Object> row3 = data.get(2);
		assertEquals(3, row1.size());
		assertEquals(3, row2.size());
		assertEquals(3, row3.size());
		
		assertEquals("prefix:r1f1", row1.get("field1"));
		assertEquals("r1foo", row1.get("field2"));
		assertEquals("r1f3", row1.get("field3"));
		
		assertEquals("prefix:r2f1", row2.get("field1"));
		assertEquals("r2foo", row2.get("field2"));
		assertEquals("r2f3", row2.get("field3"));
		
		assertEquals("prefix:r3f1", row3.get("field1"));
		assertEquals("r3foo", row3.get("field2"));
		assertEquals("r3f3", row3.get("field3"));
	}
	
	@Test
	public void testExtractFieldTransformer() {
		
		// add some nested data lists and maps
		for (Map<String, Object> row : data) {
			int rowidx = (Integer) row.get("row");
			Map<String, Object> xyz = new HashMap<String, Object>();
			List<Object> yz = new ArrayList<Object>();
			yz.add(Table.buildRow("val", rowidx));
			xyz.put("y", rowidx);
			xyz.put("z", yz);
			row.put("x", xyz);
		}
		
		QueryDef qd = new QueryDef();
		
		// both should be the same as rowidx
		qd.fields().transform(new ExtractFieldTransformer("x.y", "extract1", null));
		qd.fields().transform(new ExtractFieldTransformer("x.z[0].val", "extract2", null));
		
		// border cases that should return default values
		qd.fields().transform(new ExtractFieldTransformer("a.b.c", "extract3", "noabc"));
		qd.fields().transform(new ExtractFieldTransformer("a.b.c.d", "extract4", null)); // null means extract4 should not be in the results
		qd.fields().transform(new ExtractFieldTransformer("x.z[10]", "extract5", "noabc10")); // no outofbounds errors
		
		// run the filters/transformers
		qd.applyFilters(data, null);
		
		// check results
		assertEquals(3, data.size());
		for (Map<String, Object> row : data) {
			int rowidx = (Integer) row.get("row");
			
			// validate the data was setup correctly
			assertTrue(row.containsKey("x"));
			assertTrue(row.get("x") instanceof Map);
			Map<?,?> x = (Map<?, ?>) row.get("x");
			Object x1 = x.get("y");
			assertEquals(2, x.size());
			assertEquals(rowidx, x1);
			assertTrue(x.get("z") instanceof List);
			assertEquals(1, ((List) x.get("z")).size());
			Map<?, ?> z = (Map<?, ?>) ((List) x.get("z")).get(0);
			Object x2 = z.get("val");
			assertEquals(1, z.size());
			assertEquals(rowidx, x2);
			
			// check the extract vals
			assertEquals(x1, row.get("extract1"));
			assertEquals(x2, row.get("extract2"));
			assertEquals("noabc", row.get("extract3"));
			assertFalse(row.containsKey("extract4"));
			assertEquals("noabc10", row.get("extract5"));
		}
		
		
	}
	
	@Test
	public void testQueryDefTransformer() {
		QueryDef qd = new QueryDef();
		
		// define custom transformer to only include even row #'s
		qd.fields().transform(new QueryDefTransformer() {
			@Override
			public void transform(List<Map<String, Object>> rows) {
				Iterator<Map<String,Object>> rowItr = rows.iterator();
				while (rowItr.hasNext()) {
					Map<String, Object> row = rowItr.next();
					int rownum = (Integer) row.get("row");
					if (rownum % 2 != 0) {
						rowItr.remove();
					}
				}
			}
		});
		
		// expect row2 to be returned
		qd.applyFilters(data, null);
		
		assertEquals(1, data.size());
		assertEquals(2, data.get(0).get("row"));
	}
	
	// test sorting/skip/limit ------------------------------------------------
	
	@Test
	public void testSorting() {
		QueryDef qd = new QueryDef();
		assertTrue(qd.sort().getSortObject().isEmpty());
		qd.sort().desc("field1").asc("row");
		assertFalse(qd.sort().getSortObject().isEmpty());
		
		// add an extra row with same values to test multi-value sorting...
		data.add(Table.buildRow("row", 4, "field1", "r3f1", "field2", "r3f2", "field3", "r3f3"));
		
		// get row refs before sorting...
		Map<String, Object> row1 = data.get(0), row2 = data.get(1), row3 = data.get(2), row4 = data.get(3);
		qd.applySorting(data, null);
		
		// check results
		assertEquals(4, data.size());
		assertSame(row3, data.get(0));
		assertSame(row4, data.get(1));
		assertSame(row2, data.get(2));
		assertSame(row1, data.get(3));
	}
	
	@Test
	public void testSkipAndLimit() {
		QueryDef qd = new QueryDef();
		
		// test defaults
		assertEquals(0, qd.getSkip());
		assertEquals(100, qd.getLimit());
	
		// test changes
		qd.skip(123).limit(456);
		assertEquals(123, qd.getSkip());
		assertEquals(456, qd.getLimit());
	}
	
	// test named index -------------------------------------------------------
	@Test
	public void testUsingIndex() {
		params.put("list", Arrays.asList(1,2,3));
		
		// index criteria is a subclass of QueryDefFilter
		QueryDef qd = new QueryDef().usingIndex("foo");
		assertNotNull(qd.getIndexCriteria());
		assertEquals(qd.getIndexCriteria().getClass(), QueryDefIndex.class);
		assertEquals("", qd.getIndexCriteria().getQueryString(params));

		// check the range type with a single value
		qd = new QueryDef().usingIndex("foo", "bar");
		assertNotNull(qd.getIndexCriteria());
		assertEquals("?range=bar", qd.getIndexCriteria().getQueryString(params));
		
		// check range type between
		qd = new QueryDef().usingIndex("foo", "bar", "baz");
		assertNotNull(qd.getIndexCriteria());
		assertEquals("?range=bar..baz", qd.getIndexCriteria().getQueryString(params));
		
		// check range type in collection
		qd = new QueryDef().usingIndex("foo", ":list");
		assertNotNull(qd.getIndexCriteria());
		assertEquals("?range=1,2,3,", qd.getIndexCriteria().getQueryString(params));
	}
	
	
	@Test
	public void testUsingIndexErrorCases() {
		QueryDef qd = new QueryDef();
		assertNull(qd.getIndexCriteria());
		try {
			qd.getQueryString(params, 123, 456);
			fail("Exception expected");
		} catch (IllegalArgumentException ex) {
			// expected
		}
		
		// you cannot declare an index twice
		try {
			qd = new QueryDef("foo");
			qd.usingIndex("bar");
			fail("Exception Expected");
		} catch (IllegalArgumentException ex) {
			// expected
		}
		
		// index name cannot be null
		try {
			qd = new QueryDef().usingIndex(null);
			fail("Exception Expected");
		} catch (IllegalArgumentException ex) {
			// expected
		}
	}
	
	@Test
	public void testGetPID() {
		Map<String, Object> params = Table.buildRow("pid", "666");
		// if pid is specified in param list, thats the one to use
		QueryDef qd = new QueryDef("idx");
		String url = qd.getQueryString(params, 0, 100);
		assertTrue(url.startsWith("/vpr/666/index/idx"));
		
		// if pid is specified in critera/filter, then use that one
		qd = new QueryDef("idx2");
		qd.where("pid").is("123");
		url = qd.getQueryString(null, 0, 100);
		assertTrue(url.startsWith("/vpr/123/index/idx2"));
		
		// pid can be a collection, which will turn it into a list
		params.put("pid", Arrays.asList("1,2,3"));
		qd = new QueryDef("idx3");
		url = qd.getQueryString(params, 0, 100);
		assertTrue(url.startsWith("/vpr/1,2,3/index/idx3"));
		
		// no pid returns an error
		try {
			qd = new QueryDef("idx4");
			url = qd.getQueryString(Table.buildRow("foo", "bar"), 0, 100);
			fail("expected exception");
		} catch (Exception ex) {
			// expected
		}
		
		// unless its not a patient data query
		qd = new QueryDef("idx5").setForPatientObject(false);
		url = qd.getQueryString(null, 0, 100);
		assertTrue(url.startsWith("/data/index/idx5"));
	}
	
	@Test
	public void testIndexOp() {
		// default index operation is 'index'
		QueryDef qd = new QueryDef("idx").setForPatientObject(false);
		String url = qd.getQueryString(null, 0, 100);
		assertTrue(url.startsWith("/data/index/idx"));
		
		// last
		qd = new QueryDef("idx2").setForPatientObject(false).setIndexOperation("last");
		url = qd.getQueryString(null, 0, 100);
		assertTrue(url.startsWith("/data/last/idx2"));
	}
}
