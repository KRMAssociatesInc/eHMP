package us.vistacore.vxsync.term.hmp;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 
 * Major design thoughts as of 8/2/2012:
 * 1) Strongly discourage use of constructor, these instances should only come from TermEng which maintains a registry of them 
 * 2) working towards being able to use == for exact comparison, and .equals is the sameas()
 * 3) Most of this class is really just syntactic sugar
 * 4) These are definately immutable
 * 5) main difference between the set functions and map functions (parentSet() vs parentMap() is that map includes description)
 * 
 * 
 * TODO: Add generic attribute storage
 * 
 * @author brian
 */
public abstract class Concept implements Serializable {
	private static final long serialVersionUID = 2936381812355550331L;
	
	protected String urn;
	protected String code;
	protected String codeSystem;
	protected String description;
	protected Map<String, Object> attributes;
	protected List<Map<String,String>> terms;
	protected Map<String,String> rels;
	protected Set<String> sameas;
	protected Set<String> parents;
	protected Set<String> ancestors;

    protected abstract TermEng getEng();
    
    // Getters ----------------------------------------------------------------
    
    public String getURN() {
    	return this.urn;
    }
    
    public String getCode() {
    	return this.code;
    }
    
    public String getCodeSystem() {
    	return this.codeSystem;
    }
    
    public String getDescription() {
    	return this.description;
    }
    
    public Map<String, Object> getAttributes() {
    	return this.attributes;
    }
    
    public List<Map<String,String>> getTerms() {
    	return this.terms;
    }
    
    public Map<String,String> getRelationships() {
    	return this.rels;
    }


    // Domain logic -----------------------------------------------------------
    
    public Concept getMappingTo(String targetCodeSystem) {
    	Set<String> set = getEquivalentSet();
    	for (String s : set) {
    		if (s.startsWith("urn:" + targetCodeSystem)) {
    			return getEng().getConcept(s);
    		}
    	}
    	return null;
    }

    public boolean isa(Concept c) {
    	return isa(c.getURN());
    }
    
    public boolean isa(String urn) {
    	return getEng().isa(this.getURN(), urn);
    }
    
	public boolean sameas(Concept c) {
		return sameas(c.getURN());
	}
	
	public boolean sameas(String urn) {
		return getEng().sameas(this.getURN(), urn);
	}
	
    @Override
    public boolean equals(Object obj) {
    	if (obj instanceof Concept) {
    		return sameas((Concept) obj);
    	} else if (obj instanceof String) {
    		return sameas((String) obj);
    	}
    	return false;
    }
    
    @Override
    public String toString() {
    	return getURN();
    }
    
    // Set/map functions ------------------------------------------------------
    
    public Set<String> getEquivalentSet() {
    	return sameas;
    }
    
    public Map<String, String> getEquivalentMap() {
    	return buildMap(getEquivalentSet());
    }
    
    public Set<String> getParentSet() {
    	return parents;
    }
    
    public Map<String, String> getParentMap() {
    	return buildMap(getParentSet());
    }
    
    public Set<String> getAncestorSet() {
    	return ancestors;
    }
    
    public Map<String, String> getAncestorMap() {
    	return buildMap(getAncestorSet());
    }
    
    public Map<String, Object> getAncestorTree() {
    	return buildAncestorTree(parents);
    }
    
    private Map<String, Object> buildAncestorTree(Set<String> parents) {
    	if (parents == null || parents.isEmpty()) return null;
    	Map<String, Object> ret = new HashMap<>();
    	TermEng eng = getEng();
    	for (String key : parents) {
    		ret.put(key + ":" + eng.getDescription(key), buildAncestorTree(eng.getParentSet(key)));
    	}
    	return ret;
    }
    
    /**
     * Returns relationships by type,urn,description
     * @return
     */
    public Map<String, Map<String, String>> getRelationshipTree() {
    	Map<String,Map<String,String>> ret = new HashMap<String,Map<String,String>>();
    	Map<String,String> rels = getRelationships();
    	if (rels == null) return ret;
    	for (String urn : rels.keySet()) {
    		String rel = rels.get(urn);
    		if (!ret.containsKey(rel)) {
    			ret.put(rel, new HashMap<String,String>());
    		}
    		ret.get(rel).put(urn, getEng().getDescription(urn));
    	}
    	
    	return ret;
    }
    
    // private helpers ---------------------------------------------------------
    
    private Map<String, String> buildMap(Set<String> set) {
    	HashMap<String, String> data = new HashMap<String, String>();
    	for (String s : set) {
    		data.put(s, getEng().getDescription(s));
    	}
    	return data;
    }
}