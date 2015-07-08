package gov.va.cpe.vpr.search;

import gov.va.cpe.vpr.frameeng.Frame.FrameException;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.hmp.jsonc.JsonCCollection;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.solr.client.solrj.SolrServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class SearchController {

    @Autowired
    ISearchService searchService;

    @RequestMapping(value = "/vpr/v{apiVersion}/search")
    ModelAndView query(@PathVariable String apiVersion,
                       @RequestParam String pid,
                       @RequestParam String query,
					   @RequestParam(required=false) String[] types,
					   @RequestParam(required=false) String range,
					   @RequestParam(required=false) boolean debug,
                       Pageable pageable,
                       HttpServletRequest request) throws SolrServerException, FrameException {
					   
    	// sanitize
    	query = StringEscapeUtils.escapeHtml(query);
					   
		// build up optional params as a map
		Map<String, Object> filters = new HashMap<String, Object>();
		if (types != null && types.length > 0) filters.put("types", types);
		if (range != null) filters.put("range",  range);
		if (debug) filters.put("debug", true);
		
		// perform the search, package results
        PatientSearch searchResults = searchService.textSearchByPatient(query, pid, (filters.isEmpty()) ? null : filters);
        JsonCCollection<SummaryItem> jsonc = JsonCCollection.create(request, searchResults.getResults());
        jsonc.put("elapsed", searchResults.elapsed);
        jsonc.put("query", searchResults.getQueryStr());
        jsonc.put("original", searchResults.getOriginalQueryStr());
        jsonc.put("altQuery", searchResults.getAltQueryStr());
        jsonc.put("corrections", searchResults.corrections);
		jsonc.put("filters", searchResults.getFilters());
		jsonc.put("facets", searchResults.getFacets());
		jsonc.put("unfilteredTotal", searchResults.getUnfilteredTotal());
		jsonc.put("foundItemsTotal", searchResults.foundItemsTotal);
		jsonc.put("mode", searchResults.getSearchMode());

		// include debug data if something enabled debug mode
		if (debug || searchResults.isDebugEnabled()) {
			jsonc.put("debug", FrameRunner.renderDebugData(searchResults.getResultsJob()));
		}
        return contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = {"/vpr/v{apiVersion}/{pid}/suggest"})
    ModelAndView suggest(@PathVariable String apiVersion,
                         @PathVariable String pid,
                         @RequestParam String prefix) throws SolrServerException, FrameException {
    	// sanitize
    	prefix = StringEscapeUtils.escapeHtml(prefix);
    	
    	List<SuggestItem> list = searchService.textSuggestByPatient(prefix, pid);
		return contentNegotiatingModelAndView(JsonCCollection.create(list));
    }
    
    @RequestMapping(value = {"/search/suggest"})
    ModelAndView suggest2(@RequestParam(required=false) String apiVersion,
    					 @RequestParam String pid,
                         @RequestParam String query) throws SolrServerException, FrameException {
    	
    	// sanitize
    	query = StringEscapeUtils.escapeHtml(query);
    	
    	// if its of the form [frameID]|[query string] convert to browse query
    	String[] parts = StringUtils.split(StringEscapeUtils.escapeHtml(query), '|');
    	List<SuggestItem> list = null;
    	if (parts.length == 2) {
    		list = searchService.textBrowseByPatient(parts[1], pid, parts[0]);
    	} else {
    		list = searchService.textSuggestByPatient(query, pid);
    	}
    		
		return contentNegotiatingModelAndView(JsonCCollection.create(list));
    }
    
    @RequestMapping(value = {"/search/browse"})
    ModelAndView browse(@RequestParam(required=false) String apiVersion,
    					 @RequestParam String pid,
    					 @RequestParam String frameID,
                         @RequestParam String query) throws SolrServerException, FrameException {
    	// sanitize
    	query = StringEscapeUtils.escapeHtml(query);
    	List<SuggestItem> list = searchService.textBrowseByPatient(query, pid, frameID);
		return contentNegotiatingModelAndView(JsonCCollection.create(list));
    }

}
