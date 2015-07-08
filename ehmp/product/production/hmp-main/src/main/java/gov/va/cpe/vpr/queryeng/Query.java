package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.frameeng.*;
import gov.va.cpe.vpr.frameeng.FrameAction.DebugInfo;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.RenderTask.RowRenderSubTask;

import org.apache.commons.lang.StringUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.util.*;


/**
 * TODO: re-write this documentation
 */
public interface Query {
	
	public String getPK();
	public String getQueryString();
	public void exec(RenderTask task) throws Exception;
	
	public abstract class AbstractQuery implements Query {
	    private static final Logger log = LoggerFactory.getLogger(Query.class);
	
	    private String pk;
	    private String qrystr;
	    private ExpressionParser parser;
	    private Expression expr;
	    
	    public AbstractQuery(String pk, String qrystr) {
	    	this.pk = pk;
	        this.qrystr = qrystr;
	    }
	    
	    public String getPK() {
	    	return this.pk;
	    }
	    
	    public String getQueryString() {
	        return this.qrystr;
	    }
	    
	    protected String evalQueryString(RenderTask renderer, String querystr) {
	        // only initialize the expression parser the first time
	        if (parser == null) {
	            parser = new SpelExpressionParser();
	        }
	        
	        if(expr==null) {
	        	// evaluate the default query string (and save for later)
	            expr = parser.parseExpression(querystr, new TemplateParserContext());
	        } else if (querystr != null && querystr != this.qrystr) {
	        	// evaluate something other than the default query string
	        	return parser.parseExpression(querystr, new TemplateParserContext()).getValue(renderer, String.class);
	        }
	
	        return (String) expr.getValue(renderer, String.class);
	    }

	    /**
	     * Can be overloaded to further process the row before its added.  IE converting data types, filtering, etc.
	     *
	     * @param row
	     * @return
	     */
	    protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
	        return row;
	    }
	}

    /**
     * StaticQuery is in essence the table class.
     */
    public static class StaticQuery extends AbstractQuery {
        private Collection<Map<String, Object>> data;
        
		public StaticQuery(String pk) {
            super(pk, null);
        }

        public StaticQuery(String pk, Collection<Map<String, Object>> data) {
            super(pk, null);
            this.data = data;
        }

        @Override
        public void exec(RenderTask task) {
        	if (data != null) task.addAll(this.data);
        }
    }

    public static class SOLRQuery extends AbstractQuery {
        private SolrServer solr;
		private String fq;

        public SOLRQuery(String pk, String qrystr) {
            super(pk, qrystr);
        }
        
        public SOLRQuery(String pk, String qrystr, String filterstr) {
        	super(pk, qrystr);
        	this.fq = filterstr;
        }
        
        @Override
        public void exec(RenderTask task) throws Exception {
        	if (this.solr == null) {
        		this.solr = task.getResource(SolrServer.class);
        	}

        	// create/edit query
            String newQry = evalQueryString(task, getQueryString());
            SolrQuery solrParams = new SolrQuery(newQry);
            if (this.fq != null) {
            	solrParams.setFilterQueries(evalQueryString(task, this.fq));
            }
            
            // add sort+limit criteria (if found)
            String sortCol = task.getParamStr("sort.col"); 
            String sortDir = task.getParamStr("sort.dir");
            int limit = task.getParamInt("row.count");
            if (sortCol != null && sortDir != null) {
            	solrParams.addSort(sortCol, ORDER.valueOf(sortDir.toLowerCase()));
            }
            if (limit > 0) {
            	solrParams.setRows(limit);
            }
            
            // include debug info
            
            // execute SOLR query and include debug info
            modifySolrQuery(solrParams, task);
            task.addAction(new DebugInfo("solr.query", solrParams.toString()));
            QueryResponse resp = solr.query(solrParams);
            mapResults(task, resp);
        }
        
        /** optional extention to modify the solr query before it is run */
        protected void modifySolrQuery(SolrQuery qry, RenderTask task) {
        	
        }
        
        /** Map the resulting documents into Map<String,Objects> */
        protected void mapResults(RenderTask task, QueryResponse resp) {
            // add results
        	SolrDocumentList docs = resp.getResults();
            for (SolrDocument doc : docs) {
            	task.add(mapRow(task, doc));
            }
        }
    }

    public static class SOLRFacetQuery extends SOLRQuery {
        private String facetField;

        public SOLRFacetQuery(String pk, String solrQry, String facetField) {
            super(pk, solrQry);
            this.facetField = facetField;
        }

        public String getFacetField() {
            return facetField;
        }

        @Override
        protected void modifySolrQuery(SolrQuery qry, RenderTask task) {
        	qry.setFacet(true);
        	qry.setRows(0);
        	qry.setFacetMinCount(1);
        	qry.addFacetField(this.facetField);
        }
        
        protected void mapResults(RenderTask task, QueryResponse resp) {
            FacetField ff = resp.getFacetFields().get(0);
            if (ff == null || ff.getValues() == null) {
                return;
            }
            
            // Experiment for PER_ROW mappings: Results are columns not rows.
            if (task instanceof RowRenderSubTask) {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put(getPK(), ((RowRenderSubTask) task).getParentRowVal(getPK()));
                for (Count c : ff.getValues()) {
                    map.put(c.getName(), c.getCount());
                }
                task.add(mapRow(task, map));
            } else {
                for (Count c : ff.getValues()) {
                    Map<String, Object> map = new HashMap<String, Object>();
                    map.put(this.facetField, c.getName());
                    map.put("count", c.getCount());
                    task.add(mapRow(task, map));
                }
            }
        }
    }
    
	public static class FrameQuery extends AbstractQuery {
		private Class<? extends IPatientObject> clazz;

		public FrameQuery(String pk, String entryPoint, Class<? extends IPatientObject> clazz) {
			super(pk, entryPoint);
			this.clazz = clazz;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			if (task instanceof RowRenderSubTask) {
				IGenericPatientObjectDAO dao = task.getResource(IGenericPatientObjectDAO.class);
				FrameRunner runner = task.getResource(FrameRunner.class);
				String uid = ((RowRenderSubTask) task).getParentRowKey();
				IPatientObject obj = (this.clazz != null) ? dao.findByUID(this.clazz, uid) : null;
				IFrameEvent<?> evt = new InvokeEvent<IPatientObject>(getQueryString(), obj);
//				FrameJob docket = runner.exec(evt);
				FrameJob job = runner.createJob(evt);
				for (FrameTask subtask : job.getSubTasks()) {
					task.addSubTask(subtask);
				}
//				task.appendVal(uid, "actions", docket.getActions());
			} else {
				throw new IllegalArgumentException("FrameExecMapper must be nested inside a PerRow**Mapper");
			}
		}
	}
	
	/**
	 * An attempt to more efficiently run a group of frames on a table of results.
	 * @author brian
	 */
	public static class PerRowFrameQuery extends AbstractQuery {
		private IGenericPatientObjectDAO dao;
		private FrameRunner runner;
		private Class<? extends IPatientObject> clazz;
		
		public PerRowFrameQuery(String field, String entryPoint, Class<? extends IPatientObject> clazz) {
			super(field, entryPoint);
			this.clazz = clazz;
		}
		
		public void exec(RenderTask task) throws Exception {
			// initalize if necessary
			if (dao == null || runner == null) {
				dao = task.getResource(IGenericPatientObjectDAO.class);
				runner = task.getResource(FrameRunner.class);
			}
			
			// build a job with an event to represent each row
			RenderTask parentctx = (RenderTask) task.getParentContext();
			Map<IFrameEvent<?>, String> events = new HashMap<IFrameEvent<?>, String>();
			for (String pkval : parentctx.getResults().getPKValues()) {
				IPatientObject obj = (this.clazz != null) ? dao.findByUID(this.clazz, pkval) : null;
				events.put(new InvokeEvent<IPatientObject>(getQueryString(), obj), pkval);
			}
			
			// run the job, map the actions back into the results 
			FrameJob job = runner.exec(new ArrayList<IFrameEvent<?>>(events.keySet()));
			for (FrameTask subtask : job.getSubTasks()) {
				// add the task as a subtask so it appears in debug info
				task.addSubTask(subtask);
				
				// use the map we created above to store the actions in the correct row
				String pkval = events.get(subtask.getTriggerEvent());
				List<FrameAction> actions = subtask.getActions();
				if (!actions.isEmpty()) {
					Map<String, Object> row = parentctx.getRow(pkval);
					if (row.containsKey(getPK())) {
						// merge existing actions
						actions = new ArrayList<FrameAction>(actions);
						actions.addAll((List<FrameAction>) row.get(getPK()));
					}
					parentctx.appendVal(pkval, getPK(), actions);
				}
			}
		}

	}
	
	/**
	 * Instead of directly embedding a nested viewdef via an object reference, you can specify the viewid
	 * and it will be retrived from the frameregistry at runtime.
	 * 
	 * Also permits you to inject additional params into the viewdef before running.
	 * 
	 * @author brian
	 */
	public static class ViewDefLookup extends AbstractQuery {
		private Map<String, Object> params;
		private FrameRegistry registry;

		public ViewDefLookup(String viewid) {
			this(viewid, null);
		}
		
		public ViewDefLookup(String viewid, Map<String, Object> extraParams) {
			super(viewid /*place holder, not used*/, viewid);
			this.params = extraParams;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			if (registry == null) {
				registry = task.getResource(FrameRegistry.class);
			}
			
			IFrame frame = registry.findByID(getQueryString());
			if (frame != null && frame instanceof ViewDef) {
				if (this.params != null) task.setParams(this.params);
				((ViewDef) frame).exec(task);
			}
		}
	}
	
	/**
	 * This query reads JSON documents from a file directory/filter
	 */
	public static class JSONFileQuery extends AbstractQuery {
		private File[] files;
		public static FileFilter JSON_FILES = new FileFilter() {
			@Override
			public boolean accept(File pathname) {
				return pathname.isFile() && pathname.getName().endsWith(".json");
			}
		};
		
		public JSONFileQuery(String pk, File[] files) {
			super(pk, null);
			this.files = files;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			for (File file : files) {
				FileInputStream fis = new FileInputStream(file);
				Map<String, Object> row = POMUtils.parseJSONtoMap(fis);
				if (row != null && row.size() > 0) {
					task.add(this.mapRow(task, row));
				}
				fis.close();
			}
		}
	}
	
}