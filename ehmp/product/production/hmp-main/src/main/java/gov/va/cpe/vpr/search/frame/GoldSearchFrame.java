package gov.va.cpe.vpr.search.frame;

import gov.va.cpe.lab.LabGroup;
import gov.va.cpe.lab.LabPanel;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentStatus;
import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.search.PatientSearch;
import gov.va.cpe.vpr.search.PatientSearch.SearchMode;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem.SortCat;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.cpe.vpr.search.SearchFrame;
import gov.va.cpe.vpr.search.SearchService;
import gov.va.cpe.vpr.search.SolrSearchAction;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.Decision;
import gov.va.hmp.access.IPolicyDecisionPoint;
import gov.va.hmp.access.MissingAttributeException;
import gov.va.hmp.access.asu.AsuDecisionRequest;
import gov.va.hmp.access.asu.DocumentAction;
import gov.va.hmp.access.asu.DocumentAsMapAsuDecisionRequest;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.*;
import org.apache.solr.client.solrj.response.SpellCheckResponse.Suggestion;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.params.DisMaxParams;
import org.apache.solr.common.params.GroupParams;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.apache.solr.common.params.SpellingParams;
import org.apache.solr.common.util.NamedList;
import org.apache.solr.common.util.SimpleOrderedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.View;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

/** Search frames that are mostly complete */
public class GoldSearchFrame {

	/** handle order searches for domains not handled elsewhere (usually b/c they don't have result objects) */
	@Component(value="gov.va.cpe.vpr.search.OrderSearchFrame")
	public static class OrderSearchFrame extends SearchFrame {
		@Override
		public void search(final PatientSearch search, FrameTask task) throws FrameException {
			SolrQuery query = search.initQuery();
			query.addField("service").addField("status_name").addField("content");
			query.addFilterQuery("domain:order");
			query.addFilterQuery("service:(LR OR GMRC OR RA OR FH OR UBEC OR \"OR\")");
			query.addFilterQuery("-status_name:(COMPLETE OR \"DISCONTINUED/EDIT\" OR DISCONTINUED OR EXPIRED OR LAPSED)");
			query.setHighlight(true);
		    query.addHighlightField("content");
		    query.setHighlightFragsize(45);
		    query.setHighlightSnippets(5);
		    
		    
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)) {
				@Override
				public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
					SummaryItem item = super.createSummaryItem(resp, docs);
					
					// special Kind translations so that some things group with their results
					String status = (String) docs.get(0).getFieldValue("status_name");
					String service = (String) docs.get(0).getFieldValue("service");
					item.summary += " (" + status + " Order)";
					
					return item;
				}
			});
		}
	}

	@Component(value="gov.va.cpe.vpr.search.SuggestSearchFrame")
	public static class SuggestSearchFrame extends SearchFrame {
		
		@Override
		protected void browse(PatientSearch search, FrameTask task) throws FrameException {
			if (search.hasPrefixedQueryStr("help:")) {
				search.addSuggestion(new SuggestItem("domain:", "Domain", null)
						.setProp("browse", "gov.va.cpe.vpr.search.WholeDomainSearchFrame")
						.setProp("example", "domain: problems"));
                search.addSuggestion(new SuggestItem("labgroup:", "Lab Group", null)
						.setProp("browse", "gov.va.cpe.vpr.search.LabGroupSearchFrame")
						.setProp("example", "labgroup: hematology")
						.setProp("typeFilter", "lab"));
                search.addSuggestion(new SuggestItem("loinc:", "LOINC Category", null)
	                .setProp("browse", "gov.va.cpe.vpr.search.LOINCSearchFrame")
	                .setProp("example", "loinc: lipids"));
                /* removed per discussions
				search.addSuggestion(new SuggestItem("labpanel:", "Lab Panel", null)
						.setProp("browse", "gov.va.cpe.vpr.search.LabPanelSearchFrame")
						.setProp("example", "labpanel: chem 7")
						.setProp("typeFilter", "lab"));
                        */
                search.addSuggestion(new SuggestItem("drugclass:", "Therapeutic Drug Class", null)
                        .setProp("browse", "gov.va.cpe.vpr.search.MedsSearchFrame")
                        .setProp("example", "drugclass: analgesics"));
				return;
			} 
		}
		
		@SuppressWarnings({ "unchecked", "rawtypes" })
		protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
			/*
			 * 2/28/14: 5 suggestion sources from from /suggest configured in solrconfig.xml
			 * 1) phrase_suggestor: uses AnalyzingInfixSuggester to find a full phrase match (doc titles, etc.)
			 * 2) freetext_suggestor: utilizing clinical text fields, find common suggestions to append to the search
			 * TODO: this one probably needs work, I think it slows down solr drastically too
			 * 3) spelling suggestions matching phrases
			 * 4) spelling suggestions matching clinical text
			 * 5) the collated result of the two spelling suggestions
			 * 
			 * Suggestions are no longer patient specific. as per clinical team discussions
			 * 
			 * TODO: If I could get the payload to work, I could give the patient matches higher rank?
			 */
			
			//http://localhost:8080/solr/suggest?q=discharge%20summry
			String queryStr = search.getOriginalQueryStr();
			SolrQuery q = new SolrQuery(ClientUtils.escapeQueryChars(queryStr));
			q.setRequestHandler("/suggest");
			QueryResponse response = execSolrQuery(q, task);
			
			// get the suggestion and spellcheck info out of the response
			Map suggest = (Map) response.getResponse().get("suggest");
			SimpleOrderedMap<SimpleOrderedMap<?>> phrase = (SimpleOrderedMap<SimpleOrderedMap<?>>) suggest.get("phrase_suggester");
			SimpleOrderedMap<SimpleOrderedMap<?>> freetxt = (SimpleOrderedMap<SimpleOrderedMap<?>>) suggest.get("freetext_suggester");
			
			// for both suggestion types, generate SuggestionItem's, only add new ones to the response
			Map<String, SuggestItem> ret = new HashMap<>();
			for (SuggestItem item : parseSuggestions(queryStr, phrase)) {
				if (!ret.containsKey(item.getQuery())) ret.put(item.getQuery(), item);
			}
			for (SuggestItem item : parseSuggestions(queryStr, freetxt)) {
				if (!ret.containsKey(item.getQuery())) ret.put(item.getQuery(), item);
			}
			
			// if no suggestions were generated, SuggestItem from the collated spelling response
			if (ret.isEmpty()) {
				String collation = (String) response.getResponse().findRecursive("spellcheck","suggestions","collation");
				if (collation != null) collation = collation.replace("\\ ", " ");
				
				// add the spellcheck SuggestItem if it doesn't exist
				if (collation != null && !ret.containsKey(collation)) {
					ret.put(collation, new SuggestItem(collation, collation, "Spelling Suggestion"));
				}
			}
	    	
			// add all the suggestions to the response
			for (SuggestItem item : ret.values()) {
				task.addAction(item);
			}
		}
		
	    @SuppressWarnings({ "rawtypes", "unchecked" })
		protected List<SuggestItem> parseSuggestions(String query, NamedList<SimpleOrderedMap<?>> suggest) {
			List<SuggestItem> ret = new ArrayList<>();
			if (suggest == null) return ret;
			
			// for each suggestion, get the term
			for (Map.Entry entry : suggest) {
				String origTerm = (String) entry.getKey();
				origTerm = origTerm.replace("\\ ", " ");
				if (!(entry.getValue() instanceof SimpleOrderedMap)) continue;
				SimpleOrderedMap val = (SimpleOrderedMap) entry.getValue();
				
				// the suggestion may be under suggestions (from suggester module) or suggestion (spell module)
				ArrayList<SimpleOrderedMap> suggestions = (ArrayList<SimpleOrderedMap>) val.get("suggestions");
				if (suggestions == null) continue;
				
				// for each suggestion, replace the original phrase out of the query with the suggestion
				for (SimpleOrderedMap obj : suggestions) {
					String sugTerm = (String) obj.get("term");
					
					// replace term seperator with ' ' and remove any term highlighting (<b> tags)
					sugTerm = sugTerm.replace('\u001e', ' ').replace("<b>", "").replace("</b>", "");
					
					ret.add(new SuggestItem(sugTerm, sugTerm, "Suggestion"));
				}
			}
			
			return ret;
		}
		
//		@Override
		protected void suggestOLD(PatientSearch search, FrameTask task) throws FrameException {
			/*
			 * Suggestion strategy as of 1/31/14
			 * - stick to the patient-specific faceting of phrases (but using the shingled filter)
			 * - also use the spellchecker to find misspellings (non-patient specific)
			 * - TODO: still need to pull the clinical text suggested keywords in? (not stored in phrase)
			 * - TODO: really need to investigate the eDisMax parser and it's shingle capability
			 *  
			 * http://localhost:8080/solr/select?q=*:*&fq=pid:10101&rows=0&facet=true&facet.field=phrase&facet.mincount=1&facet.prefix=discharge%20sum&spellcheck=true&spellcheck.q=dischare%20sum
			 */
			String str = search.getQueryStr();
			SolrQuery q = new SolrQuery("*:*");
//			q.addFilterQuery("pid:"+search.pid);
			q.setRows(0);
			q.setFacetLimit(3);
			q.setFacetMinCount(1);
			q.addFacetField(SearchService.PHRASE);
			q.setFacetPrefix(str);
			q.set("spellcheck", true);
			q.set(SpellingParams.SPELLCHECK_Q, str);
			q.set(SpellingParams.SPELLCHECK_DICT, "spell","suggest"); // TODO: build into searcher?
			q.set(SpellingParams.SPELLCHECK_COLLATE, true);
			
			// if facets exist, use them as patient-specific suggestions
	        QueryResponse response = execSolrQuery(q, task);
	        if (response.getFacetField(SearchService.PHRASE) != null) {
	        	List<Count> counts = response.getFacetField(SearchService.PHRASE).getValues();
	        	for (Count count : counts) {
	        		search.addSuggestion(new SuggestItem(count.getName(), count.getName(), "Patient Match"))
	        			.setSort(SuggestItem.SortCat.SUGGEST, count.getCount());
	        	}
	        }
			
			// if spellcheck results exist, list them as non-patient suggestions
			SpellCheckResponse spell = response.getSpellCheckResponse();
			if (spell != null) {
				// add suggestions
				for (Suggestion s : spell.getSuggestions()) {
					for (String str2 : s.getAlternatives()) {
						search.addSuggestion(new SuggestItem(str2, str2, "Spelling Suggestion"))
							.setSort(SuggestItem.SortCat.SPELL, 1);
					}
				}
			}
		}
	}

	@Component(value="gov.va.cpe.vpr.search.VitalsSearchFrame")
	public static class VitalsSearchFrame extends SearchFrame {

		@Override
		public void search(PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("vital")) return;
			
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.addFilterQuery("domain:vital");
			query.addSort("observed", ORDER.desc);
//			query.setFields(UID, DATETIME, SUMMARY, URL_FIELD, DOMAIN, KIND, FACILITY,KIND);
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "qualified_name");
			
		    // special eDisMax query options
			query.set("defType", "synonym_edismax");
			query.set("synonyms", true);
			query.set(DisMaxParams.QS, 4);
			query.set(DisMaxParams.QF, "all qualified_name display_name vital_sign_type location_name");
			
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)));
		}
		
		@Override
		protected void list(final PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("vital")) return;
		    SolrQuery query = search.initQuery();
		    // there is no other kinds for vitals, so we can just list them all
		    query.setQuery("*:*");
		    query.addFilterQuery("domain:vital");
		    //query.setQuery("kind:\"" + search.getQueryStr() + "\" OR domain:\"" + search.getQueryStr() + "\"");
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "qualified_name");
			
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)));
		}
	}
	
	@Component(value="gov.va.cpe.vpr.search.VisitSearchFrame")
	public static class VisitSearchFrame extends SearchFrame {
		
		@Override
		protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
			SolrQuery query = new SolrQuery("stop_code_name: \"" + ClientUtils.escapeQueryChars(search.getOriginalQueryStr()) + "\"");
			query.addFilterQuery("domain:encounter");
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "stop_code_name");
			
			QueryResponse resp = execSolrQuery(query, task);
			GroupResponse group = resp.getGroupResponse();
			if (group != null && group.getValues().get(0) != null) {
				GroupCommand cmd = group.getValues().get(0);
				for (Group grp : cmd.getValues()) {
					String val = grp.getGroupValue();
					SuggestItem item = new SuggestItem(val, val, "Stop Code");
					item.setCategory("Encounters/Visits");
					task.addAction(item);
				}
			}
		}

		@Override
		public void search(final PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("visit")) return;
			
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.addFilterQuery("domain:encounter");
			query.addSort("visit_date_time", ORDER.desc);
			query.addField("visit_date_time,location_display_name,facility_name,patient_class_name,stop_code_name");
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "stop_code_name");
			
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)) {
				@Override
				public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
					SummaryItem item = super.createSummaryItem(resp, docs);
					
					// only show the documents panel if there is > 1 document
					if (item.count > 1) {
						item.detailType = "panelCfg";
						Object title = docs.get(0).getFieldValue("stop_code_name");
						Map<String, Object> cfg = Table.buildRow("query", search.getQueryStr(), "stop_code_name", title);
						item.detailCfg = Table.buildRow("xtype", "visitsearchpanel", "viewParams", cfg);
					} else {
						String url = "/vpr/detail/" + URLEncoder.encode(item.uid) + "?searchterm=" + search.getQueryStr();
						item.detailType = "url";
						item.detailCfg = Table.buildRow("url", url);
					}
					return item;
				}
			});			
		}
	}

	@Component(value="gov.va.cpe.vpr.search.ImmunizationSearchFrame")
	public static class ImmunizationSearchFrame extends SearchFrame {
		
		@Override
		public void search(final PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("immunization")) return;
			
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.addFilterQuery("domain:immunization");
			query.addSort("administered_date_time", ORDER.desc);
			query.addField("administered_date_time,immunization_name");
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "immunization_name");
			
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)) {
				@Override
				public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
					SummaryItem item = super.createSummaryItem(resp, docs);
					
					// only show the documents panel if there is > 1 document
					if (item.count > 1) {
						item.detailType = "panelCfg";
						Object title = docs.get(0).getFieldValue("immunization_name");
						Map<String, Object> cfg = Table.buildRow("filter.name", title);
						item.detailCfg = Table.buildRow("xtype", "immunizationpanel", "viewParams", cfg);
					} else {
						String url = "/vpr/detail/" + URLEncoder.encode(item.uid) + "?searchterm=" + search.getQueryStr();
						item.detailType = "url";
						item.detailCfg = Table.buildRow("url", url);
					}
					return item;
				}
			});			
		}
	}

	
	@Component(value="gov.va.cpe.vpr.search.TasksSearchFrame")
	public static class TasksSearchFrame extends SearchFrame {
		@Override
		public void search(final PatientSearch search, FrameTask task) throws FrameException {
			
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.addFilterQuery("domain:task");
			query.addFilterQuery("-completed:true");
			query.addSort("due_date", ORDER.desc);
			
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)) {
				@Override
				public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
					if (!search.searchType("task")) return null;
					SummaryItem item = super.createSummaryItem(resp, docs);
					
					item.detailType = "panelCfg";
					String uid = (String) docs.get(0).getFieldValue("uid");
					Map<String, Object> cfg = Table.buildRow("task_uid", uid);
					item.detailCfg = Table.buildRow("xtype", "taskspanel", "viewParams", cfg);
					
					return item;
				}
			});
		}		
		
		@Override
		protected void list(final PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("task")) return;
			SolrQuery query = search.initQuery();
			query.setQuery("domain:\"" + search.getQueryStr() + "\"");
		    query.addFilterQuery("domain:task");
			query.addSort(SearchService.DATETIME, ORDER.desc);
			QueryResponse results = execSolrQuery(query, task);
			task.addAction(new SolrSearchAction(query, results) {
				@Override
				public List<SummaryItem> createSummaryItems(QueryResponse response) {
					if (!search.searchType("task")) return null; // don't create results if we documents are filtered out 
					return super.createSummaryItems(response);
				}
			});
		}
	}

	/**
	 * responsible for searching for document matches.
	 * 
	 * - uses proximity search
	 * - groups results by local title
	 * - limits highlight fragments to 5 (further limited by UI)
	 * 
	 * @author brian
	 */
	@Component(value="gov.va.cpe.vpr.search.DocsSearchFrame")
	public static class DocsSearchFrame extends SearchFrame {
        // velocity template for the view
        private View view;

        public class DocSolrSearchAction extends SolrSearchAction {

            private Logger LOGGER = LoggerFactory.getLogger(DocsSearchFrame.class);

			private PatientSearch search;

            private IPolicyDecisionPoint pdp;

			public DocSolrSearchAction(IPolicyDecisionPoint pdp, PatientSearch search, SolrQuery query, QueryResponse resp, View view) {
				super(query, resp, view);
          		this.search = search;
                this.pdp = pdp;
 			}

            @Override
            public List<SummaryItem> createSummaryItems(QueryResponse response) {
                if (!search.searchType("document")) return null; // don't create results if we documents are filtered out

                filterQueryResponse(response);
                return super.createSummaryItems(response);
            }

            public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
				SummaryItem item = super.createSummaryItem(resp, docs);
				
				// only show the documents panel if there is > 1 document
				if (item.count > 1) {
					item.detailType = "panelCfg";
					Object title = docs.get(0).getFieldValue("local_title");
					Map<String, Object> cfg = Table.buildRow("query", search.getQueryStr(), "local_title", title);
					item.detailCfg = Table.buildRow("xtype", "documentsearchpanel", "viewParams", cfg);
				} else {
                    try {
                        String url = "/vpr/detail/" + URLEncoder.encode(item.uid, "UTF-8") + "?searchterm=" + search.getQueryStr();
                        item.detailType = "url";
                        item.detailCfg = Table.buildRow("url", url);
                    } catch (UnsupportedEncodingException e) {
                        // NOOP: UTF-8 encoding built into JVM
                    }
				}
				return item;
			}

            // should this be packaged as a frame action or some general filtering API?
            private void filterQueryResponse(QueryResponse response) {
                // Response is grouped
                if (response.getGroupResponse() != null) {
                    Map<GroupCommand, GroupCommand> groupCommandReplacements = new HashMap<>();
                    for (GroupCommand groupCommand : response.getGroupResponse().getValues()) {
                        Set<Group> excludeGroups = new HashSet<>();
                        for (Group group : groupCommand.getValues()) {
                            Set<SolrDocument> excludes = getExcludedDocuments(group.getResult());
                            for (SolrDocument exclude : excludes) {
                                group.getResult().remove(exclude);
                            }
                            if (group.getResult().isEmpty()) {
                                excludeGroups.add(group);
                                LOGGER.debug("excluding empty group '" + group.getGroupValue() + "'");
                            } else {
                                group.getResult().setNumFound(group.getResult().getNumFound() - excludes.size());
                            }
                        }
                        if (!excludeGroups.isEmpty()) {
                            int excludedMatches = 0;
                            for (Group group : excludeGroups) {
                                excludedMatches += group.getResult().getNumFound();
                            }
                            GroupCommand newGroupCommand = new GroupCommand(groupCommand.getName(), groupCommand.getMatches() - excludedMatches);
                            for (Group group : groupCommand.getValues()) {
                                if (!excludeGroups.contains(group)) {
                                    newGroupCommand.add(group);
                                }
                            }
                            groupCommandReplacements.put(groupCommand, newGroupCommand);
                        }
                    }
                    for (Map.Entry<GroupCommand, GroupCommand> replacement : groupCommandReplacements.entrySet()) {
                        response.getGroupResponse().getValues().remove(replacement.getKey());
                        response.getGroupResponse().getValues().add(replacement.getValue());
                    }
                } else { // response is not grouped
                    Set<SolrDocument> excludes = getExcludedDocuments(response.getResults());
                    for (SolrDocument exclude : excludes) {
                        response.getResults().remove(exclude);
                    }
                    if (response.getResults().isEmpty()) {
                        response.getResults().setNumFound(0);
                    } else {
                        response.getResults().setNumFound(response.getResults().getNumFound() - excludes.size());
                    }
                }

                // TODO: adjust facet counts
            }

            private DocumentAsMapAsuDecisionRequest createViewDocumentAsuDecisionRequest(SolrDocument it) {
                return new DocumentAsMapAsuDecisionRequest(search.getUser(), DocumentAction.VIEW, it);
            }

            private Set<SolrDocument> getExcludedDocuments(List<SolrDocument> documents) {
                Set<SolrDocument> excludes = new HashSet<>();
                for (SolrDocument it : documents) {
                    String uid = (String) it.getFieldValue("uid");
                    if (Document.isTIU(uid)) {
                        AsuDecisionRequest request = createViewDocumentAsuDecisionRequest(it);
                        AuthorizationDecision decision = pdp.evaluate(request);
                        if (Decision.INDETERMINATE.equals(decision.getDecision())) {
                            excludes.add(it);
                            LOGGER.debug("excluding document '" + uid + "' due to an Indeterminate decision");
                        } else if (Decision.DENY.equals(decision.getDecision())) {
                            try {
                                DocumentStatus status = DocumentStatus.forName(Document.getStatusName(it));
                                if (!DocumentStatus.COMPLETED.equals(status)) {
                                    excludes.add(it);
                                    LOGGER.debug("excluding document '" + uid + "' with status '" + status + "' due to a Deny decision");
                                }
                            } catch (MissingAttributeException e) {
                                LOGGER.warn("unable to obtain status of document '" + it.get("uid") + "'", e);
                                excludes.add(it);
                            }
                        }
                    }
                }
                return excludes;
            }
		}

        public DocsSearchFrame() {
        	declareParam(new FrameParam.UserContextParam());
		}

		@Override
		public void search(final PatientSearch search, FrameTask task) throws FrameException {
			SolrQuery query = search.initQuery();
		    configureQueryForDocuments(query);
		    
		    // special eDisMax query options
			query.set("defType", "synonym_edismax");
			query.set("synonyms", true);
			query.set(DisMaxParams.QS, 4);
			query.set(DisMaxParams.QF, "all");

            task.addAction(new DocSolrSearchAction(task.getResource(IPolicyDecisionPoint.class), search, query, execSolrQuery(query, task), this.view));
		}

        @Override
        protected void doInit(FrameJob task) throws Exception {
            super.doInit(task);
            view = resolveView(task, "/search/doc.summary");
        }
        
        @Override
        protected void list(final PatientSearch search, FrameTask task) throws FrameException {
            SolrQuery query = search.initQuery();
            query.setQuery("kind_match:\"" + search.getQueryStr() + "\"");
            configureQueryForDocuments(query);
            QueryResponse resp = execSolrQuery(query, task);
            task.addAction(new DocSolrSearchAction(task.getResource(IPolicyDecisionPoint.class), search, query, resp, this.view));
        }

        private void configureQueryForDocuments(SolrQuery query) {
            query.addFilterQuery("domain:document");
            query.addSort("reference_date_time", ORDER.desc);

            query.addField(Document.SOLR_LOCAL_TITLE_FIELD);
            query.addField(Document.SOLR_DOC_DEF_UID_FIELD);
            query.addField(Document.SOLR_DOCUMENT_STATUS_FIELD);
            query.addField(Document.SOLR_AUTHOR_UID_FIELD);
            query.addField(Document.SOLR_SIGNER_UID_FIELD);
            query.addField(Document.SOLR_COSIGNER_UID_FIELD);
            query.addField((Document.SOLR_ATTENDING_UID_FIELD));
            query.addField(Document.SOLR_IS_INTERDISCIPLINARY_FIELD);
            query.addField(Document.SOLR_INTERDISCIPLINARY_TYPE_FIELD);

            query.addField(SearchService.PHRASE);

            query.set(GroupParams.GROUP, true);
            query.set(GroupParams.GROUP_FIELD, Document.SOLR_LOCAL_TITLE_FIELD);
            query.setHighlight(true);
            query.addHighlightField("body").addHighlightField("subject");
            query.setHighlightFragsize(45);
            query.setHighlightSnippets(5);
        }
    }

	@Component(value="gov.va.cpe.vpr.search.GenericSearchFrame")
	public static class GenericSearchFrame extends SearchFrame {
	
		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.setParam("q.op", "OR");

			query.setQuery("+all:\"" + ClientUtils.escapeQueryChars(search.getQueryStr()) + '"');
			
			// search for the specific domains we don't have frames for
			String domains = "obs procedure "; // encounter stuff
			domains += "mh "; // other patient stuff
			domains += "roadtrip auxiliary "; // CPE specific stuff
			domains += "pov skin diagnosis ptf exam treatment"; // encounter flags
			query.addFilterQuery("+domain: (" + domains + ")");
			query.addFilterQuery("-removed:true"); 
			
			query.addSort(SearchService.DATETIME, ORDER.desc);
			query.setFields(SearchService.UID, SearchService.DATETIME,
					SearchService.SUMMARY, SearchService.URL_FIELD,
					SearchService.DOMAIN, SearchService.KIND,
					SearchService.FACILITY);
			task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)));
		}
	}

	@Component(value="gov.va.cpe.vpr.search.WholeDomainSearchFrame")
	public static class WholeDomainSearchFrame extends SearchFrame {
		
		private QueryResponse runTermQuery(String search, FrameTask task, boolean browseMode) throws FrameException {
			// query the index values for a match against drug class
			ModifiableSolrParams classQry = new ModifiableSolrParams();
			classQry.set("qt", "/terms");
			classQry.set("terms.fl", "kind");
			classQry.set("terms.sort", "count");
			
			if (browseMode) {
				// return full size list
				classQry.set("terms.limit", -1);
				classQry.set("terms.sort", "index");
			}
			
			if (StringUtils.hasText(search)) {
				// search specific value
				classQry.set("terms.regex", ".*" + ClientUtils.escapeQueryChars(search) + ".*");
				classQry.set("terms.regex.flag", "case_insensitive");
			}
			return execSolrQuery(classQry, task);
		}
		
		/** query the term index for unique values */
		@SuppressWarnings("unchecked")
		private void doTermQuery(String search, FrameTask task, boolean browseMode) throws FrameException {
			QueryResponse ret = runTermQuery(search, task, browseMode);
			
			// offer them up as drug class suggestions
			NamedList<String> term = (NamedList<String>) ret.getResponse().findRecursive("terms", "kind");
			if (term != null) {
				for (int i=0; i < term.size(); i++) {
					String key = term.getName(i);
	                if (StringUtils.hasText(key)) {
					    task.addAction(new SuggestItem(key, key, "Domain").setSort(SortCat.SMART, 1));
	                }
				}
			}
		}
		
		@Override
		protected void browse(PatientSearch search, FrameTask task) throws FrameException {
			/* old dynamic term query:
			doTermQuery(search.getQueryStr(), task, true);
			*/
			
			// new hard-coded list per discussion
			task.addAction(new SuggestItem("Meds", "Meds", "Domain").setSort(SortCat.SMART, 1));
			task.addAction(new SuggestItem("Labs", "Labs", "Domain").setSort(SortCat.SMART, 1));
			task.addAction(new SuggestItem("Orders", "Orders", "Domain").setSort(SortCat.SMART, 1));
			task.addAction(new SuggestItem("Vitals", "Vitals", "Domain").setSort(SortCat.SMART, 1));
			task.addAction(new SuggestItem("Docs", "Documents", "Domain").setSort(SortCat.SMART, 1));
			task.addAction(new SuggestItem("Observations", "Observations", "Domain").setSort(SortCat.SMART, 1));
		}
		
		@Override
		protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
			if (!StringUtils.hasText(search.getQueryStr())) return;
			doTermQuery(search.getQueryStr(), task, false);
		}
		
		@Override
		protected void search(PatientSearch search, FrameTask task) throws FrameException {
			// query to see if this patient has a domain/kind with this match
			SolrQuery q = new SolrQuery();
			q.setFilterQueries("pid:" + search.pid);
			q.setQuery("kind_match:\"" + search.getQueryStr() + "\" OR domain:\"" + search.getQueryStr() + "\"");
			q.setRows(0);
	    	q.addFacetField("domain","kind");
	    	q.setFacetMinCount(1);
			QueryResponse resp = execSolrQuery(q, task);
			
			// if so, then add a subtask to let frames execute in list mode
			FacetField ff1 = resp.getFacetField("domain");
			FacetField ff2 = resp.getFacetField("kind");
			if (ff1.getValueCount() > 0 || ff2.getValueCount() > 0) {
				List<String> domains = new ArrayList<>();
				for (Count c : ff1.getValues()) domains.add(c.getName());
				PatientSearch kindSearch = new PatientSearch(search, search.getOriginalQueryStr(), SearchMode.LIST);
				kindSearch.addFilter("types", StringUtils.collectionToCommaDelimitedString(domains));
				task.addSubTasks(new IFrameEvent.InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, kindSearch));
			}
			
			/* one subsearch per match technique
			if (ff1.getValueCount() > 0) {
				for (Count val : ff1.getValues()) {
					PatientSearch kindSearch = new PatientSearch(search, val.getName(), SearchMode.LIST);
					task.addSubTasks(new IFrameEvent.InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, kindSearch));
				}
			}
			if (ff2.getValueCount() > 0) {
				for (Count val : ff2.getValues()) {
					PatientSearch kindSearch = new PatientSearch(search, val.getName(), SearchMode.LIST);
					task.addSubTasks(new IFrameEvent.InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, kindSearch));
				}
			}
			*/
		}
	}

	@Component(value="gov.va.cpe.vpr.search.LabsSearchFrame")
	public static class LabsSearchFrame extends SearchFrame {
		
		private View view;

		@Override
		protected void doInit(FrameJob task) throws Exception {
			super.doInit(task);
			view = resolveView(task, "/search/lab.summary");
		}

		@Override
		public void search(final PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("result")) return;
			
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.addFilterQuery("domain:result");
			query.addField("lnccodes").addField("type_code").addField("interpretationName").addField("units").addField("qualified_name").addField("result");
			query.addSort("observed", ORDER.desc);
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "qualified_name_units");
			
			// if the query matches on comment field, highlight it
			query.setHighlight(true);
		    query.addHighlightField("comment");
		    query.setHighlightFragsize(45);
		    query.setHighlightSnippets(5);

		    QueryResponse resp = execSolrQuery(query, task);
		    this.view = resolveView(task, "/search/lab.summary");
			task.addAction(new SolrSearchAction(query, resp, this.view){
				public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs){
					SummaryItem si = super.createSummaryItem(resp, docs);
					if(docs.size()>0 && !isGraphable(docs.get(0))) {
                        if(si.count>1) {
                            si.detailType = "panelCfg";
                            Map<String, Object> cfg = Table.buildRow("query", search.getQueryStr(), "qualifiedName", docs.get(0).get("qualified_name"));
                            si.detailCfg = Table.buildRow("xtype", "labtextsearchpanel", "viewParams", cfg);
                        }  else {
						    si.detailType="uid";
                        }
					}
					return si;
				}
			});
		}
		
		@Override
		protected void list(final PatientSearch search, FrameTask task) throws FrameException {
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
            query.setQuery("kind_match:\"" + search.getQueryStr() + "\"");
			query.addFilterQuery("domain:result");
			query.addField("lnccodes").addField("type_code").addField("interpretationName").addField("units").addField("qualified_name").addField("result");
			query.addSort("observed", ORDER.desc);
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "qualified_name_units");
			
		    QueryResponse resp = execSolrQuery(query, task);
		    this.view = resolveView(task, "/search/lab.summary");
			task.addAction(new SolrSearchAction(query, resp, this.view){
				public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs){
					SummaryItem si = super.createSummaryItem(resp, docs);
                    if(docs.size()>0 && !isGraphable(docs.get(0))) {
                        if(si.count>1) {
                            si.detailType = "panelCfg";
                            Map<String, Object> cfg = Table.buildRow("query", search.getQueryStr(), "qualifiedName", docs.get(0).get("qualified_name"));
                            si.detailCfg = Table.buildRow("xtype", "labtextsearchpanel", "viewParams", cfg);
                        }  else {
                            si.detailType="uid";
                        }
					}
					return si;
				}
			});
			
		}

        private boolean isGraphable(SolrDocument doc) {
            Object units = doc.getFieldValue("units");
            Object result = doc.getFieldValue("result");
            if((!StringUtils.isEmpty(units)) && result!=null && NumberUtils.isNumber(result.toString())) {
                return true;
            }
            return false;
        }
	}

	@Component(value="gov.va.cpe.vpr.search.LabPanelSearchFrame")
		public static class LabPanelSearchFrame extends SearchFrame {
			
			// TODO: Use cachemgr with a TTL?
			private static List<LabPanel> panels;
			private static Map<String,LabPanel> idx;
			
			@Override
			protected void exec(PatientSearch search, FrameTask task) throws FrameException {
				// ensure data is initalized
				if (panels == null) {
					// fetch and sort the panels
					panels = new ArrayList<LabPanel>(genDao.findAll(LabPanel.class));
					Collections.sort(panels);
					
					// then index them by name
					idx = new HashMap<>();
					for (LabPanel p : panels) {
						idx.put(p.getName(), p);
					}
				}
			}
			
			@Override
			protected void browse(PatientSearch search, FrameTask task) throws FrameException {
				for(LabPanel grp: panels) {
					String grpName = grp.getName().toLowerCase();
					search.addSuggestion(new SuggestItem(grpName, grpName, "Lab Panel"));
				}			
			}
			
			@Override
			protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
				int count=0; // only suggest up to 5 results
				String searchStr = search.getQueryStr();
				if (!StringUtils.hasText(searchStr)) return;
				for(LabPanel grp: panels) {
					String grpName = grp.getName().toLowerCase();
					if(grpName.contains(searchStr)) {
						search.addSuggestion(new SuggestItem(grpName, grpName, "Lab Panel"));
						if (++count >= 5) break;
					}
				}
			}
			
			@Override
			protected void search(PatientSearch search, FrameTask task) throws FrameException {
				String searchStr = search.getQueryStr();
				if (!StringUtils.hasText(searchStr)) return;
				
				for(LabPanel grp: panels) {
					String grpName = grp.getName().toLowerCase();
					if(grpName.equalsIgnoreCase(searchStr)) {
						searchPanelMembers(grp, search, task, new HashSet<String>());
					}
				}
			}
			
			private void searchPanelMembers(LabPanel panel, PatientSearch search, FrameTask task, Set<String> visited) throws FrameException {
				// TODO: for some readon panel.getGroups() doesn't seem to be working?
				List<Map<String,Object>> labs = (List<Map<String, Object>>) panel.getProperty("labs");
				for (Map<String, Object> lab : labs) {
					String name = (String) lab.get("name");
					
					// lab panels can contain other panel names
					if (idx.containsKey(name)) {
						// its a sub-panel (this recursion worries me, so I'm keeping a list of visited panels)
						if (!visited.contains(name)) {
							visited.add(name);
							searchPanelMembers(idx.get(name), search, task, visited);
						}
					} else {
						// create + exec SOLR query
						SolrQuery query = search.initQuery();
						query.setQuery("lab_result_type:\"" + name + "\"");
						query.addFilterQuery("domain:result");
						query.addSort("observed", ORDER.desc);
//						query.setFields(UID, DATETIME, SUMMARY, URL_FIELD, DOMAIN, KIND, FACILITY);
						query.set(GroupParams.GROUP, true);
						query.set(GroupParams.GROUP_FIELD, "qualified_name");
						
						task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)));
					}
				}
			}
		}

	/** 
	 * Searches lab groups defined in VistA such as HEMATOLOGY, FLUIDS, etc.
	 * 
	 * TODO: this metadata should probably be stored/matched in SOLR
	 * 
	 * @author brian
	 */
	@Component(value="gov.va.cpe.vpr.search.LabGroupSearchFrame")
	public static class LabGroupSearchFrame extends SearchFrame {
		// TODO: Use cachemgr with a TTL?
		private static List<LabGroup> grps;
		
		@Override
		protected void exec(PatientSearch search, FrameTask task) throws FrameException {
			// ensure data is initialized
			if (grps == null) {
				grps = new ArrayList<LabGroup>(genDao.findAll(LabGroup.class));
				Collections.sort(grps);
			}
		}
		
		@Override
		protected void browse(PatientSearch search, FrameTask task) throws FrameException {
			for(LabGroup grp: grps) {
				String grpName = grp.getName().toLowerCase();
				search.addSuggestion(new SuggestItem(grpName, grpName, "Lab Group"));
			}			
		}
		
		@Override
		protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
			String searchStr = search.getQueryStr();
			if (!StringUtils.hasText(searchStr)) return;
			for(LabGroup grp: grps) {
				String grpName = grp.getName().toLowerCase();
				if(grpName.contains(searchStr)) {
					search.addSuggestion(new SuggestItem(grpName, grpName, "Lab Group"));
				}
			}
		}
		
		@SuppressWarnings("unchecked")
		@Override
		protected void search(PatientSearch search, FrameTask task) throws FrameException {
			String searchStr = search.getQueryStr();
			if (!StringUtils.hasText(searchStr)) return;
			
			// find each group that matches
			for(LabGroup grp: grps) {
				String grpName = grp.getName().toLowerCase();
				if(grpName.contains(searchStr)) {
					for(Map<String, Object> subgrp: grp.getGroups()) {
						for (Map<String, Object> lab : (List<Map<String, Object>>) subgrp.get("labs")) {
							String name = (String) lab.get("name");
							
							// create + exec SOLR query
							SolrQuery query = search.initQuery();
							query.setQuery("lab_result_type:\"" + name + "\"");
							query.addFilterQuery("domain:result");
							query.addSort("observed", ORDER.desc);
	//						query.setFields(UID, DATETIME, SUMMARY, URL_FIELD, DOMAIN, KIND, FACILITY);
							query.set(GroupParams.GROUP, true);
							query.set(GroupParams.GROUP_FIELD, "qualified_name");
							
							task.addAction(new SolrSearchAction(query, execSolrQuery(query, task)));
						}
					}
				}
			}			
		}
	}
	
	/**
	 * Problems are problematic (hehe) in that redundant at different ICD granularities and
	 * may need significant de-duplication across sites/data sources.
	 * 
	 * Need to display multiple items for each group, highlight matches in comments, etc.
	 * 
	 * TODO: What status's should we show? All except deleted?
	 * @author brian
	 *
	 */
	@Component(value="gov.va.cpe.vpr.search.ProblemSearchFrame")
	public static class ProblemSearchFrame extends SearchFrame {
		private TermEng eng;
		private View view;
		
		private class SolrProblemSearchAction extends SolrSearchAction {
			private PatientSearch search;

			public SolrProblemSearchAction(PatientSearch search, SolrQuery query, QueryResponse resp, View view) {
				super(query, resp, view);
				this.search = search;
			}
			
			@Override
			public List<SummaryItem> createSummaryItems(QueryResponse response) {
				if (!search.searchType("problem")) return null; // don't create results if we documents are filtered out
				List<SummaryItem> items = new ArrayList<>();
				if (response.getGroupResponse() == null) return items;
				
				for (GroupCommand cmd : response.getGroupResponse().getValues()) {
					for (Group group : cmd.getValues()) {
						//Group potentially can have more then one result, we are interested in first one.
						String icdGroup = (String) group.getResult().get(0).get("icd_group");
						if (icdGroup != null && icdGroup.equals("799")) {
							for (SolrDocument doc : group.getResult()) {
								// don't group these results for this catch-all ICD code, create a summary item for each one
								SolrDocumentList docs = new SolrDocumentList();
								docs.add(doc);
								items.add(createSummaryItem(response, docs));
							}
						} else {
							// do the normal thing
							items.add(createSummaryItem(response, group.getResult()));
						}
					}
				}
				return items;
			}
			
			@Override
			public SummaryItem createSummaryItem(QueryResponse resp, SolrDocumentList docs) {
				
				// use the term engine to get the grouped ICD name (but only if its a group)
				// inject the description into the document so it can be used later by the template
				String code = null, desc = null;
				if (docs.size() > 1) {
					code = (String) docs.get(0).getFieldValue("icd_group");
					desc = eng.getDescription("urn:icd9cm:" + code);
					if (desc != null) {
						docs.get(0).setField("icd_group_name", desc);
					}
				} else {
					code = (String) docs.get(0).getFieldValue("icd_code");
					desc = (String) docs.get(0).getFieldValue("icd_name");
				}
				
				// also use the DAO to fetch the full domain object
				List<Problem> probs = new ArrayList<>();
				for (SolrDocument doc : docs) {
					Problem p = getPatientObjectFromSOLR(Problem.class, doc);
					if (p != null) {
						probs.add(p);
					}
				}
				
				// reapply the template after adding the domain objects
				SummaryItem item = super.createSummaryItem(resp, docs);
				item.objs = probs;
				item.detailType = "panelCfg";
				item.setProp("detailTitle", desc);
				
				// if code is 799, we need to filter by a specific UID, not the 799 code
				Map<String, Object> filters = Table.buildRow("filter_icd", code);
				if (code.equals("urn:icd:799.9")) {
					filters.put("filter_uid", docs.get(0).get("uid"));
				}
				item.detailCfg = Table.buildRow("xtype", "problemspanel",
						"viewParams", filters);
				return this.applySummaryTemplate(item, resp, docs);
			}
		}

		@Override
		protected void doInit(FrameJob task) throws Exception {
			super.doInit(task);
			eng = task.getResource(TermEng.class);
			view = resolveView(task, "/search/problem.summary");
		}
		
		@Override
		protected void search(final PatientSearch search, FrameTask task) throws FrameException {
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
		    query.addFilterQuery("domain:problem");
		    query.addFilterQuery("-removed:true");
		    query.addField("smile,comment,icd_code,icd_name,icd_group,problem_status,acuity_name,onset,entered");
		    query.addSort("problem_status", ORDER.asc);
			query.addSort(SearchService.DATETIME, ORDER.desc);
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "icd_group");
			query.set(GroupParams.GROUP_LIMIT, 11);
			
			query.setHighlight(true);
		    query.addHighlightField("comment");
		    query.setHighlightFragsize(45);
		    query.setHighlightSnippets(5);
		    
			QueryResponse results = execSolrQuery(query, task);
			task.addAction(new SolrProblemSearchAction(search, query, results, this.view));
		}
		
		@Override
		protected void list(final PatientSearch search, FrameTask task) throws FrameException {
			if (!search.searchType("problem")) return;
			SolrQuery query = search.initQuery();
			query.setQuery("domain:problem");
			query.addFilterQuery("-removed:true");
		    query.addField("smile,comment,icd_code,icd_name,icd_group,problem_status,acuity_name,onset,entered");
		    query.addFilterQuery("domain:problem");
		    query.addSort("problem_status", ORDER.asc);
			query.addSort(SearchService.DATETIME, ORDER.desc);
			query.set(GroupParams.GROUP, true);
			query.set(GroupParams.GROUP_FIELD, "icd_group");
			query.set(GroupParams.GROUP_LIMIT, 11);
			
			QueryResponse results = execSolrQuery(query, task);
			task.addAction(new SolrProblemSearchAction(search, query, results, this.view));
		}
	}
	
	@Component(value="gov.va.cpe.vpr.search.AllergySearchFrame")
	public static class AllergySearchFrame extends SearchFrame {
		private View view;
		
		@Override
		protected void doInit(FrameJob task) throws Exception {
			super.doInit(task);
			view = resolveView(task, "/search/allergy.summary");
		}
		
		@Override
		protected void search(final PatientSearch search, FrameTask task) throws FrameException {
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
		    query.addFilterQuery("domain:allergy");
		    query.addField("historical,allergy_reaction");
			query.addSort(SearchService.DATETIME, ORDER.desc);
			
			QueryResponse results = execSolrQuery(query, task);
			task.addAction(new SolrSearchAction(query, results, this.view));
		}
		
		@Override
		protected void list(PatientSearch search, FrameTask task) throws FrameException {
			// create + exec SOLR query
			SolrQuery query = search.initQuery();
			query.setQuery("*:*");
		    query.addFilterQuery("domain:allergy");
		    query.addField("historical,allergy_reaction");
			query.addSort(SearchService.DATETIME, ORDER.desc);
			
			QueryResponse results = execSolrQuery(query, task);
			task.addAction(new SolrSearchAction(query, results, this.view));
		}
	}
	
	
}
