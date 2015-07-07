package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class ScheduledProcedures extends ViewDefBasedBoardColumn {

    @Autowired
    FrameRegistry registry;

    @Autowired
    ApplicationContext ctx;

    public ScheduledProcedures() {
        super(null);
    }

    public ScheduledProcedures(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Scheduled Procedures";
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.OrdersViewDef";
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    @Override
    public String getName() {
        return "Scheduled Procedures";
    }

    // Mandatory Imaging filter
    @Override
    public Map<String, Object> getViewdefFilters() {
        return viewdefFilters;
    }

    @Override
    public String getDescription() {
        return "TODO: Unfinished; Returns any orders for procedures (Imaging, Consult)";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Order.class.getSimpleName());
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Iterator<Map<String, Object>> iter = task.iterator();
        boolean found = false;
        while (iter.hasNext()) {
            found = true;
            Map<String, Object> itm = iter.next();
            results.add("Due " + PointInTimeFormat.dateTime().print(HL7DateTimeFormat.parse(itm.get("dueDate").toString())) + ": " + itm.get("summary").toString() + "<br>");
        }
        if (!found) {
            results.add("<a href=\"javascript:;\" onmousedown=\"gov.va.cpe.TaskWindow.showTaskForPatient(event, " + params.get("pid") + ")" +
                    "\">Add Task</a><br>");
        }
    }
}
