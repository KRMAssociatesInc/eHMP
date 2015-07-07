package us.vistacore.vxsync.term.load.hmp;


import org.h2.mvstore.MVStore;

import us.vistacore.vxsync.term.hmp.AbstractTermDataSource;
import us.vistacore.vxsync.term.hmp.H2TermDataSource;
import us.vistacore.vxsync.term.hmp.LuceneSearchDataSource;
import us.vistacore.vxsync.term.hmp.TermDataSourceReport;
import us.vistacore.vxsync.term.hmp.TermEng;
import us.vistacore.vxsync.term.hmp.UMLSBuildPolicy;
import us.vistacore.vxsync.term.hmp.UMLSBuildPolicy.RowMatcher;

import java.io.*;
import java.sql.SQLException;
import java.util.*;

/**
 * This is a TermEng datasource that can read directly from UMLS rich release format files (.RRF)
 * 
 * It is insanely slow, disk intensive and a memory hog.
 * 
 * Its really only intended to be run once to build the data structures which are then
 * stored somewhere more efficiently (like H2/Cache/Etc.)
 * 
 * It works by scanning through the .RRF files and organizing all the data into some very large
 * ehcache stores. 
 *   
 * Make sure that it can have at least 1GB of memory per major source.
 * 
 * Intentions:
 * - Remove the need for the umls-import-tools sub-project
 * - be able to generate cache globals as well as H2 db output.
 * - I'm also hoping to include full-text searching into the H2 dbs, so that we can do better searching 
 * 
 * TODO: Include semantic type list? (from MRSTY.RRF)
 * @author brian
 */
public class UMLSRRFDataSource extends AbstractTermDataSource {
	
	private static final String NS_MAP = "^TERMDB(\"namespace\",\"%s\")\n%s\n";
	private static final String KEY_VAL = "^TERMDB(\"%s\",\"%s\",\"%s\")\n%s\n";
	private static final String KEY_IDX_VAL = "^TERMDB(\"%s\",\"%s\",\"%s\",%s)\n%s\n";
	
	private File metaDir;
	private HashSet<String> sabs;
	private boolean skipLoad = false;
	
	// metadata holders
	private Map<String, Integer> filerows = new HashMap<String, Integer>();
	private Map<String,Map<String, Integer>> sabttyrank = new HashMap<String, Map<String, Integer>>();
	
	// file parsers
	private MRCONSORowHandler MRCONSOHandler;
	private MRSATRowHandler MRSATHandler;
	private MRRELRowHandler MRRELHandler;
	
	// disk-based caches
	public static String TMP_DIR = System.getProperty("java.io.tmpdir");
	private CacheMgr<String> auitournmap;
	private CacheMgr<List<Map<String, String>>> mrconso;
	private CacheMgr<Map<String, Object>> mrsat;
	private CacheMgr<Map<String, Set<String>>> mrrel;
	
	/**
	 * @param metaDir directory containing .RRF files
	 * @param tmpDir directory containing temporary files
	 * @param loadVerbose Show status/progress in console
	 * @param skipLoad if true, assumes that the CacheMgr is full of the data, no need to rescan RRF.
	 * This is a shortcut to just doing the H2 write/index part.
	 * @param sabs Which SAB's we are interested in.
	 * @throws IOException
	 */
	public UMLSRRFDataSource(File metaDir, String tmpDir, boolean loadVerbose, List<String> sabs) throws IOException {
		this.metaDir = metaDir;
		this.sabs = new HashSet<String>(sabs);
		init((tmpDir==null) ? TMP_DIR : tmpDir);
		MRCONSOHandler = new MRCONSORowHandler(loadVerbose, sabs);
		MRSATHandler = new MRSATRowHandler(loadVerbose, sabs);
		MRRELHandler = new MRRELRowHandler(loadVerbose, sabs);
		
		// clear old data and load new data
		clear();
		load(loadVerbose);
	}
	
	// load/inialization methods ----------------------------------------------
	
	/** Initalize MVStores */
	protected void init(String tmpDir) {
		// MVStore caches, be sure to disable background thread as its causing some concurrency problems.
		// also storing the data in 3 seperate files to reduce overall file size
		String f1 = new File(tmpDir, "/umls_mrconso.cache").getAbsolutePath();
		String f2 = new File(tmpDir, "/umls_mrsat.cache").getAbsolutePath();
		String f3 = new File(tmpDir, "/umls_mrrel.cache").getAbsolutePath();
		MVStore s1 = new MVStore.Builder().fileName(f1).autoCommitDisabled().compress().open();
		MVStore s2 = new MVStore.Builder().fileName(f2).autoCommitDisabled().compress().open();
		MVStore s3 = new MVStore.Builder().fileName(f3).autoCommitDisabled().compress().open();
		
		// CacheMgrs must have unique names.  To permits > 1 instance to 
		// exist simultaniously (for unit tests) use unique hash as a suffix
		auitournmap = new CacheMgr<String>("auitournmap"+this.hashCode(), s1);
		mrconso = new CacheMgr<>("mrconso"+this.hashCode(), s1);
		mrsat = new CacheMgr<>("mrsat"+this.hashCode(), s2);
		mrrel = new CacheMgr<>("mrrel"+this.hashCode(), s3);
	}
	
	/* remove all the temporary data */
	protected void clear() {
		if (skipLoad) return;
		
		// clear the caches
		auitournmap.removeAll();
		auitournmap.flush();
		mrconso.removeAll();
		mrconso.flush();
		mrsat.removeAll();
		mrsat.flush();
		mrrel.removeAll();
		mrrel.flush();
	}

	/** close the temporary files */
	@Override
	public void close() {
		auitournmap.close();
		mrconso.close();
		mrsat.close();
		mrrel.close();
	}
	
	protected void load(boolean verbose) throws IOException {
		// load metadata
		new MRFilesRowHandler(verbose).parseFile(new File(metaDir, "MRFILES.RRF"), 0, 10000);
		new MRRankRowHandler(verbose).parseFile(new File(metaDir, "MRRANK.RRF"), 0, 10000);
		
		// load/parse the files
		if (skipLoad) return;
		MRCONSOHandler.parseFile(new File(metaDir, "MRCONSO.RRF"), 0, 50000);
		MRSATHandler.parseFile(new File(metaDir, "MRSAT.RRF"), 0, 50000);
		MRRELHandler.parseFile(new File(metaDir, "MRREL.RRF"), 0, 50000);
	}
	
	// ITermDataSource implementation -----------------------------------------
	
	@Override
	public Set<String> getCodeSystemList() {
		return sabs;
	}

	@Override
	public Map<String, Object> getCodeSystemMap() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public Iterator<String> iterator() {
		return mrconso.iterator();
	}
	
	/** primarily here so you can override this in test cases */
	protected String resolveAUI2URN(String aui) {
		return auitournmap.fetch(aui);
	}
	
	/**
	 * This ends up dictating how the UMLS data gets represented in the TermEng.
	 */
	@Override
	public Map<String, Object> getConceptData(String urn) {
		List<Map<String, String>> terms = mrconso.fetch(urn);
		if (terms == null) return null;
		Map<String, Object> attrs = mrsat.fetch(urn);
		Collections.sort(terms, MRCONSOHandler);
		String code = TermEng.parseCode(urn), sab = TermEng.parseCodeSystem(urn); 
		HashMap<String, Object> ret = new HashMap<String, Object>();
		UMLSBuildPolicy policy = UMLSBuildPolicy.getPolicy(sab);
		
		// main properties
		ret.put("urn", urn);
		ret.put("code", code);
		ret.put("codeSystem", sab);
		ret.put("description", terms.get(0).get("str"));
		ret.put("aui", terms.get(0).get("aui"));
		ret.put("cui", terms.get(0).get("cui"));
		
		// attributes/terms
		if (attrs != null) ret.put("attributes", attrs);
		ret.put("terms", terms);

		// sets: (can be customized by policy) 
		// parents holds non-recursive parent rels,  
		// ancestors holds recursive parent rels, 
		// sameas is holds recursive synonymous rels,
		ret.put("ancestors", fetchRelationMap(urn, policy.getParentMatcher(), new HashSet<String>()).keySet());
		ret.put("parents", fetchRelationMap(urn, policy.getParentMatcher()).keySet());
		Set<String> sameas = fetchRelationMap(urn, policy.getSynonymMatcher(), new HashSet<String>()).keySet();
		sameas.remove(urn);
		ret.put("sameas", sameas);
		
		// rels holds all relationships (not just the set, includes relationship specifications)
		ret.put("rels", policy.buildRelsMap(this, urn));
		return ret;
	}
	
	// static main method + helpers -------------------------------------------
	
	public static void main(String[] args) throws IOException, SQLException, ClassNotFoundException {
		if (args.length < 3) {
			System.err.println("Usage: UMLSRRFDataSource <UMLS .RRF directory> <dest H2 jdbc url> <SAB1> <SAB2> <SAB3>....");
			System.err.println("Options:");
			System.err.println("\t--FTS generate full-text indexes");
			System.err.println("\t--GOF <dbname>\tAlso dump a .GOF file (cache global file) ");
			System.err.println("\t--SKIP-RRF-SCAN skip the .RRF file scan and just rebuild the H2 DB");
			return;
		}
		
		// parse options
		File dir = new File(args[0]);
		String jdbc = args[1];
		List<String> sabs = new ArrayList<String>();
		String exportGOF = null;
		boolean doFTS = false; // true to create full text search index in output H2 db
		boolean skipRRFScan = false; // true to shortcut RRF scanning
		boolean buildReport = false; // true to build report after RRF scan
		for (int i=2; i < args.length; i++) {
			if (args[i].startsWith("--GOF")) {
				exportGOF = args[++i];
			} else if (args[i].equalsIgnoreCase("--FTS")) {
				doFTS = true;
			} else if (args[i].equalsIgnoreCase("--SKIP-RRF-SCAN")) {
				skipRRFScan = true;
			} else if (args[i].equalsIgnoreCase("--BUILD-REPORT")) {
				buildReport = true;
			} else {
				sabs.add(args[i]);
			}
		}
		
		File[] files = dir.listFiles(new FilenameFilter() {
			@Override
			public boolean accept(File dir, String name) {
				return name.endsWith(".RRF");
			}
		});
		System.out.println("Source Dir: " + dir + " (File Count: " + ((files != null) ? files.length : 0) + ")");
		System.out.println("Dest DB: " + jdbc);
		System.out.println("SAB List: " + sabs);
		
		// setup the src and dest connections
		H2TermDataSource dest = new H2TermDataSource(args[1]);
		UMLSRRFDataSource src = new UMLSRRFDataSource(dir, null, true, sabs);
		src.skipLoad = skipRRFScan;
		
		System.out.println("Done Parsing UMLS Files:");
		System.out.println("Unique AUIs:" + src.auitournmap.getSize());
		System.out.println("Concepts (URN's): " + src.mrconso.getSize());
		System.out.println("RELs Count:" + src.mrrel.getSize());
		if (exportGOF != null) System.out.println("OPTION: WRITING .GOF FILE: " + exportGOF);
		if (skipRRFScan) System.out.println("OPTION: SKIPPING .RRF FILE SCAN(S)....");
		if (doFTS) System.out.println("OPTION: BUILDING FULL TEXT SEARCH INDEX IN OUTPUT DB....");
		
		// now build the complete concept node and write it to the H2 db
		System.out.println("Prepping to write H2DB....");
		
		// Warning if there are already concepts in here...
		int size = dest.size();
		if (size > 0) {
			System.out.println("WARNING: Found " + size + " records.  Rebuilding a non-empty database will be VERY slow!");
		}
		
		StringBuilder sb = new StringBuilder();
		int count=0;
		int total = src.mrconso.getSize();
		Iterator<String> itr = src.iterator();
		long lastStatusDTM = 0;
		int lastRowCount=0;
		
		// open the .GOF writer if specified and write the header
		try (BufferedWriter fw = (exportGOF != null) ? new BufferedWriter(new FileWriter(new File(dir, exportGOF + ".gof"))) : null) {
			if (fw != null) {
				// write file header info
				sb.append("Export of 1 global from Namespace JSONVPR~Format=5.S~\n");
				sb.append("04 Feb 2013   4:37 PM   Cache\n");
			}
			while(itr.hasNext()) {
				count++;
				
				// fetch all the data and write it to H2 (if its in the requested SAB's)
				String urn = itr.next();
				if (urn == null) continue; // not sure why its null
				String sab = TermEng.parseCodeSystem(urn);
				if (!src.sabs.contains(sab)) continue; // skip
				Map<String, Object> data = src.getConceptData(urn);
				dest.save(data);
				
				// also write to GOF file (if configured)
				if (exportGOF != null) {
					sb.append(src.mapToGlobal(urn, exportGOF));
				}
				
				// show status periodically
				if ((System.currentTimeMillis() - lastStatusDTM) > 1000) {
					lastStatusDTM = System.currentTimeMillis();
					showH2Status(count, total, (count-lastRowCount));
					lastRowCount=count;
					
					// commit/flush periodically
					dest.commit();
					if (exportGOF != null && fw != null) {
						fw.write(sb.toString());
						fw.flush();
						sb = new StringBuilder();
					}
				}
			}
			
			// close/flush the .GOF writer 
			if (fw != null) {
				fw.write(sb.toString());
				fw.write("\n\n");
			}
		} finally {
			dest.commit();
			showH2Status(count, total, (count-lastRowCount));
		}
		
		if (doFTS) {
			System.out.println("Building Luene FTS....");
			File luceneDir = new File(getFileFromJDBC(jdbc).getParentFile(), "lucene");
			LuceneSearchDataSource idx = new LuceneSearchDataSource(luceneDir.getAbsolutePath());
			idx.buildIndexFrom(src);
			idx.close();
		}
		if (buildReport) {
			for (String sab : sabs) {
				Map<String,String> params = new HashMap<>();
				params.put("-f", new File(dir, "report." + sab + ".csv").getAbsolutePath());
				params.put("--dump", null);
				TermDataSourceReport reporter = new TermDataSourceReport(dest, params);
				System.out.printf("Building %s Report....", sab);
				reporter.analyze(sab);
				reporter.report();
				
			}
		}
		
		// cleanup/shutdown
		src.clear();
		dest.close();
		CacheMgr.getEHCacheManager().shutdown();
		System.out.println("Completed Building H2 DB: " + jdbc);
	}

	private static void showH2Status(int count, int total, int diff) {
		int pct = Math.round((float) count / (float) total * 100f);  
		System.out.println(String.format("Writing H2DB... %7s/%s records complete (%2s%% complete; %4s/sec)", count, total, pct, diff));
	}
	
	/** tries to derive the host/path/file from the H2 jdbc url */
	private static File getFileFromJDBC(String jdbc) {
		String ret = jdbc;
		if (ret.indexOf(";") > 0) {
			ret = ret.substring(0, ret.indexOf(";"));
		}
		if (ret.startsWith("jdbc:h2:")) {
			ret = ret.substring(8);
		}
		return new File(ret);
	}
	
	public Map<String,Set<String>> fetchRelationMap(String urn, RowMatcher matcher, Set<String> traversedSet) {
		traversedSet.add(urn);
		Map<String,Set<String>> ret = fetchRelationMap(urn, matcher);
		Map<String,Set<String>> addl = new HashMap<>();
		for (String s : ret.keySet()) {
			if (traversedSet != null && !traversedSet.contains(s)) {;
				addl.putAll(fetchRelationMap(s, matcher, traversedSet));
			}
		}
		ret.putAll(addl);
		return ret;
	}
	
	public Map<String,Set<String>> fetchRelationMap(String urn, RowMatcher matcher) {
		Map<String, Set<String>> rels = mrrel.fetch(urn);
		Map<String, Set<String>> ret = new HashMap<>();
		if (rels != null) {
			for (String relstr : rels.keySet()) {
				for (String urn2 : rels.get(relstr)) {
					Map<String,String> map = new HashMap<>();
					map.put("URN1", urn);
					map.put("URN2", urn2);
					map.put("RELSTR", relstr);
					if (matcher.matches(map)) {
						if (!ret.containsKey(urn2)) {
							ret.put(urn2, new HashSet<String>());
						}
						ret.get(urn2).add(relstr);
					}
				}
			}
		}
		return ret;
	}
	
	private String mapToGlobal(String urn, String db) {
		StringBuilder sb = new StringBuilder();
		Map<String, Object> data = getConceptData(urn);

		// properties
		sb.append(String.format(KEY_VAL, db, urn, "urn", urn));
		sb.append(String.format(KEY_VAL, db, urn, "aui", data.get("aui")));
		sb.append(String.format(KEY_VAL, db, urn, "cui", data.get("cui")));
		sb.append(String.format(KEY_VAL, db, urn, "code", data.get("code")));
		sb.append(String.format(KEY_VAL, db, urn, "codeSystem", data.get("codeSystem")));
		sb.append(String.format(KEY_VAL, db, urn, "description", data.get("description")));

		// TODO: attributes/terms
		// ret.put("attributes", fetchAttributes(urn));
		// ret.put("terms", fetchTerms(urn));
		// ret.put("rels", fetchRelationMap(urn, "RO"));

		// sets
		Set<String> sameas = getEquivalentSet(urn);
		Set<String> parents = getParentSet(urn);
		Set<String> ancestors = getAncestorSet(urn);
		int i = 0;
		sb.append(String.format(KEY_IDX_VAL, db, urn, "sameas", i++, sameas.size()));
		for (String s : sameas) {
			sb.append(String.format(KEY_IDX_VAL, db, urn, "sameas", i++, s));
		}

		i = 0;
		sb.append(String.format(KEY_IDX_VAL, db, urn, "parents", i++, parents.size()));
		for (String s : parents) {
			sb.append(String.format(KEY_IDX_VAL, db, urn, "parents", i++, s));
		}

		i = 0;
		sb.append(String.format(KEY_IDX_VAL, db, urn, "ancestors", i++, ancestors.size()));
		for (String s : ancestors) {
			sb.append(String.format(KEY_IDX_VAL, db, urn, "ancestors", i++, s));
		}
		return sb.toString();
	}
	
	// RRF File Parsers ------------------------------------------------------- 
	
	public abstract class RowHandler {
		private boolean verbose;
		private String[] fields;
		public int rowlimit = 0;

		public RowHandler(String[] fields, boolean verbose) {
			this.fields = fields.clone();
			this.verbose = verbose;
		}

		public abstract void handle(Map<String, String> rec); 
		
		public void flush() {
			// does nothing by default
		}
		
		public void handle(String[] rec) {
			Map<String, String> ret = new HashMap<String, String>();
			for (int i=0; i < this.fields.length; i++) {
				ret.put(this.fields[i], rec[i]);
			}
			handle(ret);
		}
		
		public void parseFile(File f, int limit, int batchSize) throws IOException {
			
			// read the file line by line
			long lastStatusDTM = 0;
			int lastRowCount = 0;
			int rowsCount = 0;
			Integer totRows = filerows.get(f.getName());
			if (totRows == null) totRows = 0;
			RRFFileIterator itr = new RRFFileIterator(f);
			while (itr.hasNext() && (limit <= 0 || rowsCount <= limit)) {
				rowsCount++;
				// pass the row to the handler
				handle(itr.next());
				
				// show status every second
				if ((System.currentTimeMillis() - lastStatusDTM) > 1000) {
					lastStatusDTM = System.currentTimeMillis();
					showStatus(f.getName(), itr.getPCTComplete(), rowsCount, totRows, (rowsCount-lastRowCount));
					lastRowCount=rowsCount;
				}

				// if we reached our batch size, commit them.
				if (rowsCount % batchSize == 0) {
					flush();
//					showStatus(f.getName(), itr.getPCTComplete(), rowsCount, totRows);
				} else if (rowlimit > 0 && rowsCount >= rowlimit) {
					break; // reached limit, stop
				}
			}
			itr.close();
			flush();
			showStatus(f.getName(), itr.getPCTComplete(), rowsCount, totRows, rowsCount-lastRowCount);
		}
		
		protected void showStatus(String file, int pct, int rowsCount, int totRows, int rowsPerSec) {
			if (!this.verbose) return;
			String msg = String.format("Loading %s: %s/%s rows scanned (%2s%% complete; %6s rows/sec)", file, rowsCount, totRows, pct, rowsPerSec);
			System.out.println(msg.trim());
		}
	}
	
	public class MRFilesRowHandler extends RowHandler {

		public MRFilesRowHandler(boolean verbose) {
			super(new String[] {"FIL","DES","FMT","CLS","RWS","BTS"}, verbose);
		}

		@Override
		public void handle(Map<String, String> rec) {
			String file = rec.get("FIL");
			int rows = Integer.parseInt(rec.get("RWS"));
			filerows.put(file, rows);
		}
		
	}
	
	public class MRRankRowHandler extends RowHandler {

		public MRRankRowHandler(boolean verbose) {
			super("RANK,SAB,TTY,SUPPRESS".split(","), verbose);
		}

		@Override
		public void handle(Map<String, String> rec) {
			String sab = rec.get("SAB");
			String tty = rec.get("TTY");
			int rank = Integer.parseInt(rec.get("RANK"));
			boolean suppress = rec.get("SUPPRESS").startsWith("Y");
			
			if (!sabttyrank.containsKey(sab)) {
				sabttyrank.put(sab, new HashMap<String, Integer>());
			}
			
			Map<String, Integer> ttyrank = sabttyrank.get(sab);
			if (!suppress) {
				ttyrank.put(tty, rank);
			}			
		}
	}
	
	public class MRCONSORowHandler extends RowHandler implements Comparator<Map<String, String>> {
		private List<String> sabs;

		public MRCONSORowHandler(boolean verbose, List<String> sabs) {
			super("CUI,LAT,TS,LUI,STT,SUI,ISPREF,AUI,SAUI,SCUI,SDUI,SAB,TTY,CODE,STR,SRL,SUPPRESS".split(","), 
				verbose);
			this.sabs = sabs;
		}
		
		private Integer calcRank(String sab, String tty) {
			if (sabttyrank.containsKey(sab)) {
				return sabttyrank.get(sab).get(tty);
			}
			return null;
		}
		
		@Override
		public void handle(Map<String, String> rec) {
			String sab = rec.get("SAB");
			Integer rank = calcRank(sab, rec.get("TTY"));
			String urn = TermEng.buildURN(rec.get("CODE"), sab);

			// Store all AUI's for future reference (linking, etc.)
			// something super bizzare seems to happen if I do not wrap AUI in a new String()
			// memory seems to leak, but I despite a day of troubleshooting I cannot find the source.
			auitournmap.store(new String(rec.get("AUI")), urn);
			
			// if this is one of the SAB's we are interested in (not suppressed and in the sabs list)
			// then add the term to the concept cache
			if (rank != null && this.sabs.contains(sab)) {
				Map<String, String> term = new HashMap<String, String>();
				term.put("aui", rec.get("AUI"));
				term.put("cui", rec.get("CUI"));
				term.put("lat", rec.get("LAT"));
				term.put("tty", rec.get("TTY"));
				term.put("str", rec.get("STR"));
				term.put("rank", rank.toString());
				
//				if (!POLICY.includeTerm(rec)) return;
				
				List<Map<String,String>> terms = mrconso.fetch(urn);
				if (terms == null) {
					terms = new ArrayList<>();
				}
				terms.add(term);
				mrconso.store(new String(urn), terms);
			}
		}
		
		@Override
		public void flush() {
			mrconso.flush();
			auitournmap.flush();
		}

		@Override
		public int compare(Map<String, String> m1, Map<String, String> m2) {
			Integer r1 = Integer.parseInt(m1.get("rank"));
			Integer r2 = Integer.parseInt(m2.get("rank"));
			return r2.compareTo(r1);
		}
	}
	
	public class MRSATRowHandler extends RowHandler {
		private HashSet<String> sabs = new HashSet<String>();
		
		public MRSATRowHandler(boolean verbose, List<String> sabs) {
			super("CUI,LUI,SUI,METAUI,STYPE,CODE,ATUI,SATUI,ATN,SAB,ATV,SUPPRESS".split(","), 
				verbose);
			this.sabs.addAll(sabs);
		}
		
		@Override
		public void handle(Map<String, String> rec) {
			String sab = rec.get("SAB");
			String code = rec.get("CODE");
			String atn = rec.get("ATN");
			String atv = rec.get("ATV");
			if (!rec.get("STYPE").equals("AUI")) return;
			if (!sabs.contains(sab)) return;
			if (rec.get("SUPPRESS").startsWith("Y")) return;
			String urn = TermEng.buildURN(code, sab);
			
			Map<String, Object> attmap = mrsat.fetch(urn);
			if (attmap == null) {
				attmap = new HashMap<String, Object>();
			}
			
			if (!attmap.containsKey(atn)) {
				attmap.put(atn, atv);
			} else if (attmap.get(atn) instanceof List){
				// append to existing list
				((List)attmap.get(atn)).add(atv);
			} else {
				// must convert values to a list of 2
				List<String> l = new ArrayList<String>();
				l.add(attmap.get(atn).toString());
				l.add(atv);
				attmap.put(atn, l);
			}
			
			mrsat.store(urn, attmap);
		}
		
		@Override
		public void flush() {
			mrsat.flush();
		}
	}
	
	public class MRRELRowHandler extends RowHandler {
		private static final String KEYS = "CUI1,AUI1,STYPE1,REL,CUI2,AUI2,STYPE2,RELA,RUI,SRUI,SAB,SL,RG,DIR,SUPPRESS";
		private HashSet<String> sabs = new HashSet<String>();

		public MRRELRowHandler(boolean verbose, List<String> sabs) {
			super(KEYS.split(","), verbose);
			this.sabs.addAll(sabs);
		}

		@Override
		public void handle(Map<String, String> rec) {
			String aui1 = rec.get("AUI1");
			String aui2 = rec.get("AUI2");
			String rel = rec.get("REL");
			String sab = rec.get("SAB");
			String relstr = rel + "|";
			if (rec.containsKey("RELA")) {
				relstr += rec.get("RELA");
			}
			if (!sabs.contains(sab)) return;
			
			// resolve urns
			String urn1, urn2;
			rec.put("URN1", urn1 = resolveAUI2URN(aui1));
			rec.put("URN2", urn2 = resolveAUI2URN(aui2));
			rec.put("RELSTR", relstr);
			
			// apply policy filters
			if (!UMLSBuildPolicy.getPolicy(sab).parseRel(rec)) return;
			
			// get/create appropriate map
			Map<String, Set<String>> rels = mrrel.fetch(urn1);
			if (rels == null) rels = new HashMap<>();
			
			// add to map and store (if necessary)
			if (!rels.containsKey(relstr)) {
				rels.put(relstr, new HashSet<String>());
			}
			rels.get(relstr).add(urn2);
			mrrel.store(urn1, rels);
		}
		
		@Override
		public void flush() {
			mrrel.flush();
		}
	}
	
	public static class RRFFileIterator implements Iterator<String[]> {
		private File f;
		private BufferedReader reader;
		private String[] next;
		private long readBytes = 0;
		private long fileSize = 0;
		private long startDTM = System.currentTimeMillis();
		private RandomAccessFile raf;
		
		public RRFFileIterator(File f) throws FileNotFoundException {
			this.f = f;
			reader = new BufferedReader(new FileReader(f));
			fileSize = f.length();
			next();
		}
		
		public String readLineAtPos(long pos) throws IOException {
			if (raf == null) {
				// lazy-init
				raf = new RandomAccessFile(this.f, "r");
			}
			raf.seek(pos);
			return raf.readUTF();
		}
		
		public void close() throws IOException {
			if (raf != null) raf.close();
			reader.close();
		}
	
		@Override
		public boolean hasNext() {
			return next != null;
		}
	
		@Override
		public String[] next() {
			String[] ret = next;
			String line = null;
			try {
				line = reader.readLine();
				if (line == null) {
					// end of stream
					next = null;
				} else {
					readBytes += line.length();
					next = line.split("\\|");
				}
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
			return ret;
		}
		
		public int getPCTComplete() {
			return Math.round((float) readBytes / (float) fileSize * 100f);
		}
		
		public long getElapsedSec() {
			return (System.currentTimeMillis() - startDTM) / 1000;
		}
		
		@Override
		public void remove() {
			throw new UnsupportedOperationException();
		}
	}
}
