package gov.va.cpe.vpr.queryeng.query;

import gov.va.cpe.vpr.pom.POMUtils;

import java.util.*;

/**
 * TODO: this isn't very clean or understandable, but there are a ton of unit tests that ensure they work..
 * @author brian
 */
@Deprecated
public abstract class QueryDefWalker {
	protected Deque<String> evalStack;
	protected boolean halt;
	protected void walk(Object val) {
		this.evalStack = new ArrayDeque<String>();
		this.halt = false;
		walkItems(val);
	}
	
	protected void walkItems(Object val) {
		if (halt) return;
		
		if (!evalStack.isEmpty()) {
			String parentNode = evalStack.pop();
			this.halt = !visitNode(val, parentNode);
			evalStack.push(parentNode);
			if (halt) return;
		}
		
		if (val instanceof Map) {
			Map map = (Map) val;
			for (Object mapkey : map.keySet()) {
				Object mapval = map.get(mapkey);
				evalStack.push(mapkey.toString());
				walkItems(mapval);
				evalStack.pop();
			}
		} else if (val instanceof Iterable) {
			Iterator<?> itr = ((Iterable<?>) val).iterator();
			while (itr.hasNext()) {
				walkItems(itr.next());
			}
		}
	}
	
	abstract protected boolean visitNode(Object val, String parentNode);
	@Deprecated
	public static class JDSFilterBuilder2 {
		public String build(Map<String, Object> qrydata, Map<String, Object> params) {
			StringBuilder sb = new StringBuilder();
			doBuild(sb, null, qrydata, params);
			return sb.toString();
		}
			
		public void doBuild(StringBuilder sb, String field, Map<String, Object> qrydata, Map<String, Object> params) {
			// loop through each item in the querydata array
			for (String key : qrydata.keySet()) {
				Object val = qrydata.get(key);
				if (sb.length() > 0) sb.append(",");
				
				// if it starts with a $ then its a operator
				if (key.equals("$lt") || key.equals("$gt") || key.equals("$lte") || key.equals("$gte")) {
					key = key.substring(1);
					sb.append(key + "(" + field + "," + quoteValue(val) + ")");
				} else if (key.equals("$in") || key.equals("$nin")) {
					key = key.substring(1);
					if (val instanceof Collection) {
						String substr = "";
						for (Object obj : ((Collection) val)) {
							if (substr.length() > 0) substr += ",";
							substr += quoteValue(obj);
						}
						sb.append(key + "(" + field + ",[" + substr + "])");
					} else {
						sb.append("," + quoteValue(val) + ")");
					}
				} else if (key.equals("$or")) {
					sb.append("or{");
					if (val instanceof List) {
						StringBuilder sb2 = new StringBuilder();
						for (Object obj : ((List) val)) {
							if (obj instanceof Map) {
								doBuild(sb2, null, ((Map) obj), params);
							}
						}
						sb.append(sb2);
					}
					sb.append("}");
				} else if (key.startsWith("$")) {
					throw new IllegalArgumentException("Unrecognized operator: " + key);
				} else if (val instanceof Map) {
					// this indicates key is the field, val is a list of operations on that field
					doBuild(sb, key, ((Map) val), params);
				} else {
					// simple field=value operator
					sb.append("eq(" + key + "," + quoteValue(val) + ")");
				}
			}
		}
		
		private static final String quoteValue(Object val) {
			if (val == null) {
				return "\"\"";
			} else if (!(val instanceof Number)) {
				return "\"" + val.toString() + "\"";
			}
			return val.toString();
		}
		
	}
	
	public static class JDSFilterBuilder extends QueryDefWalker {
		StringBuilder sb;
		Map<String, Object> qrydata;
		
		public JDSFilterBuilder(Map<String,Object> qrydata) {
			this.qrydata = qrydata;
		}
		
		public String build(Map<String, Object> params) {
			sb = new StringBuilder();
			walk(qrydata);
			return sb.toString();
		}
		
		private static final String quoteValue(Object val) {
			if (val == null) {
				return "\"\"";
			} else if (!(val instanceof Number)) {
				return "\"" + val.toString() + "\"";
			}
			return val.toString();
		}
		
		@Override
		protected boolean visitNode(Object val, String parentNode) {
			if (parentNode.startsWith("$")) {
				String rowField = evalStack.peek();
				if (sb.length() > 0) sb.append(",");
				
				if (parentNode.equals("$lt") || parentNode.equals("$gt") ||
					parentNode.equals("$lte") || parentNode.equals("$gte")) {
					parentNode = parentNode.replace("$", "");
					sb.append(parentNode + "(" + rowField + "," + quoteValue(val) + ")");
				} else if (parentNode.equals("$in") || parentNode.equals("$nin")) {
					parentNode = parentNode.replace("$", "");
					String substr = "";
					if (val instanceof Collection) {
						for (Object obj : ((Collection) val)) {
							if (substr.length() > 0) substr += ",";
							substr += quoteValue(obj);
						}
						sb.append(parentNode + "(" + rowField + ",[" + substr + "])");
						return false;
					} else {
						sb.append("," + quoteValue(val) + ")");
					}
				} else if (parentNode.equals("$or")) {
					sb.append("or{...}");
				} else {
					throw new IllegalArgumentException("Unrecognized operator: " + parentNode);
				}
				return true;
			} else {
				// parentNode is a field name
				if (val instanceof Collection || val instanceof Map) {
					// with complex value, skip (evaluate later)
					return true;
				} else {
					// simple field = value check... do it now
					sb.append("eq(" + parentNode + "," + quoteValue(val) + ")");
				}
			}
			return false;
		}
		
	}

	/**
	 * A first stab at implementing a middle-tier criteria filter.
	 */
	public static class MatchQueryWalker extends QueryDefWalker {
		
		private Map<String, Object> row;
		private Map<String, Object> qrydata;
		
		public MatchQueryWalker(Map<String,Object> qrydata) {
			this.qrydata = qrydata;
		}
		
		public boolean matches(Map<String,Object> row) {
			this.row = row;
			walk(qrydata);
			// NOT threadsafe
			return !halt;
		}

		@Override
		protected boolean visitNode(Object val, String parentNode) {
			// parentNode is an operator:
			if (parentNode.startsWith("$")) {
				String rowField = evalStack.peek();
				Object rowValue = POMUtils.getMapPath(this.row, rowField);
				
				// its an operator, ensure its one we recognize
				if (parentNode.equals("$in") || parentNode.equals("$nin")) {
					boolean in = parentNode.equals("$in");
					// only process the first one (with the collection value)
					if (val instanceof Collection) {
						Collection c = (Collection) val;
						if (rowValue instanceof Collection) {
							Iterator itr = ((Collection) rowValue).iterator();
							while (itr.hasNext()) {
								if (c.contains(itr.next())) {
									return in;
								}
							}
							return !in;
						} else {
							return c.contains(rowValue) ? in : !in;
						}
					}
				} else if (parentNode.equals("$lt") || parentNode.equals("$gt") 
						|| parentNode.equals("$lte") || parentNode.equals("$gte")) {
					String s1 = val.toString();
					String s2 = rowValue.toString();
					
					int result = s1.compareTo(s2);
					if (parentNode.equals("$lte")) {
						return (result >= 0);
					} else if (parentNode.equals("$gte")) {
						return (result <= 0);
					} else if (parentNode.equals("$lt")) {
						return (result > 0);
					} else if (parentNode.equals("$gt")) {
						return (result < 0);
					}
				} else if (parentNode.equals("$or")) {
				} else {
					throw new IllegalArgumentException("Unrecognized operator: " + parentNode);
				}
			} else {
				// parentNode is a field name
				if (val instanceof Collection || val instanceof Map) {
					// with complex value, skip (evaluate later)
					return true;
				} else if (!row.containsKey(parentNode)) {
					return false; // with a simple value that does not exist
				} else {
					// simple field = value check... do it now
					return row.get(parentNode).equals(val);
				}
			}
			return true;
		}
	}

}



