package gov.va.cpe.vpr.queryeng.search;

import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.ViewParam.RequiredParam;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.search.OrderSearchViewDef")
@Scope("prototype")
public class OrderSearchViewDef extends ViewDef {
	public OrderSearchViewDef() {
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("datetime", false));
		declareParam(new RequiredParam("oi_code"));
		declareParam(new RequiredParam("query"));
		declareParam(new ViewParam.DateRangeParam("range", null));
		
		this.domainClasses.add(Order.class.getSimpleName());
		
		// first run lucene query
		String q = "pid: #{getParamStr('pid')}";
		addQuery(new SOLRQuery("uid", q) {
			
			@Override
			protected void modifySolrQuery(SolrQuery qry, RenderTask task) {
				String oiCode = task.getParamStr("oi_code");
				String query = task.getParamStr("query");
				qry.addFilterQuery("domain:order");
				if (task.getParamStr("range")!=null) {
					String range = task.getParamStr("range");
					qry.addFilterQuery("{!tag=dt}datetime:[" + new PointInTime(range) + " TO *]");
				}
				if (query != null && !query.isEmpty()) {
					qry.addFilterQuery(query);
				}
				if (oiCode == null || oiCode.isEmpty()) {
					// older results have no oiCode, so return all null results
					qry.addFilterQuery("-oi_code:[* TO *]");
				} else {
					qry.addFilterQuery("oi_code:\"" + oiCode + "\"");
				}
			}
			
			@Override
			protected void mapResults(RenderTask task, QueryResponse resp) {
	        	SolrDocumentList docs = resp.getResults();
//	        	Map<String, Map<String, List<String>>> highlighting = resp.getHighlighting();
	        	
	        	// for each document, include the first highlight (if any)
	            for (SolrDocument doc : docs) {
	            	Map<String, Object> item = mapRow(task, doc); 
	            	String uid = (String) item.get("uid");
//	            	if (highlighting != null && highlighting.containsKey(uid)) {
//	            		for (Entry<String, List<String>> entry : highlighting.get(uid).entrySet()) {
//	            			item.put("highlight", entry.getValue().get(0));
//	            		}
//	            	}
	            	task.add(item);
	            }
			}
			
		});
	}
}
