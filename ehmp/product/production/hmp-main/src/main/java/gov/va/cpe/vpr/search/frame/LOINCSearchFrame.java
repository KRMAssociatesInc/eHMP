package gov.va.cpe.vpr.search.frame;

import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.search.PatientSearch;
import gov.va.cpe.vpr.search.PatientSearch.SearchMode;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.SearchFrame;
import gov.va.cpe.vpr.search.SolrSearchAction;
import gov.va.cpe.vpr.termeng.TermEng;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.PrefixQuery;
import org.apache.lucene.search.TermQuery;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.common.params.GroupParams;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * Terminology enhanced lab search.
 */
@Component(value="gov.va.cpe.vpr.search.LOINCSearchFrame")
public class LOINCSearchFrame extends SearchFrame {
	/**
	 * urn:lnc:LP31388-9 (chems, all children are valid suggestions):
		{urn=urn:lnc:LP14913-5, description=Porphyrins}
		{urn=urn:lnc:LP15157-8, description=Iodine}
		{urn=urn:lnc:LP15677-5, description=Iron}
		{urn=urn:lnc:LP15705-4, description=Lipids}
		{urn=urn:lnc:LP15711-2, description=Lipoprotein}
		{urn=urn:lnc:LP15838-3, description=Protein}
		{urn=urn:lnc:LP18033-8, description=Amino acids}
		{urn=urn:lnc:LP19203-6, description=Prostaglandins}
		{urn=urn:lnc:LP19403-2, description=Electrolytes}
		{urn=urn:lnc:LP31391-3, description=Cytokines}
		{urn=urn:lnc:LP31392-1, description=Enzymes}
		{urn=urn:lnc:LP31395-4, description=Vitamins}
		{urn=urn:lnc:LP31396-2, description=Endocrine}
		{urn=urn:lnc:LP31397-0, description=Liver function}
		{urn=urn:lnc:LP31398-8, description=Renal function}
		{urn=urn:lnc:LP31399-6, description=Sugars/Sugar metabolism}
		{urn=urn:lnc:LP31400-2, description=Gases and acid/Base}
		{urn=urn:lnc:LP31403-6, description=Neuromuscular}
		{urn=urn:lnc:LP31405-1, description=Nucleotides}
		{urn=urn:lnc:LP31406-9, description=Inborn errors metabolism lysosomal}
		{urn=urn:lnc:LP31409-3, description=Cardiovascular}
		{urn=urn:lnc:LP31410-1, description=Physical properties}
		{urn=urn:lnc:LP31412-7, description=Tumor markers}
		{urn=urn:lnc:LP31413-5, description=Mineral and bone}
		{urn=urn:lnc:LP31415-0, description=Small molecules}
		{urn=urn:lnc:LP31418-4, description=General terms}
		{urn=urn:lnc:LP31419-2, description=Gastrointestinal function}
		{urn=urn:lnc:LP31771-6, description=Crystals & calculi}
		{urn=urn:lnc:LP33025-5, description=Newborn screening panel}
		{urn=urn:lnc:LP36815-6, description=Peptides}
		{urn=urn:lnc:LP70625-6, description=Maternal screens}
	 */
	private static final String LNC_CHEM = "urn:lnc:LP31388-9"; 
	private TermEng eng;

	@Override
	protected void doInit(FrameJob task) throws Exception {
		eng = task.getResource(TermEng.class);
	}
	
	/**
	 * Enhancements: match any LOINC term (includes synonyms)? permit any loinc code (not just chemistries)
	 * @param search
	 * @return
	 */
	private Map<String,String> getLOINCMatches(String search) {
		// try to match the search terms against a narrow portion of the LOINC higherarchy
		BooleanQuery q1 = new BooleanQuery();
		q1.add(new TermQuery(new Term("parent", LNC_CHEM)), BooleanClause.Occur.MUST);
		q1.add(new PrefixQuery(new Term("term", search)), BooleanClause.Occur.MUST);
		
		// match any exact loinc code
		BooleanQuery q2 = new BooleanQuery();
		q2.add(new TermQuery(new Term("sab", "lnc")), BooleanClause.Occur.MUST);
		q2.add(new TermQuery(new Term("code", search)), BooleanClause.Occur.MUST);
		
		BooleanQuery q = new BooleanQuery();
		q.add(q1, BooleanClause.Occur.SHOULD);
		q.add(q2, BooleanClause.Occur.SHOULD);
		
		Map<String,String> ret = new HashMap<>();
		for (String urn : eng.search(q)) {
			String desc = eng.getDescription(urn);
			ret.put(urn, desc);
		}
		return ret;
	}
	
	@Override
	protected void browse(PatientSearch search, FrameTask task) throws FrameException {
		// get LOINC suggestions and add to suggestion list
		Map<String, String> results = getLOINCMatches("");
		for (String urn : results.keySet()) {
			String desc = results.get(urn);
			search.addSuggestion(new SuggestItem(desc.toLowerCase(), desc, "LOINC Search"));
		}
	}
	
	@Override
	protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
		// if the search string is empty, don't do a suggestion search
		if (!StringUtils.hasText(search.getQueryStr())) return;
		
		// get LOINC suggestions and add to suggestion list
		Map<String, String> results = getLOINCMatches(search.getQueryStr());
		for (String urn : results.keySet()) {
			String desc = results.get(urn);
			search.addSuggestion(new SuggestItem(desc.toLowerCase(), desc, "LOINC Search"));
		}
	}
	
	@Override
	protected void search(PatientSearch search, FrameTask task) throws FrameException {
		if (!StringUtils.hasText(search.getQueryStr())) return;
		
		// for each maching LOINC concept,
		Map<String,String> results = getLOINCMatches(search.getQueryStr());
		for (String urn : results.keySet()) {
			
			// run another SOLR search that fetches all matching labs
			if (search.searchType("result")) {
				SolrQuery query = search.initQuery();
				query.setQuery("lnccodes:\""+urn+"\"");
				query.addFilterQuery("domain:result");
				query.addSort("observed", ORDER.desc);
				query.set(GroupParams.GROUP, true);
				query.set(GroupParams.GROUP_FIELD, "qualified_name");
				task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)));
			}
			
			// kickoff sub-search, with coded value
			/* TODO: Not ready for prime-time
			PatientSearch ps = new PatientSearch(search.getPrefixedQueryStr(PREFIX), search.pid, search.isSuggestOnly());
			ps.codedValue = urn;
			task.addSubTasks(new InvokeEvent<PatientSearch>(ENTRY_POINT_SEARCH, ps));
			*/
			
			// also, get the children concept names, search for other documents/items
			if (!search.hasFilter("document")) continue; 
			for (String child : eng.getChildSet(urn)) {
				// search for the child concepts description
				String str = eng.getDescription(child);
				PatientSearch ps = new PatientSearch(search.getUser(), str, search.pid, SearchMode.SEARCH);
				ps.addFilter("types","document");
				ps.codedValue = child;
				InvokeEvent<PatientSearch> evt = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, ps);
				task.addSubTasks(evt);
				
				// TODO: unmapped drugs (like non-VA meds) do not match, maybe we should free-text search for them?
				// TODO: add the other terms too?
				//List<Map<String,Object>> terms = eng.getTermList(child); 
			}
		}
	}
}