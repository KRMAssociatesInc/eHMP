package gov.va.cpe.vpr.termeng;

import static org.junit.Assert.*;

import java.io.File;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.classic.QueryParser.Operator;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

/**
 * This class is used to understand the TermEng and Lucene indexing behavior.
 * 
 * @author Les.Westberg
 *
 */
public class LuceneUtilTest {

	@Before
	public void setUp() throws Exception {
	}

	@SuppressWarnings("deprecation")
	@Ignore
	@Test
	public void testLuceneSearch() {
		try {
	        Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_44);
	    	Directory directory = FSDirectory.open(new File("/Users/Les.Westberg/Projects/vistacore/ehmp/product/production/hmp-main/data/termdb-1.UMLS2013AA.20131017-drugdb/lucene"));
			DirectoryReader reader = DirectoryReader.open(directory);
			IndexSearcher searcher = new IndexSearcher(reader);
			QueryParser parser = new QueryParser(Version.LUCENE_44, "description", analyzer);
			parser.setDefaultOperator(Operator.AND);
			
			Query oQuery = new TermQuery(new Term("urn", "urn:vandf:4020400"));
			TopDocs oTopDocs = searcher.search(oQuery, 100);
			
			assertNotNull(oTopDocs);
			
			for (ScoreDoc oScoreDoc : oTopDocs.scoreDocs) {
				assertNotNull(oScoreDoc);
				Document oDocument = reader.document(oScoreDoc.doc);
				@SuppressWarnings("unused")
				Document oDocument2 = searcher.doc(oScoreDoc.doc);
				assertNotNull(oDocument);
			}
		}
		catch (Exception e) {
			System.out.println("An unhandled exception occurred.  Error: " + e.getMessage());
			e.printStackTrace();
			fail("An unhandled exception occurred.  Error: " + e.getMessage());
		}
	}
}
