package gov.va.cpe.vpr.termeng;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.lucene.document.Document;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.PrefixQuery;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

public class SmartSearchTests {
	
	@Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();
	
	private static TermEng eng;
	
	@BeforeClass
	public static void setup() throws Exception {
		// setup a TermEng with the recent versions
		List<ITermDataSource> dsns = new ArrayList<>();
		File baseDir = new File(System.getProperty("user.dir"), "/data");
		for (String str : Arrays.asList("termdb-1.UMLS2013AA.20131011-drugdb")) {
			File f = new File(baseDir, str);
			String jdbcurl = "jdbc:h2:" + f.getAbsolutePath() + "/termdb;LOG=0";
			String luceneDir = f.getAbsolutePath() + "/lucene";
			H2TermDataSource h2 = new H2TermDataSource(jdbcurl);
			dsns.add(new LuceneSearchDataSource(h2, luceneDir, false));
		}
		eng = new TermEng(dsns.toArray(new ITermDataSource[0]));
	}
	
	@Test
	@Ignore
	public void test() throws Exception {
        File loincDir = tempFolder.newFolder("loinc");

		LuceneSearchDataSource tmp = new LuceneSearchDataSource(loincDir.getCanonicalPath());
		int count = tmp.searchDocs(new TermQuery(new Term("ancestor", "urn:lnc:LP15705-4"))).totalHits;
		System.out.println("Ancestors Found: " + count+ " result(s)");
		print(tmp, "urn:lnc:LP31388-9","");
		tmp.close();
	}
	
	private void print(LuceneSearchDataSource src, String urn, String prefix) {
		List<String> ret = src.search(new TermQuery(new Term("parent", urn)));
		for (String s : ret) {
			System.out.println(prefix + src.getConceptData(s));
//			print(src, s, prefix+"\t");
		}
	}
	
	@Test
	@Ignore
	public void junkTest() throws IOException, Exception, SQLException {
		String jdbcurl = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-xyz-mshdb/termdb;LOG=0";
		String luceneDir = "C:\\data\\hmp\\hmp-main\\data\\termdb-xyz-mshdb\\lucene";
		H2TermDataSource src1 = new H2TermDataSource(jdbcurl);
		
		System.out.println(src1.getConceptData("urn:msh:D011433"));
		
		jdbcurl = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-xyz2-mshdb/termdb;LOG=0";
		H2TermDataSource src2 = new H2TermDataSource(jdbcurl);
		
		for (String parent : src2.getParentSet("urn:msh:D011433")) {
			System.out.println(parent + "=" + src2.getDescription(parent) + "\n\t" + src2.getConceptData(parent).get("attributes"));
		}
	}
	
	@Test
	@Ignore
	public void testRXNFindEstradiol() throws ClassNotFoundException, SQLException, IOException {
		String jdbcurl = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-1.UMLS2013AA.20130905-drugdb/termdb;LOG=0";
		String luceneDir = "C:\\data\\hmp\\hmp-main\\data\\termdb-1.UMLS2013AA.20130905-drugdb\\lucene";
		H2TermDataSource h2 = new H2TermDataSource(jdbcurl);
		LuceneSearchDataSource src = new LuceneSearchDataSource(h2, luceneDir, false);
		
		for (String s : src.search("estradiol")) {
			System.out.println(s + ":" + src.getDescription(s));
			System.out.println("\t" + src.getConceptData(s));
		}
		
	}
	
	private static void printTree(Map<String,Object> root, int level) {
		for (String key : root.keySet()) {
			Object val = root.get(key);
			for (int i=0; i < level; i++) System.out.print("\t");
			System.out.println(key);
			if (val instanceof Map) {
				printTree((Map) val, level+1);
			}
			
		}
	}
	
	
	// NDRT may_treat testing -------------------------------------------------
	public final static String DRUG_PROPRANOLOL = "urn:ndfrt:N0000148001";
	public final static String DISEASE_FINDING = "urn:ndfrt:N0000000004"; 
	public final static String DISEASE_TACHYCARDIA = "urn:ndfrt:N0000003541";

	@Test
	@Ignore
	public void testTreatmentSuggest() throws Exception {
		String str = "tachycardia";
		BooleanQuery q = new BooleanQuery();
		q.add(new TermQuery(new Term("ancestor", DISEASE_FINDING)), BooleanClause.Occur.MUST);
		q.add(new TermQuery(new Term("sab", "ndfrt")), BooleanClause.Occur.MUST);
		q.add(new PrefixQuery(new Term("term", str)), BooleanClause.Occur.MUST);
		
		List<String> results = eng.search(q);
		assertTrue(results.contains(DISEASE_TACHYCARDIA));
		
		/* debugging output
		System.out.println(String.format("Found %s results for: %s", results.size(), str));
		for (String urn : results) {
			System.out.println("\tFOUND: " + urn + ":" + eng.getDescription(urn));
		}
		*/
		
		// build a new boolean query for finding patient drugs
		BooleanQuery drugq = new BooleanQuery();
		// get all the drugs/ingredients for tachycardia
		Map<String,Set<String>> rels = eng.getRelMap(DISEASE_TACHYCARDIA); 
		for (String urn : rels.keySet()) {
			Set<String> relset = rels.get(urn);
			if (!relset.contains("RO|may_treat")) continue;
			Concept c = eng.getConcept(urn);
			
			// find a "vandf" relationship, that should match the ingredientCode
			Set<String> ndfrels = c.getEquivalentSet();
			for (String rel : ndfrels) {
				if (rel.startsWith("urn:vandf:")) {
					String code = "urn:va:vuid:" + TermEng.parseCode(rel);
					drugq.add(new TermQuery(new Term("med_ingredient_code", code)), BooleanClause.Occur.SHOULD);
				}
			}
			/*
			System.out.println(urn + ":" + rels.get(urn) + ":" + eng.getDescription(urn));
			System.out.println("\tSAMEAS " + eng.getEquivalentSet(urn));
			*/
		}
		
		System.out.println(drugq);
		
	}
	
	@Test
	@Ignore
	public void testNDFRTTreatBy() throws Exception {
		// this should have treated_by relationships
		Concept c = eng.getConcept(DRUG_PROPRANOLOL);
		Map<String, String> rels = c.getRelationships();
		assertTrue(rels.containsKey(DISEASE_TACHYCARDIA));
		
		/* debugging output
		System.out.println(c.getURN() + ":" + c.getDescription());
//		printTree(c.getAncestorTree(),0);
		for (String key : rels.keySet()) {
			Concept rel = eng.getConcept(key);
			if (rel.isa(DISEASE_FINDING)) {
				System.out.println("\tMAY_TREAT?" + key + ":" + rels.get(key) + ":" + eng.getDescription(key));
			} else {
				System.out.println("\tSOMETHING ELSE?" + key + ":" + rels.get(key) + ":" + eng.getDescription(key));
			}
			
		}
		*/
	}
	
	// MeSH Pharmacutical Action testing --------------------------------------
	
	@Test
	@Ignore
	public void testMESHDrugSearch2() throws Exception {
		String jdbcurl = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-xyz-mshdb/termdb;LOG=0";
		String jdbcurlDrug = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-1.UMLS2013AA.20130905-drugdb/termdb;LOG=0";
		String luceneDir = "C:\\data\\hmp\\hmp-main\\data\\termdb-xyz-mshdb\\lucene";
		String luceneDirDrug = "C:\\data\\hmp\\hmp-main\\data\\termdb-1.UMLS2013AA.20130905-drugdb\\lucene";
		H2TermDataSource h2 = new H2TermDataSource(jdbcurl);
		LuceneSearchDataSource src = new LuceneSearchDataSource(h2, luceneDir, false);
		H2TermDataSource h2drug = new H2TermDataSource(jdbcurlDrug);
		LuceneSearchDataSource srcdrug = new LuceneSearchDataSource(h2drug, luceneDirDrug, false);
		TermEng eng = new TermEng(new ITermDataSource[] {src, srcdrug});
		
		
		String term = "urn:msh:D014665";// vasoldilator agents
		System.out.println("Finding children for: " + eng.getConceptData(term)); 
		
		List<String> results = eng.search(new TermQuery(new Term("rel.RO", term)));
		for (String urn : results) {
			System.out.println("FOUND: " + urn + ":" + eng.getDescription(urn));
		}
		
	}
	
	@Test
	@Ignore
	public void testMESHDrugSearch() throws ClassNotFoundException, IOException, SQLException, ParseException {
		String jdbcurl = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-xyz-mshdb/termdb;LOG=0";
		String jdbcurlDrug = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-1.UMLS2013AA.20130905-drugdb/termdb;LOG=0";
		String luceneDir = "C:\\data\\hmp\\hmp-main\\data\\termdb-xyz-mshdb\\lucene";
		String luceneDirDrug = "C:\\data\\hmp\\hmp-main\\data\\termdb-1.UMLS2013AA.20130905-drugdb\\lucene";
		H2TermDataSource h2 = new H2TermDataSource(jdbcurl);
		LuceneSearchDataSource src = new LuceneSearchDataSource(h2, luceneDir, false);
		
		H2TermDataSource h2drug = new H2TermDataSource(jdbcurlDrug);
		LuceneSearchDataSource srcdrug = new LuceneSearchDataSource(h2drug, luceneDirDrug, false);
		
		TermEng eng = new TermEng(new ITermDataSource[] {src, srcdrug});
		
		// target the appropriate MeSH pharmacologic action hierarchy
		String ROOT = "urn:msh:D020228"; // Pharmacologic Actions
		String searchTerm = "beta";
		BooleanQuery q = new BooleanQuery();
		q.add(new TermQuery(new Term("ancestor", ROOT)), BooleanClause.Occur.MUST);
		q.add(new TermQuery(new Term("parent", ROOT)), BooleanClause.Occur.MUST_NOT);
		q.add(new TermQuery(new Term("term", searchTerm)), BooleanClause.Occur.MUST);
		
//		TermQuery q2 = new TermQuery(new Term("term", searchTerm));
		
		long start = System.currentTimeMillis();
		TopDocs results = src.searchDocs(q);
		System.out.println("Found: "+ results.totalHits + "(" + (System.currentTimeMillis()-start) + "ms)");
		for (ScoreDoc s : results.scoreDocs) {
			Document doc = src.getReader().document(s.doc);
			
			// determine the TTY of the term that 
			String urn = doc.get("urn");
			Concept c = eng.getConcept(urn);
			
			// if it has a RB category, skip it (drug not category)
			Map<String,String> rels = c.getRelationships();
			if (rels != null && !rels.isEmpty()) {
				boolean skip = false;
				for (String key : rels.keySet()) {
					if (rels.get(key).equals("RB")) {
						skip = true;
						break;
					}
				}
				if (skip) {
					System.out.println("SKIPPED " + urn + ":" + src.getDescription(urn));
//					continue;
				}
			}
			
			Map<String, Object> data = src.getConceptData(urn);
			String cui = (String) data.get("cui");
			System.out.println("FOUND " + urn + ":" + cui + ":" + src.getDescription(urn));
			System.out.println("\t ATTS:" + data.get("attributes"));
			System.out.println("\t SAMEAS:" + data.get("sameas"));
			System.out.println("\t PARENTS:" + c.getParentMap());
			System.out.println("\t CHILDREN:" + src.getChildSet(urn));
			System.out.println("\t ANCESTORS:");
//			printTree(c.getAncestorTree(), 1);
			System.out.println("\t RELS:" + h2.getRelMap(urn));
			/*
			System.out.println("\t DRUG SEARCH:");
			List<String> urns = srcdrug.search(new TermQuery(new Term("cui", cui)));
			for (String s2 : urns) {
				System.out.println("\t\t " + s2 + ":" + srcdrug.getConceptData(s2).get("attributes"));
			}
			*/
			
//			// term list
//			for (Map<String, Object> term : src.getTermList(urn)) {
//				System.out.println("\t" + term);
//			}
//			
//			for (String term : doc.getValues("term")) {
//				if (term.toLowerCase().contains(searchTerm)) {
//					System.out.println("\tTERM: " + term);
//					break;
//				}
//			}
		}
	}
}
