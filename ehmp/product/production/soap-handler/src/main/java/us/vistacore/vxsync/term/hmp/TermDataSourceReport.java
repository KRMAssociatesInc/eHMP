package us.vistacore.vxsync.term.hmp;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintStream;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class TermDataSourceReport {
	// data sources/outputs
	private H2TermDataSource src;
	private Set<String> sabs = new HashSet<>();
	private Map<String, List<String>> disp = null;
	private PrintStream output = new PrintStream(System.out);
	
	// total/min/max counts
	private int totKBytes=0,totCount=0,totSkipped=0,totTerms=0,totPar=0,totAnc=0,totSyn=0,totRel=0;
	private int maxTerms=0,maxPar=0,maxAnc=0,maxSyn=0,maxRel=0;
	private int minTerms=Integer.MAX_VALUE, minPar=Integer.MAX_VALUE,minAnc=Integer.MAX_VALUE,minSyn=Integer.MAX_VALUE,minRel=Integer.MAX_VALUE;
	private int noTerms=0, noPar=0, noAnc=0, noSyn=0, noRel=0;
	
	// key counts
	private Map<String,AtomicInteger> relCount = new HashMap<>();
	private Map<String,AtomicInteger> ttyCount = new HashMap<>();
	private Map<String,AtomicInteger> attrCount = new HashMap<>();
	private Map<String,AtomicInteger> miscCount = new HashMap<>();
	private Map<String,AtomicInteger> ancCount = new HashMap<>();
	
	public TermDataSourceReport(H2TermDataSource src, Map<String,String> params) throws FileNotFoundException {
		this.src = src;
		
		// enables the dump tracking if param is found
		if (params.containsKey("--dump")) this.disp = new HashMap<>(); 
		
		if (params.containsKey("-f")) {
			this.output = new PrintStream(params.get("-f"));
		}
	}
	
	@SuppressWarnings("unchecked")
	public void analyze(String sab) {
		// setup for analysis loop
		sabs.add(sab);
		Iterator<String> itr = src.iterator();

		// loop through each concept in the database
		while (itr.hasNext()) {
			String urn = itr.next();
			// if it is not part of a namespace we care about, skip it
			if (!urn.startsWith("urn:"+sab.toLowerCase()+":")) {
				totSkipped++;
				continue;
			}

			// get the main data for the concept
			String json = src.getConceptJSON(urn);
			Map<String,Object> data = src.getConceptData(urn);
			
			// get terms/sets/attributes, remove them so we can find other stuff
			List<Map<String,String>> terms = (List<Map<String, String>>) data.remove("terms");
			Set<String> pars = (Set<String>) data.remove("parents");
			Set<String> ancs = (Set<String>) data.remove("ancestors");
			Set<String> syns = (Set<String>) data.remove("sameas");
			Map<String,Set<String>> rels = (Map<String, Set<String>>) data.remove("rels");
			Map<String, Object> attrs = (Map<String, Object>) data.remove("attributes");
			if (terms == null) terms = new ArrayList<>();
			if (pars == null) pars = new HashSet<>();
			if (ancs == null) ancs = new HashSet<>();
			if (syns == null) syns = new HashSet<>();
			if (rels == null) rels = new HashMap<>();
			if (attrs == null) attrs = new HashMap<>();
			
			// track max counts
			if (pars.size() > maxPar) disp(disp, "maxPar", urn, maxPar=pars.size());
			if (ancs.size() > maxAnc) disp(disp, "maxAnc", urn, maxAnc=ancs.size());
			if (syns.size() > maxSyn) disp(disp, "maxSyn", urn, maxSyn=syns.size());
			if (rels.size() > maxRel) disp(disp, "maxRel", urn, maxRel=rels.size());
			if (terms.size() > maxTerms) disp(disp, "maxTerms", urn, maxTerms=terms.size());
			
			// track min counts
			if (pars.size() < minPar) disp(disp, "minPar", urn, minPar=pars.size());
			if (ancs.size() < minAnc) disp(disp, "minAnc", urn, minAnc=ancs.size());
			if (syns.size() < minSyn) disp(disp, "minSyn", urn, minSyn=syns.size());
			if (rels.size() < minRel) disp(disp, "minRel", urn, minRel=rels.size());
			if (terms.size() < minTerms) disp(disp, "minTerms", urn, minTerms=terms.size());
			
			// keep track of how many have no sets
			if (pars.isEmpty()) disp(disp, "noPar", urn, noPar++);
			if (ancs.isEmpty()) disp(disp, "noAnc", urn, noAnc++);
			if (syns.isEmpty()) disp(disp, "noSyn", urn, noSyn++);
			if (rels.isEmpty()) disp(disp, "noRel", urn, noRel++);
			if (terms.isEmpty()) disp(disp, "noTerms", urn, noTerms++);
			
			// keep track of the total count/bytes
			totPar += pars.size();
			totAnc += ancs.size();
			totSyn += syns.size();
			totRel += rels.size();
			totTerms += terms.size();
			totKBytes += Math.round(json.getBytes().length/1024);
			
			// count the # and type of terms
			for (Map<String,String> term : terms) {
				String tty = term.get("tty");
				if (!ttyCount.containsKey(tty)) ttyCount.put(tty, new AtomicInteger(0));
				ttyCount.get(tty).incrementAndGet();
			}
			
			// count the # and type of rels
			for (String key : rels.keySet()) {
				for (String key2 : rels.get(key)) {
					if (!relCount.containsKey(key2)) relCount.put(key2, new AtomicInteger(0));
					relCount.get(key2).incrementAndGet();
				}
			}
			
			// count the occurrance of ancestors
			for (String key : ancs) {
				if (!ancCount.containsKey(key)) ancCount.put(key, new AtomicInteger(0));
				ancCount.get(key).incrementAndGet();
			}
			
			// track attributes
			for (String key : attrs.keySet()) {
				if (!attrCount.containsKey(key)) attrCount.put(key, new AtomicInteger(0));
				attrCount.get(key).incrementAndGet();
			}
			
			// track any other fields/keys no already removed
			for (String key : data.keySet()) {
				if (!miscCount.containsKey(key)) miscCount.put(key, new AtomicInteger(0));
				miscCount.get(key).incrementAndGet();
			}
			
			// print progress
			if (++totCount % 5000 == 0) {
				System.out.printf("Done: %s\n", totCount);
			}
		}
	}
	
	public void report() {

		// compute some averages
		int yesPar = (totCount-noPar), yesAnc=(totCount-noAnc), yesSyn=(totCount-noSyn), yesRel=(totCount-noRel);
		float avgPar = div(totPar, totCount), avgAnc = div(totAnc, totCount), avgSyn = div(totSyn, totCount), avgRel = div(totRel, totCount);
		float avgPar2 = div(totPar, yesPar), avgAnc2 = div(totAnc, yesAnc), avgSyn2 = div(totSyn, yesSyn), avgRel2 = div(totRel, yesRel);
		float avgTerms = div(totTerms, totCount);
		
		// print the results
		String line = "%s,%d,%d,%d,%2.5f,%2.5f,%d,%d\n";
		output.printf("Date: %s\n", new Date());
		output.printf("SABs/JDBC: %s/%s\n", sabs, src.getHealthCheckName());
		output.printf("Total Recs (Processed/Skipped/KBytes/Avg): %d/%d/%d/%2.5fkb\n", totCount, totSkipped, totKBytes, div(totKBytes, totCount));
		
		output.printf("Metric,total,min,max,avg(tot),avg(count>0),count<=0,count>=1\n");
		output.printf(line, "Terms", totTerms, minTerms, maxTerms, avgTerms, avgTerms, noTerms, -1);
		output.printf(line, "Parents", totPar, minPar, maxPar, avgPar, avgPar2, noPar, yesPar);
		output.printf(line, "Ancestors", totAnc, minAnc, maxAnc, avgAnc, avgAnc2, noAnc, yesAnc);
		output.printf(line, "Sameas", totSyn, minSyn, maxSyn, avgSyn, avgSyn2, noSyn, yesSyn);
		output.printf(line, "Rels", totRel, minRel, maxRel, avgRel, avgRel2, noRel, yesRel);
		
		// print tty and relstr types
		output.println("\nTerms by TTY:");
		for (String key : sortMapVals(ttyCount, -1, ATOMIC_INT_COMPARE).keySet()) {
			output.printf("%s,%d\n", key, ttyCount.get(key).intValue());
		}
		output.println("\nRels by RELSTR:");
		for (String key : sortMapVals(relCount, -1, ATOMIC_INT_COMPARE).keySet()) {
			output.printf("%s,%d\n", key, relCount.get(key).intValue());
		}
		output.println("\nAttrs:");
		for (String key : sortMapVals(attrCount, -1, ATOMIC_INT_COMPARE).keySet()) {
			output.printf("%s,%d\n", key, attrCount.get(key).intValue());
		}
		output.println("\nMisc Keys/Count:");
		for (String key : sortMapVals(miscCount, -1, ATOMIC_INT_COMPARE).keySet()) {
			output.printf("%s,%d\n", key, miscCount.get(key).intValue());
		}
		output.println("\nTop 10 Ancestor Keys/Count:");
		for (String key : sortMapVals(ancCount, 10, ATOMIC_INT_COMPARE).keySet()) {
			output.printf("%s,%d\n", key, ancCount.get(key).intValue());
		}

	}
	
	public void dump() {
		// print up to 5 records of interest per category
		if (disp != null) {
			for (String key : disp.keySet()) {
				List<String> set = disp.get(key);
				if (set == null) continue;
				
				// print the heading, loop backwards and display last 5
				output.printf("\n%s (%d)\n", key, set.size());
				for (int i=set.size()-1; i >= 0 && i >= set.size()-5 ; i--) {
					String urn = set.get(i);
					output.printf("%s,%s\n", urn, src.getConceptJSON(urn));
				}
			}
		}
	}
	
	/* track records of interest per category */
	private static int disp(Map<String, List<String>> disp, String key, String urn, int val) {
		if (disp == null) return val; // skip
		if (!disp.containsKey(key)) {
			disp.put(key, new ArrayList<String>());
		}
		disp.get(key).add(urn);
		return val;
	}
	
	/* safe divide (prevent divide by zero error) */
	private static float div(int x, int y) {
		if (y == 0) return -1;
		return x/y;
	}
	
	public static <K,V> Map<K, V> sortMapVals(Map<K, V> map, int max, final Comparator<V> comp) {
        List<Map.Entry<K,V>> list = new LinkedList<>(map.entrySet());

        // sort list based on comparator
        Collections.sort(list, new Comparator<Map.Entry<K, V>>() {
            public int compare(Map.Entry<K,V> o1, Map.Entry<K, V> o2) {
            	return comp.compare(o1.getValue(), o2.getValue());
            }
        });

        // put sorted list into map again
        Map<K, V> sortedMap = new LinkedHashMap<>();
        for (Map.Entry<K,V> entry : list) {
            sortedMap.put(entry.getKey(), entry.getValue());
            if (max > 0 && sortedMap.size() >= max) {
            	break; // skip if we hit the max
            }
        }
        return sortedMap;
	}
	
	public static Comparator<AtomicInteger> ATOMIC_INT_COMPARE = new Comparator<AtomicInteger>() {

		@Override
		public int compare(AtomicInteger o1, AtomicInteger o2) {
			Integer i1 = new Integer(o1.intValue());
			Integer i2 = new Integer(o2.intValue());
			
			return i2.compareTo(i1);
		}
	};

	/**
	 * Simple program to crawl all the entries in a H2TermDataSource and generate
	 * a report on what is seen.  Help in finding border cases where some concept has a crazy
	 * number of relations, etc.
	 * 
	 * TODO: Expand this to include a histogram of counts?
	 * TODO: Find concepts with terms with non-identical CUI's
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IOException 
	 */
	public static void main(String[] args) throws SQLException, ClassNotFoundException, IOException {
		// parse the command line parameters
		if (args.length < 2) {
			System.err.println("Usage: TermDataSourceReport <sab> <jdbcurl> [options]");
			System.err.println("\tOptions:");
			System.err.println("\t\t-f <file>\tReport to this file instead of STDOUT");
			System.err.println("\t\t--dump\tDump extended info (can be very large)");
			return;
		}
		String sab = args[0], url = args[1];
		
		// parse args
		Map<String,String> params = new HashMap<>();
		for (int i=2; i < args.length; i++) {
			String next = (args.length > i+1) ? args[i+1] : null;
			if (next != null && next.startsWith("-")) next = null;
			if (args[i].startsWith("-")) {
				params.put(args[i].toLowerCase(), next);
			}
			if (next != null) i++; // we used it, skip the next
		}
		System.out.println("Params: " + params);
		
		// open the source and iterator
		H2TermDataSource src = new H2TermDataSource(url);
		if (!src.isAlive()) {
			System.err.printf("JDBC: %s is unresponsive", url);
			return;
		}
		
		// do the analysis and then report on it, optionally dump extra data
		TermDataSourceReport report = new TermDataSourceReport(src, params);
		report.analyze(sab);
		report.report();
		report.dump();
		
		// done, cleanup
		src.close();	
	}
}
