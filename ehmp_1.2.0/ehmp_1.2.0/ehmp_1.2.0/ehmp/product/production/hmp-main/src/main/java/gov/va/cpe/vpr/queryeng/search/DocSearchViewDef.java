package gov.va.cpe.vpr.queryeng.search;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.ViewParam.RequiredParam;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.IPolicyDecisionPoint;
import gov.va.hmp.access.asu.DocumentAction;
import gov.va.hmp.access.asu.DocumentAsMapAsuDecisionRequest;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.PointInTime;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.params.DisMaxParams;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import static gov.va.hmp.access.Decision.DENY;
import static gov.va.hmp.access.Decision.INDETERMINATE;

@Component(value = "gov.va.cpe.vpr.queryeng.search.DocSearchViewDef")
@Scope("prototype")
public class DocSearchViewDef extends ViewDef {

	public DocSearchViewDef() {
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("datetime", false));
		declareParam(new RequiredParam("local_title"));
		declareParam(new RequiredParam("query"));
		declareParam(new ViewParam.DateRangeParam("range", null));
		
		this.domainClasses.add(Document.class.getSimpleName());

		// first run lucene query (roughly same query as DocSearchFrame)
		addQuery(new SOLRQuery("uid", "(all:\"#{getParamStr('query')}\" OR kind_match:\"#{getParamStr('query')}\")") {
			
			@Override
			protected void modifySolrQuery(SolrQuery qry, RenderTask task) {
				// filter by range if specified
				if (task.getParamStr("range")!=null) {
					String range = task.getParamStr("range");
					qry.addFilterQuery("{!tag=dt}datetime:[" + new PointInTime(range) + " TO *]");
				}
				
				// filter by pid, and document + title
				qry.addFilterQuery("pid:"+task.getParamStr("pid"));
				qry.addFilterQuery("domain:document", "local_title:\"" + task.getParamStr("local_title") + "\"");
				qry.addSort("reference_date_time", ORDER.desc);
				
				// same highlighting as search
				qry.setHighlight(true);
				qry.setHighlightFragsize(60);
				qry.setHighlightSnippets(10);
				qry.addHighlightField("body").addHighlightField("subject");
				
			    // special eDisMax query options
				qry.set("defType", "synonym_edismax");
				qry.set("synonyms", true);
				qry.set(DisMaxParams.QS, 4);
				qry.set(DisMaxParams.QF, "all");
				
				// trying to use the simple boundary scanner to keep some of the header ============== junk away.
//				qry.set(HighlightParams.BOUNDARY_SCANNER, "simple");
//				qry.set(HighlightParams.BS_TYPE, "SENTANCE");
//				qry.set(HighlightParams.BS_CHARS,".,!?\t\n=");
			}
			
			private static final String DETAIL_URL = "/vpr/detail/%s?searchterm=%s"; 
			
			@Override
			protected void mapResults(RenderTask task, QueryResponse resp) {
	        	SolrDocumentList docs = resp.getResults();
	        	Map<String, Map<String, List<String>>> highlighting = resp.getHighlighting();

                IPolicyDecisionPoint pdp = task.getResource(IPolicyDecisionPoint.class);

	        	// for each document, include the first highlight (if any)
	            for (SolrDocument doc : docs) {
	            	Map<String, Object> item = mapRow(task, doc); 
	            	String uid = (String) item.get("uid");

                    if (Document.isTIU(uid)) {
                        AuthorizationDecision decision = pdp.evaluate(createDecisionRequest(task, item));
                        if (decision.getDecision().equals(DENY)) {
                            logger.debug("document filtered out due to ASU Deny: " + uid);
                            continue;
                        } else if (decision.getDecision().equals(INDETERMINATE)) {
                            logger.debug("document filtered out due to ASU Indeterminate: " + uid);
                            continue;
                        }
                    }

	            	if (highlighting != null && highlighting.containsKey(uid)) {
	            		for (Entry<String, List<String>> entry : highlighting.get(uid).entrySet()) {
	            			item.put("highlights", entry.getValue());
	            		}
	            	}

	            	// construct a custom detail url that passes the query string through
                    try {
                        item.put("selfLink", String.format(DETAIL_URL, URLEncoder.encode(uid, "UTF-8"), task.getParamStr("query")));
                    } catch (UnsupportedEncodingException e) {
                        // NOOP: should never happen (UTF-8 encoding is built into JVM)
                    }
                    task.add(item);
	            }
			}

            protected DecisionRequest createDecisionRequest(RenderTask task, Map<String, Object> document) {
                HmpUserDetails user = task.getResource(UserContext.class).getCurrentUser();
                return new DocumentAsMapAsuDecisionRequest(user, DocumentAction.VIEW, document);
            }
		});
	}
}
