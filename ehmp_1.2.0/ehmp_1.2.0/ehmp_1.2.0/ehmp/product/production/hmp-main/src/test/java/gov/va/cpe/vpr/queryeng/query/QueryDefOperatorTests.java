package gov.va.cpe.vpr.queryeng.query;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import gov.va.cpe.vpr.queryeng.Table;

import org.junit.Before;
import org.junit.Test;

public class QueryDefOperatorTests {
	Object x = new Object(), y = new Object();
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
	
	@Test
	public void testOperatorEQ() {
		Object x = new Object(), y = new Object();
		QueryDefOperator op = QueryDefOperator.QueryDefCompareOperator.EQ;
		
		// things that should not match
		assertFalse(op.match("a", "b"));
		assertFalse(op.match(1, 2));
		assertFalse(op.match(x, y));
		assertFalse(op.match("1", 1));
		assertFalse(op.match("A", "a"));
		
		// things that should match
		assertTrue(op.match("a", "a"));
		assertTrue(op.match(1, 1));
		assertTrue(op.match(x, x));
		
		// border cases
		assertFalse(op.match(new Float(1), new Integer(1))); // ClassCastException thrown internally
		assertTrue(op.match(null, null));
		assertFalse(op.match(x, null));
		assertFalse(op.match(null, y));
		
		// test query string
		assertEquals("eq(f,1)", op.toURL("f", 1));
		assertEquals("eq(f,\"A\")", op.toURL("f", "A"));
	}
	
	@Test
	public void testOperatorNEQ() {
		Object x = new Object(), y = new Object();
		QueryDefOperator op = QueryDefOperator.QueryDefCompareOperator.NE;
		
		// things that should match
		assertTrue(op.match("a", "b"));
		assertTrue(op.match(1, 2));
		assertTrue(op.match("A", "a"));
		assertTrue(op.match(x, y));
		assertTrue(op.match("1", 1));
		
		// things that should not match
		assertFalse(op.match("a", "a"));
		assertFalse(op.match(1, 1));
		assertFalse(op.match(x, x));
		
		// border cases
		assertTrue(op.match(new Float(1), new Integer(1))); // ClassCastException thrown internally
		assertFalse(op.match(null, null));
		assertFalse(op.match(x, null));
		assertFalse(op.match(null, y));
		
		// test query string
		assertEquals("ne(f,1)", op.toURL("f", 1));
		assertEquals("ne(f,\"A\")", op.toURL("f", "A"));
	}
	
	@Test
	public void testOperatorGTE() {
		QueryDefOperator op = QueryDefOperator.QueryDefCompareOperator.GTE;
		
		// things that should not match
		assertFalse(op.match("a", "b"));
		assertFalse(op.match(1, 2));
		
		// things that should match
		assertTrue(op.match("b", "a"));
		assertTrue(op.match("b", "b"));
		assertTrue(op.match("b", "B"));
		assertTrue(op.match(2, 1));
		assertTrue(op.match(2, 2));
		assertTrue(op.match(new Integer(2), new Integer(0)));
		
		// border cases
		assertFalse(op.match(x, y));
		
		// test query string
		assertEquals("gte(f,1)", op.toURL("f", 1));
		assertEquals("gte(f,\"A\")", op.toURL("f", "A"));
	}
	
	@Test
	public void testOperatorLTE() {
		QueryDefOperator op = QueryDefOperator.QueryDefCompareOperator.LTE;
		
		// things that should match
		assertTrue(op.match("a", "b"));
		assertTrue(op.match("b", "b"));
		assertTrue(op.match(1, 2));
		assertTrue(op.match(2, 2));
		
		// things that should not match
		assertFalse(op.match("b", "a"));
		assertFalse(op.match("b", "B"));
		assertFalse(op.match(2, 1));
		assertFalse(op.match(new Integer(2), new Integer(0)));
		
		// border cases
		assertFalse(op.match(x, y));
		
		// test query string
		assertEquals("lte(f,1)", op.toURL("f", 1));
		assertEquals("lte(f,\"A\")", op.toURL("f", "A"));
	}
	
	@Test
	public void testOperatorLT() {
		QueryDefOperator op = QueryDefOperator.QueryDefCompareOperator.LT;
		
		// things that should match
		assertTrue(op.match("a", "b"));
		assertTrue(op.match("1", "2"));
		assertTrue(op.match(1, 2));
		
		// things that should not match
		assertFalse(op.match("b", "b"));
		assertFalse(op.match(2, 2));
		assertFalse(op.match("b", "a"));
		assertFalse(op.match("b", "B"));
		assertFalse(op.match(2, 1));
		assertFalse(op.match(new Integer(2), new Integer(0)));
		
		// border cases
		assertFalse(op.match(x, y));
		
		// test query string
		assertEquals("lt(f,1)", op.toURL("f", 1));
		assertEquals("lt(f,\"A\")", op.toURL("f", "A"));
	}
	
	@Test
	public void testOperatorGT() {
		QueryDefOperator op = QueryDefOperator.QueryDefCompareOperator.GT;
		
		// things that should not match
		assertFalse(op.match("a", "b"));
		assertFalse(op.match("1", "2"));
		assertFalse(op.match(1, 2));
		assertFalse(op.match("b", "b"));
		assertFalse(op.match(2, 2));
		
		// things that should match
		assertTrue(op.match("b", "a"));
		assertTrue(op.match("b", "B"));
		assertTrue(op.match(2, 1));
		assertTrue(op.match(new Integer(2), new Integer(0)));
		
		// border cases
		assertFalse(op.match(x, y));
		
		// test query string
		assertEquals("gt(f,1)", op.toURL("f", 1));
		assertEquals("gt(f,\"A\")", op.toURL("f", "A"));
	}

	
	@Test
	public void testOperatorIN() {
		List<String> list1 = Arrays.asList("a", "b", "c");
		List<Integer> list2 = Arrays.asList(1,2,3,null);
		String[] list3 = new String[] {"a"};
		QueryDefOperator op = QueryDefOperator.QueryDefSetOperator.IN;
		
		// things that should not match
		assertFalse(op.match("d", list1));
		
		// things that should match
		assertTrue(op.match("a", list1));
		assertTrue(op.match("b", list1));
		assertTrue(op.match("c", list1));
		assertFalse(op.match(null, list1));
		
		assertTrue(op.match(1, list2));
		assertTrue(op.match(2, list2));
		assertTrue(op.match(3, list2));
		assertTrue(op.match(null, list2));
		
		assertTrue(op.match("a", list3));
		assertFalse(op.match("b", list3));
		assertFalse(op.match("c", list3));
		
		// border cases
		assertTrue(op.match(null, null));
		assertFalse(op.match(list1, list1));
		assertFalse(op.match("a", null));
		assertTrue(op.match("a", "a"));
		assertTrue(op.match(1, 1));
		assertFalse(op.match("a", "b"));
		
		// test query string
		assertEquals("eq(f,\"\")", op.toURL("f", null));
		assertEquals("in(\"null\",[1,2,3,\"\"])", op.toURL(null, list2));
		assertEquals("eq(f,1)", op.toURL("f", 1));
		assertEquals("eq(f,\"A\")", op.toURL("f", "A"));
		assertEquals("in(\"f\",[\"a\"])", op.toURL("f", list3));
		assertEquals("in(\"f\",[\"a\",\"b\",\"c\"])", op.toURL("f", list1));
		assertEquals("in(\"f\",[1,2,3,\"\"])", op.toURL("f", list2));
	}
	@Test
	public void testOperatorNIN() {
		List<String> list1 = Arrays.asList("a", "b", "c");
		List<Integer> list2 = Arrays.asList(1,2,3,null);
		String[] list3 = new String[] {"a"};
		QueryDefOperator op = QueryDefOperator.QueryDefSetOperator.NIN;
		
		// things that should not match
		assertTrue(op.match("d", list1));
		
		// things that should match
		assertFalse(op.match("a", list1));
		assertFalse(op.match("b", list1));
		assertFalse(op.match("c", list1));
		assertTrue(op.match(null, list1));
		
		assertFalse(op.match(1, list2));
		assertFalse(op.match(2, list2));
		assertFalse(op.match(3, list2));
		assertFalse(op.match(null, list2));
		
		// border cases
		assertFalse(op.match(null, null));
		assertTrue(op.match(list1, list1));
		assertTrue(op.match("a", null));
		assertFalse(op.match("a", "a"));
		assertFalse(op.match(1, 1));
		assertTrue(op.match("a", "b"));
		assertFalse(op.match("a", new String[] {"a"}));
		
		// test query string
		assertEquals("ne(f,\"\")", op.toURL("f", null));
		assertEquals("nin(\"null\",[1,2,3,\"\"])", op.toURL(null, list2));
		assertEquals("ne(f,1)", op.toURL("f", 1));
		assertEquals("ne(f,\"A\")", op.toURL("f", "A"));
		assertEquals("nin(\"f\",[\"a\"])", op.toURL("f", list3));
		assertEquals("nin(\"f\",[\"a\",\"b\",\"c\"])", op.toURL("f", list1));
		assertEquals("nin(\"f\",[1,2,3,\"\"])", op.toURL("f", list2));
	}
}