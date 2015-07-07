package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.frameeng.Frame;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.queryeng.RenderTask;

import java.util.*;

import static gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction;

public abstract class ViewDefBasedBoardColumn extends ViewDefDefColDef {

	private final static int UNLIMITED_ROW_COUNT = 0;
	
    public ViewDefBasedBoardColumn() {
        super();
    }

    public ViewDefBasedBoardColumn(Map<String, Object> vals) {
        super(vals);
    }

    public final Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
        List<String> results = new ArrayList<String>();
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            params.putAll(this.getViewdefFilters());
            params.put("pid", dtask.roe.get("pid"));
            params.put(gov.va.cpe.vpr.queryeng.ViewParam.SystemIDParam.SYSTEM_ID, dtask.systemId);
            params.put("row.count", UNLIMITED_ROW_COUNT);	// this will cause the column view to retrieve all rows
            
            FrameJob task = dtask.runner.exec(getViewdefCode(), params);
            RenderTask rt = task.getAction(ViewRenderAction.class).getResults();

            appendResults(results, rt, params);
        } catch (Frame.FrameExecException e) {
            e.printStackTrace();
            results.add("Error: " + e.getMessage());
        } catch (Frame.FrameInitException e) {
            e.printStackTrace();
            results.add("Error: " + e.getMessage());
        }
        return Collections.singletonMap("results", (Object) results);
    }

    protected abstract void appendResults(List results, RenderTask task, Map<String,Object> params);
}
