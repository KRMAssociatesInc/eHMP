package gov.va.cpe.vpr.queryeng.query;

import org.springframework.web.util.HtmlUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface QueryDefTransformer {
	public abstract void transform(List<Map<String, Object>> rows);
	
	public static abstract class QueryRowTransformer implements QueryDefTransformer {
		
		public void transform(List<Map<String, Object>> rows) {
			for (Map<String, Object> row : rows) {
				transform(row);
			}
		}
		
		public abstract void transform(Map<String, Object> row);
	}
	
	public static abstract class QueryFieldTransformer implements QueryDefTransformer {
		
		protected String field;
		
		public QueryFieldTransformer(String field) {
			this.field = field;
		}
		
		public void transform(List<Map<String, Object>> rows) {
			for (Map<String, Object> row : rows) {
				if (row.containsKey(this.field)) {
					row.put(this.field, transform(row.get(this.field)));
				}
			}
		}
		
		public abstract Object transform(Object value);
		
		public static class HTMLEscapeTransformer extends QueryFieldTransformer {
			public HTMLEscapeTransformer(String field) {
				super(field);
			}
	
			@Override
			public Object transform(Object value) {
				return HtmlUtils.htmlEscape((value != null) ? value.toString() : null);
			}
		}
		
		public static class ReplaceTransformer extends QueryFieldTransformer {
			private String with;
			private String replace;
			
			public ReplaceTransformer(String field, String replaceStr, String withStr) {
				super(field);
				this.replace = replaceStr;
				this.with = withStr;
			}
			
			@Override
			public Object transform(Object value) {
				if (value != null) {
					return value.toString().replace(this.replace, this.with);
				}
				return null;
			}
		}
		
		public static class NumberParserTransformer extends QueryFieldTransformer {
			private boolean nullIfNotNumber;

			public NumberParserTransformer(String field) {
				this(field, false);
			}
			
			public NumberParserTransformer(String field, boolean nullIfNotNumber) {
				super(field);
				this.nullIfNotNumber = nullIfNotNumber;
			}
	
			@Override
			public Object transform(Object value) {
				if (value == null) {
					return null;
				} else if (value instanceof Number) {
					return (Number) value;
				}
				String val = value.toString();
				
				try {
					if (val.indexOf('.') > 0) {
						// try to parse a double (don't use float, Jackson does weird things when it gets serialized)
						return Double.parseDouble(val);
					} else {
						// try to parse an integer
						return Integer.parseInt(val);
					}
				} catch (NumberFormatException ex) {
					// not a number
				}
				
				// not a number
				return (this.nullIfNotNumber) ? null : val;
			}
		}
	}

	/**
	 * Transformer to extract a sub-field into a simple field
	 * 
	 * Pattern is: field.field[idx].field
	 * 
	 * If it cannot resolve this field, then it can return a default value instead.
	 * 
	 * TODO: Investigate other JDS operators for ideas, like "*" to combine multiple subfields
	 * TODO: Another extraction/transform could be field[].field could return an array of values
	 * 
	 * @author brian
	 */
	public static class ExtractFieldTransformer extends QueryRowTransformer {
		private String asfield;
		private Object defaultVal;
		private String[] fields;

		/**
		 * Create a new field in each row called <pre>asfield</pre>.  If <pre>pattern</pre> cannot be resolved, then
		 * store <pre>defaultVal</pre> in <pre>asfield</pre> instead.  If <pre>defaultval</pre> is null, then no 
		 * <pre>asfield</pre> will be added to the row.
		 * 
		 * @param pattern
		 * @param asfield
		 * @param defaultVal
		 */
		public ExtractFieldTransformer(String pattern, String asfield, Object defaultVal) {
			this.asfield = asfield;
			this.fields = pattern.split("\\.");
			this.defaultVal = defaultVal;
		}

		@Override
		public void transform(Map<String, Object> row) {
			Object val = row;
			
			for (String field : fields) {
				int fieldIdx = -1;
				int fieldIdxStart = field.indexOf('[')+1;
				int fieldIdxEnd = field.indexOf(']');
				if (fieldIdxStart > 0 && fieldIdxEnd > 0 && fieldIdxStart < fieldIdxEnd) {
					fieldIdx = Integer.parseInt(field.substring(fieldIdxStart,fieldIdxEnd));
					field = field.substring(0, fieldIdxStart-1);
				}
				
				// resolve the field name
				if (val instanceof Map && ((Map) val).containsKey(field)) {
					val = ((Map) val).get(field); // treat as map
				} else {
					val = this.defaultVal;
					break;
				}
				
				// resolve the field index (if any)
				if (fieldIdx >= 0 && val instanceof List && ((List) val).size() > fieldIdx) {
					val = ((List) val).get(fieldIdx); // treat as list
				} else if (fieldIdx >= 0) {
					// failed to find the value, return default
					val = this.defaultVal;
					break;
				}
			}
			
			if (val != null) {
				row.put(this.asfield, val);
			}
		}
	}
	
	/**
	 * Similar to an Oracle DECODE() function for simple mapping of values to other values.
	 * 
	 * Example to map the letters A,B,C to their alphabetical index, or -1 otherwise:
	 * <pre>new DecodeFieldTransformer("field", "a", 1, "b", 2, "c", 3, -1)</pre>
	 * @author brian
	 *
	 */
	public static class DecodeFieldTransformer extends QueryFieldTransformer {

		private Map<Object, Object> valMap;
		private Object defaultVal;

		public DecodeFieldTransformer(String field, Object... objects) {
			super(field);
			
			// default value is null if there are an even number of object params, 
			// otherwise its the last object in the array
			this.defaultVal = (objects.length % 2 == 0) ? null : objects[objects.length-1];
			
			// create the value map by iterating over every other key
			Map<Object, Object> valMap = new HashMap<Object, Object>();
			for (int i=1; i < objects.length; i+=2) {
				valMap.put(objects[i-1], objects[i]);
			}
			this.valMap = (!valMap.isEmpty()) ? valMap : new HashMap<Object, Object>();
		}

		@Override
		public Object transform(Object value) {
			return valMap.get(value);
		}
	}
	
	/**
	 * Simply overwrite a field with a specific value, if the value is null, then its the 
	 * same as deleting the field from the results.
	 * @author brian
	 */
	public static class OverwriteTransformer extends QueryRowTransformer {

		private String field;
		private Object value;

		public OverwriteTransformer(String field, Object value) {
			this.field = field;
			this.value = value;
		}

		@Override
		public void transform(Map<String, Object> row) {
			if (this.value == null) {
				row.remove(this.field);
			} else {
				row.put(this.field, this.value);
			}
		}
	}
}