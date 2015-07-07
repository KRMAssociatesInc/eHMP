package gov.va.cpe.vpr.queryeng;

import com.codahale.metrics.Timer;
import gov.va.cpe.vpr.frameeng.Frame.FrameExecException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.metrics.MetricRegistryHolder;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Primary query's RenderTask serves as the return value
 * 
 * Serves as primary execution mechanism (synchronous, async)
 * 
 * @author brian
 */
public class RenderTask extends FrameTask implements Collection<Map<String,Object>> {  
	private static ExpressionParser parser = new SpelExpressionParser();
	
	private Table results;
	private Query q;
	private ViewDef def;
    private JsonCCollection<Map<String, Object>> rawResponse;

    public RenderTask(FrameTask task, ViewDef def, Query q) {
		super(task, def, task.getTriggerEvent(), task.getFrameTrigger());
		this.results = new Table(q.getPK());
		assert task != null;
		this.q = q;
		this.def = def;
	}
	
	public RenderTask(RenderTask parent, Query q) {
		this(parent, parent.def, q);
	}
	
	public RenderTask(ViewDef def, Query q) {
		super(def);
		this.results = new Table(q.getPK());
		this.q = q;
		this.def = def;
	}
	
	// Primary getters --------------------------------------------------------
	
	public ViewDef getViewDef() {
		return def;
	}
	
	public Query getQuery() {
		return q;
	}
	
    public String evalString(String querystr) {
        return parser.parseExpression(querystr, new TemplateParserContext()).getValue(this, String.class);
    }
    
    public Table getResults() {
    	return this.results;
    }
    
	// table-delegate convience methods (also for backwards compatability) ----
	
	public boolean add(Map<String, Object> row) {
		return this.results.add(row);
	}
	
	public int size() {
		return this.results.size();
	}
	
	public Map<String, Object> getRowIdx(int idx) {
		return this.results.getRowIdx(idx);
	}
    
	public Map<String, Object> getRow(String pkval) {
		return this.results.getRow(pkval);
	}
	
    @Override
	public Iterator<Map<String, Object>> iterator() {
    	return this.results.iterator();
	}
    
    public String getPK() {
    	return this.results.getPK();
    }
    
    public Object getCellIdx(int idx, String colkey) {
    	return this.results.getCellIdx(idx, colkey);
    }
    
    public boolean appendRow(String pkval, Map<String, Object> row) {
    	return this.results.appendRow(pkval, row);
    }
    
	public boolean appendVal(String pkval, String key, Object val) {
		return this.results.appendVal(pkval, key, val);
	}
	
	public Collection<Map<String, Object>> getRows() {
		return this.results.getRows();
	}

	@Override
	public RenderTask call() throws FrameExecException, FrameInitException {
		this.runThreadName = Thread.currentThread().getName();
		Timer.Context watch = MetricRegistryHolder.getMetricRegistry().timer("view.query." + getQuery().getClass().getSimpleName()).time();
		try {
			getQuery().exec(this);
		} catch (Exception ex) {
			throw new FrameExecException(getFrame(), "Exception Executing Query", ex);
		}
		this.execTimeMS = TimeUnit.NANOSECONDS.toMillis(watch.stop());
		
		// run any subtasks
		for (FrameTask task : getSubTasks()) {
			task.exec();
		}
		return this;
	}
	
	// Collection interface (Delegates to table)  -----------------------------

	@Override
	public boolean isEmpty() {
		return this.results.isEmpty();
	}

	@Override
	public boolean contains(Object o) {
		return this.results.contains(o);
	}

	@Override
	public Object[] toArray() {
		return this.results.toArray();
	}

	@Override
	public <T> T[] toArray(T[] a) {
		return this.results.toArray(a);
	}

	@Override
	public boolean remove(Object o) {
		return this.results.remove(o);
	}

	@Override
	public boolean containsAll(Collection<?> c) {
		return this.results.containsAll(c);
	}

	@Override
	public boolean addAll(Collection<? extends Map<String, Object>> c) {
		return this.results.addAll(c);
	}

	@Override
	public boolean removeAll(Collection<?> c) {
		return this.results.removeAll(c);
	}

	@Override
	public boolean retainAll(Collection<?> c) {
		return this.results.retainAll(c);
	}

	@Override
	public void clear() {
		this.results.clear();
	}
	
	@Override
	public String toString() {
		return super.toString() + "; Q=" + getQuery().toString() + "; Rows=" + size();
	}

    public void setRawResponse(JsonCCollection<Map<String, Object>> rawResponse) {
        this.rawResponse = rawResponse;
    }

    public JsonCCollection getRawResponse() {
        return rawResponse;
    }


    // Subclasses -------------------------------------------------------------

	public static class RowRenderSubTask extends RenderTask {
		private int rowidx;
		
		public RowRenderSubTask(RenderTask parentTask, Query q, int rowidx) {
			super(parentTask, q);
			assert rowidx >= 0;
			this.rowidx = rowidx;
		}
		
		@Override
		public RenderTask getParentContext() {
			return (RenderTask) super.getParentContext();
		}
		
	    // current row/parent row ---------------------------------------------
		
		public int getRowIdx() {
			return this.rowidx;
		}
	    
	    public String getParentRowKey() {
	    	if (getParentContext() == null || getRowIdx() <= -1) {
	    		return null;
	    	}
	    	Object obj = getParentContext().getCellIdx(getRowIdx(), getParentContext().getPK());
	    	if (obj == null) return null;
	    	return obj.toString();
	    }
	    
	    public String getParentRowPK() {
	    	if (getParentContext() == null || getRowIdx() <= -1) {
	    		return null;
	    	}
	    	return getParentContext().getPK();
	    }
	    
	    public Object getParentRowVal(String key) {
	    	if (getParentContext() == null || getRowIdx() <= -1) {
	    		return null;
	    	}
	    	return getParentContext().getCellIdx(getRowIdx(), key);
	    }
	    
	    public Map<String, Object> getParentRow() {
	    	if (getParentContext() == null || getRowIdx() <= -1) {
	    		return null;
	    	}
	    	return getParentContext().getRowIdx(getRowIdx());
	    }
	    
	}
}