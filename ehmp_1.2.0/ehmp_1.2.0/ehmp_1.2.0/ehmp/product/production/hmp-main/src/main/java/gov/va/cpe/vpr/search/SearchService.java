package gov.va.cpe.vpr.search;

import gov.va.cpe.vpr.frameeng.*;
import gov.va.cpe.vpr.frameeng.Frame.FrameException;
import gov.va.cpe.vpr.frameeng.FrameAction.URLActionMenuItem;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.search.PatientSearch.SearchMode;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;

import gov.va.hmp.auth.UserContext;
import gov.va.hmp.access.IPolicyDecisionPoint;
import org.apache.commons.collections.MapUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrException;
import org.apache.solr.common.params.DisMaxParams;
import org.apache.solr.common.params.HighlightParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class SearchService implements ISearchService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SearchService.class);

    public static final String PID = "pid";
    public static final String UID = "uid";
    public static final String DOMAIN = "domain";
    public static final String KIND = "kind";
    public static final String SUMMARY = "summary";
    public static final String QUALIFIED_NAME = "qualified_name";
    public static final String DATETIME = "datetime";
    public static final String FACILITY = "facility_name";
    public static final String PHRASE = "phrase";
    public static final String URL_FIELD = "url";

    private SolrServer solrServer;
    private FrameRunner runner;
    private UserContext userContext;
    private IPolicyDecisionPoint pdp;

    @Autowired
    public void setSolrServer(SolrServer solrServer) {
        this.solrServer = solrServer;
    }

    @Autowired
    public void setRunner(FrameRunner runner) {
        this.runner = runner;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setPolicyDecisionPoint(IPolicyDecisionPoint pdp) {
        this.pdp = pdp;
    }

    // public search methods  -------------------------------------------------

    public SolrServer getSolrServer() {
        return solrServer;
    }

    public PatientSearch textSearchByPatient(String query, String vprPatient, Map<String, Object> filters) throws SolrServerException, FrameException {
        PatientSearch results = new PatientSearch(userContext.getCurrentUser(), query, vprPatient, SearchMode.SEARCH);

        if (filters != null) {
            // set debug flag (if any)
            if (filters.containsKey("debug")) {
                results.setDebugEnabled(MapUtils.getBooleanValue(filters, "debug"));
            }

            // add the filters (if defined)
            for (String key : filters.keySet()) {
                results.addFilter(key, filters.get(key));
            }
        }

        gatherResults(results, null);
        return results;
    }

    public List<SuggestItem> textSuggestByPatient(String query, String vprPatient) throws SolrServerException, FrameException {
        List<SuggestItem> ret = new ArrayList<>();

        // run frames to find suggestions
        PatientSearch results = new PatientSearch(userContext.getCurrentUser(), query, vprPatient, SearchMode.SUGGEST);
        gatherResults(results, null);
        ret.addAll(results.getSuggestions());

        // sort the results and highlight the keywords
        Collections.sort(ret, Collections.reverseOrder());
        for (SuggestItem item : ret) {
            item.setDisplay(highlight(item.getDisplay(), results.getQueryStr(), "<b>", "</b>"));
        }

        // always start with a generic search response
        String disp = "Search for: \"" + query + "\"";
        ret.add(0, new SuggestItem(query, disp, null));
        return ret;
    }

    public List<SuggestItem> textBrowseByPatient(String query, String vprPatient, String frameID) throws SolrServerException, FrameException {
        List<SuggestItem> ret = new ArrayList<>();

        // run frames to find suggestions
        PatientSearch results = new PatientSearch(userContext.getCurrentUser(), query, vprPatient, SearchMode.BROWSE);
        gatherResults(results, frameID);
        ret.addAll(results.getSuggestions());

        for (SuggestItem item : ret) {
            item.setDisplay(highlight(item.getDisplay(), results.getQueryStr(), "<b>", "</b>"));
        }
        return ret;
    }

    @Override
    public Map<String, List<String>> doSearchHighlight(String uid, String searchTerm) throws SolrServerException {
        // query SOLR for exact document match, enable highlighting on all eligible fields
        // fragSize and maxAnalizedChars are important so there is only a single fragment per field match
        // requireFieldMatch and preserveMulti are important so that fields are returned in original order
        SolrQuery q = new SolrQuery('"' + searchTerm + '"');
        q.addFilterQuery("uid:" + ClientUtils.escapeQueryChars(uid));
        q.setFields("uid");
        q.setHighlight(true);
        q.addHighlightField("*");
        q.setHighlightFragsize(0);
        q.setHighlightSnippets(1000);
        q.setHighlightRequireFieldMatch(false);
        q.set(HighlightParams.PRESERVE_MULTI, true);
        q.set(HighlightParams.MAX_CHARS, 100_000);

        // this is to mimic the document search functionality in GoldSearchFrame
        q.set("defType", "synonym_edismax");
        q.set("synonyms", true);
        q.set(DisMaxParams.QS, 4);
        q.set(DisMaxParams.QF, "all");

        QueryResponse resp = solrServer.query(q);
        if (resp == null || resp.getHighlighting() == null) return null;
        Map<String, List<String>> highlights = resp.getHighlighting().get(uid);
        if (highlights != null && !highlights.isEmpty()) {
            return highlights;
        }
        return null;
    }

    /**
     * Highlights a term in a string by wrapping it with the specified values, returns original otherwise
     */
    private static String highlight(String str, String term, String left, String right) {
        if (str != null && term != null) {
            int idx = str.toLowerCase().indexOf(term.toLowerCase());
            if (idx > -1) {
                StringBuilder sb = new StringBuilder(str);
                sb.insert(idx, left);
                sb.insert(idx + term.length() + 3, right);
                return sb.toString();
            }
        }
        return str;
    }

    /**
     * Execute all the searchers, gather and combine the results into SearchPatientResults
     */
    private void gatherResults(PatientSearch results, String browseFrameID) throws SolrServerException, FrameException {
        // execute any frames that want to participate in the search
        Map<String, Object> params = Table.buildRow("pid", results.pid);
        IFrameEvent<?> event = null;
        if (browseFrameID != null) {
            // browse mode is calling upon a single frame via a callEvent
            event = new CallEvent<>(browseFrameID, results);
        } else {
            // search and suggest mode invoke any/all valid frames
            event = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, results, params);
        }
        FrameJob job = runner.exec(event);
        results.resultJob = job;
        
        // this happens sometimes with JRebel where all the frames in the FrameRunner are lost
        if (job.getFrames().size() == 0) {
        	throw new IllegalStateException("No search frames triggered, invalid state?");
        }

        // process the different actions that we recognize (SummaryItem, SolrSearchAction) 
        for (FrameTask task : job.getSubTasks()) {
            for (FrameAction action : task.getActions()) {
                // for debugging purposes, tag each result with the frameID that it came from.
                String frameID = task.getFrame().getID();

                if (SummaryItem.class.isInstance(action)) {
                    SummaryItem summary = (SummaryItem) action;
                    results.addResults(summary.setProp("frameID", frameID));
                } else if (SuggestItem.class.isInstance(action)) {
                    SuggestItem suggest = (SuggestItem) action;
                    results.addSuggestion(suggest.setProp("frameID", frameID));
                } else if (URLActionMenuItem.class.isInstance(action)) {
                    // convert menu item to summaryitem
                    URLActionMenuItem item = (URLActionMenuItem) action;
                    SummaryItem summary = new SummaryItem(item.getUrl());
                    summary.kind = "Infobutton";
                    summary.type = "Website";
                    summary.summary = item.getHeading() + ": " + item.getTitle();
                    if (!StringUtils.isEmpty(item.getSubTitle())) {
                        summary.summary += " (" + item.getSubTitle() + ")";
                    }
                    summary.where = item.getHeading();
                    summary.detailType = "window";
                    summary.detailCfg = Table.buildRow("url", item.getUrl());
                    results.addResults(summary.setProp("frameID", frameID));
                } else if (SolrSearchAction.class.isInstance(action)) {
                    SolrSearchAction solrAction = (SolrSearchAction) action;

                    // execute the SolrQuery (unless the frame already ran it) and merge the response
                    QueryResponse resp = solrAction.getResponse();
                    if (resp == null) {
                        resp = execSolrQuery(results, solrAction.getQuery());
                    }
                    mergeFacetData(results, resp);

                    // convert the results to SummaryItems and add them to all the results
                    List<SummaryItem> items = solrAction.createSummaryItems(resp);
                    if (items != null && !items.isEmpty()) {
                        for (SummaryItem item : items) {
                            results.addResults(item.setProp("frameID", frameID));
                        }
                    }
                }
            }
        }

        if (results.errorMessage.length() > 0) return;
    }

    /**
     * Execute the specified SolrQuery capture any errors into SearchPatientResults.  Returns NULL if error
     */
    private QueryResponse execSolrQuery(PatientSearch results, SolrQuery query) {
        try {
            return solrServer.query(query);
        } catch (SolrServerException e) {
            results.errorMessage = e.getMessage();
        }
        return null;
    }

    /**
     * merge the facet data from the QueryResponse into the PatientSearch result
     */
    private void mergeFacetData(PatientSearch results, QueryResponse response) {
        try {
            results.elapsed += response.getQTime();

            // gather/sum facet queries
            Map<String, Integer> facets = response.getFacetQuery();
            if (facets != null) {
                for (String key : facets.keySet()) {
                    results.incFacetCount(key, facets.get(key));
                }
            }

            // gather/sum/total the facet fields
            List<FacetField> fields = response.getFacetFields();
            if (fields != null) {
                for (FacetField field : fields) {
                    List<Count> counts = field.getValues();
                    for (Count count : counts) {
                        String key = field.getName() + ":" + count.getName();
                        results.incFacetCount(key, (int) count.getCount());
                    }
                }
            }
        } catch (SolrException e) {
            results.errorMessage = e.getMessage();
        }
    }
}