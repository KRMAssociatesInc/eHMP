package gov.va.cpe.vpr.search.frame;

import gov.va.cpe.order.Orderable;
import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.frameeng.Frame.FrameException;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.jds.JdsDaoSupport;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.search.PatientSearch;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.cpe.vpr.search.SearchFrame;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermDataSourceReport;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;

import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.PrefixQuery;
import org.apache.lucene.search.TermQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

public class IncubatorSearchFrame {

	/** USes NDF-RT may_treat relationships to display drugs that treat matched diseases/findings */
		// TODO: NOT READY @Component(value="gov.va.cpe.vpr.search.NDFTreatmentSearchFrame")
		public static class NDFTreatmentSearchFrame extends SearchFrame {
			public final static String DZ_FINDING = "urn:ndfrt:N0000000004";
			public final static String PREFIX = "disease:";
			
			@Autowired
			private TermEng eng;
			
			@Override
			public void exec(PatientSearch search, FrameTask task) throws FrameException {
				String term = search.getQueryStr();
				if (search.hasPrefixedQueryStr(PREFIX)) {
					term = search.getPrefixedQueryStr(PREFIX).toLowerCase();
				}
				
				BooleanQuery q = new BooleanQuery();
				q.add(new TermQuery(new Term("ancestor", DZ_FINDING)), BooleanClause.Occur.MUST);
				q.add(new TermQuery(new Term("sab", "ndfrt")), BooleanClause.Occur.MUST);
				q.add(new PrefixQuery(new Term("term", term)), BooleanClause.Occur.MUST);
				
				if (search.isSuggestOnly()) {
					for (String urn : eng.search(q)) {
						String desc = eng.getDescription(urn);
						// TODO: Hack to remove the [disease/finding] from the end of the desc
						if (desc.endsWith("]")) {
							desc = desc.substring(0, desc.indexOf("[")).trim();
						}
						search.addSuggestion(new SuggestItem("disease: " + desc, desc, "Dz/Finding"));
					}
				} else if (search.hasPrefixedQueryStr(PREFIX)) {
	//				PhraseQuery pq = new PhraseQuery();
	//					pq.add(new Term("term", "tachycardia [disease/finding]"));
	//				q.add(pq, BooleanClause.Occur.MUST);
	//				
					System.out.println("NDF2: " + term);				
					for (String urn : eng.search(q)) {
						Concept c = eng.getConcept(urn);
						System.out.println(c + ":" + c.getDescription());
						
						// find a "vandf" relationship, that should match the ingredientCode
						Set<String> ndfrels = eng.getEquivalentSet(urn);
						ndfrels = c.getEquivalentSet();
						for (String rel : ndfrels) {
							System.out.println("Eval: " + rel + ":" + rel.startsWith("urn:vandf:"));
							if (rel.startsWith("urn:vandf:")) {
								String code = "urn:va:vuid:" + TermEng.parseCode(rel);
								System.out.println("Subsearch: " + code);
								PatientSearch ps = new PatientSearch(search.getUser(), code, search.pid, search.getSearchMode());
								InvokeEvent<PatientSearch> evt = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, ps);
								task.addSubTasks(evt);
							}
						}
					}
				}
			}
		}

	/**
	 * Uses the MeSH Pharmacologic Action higherarchy to contribute additional drug class search options
	 */
	// TODO: NOT READY @Component(value="gov.va.cpe.vpr.search.MSHSearchFrame")
	public static class MSHSearchFrame extends SearchFrame {
		public static final String ROOT = "urn:msh:D020228"; // Pharmacologic Actions
		
		@Autowired
		private TermEng eng;
		
		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			
			BooleanQuery q = new BooleanQuery();
			q.add(new TermQuery(new Term("ancestor", ROOT)), BooleanClause.Occur.MUST);
			q.add(new TermQuery(new Term("parent", ROOT)), BooleanClause.Occur.MUST_NOT);
			q.add(new TermQuery(new Term("term", search.getQueryStr())), BooleanClause.Occur.MUST);
			String searchTerm = search.getQueryStr().toLowerCase();
			List<String> results = eng.search(q);
			
			if (search.isSuggestOnly()) {
				suggest(results, search, searchTerm);
			} else {
				// TODO: How to convert the matching category (there should only be one at this point)
				// into a code that can be matched against the patients drugs.
			}
	
		}
		
		private void suggest(List<String> results, PatientSearch search, String searchTerm) {
			for (String urn : results) {
				
				// skip matches w/o a pharm action relation (RB)
				Map<String,Set<String>> rels = eng.getRelMap(urn);
				if (rels != null && !rels.isEmpty()) {
					boolean skip = false;
					for (String key : rels.keySet()) {
						if (rels.get(key).contains("RB|")) {
							skip = true;
							break;
						}
					}
					if (skip) continue;
				}
				
				// determine which term in the concept likely matched
				Concept c = eng.getConcept(urn);
				String disp = c.getDescription();
				for (Map<String, String> term : c.getTerms()) {
					if (term.containsKey("str") && term.get("str").contains(searchTerm)) {
						disp = term.get("str");
					}
				}
				search.addSuggestion(new SuggestItem("drugclass: " + c.getDescription(), disp, "Pharm. Action"));
			}
		}
	}
	
	/** TODO: Not ready for primetime 
	@Component(value="gov.va.cpe.vpr.search.SuggestRecentSearchFrame")
	*/
	public static class SuggestRecentSearchFrame extends SearchFrame {
		
		public SuggestRecentSearchFrame() {
			super();
			declareParam(new ViewParam.HTTPSessionParams("recent_search"));
			declareParam(new ViewParam.AsArrayListParam("recent_search"));
		}

		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			System.out.println("recent_search: " + task.getParamObj("recent_search"));
			if (!search.isSuggestOnly()) return;
			
			if (search.hasPrefixedQueryStr("help:")) {
				// TODO: This would be cool, but where to store/fetch them?  Also probably break this out into another frame.
				search.addSuggestion(new SuggestItem(null, "Recent Searches", null).setProp("cls", "cpe-search-suggest-heading"));
				search.addSuggestion(new SuggestItem("foo", "Foo", "1m ago").setProp("altSuggest", true));
				search.addSuggestion(new SuggestItem("bar", "Bar", "3h ago").setProp("altSuggest", true));
				search.addSuggestion(new SuggestItem("baz", "Baz", "1d ago").setProp("altSuggest", true));
				return;
			} 
		}
	}
	
	/* Orderables search not ready for primetime 
	@Component(value="gov.va.cpe.vpr.search.OrderablesSearchFrame")
	*/
	public static class OrderablesSearchFrame extends SearchFrame {
		
		@Override
		public void exec(PatientSearch search, FrameTask task) {
			if (search.isSuggestOnly()) return;
			
			// skip if not requested (TODO: build this into a trigger?)
			if (!search.searchType("Orderable")) return;
			
			// get the patients current inpatient encounters
			QueryDef qry = new QueryDef("curvisit");
			qry.where("patientClassCode").is("urn:va:patient-class:IMP");
			List<Encounter> encs = dao.findAllByQuery(Encounter.class, qry, task.getParams());
			boolean inpatient = !encs.isEmpty();
			
			// search ODS for orderable items
			// TODO: infer current inpatient vs outpatient status?
			String kind = (inpatient) ? "Inpatient Meds" : "Outpatient Meds";
			String q= kind + ">" + JdsDaoSupport.quoteAndWildcardQuery(search.getQueryStr());
			List<Orderable> orderables = genDao.findAllByIndexAndRange(Orderable.class, "orderable-types", q);
			for (Orderable o : orderables) {
				List<Map<String, String>> doseages = o.getPossibleDosages();
				
				// add all the possible dosages as summary items
				/*
				for (Map<String, String> dose : doseages) {
					SummaryItem item = new SummaryItem();
					item.type = "Orderable Item";
					item.kind = "Outpatient Meds";
					item.uid = dose.get("drugUid");
					item.summary = dose.get("drugName");
					task.addAction(item);
				}
				*/
				SummaryItem item = new SummaryItem(o.getUid());
				item.count = (doseages != null && doseages.size() > 1) ? doseages.size() : 0;
				item.type = "Orderable Item";
				item.kind = kind;
				item.summary = o.getSummary();
				task.addAction(item);
			}
		}
	}
	
	/**
	 * TODO: Would be cool to have a frame that recognizes T-n and just displays recent results!
	 */
	public static class DateRanteSearchFrame extends SearchFrame {
		@Override
		protected void search(PatientSearch search, FrameTask task) throws FrameException {
			// TODO Auto-generated method stub
			super.search(search, task);
		}
	}

    //blj
    //@Component(value="gov.va.cpe.vpr.search.IOSearchFrame")
    public static class IOSearchFrame extends SearchFrame {
        @Override
        public void exec(PatientSearch search, FrameTask task) throws FrameException {
            if (!search.isSuggestOnly()) return;


        }
    }

	/* not ready for gold
	@Component(value="gov.va.cpe.vpr.search.InfobuttonSearchFrame")
	*/
	public static class InfobuttonSearchFrame extends SearchFrame {
		private TermEng termEng;
		private OpenInfoButtonLinkGenerator gen;
		private IPatientDAO patDao;

		@Override
		protected void search(PatientSearch search, FrameTask task) throws FrameException {
			Map<String,String> codes = new HashMap<>();
			
			// initalize resources
			if (termEng == null || gen == null || patDao == null) {
				termEng = task.getResource(TermEng.class);
				gen = task.getResource(OpenInfoButtonLinkGenerator.class);
				patDao = task.getResource(IPatientDAO.class);
			}
			
			// find all rxnorm codes that match the search string and those are the medication infobuttons
			BooleanQuery q1 = new BooleanQuery();
			q1.add(new TermQuery(new Term("sab", "rxnorm")), BooleanClause.Occur.MUST);
			q1.add(new TermQuery(new Term("term", search.getQueryStr())), BooleanClause.Occur.MUST);
			List<String> terms = termEng.search(q1);
			if (terms.size() > 0) {
				terms = terms.subList(0, 1); // only show the top result for this category for now
			}
			
			// find all the loinc codes that match the search string and those are the lab infobuttons
			BooleanQuery q2 = new BooleanQuery();
			q2.add(new TermQuery(new Term("sab", "lnc")), BooleanClause.Occur.MUST);
			q2.add(new TermQuery(new Term("ancestor", "urn:lnc:LP31388-9")), BooleanClause.Occur.MUST); // Descendant of LOINC CHEMISTRIES
			q2.add(new PrefixQuery(new Term("urn", "urn:lnc:LP")), BooleanClause.Occur.MUST);
			q2.add(new TermQuery(new Term("term", search.getQueryStr())), BooleanClause.Occur.MUST);
			List<String> terms2 = termEng.search(q2);
			if (terms2.size() > 0) {
				terms2 = terms2.subList(0, 1);  // only show the top result for this category for now
			}
			
			// if the term is an ingredient term, then add it to our candidate list
			for (String term : terms) {
				Concept c = termEng.getConcept(term);
				if (c == null) continue;
				for (Map<String,String> t : c.getTerms()) {
					if (t.get("tty").equals("IN")) {
						codes.put(c.getURN(), c.getDescription());
						break;
					}
				}
			}
			
			for (String term : terms2) {
				Concept c = termEng.getConcept(term);
				
				boolean skip = false;
				for (String anc : c.getAncestorSet()) {
					if (terms2.contains(anc)) {
						// skip it
						skip = true;
						break;
					}
				}
				if (!skip) {
					codes.put(term, c.getDescription());
				}
			}
			
			// do problem search
			problemSearch(search, codes);
			
//			System.out.println("INfobutton Search Codes: " + codes);
			buildSummaryItems(task, search, codes);
		}
		
		private void problemSearch(PatientSearch search, Map<String, String> results) {
			Map<String,String> codes = new HashMap<>();
			
			// search snomed disease concepts
			BooleanQuery q3 = new BooleanQuery();
			q3.add(new TermQuery(new Term("sab", "snomedct")), BooleanClause.Occur.MUST);
			q3.add(new TermQuery(new Term("ancestor", "urn:sct:64572001")), BooleanClause.Occur.MUST); // disease
			q3.add(new TermQuery(new Term("term", search.getQueryStr())), BooleanClause.Occur.MUST);
			List<String> terms3 = termEng.search(q3);

			/*
			 * sorting algorithm: this search can return 100-1000's of results.  
			 * Find the most common occuring concept by counting the number of results that have the same ancestor
			 * TODO: This was put togeather very hastily, lots of other things to try. 
			 */
			Map<String,AtomicInteger> terms3Rank = new HashMap<>();
			for (String term : terms3) {
				terms3Rank.put(term, new AtomicInteger(1)); // +1 point for being in the search reults
				Concept c = termEng.getConcept(term);
				boolean skip = false;
				for (String anc : c.getAncestorSet()) {
					if (terms3.contains(anc)) {
						skip = true; // if this concepts ancestor is also a search result, skip this one

						// +1 point for another search result having this as an ancestor
						if (terms3Rank.containsKey(anc)) terms3Rank.get(anc).incrementAndGet();
						else terms3Rank.put(anc, new AtomicInteger(1));

						break;
					}
				}
				
				// if the concept has a relationship of focus_of to another search result, +1 and exclude this one
				// TODO: I really wanted to exclude these focus_of concepts in lucene but was having problems
				// (example "hypertension patient education")
				Map<String,Set<String>> rels = termEng.getRelMap(term);
				for (String key : rels.keySet()) {
					if (rels.get(key).contains("RO|focus_of")) {
						
						// +1 for has focus
						if (terms3Rank.containsKey(key)) terms3Rank.get(key).incrementAndGet();
						else terms3Rank.put(key, new AtomicInteger(1));
						
						skip = true;
						break;
					}
				}
				
				if (!skip) {
					// this is a candidate 
					codes.put(term, c.getDescription());
				}
			}
			
			// now sort the rankings and return the first (if any) result as our best "Problem/Disease Match"
			terms3Rank = TermDataSourceReport.sortMapVals(terms3Rank, 100, TermDataSourceReport.ATOMIC_INT_COMPARE);
			for (String key : terms3Rank.keySet()) {
				if (codes.containsKey(key)) {
					results.put(key,  codes.get(key));
					break;
				}
			}
			
			// nothing to return
		}
		
		private void buildSummaryItems(FrameTask task, PatientSearch search, Map<String, String> codes) {
			if (codes.isEmpty()) return;
			PatientDemographics pat = patDao.findByPid(search.pid);
			for (String urn : codes.keySet()) {	
				String searchCode = TermEng.parseCode(urn);
				String ctx = null, oid = null, heading = null, performer;
				if (urn.startsWith("urn:lnc:")) {
					ctx = OpenInfoButtonLinkGenerator.TASK_CONTEXT_LABRREV;
					oid = OpenInfoButtonLinkGenerator.LOINC_CODE_SYSTEM_OID;
					performer = OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER;
					heading = "Lab Concept: ";
				} else if (urn.startsWith("urn:rxnorm:")) {
					ctx = OpenInfoButtonLinkGenerator.TASK_CONTEXT_MLREV;
					oid = OpenInfoButtonLinkGenerator.RXNORM_CODE_SYSTEM_OID;
					performer = OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER;
					heading = "Medication Concept: ";
				} else if (urn.startsWith("urn:sct:")) {
					ctx = OpenInfoButtonLinkGenerator.TASK_CONTEXT_PROBLISTREV;
					oid = OpenInfoButtonLinkGenerator.SNOMED_CODE_SYSTEM_OID;
					performer = OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER;
					heading = "Disease Concept: ";
				} else {
					return;
				}

				// if the infobuttons are filtered out, just increment facets
				search.incFacetCount("domain:infobutton", 1);
				if (!search.searchType("infobutton")) return; 
				
				// infobuttons not filtered out, generate the link result
				String url = gen.buildInfobuttonURL(pat, searchCode, codes.get(urn), ctx, oid, performer);
				SummaryItem item = new SummaryItem(urn);
				item.kind=item.type="Knowledge Resources";
				item.summary= heading + codes.get(urn);
				item.setProp("detailTitle", codes.get(urn));
				item.detailType = "panelCfg";
				item.detailCfg = Table.buildRow("xtype", "infobuttonsearchpanel",  
						"viewParams", Table.buildRow("url", url));
				task.addAction(item);
			}
		}
	}

}
