package gov.va.cpe.vpr.queryeng;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

public class TableTests {
	
	Table q;
	HashMap<String, Object> row1;
	HashMap<String, Object> row2;
	HashMap<String, Object> row3;
	
	@Before
    public void setUp() throws Exception {
    	q = new Table("id");
    	row1 = new HashMap<String, Object>();
    	row1.put("id", "foo");
    	row1.put("a", 1);
    	row1.put("b", 2);
    	row1.put("c", 3);

    	row2 = new HashMap<String, Object>();
    	row2.put("id", "bar");
    	row2.put("a", 4);
    	row2.put("b", 5);
    	row2.put("c", 6);
    	
    	row3 = new HashMap<String, Object>();
    	row3.put("id", "baz");
    	row3.put("a", 7);
    	row3.put("b", 8);
    	row3.put("c", 9);
	}
	
	@Test
	public void testConstructor() {
		// constructor should create an empty table, with 1 column
		q = new Table("xyz");
		assertEquals("xyz", q.getPK());
		assertEquals(0, q.size());
		assertEquals(1, q.getFields().size());
		assertTrue(q.getFields().contains("xyz"));
	}
	
	@Test
	public void testSetCell() {
		// set cell should create a new row automatically if it doesn't exist
		assertNull(q.getRow("xxx"));
		q.appendVal("xxx", "z", 99);
		assertNotNull(q.getRow("xxx"));
		
		// should also update the indexes
		assertTrue(q.getFields().contains("z"));
		assertTrue(q.getFieldValues("z").contains(99));
	}	
	
	@Test
	public void testGetCells() {
		q.add(row1);
		q.add(row2);
		q.add(row3);
		
		// get cells by key and column
		assertEquals(1, q.getCell("foo", "a"));
		assertEquals(5, q.getCell("bar", "b"));
		assertEquals(9, q.getCell("baz", "c"));
		
		// get cells by index
		assertEquals(1, q.getCellIdx(0, "a"));
		assertEquals(5, q.getCellIdx(1, "b"));
		assertEquals(9, q.getCellIdx(2, "c"));
		
		// test null values (bounds checking)
		assertNull(q.getCell("foo", "z"));
		assertNull(q.getCell("bla", "a"));
		assertNull(q.getCellIdx(-1, "a"));
		assertNull(q.getCellIdx(1, "z"));
		assertNull(q.getCellIdx(10000, "a"));
	}
	
	@Test
	public void testGetValues() {
		q.add(row1);
		q.add(row2);
		q.add(row3);
		
		// pk values should be all the unique PKs
		assertEquals(3, q.getPKValues().size());
		assertTrue(q.getPKValues().contains("foo"));
		assertTrue(q.getPKValues().contains("bar"));
		assertTrue(q.getPKValues().contains("baz"));
		
		// getFieldValues is the list of all the values in a column
		assertEquals(3, q.getFieldValues("a").size());
		assertTrue(q.getFieldValues("a").contains(1));
		assertTrue(q.getFieldValues("a").contains(4));
		assertTrue(q.getFieldValues("a").contains(7));
		
		// key set is all of the unique columns
		assertEquals(4, q.getFields().size());
		assertTrue(q.getFields().contains("id"));
		assertTrue(q.getFields().contains("a"));
		assertTrue(q.getFields().contains("b"));
		assertTrue(q.getFields().contains("c"));
		
		// null/bounds checking (for fields that don't exist, return 0 size)
		assertEquals(0, q.getFieldValues("xxx").size()); 
		assertEquals(0, q.getFieldValues(null).size());
	}
	
	@Test
	public void testGetRows() {
		q.add(row1);
		q.add(row2);
		q.add(row3);
		
		// get row by idx
		assertEquals(row1, q.getRowIdx(0));
		assertEquals(row2, q.getRowIdx(1));
		assertEquals(row3, q.getRowIdx(2));
		
		// get row by PK
		assertEquals(row1, q.getRow("foo"));
		assertEquals(row2, q.getRow("bar"));
		assertEquals(row3, q.getRow("baz"));
		
		// null/bounds checking
		assertNull(q.getRowIdx(-1));
		assertNull(q.getRowIdx(100000));
		assertNull(q.getRow("zzz"));
		assertNull(q.getRow(null));
		
		// TODO: Test getRows():Collection
	}
	
	@Test
	public void testUnmodifiable() {
		q.add(row1);
		
		// getRow*() return unmodifiable maps, and are not the same as the input rows, even though they equal the same row
		assertTrue(row1 != q.getRowIdx(0));
		assertEquals(row1, q.getRowIdx(0));
		assertTrue(row1 != q.getRow("foo"));
		assertEquals(row1, q.getRow("foo"));
		
		assertTrue(row1 != q.getRows().iterator().next());
		assertEquals(row1, q.getRows().iterator().next());
		
		// direct modification should fail
		try {
			q.getRowIdx(0).put("x", 1);
			fail("Expected exeption");
		} catch (Exception ex) {
			// expected
		}
		try {
			q.getRow("foo").put("x", 1);
			fail("Expected exeption");
		} catch (Exception ex) {
			// expected
		}
		try {
			q.getRows().add(row2);
			fail("Expected exeption");
		} catch (Exception ex) {
			// expected
		}
	}
	
	@Test
	public void testClear() {
		assertTrue(q.isEmpty());
		q.add(row1);
		assertFalse(q.isEmpty());
		q.clear();
		assertTrue(q.isEmpty());
	}
	
	@Test
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void testCollection() {
		ArrayList al = new ArrayList();
		al.add(row1);

		// add 3 rows, in 3 different ways
		assertTrue(q.addAll(al));
		assertTrue(q.add(row2));
		assertTrue(q.add(row3));
		assertEquals(3, q.size());
		assertTrue(q.contains(row1));
		assertTrue(q.contains(row2));
		assertTrue(q.contains(row3));
		assertTrue(q.containsAll(al));

		// test the iterator
		Iterator<Map<String, Object>> itr = q.iterator();
		assertTrue(itr.hasNext());
		assertEquals(row1, itr.next());
		assertTrue(itr.hasNext());
		assertEquals(row2, itr.next());
		assertTrue(itr.hasNext());
		assertEquals(row3, itr.next());
		assertFalse(itr.hasNext());
		
		// test remove
		assertTrue(q.removeAll(al));
		assertEquals(2, q.size());
		assertTrue(q.remove(row2));
		assertEquals(1, q.size());
	}
	
	@Test
	public void testNaturalSortOrder() {
		// add the data to the table backwards
		q.add(row3);
		q.add(row2);
		q.add(row1);
		
		// data added to a table should be returned in the order it was added
		Iterator<Map<String, Object>> itr = q.iterator();
		assertTrue(itr.hasNext());
		assertEquals("baz", itr.next().get("id"));
		assertEquals("bar", itr.next().get("id"));
		assertEquals("foo", itr.next().get("id"));
		
		// insert a new item, it should go to the end, even if its sorted before the other keys
		q.appendVal("aid", "id", "aid");
		itr = q.iterator();
		assertEquals("baz", itr.next().get("id"));
		assertEquals("bar", itr.next().get("id"));
		assertEquals("foo", itr.next().get("id"));
		assertEquals("aid", itr.next().get("id"));
		
		// should also be the last of getPKValues()
		Iterator<String> itr2 = q.getPKValues().iterator();
		assertEquals("baz", itr2.next());
		assertEquals("bar", itr2.next());
		assertEquals("foo", itr2.next());
		assertEquals("aid", itr2.next());
	}
	
	@Test
	public void testAddRow() {
		// adding a row that does not contain the declared PK value as a key will throw an error
		try {
			q.add(new HashMap<String,Object>());
			fail("Expected Exception");
		} catch (RuntimeException ex) {
			// expected
		}
		
		// adding a row with null key will throw exception
		HashMap<String, Object> map = new HashMap<String, Object>();
		try {
			map.put("id", null);
			q.add(map);
			fail("Expected Exception");
		} catch (RuntimeException ex) {
			// expected
		}
		
		// adding a row with blank/empty key will throw exception
		try {
			map.put("id", "  ");
			q.add(map);
			fail("Expected Exception");
		} catch (RuntimeException ex) {
			// expected
		}
	}
	
	@Test
	public void testAppendRow() {
		q.add(row1);
		
		// append to an existing row
		Map<String, Object> map = Table.buildRow("x", 1, "y", 2, "z", 3);
		assertTrue(row1.equals(q.getRowIdx(0)));
		q.appendRow("foo", map);
		assertEquals(7, q.getRowIdx(0).size());
		assertFalse(row1.equals(q.getRowIdx(0)));
		assertTrue(q.getRowIdx(0).keySet().containsAll(map.keySet()));
		assertTrue(q.getRowIdx(0).values().containsAll(map.values()));
		
		// will throw exception if you try to append a different PK value than the one that already exists
		try {
			q.appendRow("foo", Table.buildRow("id", 123));
			fail("expected exception");
		} catch (Exception ex) {
			// expected
		}
	}
	
	@Test
	public void testRemoveRow() {
		q.add(row1);
		q.add(row2);
		q.add(row3);

		// add the 3 rows
		assertEquals(3, q.size());
		assertEquals(row1, q.getRowIdx(0));
		assertEquals(row2, q.getRowIdx(1));
		assertEquals(row3, q.getRowIdx(2));
		assertEquals(row1, q.getRow("foo"));
		assertEquals(row2, q.getRow("bar"));
		assertEquals(row3, q.getRow("baz"));
		
		// remove row2
		q.remove(1);
		assertEquals(2, q.size());
		assertEquals(row1, q.getRowIdx(0));
		assertEquals(row3, q.getRowIdx(1));
		assertEquals(row1, q.getRow("foo"));
		assertNull(q.getRow("bar"));
		assertEquals(row3, q.getRow("baz"));
		
		// remove row1 and 3 and it should be empty
		ArrayList<Map<String, Object>> al = new ArrayList<Map<String, Object>>();
		al.add(row1);
		al.add(row3);
		q.removeAll(al);
		assertEquals(0, q.size());
		assertTrue(q.isEmpty());
		assertNull(q.getRow("foo"));
		assertNull(q.getRow("bar"));
		assertNull(q.getRow("baz"));
	}
	
	@Test
	public void testClearRow() {
		// add a row, it should have its 4 expected fields
		q.add(row1);
		assertEquals(4, q.getRow("foo").size());
		
		// clear the row, should still be there, but with only 1 field now
		q.clearRow("foo");
		assertEquals(1, q.size());
		assertEquals(1, q.getRow("foo").size());
		assertEquals("foo", q.getRow("foo").get("id"));
		
		// same way getting by idx
		assertEquals(1, q.getRowIdx(0).size());
		assertEquals("foo", q.getRowIdx(0).get("id"));
	}
}
