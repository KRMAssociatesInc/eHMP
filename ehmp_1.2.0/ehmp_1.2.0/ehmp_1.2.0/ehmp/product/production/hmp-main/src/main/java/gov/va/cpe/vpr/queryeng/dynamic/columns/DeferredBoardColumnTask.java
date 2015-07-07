package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.PatientService;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.queryeng.ColDef.DeferredViewDefDefColDef;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

public class DeferredBoardColumnTask implements Callable<Map<String, Object>> {

    public boolean started = false;
    public boolean completed = false;
    public boolean pushed = false;
    public DeferredViewDefDefColDef dcol = null;
    public Map<String, Object> roe = null;
    public String boardReqId = null;
    public FrameRunner runner;
    public PatientService patientService;
    public String systemId;
    private Map<String, Object> result;
    private boolean failed;
    private Throwable exception;
    public Future<Map<String, Object>> future;

    public DeferredBoardColumnTask(
            DeferredViewDefDefColDef dcol,
            Map<String, Object> roe) {
        this.dcol = dcol;
        this.roe = roe;
    }

    public Map<String, Object> getData() {
        Map<String, Object> dat = new HashMap<String, Object>();
        dat.put("pid", roe.get("pid"));
        dat.put("sequence", this.dcol.cdef.sequence);
        dat.put("dataIndex", dcol.cdef.dataIndex);
        dat.put("data", this.result);
        return dat;
    }

    @Override
    public Map<String, Object> call() throws Exception {
        Map<String, Object> rslt = null;
        this.started = true;
        try {
            rslt = this.dcol.cdef.runDeferred(this);
        } catch (Exception e) {
            this.failed = true;
            this.exception = e;
            e.printStackTrace();
        }
        this.completed = true;
        result = rslt;
        return rslt;
    }
}
