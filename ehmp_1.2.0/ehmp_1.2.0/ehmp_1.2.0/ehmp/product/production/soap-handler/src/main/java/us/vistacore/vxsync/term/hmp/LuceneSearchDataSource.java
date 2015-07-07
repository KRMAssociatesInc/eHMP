package us.vistacore.vxsync.term.hmp;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.miscellaneous.LimitTokenCountAnalyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.classic.QueryParser.Operator;
import org.apache.lucene.search.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.BytesRef;
import org.apache.lucene.util.Version;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Working on a supplemental DataSource that only provides search results using a custom Lucene index
 * which is built from other DataSources.
 * 
 * TODO: how to provide SAB list?
 * TODO: is there a way to package/compress/zip the lucene index?  
 * -- I don't think so.
 * 
 * TODO: Only create the writer if requested?
 * @author brian
 */
public class LuceneSearchDataSource extends AbstractTermDataSource {
	
	private static Logger log = LoggerFactory.getLogger(TermEng.class);
	
	private IndexWriter writer;
	private IndexSearcher searcher;
	private DirectoryReader reader;
	private Set<String> systems;
	private QueryParser parser;
	private Directory directory;

	private ITermDataSource src;
	
	public LuceneSearchDataSource(String luceneDir) throws IOException {
		this(FSDirectory.open(new File(luceneDir)));
	}

	public LuceneSearchDataSource(Directory indexDir) throws IOException {
		this.directory = indexDir;
		init(false);
	}
	
	/** 
	 * on-demand wrapper style constructor.  Will generate a lucene index from another
	 * ITermDataSource on the fly if it doesn't exist.
	 * @throws IOException 
	 */
	public LuceneSearchDataSource(ITermDataSource src, String luceneDir, boolean autoBuild) throws IOException {
		this(luceneDir);
		this.src = src;
		
		if (autoBuild && getCodeSystemList().isEmpty()) {
			// build
			log.info("Generating Lucene index for TermEng.  This may take a while but will only happen once. Location: {}", luceneDir);
			this.buildIndexFrom(src);
			
			// reinitalize
			close();
			init(true);
		}
	}
	
	
	protected void init(boolean write) throws IOException {
		// configure/initialize lucene
        Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_44);
        IndexWriterConfig conf = new IndexWriterConfig(Version.LUCENE_44, 
        		new LimitTokenCountAnalyzer(analyzer, Integer.MAX_VALUE));
        
        // if index doesn't exist, create it (otherwise you get an error trying to open the reader)
        if (write || !DirectoryReader.indexExists(directory)) {
			this.writer = new IndexWriter(directory, conf);
			this.writer.commit(); // for ensuring the index exists the first time
        }
		this.reader = DirectoryReader.open(directory);
		this.searcher = new IndexSearcher(this.reader);
		this.parser = new QueryParser(Version.LUCENE_44, "description", analyzer);
		this.parser.setDefaultOperator(Operator.AND);
		
		// get the unique SAB's
		Set<String> sabs = new HashSet<>();
		Fields fields = MultiFields.getFields(this.reader);
		if (fields != null) {
			Terms terms = fields.terms("sab");
			TermsEnum itr = terms.iterator(null);
			BytesRef bytes = null;
			while((bytes = itr.next()) != null) {
				String term = new String(bytes.bytes, bytes.offset, bytes.length);
				sabs.add(term);
			}
		}
		this.systems = Collections.unmodifiableSet(sabs);
	}
	
	@Override
	public boolean isSupported(TermDataSourceFeature feat) {
		return feat == TermDataSourceFeature.SEARCH
				|| feat == TermDataSourceFeature.LUCENE_SEARCH
				|| feat == TermDataSourceFeature.CHILDREN
				|| (src != null && src.isSupported(feat));
	}
	
	public List<String> search(Query q) {
		if (src != null && src.isSupported(TermDataSourceFeature.LUCENE_SEARCH)) return src.search(q);
		List<String> ret = new ArrayList<>();
		try {
			TopDocs results = searchDocs(q);
			for (ScoreDoc sdoc : results.scoreDocs) {
				Document doc = searcher.doc(sdoc.doc);
				ret.add(doc.get("urn"));
			}
		} catch (ParseException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	@Override
	public List<String> search(String text) {
		if (src != null && src.isSupported(TermDataSourceFeature.SEARCH)) return src.search(text);
		try {
			return search(this.parser.parse(text));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public DirectoryReader getReader() {
		return this.reader;
	}
	
	public TopDocs searchDocs(Query q) throws ParseException, IOException {
		return searcher.search(q, 1000);
	}
	
	@SuppressWarnings("unchecked")
	public void buildIndexFrom(ITermDataSource src) throws IOException {
		
		// close and re-open as writable index
		this.writer.close();
		this.reader.close();
		this.init(true);
		
		Iterator<String> itr = src.iterator();
		int count=0;
		while (itr.hasNext()) {
			String urn = itr.next();
			Map<String, Object> data = src.getConceptData(urn);
			// use the data map for efficiency
			Set<String> ancestors = (Set<String>) data.get("ancestors"); //same as src.getAncestorSet(urn);
			Set<String> parents = (Set<String>) data.get("parents"); // same as src.getParentSet(urn);
			Set<String> equiv = (Set<String>) data.get("sameas"); // same as src.getEquivalentSet(urn);
			List<Map<String, String>> terms = (List<Map<String, String>>) data.get("terms"); // same as src.getTermList(urn);
    		Map<String, Set<String>> rels = (Map<String, Set<String>>) data.get("rels"); // same as src.getRelMap(urn);
			
			// create the document
			String sab = TermEng.parseCodeSystem(urn).toLowerCase();
			UMLSBuildPolicy policy = UMLSBuildPolicy.getPolicy(sab);
			Document doc = new Document();
			doc.add(new StringField("urn", urn, Field.Store.YES));
			doc.add(new StringField("sab", sab, Field.Store.NO));
			doc.add(new StringField("code", TermEng.parseCode(urn), Field.Store.NO));
			if (data.containsKey("description"))
				doc.add(new TextField("description", data.get("description").toString(), Field.Store.YES));
			
			// add all the terms
    		if (terms != null) {
    			for (Map<String, String> term : terms) {
    				// sab-specific rules
    				if (policy.indexTerm(term)) {
		    			doc.add(new StringField("aui", term.get("aui").toString(), Field.Store.NO));
		    			doc.add(new StringField("cui", term.get("cui").toString(), Field.Store.NO));
		    			doc.add(new TextField("term", term.get("str").toString(), Field.Store.YES));
    				}
    			}
    		}
    		
    		// add the set lists
    		if (ancestors != null) {
	    		for (String s : ancestors) {
	    			doc.add(new StringField("ancestor", s, Field.Store.NO));
	    		}
    		}
    		if (parents != null) {
	    		for (String s : parents) {
	    			doc.add(new StringField("parent", s, Field.Store.NO));
	    		}
    		}
    		if (equiv != null) {
	    		for (String s : equiv) {
	    			doc.add(new StringField("sameas", s, Field.Store.NO));
	    		}
    		}
    		
    		// misc relations map
    		if (rels != null) {
				for (String urn2 : rels.keySet()) {
					for (String relstr : rels.get(urn2)) {
						doc.add(new StringField(relstr, urn2, Field.Store.NO));
					}
				}
    		}
    		
    		this.writer.addDocument(doc);
    		if (++count % 1000 == 0) {
    			System.out.println(count);
    		}
		}
		
		// close and re-open the writer/reader, but not the source DSN
		this.writer.close();
		this.reader.close();
		this.init(false);
	}
	
	@Override
	public void close() throws IOException {
		if (this.writer != null) {
			this.writer.close(true);
		}
		this.reader.close();
		
		if (src != null) {
			src.close();
		}
	}
	
	@Override
	public Set<String> getChildSet(String urn) {
		// parent probably can't do this efficiently, but if it supports it, go for it.
		if (src != null && src.isSupported(TermDataSourceFeature.CHILDREN)) 
			return src.getChildSet(urn);
		
		// otherwise use lucene to do this more effectively
		return new HashSet<String>(search(new TermQuery(new Term("parent", urn))));
	}

	@Override
	public Set<String> getCodeSystemList() {
		return systems;
	}

	@Override
	public Map<String, Object> getCodeSystemMap() {
		// delegate to parent (if available)
		if (src != null) return src.getCodeSystemMap();

		return Collections.emptyMap();
	}

	@Override
	public Map<String, Object> getConceptData(String urn) {
		// delegate to parent (if available)
		if (src != null) return src.getConceptData(urn);

		// otherwise derive what we can from the lucene index
		Query q = new TermQuery(new Term("urn", urn));
		Document doc = null;
		try {
			TopDocs results = this.searcher.search(q,  1);
			if (results.totalHits == 1) {
				doc = this.searcher.doc(results.scoreDocs[0].doc);
			}
		} catch (IOException ex) {
			ex.printStackTrace();
		}
		
		if (doc == null) return null;
		Map<String,Object> ret = new HashMap<>();
		for (IndexableField field : doc.getFields()) {
			ret.put(field.name(), doc.get(field.name()));
		}
		return ret;
	}
	
	public static void main(String[] args) throws Exception { 
		H2TermDataSource src = new H2TermDataSource(args[0]);
		LuceneSearchDataSource dest = new LuceneSearchDataSource(args[1]);
		
		dest.buildIndexFrom(src);
		
		src.close();
		dest.close();
	}
}
