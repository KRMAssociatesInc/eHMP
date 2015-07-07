package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.frameeng.Frame.FrameExecException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.ActiveOrders")
@Scope("prototype")
public class ActiveOrders extends ViewDefDefColDef {

	public ActiveOrders() {
		super(null);
	}
	
	public ActiveOrders(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
		fieldName = "Orders";
		getViewdefFilters().put("range", "2000..NOW");
		getViewdefFilters().put("qfilter_status", Arrays.asList("ACTIVE"));
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
		if(prop.equals("qfilter_status")) {
			return "Status";
		} else if(prop.equals("filter_group")) {
			return "Type";
		} else if(prop.equals("range")) {
			return "Start Date Range";
		} else if(prop.equals("qualifiedName")) {
			return "Name In";
		} else {
			return prop;
		}
	}

	public List<Config> getViewdefFilterOptions() {

		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("qfilter_status");
		conf.setLabel("Status");
		conf.setDataType(Config.DATA_TYPE_LIST);
		conf.addChoice("Active", "ACTIVE");
		conf.addChoice("Pending", "PENDING");
		conf.addChoice("Canceled", "CANCELED");
		conf.addChoice("Complete", "COMPLETE");
		conf.addChoice("Discontinued", "DISCONTINUED");
		conf.addChoice("Expired", "EXPIRED");
		conf.addChoice("Lapsed", "LAPSED");
		conf.addChoice("Scheduled", "SCHEDULED");
		conf.addChoice("Unreleased", "UNRELEASED");
		conf.addChoice("Discontinued/Edit", "DISCONTINUED/EDIT");
		
		//conf.setChoiceList(new ArrayList<String>(Arrays.asList("ACTIVE", "PENDING", "CANCELLED", "COMPLETE", "DISCONTINUED", "EXPIRED", "LAPSED", "SCHEDULED", "UNRELEASED", "DISCONTINUED/EDIT")));
		opts.add(conf);
		conf = new Config();
		conf.setName("range");
		conf.setLabel("Start Date Range");
		opts.add(conf);
		conf = new Config();
		conf.setName("filter_group");
		conf.setLabel("Type");
		conf.setDataType(Config.DATA_TYPE_LIST);
		conf.addChoice("Nursing", "NURS");
		conf.addChoice("Chemistry", "CH");
		conf.addChoice("Microbiology", "MI");
		conf.addChoice("Lab", "LAB");
		opts.add(conf);
		return opts;
	}
	
	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Orders";
	}

	@Override
	public String getDescription() {
		return "Summary list of orders within specified date range (ex: -1y for everything in the past year, -1w..+1w for anything between a week ago and a week in the future)";
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Order.class.getSimpleName());
		return rslt;
	}
	
	public Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
		Map<String, Object> result = new HashMap<String, Object>();
		ArrayList<String> results = new ArrayList<String>();
		try {
			//ViewDef ordVD = (ViewDef) runner.exec(frameid, params)getBean("gov.va.cpe.vpr.queryeng.OrdersViewDef");
        	// delegate to the FrameRunner
            Map<String, Object> params = new HashMap<>();
            params.putAll(this.getViewdefFilters());
			params.put("pid", dtask.roe.get("pid"));
        	FrameJob task = dtask.runner.exec("gov.va.cpe.vpr.queryeng.OrdersViewDef", params);
        	RenderTask rt = task.getAction(ViewRenderAction.class).getResults();
        	
			Iterator<Map<String, Object>> iter = rt.iterator();
			ArrayList<String> filterz = configPropertyToArray("qualifiedName", configProperties);
			while(iter.hasNext()) {
				Map<String, Object> itm = iter.next();
				String type = (itm.get("name")!=null?itm.get("name").toString():null);
				if(type!=null && itm.get("Status")!=null && itm.get("Summary") != null && (filterz == null || poorManFuzzySearch(filterz, type))) {
					results.add(itm.get("Status")+" "+itm.get("Summary")+(itm.get("start")!=null?itm.get("start"):"")+"<br>");
				}
			}
		} catch (FrameExecException e) {
			e.printStackTrace();
			results.add("Error: "+e.getMessage());
		} catch (FrameInitException e) {
			e.printStackTrace();
		}
		result.put("results",results);
		return result;
	}
}
