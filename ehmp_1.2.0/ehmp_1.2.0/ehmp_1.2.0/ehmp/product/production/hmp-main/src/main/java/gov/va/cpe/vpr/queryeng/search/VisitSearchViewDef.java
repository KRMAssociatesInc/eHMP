package gov.va.cpe.vpr.queryeng.search;

import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.ViewParam.RequiredParam;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component(value = "gov.va.cpe.vpr.queryeng.search.VisitSearchViewDef")
public class VisitSearchViewDef extends ViewDef {
	public VisitSearchViewDef() {
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new RequiredParam("stop_code_name"));
		declareParam(new RequiredParam("query"));
		declareParam(new ViewParam.DateRangeParam("range", null));
		
		// first run lucene query
		String q = "pid: #{getParamStr('pid')}";
		addQuery(new SOLRQuery("uid", q) {
			
			@Override
			protected void modifySolrQuery(SolrQuery qry, RenderTask task) {
				String location = task.getParamStr("stop_code_name");
				String query = task.getParamStr("query");
				String range = task.getParamStr("range");
				qry.addFilterQuery("domain:encounter");
				qry.addSort("visit_date_time", ORDER.desc);
				if (range != null) {
					qry.addFilterQuery("{!tag=dt}datetime:[" + new PointInTime(range) + " TO *]");
				}
				if (query != null && !query.isEmpty()) {
					qry.addFilterQuery(query);
				}
				if (StringUtils.hasText(location)) {
					qry.addFilterQuery("stop_code_name:\"" + location + "\"");
				}
			}
		});
	}
}
