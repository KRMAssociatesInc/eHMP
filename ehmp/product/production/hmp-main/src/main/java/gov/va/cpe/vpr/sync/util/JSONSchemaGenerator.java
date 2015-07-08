package gov.va.cpe.vpr.sync.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import java.io.IOException;
import java.io.Writer;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.commons.lang.StringEscapeUtils;

/**
 * TODO: Are there cases where a field is not always the same type (array, object, value)?
 * @author brian
 */
public class JSONSchemaGenerator {
	private Map<String, FieldInfo> fields = new TreeMap<>();
	private AtomicInteger msgCount = new AtomicInteger();
	private String name;
	
	private static class FieldInfo {
		String name;
		AtomicInteger count = new AtomicInteger();
		Map<String, Integer> values = new HashMap<>();
		int valLenMin = Integer.MAX_VALUE, valLenMax = Integer.MIN_VALUE;
		int cardMin = Integer.MAX_VALUE, cardMax = Integer.MIN_VALUE, cardTot = 0;

		public FieldInfo(String name) {
			this.name = name;
		}
		
		public synchronized void addValue(String val) {
			int count = 0;
			if (values.containsKey(val)) {
				count = values.get(val);
			}
			values.put(val, ++count);
			
			// min/max length
			valLenMin = Math.min(valLenMin, val.length());
			valLenMax = Math.max(valLenMax, val.length());
		}
	}
	
	public JSONSchemaGenerator(String name) {
		this.name = name;
	}

	public void eval(JsonNode msg) {
		msgCount.incrementAndGet();
		evalFieldCounts("", msg);
	}
	
	private synchronized FieldInfo getInfo(String field) {
		if (!fields.containsKey(field)) {
			fields.put(field, new FieldInfo(field));
		}
		return fields.get(field);
	}
	
	private void evalFieldCounts(String prefix, JsonNode msg) {
		Iterator<Entry<String, JsonNode>> itr = msg.fields();
		
		while (itr.hasNext()) {
			Entry<String, JsonNode> field = itr.next();
			String key = prefix + field.getKey();
			String val = field.getValue().asText();
			FieldInfo info = getInfo(key);
			
			// increment field count
			info.count.incrementAndGet();
			
			// recursively follow subnodes and skip the value counting
			if (field.getValue().isArray()) {
				ArrayNode ary = (ArrayNode) field.getValue();
				
				// record cardinality
				info.cardTot += ary.size();
				info.cardMin = Math.min(info.cardMin, ary.size());
				info.cardMax = Math.max(info.cardMax, ary.size());
				
				// then process each element as a sub-object
				for (int i=0; i < ary.size(); i++) {
					evalFieldCounts(key + "[*].", ary.get(i));
				}
				continue;
			} else if (field.getValue().isObject()) {
				evalFieldCounts(key + ".", field.getValue());
				continue;
			}
			
			// unique value count
			info.addValue(val);
		}
	}
	
	public static void writeCSVHeader(Writer writer) throws IOException {
		writer.write("\n\ndomain,field,fieldCount,msgCount,occurrance pct,cardinality tot,cardinality min, cardinality max,cardinality avg,");
		writer.write("values max(length),values min(length), values count(unique),");
		writer.write("top1,top1 count,top2,top2 count,top3,top3 count,top4,top4 count,top5,top5 count,");
		writer.write("bot1,bot1 count,bot2,bot2 count,bot3,bot3 count,bot4,bot4 count,bot5,bot5 count,");
	}
	
	public void writeCSVReport(Writer writer) throws IOException {
		for (String key : fields.keySet()) {
			FieldInfo info = getInfo(key);
			float pct = ((float) info.count.intValue())/msgCount.intValue()*100f;
		
			// print field, cardinality data (if any) and top-n values
			writer.write(String.format("\n%s,%s,%s,%s,%s,", name, key, info.count, msgCount, pct));
			if (info.cardTot > 0) {
				float cardAvg = ((float) info.cardTot)/msgCount.intValue();
				writer.write(String.format("%s,%s,%s,%s,", info.cardTot, info.cardMin, info.cardMax, cardAvg));
			} else {
				writer.write(",,,,");
			}
			
			// write value length (if any)
			if (!info.values.isEmpty()) {
				writer.write(String.format("%s,%s,%s,", info.valLenMin, info.valLenMax, info.values.size()));
			} else {
				writer.write(",,,");
			}
			
			// write (escaped) top5 values
			Map<String,Integer> map = sortTopN(info.values, 5);
			ArrayList<String> keys = new ArrayList<>(map.keySet());
			for (int i=0; i < 5; i++) {
				String hash = (i < keys.size()-1) ? keys.get(i) : "";
				Integer val = (i < keys.size()-1) ? map.get(hash) : null;
				StringEscapeUtils.escapeCsv(writer, textFilter(hash));
				writer.write(",");
				if (val != null) writer.write(val+"");
				writer.write(",");
			}
			
			// write (escaped) bottom 5 values
			map = sortTopN(info.values, -5);
			keys = new ArrayList<>(map.keySet());
			for (int i=0; i < 5; i++) {
				String hash = (i < keys.size()-1) ? keys.get(i) : "";
				Integer val = (i < keys.size()-1) ? map.get(hash) : null;
				StringEscapeUtils.escapeCsv(writer, textFilter(hash));
				writer.write(",");
				if (val != null) writer.write(val + "");
				writer.write(",");
			}
		}
	}
	
	public void printReport(Writer writer) throws IOException {
		for (String key : fields.keySet()) {
			FieldInfo info = getInfo(key);
			float pct = ((float) info.count.intValue())/msgCount.intValue()*100f;
			
			// print field, cardinality data (if any) and top-n values
			writer.write(String.format("\nField: %s (%s/%s=%f%%)\n", key, info.count, msgCount, pct));
			if (info.cardTot > 0) {
				float cardAvg = ((float) info.cardTot)/msgCount.intValue();
				writer.write(String.format("\n\tCardinality (tot/min/max/avg): %s/%s/%s/%s\n", info.cardTot, info.cardMin, info.cardMax, cardAvg));
			}
			if (!info.values.isEmpty()) {
				writer.write(String.format("\tValues: (min(length)-max(length)/count(unique)): %s-%s/%s\n", info.valLenMin, info.valLenMax, info.values.size()));
			}
			Map<String,Integer> map = sortTopN(info.values, 5);
			writer.write(String.format("\n\tTop 5 Values: (count)"));
			for (String hash : map.keySet()) {
				writer.write(String.format("\n\t\t%s (%s)\n", textFilter(hash), map.get(hash)));
			}
			map = sortTopN(info.values, -5);
			writer.write(String.format("\n\tBottom 5 Values: (count)"));
			for (String hash : map.keySet()) {
				writer.write(String.format("\n\t\t%s (%s)\n", textFilter(hash), map.get(hash)));
			}
			
		}
	}
	
	private static String textFilter(String text) {
		if (text == null) return null;
		if (text.contains("\n")) return text.substring(0, text.indexOf("\n")-1) + "[...]";
		if (text.contains("\r")) return text.substring(0, text.indexOf("\r")-1) + "[...]";
		return text;
	}
	
	
	private static Map<String,Integer> sortTopN(Map<String,Integer> map, int n) {
		Map<String,Integer> ret = new TreeMap<>();
		if (map == null) return ret;
		
		List<Integer> vals = new ArrayList<>(map.values());
		Collections.sort(vals);
		Collections.reverse(vals);
		
		if (n >= 0 && n < vals.size()) {
			vals = vals.subList(0, n);
		} else if (n <= -1 && (n*-1) < vals.size()) {
			vals = vals.subList(vals.size()-1+n, vals.size());
		}
		
		if (map.size() > 0 && vals.size() > 0) {
			int min=vals.get(vals.size()-1);
			for (String key : map.keySet()) {
				int val = map.get(key);
				if (val >= min) {
					ret.put(key, val);
				}
				if (ret.size() >= Math.abs(n)) break;
			}
		}
		return ret;
	}
}
