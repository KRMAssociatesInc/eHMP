package us.vistacore.vxsync.term.hmp;

//import gov.va.cpe.vpr.vistasvc.CacheMgr;
//import gov.va.cpe.vpr.vistasvc.ICacheMgr;
import org.apache.lucene.search.Query;

import java.util.*;

/**
 * Major design thinking as of 8/2/2012:
 * 1) DataSources do most of the actual work, TermEng bundles multiple datasources together
 * 2) DataSources are not necessarily efficient, TermEng adds caching and some helper functions
 * 3) Most user interaction is between with TermEng, NOT the TermDataSource
 * 4) Concepts are fairly dumb, should delegate to TermEng to perform most of their work: isa/sameas/etc.
 * 5) We are heavily based on URN's
 * 
 * TODO: Need some sort of namespace aliasing mechanism, so that SCT,sct,SNOMEDCT,1.1234.5.2.43525 are al recognized as the same codeSystem
 */
public class TermEng implements ITermEng {
	private static TermEng INSTANCE;

    private List<ITermDataSource> fDataSources = new ArrayList<ITermDataSource>();
    private Map<String, Concept> fConceptMap = new WeakHashMap<String, Concept>();
    
//    ICacheMgr<Boolean> cache = new CacheMgr<Boolean>("termeng_isa");
    
    public TermEng(ITermDataSource dataSource) {
        this(new ITermDataSource[] {dataSource});
    }
    
    public TermEng(ITermDataSource[] dataSources) {
    	for (ITermDataSource dsn : dataSources) {
    		addDataSource(dsn);
    	}
    }
    
    // Static instance management ---------------------------------------------
    
	public static TermEng createInstance(ITermDataSource[] dsns) {
		INSTANCE = new TermEng(dsns.clone());
		return INSTANCE;
	}
	
	public static TermEng getInstance() {
		// TODO: How to ensure this is never null?
		return INSTANCE;
	}
	
	public static void setInstance(TermEng eng) {
		INSTANCE = eng;
	}
	
	// static helper functions ------------------------------------------------
	
	public static final String buildURN(String code, String codeSystem) {
		codeSystem = codeSystem.toLowerCase();
		if (codeSystem.equals("snomedct")) codeSystem = "sct";
		return "urn:" + codeSystem + ":" + code;
	}
	
	public static final String parseCode(String urn) {
		String[] parts = urn.split(":");
		return (parts.length >= 3) ? parts[2] : null;
	}

	public static final String parseCodeSystem(String urn) {
		String[] parts = urn.split(":");
		String ret = parts[1].toUpperCase();
		if (ret.equals("SCT")) ret = "SNOMEDCT";
		return ret;
	}

    // Data source registry/management ----------------------------------------
    
//    public void clearAllCache() {
//    	cache.removeAll();
//    }
    
    public void addDataSource(ITermDataSource... src) {
    	for (ITermDataSource s : src) {
    		fDataSources.add(s);
    	}
    }
    
	public ITermDataSource[] getDataSources() {
		return fDataSources.toArray(new ITermDataSource[fDataSources.size()]);
	}
    
	public ITermDataSource getDataSourceFor(String urn) {
		return getDataSourceFor(urn, null);
	}
	
	public ITermDataSource getDataSourceFor(String urn, TermDataSourceFeature feat) {
		for (ITermDataSource ds : fDataSources) {
			if (ds.contains(urn)) {
				if (feat == null || ds.isSupported(feat)) {
					return ds;
				}
			}
		}
		return null;
	}
	
    // Concept methods (implementation of ITermDataSource) --------------------
	
    @Override
	public boolean contains(String urn) {
        for (ITermDataSource d: fDataSources) {
        	if (d.contains(urn)) {
        		return true;
        	}
        }
        return false;
	}
    
	protected class ConceptImpl extends Concept {
		private static final long serialVersionUID = 299448826277621756L;
		protected ConceptImpl(String urn) {
			Map<String, Object> data = getConceptData(urn);
			this.urn = (String) data.get("urn");
	    	this.code = (String) data.get("code");
	    	this.codeSystem = (String) data.get("codeSystem");
	    	this.description = (String) data.get("description");
	    	this.terms = (List<Map<String, String>>) data.get("terms");
	    	this.rels = (Map<String, String>) data.get("rels");
	    	this.attributes = (Map<String, Object>) data.get("attributes");
	    	
	    	// sets
	    	this.sameas = (Set<String>) data.get("sameas");
	    	this.parents = (Set<String>) data.get("parents");
	    	this.ancestors = (Set<String>) data.get("ancestors");
		}
		
	    protected TermEng getEng() {
	    	return TermEng.this;
	    }
	}

    public Concept getConcept(String urn) {
    	if (!fConceptMap.containsKey(urn)) {
    		if (getConceptData(urn) == null) {
    			fConceptMap.put(urn, null); // So we're not trying to look it up every time.
    			return null;
    		}
    		fConceptMap.put(urn, new ConceptImpl(urn));
    	}
    	return fConceptMap.get(urn);
    }
    
	@Override
	public Map<String, Object> getConceptData(String urn) {
    	ITermDataSource dsn = getDataSourceFor(urn);
    	if (dsn == null) return null;
    	return dsn.getConceptData(urn);
	}
	
	@Override
	public Iterator<String> iterator() {
		throw new UnsupportedOperationException();
	}
	
	@Override
	public void close() throws java.io.IOException {
		for (ITermDataSource dsn : getDataSources()) {
			dsn.close();
		}
	}
	
	// ------------------------------------------------------------------------
	
	
	@Override
	public List<String> search(Query qry) {
		List<String> ret = new ArrayList<String>();
        for (ITermDataSource d: fDataSources) {
        	if (!d.isSupported(TermDataSourceFeature.LUCENE_SEARCH)) continue;
        	
        	List<String> results = d.search(qry);
        	if (results != null) {
        		ret.addAll(results);
        	}
        }
        return ret;
	}
	
	@Override
	public List<String> search(String text) {
		List<String> ret = new ArrayList<String>();
        for (ITermDataSource d: fDataSources) {
        	if (!d.isSupported(TermDataSourceFeature.SEARCH)) continue;
        	
        	List<String> results = d.search(text);
        	if (results != null) {
        		ret.addAll(results);
        	}
        }
        return ret;
	}
	
	@Override
	public boolean isSupported(TermDataSourceFeature feat) {
		return feat == TermDataSourceFeature.SEARCH || feat == TermDataSourceFeature.CHILDREN;
	}
	
	@Override
    public Set<String> getCodeSystemList() {
        Set<String> ret = new HashSet<String>();
        for (ITermDataSource d: fDataSources) {
            ret.addAll(d.getCodeSystemList());
        }
        return ret;
    }
	
	@Override
	public Map<String, Object> getCodeSystemMap() {
		Map<String, Object> ret = new HashMap<String, Object>();
		for (ITermDataSource d: fDataSources) {
			Map m = d.getCodeSystemMap();
			if (m != null) {
				ret.putAll(m);
			}
		}
		return ret;
	}
    
	// TODO: Brian B., please look this over and see that I'm not making any grossly wrong assumptions here about caching descriptions. I believe this has a significant cost during synching.
	@Override
	public String getDescription(String urn) {
		if(fConceptMap.containsKey(urn)) {
			if(fConceptMap.get(urn) != null) {
				return fConceptMap.get(urn).description;
			} else {
				return null;
			}
		}
		return getConcept(urn)!=null?getConcept(urn).description:null;
	}
	
	
	@Override
	public List<Map<String, String>> getTermList(String urn) {
    	ITermDataSource dsn = getDataSourceFor(urn);
    	if (dsn == null) return null;
    	return dsn.getTermList(urn);
	}
	
	// Set methods ------------------------------------------------------------

	@Override
    public Set<String> getEquivalentSet(String urn) {
    	ITermDataSource dsn = getDataSourceFor(urn);
    	if (dsn == null) return null;
    	return dsn.getEquivalentSet(urn);
    }
    
	@Override
	public Set<String> getParentSet(String urn) {
    	ITermDataSource dsn = getDataSourceFor(urn);
    	if (dsn == null) return null;
    	return dsn.getParentSet(urn);
	}
	
	@Override
	public Set<String> getChildSet(String urn) {
		ITermDataSource dsn = getDataSourceFor(urn, ITermDataSource.TermDataSourceFeature.CHILDREN);
		if (dsn == null) return null;
		return dsn.getChildSet(urn);
	}
    
	@Override
	public Set<String> getAncestorSet(String urn) {
    	ITermDataSource dsn = getDataSourceFor(urn);
    	if (dsn == null) return null;
    	return dsn.getAncestorSet(urn);
	}
	
	// TODO: probably create an object for this stuff....
	public Map<String,Set<String>> getRelMap(String urn) {
    	ITermDataSource dsn = getDataSourceFor(urn);
    	if (dsn == null) return null;
    	return dsn.getRelMap(urn);
	}
	
	// Comparison methods -----------------------------------------------------
	
	public boolean isa(String urn1, String urn2) {
		// if urn1 is unrecognized, return false
		ITermDataSource dsn = getDataSourceFor(urn1);
		if (dsn == null) {
			return false;
		}
		
//		String cacheKey = urn1 + "_ISA_" + urn2;
		Boolean ret = null; //= cache.fetch(cacheKey);
		if (ret == null) {
			// build the list of all ancestor sets to check
			Set<String> checkSet = new HashSet<String>();
			checkSet.add(urn1);
			checkSet.addAll(getEquivalentSet(urn1));
			
			ret = false;
			if (checkSet.contains(urn2)) {
				ret = true;
			} else {
				// next check the equivalence sets ancestors
				for (String set : checkSet) {
					Set<String> ancestors = getAncestorSet(set);
					if (ancestors != null && ancestors.contains(urn2)) {
						ret = true;
						break; // no need to check/fetch the rest
					}
				}
			}
//			cache.store(cacheKey, ret);
		}
		return ret;
	}
	
	public boolean isa(String urn1, Collection<String> urn2) {
		for (String s : urn2) {
			if (isa(urn1, s)) {
				return true;
			}
		}
		return false;
	}

	
	public boolean isa(String urn1, String... urn2) {
		return isa(urn1, Arrays.asList(urn2));
	}
	
	public boolean sameas(String urn1, String urn2) {
		return getEquivalentSet(urn1).contains(urn2);
	}
	
	
	// Private helper functions -----------------------------------------------
	

}
