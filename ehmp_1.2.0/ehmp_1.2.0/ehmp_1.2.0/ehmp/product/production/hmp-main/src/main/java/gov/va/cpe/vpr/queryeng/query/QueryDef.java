package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.vpr.queryeng.query.QueryDefFilter.QueryDefIndex;
import gov.va.cpe.vpr.queryeng.query.QueryDefOperator.QueryDefCompareOperator;

import java.util.*;


/**
 * Defines a query object (but not the implementation or execution) that can be used by various 
 * JDS-backed data sources: {@see JDSQuery}, {@see gov.va.cpe.vpr.pom.IDataStoreDAO}.  Its sort of a 
 * cross between a query/criteria/URL builder, pseudo-DSL, templating language and a filter/transfomer.
 * 
 * See the test suite for an extensive list of usage examples.
 * 
 * Defines: 
 * - fields to include/exclude and field aliases + transformations
 * - which named index to use  
 * - middle-tier and server-tier filtering criteria 
 * - row start/limit (for paging) and sorting
 * - variable substitutions including conditional filters
 * 
 * Intentions:
 * - be a URL builder for JDS data stores.  
 * - implementation agnostic (originally worked with MongoDB, but Mongo implementation is currently way behind)
 * - situations with ugly conditional-syntax URLS like this:
 * -- /vpr/1/index/med-time?range=2000..2012&filter=#{getParamStr('filter.fieldx')!=null?'eq(fieldx, #{getParamStr('filter.fieldx')}):''}
 *
 * Future work:
 * - TODO: currently intended only for single-patient-specific queries, but eventually might encompas non-patient
 * or multiple patient queries as well when its more defined as to what those might need.
 * - TODO: how to handle non-named-index queries (ie /vpr/{pid}/find/medication/....)?
 * - TODO: New middle-tier filters for terminology? (isa('urn:sct:xyz')?
 * - TODO: Complete current VPR operator set (not{...}, exists(...), etc.)
 */
public class QueryDef {
	private QueryDefIndex indexCriteria;
	
	private List<QueryDefFilter> criteria;
	private QueryFields fields = new QueryFields();
	private QuerySort sort;
	
	private int limit = 100;
	private int skip = 0;
	private String indexOp = "index";
	private boolean forPatientObject = true;
	private boolean crossPatient = false;
	
	/**
	 * TODO: Consider removing this and namedIndex*(...), thereby forcing declaration of an index
	 */
	public QueryDef() {
		clearCriteria();
	}
	
	/**
	 * Same as new QueryDef().usingIndex(index);
	 * 
	 * @param index the name of the index or collection to use.
	 */
	public QueryDef(String index) {
		this();
		usingIndex(index);
	}
	
	public QueryDef(String index, String value) {
		this();
		usingIndex(index, value);
	}
	
	public QueryDef(String index, String startRange, String endRange) {
		this();
		usingIndex(index, startRange, endRange);
	}
	
	// add/edit criteria ------------------------------------------------------
	/**
	 * Mostly helpful for unit testing....
	 */
	QueryDef clearCriteria() {
		this.criteria = new ArrayList<QueryDefFilter>();
		return this;
	}

	/**
	 * Same as where(crit);
	 */
	public QueryDef addCriteria(QueryDefFilter crit) {
		this.criteria.add(crit);
		return this;
	}
	
	public QueryDef where(QueryDefFilter... where) {
		this.criteria.addAll(Arrays.asList(where));
		return this;
	}
	
	/**
	 * Shortcut, same as addCriteria(new QueryDefCriteria(field))
	 */
	public QueryDefCriteria where(String field) {
		QueryDefCriteria ret = QueryDefCriteria.where(field);
		addCriteria(ret);
		return ret;
	}
	
	/**
	 * Shortcut, same as addCriteria(new QueryDefORCriteria(where....))
	 */
	public QueryDef whereAny(QueryDefFilter... where) {
		this.criteria.add(new QueryDefFilter.QueryDefFilterOR(Arrays.asList(where)));
		return this;
	}
	
	public QueryDef usingIndex(String indexName) {
		return usingIndex(indexName, null, null);
	}

	public QueryDef usingIndex(String indexName, String value) {
		return usingIndex(indexName, value, null);
	}
	
	public QueryDef usingIndex(String indexName, String startRange, String endRange) {
		if (indexName == null) {
			throw new IllegalArgumentException("Index name cannot be null");
		} else if (this.indexCriteria != null) {
			String msg = "You can only specify one index range/value.";
			throw new IllegalArgumentException(msg);
		}
		
		this.indexCriteria = new QueryDefIndex(indexName);
		if (startRange != null && endRange != null) {
			this.indexCriteria.between(startRange, endRange);
		} else if (startRange != null) {
			this.indexCriteria.in(startRange);
		}
		return this;
	}
	
	/**
	 * @deprecated Use usingIndex(...) instead.
	 */
	@Deprecated
	public QueryDef namedIndexRange(String indexName, String startRange, String endRange) {
		return usingIndex(indexName, startRange, endRange);
	}
	
	/**
	 * @deprecated Use usingIndex(...) instead.
	 */
	@Deprecated
	public QueryDef namedIndexValue(String indexName, String value) {
		return namedIndexRange(indexName, value, null);
	}
	
	public QueryDefFilter getIndexCriteria() {
		return indexCriteria;
	}
	
	public QueryDef skip(int n) {
		this.skip = n;
		return this;
	}
	
	public int getSkip() {
		return this.skip;
	}
	
	public int getLimit() {
		return this.limit;
	}
	
	public QueryDef limit(int n) {
		this.limit = n;
		return this;
	}

	public QueryFields fields() {
		return fields;
	}
	
	public QuerySort sort() {
		if (this.sort == null) {
			this.sort = new QuerySort();
		}
		return this.sort;
	}
	
	public QueryDef setForPatientObject(boolean forPatientObject) {
		this.forPatientObject = forPatientObject;
		return this;
	}
	
	/**
	 * defaults to 'index', other options are currently 'last', 'count', 'tally'
	 */
	public QueryDef setIndexOperation(String op) {
		this.indexOp = op;
		return this;
	}

	public boolean matches(Map<String, Object> item, Map<String, Object> params) {
		for (QueryDefFilter filter : criteria) {
			if (!filter.matches(item, params)) {
				return false;
			}
		}	
		return true;
	}
	
	public void applyFilters(List<Map<String, Object>> rows, Map<String, Object> params) {
		new DefaultQueryTransformer(this, params).transform(rows);
	}
    
    public void applySorting(List<Map<String, Object>> items, Map<String, Object> params) {
    	final Map<String, Integer> sort = sort().getSortObject();
    	Collections.sort(items, new Comparator<Map<String, Object>>() {
			@Override
			public int compare(Map<String, Object> m1, Map<String, Object> m2) {
				for (String key : sort.keySet()) {
					int asc = sort.get(key);
					assert (asc == 1 || asc == -1);
					@SuppressWarnings({ "unchecked", "rawtypes" })
					Comparable<Object> v1 = (Comparable) m1.get(key), v2 = (Comparable) m2.get(key);
					
					if (v1 == v2) {
					} else if (v1 == null) {
				        return -1 * asc;
					} else if (v2 == null) {
						return +1 * asc;
			        } else {
			        	int comp = v1.compareTo(v2) * asc;
			        	if (comp != 0) return comp;
			        }
				}
				return 0;
			}
		});
    }
    
    public String getQueryString(Map<String, Object> params, int start, int count) {
		if (params == null) params = new HashMap<String, Object>();

		QueryDefFilter indexCriteria = this.getIndexCriteria();
		if (indexCriteria == null) {
			String msg = "No index/collection specified in QueryDef";
			throw new IllegalArgumentException(msg);
		}
		
		StringBuilder ret = new StringBuilder("");
		
		if(forPatientObject) {
			if(crossPatient) {
				ret.append("/vpr/all");
			} else {

				ret.append("/vpr/");
				
				// look for pid, throw error if one cannot be located
				// TODO:Need to determine how to handle non-patient and multi-patient queries in the future.
				String pid = derivePID(params);
				if (pid == null) {
					throw new IllegalArgumentException("No PID value found in parameters/filters!");
				}
				ret.append(pid);
			}
		} else {
			ret.append("/data");
		}
		
		ret.append("/" + this.indexOp + "/" + indexCriteria.getField());
		String lnkStr = null; // Only one will be allowed.
		for(QueryDefLink lnk: links) {
			lnkStr = lnk.getQueryString(params)!=null?lnk.getQueryString(params):lnkStr;
		}
		if(lnkStr!=null) {
			ret.append("/"+lnkStr);
		}
		// get the named-index criteria and include a &range param (if any)
		ret.append(indexCriteria.getQueryString(params));
		
		// include the &filter attribute?
		String filterStr = "";
		for (QueryDefFilter filter : criteria) {
			String qs = filter.getQueryString(params);
			if (qs == null || qs.isEmpty()) continue;
			if (filterStr.length() > 0) filterStr += ",";
			filterStr += qs;
		}
		if (filterStr.length() > 0) {
			ret.append((ret.indexOf("?") > 0) ? "&filter=" : "?filter=");
			ret.append(filterStr);
		}
		
		// include &order attribute (either from the specified sort() or from a SortParam)
		Map<String, Integer> sortData = sort().getSortObject();
		if (!sortData.isEmpty()) {
			ret.append((ret.indexOf("?") > 0) ? "&order=" : "?order=");
			for (String key : sortData.keySet()) {
				ret.append(key);
				if (sortData.get(key) == -1) ret.append(" DESC");
			}
		} else if (params.containsKey("sort.ORDER_BY")) {
			ret.append((ret.indexOf("?") > 0) ? "&order=" : "?order=");
			ret.append(params.get("sort.ORDER_BY"));
		}
		
		// ensure start+limit attributes exist
		ret.append((ret.indexOf("?") > 0) ? "&" : "?");
		ret.append(String.format("start=%d", start));
		if ( count > 0 ) {
			ret.append(String.format("&limit=%d", count));
        }
		return ret.toString();
	}
    
    /**
     * Find the PID
     */
    protected String derivePID(Map<String, Object> params) {
    	// if its in the params, return it
		if (params.containsKey("pid")) {
			Object obj = params.get("pid");
			if (obj instanceof Collection) {
				// return list of PID's
				String ret = "";
				for (Object val : ((Collection) obj)) {
					if (!ret.isEmpty()) ret += ",";
					ret += val.toString();
				}
				return ret;
			}
			return obj.toString();
		}
		
		// otherwise sort through the criteria to see if it was specified as a simple value
		// TODO: This is kind of hacky
		for (QueryDefFilter filter : criteria) {
			if (filter.getField() != null && filter.getField().equalsIgnoreCase("pid")) {
				for (int i=0; i < filter.filters.size(); i++) {
					Object val = filter.filterVals.get(i);
					QueryDefOperator op = filter.filters.get(i);
					if (op == QueryDefCompareOperator.EQ && !(val instanceof EvalRef)) {
						return val.toString();
					}
					break;
				}
				break;
			}
		}
		
		// not found, return null
		return null;
    }
	
	/**
	 * Compiles the query criteria down into specific search/filter values.  Substitutes
	 * any parameter references with appropriate values from the specified parameters.
	 * 
	 * This should be thread safe.
	 * 
	 * @param params  Parameters to substitute where necessary, may be null if there are no parameters to substitute.
	 */
	/*
	public Map<String, Object> getQueryObject(Map<String, Object> params) {
		return getQueryObject(params, false);
	}
	
	public Map<String, Object> getQueryObject(Map<String, Object> params, boolean serverOnly) {
		Map<String, Object> ret = new LinkedHashMap<String,Object>();
		for (IQueryDefFilter c : criteria) {
			if (c.isServerSide() != serverOnly) {
				continue;
			}
			Map<String, Object> data = c.buildCriteriaObject(params);
			mapMerge(data, ret);
		}
		return ret;
	}
	
	private static void mapMerge(Map<String, Object> from, Map<String, Object> to) {
		if (from == null) return;
		for (String key : from.keySet()) {
			Object val = from.get(key);
			if (!to.containsKey(key)) {
				// target key does not exist, add it
				to.put(key, from.get(key));
			} else if (val instanceof Map && to.get(key) instanceof Map) {
				// key exists in source and target, merge the maps
				// TODO:Recursive merge
				mapMerge((Map) val, (Map) to.get(key));
			} else if (val instanceof Collection && to.get(key) instanceof Collection) {
				Collection c = (Collection) to.get(key);
				c.addAll((Collection) val);
			}
		}
	}
	*/
	
	public class QuerySort {
		private Map<String, Integer> fieldSpec = new LinkedHashMap<String, Integer>();

		public QuerySort asc(String key) {
			fieldSpec.put(key, 1);
			return this;
		}
		
		public QuerySort desc(String key) {
			fieldSpec.put(key, -1);
			return this;
		}
		
		public Map<String, Integer> getSortObject() {
			return fieldSpec;
		}
	}
	
	public class QueryFields {
		private Map<String, Integer> fields = new HashMap<String, Integer>();
		private Map<String, String> aliases = new HashMap<String, String>();
		private List<QueryDefTransformer> transformers = new ArrayList<QueryDefTransformer>();
		private boolean defaultInclude = true;
		
		// builder functions --------------------------------------------
		
		public QueryFields include(String... keys) {
			defaultInclude = false;
			for (String key : keys) {
				fields.put(key, 1);
			}
			return this;
		}
		
		public QueryFields exclude(String... keys) {
			defaultInclude = true;
			for (String key : keys) {
				fields.put(key, 0);
			}
			return this;
		}
		
		public QueryFields alias(String fromKey, String toKey) {
			aliases.put(fromKey, toKey);
			return this;
		}
		
		public QueryFields transform(QueryDefTransformer transformer) {
			transformers.add(transformer);
			return this;
		}
		
		// getter/business logic functions ------------------------------
		
		public boolean isIncluded(String field) {
			Integer x = fields.get(field);
			if (x == null) {
				return defaultInclude;
			}
			return (x == 1);
		}
	}
	
	public static interface EvalRef {
		public boolean filterOut(Object val);
		public Object getValue(Map<String,Object> params);
	}
	
	public static class ParamRef implements EvalRef {
		private String key;
		private boolean conditional;

		public ParamRef(String key, boolean conditional) {
			this.key = key;
			this.conditional = conditional;
		}
		
		public boolean filterOut(Object val) {
			boolean isEmpty = val == null;
			if (!isEmpty && val instanceof Collection<?>) {
				isEmpty = ((Collection<?>) val).isEmpty();
			}
			
			return (isEmpty && isConditional());
		}
		
		public boolean isConditional() {
			return this.conditional;
		}
		
		public String getKey() {
			return key;
		}
		
		public Object getValue(Map<String,Object> params) {
			if (params != null && params.containsKey(key)) {
				return params.get(key);
			} 
			return null;
		}
		
		public static Object valueOf(Object val) {
			// replace :string and ?:string with param refs
			if (val instanceof String) {
				String valstr = val.toString();
				if (valstr.startsWith("?:")) {
					val = new ParamRef(valstr.substring(2), true);
				} else if (valstr.startsWith(":")) {
					val = new ParamRef(valstr.substring(1), false);
				}
			}

			return val;
		}
		
		public static ParamRef valueOf(String key, boolean conditional) {
			return new ParamRef(key, conditional);
		}
	}
	
	private static class DefaultQueryTransformer implements QueryDefTransformer {
		
		private Map<String, Object> params;
		private QueryFields fields;
		private QueryDef def;

		public DefaultQueryTransformer(QueryDef def, Map<String, Object> params) {
			this.def = def;
			this.fields = def.fields();
			this.params = params;
		}

		@Override
		public void transform(List<Map<String, Object>> rows) {
	        // loop through each row, apply field filters and aliases
	    	Iterator<Map<String,Object>> rowItr = rows.iterator();
	    	while (rowItr.hasNext()) {
	    		Map<String, Object> row = rowItr.next();
	        	Map<String, Object> append = new HashMap<String, Object>();
	        	
	        	// loop through each field
				Iterator<String> fieldItr = row.keySet().iterator();
				while (fieldItr.hasNext()) {
					String key = fieldItr.next();
					
					// remove filtered-out fields
					if (!fields.isIncluded(key)) {
						fieldItr.remove();
					}
					
					// if alias was defined for this field, remove and replace
					if (fields.aliases.containsKey(key)) {
						String newfield = fields.aliases.get(key);
						Object val = row.get(key);
						append.put(newfield, val);
						
						// remove the old field (unless it was already removed)
						if (fields.isIncluded(key)) fieldItr.remove();  
					}
				}
				row.putAll(append);
	        }
	    	
			// apply transformations
			for (QueryDefTransformer xform : fields.transformers) {
				xform.transform(rows);
			}
			
    		// apply middle tier filter logic/criteria
			rowItr = rows.iterator();
			while (rowItr.hasNext()) {
	    		Map<String, Object> row = rowItr.next();
				if (!def.matches(row, params)) rowItr.remove();
			}
		}
	}
	
	List<QueryDefLink> links = new ArrayList<QueryDefLink>();


	/**
	 * If multiple links are specified, the last one wins. 
	 * (When multiple links, each one should have a boolean viewparam, and only one is allowed to be set to true at runtime)
	 * @param linkName - name of JDS link to append to the query
	 * @param onParam - Optional boolean param to check @ runtime; indicates whether or not to do linking. Pass 'null' to always include link data.
	 * @param summary - Optional specification for summary; 'True' to include summary only, 'False' to include full object.
	 * @param  
	 */
	public void linkIf(String linkName, String onParam, Boolean summary, Boolean reverse) {
		QueryDefLink lnk = new QueryDefLink(linkName);
		lnk.setOnParam(onParam);
		lnk.setSummary(summary);
		lnk.setReverse(reverse);
		links.add(lnk);
	}
	public void linkIf(String linkName, String onParam, Boolean summary) {
		linkIf(linkName, onParam, summary, false);
	}

	public void setCrossPatient(boolean b) {
		crossPatient  = b;
	}
}
