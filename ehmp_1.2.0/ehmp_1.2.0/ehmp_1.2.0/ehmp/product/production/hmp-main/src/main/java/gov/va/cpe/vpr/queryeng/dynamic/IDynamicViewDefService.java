package gov.va.cpe.vpr.queryeng.dynamic;

import gov.va.cpe.vpr.queryeng.ColDef.DeferredViewDefDefColDef;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.DeferredBoardColumnTask;

import java.util.ArrayList;
import java.util.Map;


public interface IDynamicViewDefService {
	public ViewDef getViewDefByUid(String uid);
	public void setViewDefDef(ViewDefDef def);
	public DeferredBoardColumnTask submitDeferredColTask(
			String boardReqId,
			DeferredViewDefDefColDef dcol,
			Map<String, Object> roe);
	public ArrayList<DeferredBoardColumnTask> getCompletedUnsentDeferredTasks(String boardReqId);
	public boolean checkForRemainingTasks(String boardReqId);
	public void wakeTask(String boardReqId, String col, String pid);
	public void linkRequestToSession(String breq, String sessionId);
}
