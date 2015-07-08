package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.ResultedOrders")
@Scope("prototype")
public class ResultedOrders extends ViewDefBasedBoardColumn {

    public ResultedOrders() {
        super(null);
    }

    public ResultedOrders(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Orders w/ Results";
        getViewdefFilters().put("range", "2000..NOW");
        getViewdefFilters().put("qfilter_status", Arrays.asList("ACTIVE", "PENDING", "COMPLETED"));
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.OrdersViewDef";
    }

    public List<Config> getConfigOptions() {

        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("qualifiedName");
        conf.setLabel("Name (Blank=ALL)");
        conf.setDataType(Config.DATA_TYPE_STRING);
        opts.add(conf);

        return opts;
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("qfilter_status")) {
            return "Status";
        } else if (prop.equals("filter_group")) {
            return "Type";
        } else if (prop.equals("range")) {
            return "Start Date Range";
        } else if (prop.equals("qualifiedName")) {
            return "Name In";
        } else {
            return prop;
        }
    }

    public List<Config> getViewdefFilterOptions() {

        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("range");
        conf.setLabel("Start Date Range");
        opts.add(conf);
        conf = new Config();
        conf.setName("filter_group");
        conf.setLabel("Type");
        conf.setDataType(Config.DATA_TYPE_LIST);
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("CT", "MRI", "CH", "LAB")));
        conf.addChoice("CT Scan", "CT");
        conf.addChoice("MRI Scan", "MRI");
        conf.addChoice("Chemistry", "CH");
        conf.addChoice("Lab", "LAB");
        conf.addChoice("Microbiology", "MI");
        conf.addChoice("Nursing", "NURS");
        opts.add(conf);
        conf = new Config();
        conf.setName("qfilter_status");
        conf.setLabel("Status");
        conf.setDataType(Config.DATA_TYPE_LIST);
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("ACTIVE","PENDING","COMPLETE")));
        conf.addChoice("Active", "ACTIVE");
        conf.addChoice("Pending", "PENDING");
        conf.addChoice("Complete", "COMPLETE");
        opts.add(conf);
        return opts;
    }

    @Override
    public String getRenderClass() {
        return "resultedOrders";
    }

    @Override
    public String getName() {
        return "Orders w/ Results";
    }

    @Override
    public String getDescription() {
        return "Orders with result data, if it exists.";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Order.class.getSimpleName());
        rslt.add(Result.class.getSimpleName());
        rslt.add(Procedure.class.getSimpleName());
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Iterator<Map<String, Object>> iter = task.iterator();
        ArrayList<String> filterz = configPropertyToArray("qualifiedName", configProperties);
        int orderCnt = 0, activeCnt = 0, completeCnt = 0, pendingCnt = 0, resultCnt = 0;
        String status =  "";
        while (iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            String type = (itm.get("name") != null ? itm.get("name").toString() : null);
            if (type != null && (status = (String)itm.get("Status")) != null && itm.get("Summary") != null && (filterz == null || poorManFuzzySearch(filterz, type))) {
            	switch (status) {
            		case "ACTIVE": activeCnt++; break;
            		case "COMPLETE": completeCnt++; break;
            		case "PENDING": pendingCnt++; break;
                	default:
            	}
            	List<String> itmResults = (List<String>)itm.get("results");
            	if ( itmResults != null ) {
            		resultCnt += itmResults.size();
            	}
            }
            orderCnt++;
        }
        
        List<String> curStatusFilter = (ArrayList<String>)viewdefFilters.get("qfilter_status");
        
        Map<String, Object> countsMap = new HashMap<String, Object>();
        
        countsMap.put("ORDERED", orderCnt);
        if (curStatusFilter.contains("ACTIVE")) {
        	countsMap.put("ACTIVE", activeCnt);
        }
        if (curStatusFilter.contains("COMPLETE") ) {
        	countsMap.put("COMPLETED", completeCnt);
        }
        if (curStatusFilter.contains("PENDING")) {
        	countsMap.put("PENDING", pendingCnt);
        }
        countsMap.put("RESULT", resultCnt);
        
        results.add(countsMap);
    }
    
    //	@Override
//	public EditorOption getEditOpt() {
//		EditorOption eo = new EditorOption("resultedOrders","resultedOrders");
//		return eo;
//	}
}
