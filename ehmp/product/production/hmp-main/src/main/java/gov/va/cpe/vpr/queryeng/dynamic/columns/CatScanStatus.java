package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.frameeng.Frame;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.util.GenUtil;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

/**
 * This class is a complex case. 1) If no CAT scan orders have been placed within (default time, or user spec'ed time)
 * for this patient: - Return action advice for creating
 *
 * @author vhaislchandj
 */
@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.CatScanStatus")
@Scope("prototype")
public class CatScanStatus extends ViewDefDefColDef {

    @Autowired
    FrameRegistry registry;

    @Autowired
    ApplicationContext ctx;

    public CatScanStatus() {
        super(null);
    }

    public CatScanStatus(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "CT Scan";
        getViewdefFilters().put("range", "-1mo");
        getConfigProperties().put("range", "-7d..+1y");
    }

    public ArrayList<String> getFilterDescription() {
        ArrayList<String> filterDesc = new ArrayList<String>();
        filterDesc.add("Rad. Date Range: " + viewdefFilters.get("range"));
        filterDesc.add("Order Date Range: " + configProperties.get("range"));
        return filterDesc;
    }

    @Override
    public String getViewdefCode() {
        /**
         * Here's where we might plug in a frame.. or something with some input/output logic?
         * Multiple chained frames or viewdefs?
         * Need to learn more about the frame concept, work with BB on that.
         */
        return "gov.va.cpe.vpr.queryeng.ProceduresViewDef";
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    @Override
    public String getName() {
        return "CT Scan";
    }

    // Mandatory Imaging filter
    @Override
    public Map<String, Object> getViewdefFilters() {
        viewdefFilters.put("qfilter_kind", "Imaging");
        return viewdefFilters;
    }

    public List<Config> getViewdefFilterOptions() {
        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("range");
        conf.setLabel("Imaging reports within");
        opts.add(conf);
        return opts;
    }

    public List<Config> getConfigOptions() {
        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("range");
        conf.setLabel("Orders within");
        opts.add(conf);
        conf = new Config();
        conf.setName("site");
        conf.setLabel("Site");
        opts.add(conf);
        return opts;
    }

    @Override
    public String getDescription() {
        return "CAT scan results (based on Imaging Reports) within the specified time period. If no results found, " +
                "any orders (again within the specified time period) of type 'CT'. If no orders found, provides an " +
                "action link to create a Task of type 'Order'.";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Task.class.getSimpleName());
        rslt.add(Order.class.getSimpleName());
        rslt.add(Result.class.getSimpleName());
        return rslt;
    }

    @Override
    public Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
        Map<String, Object> result = new HashMap<String, Object>();
        ArrayList<String> results = new ArrayList<String>();
        try {
            Map<String, Object> params = new HashMap<>();
            params.putAll(this.getViewdefFilters());
            params.put("pid", dtask.roe.get("pid"));

            FrameJob job = dtask.runner.exec(getViewdefCode(), params);
            RenderTask task = job.getAction(ViewDef.ViewRenderAction.class).getResults();

            Iterator<Map<String, Object>> iter = task.iterator();
            boolean found = false;

            String site = null;
            if (configProperties.get("site") != null && !configProperties.get("site").equals("")) {
                site = configProperties.get("site").toString();
            }

            while (iter.hasNext()) {
                Map<String, Object> itm = iter.next();
                if (itm.get("imagingTypeUid") != null && itm.get("imagingTypeUid").equals("urn:va:imaging-Type:CT SCAN")) {
                    if (site == null || (itm.get("summary").toString().toLowerCase().contains(site.toLowerCase()))) {
                        found = true;
                        results.add("(" + itm.get("statusName").toString() + "): " + itm.get("summary").toString() + "<br>");
                    }
                }
            }
            if (!found) {
                // Need to render a different viewdef - looking for pending orders.
                configProperties.put("filter_group", "CT");
                configProperties.put("pid", params.get("pid"));

                task = dtask.runner.exec("gov.va.cpe.vpr.queryeng.OrdersViewDef", configProperties).getAction(ViewDef.ViewRenderAction.class).getResults();
                iter = task.iterator();
                while (iter.hasNext()) {
                    Map<String, Object> itm = iter.next();
                    if (site == null || (itm.get("name").toString().toLowerCase().contains(site.toLowerCase()))) {
                        found = true;
                        results.add("Ordered for: " + GenUtil.formatDate(itm.get("start").toString()) + "<br>");
                    }
                }
                if (!found) {
					/*
					 * This is a blatantly ugly hack that is just intended as a proof of concept.
					 * The column really wants to play a dual role, as both an action and informational column.
					 *
					 * A.K.A. "Black Magic part 1 of 2"
					 */
                    results.add("<a href=\"javascript:;\" onmousedown=\"gov.va.cpe.TaskWindow.showTaskForPatient(event, " + params.get("pid") + ")" +
                            "\">Add Task</a><br>");
                }
            }
        } catch (Frame.FrameExecException e) {
            e.printStackTrace();
            results.add("Error: " + e.getMessage());
            log.error("Cannot render CatScanStatus: " + e.getMessage(), e);
        } catch (Frame.FrameInitException e) {
            e.printStackTrace();
            results.add("Error: " + e.getMessage());
            log.error("Cannot render CatScanStatus: " + e.getMessage(), e);
        }
        result.put("results", results);
        return result;
    }

}
