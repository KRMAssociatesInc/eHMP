package gov.va.cpe.vpr.pom;

import java.io.Serializable;
import java.lang.annotation.Annotation;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;

/**
 * Basically defines a set of annotations and implementation classes that represent the 
 * different index types.  The annotation and implementation class are linked togeather with a meta
 * annotation using some Annotation/Generics black magic.
 */
public abstract class POMIndex<T extends Annotation> {
	
	/**
	 * This annotation is used to identify other annotations as JDSIndexes and
	 * then used to link them to the appropriate implementation class
	 */
	@java.lang.annotation.Target(value = { java.lang.annotation.ElementType.ANNOTATION_TYPE })
	@java.lang.annotation.Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
	public @interface JDSIndex {
		public Class<? extends POMIndex<?>> clazz();
	}
	
	/**
	 * This is the main/original index type. Represents an index on a single field with a single value.
	 */
	@JDSIndex(clazz=ValuePOMIndex.class)
	@java.lang.annotation.Target(value = { java.lang.annotation.ElementType.FIELD, java.lang.annotation.ElementType.METHOD })
	@java.lang.annotation.Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
	public @interface ValueJDSIndex {
		public String name();
		public String field() default ""; // only necessary to specifiy if annotation is not on a field/method
		public String expiresat() default ""; // never expires (hl7 datetime format)
	}
	
	/**
	 * Implementation class for the ValueJDSIndex annotation
	 * 
	 * Inserts 1+ values into the index
	 * 
	 * Can obtain the value from a method, field or getData() element, usually depending on 
	 * where the annotation was placed.
	 * 
	 * Optionally inserts an expiresat node
	 */
	public static class ValuePOMIndex extends POMIndex<ValueJDSIndex> {
		private Method method;
		
		public ValuePOMIndex(Field f, ValueJDSIndex a) {
			super(f, a);
		}

		public ValuePOMIndex(Method m, ValueJDSIndex a) {
			super(null, a);
			method = m;
		}

		@Override
		public void calcValue(IPatientObject obj, List<Map<String, Object>> idxdata) {
			Object val = getFieldValue(obj, method, getField(), getAnnotation().field());
			if (val != null) {
				addIndexEntry(idxdata, getIndexName(), val);
				// insert an expire date as well?
				String expire = getAnnotation().expiresat();
				if (expire != null && !expire.equals("")) {
					// TODO: need to migrate this functionality into PointInTime
					/*
					PointInTime expireat = ViewParam.DateRangeParam.parseDateStr(expire, PointInTime.now());
					if (expireat != null) {
						addIndexEntry(idxdata, "expireat", expireat.toString());
					}
					*/
				}
			}
		}

		@Override
		public String getIndexName() {
			return getAnnotation().name();
		}
	}
	
	/**
	 * Represents a range index (usually date/time) on two fields (a start field and end field)
	 */
	@JDSIndex(clazz=RangePOMIndex.class)
	@java.lang.annotation.Target(value = { java.lang.annotation.ElementType.FIELD })
	@java.lang.annotation.Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
	public @interface RangeJDSIndex {
		public String name();
		public String startField() default ""; // defaults to the name of the field its declared on
		public String endField();
	}
	
	/**
	 * The implementation class for RangeJDSIndex annotation
	 */
	public static class RangePOMIndex extends POMIndex<RangeJDSIndex> {
		RangeJDSIndex idx;
		public RangePOMIndex(Field f, RangeJDSIndex a) {
			super(f, a);
			idx = a;
		}
		
		public String getStartField() {
			String start = idx.startField();
			return start.equals("") ? getField().getName() : start;
		}

		@Override
		public void calcValue(IPatientObject obj, List<Map<String, Object>> idxdata) {
			Map<String, Object> data = obj.getData();
			addIndexEntry(idxdata, getIndexName(), data.get(getStartField()));
			addIndexEntry(idxdata, getIndexName(), data.get(idx.endField()));
		}

		@Override
		public String getIndexName() {
			return getAnnotation().name();
		}
	}
	
	/**
	 * This index is for fields that have multiple values (Array/List/Set), each value is 
	 * included in the index.  Example: Medication.products[].ingredientName
	 */
	@JDSIndex(clazz=MultiValuePOMIndex.class)
	@java.lang.annotation.Target(value = { java.lang.annotation.ElementType.FIELD, java.lang.annotation.ElementType.METHOD })
	@java.lang.annotation.Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
	public @interface MultiValueJDSIndex {
		public String name();
		public String field() default ""; // defaults to the name of the field its declared on
		public String subfield(); // which key of the sub-object should the index value come from?
	}
	
	public static class MultiValuePOMIndex extends POMIndex<MultiValueJDSIndex> {
		private Method method;

		public MultiValuePOMIndex(Field f, MultiValueJDSIndex a) {
			super(f, a);
		}
		
		public MultiValuePOMIndex(Method m, MultiValueJDSIndex a) {
			super(null, a);
			method = m;
		}

		@SuppressWarnings("unchecked")
		public void calcValue(IPatientObject obj, List<Map<String, Object>> idxdata) {
			// get the field value, return if there is none
			Object val = getFieldValue(obj, method, getField(), getAnnotation().field());
			if (val == null) return;
			
			// these are the recognized ways to store multiple values
			if (val instanceof Iterable) {
				Iterator<Object> itr = ((Iterable<Object>) val).iterator();
				while (itr.hasNext()) {
					calcSingleValue(itr.next(), idxdata);
				}
			} else if (val.getClass().isArray()) {
				for (Object v : (Object[]) val) {
					calcSingleValue(v, idxdata);
				}
			}
		}
		
		private void calcSingleValue(Object obj, List<Map<String, Object>> idxdata) {
			String key = getAnnotation().subfield();
			if (obj instanceof IPatientObject) {
				// for now, we can only index fields from sub-pom objects
				Object val = getFieldValue((IPatientObject) obj, null, null, key);
				addIndexEntry(idxdata, getIndexName(), val);
			} else if (obj instanceof Map && ((Map) obj).containsKey(key)) {
				addIndexEntry(idxdata, getIndexName(), ((Map) obj).get(key));
			} else if (key.equals("") && obj instanceof Serializable ) {
				addIndexEntry(idxdata, getIndexName(), obj);
			}
		}

		@Override
		public String getIndexName() {
			return getAnnotation().name();
		}
	}
	
	@JDSIndex(clazz=TermPOMIndex.class)
	@java.lang.annotation.Target(value = { java.lang.annotation.ElementType.FIELD })
	@java.lang.annotation.Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
	public @interface TermJDSIndex {
		public String name();
		public String field() default ""; // defaults to the name of the field its declared on
		public String subfield() default ""; // which key of the sub-object should the index value come from?
	}
	
	public static class TermPOMIndex extends POMIndex<TermJDSIndex> {
		private Method method;
		public TermPOMIndex(Field f, TermJDSIndex a) {
			super(f, a);
		}
		
		public TermPOMIndex(Method m, TermJDSIndex a) {
			super(null, a);
			method = m;
		}
		
		@Override
		public String getIndexName() {
			return getAnnotation().name();
		}

		/**
		 * We don't have the infastructure in place for this yet, but the idea would be to
		 * get all the ancestors of the specified concept (usually no more than 15ish) and
		 * insert all of them in the index (including the specified concept).
		 * 
		 * Then you can support indexed ISA queries
		 */
		@Override
		public void calcValue(IPatientObject obj, List<Map<String, Object>> idxdata) {
			Object val = getFieldValue(obj, method, getField(), getAnnotation().field());
			String subfield = getAnnotation().subfield();
			
			// if there is a subfield, get it
			if (val != null && !subfield.equals("")) {
				if (val instanceof IPOMObject) {
					val = getFieldValue((IPOMObject) val, null, null, subfield);
				} else if (val instanceof Map) {
					val = ((Map) val).get(subfield);
				}
			}
			if (val == null) return;
			
			// get the ancestor set and add each one to the index
// TODO: Brian refactoring the TermEng - fix up when done
//			Set<String> ancestors = TermEng.INSTANCE.getAncestorSet(val.toString());
//			if (ancestors != null) {
//				for (String concept : ancestors) {
//					addIndexEntry(idxdata, getIndexName(), concept.toString());
//				}
//			}
				
			// also put the original concept in
			addIndexEntry(idxdata, getIndexName(), val.toString());
		}
	}
	
	private Field field;
	private T annotation;
	
	public POMIndex(Field f, T a) {
		field = f;
		annotation = a;
	}
	
	public T getAnnotation() {
		return annotation;
	}
	
	public Field getField() {
		return field;
	}
	
	public abstract String getIndexName();
	
	public abstract void calcValue(IPatientObject obj, List<Map<String, Object>> idxdata);
	
	public String toString() {
		return getClass().getName() + ": " + (field == null ? "" : field.getName()) + ", "+ annotation.toString();
	}
	
	protected static void addIndexEntry(List<Map<String, Object>> idxdata, String key, Object value) {
		if (idxdata == null || key == null || value == null) return;
		HashMap<String, Object> m = new HashMap<String, Object>();
		m.put(key, value);
		idxdata.add(m);
	}
	
	/**
	 * Returns the appropriate value specified by an annotation, either gets the value via
	 * reflection (from a Method or Field) or uses the getData() and fetches via a key.
	 */
	protected static Object getFieldValue(IPOMObject obj, Method method, Field field, String fieldkey) {
		try {
			if (method != null && !Modifier.isPrivate(method.getModifiers())) {
				return method.invoke(obj, new Object[] {});
			} else if (field != null && !Modifier.isPrivate(field.getModifiers())) {
				return field.get(obj);
			} else if (fieldkey != null && !fieldkey.equals("")) {
				Map<String, Object> data = obj.getData();
				return data.get(fieldkey);
			} else if (field != null) {
				// backup strategy, use the field name to fetch data from getData()
				Map<String, Object> data = obj.getData();
				return data.get(field.getName());
			}
			return null;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * Extracts all of the JDSIndex annotations for a class, it then wraps each annotation in the
	 * implementation class and returns them all as a list.
	 */
	@SuppressWarnings("unchecked")
	public static List<POMIndex<?>> extractIndexes(Class<? extends IPatientObject> clazz) {
		List<POMIndex<?>> ret = new ArrayList<POMIndex<?>>();
		Field[] fields = clazz.getDeclaredFields();
		
		// TODO: Also search for them at the class level?
		
		// search for field annotations
		for (Field f : fields) {
			Annotation[] annotations = f.getAnnotations();
			for (Annotation annotation : annotations) {
				if (annotation.annotationType().isAnnotationPresent(JDSIndex.class)) {
					JDSIndex jdsidx = annotation.annotationType().getAnnotation(JDSIndex.class);
					try {
						// a little hacky
						Class<? extends POMIndex<?>> cls = jdsidx.clazz();
						Constructor<?> con = cls.getConstructor(Field.class, annotation.annotationType());
						ret.add((POMIndex<?>) con.newInstance(f, annotation));
					} catch (Exception ex) {
						throw new RuntimeException(ex);
					}
				}
			}
		}
		
		// search for method annotations
		Method[] methods = clazz.getDeclaredMethods();
		for (Method m : methods) {
			Annotation[] annotations = m.getAnnotations();
			for (Annotation annotation : annotations) {
				if (annotation.annotationType().isAnnotationPresent(JDSIndex.class)) {
					JDSIndex jdsidx = annotation.annotationType().getAnnotation(JDSIndex.class);
					try {
						// a little hacky
						Class<? extends POMIndex<?>> cls = jdsidx.clazz();
						Constructor<?> con = cls.getConstructor(Method.class, annotation.annotationType());
						ret.add((POMIndex<?>) con.newInstance(m, annotation));
					} catch (Exception ex) {
						throw new RuntimeException(ex);
					}
				}
			}
		}
		
		// if this class extends another class, also include recursive 
		// call for parent annotations as well
		@SuppressWarnings("rawtypes")
		Class parentClazz = clazz.getSuperclass();
		if (parentClazz != null && parentClazz.isAssignableFrom(IPatientObject.class)) {
			ret.addAll(extractIndexes(parentClazz));
		}
		
		return ret;
	}
	
	/*
	 * 

Tally : patient specific count of records containing a each value of a specified field

Definition Example:
^VPRMETA("index","vs",7,"collection")="vs"
^VPRMETA("index","vs",7,"field")="kind"
^VPRMETA("index","vs",7,"group")="kind"
^VPRMETA("index","vs",7,"review")=""
^VPRMETA("index","vs",7,"setif")=""
^VPRMETA("index","vs",7,"sort")=""
^VPRMETA("index","vs",7,"start")=""
^VPRMETA("index","vs",7,"stop")=""
^VPRMETA("index","vs",7,"type")="tally"

Storage Example:
^VPRPTI(3,"tally","vs-count-name","BLOOD PRESSURE")=26
^VPRPTI(3,"tally","vs-count-name","HEIGHT")=10
^VPRPTI(3,"tally","vs-count-name","PAIN")=20
^VPRPTI(3,"tally","vs-count-name","PULSE")=26
^VPRPTI(3,"tally","vs-count-name","PULSE OXIMETRY")=11
^VPRPTI(3,"tally","vs-count-name","RESPIRATION")=15
^VPRPTI(3,"tally","vs-count-name","TEMPERATURE")=23
^VPRPTI(3,"tally","vs-count-name","WEIGHT")=20
	
Attrib: All the values of an attribute

Definition Example:
^VPRMETA("index","med",17,"collection")="med"
^VPRMETA("index","med",17,"field")="products[].ingredientName"
^VPRMETA("index","med",17,"group")="med-ingredient-name"
^VPRMETA("index","med",17,"review")=""
^VPRMETA("index","med",17,"setif")=""
^VPRMETA("index","med",17,"sort")="overallStop:T"
^VPRMETA("index","med",17,"start")=""
^VPRMETA("index","med",17,"stop")=""
^VPRMETA("index","med",17,"type")="attrib"

Storage Example:
^VPRPTI(3,"attr","med-ingredient-name","ASPIRIN",0,"urn:va:med:93EF:3:18068")=""
^VPRPTI(3,"attr","med-ingredient-name","METFORMIN",0,"urn:va:med:93EF:3:16982")=""
^VPRPTI(3,"attr","med-ingredient-name","METOPROLOL",0,"urn:va:med:93EF:3:15231")=""
^VPRPTI(3,"attr","med-ingredient-name","METOPROLOL",0,"urn:va:med:93EF:3:16956")=""
^VPRPTI(3,"attr","med-ingredient-name","METOPROLOL TARTRATE",0,"urn:va:med:93EF:3:18067")=""
^VPRPTI(3,"attr","med-ingredient-name","METOPROLOL TARTRATE",0,"urn:va:med:93EF:3:21173")=""
^VPRPTI(3,"attr","med-ingredient-name","METOPROLOL TARTRATE",0,"urn:va:med:93EF:3:27937")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:12727")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:15232")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:16957")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:17264")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:18070")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:21174")=""
^VPRPTI(3,"attr","med-ingredient-name","SIMVASTATIN",0,"urn:va:med:93EF:3:28037")=""
^VPRPTI(3,"attr","med-ingredient-name","WARFARIN",0,"urn:va:med:93EF:3:17203")=""

List: List of all records (by patient) that meet a true/false rule
Example: List of all active outpatient meds:

Definition Example:
^VPRMETA("index","med",21,"collection")="med"
^VPRMETA("index","med",21,"field")=""
^VPRMETA("index","med",21,"group")="med-active-outpt"
^VPRMETA("index","med",21,"review")=""
^VPRMETA("index","med",21,"setif")="$$OACT^VPRJFPS"
^VPRMETA("index","med",21,"sort")="overallStop:T"
^VPRMETA("index","med",21,"start")=""
^VPRMETA("index","med",21,"stop")=""
^VPRMETA("index","med",21,"type")="list"

Storage Example:
^VPRPTI(3,"list","med-active-outpt",0,"urn:va:med:93EF:3:18068")=""

 */
	


}
