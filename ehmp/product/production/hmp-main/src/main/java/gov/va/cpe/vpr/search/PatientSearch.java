package gov.va.cpe.vpr.search;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.RelativeDateTimeFormat;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.springframework.util.StringUtils;

import java.util.*;

import static gov.va.cpe.vpr.search.SearchService.*;


/**
 * Represents a user search request/response.  Gets passed around to all the frames to execute in multiple ways and to
 * gather the results up before sending back to the user.
 * 
 */
public class PatientSearch {

    private HmpUserDetails user;

	// query string info
	private String query = "";
	private String original = "";
	private String altQuery = "";
	public String codedValue;
	private Map<String, String> prefixedQueryMap;
	public String pid = "";

	// filter/facet info
	private Map<String, Integer> facets = new HashMap<String, Integer>();
	private Map<String, String> facetsNames = new HashMap<String, String>();
	private Map<String, Object> filters;
	
	// results
	private List<SuggestItem> suggestions = new ArrayList<>();
	private Set<SummaryItem> foundItems = new TreeSet<>();
	protected FrameJob resultJob;
	
	// meta data
    public List<String> corrections = new ArrayList<String>();
    public String errorMessage = "";
	public int elapsed = 0;
	public int foundItemsTotal = 0; // # of found items * the count of each item 
	private int unfilteredTotal = 0; // if domain filteres were removed, this is the total items that exist
	private SearchMode mode;
	private boolean debug = false;
	
	public enum SearchMode {
		SEARCH, // full search results 
		SUGGEST, // populate suggestion drop-down 
		BROWSE, // similar to suggest, but for drilling in on a single frame
		LIST // similar to search, but listing an entire domain's values for a patient
	}
	
	/** constructor to essentially copy one search to another */
	public PatientSearch(PatientSearch search, String querystr, SearchMode mode) {
		this(search.getUser(), querystr, search.pid, mode);
		search.setDebugEnabled(search.isDebugEnabled());
		this.codedValue = search.codedValue;
		this.filters = search.filters;
	}
	
	public PatientSearch(HmpUserDetails user, String search, String pid, SearchMode mode) {
        this.user = user;
		this.pid = pid;
		this.mode = mode; 
		setQueryString(this.original = search);
		
		// Initialize/compute the date-range facets
		facets.put("all", 0);
		facetsNames.put("{!ex=dt}datetime:[* TO *]", "all");
    	for (String s : Arrays.asList("T-24h","T-72h","T-7d","T-1m","T-3m","T-1y","T-2y")) {
    		String str = "{!ex=dt}datetime:[" + RelativeDateTimeFormat.parse(s) + " TO *]";
    		facetsNames.put(str, s);
    	}
	}

	// getters/setters --------------------------------------------------------

    public HmpUserDetails getUser() {
        return user;
    }

    @Deprecated
	public boolean isSuggestOnly() {
		return mode != SearchMode.SEARCH && mode != SearchMode.BROWSE;
	}
	
	public SearchMode getSearchMode() {
		return this.mode;
	}
	
	public boolean isSearchMode(SearchMode mode) {
		return this.mode == mode;
	}
	
	public void setDebugEnabled(boolean val) {
		this.debug = val;
	}
	
	public boolean isDebugEnabled() {
		return this.debug;
	}
	
	public String getQueryStr() {
		return this.query;
	}
	
	public String getAltQueryStr() {
		return this.altQuery;
	}
	
	public void setAltQueryStr(String str) {
		this.altQuery = str;
	}
	
	public int getUnfilteredTotal() {
		return unfilteredTotal;
	}
	
	public void setQueryString(String str) {
		this.query = parseQueryStr(str).toLowerCase();
	}
	
	public boolean hasPrefixedQueryStr(String prefix) {
		 return prefixedQueryMap != null && prefixedQueryMap.containsKey(prefix);
	}
	
	public String getPrefixedQueryStr(String prefix) {
		if (prefixedQueryMap != null && prefixedQueryMap.containsKey(prefix)) {
			return prefixedQueryMap.get(prefix);
		}
		return null;
	}
	
	public Map<String, String> getPrefixedQueryMap() {
		return prefixedQueryMap;
	}
	
	public void addResults(SummaryItem... item) {
		addResults(Arrays.asList(item));
	}
	
	public void addResults(Collection<SummaryItem> items) {
		this.foundItems.addAll(items);
		for (SummaryItem item : items) {
			this.foundItemsTotal += Math.abs(item.count); 
		}
	}
	
	public FrameJob getResultsJob() {
		return resultJob;
	}
	
	public boolean hasResults() {
		return !this.foundItems.isEmpty();
	}
	
	public List<SummaryItem> getResults() {
		List<SummaryItem> ret = new ArrayList<SummaryItem>(this.foundItems);
		Collections.sort(ret);
		return ret;
	}
	
	public List<SuggestItem> getSuggestions() {
		return this.suggestions;
	}
	
	public SuggestItem addSuggestion(SuggestItem item) {
		this.suggestions.add(item);
		return item;
	}
	
	public String getOriginalQueryStr() {
		return this.original;
	}
	
	public void addFilter(String key, Object val) {
		if (filters == null) filters = new HashMap<>();
		filters.put(key, val);
	}
	
	/**
	 * Create/Increment facet counts.  Normally each SOLR query calls this
	 * but it can be manually tweaked too.
	 * 
	 * Key can either be the exact facet name or translated from the facetNames
	 */
	public void incFacetCount(String key, int by) {
		// if the key does not exist, attempt to translate
		if (this.facetsNames.containsKey(key)) {
			key = this.facetsNames.get(key);
		}
		if (key == null) return;
		
		if ("all".equals(key)) {
			this.unfilteredTotal += by;
		}
		
		int curval = 0;
		if (this.facets.containsKey(key)) {
			curval = this.facets.get(key);
		}
		this.facets.put(key, curval + by);
	}
	
	public Map<String, Integer> getFacets() {
		return facets;
	}
	
	/** returns true if the specified filter has been set */
	public boolean hasFilter(String key) {
		return filters != null && filters.containsKey(key) && !StringUtils.isEmpty(filters.get(key));
	}
	
	public Map<String, Object> getFilters() {
		return this.filters;
	}
	
	public String getFilter(String key) {
		if (!hasFilter(key)) return null;
		Object ret = filters.get(key);
		if (ret instanceof Collection) {
			ret = StringUtils.collectionToCommaDelimitedString((Collection<?>) ret);
		} else if (ret.getClass().isArray()) {
			ret = StringUtils.arrayToCommaDelimitedString((Object[]) ret);
		}
		return ret.toString();
	}
	
	private String parseQueryStr(String str) {
		Map<String,String> map = new HashMap<>();
		String ret = "";
		
		// parse the prefixed bits out
//		str = (StringUtils.isEmpty(str)) ? "" : str;
		String[] words = StringUtils.tokenizeToStringArray(str, " ", true, true);
		String curPrefix=null;
		for (String word : words) {
			if (word.endsWith(":")) {
				curPrefix = word;
				map.put(curPrefix, "");
			} else if (curPrefix != null) {
				ret += " " + word;
				map.put(curPrefix, (map.get(curPrefix) + " " + word).trim());
			} else {
				ret += " " + word;
			}
		}
		
		prefixedQueryMap = map;
		return ret.trim();
	}
	
	/** Returns true if the specified type should be included in the search results */
	public boolean searchType(String type) {
		if (!hasFilter("types")) return true;

		String types = getFilter("types").toLowerCase();
		return StringUtils.commaDelimitedListToSet(types).contains(type.toLowerCase());
	}
	
	public SolrQuery initQuery() {
		// create default SOLR query
		SolrQuery query = new SolrQuery(ClientUtils.escapeQueryChars(getQueryStr()));
		query.addFilterQuery("pid:" + pid); // specific to the current patient
		query.setParam("q.op", "AND"); 
		query.setRows(101); // limit to 100 rows
		
		// default fields to fetch
		query.setFields(UID, DATETIME, SUMMARY, URL_FIELD, DOMAIN, KIND, FACILITY);
		
		// apply range filter (if specified)
		if (hasFilter("range")) {
			String range = getFilter("range");
			query.addFilterQuery("{!tag=dt}datetime:[" + new PointInTime(range) + " TO *]");
		}
		
		// apply kind(s) filter (if specified)
		if (hasFilter("kinds")) {
			Set<String> kinds = StringUtils.commaDelimitedListToSet(getFilter("kinds"));
			String kindFilter = StringUtils.collectionToDelimitedString(kinds, " OR ", "\"", "\"");
			query.addFilterQuery("kind:(" + kindFilter + ")");
		}

		// apply types filter (if specified)
		if (hasFilter("types")) {
			Set<String> types = StringUtils.commaDelimitedListToSet(getFilter("types"));
			String typeFilter = StringUtils.collectionToDelimitedString(types, " OR ", "\"", "\"");
			query.addFilterQuery("{!tag=domain}domain:(" + typeFilter + ")");
		}
		
		// add date range facets
    	for (String s : facetsNames.keySet()) {
    		query.addFacetQuery(s);
    	}
    	
    	query.addFacetField("{!ex=domain}domain");
    	query.setFacetMinCount(1);
    	
    	// extra debug stuff
    	if (isDebugEnabled()) {
    		query.set("debug", "true");
    	}

//    	System.out.println(URLDecoder.decode(query.toString()));
		return query;
	}
	
	public static class SummaryItem implements FrameAction, Comparable<SummaryItem> {
	    public String uid;
	    public String datetime;
	    public String summary;
	    public String type;
	    public String kind;
	    public String where;
        @JsonIgnore
        public List<Map<String,Object>> solrDocs;
	    @JsonIgnore
	    public List<? extends IPOMObject> objs;
	    public List<String> highlights;
	    public Map<String, Object> detailCfg;
	    public String detailType;
	    
	    /** Number of items represented by this SummaryItem.  Can be negative, which doesn't show the badge */
	    public long count;

        private Map<String, Object> props = new HashMap<>();

        public SummaryItem(String uid) {
	    	this.uid = uid;
		}
	    
	    public List<String> getHighlights() {
			return highlights;
		}
	    
	    /** 
	     * If set by a search result, domain objects this summary references
	     * Not serialized, mostly useful if you want to use the domain objects in the
	     * display template
	     */
	    @JsonIgnore
	    public List<? extends IPOMObject> getObjs() {
			return objs;
		}
	    
	    @JsonAnyGetter
	    public Map<String, Object> getProps() {
			return props;
		}
	    
	    public SummaryItem setProp(String key, Object val) {
	    	this.props.put(key, val);
	    	return this;
	    }
	    
	    @Override
	    public boolean equals(Object obj) {
	    	return obj instanceof SummaryItem && ((SummaryItem) obj).uid.equals(uid);
	    }

        @Override
        public int hashCode() {
            return uid.hashCode();
        }

        @Override
		public int compareTo(SummaryItem o) {
			int comp = type.compareTo(o.type);
			if (comp == 0 && datetime != null && o.datetime != null) {
				comp = datetime.compareTo(o.datetime)*-1;
			}
			// crazy map sorting problem can occur if !this.equals(0) && this.compareTo(0) == 0 as per Comparable interface docs.
			if (comp == 0) {
				return uid.compareTo(o.uid);
			}
			return comp;
		}
	}
	
	public static class SuggestItem implements FrameAction, Comparable<SuggestItem>{
		private String query; // the full query string
	    private String display; // display
	    private String category; // category (rendered as an amazon style "in department x" search)
	    private String type; // suggest type (rendered as a badge)
	    private Map<String, Object> props = new HashMap<>();
		private SortCat sortCat = SortCat.SUGGEST;
		private Number sortVal = 0.0f;
	    
	    public SuggestItem(String query, String display, String type) {
	    	this.query = query;
	    	this.display = display;
	    	this.type = type;
		}
	    
	    public SuggestItem setCategory(String cat) {
	    	this.category = cat;
	    	return this;
	    }
	    
	    public String getQuery() {
			return query;
		}
	    
	    public String getDisplay() {
			return display;
		}
	    
	    public String getType() {
	    	return type;
	    }
	    
	    public void setDisplay(String display) {
			this.display = display;
		}
	    
	    public String getCategory() {
			return category;
		}
	    
	    @JsonAnyGetter
	    public Map<String, Object> getProps() {
			return props;
		}
	    
	    public SuggestItem setProp(String key, Object val) {
	    	this.props.put(key, val);
	    	return this;
	    }
	    
	    public SuggestItem setSort(SortCat sortCat, Number sortVal) {
	    	this.sortCat = sortCat;
	    	this.sortVal = sortVal;
	    	return this;
	    }

		@Override
		public int compareTo(SuggestItem o) {
			int comp = Integer.compare(this.sortCat.getVal(), o.sortCat.getVal());
			if (comp == 0) {
				comp = Float.compare(this.sortVal.floatValue(), o.sortVal.floatValue());
			}
			return comp;
		}
		
		@Override
		public String toString() {
			return String.format("{query=%s, display=%s, type=%s, category=%s}", query, display, type, category);
		}
		
		public static enum SortCat {
			SMART(3), SUGGEST(2), SPELL(1);
			
			private int val;
			SortCat(int val) {
				this.val = val;
			}
			
			public int getVal() {
				return val;
			}
		}
	}
}
