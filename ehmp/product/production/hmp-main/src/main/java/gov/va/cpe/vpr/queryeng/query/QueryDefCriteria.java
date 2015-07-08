package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.vpr.queryeng.query.QueryDef.EvalRef;
import gov.va.cpe.vpr.queryeng.query.QueryDef.ParamRef;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

/**
 * This class represents the set of operators that can be run on a single field
 * in the server (meaning they can be used in the &filter portion of the url)
 * 
 * This means it does NO client side filtering (matches(...) always returns true)
 * 
 * {@link QueryDefFilter}
 * 
 * If you would like to do middle-tier filtering, try {@see QueryDefClientFilter}
 */
public class QueryDefCriteria extends QueryDefFilter {

	public QueryDefCriteria(String field) {
		super(field);
	}
	
	@Override
	public boolean matches(Map<String, Object> rec, Map<String, Object> params) {
		// since this is VPRFilters, it should all be implemented in the URL and no further
		// filtering should be necessary so we can skip this.
		return true;
	}
	
	public String getQueryString(Map<String, Object> params) {
		StringBuilder sb = new StringBuilder();
		for (int i=0; i < filters.size(); i++) {
			QueryDefOperator op = filters.get(i);
			Object opval = filterVals.get(i);
			
			// interpolate/skip if needed...
			if (opval instanceof EvalRef) {
				EvalRef ref = (EvalRef) opval;
				opval = ref.getValue(params);
				if (ref.filterOut(opval)) continue;
			} else if (opval instanceof Collection) {
				Collection noval = new ArrayList();
				for(Object ov: ((Collection)opval)) {
					Object thing = ov;
					if(ov instanceof EvalRef) {
						EvalRef ref = (EvalRef) ov;
						thing = ref.getValue(params);
						if (ref.filterOut(ov)) continue;
					}
					noval.add(thing);
				}
				opval = noval;
			}
			
			String fragment = op.toURL(getField(), opval);
			if (fragment != null && fragment.length() > 0) {
				if (sb.length() > 0) sb.append(",");
				sb.append(fragment);
			}
		}
		return sb.toString();
	}

	// Standard Operators -----------------------------------------------------
	public QueryDefCriteria between(Object val1, Object val2) {
		addFilter(QueryDefOperator.QueryDefBetweenOperator.BTW, Arrays.asList(ParamRef.valueOf(val1), ParamRef.valueOf(val2)));
		return this;
	}
	
	public QueryDefCriteria is(Object val) {
		addFilter(QueryDefOperator.QueryDefCompareOperator.EQ, val);
		return this;
	}
	
	public QueryDefCriteria ne(Object val) {
		addFilter(QueryDefOperator.QueryDefCompareOperator.NE, val);
		return this;
	}
	
	public QueryDefCriteria gt(Object val) {
		addFilter(QueryDefOperator.QueryDefCompareOperator.GT, val);
		return this;
	}

	public QueryDefCriteria lt(Object val) {
		addFilter(QueryDefOperator.QueryDefCompareOperator.LT, val);
		return this;
	}

	public QueryDefCriteria gte(Object val) {
		addFilter(QueryDefOperator.QueryDefCompareOperator.GTE, val);
		return this;
	}
	
	public QueryDefCriteria lte(Object val) {
		addFilter(QueryDefOperator.QueryDefCompareOperator.LTE, val);
		return this;
	}
	
	public QueryDefCriteria exists() {
		addFilter(QueryDefOperator.QueryDefCompareOperator.EXISTS, null);
		return this;
	}

	public QueryDefCriteria in(Object val) {
		addFilter(QueryDefOperator.QueryDefSetOperator.IN, val);
		return this;
	}
	
	public QueryDefCriteria in(Object... vals) {
		addFilter(QueryDefOperator.QueryDefSetOperator.IN, Arrays.asList(vals));
		return this;
	}
	
	public QueryDefCriteria in(Collection<Object> val) {
		addFilter(QueryDefOperator.QueryDefSetOperator.IN, val);
		return this;
	}
	
	public QueryDefCriteria nin(Object val) {
		addFilter(QueryDefOperator.QueryDefSetOperator.NIN, val);
		return this;
	}
	
	public QueryDefCriteria nin(Object... vals) {
		addFilter(QueryDefOperator.QueryDefSetOperator.NIN, Arrays.asList(vals));
		return this;
	}
	
	public QueryDefCriteria nin(Collection<Object> val) {
		addFilter(QueryDefOperator.QueryDefSetOperator.NIN, val);
		return this;
	}
	
	// static helpers ---------------------------------------------------------
	
	/**
	 * Same as new QueryDefCriteria(String)
	 */
	public static QueryDefCriteria where(String field) {
		return new QueryDefCriteria(field);
	}
}
