package gov.va.cpe.vpr.pom;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.smile.SmileFactory;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.lang.reflect.Constructor;
import java.util.*;

/*
 * All static methods.
 * TODO: Some of this could be replaced with spring's MapUtils?
 * 
 */
public class POMUtils {
	public static final POMObjectMapper MAPPER = AbstractPOMObject.MAPPER;
	public static final ObjectMapper SMILE_MAPPER = new POMObjectMapper(new SmileFactory());
	
    public static final String nullCheck(Object obj) {
        if (obj == null) {
            return null;
        }

        String str = obj.toString().trim();
        if (str.length() == 0) {
            return null;
        }
        return str;
    }

    /**
     * Replicates the Oracle NVL function, if the value is null, then substitute a different value in its place
     */
    public static final <T> T nvl(T value, T ifnull) {
        return (value == null) ? ifnull : value;
    }

    public static final String nvl(String value) {
        return (value == null) ? "" : value;
    }

    public static final String getMapStr(Map<String, Object> data, String... keys) {
        for (String k : keys) {
            if (data.containsKey(k)) {
                return nullCheck(data.get(k));
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public static final Set<Map<String, Object>> getMapSubMap(Map<String, Object> data, String key) {
        Object vals = data.get(key);
        Set<Map<String, Object>> ret = new HashSet<Map<String, Object>>();
        if (vals != null && vals instanceof List) {
            for (Object o : (List<Object>) vals) {
                if (o instanceof Map) {
                    ret.add((Map<String, Object>) o);
                }
            }
        }
        return ret;
    }

    public static final <T extends IPOMObject> List<T> getMapObjList(Map<String, Object> data, String key, Class<T> clazz) {
        ArrayList<T> ret = new ArrayList<T>();
        for (Map<String, Object> m : getMapSubMap(data, key)) {
            try {
                T obj = clazz.newInstance();
                obj.setData(m);
                ret.add(obj);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
        return ret;
    }

    public static final PointInTime getMapPit(Map<String, Object> data, String... keys) {
        for (String k : keys) {
            if (data.containsKey(k)) {
                Object value = data.get(k);
                if (value instanceof Date) {
                    return PointInTime.fromDateFields((Date) value);
                } else if (value instanceof String) {
                    return HL7DateTimeFormat.parse((String) value);
                } else if (value instanceof PointInTime) {
                    return (PointInTime) value;
                }
            }
        }
        return null;
    }

    /**
     * Return a map with all the unregonized keys.
     */
    public static final Map<String, Object> getMapUnknownKeys(Map<String, Object> data, String[] knownKeys) {
        Map<String, Object> ret = new HashMap<String, Object>(data);
        // remove all known keys and return
        for (String key : knownKeys) {
            ret.remove(key);
        }
        return ret;
    }

    public static List<String> getMapChangedFields(Map<String, Object> oldData, Map<String, Object> newData) {
        List<String> dirtyFields = new ArrayList<String>();
        for (String key : newData.keySet()) {
            Object oldVal = oldData.get(key), newVal = newData.get(key);

            if ((oldVal == null) != (newVal == null)) {
                dirtyFields.add(key);
            } else if (oldVal instanceof String || oldVal instanceof PointInTime || oldVal instanceof Date || (oldVal != null && oldVal.getClass().isPrimitive())) {
                if (!oldVal.equals(newVal)) {
                    dirtyFields.add(key);
                }
            } else if (oldVal instanceof Map || oldVal instanceof List) {
                if (!oldVal.equals(newVal)) {
                    dirtyFields.add(key);
                }
            }
        }

        return dirtyFields;
    }

    /**
     * Smarter Map.get() where you can use dotted notation or array/gather to get values:
     * <p/>
     * Examples:
     * 1) getSubKey("a.b") -> a is a nested map, then retrive the value b from it
     * 2) getSubKey("a[].b") -> if b is a nested array of maps, gather all the values of b and return them as a list
     * <p/>
     * TODO: I'm sure there are boundary cases/exceptions not being dealt with yet...
     * TODO: The gather operator '[]' could have all sorts of additional criteria and nested expressions...
     *
     * @param m
     * @param key
     */
    public static final Object getMapPath(Map m, String key) {
        // shortcut return conditions
        if (m == null || key == null) {
            return null;
        } else if (m.containsKey(key)) {
            return m.get(key);
        }

        // find the first operator (. or [), but -1 isn't the min
        int idx = key.indexOf("[]");
        if (idx == -1) {
            idx = key.indexOf('.');
        } else if (key.indexOf('.') > -1) {
            idx = Math.min(idx, key.indexOf('.'));
        }
        if (idx == -1) {
            return null; // no operators and no value, probably key that doesn't exist.
        }

        // apply the first operator
        char operator = key.charAt(idx);
        String prefix = key.substring(0, idx);
        if (operator == '.') {
            // expecting a sub-map, return a key from the sub-map
            key = key.substring(idx + 1);

            // if its another map, recurse, otherwise just return the object
            Object subobj = m.get(prefix);
            if (subobj == null) {
                return null;
            } else if (subobj instanceof Map) {
                return getMapPath((Map) subobj, key);
            } else {
                throw new IllegalArgumentException("Unable to resolve subkey, sub-object is not a map");
            }
        } else if (operator == '[') {
            // prefix should be a list/array of nested maps, gather the subkey values
            key = key.substring(idx + 3);

            Object subobj = m.get(prefix);
            if (subobj instanceof Iterable) {
                return gather((Iterable) subobj, key);
            } else if (subobj == null) {
                return new ArrayList<Object>();
            } else {
                String msg = "Using the [] operator requires a nested Iterable, but was: ";
                throw new IllegalArgumentException(msg + subobj.getClass());
            }
        }
        throw new IllegalArgumentException("Shouldn't be able to get here...");
    }

    /**
     * Takes a list of maps and gathers all the value of subkey and returns the list.
     */
    public static final List<Object> gather(Iterable<?> list, String subkey) {
        List<Object> ret = new ArrayList<Object>();
        Iterator<?> itr = list.iterator();
        while (itr.hasNext()) {
            Object o = itr.next();
            if (o instanceof Map) {
                o = getMapPath((Map) o, subkey);
                if (o != null) {
                    ret.add(o);
                }
            } else {
                throw new IllegalArgumentException("Expected Map.class, not " + o.getClass());
            }
        }
        return ret;
    }

    /**
     * Simple static helper method to assist with defining key aliases.
     * <p/>
     * Alters the given map, and if targetKey does not exist, renames the first found aliasKey to targetKey (if any)
     */
    public static void mapAlias(Map<String, Object> data, String targetKey, String... aliasKeys) {
        if (data == null || data.containsKey(targetKey)) {
            return;
        }

        for (String key : aliasKeys) {
            if (data.containsKey(key)) {
                data.put(targetKey, data.get(key));
                data.remove(key);
                return;
            }
        }
    }

    // POM Object Initalizers ------------------------------------------------------------

    /**
     * The advantage to using this JSON parser instead of your own Jackson ObjectMapper instance is that
     * this uses the same instance/configuration as the POM objects and it suppresses the exceptions that shouldn't happen.
     */
    public static final Map<String, Object> parseJSONtoMap(String jsonString) {
        try {
            return MAPPER.readValue(jsonString, AbstractPOMObject.MAP_TYPEREF);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
        }
    }

    public static final Map<String, Object> parseJSONtoMap(Reader reader) {
        StringBuffer buff = new StringBuffer();
        char[] c = new char[1000];
        try {
            while (reader.read(c) > -1) {
                buff.append(c);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return parseJSONtoMap(buff.toString());
    }

    public static final Map<String, Object> parseJSONtoMap(InputStream is) {
        try {
            return MAPPER.readValue(is, AbstractPOMObject.MAP_TYPEREF);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
        }
    }

    public static final JsonNode parseJSONtoNode(Reader reader) {
        StringBuffer buff = new StringBuffer();
        char[] c = new char[1000];
        try {
            while (reader.read(c) > -1) {
                buff.append(c);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return parseJSONtoNode(buff.toString());
    }

    public static final JsonNode parseJSONtoNode(String jsonString) {
        try {
            return MAPPER.readTree(jsonString);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
        }
    }

    public static final JsonNode parseJSONtoNode(InputStream is) {
        try {
            return MAPPER.readTree(is);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
        }
    }
    
    public static final JsonNode parseSMILEtoNode(InputStream is) {
        try {
            return SMILE_MAPPER.readTree(is);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
        }
    }
    
    public static final JsonNode parseSMILEtoNode(byte[] bytes) {
    	if (bytes == null) throw new IllegalArgumentException("bytes cannot be null");
        try {
            return SMILE_MAPPER.readTree(bytes);
        } catch (IOException e) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(e);
        }
    }
    
    /**
     * Convert an object to a binary SMILE format
     */
    public static final byte[] toSMILE(Object obj) {
    	try {
			return SMILE_MAPPER.writeValueAsBytes(obj);
		} catch (IOException ex) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(ex);
		}
    }

    /**
     * Convert an object to a binary SMILE format with optional JSONView
     */
    public static final byte[] toSMILE(Object obj, Class<? extends JSONViews> view) {
		try {
			return SMILE_MAPPER.writerWithView(view).writeValueAsBytes(obj);
		} catch (IOException ex) {
			// this should not be able to happen since we are writing to strings not files
			throw new RuntimeException(ex);
		}
	}

    public static final String toJSON(Object obj) {
        try {
            return MAPPER.writeValueAsString(obj);
        } catch (IOException ex) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(ex);
        }
    }

    public static final String toJSON(Object obj, Class<? extends JSONViews> view) {
        try {
            return MAPPER.writerWithView(view).writeValueAsString(obj);
        } catch (IOException ex) {
            // not using file IO here so this shouldn't happen ever
            throw new RuntimeException(ex);
        }
    }

    public static final <T extends IPOMObject> T newInstance(Class<T> clazz, String jsonStr) {
        return newInstance(clazz, parseJSONtoMap(jsonStr));
    }
    
	/** decode a SMILE byte stream encoded JSON document to its IPatientObject */
    public static final <T extends IPOMObject> T newInstance(Class<T> clazz, byte[] smileBytes) {
        return newInstance(clazz, parseSMILEtoNode(smileBytes));
    }

    public static final <T extends IPOMObject> T newInstance(Class<T> clazz, InputStream is) {
        return newInstance(clazz, parseJSONtoMap(is));
    }

    public static final <T extends IPOMObject> T newInstance(Class<T> clazz, Map<String, Object> data) {
        if (data == null) return null;
        try {
            Constructor<T> c = (Constructor<T>) clazz.getConstructor(Map.class);
            return c.newInstance(data);
        } catch (Exception ex) {
            // this shouldn't happen b/c we are using very explicit type safety/genetics
            throw new RuntimeException(ex);
        }
    }

    public static final <T extends IPOMObject> T newInstance(Class<T> clazz, JsonNode data) {
        if (data == null) return null;
        Map<String, Object> map = MAPPER.convertValue(data, Map.class);
        return newInstance(clazz, map);
    }
    
    public static final Map<String, Object> convertObjectToMap(Object data) {
        return MAPPER.convertValue(data, Map.class);
    }

    public static final Map<String, Object> convertNodeToMap(JsonNode data) {
        return MAPPER.convertValue(data, Map.class);
    }

    public static final JsonNode convertObjectToNode(Object obj) {
        try {
            return MAPPER.convertValue(obj, JsonNode.class);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static Number parseNumber(String result) {
        if (result == null) {
            return null;
        }

        // try to parse a float
        try {
            return Float.parseFloat(result);
        } catch (NumberFormatException ex) {
            // not a float
        }

        // TODO: Try to parse a double?

        // try to parse an int
        try {
            return Integer.parseInt(result);
        } catch (NumberFormatException ex) {
            // not a int
        }

        return null;
    }
    
    /**
     * TODO: Find a lie berry function to do this ...
     * @param val
     * @return
     */
    public static boolean isValidJSON(String val) {
    	if(val.startsWith("{") && val.endsWith("}")) {
    		return true;
    	}
    	return false;
    }
}
