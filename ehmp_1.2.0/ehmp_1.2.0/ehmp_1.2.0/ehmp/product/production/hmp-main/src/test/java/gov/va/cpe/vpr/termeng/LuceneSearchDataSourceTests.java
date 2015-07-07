package gov.va.cpe.vpr.termeng;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;

import java.io.FileReader;
import java.io.IOException;
import java.io.LineNumberReader;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.springframework.web.client.RestTemplate;

public class LuceneSearchDataSourceTests {
    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();
	
	private LuceneSearchDataSource ds;
	private H2TermDataSource h2;

	@Before
	public void before() throws IOException, SQLException, ClassNotFoundException {
		// create luene data source
		Directory dir = new RAMDirectory();
		ds = new LuceneSearchDataSource(dir);
		
		// create a temporary h2 data source with 1 record
		h2 = new H2TermDataSource("jdbc:h2:mem:termdb");
		Map<String, Object> term = new HashMap<String,Object>();
		term.put("urn", "urn:foo:1234");
		term.put("description", "hello world");
		term.put("parents", new HashSet<>(Arrays.asList("urn:foo:0")));
		h2.save(term);
		h2.commit();
	}
	
	@After
	public void after() throws SQLException, IOException {
		ds.close();
		h2.close();
	}
	
	@Test
	public void testSearch() throws IOException, ParseException {
		ds.buildIndexFrom(h2);
	
		// search by field
		List<String> ret = ds.search("code:1234");
		assertEquals(1, ret.size());
		assertTrue(ret.contains("urn:foo:1234"));
		
		// by sab
		ret = ds.search(new TermQuery(new Term("sab", "foo")));
		assertEquals(1, ret.size());
		assertTrue(ret.contains("urn:foo:1234"));

		// search by urn 
		ret = ds.search(new TermQuery(new Term("urn", "urn:foo:1234")));
		assertEquals(1, ret.size());
		assertTrue(ret.contains("urn:foo:1234"));
		
		// search by 2 fields
		ret = ds.search("+sab:FOO +code:1234");
		assertEquals(1, ret.size());
		assertTrue(ret.contains("urn:foo:1234"));
		
		// text search
		ret = ds.search("description:world");
		assertEquals(1, ret.size());
		assertTrue(ret.contains("urn:foo:1234"));
	}
	
	@Test
	public void testSABList() throws SQLException, IOException {
		// sab should be empty at first
		assertTrue(ds.getCodeSystemList().isEmpty());
		
		// write it to lucene
		ds.buildIndexFrom(h2);
		
		// now should have "foo"
		assertEquals(1, ds.getCodeSystemList().size());
		assertTrue(ds.getCodeSystemList().contains("foo"));
	}
	
	@Test
	public void testChildList() throws IOException {
		ds.buildIndexFrom(h2);
		assertTrue(ds.getChildSet("urn:foo:0").contains("urn:foo:1234"));
	}
	
	/** experiemental function for processing fileman output into synonymns.txt */
	@Test
	@Ignore
	public void generateSynsFromFileMan() throws IOException {
		String file = "C:/users/brian/desktop/session.log";
		LineNumberReader reader = new LineNumberReader(new FileReader(file));
		StringBuilder sb = new StringBuilder();
	
		System.out.println("Scanning: " + file);
		int count=0;
		String name = null, line = reader.readLine();
		while (line != null) {
			if (line.startsWith("    ")) {
				// indented entry, indicates its a synonymn
				sb.append("|");
				sb.append(line.trim());
			} else {
				// new entry
				if (sb.length() > 0) System.out.println(name + sb);
				sb.setLength(0);
				name = line.trim();
			}
			line = reader.readLine();
			if (++count > 1_000_000) break;
		}
		System.out.println(sb);
		
		System.out.println("Done.  Entries: " + count);
	}
	
	
	/** simple util I used to generate synonyms.txt */
	@Test
	@Ignore
	public void generateSynonymnList() {
		JdsTemplate tpl = new JdsTemplate();
		tpl.setRestTemplate(new RestTemplate());
		tpl.setJdsUrl("http://localhost:9080");
		String url = "/data/index/orderable-types";
		System.out.println("Fetching URL: " + url);
		// System.out.println(tpl.getForString(url));
		List<Map> ret = tpl.getForList(Map.class, url);
		System.out.println("Count: " + ret.size());
		for (Map map : ret) {
			if (map.containsKey("synonym")) {
				String line = escape((String) map.get("name"));
				for (Map syn : ((List<Map>) map.get("synonym"))) {
					line += "," + escape((String) syn.get("name"));
				}
				System.out.println(line.toLowerCase());
			}
		}
	}
	
	private static final String escape(String str) {
		return str.replace(",", "\\,").toLowerCase();
	}
	
}
