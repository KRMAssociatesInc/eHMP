package gov.va.cpe.vpr.search;

import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.healthtime.format.PointInTimeFormat;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.Group;
import org.apache.solr.client.solrj.response.GroupCommand;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.View;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import static gov.va.cpe.vpr.search.SearchService.*;

/**
 * A SolrSearchAction is a wrapper around a SolrQuery with some extensible methods to transform
 * the SOLR QueryResponse into a list of SummaryItems. 
 * 
 * TODO: add a filter/transform mechanism (similar to QueryDef?) that can be used for:
 * -- ASU rule filtering
 * -- incorporate the view rendering functionality? ViewRenderSolrTransformer?
 * -- the silly createSummaryItems(QueryResponse) overloads where all we do is return null if not searching for a certain type
 * -- the common createSummaryItem(QueryResponse, SolrDocumentList) overload where we set detailCfg info and such
 * -- the problem search logic that merges items under their parent IDC9 code
 * 
 * 
 * TODO: Is this object that represents a collection of similar results (id grouped meds, grouped labs, documents, etc?)
 * -- this might be where the 'card interface' model comes from?
 * -- this object could define how to construct the card?

 * @author brian
 */
public class SolrSearchAction implements FrameAction {
	private SolrQuery query;
	private QueryResponse resp;
	private Template tpl;
	private View view;

	public SolrSearchAction(SolrQuery query, QueryResponse resp, Template tpl) {
		this.query = query;
		this.resp = resp;
		this.tpl = tpl;
	}
	
	public SolrSearchAction(SolrQuery query, QueryResponse resp, View view) {
		this.query = query;
		this.resp = resp;
		this.view = view;
	}
	
	public SolrSearchAction(SolrQuery query, QueryResponse resp) {
		this(query, resp, (View) null);
	}
	
	public SolrQuery getQuery() {
		return query;
	}
	
	/** returns the response, if already run, null if not */
	public QueryResponse getResponse() {
		return this.resp;
	}
	
	/** Convert a SOLR QueryResponse into a List of Summary Items */
    public List<SummaryItem> createSummaryItems(QueryResponse response) {

        List<SummaryItem> items = new ArrayList<SummaryItem>();
        
		if (response.getGroupResponse() != null) {
			// return 1 SummaryItem representing each group of results
			for (GroupCommand cmd : response.getGroupResponse().getValues()) {
				for (Group group : cmd.getValues()) {
					//Group potentially can have more then one result, we are interested in first one.
					SummaryItem summaryItem = createSummaryItem(response, group.getResult());
					items.add(summaryItem);
				}
			}
		} else {
			// return each result as an indivitual SummaryItem
	        for (SolrDocument it : response.getResults()) {
	        	SolrDocumentList docs = new SolrDocumentList();
	        	docs.add(it);
	            SummaryItem summaryItem = createSummaryItem(response, docs);
	            items.add(summaryItem);
	        }
		}
        return items;
    }

    /** Convert to SummaryItem SolrDocumentsList will contain at least 1 item, or multiple if its a grouped result */
    public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
    	SolrDocument doc = docs.get(0); // by default, only display the first item in the group.
    	String uid = (doc.containsKey(UID)) ? doc.getFieldValue(UID).toString() : null;
        SummaryItem item = new SummaryItem(uid);
        item.solrDocs = new ArrayList<Map<String, Object>>(docs);
        //fl=id,datetime,summary,url,domain,kind,facility
        item.summary = (doc.containsKey(SUMMARY)) ? doc.getFieldValue(SUMMARY).toString() : "Unknown";
        item.type = (doc.containsKey(DOMAIN)) ? doc.getFieldValue(DOMAIN).toString() : null;
        item.kind = (doc.containsKey(KIND)) ? doc.getFieldValue(KIND).toString() : "Unknown Type";
        item.where = (doc.containsKey(FACILITY)) ? doc.getFieldValue(FACILITY).toString() : null;
        
        // add highlighting/count
       	item.count = docs.getNumFound();
       	if (item.count <= 0) {
       		item.count = docs.size();
       	}
        setSummaryItemHighlight(item, resp);
        
        // format date time
        item.datetime = "Unknown Time";
        if (doc.containsKey(DATETIME)) {
        	item.datetime = doc.getFieldValue(DATETIME).toString();
        }
        
        // apply template/view (if defined)
        applySummaryTemplate(item, resp, docs);
        
        // TODO: Move this into a VM template
        if (item.kind.equalsIgnoreCase("Visit")) {
            String findStr = "${MEDICINE}:";
            if (item.summary.indexOf(findStr) > -1) {
                item.summary = item.summary.substring(findStr.length());
            }
        }

        return item;
    }
    
    /** generate a summary based on a template (if any) */
    public SummaryItem applySummaryTemplate(SummaryItem item, QueryResponse resp, SolrDocumentList docs) {
        if (this.view != null) {
			// setup the model 
			Map<String, Object> model = new HashMap<>();
			model.put("resp", resp);
			model.put("docs", docs);
			model.put("action", this);
			model.put("item", item);
			item.summary = renderView(this.view, model);
        } else if (this.tpl != null) {
    		StringWriter writer = new StringWriter();
    		VelocityContext ctx = new VelocityContext();
    		ctx.put("resp", resp);
    		ctx.put("docs", docs);
    		ctx.put("action", this);
    		ctx.put("item", item);
    		tpl.merge(ctx, writer);
    		item.summary = writer.toString();
        }
        return item;
    }
    
    public void setSummaryItemHighlight(SummaryItem summaryItem, QueryResponse response) {
        if (response.getHighlighting() != null && response.getHighlighting().get(summaryItem.uid) != null) {
            List<String> highlightSnippets = new ArrayList<String>();
            for (Entry<String, List<String>> entry : response.getHighlighting().get(summaryItem.uid).entrySet()) {
                highlightSnippets.addAll(entry.getValue());
            }
            
            summaryItem.highlights = highlightSnippets;
        }
    }
    
    @Override
    public String toString() {
    	QueryResponse resp = getResponse();
    	String results = "Not Executed Yet";
    	if (resp != null && resp.getResults() != null) {
    		results = "" + resp.getResults().getNumFound();
    	} else if (resp != null) {
    		results = "0";
    	}
        return getClass().getName() + "[solr.resultCount=" + results + "]";
    }
    
    public static String formatDateTime(String x) {
        if (x == null) return null;
        PointInTime t = HL7DateTimeFormat.parse(x);
        return PointInTimeFormat.forPointInTime(t).print(t);
    }
    
    private static String renderView(View view, Map<String, Object> model) {
		// Setup a request/response mechanism to render the view
        MockHttpServletRequest httpReq = new MockHttpServletRequest();
		MockHttpServletResponse httpResp = new MockHttpServletResponse();
		
		try {
			view.render(model, httpReq, httpResp);
			return httpResp.getContentAsString().trim();
		} catch (Exception ex) {
			throw new RuntimeException("Unable to render view: " + view, ex);
		}
    }
}