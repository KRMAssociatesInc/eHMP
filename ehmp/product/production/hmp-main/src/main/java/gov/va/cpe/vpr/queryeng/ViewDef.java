package gov.va.cpe.vpr.queryeng;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.cpe.vpr.IBroadcastService;
import gov.va.cpe.vpr.frameeng.Frame;
import gov.va.cpe.vpr.frameeng.FrameAction.BaseFrameAction;
import gov.va.cpe.vpr.frameeng.FrameAction.IFrameActionExec;
import gov.va.cpe.vpr.frameeng.FrameAction.IHTTPResponseWritableAction;
import gov.va.cpe.vpr.frameeng.FrameAction.PatientAction;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.CallTrigger;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.queryeng.ColDef.DeferredViewDefDefColDef;
import gov.va.cpe.vpr.queryeng.ColDef.QueryColDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef;
import gov.va.cpe.vpr.vistasvc.CacheMgr;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.jsonc.JsonCCollection;
import org.joda.time.Seconds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import javax.jms.JMSException;
import javax.servlet.http.HttpServletResponse;
import java.util.*;



/**
 * ViewDef contains everything needed to define and render a complex data view for a user.
 * 
 * ViewDef contains User Parameters, Filters, Queries and Column Definitions
 * ViewDef is rendered (via the ViewDefRenderer helper class) into some data format (JSON, XML, Objects, etc).
 * 
 * The basic usage pattern is:
 * 1) User params are set/configured via setParams(...)
 * 2) The render() method (using a ViewDefRenderer helper class) is called to execute one or more queries.
 * 3) The defined columns are used by the ViewDefRenderer to merge and map the query results into a single result set.
 * 4) Filters are applied, which can further filter/manipulate the results. 
 * 5) The ViewDefRenderer then typically marshals the results into JSON, XML, HTML, etc.
 *
 * ViewDef is intended to be completely state-less, all relevant parameters must be supplied at runtime by a view service
 * that would track user preferences, parameters, and permissions.
 *   
 * ViewDef is currently not thread safe, a new instance is expected to be created for each request/run/render, however
 * soon multiple ViewDefRenderer(s) should be able to render from the same ViewDef simultaneously. 
 * 
 * First query defined in queries must be the primary query.  The primary query is the one that determines which rows are available 
 * and is always executed first.
 * 
 * The list of defined columns do not necessarily map 1-to-1 with the resulting fields/columns in the rendered results.
 */
public abstract class ViewDef extends Frame implements Query {

	private List<Query> queries = new ArrayList<Query>();
	private List<ColDef> columns = new ArrayList<ColDef>();
	private Map<String, ColDef> columnidx = new HashMap<String, ColDef>();
	protected CallTrigger<Object> trigCall;
	protected ArrayList<String> domainClasses = new ArrayList<String>();
    protected final Logger logger = LoggerFactory.getLogger(getClass());

	public ViewDef() {
		// declare default params (but do not re-declare them if they already exist)
		if (getParamDefs(ViewParam.PaginationParam.class).size() == 0) 
			declareParam(new ViewParam.PaginationParam());
		if (getParamDefs(ViewParam.ColumnsParam.class).size() == 0) 
			declareParam(new ViewParam.ColumnsParam(this));
		if (getParamDefs(ViewParam.ViewInfoParam.class).size() == 0) 
			declareParam(new ViewParam.ViewInfoParam(this));
		
		trigCall = addTrigger(new CallTrigger<Object>(this));
		setType("gov.va.cpe.viewdef");
	}
	
	/*
	 * QUERY + COLUMN DECLARE/GET/SET METHODS
	 */
	protected <T extends Query> T addQuery(T q) {
		assert q != null;
		this.queries.add(q);
		return q;
	}
	
	/** get all declared queries, possibly dynamically by overriding this in a subclass */
	public List<Query> getQueries(RenderTask task) {
		return this.queries;
	}
	
	public Query getPrimaryQuery() {
		if (this.queries.size() == 0) {
			throw new IllegalStateException("ViewDef contains NO queries!");
		}
		return this.queries.get(0);
	}
	
	protected ColDef addColumn(ColDef c) {
		assert c.getKey() != null;
		this.columns.add(c);
		this.columnidx.put(c.getKey(), c);
		return c;
	}
	
	protected void addColumns(ColDef[] cols) {
		for (ColDef col : cols) {
			addColumn(col);
		}
	}
	
	/**
	 * Convenience method to map multiple query fields at once into columns of the view def
	 * (Using QueryColDef's).  Example:
	 * 
	 * <pre>
	 * addColumns(q1, "field1", "field2", "field3");
	 * </pre>
	 * Is the same as:
	 * <pre>
	 * addColumn(new QueryColDef(q1, "field1"));
	 * addColumn(new QueryColDef(q1, "field2"));
	 * addColumn(new QueryColDef(q1, "field3"));
	 * </pre>
	 *  
	 * Replaces the MapperField ColDef from before
	 */
	protected void addColumns(Query q, String... fields) {
		addColumns(q, Arrays.asList(fields));
	}
	
	protected void addColumns(Query q, List<String> fields) {
		for (String f : fields) {
			addColumn(new QueryColDef(q, f));
		}
	}
	
	public List<ColDef> getColumns() {
		return this.columns;
	}

	public ColDef getColumn(String key) {
		return this.columnidx.get(key);
	}
	
	/*
	 * RUNTIME METHODS
	 */
	public boolean validate() {
		// check that queries have been defined
		if (queries.size() == 0) {
			return false;
		}
		
		return true;
	}
	
	@Override
	public void exec(FrameTask task) throws FrameException {
        try {
        	
        	// if the trigger is not the built in call trigger and its a PatientEvent then  
        	// add the ViewDefUpdateAction
        	if (!trigCall.isTriggerOf(task) && task.getTriggerEvent() instanceof PatientEvent) {
        		execAlt(task);
        		return;
        	}
        	
    		// run the primary query sync in the current thread
    		RenderTask rendertask = new RenderTask(task, this, this);
    		rendertask.setAsync(false);
    		task.addSubTask(rendertask);
    		rendertask.addAction(new ViewRenderAction(rendertask));

		} catch (Exception ex) {
        	String msg = "Exception rendering ViewDef: " + getClass();
        	throw new FrameExecException(this, msg, ex);
		}
	}
	
	/**
	 * ViewDef authors can extend/override this method to add custom behavior to UINotification
	 * messages.  This method is invoked instead of the standard exec() method if the triggering
	 * event is not the standard CallEvent.
	 * 
	 * @param task
	 */
	protected void execAlt(FrameTask task) {
		task.addAction(new ViewDefRefreshAction(this, (PatientEvent<?>) task.getTriggerEvent()));
	}
	

	@Override
	public String getPK() {
		return getPrimaryQuery().getPK();
	}

	@Override
	public String getQueryString() {
		return getPrimaryQuery().getQueryString();
	}

	/**
	 * Runs a viewdef as a Query (typically a nested viewdef).  
	 * 
	 * Runs the primary query first, then creates/adds subtasks to run the remaining queries.
	 */
	@Override
	public void exec(RenderTask rendertask) throws Exception {
		if (!validate()) {
			throw new FrameInitException(this, "Invalid ViewDef state");
		}
		
		// exec primary query first
		List<Query> queries = getQueries(rendertask);
		assert rendertask.getQuery() == queries.get(0);
		queries.get(0).exec(rendertask);
		
		// append the rest of the queries as subTasks
		for (int i=1; i < queries.size(); i++) {
			rendertask.addSubTask(new RenderTask(rendertask, queries.get(i)));
		}
	}
	
	/**
	 * The way ViewDef results are packaged and returned to the user.
	 * @author brian
	 *
	 */
	public static class ViewRenderAction extends BaseFrameAction implements IHTTPResponseWritableAction {
		private RenderTask results;
		private boolean debug;
		private Map<String, String> metadata = new HashMap<String, String>();

		public ViewRenderAction(RenderTask results) {
			this.results = results;
		}
		
		public RenderTask getResults() {
			return results;
		}
		
		/**
		 * Permits you to add additional header data to the response if desired
		 */
		public void addHeaderData(String key, String val) {
			this.metadata.put(key, val);
		}
		
		public void setGenerateDebugInfo(boolean value) {
			this.debug = value;
		}
		
		@Override
		public String toString() {
			return super.toString() + "[rows=" + getResults().size() + "]";
		}
		
        @Override
		public void write(HttpServletResponse resp) throws Exception {
        	resp.setContentType("application/json");
			MAPPER.writeValue(resp.getWriter(), renderToJSON());
		}
        
        public String renderToString() throws Exception {
        	return renderToJSON().toString();
        }

		public JsonNode renderToJSON() throws Exception {
            // pack all results into a JSON object and return
            ObjectNode ret = MAPPER.createObjectNode();
            RenderTask results = getResults();

            // generate the header and metadata
            // TODO: Make this conform to the other google-style results
            ret.put("total", results.size());
            ret.put("totalTimeMS", results.getTotalTimeMS());
            for (String key : metadata.keySet()) {
            	ret.put(key, metadata.get(key));
            }
            JsonCCollection rawResponse = results.getRawResponse();
            if(rawResponse!=null) {
                ret.put("totalItems", rawResponse.getTotalItems());
                ret.put("currentItemCount",rawResponse.getCurrentItemCount());
                ret.put("itemsPerPage",rawResponse.getItemsPerPage());
                ret.put("startIndex",rawResponse.getStartIndex());
            }
            
            // add the full data and viewdef metadata
            ret.put("data", MAPPER.convertValue(results, JsonNode.class));
            ret.put("metaData", renderMetaData(results));

            // inject debugging details if requested
            if (this.debug) {
            	ret.put("debug", FrameRunner.renderDebugData(results));
            }
            
            return ret;
        }
		
        public static JsonNode renderMetaData(RenderTask task) {
            ObjectNode ret = MAPPER.createObjectNode();
            
            // to enable sorting and grouping, a SortParam must be declared
            // and 1 or more sortable/groupable columns must be declared in ColumnsParam.
            Set<ViewParam> sort = task.getViewDef().getParamDefs(ViewParam.SortParam.class);
            String sortCols = task.getParamStr("col.sortable");
            String groupCols = task.getParamStr("col.groupable");
            
            if (sort.size() > 0 && sortCols != null && sortCols.length() > 0) {
                ret.put("sortable", true);
            } else {
                ret.put("sortable", false);
            }
            if (sort.size() > 0 && groupCols != null && groupCols.length() > 0) {
                ret.put("groupable", true);
            } else {
                ret.put("groupable", false);
            }
            
            ArrayNode params = MAPPER.createArrayNode();
            ret.put("defaults", MAPPER.convertValue(task.getParams(), JsonNode.class));
            renderFieldAndColumnData(ret, task);
            for (ViewParam p : task.getViewDef().getParamDefs()) {
                params.add(MAPPER.convertValue(p.getMetaData(task), JsonNode.class));
            }
            ret.put("params", params);
            ArrayNode domains = MAPPER.createArrayNode();
            for(String s: task.getViewDef().getDomainClasses()) {
            	domains.add(s);
            }
            ret.put("domains", domains);
            return ret;
        }
        
        private static void renderFieldAndColumnData(ObjectNode json, RenderTask task) {
            ViewDef def = task.getViewDef();
            Set<String> fielddata = new HashSet<String>();
            HashMap<String, Map<String,Object>> coldata = new HashMap<String, Map<String,Object>>();

            String suppressList = task.getParamStr("col.suppress");
            String userDisplayList = task.getParamStr("col.display");
            String sortList = task.getParamStr("col.sortable");
            String groupList = task.getParamStr("col.groupable");
            String requireList = task.getParamStr("col.require");

            fielddata.addAll(task.getResults().getFields());
            fielddata.addAll(StringUtils.commaDelimitedListToSet(requireList));
            fielddata.addAll(StringUtils.commaDelimitedListToSet(suppressList));
            fielddata.addAll(StringUtils.commaDelimitedListToSet(userDisplayList));

            for(ColDef col : def.getColumns()) {
                String key = col.getKey();
                fielddata.add(key);

                // any column in col.suppress gets completely excluded
                if (listContains(suppressList, key)) {
                    continue;
                }

                // get the column metadata (if declared)
                Map<String,Object> metadata = new HashMap<String,Object>();
                metadata.put("text", key);
//                metadata.put("dataIndex", key);
                // TODO: look for a flex value too?
                int width = task.getParamInt("col." + key + ".width");
                if (width > 0) {
                    metadata.put("width", width);
                }

                // any columns listed in col.display (user level preferences) are shown as hidden=true|false
                // TODO: sorely need to stop using CSL and make it a more structured parameter
                metadata.put("hidden", false);
                metadata.put("sortable", false);
                metadata.put("groupable", false);
                metadata.put("hideable", true);
                if (!listContains(userDisplayList, key)) {
                    metadata.put("hidden", true);
                }
                if (listContains(sortList, key)) {
                    metadata.put("sortable", true);
                }
                if (listContains(groupList, key)) {
                    metadata.put("groupable", true);
                }
                if (listContains(requireList, key)) {
                	metadata.put("hideable", false);
                }

                /*
                 * DeferredGSPColDef stuff - everything the UI needs to summon cell data later on.
                 */
                if(col instanceof DeferredViewDefDefColDef) {
                	Map<String, Object> deferredMap = new HashMap<String, Object>();
                	deferredMap.put("keyCol", ((DeferredViewDefDefColDef)col).keyCol);
                	ViewDefDefColDef vdcd = ((DeferredViewDefDefColDef)col).cdef;
                	deferredMap.putAll(vdcd.getData());
                	deferredMap.put("appInfo", ((DeferredViewDefDefColDef)col).cdef.getAppInfo());
                	metadata.put("deferred", deferredMap);
                }


                metadata.putAll(col.getColumnMetaData(def));
                coldata.put(key, metadata);
            }

            // Sort in the col.display order
            ArrayNode columnJson = MAPPER.createArrayNode();
            StringTokenizer st = new StringTokenizer(userDisplayList, ",");
            while (st.hasMoreTokens()) {
                String key = st.nextToken();
                if (coldata.containsKey(key)) {
                    columnJson.add(MAPPER.convertValue(coldata.get(key), JsonNode.class));
                    coldata.remove(key);
                }
            }

            // anything still left gets added to the end
            for (String key : coldata.keySet()) {
            	columnJson.add(MAPPER.convertValue(coldata.get(key), JsonNode.class));
            }

            json.put("fields", MAPPER.convertValue(fielddata, ArrayNode.class));
            json.put("columns", columnJson);
        }
        
        /**
         * Poor mans list parser. Assumes list is comma seperated.
         * @return Returns true if the list contains val.
         */
        private static boolean listContains(String list, String val) {
            if (list == null) {
                return false;
            }
            
            String l = list.trim();
            if (l.equals(val) || l.contains(val + ",") || l.endsWith("," + val) || l.endsWith(", " + val)) {
                return true;
            }
            return false;
        }
	}
	
	public static class CachedViewRenderAction extends ViewRenderAction {
		private String cache;

		public CachedViewRenderAction(String cachedResp) {
			super(null);
			this.cache = cachedResp;
		}
		
		public RenderTask getResults() {
			throw new IllegalStateException("Cached results currently dont support .getResults()");
		}
		
        @Override
		public void write(HttpServletResponse resp) throws Exception {
        	resp.setContentType("application/json");
        	resp.getWriter().write(renderToString());
		}
        
        public String renderToString() throws Exception {
        	return cache;
        }

		public JsonNode renderToJSON() throws Exception {
			throw new IllegalStateException();
		}
		
		public void addHeaderData(String key, String val) {
			throw new IllegalStateException();
		}

	}

	/**
	 * An action that uses BroacastService to notify client(s) that the viewdef has updated and
	 * triggers the browser to refresh the viewdefs.
	 * 
	 * This is the default action that ViewDef does for non CallEvent executions.
	 *  
	 * @author brian
	 */
	public static class ViewDefRefreshAction extends PatientAction implements IFrameActionExec {
		protected ViewDef def;
		protected PatientEvent<?> evt;
		protected IBroadcastService svc;

		public ViewDefRefreshAction(ViewDef def, PatientEvent<?> evt) {
			super(evt.getPID());
			this.evt = evt;
			this.def = def;
		}
		
		@JsonIgnore
		protected Map<String, Object> getHeaders() {
			Map<String, Object> headers = new HashMap<String, Object>();
			headers.put("eventName", "viewdefUpdate");
			headers.put("type", getClass().getSimpleName());
			headers.put("viewdef.id", def.getID());
			headers.put("viewdef.name", def.getName());
			headers.put("pid", getPid());
			headers.put("uid", evt.getUID());
			return headers;
		}
		
		public PatientEvent<?> getEvent() {
			return this.evt;
		}
		
		@Override
		public void exec(FrameJob job) throws JMSException {
			if (svc == null) {
				svc = job.getResource(IBroadcastService.class);
			}
			
			// build the message and send the result
			Map<String, Object> map = getHeaders();
			map.putAll(POMUtils.convertObjectToMap(this));
			svc.broadcastMessage(map, getHeaders());
		}
		
		
	}
	
	/** 
	 * An action that uses BroadcastService to send a specific set of ViewDef updates 
	 * (ie: new/changed rows) to the browser client.
	 *  
	 * The specific ViewDef must determine if/when/how to use this action via the execAlt() method.
	 */
	public static class ViewDefUpdateAction extends ViewDefRefreshAction {
		private RenderTask task;

		public ViewDefUpdateAction(RenderTask task, PatientEvent<?> evt) {
			super(task.getViewDef(), evt);
			this.task = task;
		}
		
		public Map<String, Object> getUpdatedRow() {
			return (task != null) ? task.getRowIdx(0) : null;
		}
	}
	
	/**
	 * Extention to a ViewDef that handles caching viewdefs for a specific period of time and knows when to dump the
	 * cache if necessary.
	 * 
	 * TODO: Try non-memory resident forms of caching (MVStore, etc.)
	 * TODO: Is a sub-class really necessary? Could the presense of ViewParam.CachedFor indicate cachablility and implemented in main ViewDef? 
	 * TODO: Need to be able to over-ride the cached setting like &nocache=true or cachedwithin=1H, etc.
	 * TODO: How to show cached results in &debug=1 output?
	 */
	public static class CachedViewDef extends ViewDef {
		// setup a cachemgr for each cachedviewdef class
		private static CacheMgr<ViewRenderAction> VIEWDEF_CACHE = new CacheMgr<ViewRenderAction>("VIEWDEF_CACHE", CacheMgr.CacheType.MEMORY); 
		private static CacheMgr<String> VIEWDEF_CACHE2 = new CacheMgr<String>("VIEWDEF_CACHE2", CacheMgr.CacheType.MVSTORE);
		
		protected static String getHashCode(FrameTask task) {
			// for now, this is always a call event, so base our hash off the call event params not the computed params
			Map<String, Object> params = task.getTriggerEvent().getParams();
			
			// remove a couple things that can mess up the hash code
			params.remove("_dc");
			params.remove("cache");
			
			return task.getFrame().getID() + ":" + task.getParamStr("pid") + ":" + params.hashCode();
		}
		
		private static int secondsBetween(PointInTime pit1, PointInTime pit2) {
			return Seconds.secondsBetween(pit1.toLocalDate(), pit2.toLocalDate()).getSeconds();
		}
		
		@Override
		public void exec(FrameTask task) throws FrameException {
        	// if the trigger is not the built in call trigger and its a PatientEvent then  
        	// add the ViewDefUpdateAction
        	if (!trigCall.isTriggerOf(task) && task.getTriggerEvent() instanceof PatientEvent) {
        		// not a CallEvent, dump the cache for the current patient
        		Iterator<String> itr = VIEWDEF_CACHE.iterator();
        		List<String> killList = new ArrayList<String>();
        		String pattern = task.getFrame().getID() + ":" + ((PatientEvent) task.getTriggerEvent()).getPID() + ":";
        		while (itr.hasNext()) {
        			String key = itr.next();
        			if (key.startsWith(pattern)) {
        				killList.add(key);
        			}
        		}
        		VIEWDEF_CACHE.remove(killList.toArray(new String[0]));
        		VIEWDEF_CACHE2.remove(killList.toArray(new String[0]));
        		super.exec(task);
        		return;
        	}
        	
        	long start = System.currentTimeMillis();
			try {
			// see if the results are in the cache
			String hash = getHashCode(task);
			boolean cacheDisabled = task.getParamInt("cache") == 0;
			if (cacheDisabled) {
				// cache specifically not allowed
				VIEWDEF_CACHE.remove(hash);
				VIEWDEF_CACHE2.remove(hash);
			} else {
				// may use cached results if found
				ViewRenderAction action = VIEWDEF_CACHE.fetch(hash);
				if (action != null) {
					task.addAction(action);
					return;
				}
				
				// alternate string cache
				String cachedstr = VIEWDEF_CACHE2.fetch(hash);
				if (cachedstr != null) {
					task.addAction(new CachedViewRenderAction(cachedstr));
					return;
				}
			}
			
			// no valid cache found, run normally
			super.exec(task);
			task.blockTillDone(System.currentTimeMillis() + 100000);
			ViewRenderAction action = task.getAction(ViewRenderAction.class);
            logger.debug("Data.size(): " + action.getResults().size());
			if (cacheDisabled) {
				return;
			}
			
			// add cache header/expiration data
			int ttlSec = -1;
			String cacheFor = task.getParamStr("cached_for");
			PointInTime cacheUntil = task.getParam(PointInTime.class, "cached_until");
			action.addHeaderData("cached_at", PointInTime.now().toString());
			if (cacheUntil != null && cacheFor != null) {
				ttlSec = secondsBetween(cacheUntil, PointInTime.now());
				action.addHeaderData("cached_until", cacheUntil.toString());
				action.addHeaderData("cached_for", cacheFor);
			}
			
			// store results into cache
			VIEWDEF_CACHE.store(hash, action, ttlSec);
			try {
				String cachestr = action.renderToString();
                logger.debug("CACHE STRING: " + cachestr);
				VIEWDEF_CACHE2.store(hash, cachestr, ttlSec);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			} finally {
                logger.info("CachedViewDef.exec(FrameTask): " + (System.currentTimeMillis() - start));
			}
		}
	}
	
	/**
	 * In a dynamic view def, the set of queries to run is constructed at runtime based on current parameter values.
	 * 
	 * Declaring parameters should still be done in the constructor
	 * 
	 * If the only thing that is dynamic is the queries and their definition, then this can be reused, if you
	 * have a need for custom columns, filters, etc then this will not be thread safe and probably can't be reused and
	 * a new instance must be created prior to each rendering.
	 * 
	 * @author brian
	 */
	public static class BoardViewDef extends ViewDef {
		
		private ViewDef base;

		public BoardViewDef(String name, ViewDef base, List<ColDef> cols) {
			setName(name);
			setID("dynamicviewdef:" + name); // TODO: Include user DUZ prefix to guarantee uniqueness?
			this.base = base; // TODO: Need to copy anything from base? (config, triggers, queries, etc?)
			
			// columns are merged from the base viewdef + the specified cols
			addColumns((ColDef[]) this.base.getColumns().toArray());
			addColumns((ColDef[]) cols.toArray());
		}
		
		@Override
		public void exec(FrameTask task) throws FrameException {
			// delegate to the base viewdef
			base.exec(task);
		}
	}

	public ArrayList<String> getDomainClasses() {
		return domainClasses;
	}
}
