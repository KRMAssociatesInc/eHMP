package gov.va.cpe.vpr.queryeng;

import java.io.Serializable;
import java.util.*;

/**
 * A table is just basically a list of maps, or a tuple store in more academic terminology.
 * This one is build to look like a traditional relational table, with rows, columns and cells.
 * 
 * Additionally, it enforces the notion of a Primary Key (PK).  A column who's value is required to exist (and be
 * unique) for each row.  Currently primary key values must be strings.
 * 
 * Rows/Cells can be retrieved either by primary key value (getRow(String)), or by row index (getRow(int)). 
 * The first row is always index 0. Data can be added row at a time (via addRow(...)) or cell by cell (via setCell(...)).
 * 
 * Unlike a traditional DB table, not all rows are required to have the same columns.  Nor is there any restriction on the
 * number of columns or inherit performance issues with having a large number of columns.
 * 
 * Table implements the collections interface, giving it all sorts of functionality like addAll(), remove(), etc.
 *  
 * TODO: Allow any type of object to be a primary key value, don't force them to be strings.
 */
public class Table extends AbstractCollection<Map<String,Object>> implements Serializable {
	private String pk;
	private Set<String> fieldidx;
	private Map<String,Map<String,Object>> pkidx;
	private List<Map<String,Object>> data;
	
	public Table(String pk) {
		this.pk = pk;
		init();
	}
	
	protected void init() {
		this.data = new ArrayList<Map<String,Object>>();
		this.pkidx = new LinkedHashMap<String,Map<String,Object>>();
		this.fieldidx = new HashSet<String>();
		
		// primary key is the first column in the index
		this.fieldidx.add(getPK());
	}
	
	public String getPK() {
		return this.pk;
	}
	
	// Add/Set data methods ---------------------------------------------------
	
	public boolean add(Map<String, Object> row) {
		if (row == null) {
			return false;
		}
		Object pkval = row.get(getPK());
		if (pkval == null ) {
			throw new RuntimeException("Missing PK value.  PK Field: " + getPK());
		} 
		String pkstr = pkval.toString().trim();
		if (pkstr.length() == 0) {
			throw new RuntimeException("Empty PK value.");
		}
		
		return appendRow(pkstr, row);
	}
	
	public boolean appendVal(String pkval, String key, Object val) {
		return appendRow(pkval, buildRow(key, val));
	}
	
	public boolean appendRow(String pkval, Map<String, Object> row) {
		return appendRow(pkval, row, -1, false);
	}
	
	/**
	 * Append the row values to an existing row, anything not specified in row is not changed, anything that is 
	 * will be overwritten.  If the row does not exist, then it will be created
	 * 
	 * This is a very high traffic method, essentially all add/append/set operations run though here.  So this is the
	 * main place where synchronization is needed
	 * 
	 * @param pkval
	 * @param row
	 * @param rowidx
	 * @return
	 */
	private boolean appendRow(String pkval, Map<String, Object> row, int rowidx, boolean replace) {
		if (pkval == null || data == null) return false;
		if (row.containsKey(getPK()) && !row.get(getPK()).equals(pkval)) {
			throw new IllegalArgumentException("row PK value and data PK value are incompatible");
		}
		
		synchronized (data) {
			// update column list
			fieldidx.addAll(row.keySet());
			if (pkidx.containsKey(pkval) && !replace) {
				// row already exists, append
				pkidx.get(pkval).putAll(row);
			} else {
				// new row, copy to fresh map in case row is immutible
				row = new HashMap<String, Object>(row);
				pkidx.put(pkval, row);
				
				// if row index exists, store the row at the specified index, otherwise append
				if (rowidx >= 0) {
					data.add(rowidx, row);
					return true;
				}
				return data.add(row);
			}
		}
		return true;
	}
	
	public boolean appendRowIdx(int rowidx, Map<String, Object> data) {
		Map<String, Object> row = getRowIdx(rowidx);
		Object pkval = (row != null) ? row.get(getPK()) : null;
		if (pkval == null) return false;
		return appendRow(pkval.toString(), data, rowidx, false);
	}
	
	public boolean replaceRow(String pkval, Map<String, Object> row) {
		return appendRow(pkval, row, -1, true);
	}
	
	/**
	 * Clears the row with the specified key, leaves the row in place in its original order,
	 * but clears all the values except for the primary key value.
	 */
	public void clearRow(String pkval) {
		if (!pkidx.containsKey(pkval)) {
			return;
		}
		
		Map<String, Object> row = pkidx.get(pkval);
		row.clear();
		row.put(getPK(), pkval);
	}
	
	/**
	 * Returns a list of all the unique fields in this table (across all rows)
	 */
	public Set<String> getFields() {
		return fieldidx;
	}
	
	/**
	 * Returns a list of all the row values for a field.
	 */
	public List<Object> getFieldValues(String field) {
		ArrayList<Object> ret = new ArrayList<Object>();
		for (String pkval : pkidx.keySet()) {
			Object val = getCell(pkval, field);
			if (val != null) {
				ret.add(val);
			}
		}
		return ret;
	}
	
	// Get/Query methods ------------------------------------------------------
	
	/**
	 * Returns the primary key values in the order they were added.  Same as getColumnValues(getPK())
	 * @return
	 */
	public Set<String> getPKValues() {
		return pkidx.keySet();
	}
	
	public Map<String, Object> getRowIdx(int idx) {
		if (idx >= data.size() || idx < 0) {
			return null;
		}
		return Collections.unmodifiableMap(data.get(idx));
	}

	/**
	 * @Deprecated Do we really need this function?
	 */
	@Deprecated
	public int indexOf(Map<String, Object> row) {
		return data.indexOf(row);
	}
	
	public Map<String, Object> getRow(String pkval) {
		Map<String, Object> ret = pkidx.get(pkval);
		if (ret != null) {
			return Collections.unmodifiableMap(ret);
		}
		return null;
	}
	
	public Collection<Map<String, Object>> getRows() {
		return Collections.unmodifiableCollection(pkidx.values());
	}

	public Object getCellIdx(int idx, String colkey) {
		Map<String, Object> ret = getRowIdx(idx);
		if (ret == null) {
			return null;
		}
		return ret.get(colkey);
	}

	public Object getCell(String pkval, String colkey) {
		Map<String,Object> row = getRow(pkval);
		if (row == null) {
			return null;
		}
		return row.get(colkey);
	}
	
	public String toString() {
		StringBuffer sb = new StringBuffer();
		int i=0;
		for (Map<String,Object> row : getRows()) {
			sb.append("\n" + ++i + "\t");
			for (String key : row.keySet()) {
				sb.append(key + ":" + row.get(key) + ", ");
			}
		}
		return sb.toString();			
	}

	// Collections interface implementation -----------------------------------
	
	@Override
	public Iterator<Map<String, Object>> iterator() {
		return pkidx.values().iterator();
	}
	
	public boolean remove(int idx) {
		return super.remove(data.remove(idx));
	}
	
	@Override
	public boolean remove(Object o) {
		data.remove(o);
		return super.remove(o);
	}
	
	@Override
	public boolean removeAll(Collection<?> c) {
		data.removeAll(c);
		return super.removeAll(c);
	}
	
	@Override
	public int size() {
		return pkidx.size();
	}
	
	@Override
	public void clear() {
		init();
	}
	
	// Static helper methods --------------------------------------------------
	
	/**
	 * Quick way to build a row (Map), must be an even number of values, (key1=val2,key2=val2,etc.)
	 */
	public static Map<String,Object> buildRow(Object... vals) {
		HashMap<String,Object> row = new HashMap<String,Object>();
		for (int i = 0; i < vals.length; i++) {
			String key = vals[i++].toString();
			Object val = (i < vals.length) ? vals[i] : null;
			row.put(key, val);
		}
		return row;
	}
}
