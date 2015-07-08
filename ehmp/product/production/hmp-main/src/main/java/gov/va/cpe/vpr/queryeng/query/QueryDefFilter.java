package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.vpr.queryeng.query.QueryDef.EvalRef;
import gov.va.cpe.vpr.queryeng.query.QueryDef.ParamRef;

import java.util.*;

/**
 * version 2.0 of QueryDefCriteria
 * 
 * changes:
 * - One filter object instance generally is tied to one field and contains 1+ Operators
 * - operators should be classes instead of $in/$gte/$eq etc from version 1
 *   - get rid of server vs client flags/stuff, built into operator. 
 * - Users should be able to write QueryDefFilter extentions to do custom stuff
 * - probably trying to get rid of the criteriaChain stuff
 * - better way to implement or
 */
public abstract class QueryDefFilter {
	
	private String field;
	protected List<QueryDefOperator> filters = new ArrayList<QueryDefOperator>();
	protected List<Object> filterVals = new ArrayList<Object>();
	
	public QueryDefFilter(String field) {
		this.field = field;
	}
	
	public String getField() {
		return this.field;
	}
	
	protected QueryDefFilter addFilter(QueryDefOperator op, Object val) {
		filters.add(op);
		filterVals.add(ParamRef.valueOf(val));
		return this;
	}

	/**
	 * This method must be implemetned by sub-classes to determine if a particular record matches
	 * the filters specified.  This represents the QueryDefFilter's  client-side, midle-tier filtering capability.
	 * 
	 * Note that some sub-classes may be server side only, and may always return true.
	 */
	public abstract boolean matches(Map<String, Object> rec, Map<String, Object> params);
	
	/**
	 * This method must be implemented by sub-classes to determine what gets sent to the server
	 * to be filtered server-side vs what is filtered locally (client-side) via the {@link QueryDefFilter#matches(Map, Map)}}
	 * 
	 * <P>TODO: Maybe add a dialect parameter to this for future? thinking MONGO vs SQL etc...
	 */
	public abstract String getQueryString(Map<String, Object> params);
	
	/**
	 * Represends a set of default operators that uses middle-tier (client-side) filtering.
	 * 
	 * This means that the getQueryString() returns nothing, and all the work is done in the matches(...) method.
	 */
	public static class QueryDefClientFilter extends QueryDefFilter {

		public QueryDefClientFilter(String field) {
			super(field);
		}
		
		@Override
		public String getQueryString(Map<String, Object> params) {
			return null;
		}
		
		public boolean matches(Map<String, Object> rec, Map<String, Object> params) {
			Object fieldVal = rec.get(getField());
			for (int i=0; i < filters.size(); i++) {
				QueryDefOperator op = filters.get(i);
				Object opval = filterVals.get(i);
				
				// interpolate/skip if needed...
				if (opval instanceof EvalRef) {
					EvalRef ref = (EvalRef) opval;
					opval = ref.getValue(params);
					if (ref.filterOut(opval)) continue;
				}
				
				if (!op.match(fieldVal, opval)) {
					return false;
				}
			}
			return true;
		}
		
		// Standard Operators -----------------------------------------------------
		public QueryDefClientFilter between(Object val1, Object val2) {
			addFilter(QueryDefOperator.QueryDefBetweenOperator.BTW, Arrays.asList(val1, val2));
			return this;
		}
		
		public QueryDefClientFilter is(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.EQ, val);
			return this;
		}
		
		public QueryDefClientFilter ne(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.NE, val);
			return this;
		}
		
		public QueryDefClientFilter gt(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.GT, val);
			return this;
		}

		public QueryDefClientFilter lt(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.LT, val);
			return this;
		}

		public QueryDefClientFilter gte(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.GTE, val);
			return this;
		}
		
		public QueryDefClientFilter lte(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.LTE, val);
			return this;
		}

		public QueryDefClientFilter in(Object val) {
			addFilter(QueryDefOperator.QueryDefSetOperator.IN, val);
			return this;
		}
		
		public QueryDefClientFilter in(Object... vals) {
			addFilter(QueryDefOperator.QueryDefSetOperator.IN, Arrays.asList(vals));
			return this;
		}
		
		public QueryDefClientFilter in(Collection<Object> val) {
			addFilter(QueryDefOperator.QueryDefSetOperator.IN, val);
			return this;
		}
		
		public QueryDefClientFilter nin(Object val) {
			addFilter(QueryDefOperator.QueryDefSetOperator.NIN, val);
			return this;
		}
		
		public QueryDefClientFilter nin(Object... vals) {
			addFilter(QueryDefOperator.QueryDefSetOperator.NIN, Arrays.asList(vals));
			return this;
		}
		
		public QueryDefClientFilter nin(Collection<Object> val) {
			addFilter(QueryDefOperator.QueryDefSetOperator.NIN, val);
			return this;
		}
		
		/**
		 * Same as new QueryDefCriteria(String)
		 */
		public static QueryDefClientFilter where(String field) {
			return new QueryDefClientFilter(field);
		}
	}
	
	/**
	 * This represends the set of operators valid for use in the index &range param.
	 * 
	 * This is because not all opertors can be used against named indexes, currently only
	 * is, in, between are valid.  
	 * 
	 * Since this is all server side, the matches(...) method does nothing and the getQueryString(...)
	 * returns a slightly different format suitable for &range instead of &filter.
	 */
	public static class QueryDefIndex extends QueryDefFilter {

		public QueryDefIndex(String index) {
			super(index);
		}
		
		@Override
		public boolean matches(Map<String, Object> rec, Map<String, Object> params) {
			return true;
		}

		// operators relevant to index/collection name ------------------------
		
		public QueryDefIndex between(Object val1, Object val2) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.GTE, val1);
			addFilter(QueryDefOperator.QueryDefCompareOperator.LTE, val2);
			return this;
		}
		
		public QueryDefIndex is(Object val) {
			addFilter(QueryDefOperator.QueryDefCompareOperator.EQ, val);
			return this;
		}
		
		public QueryDefIndex in(Object val) {
			addFilter(QueryDefOperator.QueryDefSetOperator.IN, val);
			return this;
		}
		
		public QueryDefIndex in(Object... vals) {
			addFilter(QueryDefOperator.QueryDefSetOperator.IN, Arrays.asList(vals));
			return this;
		}
		
		public QueryDefIndex in(Collection<Object> val) {
			addFilter(QueryDefOperator.QueryDefSetOperator.IN, val);
			return this;
		}
		
		
		// generate the &range= query string (if any)
		@Override
		public String getQueryString(Map<String, Object> params) {
			if (filters.size() == 0) return "";
			String ret = "?range=";
			for (int i=0; i < filters.size(); i++) {
				QueryDefOperator op = filters.get(i);
				Object opval = filterVals.get(i);
				
				// interpolate/skip if needed...
				if (opval instanceof EvalRef) {
					EvalRef ref = (EvalRef) opval;
					opval = ref.getValue(params);
					if (ref.filterOut(opval)) continue;
				}
				
				if (opval instanceof Collection) {
					for (Object o : ((Collection) opval)) {
						ret += o + ",";
					}
				} else if (op == QueryDefOperator.QueryDefCompareOperator.GTE) {
					ret += opval + "..";
				} else {
					ret += opval;
				}
			}
			return ret;
		}
	}
	
	/**
	 * This filter wraps 1+ other filters with an <code>or{...}</code> and returns true if any
	 * of the criteria <code>matches(...)</code> is true.
	 *  
	 * @author brian
	 */
	public static class QueryDefFilterOR extends QueryDefFilter {
		private List<QueryDefFilter> criteriaChain;

		public QueryDefFilterOR(QueryDefFilter... filters) {
			this(Arrays.asList(filters));
		}
		
		public QueryDefFilterOR(List<QueryDefFilter> filters) {
			super(null);
			this.criteriaChain = filters;
		}
		
		@Override
		public String getQueryString(Map<String, Object> params) {
			StringBuilder sb = new StringBuilder();
			// join all the query strings togeather
			for (QueryDefFilter filter : criteriaChain) {
				String str = filter.getQueryString(params);
				if (str != null && str.length() > 0) {
					if (sb.length() > 0) sb.append(",");
					sb.append(str);
				}
			}
			// wrap with or(...) and return
			if (sb.length() > 0) {
				sb.insert(0, "or(");
				sb.append(")");
			}
			return sb.toString();
		}
		
		@Override
		public boolean matches(Map<String, Object> row, Map<String, Object> params) {
			for (QueryDefFilter filter : criteriaChain) {
				if (filter.matches(row, params)) {
					return true;
				}
			}
			return false;
		}
	}
}
