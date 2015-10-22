package us.vistacore.vxsync.term.hmp;

import org.apache.lucene.search.Query;

import java.io.Closeable;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Interface for defining data sources for the terminology engine.
 * 
 * There are currently two major types of data 1) Mapping Sets, 2) Code Systems
 * 
 * Implementors may choose how do do many of the following things: 1) Data
 * Source (file, DB, WebService, etc.) 2) Source Data Format (XML, CSV, Tabular,
 * etc.) 3) Caching/Memory Mapping: Can the entire dataset fit into memory or
 * should it be paged to disk? 4) Lazy/Eager loading: Should the data set be
 * loaded all at once at the beginning? Or gradually as needed?
 * 
 * TODO: Should this interface be broken down into two seperate interfaces?
 * (Probably) TODO: CodeSystem needs an object and a registry.
 * 
 */
public interface ITermDataSource extends Iterable<String>, Closeable {
	
	public enum TermDataSourceFeature {
		/** Indicates datasource supports search() */
		SEARCH,
		/** Indicates datasource supports lucene search via search(Query) */
		LUCENE_SEARCH,
		/** Indicates datasource supports getChildSet() */
		CHILDREN, 
		/** Indicates datasource supports iterator() */
		ITERABLE;
	}

	public boolean contains(String urn);
	public Set<String> getCodeSystemList();
	public Map<String,Object> getCodeSystemMap();
	public boolean isSupported(TermDataSourceFeature feat);
	public List<String> search(String text); 
	public List<String> search(Query qry);
	
	public void close() throws IOException;
	
	/** 
	 * Iterates through all the URN's known to this datasource.
	 * @throws UnsupportedOperationException if not supported
	 */
	public Iterator<String> iterator();

	// Relationship methods ---------------------------------------------------

	public Set<String> getAncestorSet(String urn);
	public Set<String> getEquivalentSet(String urn);
	public Set<String> getParentSet(String urn);
	public Set<String> getChildSet(String urn);
	public List<Map<String, String>> getTermList(String urn);
	public Map<String, Set<String>> getRelMap(String urn);

	public String getDescription(String urn);
	
	/**
	 * Primary data mechanism, expects the following keys in the map:
	 * 
	 * Properties: urn*, code*, codeSystem*, description*, aui, cui
	 * Attributes: terms[aui, cui, lat, tty, str*, rank]*
	 * Relationships: sameas, ancestors, parents, rels
	 * * = required
	 */
	public Map<String, Object> getConceptData(String urn);
}
