package us.vistacore.vxsync.term.hmp;

import org.apache.lucene.search.Query;

import java.util.*;

public abstract class AbstractTermDataSource implements ITermDataSource {
	
	@Override
	public boolean isSupported(TermDataSourceFeature feat) {
		return false;
	}
	
	@Override
	public List<String> search(String text) {
		return null;
	}
	
	@Override
	public List<String> search(Query qry) {
		return null;
	}
	
	
	@Override
	public boolean contains(String urn) {
		return getConceptData(urn) != null;
	}

	@Override
	public String getDescription(String urn) {
		Map<String, Object> data = getConceptData(urn);
		if (data != null && data.containsKey("description")) {
			return (String) data.get("description");
		}
		return null;
	}
	
	@Override
	public List<Map<String, String>> getTermList(String urn) {
		Map<String, Object> data = getConceptData(urn);
		if (data != null && data.containsKey("terms")) {
			return (List<Map<String, String>>) data.get("terms");
		}
		return new ArrayList<>();
	}
	
	@Override
	public Set<String> getAncestorSet(String urn) {
		Map<String, Object> data = getConceptData(urn);
		if (data != null && data.containsKey("ancestors")) {
			return (Set<String>) data.get("ancestors");
		}
		return new HashSet<String>();
	}

	@Override
	public Set<String> getEquivalentSet(String urn) {
		Map<String, Object> data = getConceptData(urn);
		if (data != null && data.containsKey("sameas")) {
			return (Set<String>) data.get("sameas");
		}
		return new HashSet<String>();
	}

	@Override
	public Set<String> getParentSet(String urn) {
		Map<String, Object> data = getConceptData(urn);
		if (data != null && data.containsKey("parents")) {
			return (Set<String>) data.get("parents");
		}
		return new HashSet<String>();
	}
	
	@Override
	public Set<String> getChildSet(String text) {
		throw new UnsupportedOperationException();
	}
	
	@Override
	public Map<String, Set<String>> getRelMap(String urn) {
		Map<String, Object> data = getConceptData(urn);
		if (data != null && data.containsKey("rels")) {
			return (Map<String,Set<String>>) data.get("rels");
		}
		return new HashMap<String,Set<String>>();
	}
	
	@Override
	public Iterator<String> iterator() {
		throw new UnsupportedOperationException();
	}

}
