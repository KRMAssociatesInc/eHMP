package gov.va.cpe.vpr.search.frame;

import java.util.List;

import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.search.PatientSearch;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.cpe.vpr.search.SearchFrame;
import gov.va.cpe.vpr.search.SolrSearchAction;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.params.GroupParams;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.apache.solr.common.util.NamedList;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.View;

/**
 * Handles medication searching and also offers up drug therapy search suggestions
 */
@Component(value="gov.va.cpe.vpr.search.MedsSearchFrame")
public class MedsSearchFrame extends SearchFrame {
	private static final String CLASS_FIELD = "med_drug_class_name";
	private View view;
	
	private void doTermQuery(PatientSearch search, FrameTask task, String field, boolean browseMode) throws FrameException {
		String queryStr = search.getQueryStr();
		
		// query the index values for a match against drug class
		ModifiableSolrParams classQry = new ModifiableSolrParams();
		classQry.set("qt", "/terms");
		classQry.set("terms.fl", field);
		classQry.set("terms.sort", "count");
		
		if (browseMode) {
			// return full size list
			classQry.set("terms.limit", -1);
			classQry.set("terms.sort", "index");
		}
		
		if (StringUtils.hasText(queryStr)) {
			// search specific value
			classQry.set("terms.regex", ".*" + ClientUtils.escapeQueryChars(queryStr) + ".*");
			classQry.set("terms.regex.flag", "case_insensitive");
		}
		QueryResponse ret = execSolrQuery(classQry, task);
		
		// offer them up as drug class suggestions
		NamedList<String> term = (NamedList<String>) ret.getResponse().findRecursive("terms", field);
		if (term != null) {
			for (int i=0; i < term.size(); i++) {
				String key = term.getName(i).toLowerCase();
                if (StringUtils.hasText(key)) {
                	SuggestItem item = new SuggestItem(key, key, "Therapeutic Drug Class");
                	item.setProp("typeFilter", "med");
                	item.setCategory("All Medications");
				    task.addAction(item);
                }
			}
		}
	}
	
	@Override
	protected void doInit(FrameJob task) throws Exception {
		super.doInit(task);
		if (this.view==null) this.view = resolveView(task, "/search/med.summary");
	}
	
	@Override
	protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
		if (!StringUtils.hasText(search.getQueryStr())) return;
		doTermQuery(search, task, CLASS_FIELD, false);
		
		// drug to category suggestion
		suggestDrugCategory(search, task);
	}

	/**
	 * Use the term index to see if the query appears to be a drug name, if so, determine the drug class
	 * and suggest that as potentially broader search option.
	 */
	private void suggestDrugCategory(PatientSearch search, FrameTask task) throws FrameException {
		String queryStr = search.getQueryStr();
		
		// query the index values for a match against drug class
		ModifiableSolrParams classQry = new ModifiableSolrParams();
		classQry.set("qt", "/terms");
		classQry.add("terms.fl", "med_ingredient_code_name","med_ingredient_name");
		classQry.set("terms.sort", "count");
		classQry.set("terms.regex", ClientUtils.escapeQueryChars(queryStr) + ".*");
		classQry.set("terms.regex.flag", "case_insensitive");
		
		QueryResponse ret = execSolrQuery(classQry, task);
		
		// get suggestions from med ingredient code name or name
		NamedList<String> match = (NamedList<String>) ret.getResponse().findRecursive("terms", "med_ingredient_code_name");
		if (match == null || match.size() <= 0) {
			match = (NamedList<String>) ret.getResponse().findRecursive("terms", "med_ingredient_name");
		}
		
		// offer them up as drug class suggestions
		if (match != null && match.size() > 0) {
			// match found, get associated drug classes
			String term = match.getName(0);
			SolrQuery qry = new SolrQuery("med_ingredient_code_name: " + term);
			qry.addField("med_ingredient_code_name,med_drug_class_name");
			qry.addFilterQuery("domain:med");
			qry.setRows(1);
			
			ret = execSolrQuery(qry, task);
			if (!ret.getResults().isEmpty()) {
				SolrDocument doc = ret.getResults().get(0);
				List<String> list = (List<String>) doc.getFieldValue("med_drug_class_name");
				for (String drugClass : list) {
					SuggestItem item = new SuggestItem(drugClass, drugClass, "Therapeutic Drug Class");
		        	item.setProp("typeFilter", "med");
		        	item.setCategory("All Medications");
		        	task.addAction(item);
				}
			}
		}
	}
	
	@Override
	protected void browse(PatientSearch search, FrameTask task) throws FrameException {
		doTermQuery(search, task, CLASS_FIELD, true);
	}
	
	@Override
	public void search(PatientSearch search, FrameTask task) throws FrameException {
		// main med search query
		SolrQuery query = prepareQuery(search, true);
		QueryResponse ret = execSolrQuery(query, task);
		task.addAction(new MedSolrSearchAction(query, ret, this.view));
	}
	
	@Override
	protected void list(PatientSearch search, FrameTask task) throws FrameException {
		SolrQuery query = prepareQuery(search, true);
		query.setQuery("*:*");
		QueryResponse ret = execSolrQuery(query, task);
		task.addAction(new MedSolrSearchAction(query, ret, this.view));
	}
	
	private SolrQuery prepareQuery(PatientSearch search, boolean highlight) {
		SolrQuery query = search.initQuery();
		query.addFilterQuery("domain:med");
		query.addSort("overall_stop", ORDER.desc);
		query.addField("qualified_name");
		query.addField("va_type");
		query.addField("last_filled");
		query.addField("last_give");
		query.addField(CLASS_FIELD);
		query.set(GroupParams.GROUP, true);
		query.set(GroupParams.GROUP_FIELD, "kind");
		query.add(GroupParams.GROUP_FIELD, "qualified_name");
		
		if (highlight) {
			query.setHighlight(true);
		    query.addHighlightField("administration_comment");
		    query.addHighlightField("prn_reason");
		    query.setHighlightFragsize(72);
		    query.setHighlightSnippets(5);
		}
		
		return query;
	}
	
	
	public static class MedSolrSearchAction extends SolrSearchAction {
		
		public MedSolrSearchAction(SolrQuery query, QueryResponse resp, View view) {
			super(query, resp, view);
		}
		
		@Override
		public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
			SummaryItem item = super.createSummaryItem(resp, docs);
			item.count *= -1; // negative values keep the count, but don't display the badge
			
			Object qname = docs.get(0).getFieldValue("qualified_name");
			String type = (String) docs.get(0).getFieldValue("va_type");
			item.setProp("detailTitle", qname);
			item.detailType = "panelCfg";
			item.detailCfg = Table.buildRow("xtype", "medspanel", "tbarConfig", null, "header", false, 
					"viewParams", Table.buildRow("filter_qname", qname, "filter_current", false, "filter_type", type));
			return item;
		}
	}
}