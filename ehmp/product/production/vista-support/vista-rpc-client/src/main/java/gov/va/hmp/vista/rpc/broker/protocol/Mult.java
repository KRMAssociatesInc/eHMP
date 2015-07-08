package gov.va.hmp.vista.rpc.broker.protocol;

import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.collections.map.LinkedMap;

import java.util.*;

/**
 * This component defines the multiple field of a parameter.  The multiple
 * field is used to pass string-subscripted array of data in a parameter.
 */
public class Mult {

    private LinkedMap multiple = new LinkedMap();
    private boolean sorted = false;
    private ObjectMapper jsonMapper = new ObjectMapper();

    private void clearAll() {
        multiple.clear();
    }

    /**
     * Returns the number of elements in the multiple
     *
     * @return
     */
    public int getCount() {
        return multiple.size();
    }

    /**
     * Returns the subscript string of the next or previous element from the
     * StartSubscript.  This is very similar to the $O function available in M.
     * Null string ('') is returned when reaching beyond the first or last
     * element, or when list is empty.
     *
     * @param startSubscript
     * @param direction
     * @return
     */
    public String order(String startSubscript, int direction) {
        if (startSubscript.length() == 0) {
            if (direction > 0)
                return getFirst();
            else
                return getLast();
        } else {
            if (direction > 0) {
                String next = (String) multiple.nextKey(startSubscript);
                return next != null ? next : "";
            } else {
                String prev = (String) multiple.previousKey(startSubscript);
                return prev != null ? prev : "";
            }
        }
    }

    /**
     * Returns the VALUE of the element whose subscript is passed.
     *
     * @param subscript
     * @return
     */
    public String get(String subscript) {
        return (String) multiple.get(subscript);
    }

    /**
     * Stores a new element in the multiple.
     *
     * @param subscript
     * @param value
     */
    public void put(String subscript, String value) {
        multiple.put(subscript, value);
    }

    public void add(Map map) {
        add(null, map);
    }

    public void add(List list) {
        add(null, list);
    }

    public void add(JsonNode jsonNode) {
        add(null, convertJsonNodeToMap(jsonNode));
    }

    private void add(String prefix, Map map) {
        for (Object key : map.keySet()) {
            StringBuilder subscript = new StringBuilder();
            if (prefix != null && prefix.length() > 0) {
                subscript.append(prefix);
                subscript.append(",");
            }
            subscript.append('\"');
            subscript.append(key.toString());
            subscript.append('\"');

            Object value = map.get(key);
            if (value instanceof Map) {
                add(subscript.toString(), (Map) value);
            } else if (value instanceof List) {
                add(subscript.toString(), (List) value);
            } else if (value instanceof String) {
                put(subscript.toString(), (String) value);
            } else if (value instanceof JsonNode) {
                add(subscript.toString(), convertJsonNodeToMap((JsonNode) value));
            } else {
                put(subscript.toString(), value.toString());
            }
        }
    }

    private void add(String prefix, List list) {
        for (int i = 0; i < list.size(); i++) {
            StringBuilder subscript = new StringBuilder();
            if (prefix != null && prefix.length() > 0) {
                subscript.append(prefix);
                subscript.append(",");
            }
            subscript.append(i);
            Object value = list.get(i);
            if (value instanceof Map) {
                add(subscript.toString(), (Map) value);
            } else if (value instanceof List) {
                add(subscript.toString(), (List) value);
            } else if (value instanceof String) {
                put(subscript.toString(), (String) value);
            } else if (value instanceof JsonNode) {
                add(subscript.toString(), convertJsonNodeToMap((JsonNode) value));
            } else {
                put(subscript.toString(), value.toString());
            }
        }
    }

    private Map convertJsonNodeToMap(JsonNode value) {
        return jsonMapper.convertValue((JsonNode) value, Map.class);
    }

    /**
     * Returns the index position of the
     * element in the list.  Opposite of <code>Mult.subscript()</code>.  Remember that
     * the list is 0 based!
     *
     * @param subscript
     * @return
     */
    public int position(String subscript) {
        return multiple.indexOf(subscript);
    }

    /**
     * Returns the string subscript of the element whose position in the list
     * is passed in.  Opposite of TMult.Position().  Remember that the list is 0 based!
     */

    public String subscript(int position) {
        if (position > multiple.size()) return "";
        if (position < 0) return "";
        return (String) multiple.get(position);
    }

    /**
     * Returns the subscript of the first element in the multiple
     *
     * @return
     */
    public String getFirst() {
        if (multiple.isEmpty()) return "";
        return (String) multiple.firstKey();
    }

    /**
     * Returns the subscript of the last element in the multiple
     *
     * @return
     */
    public String getLast() {
        if (multiple.isEmpty()) return "";
        return (String) multiple.lastKey();
    }

    public Map<String, Object> toMap() {
        Stack<Map<String, Object>> mapStack = new Stack<Map<String, Object>>();
        mapStack.push(new HashMap<String, Object>());

        for (String s = order("", 1); !s.equals(""); s = order(s, 1)) {
            String[] keys = s.split(",");
            for (int i = 0; i < keys.length; i++) {
                String key = keys[i];
                if (key.startsWith("\"") && key.endsWith("\""))
                    key = key.substring(1, key.length() - 1);

                if (i == (keys.length - 1)) {
                    mapStack.peek().put(key, get(s));
                } else {
                    Map<String, Object> map;
                    if (mapStack.peek().containsKey(key)) {
                        map = (Map) mapStack.peek().get(key);
                    } else {
                        map = new TreeMap<String, Object>();
                        mapStack.peek().put(key, map);
                    }
                    mapStack.push(map);
                }
            }
            for (int i = 0; i < keys.length - 1; i++) {
                mapStack.pop();
            }
        }
        // traverse nested maps and convert those whose keys are all numeric into lists
        Map<String, Object> m = (Map<String, Object>) traverseAndConvertNestedMapsWithNumericKeysToLists(mapStack.pop(), true);
        return m;
    }

    private Object traverseAndConvertNestedMapsWithNumericKeysToLists(Map<String, Object> m, boolean root) {
        boolean canConvert = canConvertToList(m);
        for (Map.Entry<String, Object> entry : m.entrySet()) {
            if (entry.getValue() instanceof Map) {
                entry.setValue(traverseAndConvertNestedMapsWithNumericKeysToLists((Map) entry.getValue(), false));
            }
        }
        if (root || !canConvert) return Collections.unmodifiableMap(m);

        List list = new ArrayList(m.size());
        for (int i = 0; i < m.size(); i++) {
            list.add(m.get(Integer.toString(i)));
        }
        return Collections.unmodifiableList(list);
    }

    private boolean canConvertToList(Map<String, Object> map) {
        Set<Integer> indices = new HashSet<Integer>();
        for (String key : map.keySet()) {
            try {
                indices.add(Integer.decode(key));
            } catch (NumberFormatException e) {
                return false;
            }
        }
        // check that indices are 0-based and contiguous
        for (int i = 0; i < indices.size(); i++) {
            if (!indices.contains(i)) return false;
        }
        return true;
    }

    @JsonValue
    public JsonNode toJsonNode() {
        return jsonMapper.convertValue(toMap(), JsonNode.class);
    }

// TODO: not sure if we sort by key or by value here - guessing key
//    public boolean isSorted() {
//        return sorted;
//    }
//
//    public void setSorted(boolean sorted) {
//        this.sorted = sorted;
//    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Mult mult = (Mult) o;

        if (multiple != null ? !multiple.equals(mult.multiple) : mult.multiple != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return multiple != null ? multiple.hashCode() : 0;
    }

    public static Mult create(Map map) {
        Mult mult = new Mult();
        mult.add(map);
        return mult;
    }

    public static Mult create(List list) {
        Mult mult = new Mult();
        mult.add(list);
        return mult;
    }

    public static Mult create(JsonNode json) {
        Mult mult = new Mult();
        mult.add(json);
        return mult;
    }
}