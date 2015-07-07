package gov.va.cpe.vpr.search;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DrugTherapyTest;
import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.POMObjectTester;
import gov.va.cpe.vpr.dao.solr.DomainObjectToSolrInputDocument;
import gov.va.cpe.vpr.frameeng.Frame.FrameException;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.search.PatientSearch;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.cpe.vpr.search.SearchService;
import gov.va.cpe.vpr.search.SolrTestFrameRunner;
import gov.va.cpe.vpr.sync.util.MsgSrcDest;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.IteratorWithCount;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.JSONZIPMsgSrc;
import gov.va.hmp.access.PermitAllPolicyDecisionPoint;
import gov.va.hmp.auth.HmpUserContext;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.HealthTimePrinterSetHolder;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.io.FileUtils;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.search.suggest.analyzing.AnalyzingInfixSuggester;
import org.apache.lucene.util.Attribute;
import org.apache.solr.SolrTestCaseJ4;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.core.CloseHook;
import org.apache.solr.core.SolrCore;
import org.apache.solr.handler.component.SearchComponent;
import org.apache.solr.schema.IndexSchema;
import org.apache.solr.spelling.suggest.SolrSuggester;
import org.apache.solr.util.stats.TimerContext;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.codahale.metrics.Timer;
import com.codahale.metrics.Timer.Context;

/**
 * using the SOLR unit test framework to test our Search Results.
 * 
 * TODO: can't figure out how to kill off the startup errors
 * 
 * @see  "http://svn.apache.org/repos/asf/lucene/solr/tags/release-1.4.1/src/test/org/apache/solr/SampleTest.java"
 * @author brian
 */
public class SolrSearchITCase extends SolrTestCaseJ4 {
	
	// use the POMObjectTester to stream the objects in instead of loading them to an array first
	private static POMObjectTester<IPatientObject> LOADER = new POMObjectTester<IPatientObject>() {
		private DomainObjectToSolrInputDocument converter = new DomainObjectToSolrInputDocument();
		protected IPatientObject handle(IPatientObject obj) {
			assertU(adoc(converter.convert(obj)));
			return null; // dont gather up the results...
		}
	};
	private static SolrTestFrameRunner RUNNER = null;
	private static File FILE = null; 
	private static SearchService svc = null;
	private static IndexSchema schema;

	static {
		// necessary to prevent later errors: See SOLR-5771
		SolrSearchITCase.ALLOW_SSL = false;
		
		// avivapatient six data
		try {
			FILE = new File(DrugTherapyTest.class.getResource("avivapatient.six.20140304.zip").toURI());
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}
	

	private static <T> T getPrivateField(Object obj, String field, Class<T> ret) throws Exception {
		Field f = obj.getClass().getDeclaredField(field);
		f.setAccessible(true);
		return (T) f.get(obj);
	}
	
	/** if you don't clean static context up, SolrTestCaseJ4 will report it as a memory leak */
	@AfterClass
	public static void afterClass() throws IOException {
		RUNNER.close();
		RUNNER = null;
		svc = null;
		schema = null;
	}
	
	@BeforeClass
	public static void beforeClass() throws Exception {
		createTempDir();
		
		// copy our SOLR config files to a temporary directory
		System.setProperty("solr.data.dir", dataDir.getAbsolutePath());
		File confDir = new File(dataDir, "collection1/conf");
		File confFile = new File(confDir, "solrconfig.xml");
		FileUtils.copyDirectory(new File("./src/main/solr/vpr/conf"), confDir);
		
		/* inject a <lib/> tag into the copy of solrconfig.xml so we dont 
		 * have to copy all the jar files (which causes this test to not be able 
		 * to clean up the temp directory afterward)
		 */
		File libDir = new File("./target/solr/lib");
		StringBuilder sb = new StringBuilder(FileUtils.readFileToString(confFile));
		int idx = sb.indexOf("</luceneMatchVersion>");
		if (idx > 0) {
			sb.insert(idx+21, "<lib dir=\"" + libDir.getAbsolutePath() + "\"/>");
			FileUtils.write(confFile, sb);
		}
		
		// startup the SOLR core
		initCore("solrconfig.xml", "schema.xml", dataDir.getAbsolutePath());
		lrf.qtype = "search";
		SearchComponent comp = h.getCore().getSearchComponent("suggester");
		schema = h.getCore().getLatestSchema();
		
		/* super-hack to get a reference to the AnalyzinInfixSuggester that doesn't clean up after
		 * itself causing lots of littered files which caused the temp dir to not be removed
		 */
		ConcurrentHashMap suggesters = getPrivateField(comp, "suggesters", ConcurrentHashMap.class);
		SolrSuggester suggester = (SolrSuggester) suggesters.get("phrase_suggester");
		final AnalyzingInfixSuggester ais = getPrivateField(suggester, "lookup", AnalyzingInfixSuggester.class);
		
		// close the AnalyzingInfixSuggester on shutdown
		h.getCore().addCloseHook(new CloseHook() {
			@Override
			public void preClose(SolrCore core) {
			}

			@Override
			public void postClose(SolrCore core) {
				try {
					ais.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		});
		
		// setup the search service and runner
        EmbeddedSolrServer solrServer = new EmbeddedSolrServer(h.getCoreContainer(), h.getCore().getName());
		svc = new SearchService();
		svc.setRunner(RUNNER = new SolrTestFrameRunner());
        svc.setSolrServer(solrServer);
        RUNNER.addResource(solrServer);
		RUNNER.init();
		svc.setUserContext(RUNNER.getResource(UserContext.class));
	}
	
	@Test
	public void test() {
		// really basic test
		assertU(adoc("uid", "urn:va:F484:foo:bar", "pid", "12345", "kind", "testcase"));
		assertU(commit());
		
		assertQ("couldn't find pid 12345",
	            req("pid:12345")
	            ,"//result[@numFound=1]"
	            ,"//str[@name='uid'][.='urn:va:F484:foo:bar']"
	            ,"//doc/str[@name='pid'][.='12345']"
	            );
	}
	
	@Test
	public void testMedSearch() throws IOException, URISyntaxException {
		
		// load med data and commit
		LOADER.loadZipFile(FILE, "5000000346","med");
		assertU(commit());
		
//		IFrame medSearchFrame = new MedsSearchFrame();
		
		// check meds
		assertQ("index should have 183 medications for this PID", 
			req("pid:5000000346 AND domain:med"), "//result[@numFound=183]");
		
//		PatientSearch searchEvent = new PatientSearch(query, vprPatient, SearchMode.SEARCH);
//		RUNNER.exec(medSearchFrame, null);
	}
	
	@Test
	public void testDocSearch() throws IOException, SolrServerException, FrameException {
		String pid = "5000000346";
		
		// load documents
		LOADER.loadZipFile(FILE, pid, "document");
		assertU(commit());
		
		// count docs
		assertQ("index should have 102 documents for this PID", 
				req("pid:5000000346 AND domain:document"), "//result[@numFound=102]");
		
		// search for "documents"
		PatientSearch results = svc.textSearchByPatient("document", pid, null);
		List<SummaryItem> items = results.getResults();
		assertEquals(25, items.size());
	}
	
	@Test
	public void kindAnalyzerTests() throws IOException, URISyntaxException {
		
		// check the analyzer behavior of kind and domain fields
		Analyzer kindAnalyser = schema.getFieldType("kind").getAnalyzer();
		Analyzer queryAnalyser = schema.getFieldType("kind").getQueryAnalyzer();

		// should lower case, split into 2 tokens, and de-pluralize Notes
		List<String> ret = streamToList(kindAnalyser.tokenStream("kind", "Progress Notes"));
		assertEquals(2, ret.size());
		assertEquals("progress", ret.get(0));
		assertEquals("note", ret.get(1));
		
		// should lower case, and de-possessive 
		ret = streamToList(kindAnalyser.tokenStream("kind", "Document's"));
		assertEquals(1, ret.size());
		assertEquals("document", ret.get(0));

		// kstemmer does not get vitals to vital, but the query analyzer synonyms do
		ret = streamToList(kindAnalyser.tokenStream("kind", "vitals"));
		assertEquals(1, ret.size());
		assertEquals("vitals", ret.get(0));
		ret = streamToList(queryAnalyser.tokenStream("kind", "vitals"));
		assertEquals(2, ret.size());
		assertEquals("vital", ret.get(0));
		assertEquals("vitals", ret.get(1));

		ret = streamToList(kindAnalyser.tokenStream("kind", "vital signs"));
		assertEquals(2, ret.size());
		assertEquals("vital", ret.get(0));
		assertEquals("sign", ret.get(1));

	}
	
	private static List<String> streamToList(TokenStream stream) throws IOException {
		List<String> ret = new ArrayList<>();
		stream.reset();
		
		
		while (stream.incrementToken()) {
			
			CharTermAttribute attr = stream.getAttribute(CharTermAttribute.class);
			ret.add(attr.toString());

			/* DEBUG OUTPUT 
			Iterator<Class<? extends Attribute>> itr = stream.getAttributeClassesIterator();
			System.out.println();
			while (itr.hasNext()) {
				Class<? extends Attribute> attr = itr.next();
				Attribute attribute = stream.getAttribute(attr);
				System.out.println("\t" + "(" + attr.getName() + ") " + stream.getAttribute(attr));
				if (attr.isAssignableFrom(OffsetAttribute.class)) {
					System.out.println("\t\toffset: " + ((OffsetAttribute) attribute).startOffset());
				} else if (attribute instanceof KeywordAttribute) {
					System.out.println("\t\tkeyword: " + ((KeywordAttribute) attribute).isKeyword());
				}
			}
			*/
			
		}
		stream.end();
		stream.close();
		
		return ret;
	}
	

}
