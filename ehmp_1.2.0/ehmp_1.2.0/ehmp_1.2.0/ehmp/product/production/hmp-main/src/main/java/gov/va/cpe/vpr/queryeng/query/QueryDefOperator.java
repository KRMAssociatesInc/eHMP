package gov.va.cpe.vpr.queryeng.query;

import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;

/**
 * Operators are common between server and client side testing and are singletons so they
 * can be reused.
 * 
 * TODO: Implement additional operators for: NOT, NVL, EXISTS, LIKE,ILIKE ?
 */
public abstract class QueryDefOperator {
	protected static final String quoteValue(Object val) {
		if (val == null) {
			return "\"\"";
		} else if (!(val instanceof Number)) {
			return "\"" + val.toString() + "\"";
		}
		return val.toString();
	}
	
	public abstract boolean match(Object fieldValue, Object opValue);
	public abstract String toURL(String field, Object value);
	
	// Operator implementations -----------------------------------------------
	
	public static class QueryDefBetweenOperator extends QueryDefOperator {
		public static QueryDefOperator BTW = new QueryDefBetweenOperator();
		
		private QueryDefBetweenOperator() {}

		@Override
		public boolean match(Object fieldValue, Object opValue) {
			if (opValue instanceof Collection && ((Collection)opValue).size()==2) {
				Iterator i = ((Collection)opValue).iterator();
				Object o1 = i.next();
				Object o2 = i.next();
				Comparable c1 = (o1 instanceof Comparable?(Comparable)o1:o1.toString());
				Comparable c2 = (o2 instanceof Comparable?(Comparable)o2:o2.toString());
				Comparable cf = (fieldValue instanceof Comparable?(Comparable)fieldValue:fieldValue.toString());
				return c1.compareTo(cf)<=0 && c2.compareTo(cf)>=0;
			} else {
				return false;
			}
		}

		@Override
		public String toURL(String field, Object value) {
			if (value instanceof Collection && ((Collection)value).size()==2) {
				Object[] vals = ((Collection)value).toArray();
				if(vals[0]!=null && vals[1]!=null) {
					if(!(vals[0].toString().equals("") && vals[1].toString().equals(""))) {
						return "between("+field+","+quoteValue(vals[0])+","+quoteValue(vals[1])+")";
					}
				}
//				System.out.println("No good params: "+vals[0]+","+vals[1]);
			} 
			return "";
		}
		
	}
	
	public static class QueryDefSetOperator extends QueryDefOperator {
		public static QueryDefOperator IN = new QueryDefSetOperator(true);
		public static QueryDefOperator NIN = new QueryDefSetOperator(false);
		
		private boolean in;

		private QueryDefSetOperator(boolean in) {
			this.in = in;
		}

		@Override
		public boolean match(Object fieldValue, Object opValue) {
			if (opValue instanceof Collection) {
				return in == ((Collection<?>) opValue).contains(fieldValue);
			} else if (opValue == fieldValue) {
				return in;
			} else if (fieldValue == null || opValue == null) {
				return !in;
			} else if (opValue.getClass().isArray()) {
				return in == (Arrays.binarySearch((Object[]) opValue, fieldValue) >= 0);
			}

			return in == fieldValue.equals(opValue);
		}

		@Override
		public String toURL(String field, Object value) {
			if (value instanceof Collection) {
				String substr = "";
				for (Object o : ((Collection<?>) value)) {
					if (substr.length() != 0) substr += ",";
					substr += quoteValue(o);
				}
				return (in ? "in(\"" : "nin(\"") + field + "\",[" + substr + "])";
			} else if (value != null && value.getClass().isArray()) {
				return toURL(field, Arrays.asList((Object[]) value));
			}
			
			// single value, convert to eq/ne
			return (in ? "eq(" : "ne(") + field + "," + quoteValue(value) + ")"; 
		}
		
	}
	
	public static class QueryDefCompareOperator extends QueryDefOperator {
		public static QueryDefOperator EQ = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.EQ);
		public static QueryDefOperator NE = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.NE);
		public static QueryDefOperator GT = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.GT);
		public static QueryDefOperator LT = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.LT);
		public static QueryDefOperator GTE = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.GTE);
		public static QueryDefOperator LTE = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.LTE);
		public static QueryDefOperator EXISTS = new QueryDefCompareOperator(QueryDefCompareOperator.COMP.EXISTS);
		
		private enum COMP {EQ,NE,GT,LT,GTE,LTE,EXISTS}

		private COMP comp;
		private QueryDefCompareOperator(COMP comp) {
			this.comp = comp;
		}
		
		@Override
		public boolean match(Object fieldValue, Object opValue) {
			if (this.comp == COMP.EXISTS) {
				return fieldValue != null;
			}
			if (fieldValue == opValue) { // same object or both NULL
				switch (comp) {
					case GTE:
					case LTE:
					case EQ: return true;
					default: return false;
				}
			}
			if (fieldValue == null || opValue == null) return false; // one or the other is null
			if (fieldValue instanceof Comparable && opValue instanceof Comparable) {
				Comparable<Object> c1 = (Comparable<Object>) fieldValue, c2 = (Comparable<Object>) opValue;
				try {
					switch (comp) {
						case GTE: return (c1.compareTo(c2) >= 0);
						case LTE: return (c1.compareTo(c2) <= 0);
						case LT: return (c1.compareTo(c2) < 0);
						case GT: return (c1.compareTo(c2) > 0);
						case EQ: return (c1.compareTo(c2) == 0);
						case NE: return (c1.compareTo(c2) != 0);
					}
				} catch (ClassCastException ex) {
					// not comparible to each other
				}
			}
			// two non-null, non-comparable, non-equivalent objects
			return (comp == COMP.NE);
		}
		
		@Override
		public String toURL(String field, Object value) {
			String suffix = "," + quoteValue(value) + ")";
			if (comp == COMP.EXISTS) suffix = ")";
			return comp.name().toLowerCase() + "(" + field + suffix;
		}
	}

}