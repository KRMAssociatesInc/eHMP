package gov.va.cpe.vpr.search;

import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.frameeng.CallEvent;
import gov.va.cpe.vpr.frameeng.Frame;
import gov.va.cpe.vpr.frameeng.FrameAction.DebugInfo;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.frameeng.IFrameTrigger;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.WrapperTrigger;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.search.PatientSearch.SearchMode;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.params.SolrParams;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;

import java.lang.annotation.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** 
 * Base class and helper triggers for the plethora of search frames.
 * 
 * Extender should either implement exec(PatientSearch, FrameTask) or 1+ of the mode-specific
 * search(PatientSearch, FrameTask), suggest(PatientSearch, FrameTask), browse(PatientSearch, FrameTask)
 * 
 * Does common initalizataion, configuration, trigger creation and solr execution.
 * 
 * Inner classes define common triggers and other useful resources
 */
public abstract class SearchFrame extends Frame {
	public static final String ENTRY_POINT_SEARCH = "gov.va.cpe.search";
	protected SearchTrigger trig1;
	protected SearchBrowseTrigger trig2;
	protected IGenericPOMObjectDAO genDao;
	protected IGenericPatientObjectDAO dao;
	protected SolrServer solr;
	protected List<ViewResolver> resolvers = null;

	public SearchFrame() {
		trig1 = addTrigger(new SearchTrigger(this, true));
		trig2 = addTrigger(new SearchBrowseTrigger(this));
		declareParam(new ViewParam.PatientIDParam());
		setType("gov.va.cpe.search");
	}
	
	/** special constructor for the AnnotatedFrame extention that does not inject a default trigger */
	protected SearchFrame(boolean annotated) {
		declareParam(new ViewParam.PatientIDParam());
		setType("gov.va.cpe.search");
	}
	
	@Override
	protected void doInit(FrameJob task) throws Exception {
		genDao = task.getResource(IGenericPOMObjectDAO.class);
		dao = task.getResource(IGenericPatientObjectDAO.class);
		solr = task.getResource(SolrServer.class);
	}
	
	/** fetch the PatientSearch object from the task context, throw error if not found */
	protected PatientSearch findPatientSearch(FrameTask task) throws FrameExecException {
		if (trig1 != null && trig1.isTriggerOf(task)) {
			return trig1.getEventOf(task).getSource();
		} else if (trig2 != null && trig2.isTriggerOf(task)) {
			return trig2.getEventOf(task).getSource();
		} else if (task.getTriggerEvent().getSourceClass().isAssignableFrom(PatientSearch.class)) {
			// for annotated frame classes
			return (PatientSearch) task.getTriggerEvent().getSource();
		} else {
			throw new FrameExecException(this, "Unable to locate PatientSearch object for this SearchFrame");
		}
	}
	
	/** Fetch a Spring View, initializing the resolvers if necessary. */
	protected View resolveView(FrameJob task, String viewName) {
		if (resolvers == null) {
			ApplicationContext ctx = task.getResource(ApplicationContext.class);
			Map<String, ViewResolver> beans = BeanFactoryUtils.beansOfTypeIncludingAncestors(ctx, ViewResolver.class, true, false);
			resolvers = new ArrayList<ViewResolver>(beans.values());
		}
		
		try {
			for (ViewResolver vr : resolvers) {
				View v = vr.resolveViewName(viewName, LocaleContextHolder.getLocale());
				if (v != null) {
					return v;
				}
			}
			return null;
		} catch (Exception ex) {
			throw new RuntimeException("Unable to resolve view: " + viewName, ex);
		}
	}

	@Override
	public void exec(FrameTask task) throws FrameException {
		PatientSearch search = findPatientSearch(task);

		// execute the general method, and then the mode-specific method
		exec(search, task);
		if (search.isSearchMode(SearchMode.SUGGEST)) {
			suggest(search, task);
		} else if (search.isSearchMode(SearchMode.SEARCH)) {
			search(search, task);
		} else if (search.isSearchMode(SearchMode.BROWSE)) {
			browse(search, task);
		} else if (search.isSearchMode(SearchMode.LIST)) {
			list(search, task);
		}
	}
	
	protected QueryResponse execSolrQuery(SolrParams query, FrameTask task) throws FrameException {
		if (solr == null) return null; // let the search service run this query
		try {
			DebugInfo debug = task.addAction(new DebugInfo("solr.query", URLDecoder.decode(query.toString())));
			QueryResponse resp = solr.query(query);
			debug.put("solr.resultCount", (resp.getResults() == null) ? 0 : resp.getResults().getNumFound());
			debug.put("solr.debug", resp.getDebugMap());
			debug.put("solr.explain", resp.getExplainMap());
			return resp;
		} catch (SolrServerException e) {
			throw new FrameExecException(this, "Error executing SOLR Query.", e);
		}
	}
	
	/** 
	 * Experimental method to get a full domain object from SOLR results, or DAO results, 
	 * whichever is available and most efficient 
	 * First tries to decode SMILE formatted record (if present in document)
	 * Then the string JSON document (if present in document)
	 * If neither are present in document, uses DAO to fetch from JDS (least efficient since its another round trip)
	 * */
	protected <T extends IPOMObject> T getPatientObjectFromSOLR(Class<T> clazz, SolrDocument doc) {
		if (doc == null) return null;
		if (doc.containsKey("smile")) 
			// Prefer SMILE formatted value
			return POMUtils.newInstance(clazz, (byte[]) doc.getFieldValue("smile"));
		else if (doc.containsKey("json"))
			// then JSON formatted value
			return POMUtils.newInstance(clazz, (String) doc.getFieldValue("json"));
		else
			// otherwise use the DAO to fetch it (least efficient)
			return dao.findByUID(clazz, (String) doc.getFieldValue("uid"));
	}
	
	protected void exec(PatientSearch search, FrameTask task) throws FrameException {
		// do nothing by default, TODO: maybe retire/depricate this method? 
	}

	protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
		// do nothing by default
	}
	
	protected void search(PatientSearch search, FrameTask task) throws FrameException {
		// do nothing by default
	}
	
	protected void browse(PatientSearch search, FrameTask task) throws FrameException {
		// do nothing by default
	}
	
	protected void list(PatientSearch search, FrameTask task) throws FrameException {
		// do nothing by default
	}
	
	public static class SearchTrigger extends WrapperTrigger<InvokeEvent<PatientSearch>> {
		private boolean includeSuggest;
		private String type;

		public SearchTrigger(Frame frame, boolean includeSuggest, String type) {
			super(new InvokeTrigger<PatientSearch>(frame, PatientSearch.class, ENTRY_POINT_SEARCH));
			this.includeSuggest = includeSuggest;
			this.type = type;
		}

		public SearchTrigger(Frame frame, boolean includeSuggest) {
			this(frame, includeSuggest, null);
		}

		@Override
		protected boolean doSecondardyEval(InvokeEvent<PatientSearch> event) {
			if (includeSuggest || !event.getSource().isSuggestOnly()) {
				return this.type == null || event.getSource().searchType(this.type);
			}
			return false;
		}
	}

	/** Only trigger on suggestions */
	public static class SearchSuggestTrigger extends WrapperTrigger<InvokeEvent<PatientSearch>> {
		public SearchSuggestTrigger(Frame frame) {
			super(new InvokeTrigger<PatientSearch>(frame, PatientSearch.class, ENTRY_POINT_SEARCH));
		}

		@Override
		protected boolean doSecondardyEval(InvokeEvent<PatientSearch> event) {
			return event.getSource().isSuggestOnly();
		}
	}
	
	public static class SearchBrowseTrigger extends WrapperTrigger<CallEvent<PatientSearch>> {
		public SearchBrowseTrigger(Frame frame) {
			super(new CallTrigger<PatientSearch>(frame, PatientSearch.class));
		}

		@Override
		protected boolean doSecondardyEval(CallEvent<PatientSearch> event) {
			return event.getSource().isSearchMode(SearchMode.BROWSE);
		}
	}
	
	public static class KeywordSearchTrigger extends WrapperTrigger<InvokeEvent<PatientSearch>> {
		private String[] keywords;
		private boolean includeSuggest;

		public KeywordSearchTrigger(Frame frame, boolean includeSuggest, String... keywords) {
			super(new InvokeTrigger<PatientSearch>(frame, PatientSearch.class, ENTRY_POINT_SEARCH));
			this.keywords = keywords;
			this.includeSuggest = includeSuggest;
		}

		@Override
		protected boolean doSecondardyEval(InvokeEvent<PatientSearch> event) {
			PatientSearch search = event.getSource();
			String str = search.getQueryStr().toLowerCase();
			if (!includeSuggest && search.isSuggestOnly()) return false; // skip suggestions if requested

			for (String key : keywords) {
				key = key.toLowerCase();
				if (str.equals(key) || str.startsWith(key + " ") || str.contains(" " + key + " ") || str.endsWith(" " + key)) {
					return true;
				}
			}
			return false;
		}
	}
	
	@Target(value = {ElementType.TYPE, ElementType.METHOD})
	@Retention(value = RetentionPolicy.RUNTIME)
	public @interface SearchResults {
	}	
	
	@Target(value = {ElementType.TYPE, ElementType.METHOD})
	@Retention(value = RetentionPolicy.RUNTIME)
	public @interface SearchSuggestions {
	}	
	
	@Target(value = {ElementType.TYPE, ElementType.METHOD})
	@Retention(value = RetentionPolicy.RUNTIME)
	public @interface SearchBrowse {
	}	

	
	/**
	 * This is an attempt to let you declare frame triggers via annotations on a class or methods
	 * 
	 * ****This is not really ready for primetime yet.****
	 * 
	 * TODO: How to generalize this out of search and into frames in general
	 * -- possibly have a trigger constructor that takes the annotation like POMIndex/POMAnnotation?
	 * -- need some hierarchy to the @interfaces so that they can be more easily recognized
	 * -- investigate the java lib thats part of Jackson specifically intended for this kind of stuff
	 * 
	 * TODO: What if >1 annotated method may fire?  Should both methods be executed?
	 * -- Maybe need to introduce a ProxyFrame that appends a '#method' frameID?
	 * 
	 * TODO: How to get more flexibility in the method signatures that can be annotated?
	 * -- worried a bit about performance, byte-code manipulation may be necessary?
	 * 
	 * TODO: workout the default policy, an AnnotatedFrame without any annotations should probably throw an initialization error?
	 * 
	 * @author brian
	 */
	public static class AnnotatedSearchFrame extends SearchFrame {
		private Map<IFrameTrigger<?>,Method> trigMap = new HashMap<>();
		
		public AnnotatedSearchFrame() {
			super(true);
			
			// look for relevant class level annotations
			for (Annotation a : getClass().getAnnotations()) {
				if (a.annotationType().isAssignableFrom(SearchResults.class)) {
					addTrigger(new SearchFrame.SearchTrigger(this, false));
				} else if (a.annotationType().isAssignableFrom(SearchSuggestions.class)) {
					addTrigger(new SearchFrame.SearchSuggestTrigger(this));
				} else if (a.annotationType().isAssignableFrom(SearchBrowse.class)) {
					addTrigger(new SearchFrame.SearchBrowseTrigger(this));
				}
			}

			
			// look for relevant method level annotations and map them to the method to invoke
			for (Method m : getClass().getMethods()) {
				for (Annotation a : m.getAnnotations()) {
					if (a.annotationType().isAssignableFrom(SearchResults.class)) {
						trigMap.put(addTrigger(new SearchFrame.SearchTrigger(this, false)), m);
					} else if (a.annotationType().isAssignableFrom(SearchSuggestions.class)) {
						trigMap.put(addTrigger(new SearchFrame.SearchSuggestTrigger(this)), m);
					} else if (a.annotationType().isAssignableFrom(SearchBrowse.class)) {
						trigMap.put(addTrigger(new SearchFrame.SearchBrowseTrigger(this)), m);
					}
				}
			}
			
			// default to results only if no annotation is present
			if (getTriggers().isEmpty()) {
				addTrigger(new SearchFrame.SearchTrigger(this, false));
			}
		}
		
		/** default behavior is to delegate to the annotated method */
		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			Method m = trigMap.get(task.getFrameTrigger());
			if (m == null) {
				throw new IllegalStateException("AnnotatedSearchFrame must annotate 1+ methods or implement exec(PatientSearch, FrameTask).");
			}
			
			try {
				m.invoke(this, search, task);
			} catch (IllegalAccessException | IllegalArgumentException
					| InvocationTargetException e) {
				throw new FrameExecException(this, "Unable to invoke frame annotation target method", e);
			}
		}
	}	
}
