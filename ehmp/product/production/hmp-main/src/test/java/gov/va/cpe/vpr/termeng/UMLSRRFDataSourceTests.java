package gov.va.cpe.vpr.termeng;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.lucene.index.Term;
import org.apache.lucene.search.TermQuery;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

/**
 * Uses a small set of test resource files to test the parsing and output
 * 
 * To generate the test set for this, run build.sh (doesn't take too long)
 * 
 * TODO: test the loinc lipid/chemistry higherarchy
 */
public class UMLSRRFDataSourceTests {
	@ClassRule
    public static TemporaryFolder temp = new TemporaryFolder();
	
	public static final String MESH_PROPRANOLOL = "urn:msh:D011433";
	public static final String MESH_BETABLOCKER = "urn:msh:D000319";
	public static final String NDFRT_PROPRANOLOL = "urn:ndfrt:N0000148001";
	public static final String NDFRT_BETABLOCKER = "urn:ndfrt:N0000175556";
	public static final String VANDF_SODIUM_CHLORIDE = "urn:vandf:4017444";
	public static final String VANDF_ELECTROLYTES = "urn:vandf:4024738";
	
	private static UMLSRRFDataSource drugsrc;

	private static TestUMLSRRFDataSource lncsrc;
	
	private static class TestUMLSRRFDataSource extends UMLSRRFDataSource {

		public TestUMLSRRFDataSource(File metaDir, String tmpDir,
				boolean loadVerbose, List<String> sabs) throws IOException {
			super(metaDir, tmpDir, loadVerbose, sabs);
		}
		
		/** This override means I don't have to have a huge MRCONSO.RRF test file */
		@Override
		protected String resolveAUI2URN(String aui) {
			String ret = super.resolveAUI2URN(aui);
			if (ret == null) {
				ret = "urn:aui:" + aui;
			}
			return ret;
		}
	}

	@BeforeClass
	public static void setup() throws IOException, URISyntaxException {
		
		// test data set directory
//		File metadir = new File("c:/temp/2013AA.20130930/tests");
		File metadir = new File(UMLSRRFDataSourceTests.class.getResource("./drugdb").toURI());
		
		String tmpDir = temp.newFolder().getAbsolutePath();
		drugsrc = new TestUMLSRRFDataSource(metadir, tmpDir, false, Arrays.asList("VANDF","NDFRT","RXNORM","MSH"));
		
//		metadir = new File("c:/temp/2013AA.20130930/tests/lnc");
		metadir = new File(UMLSRRFDataSourceTests.class.getResource("./lncdb").toURI());
		
		tmpDir = temp.newFolder().getAbsolutePath();
		lncsrc = new TestUMLSRRFDataSource(metadir, tmpDir, false, Arrays.asList("LNC"));
	}
	
	@AfterClass
	public static void teardown() {
		drugsrc.close();
		lncsrc.close();
	}
	
	@Test
	public void testMSHPharmActionBetaBlocker() {
		UMLSRRFDataSource src = drugsrc;
		String urn = MESH_BETABLOCKER;
		Map<String,Object> data = src.getConceptData(urn);
		assertNotNull(data);
		assertEquals("Adrenergic beta-Antagonists", src.getDescription(urn));
		
		Set<String> parents = src.getParentSet(urn);
		Set<String> sameas = src.getEquivalentSet(urn);
		Map<String,Set<String>> rels = src.getRelMap(urn);
		
		// one parent (ancestors not in data set)
		assertTrue(parents.contains("urn:msh:D018674")); // Adrenergic Antagonists
		
		// propranolol should be an RN|isa, but they are excluded
		assertFalse(rels.containsKey(MESH_PROPRANOLOL));
		
		// synonymn set (while there are synonymns measured below) they are filtered out since they point to themself
		assertEquals(0, sameas.size());
		
		// 24 qualifiers, 50 child drugs, 1 parents = 75 total rels
		int aqcount=0, rocount=0, syncount=0, parcount=0;
		for (String key : rels.keySet()) {
			if (rels.get(key).contains("AQ|")) aqcount++;
			if (rels.get(key).contains("RO|")) rocount++;
			if (rels.get(key).contains("SIB|")
					|| rels.get(key).contains("SY|has_entry_version")
					|| rels.get(key).contains("SY|permuted_term_of")
					|| rels.get(key).contains("SY|entry_version_of")
					|| rels.get(key).contains("SY|has_permuted_term")
					|| rels.get(key).contains("SY|has_sort_version")
					|| rels.get(key).contains("SY|sort_version_of"))
				syncount++;
			if (rels.get(key).contains("PAR|")) parcount++;
		}
		assertEquals(24, aqcount);
		assertEquals(3, rocount);
		assertEquals(parents.size(), parcount);
		assertEquals(2, syncount);
		assertEquals(30, rels.size());
	}
	
	@Test
	public void testDrugBuildPropanololNDFRT() {
		UMLSRRFDataSource src = drugsrc;
		String urn = NDFRT_PROPRANOLOL;
		Map<String,Object> data = src.getConceptData(urn);
		assertNotNull(data);
		
		assertEquals(NDFRT_PROPRANOLOL, data.get("urn"));
		assertEquals("N0000148001", data.get("code"));
		assertEquals("NDFRT", data.get("codeSystem"));
		assertEquals("PROPRANOLOL", data.get("description"));
		assertEquals("A17927937", data.get("aui"));
		assertEquals("C0033497", data.get("cui"));
		
		// check the primary term
		List<Map<String,String>> terms = (List<Map<String, String>>) data.get("terms");
		Map<String,String> term = terms.get(0);
		assertEquals(2, terms.size());
		assertEquals("FN", term.get("tty"));
		assertEquals("C0033497", term.get("cui"));
		assertEquals("150", term.get("rank"));
		assertEquals("PROPRANOLOL", term.get("str"));
		assertEquals("A17927937", term.get("aui"));
		assertEquals("ENG", term.get("lat"));
		
		// test sets (and that the junky codes are gone)
		Set<String> parents = src.getParentSet(urn);
		Set<String> ancestors = src.getAncestorSet(urn);
		Set<String> sameas = src.getEquivalentSet(urn);
		Map<String,Set<String>> rels = src.getRelMap(urn);
		
		// no parents/ancestors (should exclude the P[preperations] concept)
		assertEquals(0, parents.size());
		assertEquals(0, ancestors.size());
		
		// should find 5 forms of propranalol (2 in snomed, 1 in rxnorm, 1 in ndf, 1 in ndf-rt) 
		assertEquals(5, sameas.size());
		assertTrue(sameas.contains("urn:rxnorm:8787"));
		assertTrue(sameas.contains("urn:vandf:4019916"));
		assertTrue(sameas.contains("urn:ndfrt:N0000006760"));
		assertTrue(sameas.contains("urn:sct:372772003"));
		assertTrue(sameas.contains("urn:sct:55745002"));
		
		// 11 treatments, 10 contraindications=20total rels
		int rotreat=0, rodzcontra=0,rodrugcontra=0;
		for (String key : rels.keySet()) {
			if (rels.get(key).contains("RO|may_be_treated_by")) rotreat++;
			if (rels.get(key).contains("RO|disease_with_contraindication")) rodzcontra++;
			if (rels.get(key).contains("RO|has_contraindicated_drug")) rodrugcontra++;
		}
		assertEquals(13, rotreat);
		assertEquals(10, rodzcontra);
		assertEquals(10, rodrugcontra);
		assertEquals(24, rels.size());
		
		// ensure our NDFRT RO|may_be_treated_by is being expanded to include ancestors
		assertTrue(rels.get("urn:ndfrt:N0000001434").contains("RO|may_be_treated_by")); // direct MRREL to heart failure
		assertTrue(rels.get("urn:ndfrt:N0000001432").contains("RO|may_be_treated_by")); // expanded to include heart disease
		assertTrue(rels.get("urn:ndfrt:N0000000689").contains("RO|may_be_treated_by")); // expanded to include cardiovascular disease
		
		// should be contraindicated with pregnancy
		assertTrue(rels.get("urn:aui:A18016406").contains("RO|has_contraindicated_drug")); // the AUI for pregancy
	}
	
	@Test
	public void testDrugBuildPropanololMSH() throws Exception {
		UMLSRRFDataSource src = drugsrc;
		String urn = MESH_PROPRANOLOL;
		
		// test the MeSH concept
		Map<String,Object> data = src.getConceptData(urn);
		assertNotNull(data);
		
		// test basic values
		assertEquals(MESH_PROPRANOLOL, data.get("urn"));
		assertEquals("D011433", data.get("code"));
		assertEquals("MSH", data.get("codeSystem"));
		assertEquals("Propranolol", data.get("description"));
		assertEquals("A0014293", data.get("aui"));
		assertEquals("C0033497", data.get("cui"));
		
		// check the primary term
		List<Map<String,String>> terms = (List<Map<String, String>>) data.get("terms");
		Map<String,String> term = terms.get(0);
		assertEquals(3, terms.size());
		assertEquals("MH", term.get("tty"));
		assertEquals("C0033497", term.get("cui"));
		assertEquals("204", term.get("rank"));
		assertEquals("Propranolol", term.get("str"));
		assertEquals("A0014293", term.get("aui"));
		assertEquals("ENG", term.get("lat"));
		
		// test sets (and that the junky codes are gone)
		Set<String> parents = src.getParentSet(urn);
		Set<String> ancestors = src.getAncestorSet(urn);
		Set<String> sameas = src.getEquivalentSet(urn);
		Map<String,Set<String>> rels = src.getRelMap(urn);
		
		// parents include PAR and ISA (ingredient parent + pharm action)
		assertEquals(7, parents.size());
		assertTrue(parents.contains("urn:msh:D011412")); //Propanolamines
		assertTrue(parents.contains("urn:msh:D009281")); //Naphthalenes
		assertTrue(parents.contains("urn:msh:D050198")); //Phenoxypropanolamines
		assertTrue(parents.contains("urn:msh:D000319")); //Adrenergic beta-Antagonists
		assertTrue(parents.contains("urn:msh:D000889")); //Anti-Arrhythmia Agents
		assertTrue(parents.contains("urn:msh:D000959")); //Antihypertensive Agents
		assertTrue(parents.contains("urn:msh:D014665")); //Vasodilator Agents
		
		// ancestors, same as parent, but also one level up (adrenergic antagonists)
		assertEquals(8, ancestors.size());
		assertTrue(ancestors.containsAll(parents));
		assertTrue(ancestors.contains("urn:msh:D018674"));
		assertFalse(ancestors.contains("urn:src:V-MSH"));

		// all synonynms filtered out
		assertTrue(sameas.isEmpty());
		
		// 4 pharmacolgic actions
		assertTrue(rels.containsKey("urn:msh:D000319")); //Adrenergic beta-Antagonists
		assertTrue(rels.containsKey("urn:msh:D000889")); //Anti-Arrhythmia Agents
		assertTrue(rels.containsKey("urn:msh:D000959")); //Antihypertensive Agents
		assertTrue(rels.containsKey("urn:msh:D014665")); //Vasodilator Agents
		
		// 27 qualifiers, 3 parents, 4 pharm actions = 34 total rels
		int aqcount=0, parcount=0, rncount=0, rocount=0, sibcount=0;
		for (String key : rels.keySet()) {
			if (rels.get(key).contains("AQ|")) aqcount++;
			if (rels.get(key).contains("RB|inverse_isa") || rels.get(key).contains("PAR|")) parcount++;
			if (rels.get(key).contains("RN|")) rncount++;
			if (rels.get(key).contains("SIB|")) sibcount++;
			if (rels.get(key).contains("RO|")) rocount++;
		}
		assertEquals(27, aqcount);
		assertEquals(parents.size(), parcount);
		assertEquals(8, rncount);
		assertEquals(47, sibcount);
		assertEquals(2, rocount);
		assertEquals(90, rels.size());
	}
	
	/*
	 * Example of a concept that has an unusually large # of relationships (>1000) that need to be
	 * carefully managed
	 */
	@Test
	public void testVANDFSodiumChloride() {
		UMLSRRFDataSource src = drugsrc;

		// test the MeSH concept
		Map<String,Object> data = src.getConceptData(VANDF_SODIUM_CHLORIDE);
		assertNotNull(data);
		
		// test basic values
		assertEquals(VANDF_SODIUM_CHLORIDE, data.get("urn"));
		assertEquals("4017444", data.get("code"));
		assertEquals("VANDF", data.get("codeSystem"));
		assertEquals("SODIUM CHLORIDE", data.get("description"));
		assertEquals("A8437310", data.get("aui"));
		assertEquals("C0037494", data.get("cui"));
		
		// test sets (and that the junky codes are gone)
		Set<String> parents = src.getParentSet(VANDF_SODIUM_CHLORIDE);
		Set<String> ancestors = src.getAncestorSet(VANDF_SODIUM_CHLORIDE);
		Set<String> sameas = src.getEquivalentSet(VANDF_SODIUM_CHLORIDE);
		Map<String,Set<String>> rels = src.getRelMap(VANDF_SODIUM_CHLORIDE);
		
		assertTrue(parents.isEmpty());
		assertTrue(ancestors.isEmpty());
		assertEquals(1, rels.size());
		
		// RELS should be filtered to remove the ingredient_of relationship for this concept
		assertEquals(1, rels.size());
		assertEquals(1, rels.get("urn:rxnorm:9863").size());
		assertTrue(rels.get("urn:rxnorm:9863").contains("SY|")); // RxNorm for NaCl
	}
	
	@Test
	public void testVANDFElectrolytes() {
		UMLSRRFDataSource src = drugsrc;
		// test the MeSH concept
		Map<String,Object> data = src.getConceptData(VANDF_ELECTROLYTES);
		assertNotNull(data);
		
		// test basic values
		assertEquals(VANDF_ELECTROLYTES, data.get("urn"));
		assertEquals("4024738", data.get("code"));
		assertEquals("VANDF", data.get("codeSystem"));
		assertEquals("ELECTROLYTE SOLN,ORAL ADULT", data.get("description"));
		assertEquals("A11577547", data.get("aui"));
		assertEquals("C1814316", data.get("cui"));
		
		// test sets
		Set<String> parents = src.getParentSet(VANDF_ELECTROLYTES);
		Set<String> ancestors = src.getAncestorSet(VANDF_ELECTROLYTES);
		Set<String> sameas = src.getEquivalentSet(VANDF_ELECTROLYTES);
		Map<String,Set<String>> rels = src.getRelMap(VANDF_ELECTROLYTES);
		
		// should have a parent but no synonyms
		assertTrue(parents.contains("urn:vandf:4021704")); // ENTERAL NUTRITION
		assertTrue(ancestors.contains("urn:vandf:4021704"));
		assertTrue(sameas.isEmpty());
		
		// incregient_of relationships
		assertEquals(7, rels.size());
		assertTrue(rels.get(VANDF_SODIUM_CHLORIDE).contains("RO|ingredient_of")); // main relationship back to NaCl
		assertTrue(rels.get("urn:aui:A8436623").contains("RO|ingredient_of")); // CITRIC ACID 
		assertTrue(rels.get("urn:aui:A8437308").contains("RO|ingredient_of")); // POTASSIUM CHLORIDE
		assertTrue(rels.get("urn:aui:A12099570").contains("RO|ingredient_of")); // ELECTROLYTES
		assertTrue(rels.get("urn:aui:A8437455").contains("RO|ingredient_of")); // DEXTROSE
		
		// raw parent relationship
		assertTrue(rels.get("urn:vandf:4021704").contains("RB|inverse_isa")); // ENTERAL NUTRITION
		
		// plus weird artifact of 2 synonymns to itself
		assertEquals(2, rels.get(VANDF_ELECTROLYTES).size());
		assertTrue(rels.get(VANDF_ELECTROLYTES).contains("SY|print_name_of"));
		assertTrue(rels.get(VANDF_ELECTROLYTES).contains("SY|has_print_name"));
	}
	
	@Test
	public void testLuceneSearch() throws IOException {
		// build lucene index
		String tmpdir = temp.getRoot().getAbsolutePath();
		LuceneSearchDataSource searcher = new LuceneSearchDataSource(drugsrc, tmpdir, false);
		searcher.buildIndexFrom(drugsrc);

		// search by synonyms
		List<String> results = searcher.search("term: (adrenergic* blocker*)");
		assertTrue(results.contains(NDFRT_BETABLOCKER));
		assertTrue(results.contains(MESH_BETABLOCKER));

		// NDFRT doesn't have the antagonist synonymn
		results = searcher.search("term:(adrenergic antagonist*)");
		assertTrue(results.contains(MESH_BETABLOCKER));
		
		// get decendants of adrenergic antagonists (via search)
		results = searcher.search(new TermQuery(new Term("ancestor", "urn:msh:D018674")));
		assertTrue(results.contains(MESH_PROPRANOLOL));
		assertTrue(results.contains(MESH_BETABLOCKER));
		
		// find all the drugs that may treat heart failure (N0000001434)
		results = searcher.search(new TermQuery(new Term("RO|may_be_treated_by", "urn:ndfrt:N0000001434")));
		assertTrue(results.contains(NDFRT_PROPRANOLOL));
		
		// since we expand the may_treat to include ancestors, propranolol should also match heart disease 
		results = searcher.search(new TermQuery(new Term("RO|may_be_treated_by", "urn:ndfrt:N0000001432")));
		assertTrue(results.contains(NDFRT_PROPRANOLOL));
		
		// and cardiovascular disease
		results = searcher.search(new TermQuery(new Term("RO|may_be_treated_by", "urn:ndfrt:N0000000689")));
		assertTrue(results.contains(NDFRT_PROPRANOLOL));
	}
	
	@Test
	@Ignore
	public void testLocalDBOnly() throws ClassNotFoundException, SQLException {
		String u = "jdbc:h2:c:/data/hmp/hmp-main/data/termdb-1.UMLS2013AA.20140221-drugdb/termdb;ACCESS_MODE_DATA=r";
		H2TermDataSource h2 = new H2TermDataSource(u);
		TermEng eng = new TermEng(h2);
		
//		Concept c = eng.getConcept("urn:vandf:4008463"); // caster oil
		Concept c = eng.getConcept("urn:rxnorm:2129"); // caster oil
		
		Map<String, String> map = c.getEquivalentMap();
		for (String key : map.keySet()) {
			System.out.println(key + "=" + map.get(key));
		}
	}
	
	@Test
	@Ignore
	public void testLNCDiabetesLink() {
		UMLSRRFDataSource src = null;
		String urn = "urn:lnc:55399-0"; // diabetes tracking panel
		
		Map<String,Object> data = src.getConceptData(urn);
		assertNotNull(data);
		
		assertEquals("Diabetes tracking panel:-:Point in time:^Patient:-", src.getDescription(urn));
		assertEquals("55399-0", data.get("code"));
		assertEquals("LNC", data.get("codeSystem"));
		assertEquals("C2708643", data.get("cui"));
		
		// test sets (and that the junky codes are gone)
		Set<String> parents = src.getParentSet(urn);
		Set<String> ancestors = src.getAncestorSet(urn);
		Set<String> sameas = src.getEquivalentSet(urn);
		Map<String,Set<String>> rels = src.getRelMap(urn);
		
		// no parents/ancestors
		assertEquals(1, parents.size());
		assertEquals(1, ancestors.size());
		
		assertTrue(parents.contains("urn:aui:A16934063")); // public health record order set
		assertTrue(ancestors.contains("urn:aui:A16934063")); // public health record order set
		
		System.out.println(rels);
	}
	
	@Test
	public void testLNCCreatinine() {
		UMLSRRFDataSource src = lncsrc;
		
		String LNC_CREATININE = "urn:lnc:LP14355-9";
		
		// test main concept
		Map<String,Object> data = src.getConceptData(LNC_CREATININE);
		assertNotNull(data);
		
		// test basic values
		assertEquals(LNC_CREATININE, data.get("urn"));
		assertEquals("LP14355-9", data.get("code"));
		assertEquals("LNC", data.get("codeSystem"));
		assertEquals("Creatinine", data.get("description"));
		assertEquals("A18360341", data.get("aui"));
		assertEquals("C0010294", data.get("cui"));
		
		// test sets
		Set<String> parents = src.getParentSet(LNC_CREATININE);
		Set<String> ancestors = src.getAncestorSet(LNC_CREATININE);
		Set<String> sameas = src.getEquivalentSet(LNC_CREATININE);
		Map<String,Set<String>> rels = src.getRelMap(LNC_CREATININE);
		
		// should have 2 parents
		assertTrue(parents.contains("urn:aui:A18205694")); // Chemistry, challenge
		assertTrue(parents.contains("urn:lnc:LP31398-8")); // Renal function
		assertEquals(2, parents.size());
		
		// should have 3 ancestors (+2 filtered out by policy)
		assertTrue(ancestors.contains("urn:lnc:LP31388-9")); // Chemistry
		assertTrue(ancestors.contains("urn:lnc:LP31398-8")); // Renal function
		assertTrue(ancestors.contains("urn:aui:A18205694")); // Chemistry, challenge
		assertFalse(ancestors.contains("urn:lnc:MTHU000999")); // LOINCPARTS 
		assertFalse(ancestors.contains("urn:src:V-LNC")); // LOINC Root
		assertEquals(3, ancestors.size());
		
		// should have filtered out CHD|*, "RO|has_*, "SY|has_*
		for (String key : rels.keySet()) {
			assertFalse(rels.get(key).contains("CHD|"));
			assertFalse(rels.get(key).contains("RO|has_component"));
		}
	}
	
	@Test
	public void testCodeSystems() {
		// loinc concepts should not have been parsed (they are part of a different test suite)
		assertFalse(drugsrc.getCodeSystemList().contains("LNC"));
		assertTrue(drugsrc.getCodeSystemList().contains("MSH"));
		assertTrue(drugsrc.getCodeSystemList().contains("RXNORM"));
		assertTrue(drugsrc.getCodeSystemList().contains("VANDF"));
		assertTrue(drugsrc.getCodeSystemList().contains("NDFRT"));
		assertNull(drugsrc.getConceptData("urn:lnc:55399-0"));
	}
}

