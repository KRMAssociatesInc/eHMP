package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.DietOrders")
@Scope("prototype")
public class DietOrders extends ViewDefBasedBoardColumn {

    private static final long serialVersionUID = 1L;

	public DietOrders() {
    	super(null);
    }
    
    public DietOrders(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
        fieldName = "Diet Status";
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
		return "Diet Status";
	}

	@Override
	public void setViewdefFilters(Map<String, Object> viewdefFilters) {
//		this.viewdefFilters = viewdefFilters;
	}
	
	@Override
	public Map<String, Object> getViewdefFilters() {
		/*
		 *  Mandatory displayGroup values gleaned from FileMan Dietary structure.
		 */
		viewdefFilters.put("filter_group", Arrays.asList("DIET","DO","TF","D AO","E/L T","PREC","MEAL"));
		viewdefFilters.put("qfilter_status", "ACTIVE");
		return viewdefFilters;
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("filter_group")) {
			return "";
		} else if(prop.equals("showDietName")) {
			return "Show Name of Diet";
		} else {
			return prop;
		}
	}

	public List<Config> getConfigOptions() {
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("showDietName");
		conf.setLabel("Show Name of Diet when non-NPO");
		conf.setDataType(Config.DATA_TYPE_BOOLEAN);
		opts.add(conf);
		return opts;
	}

	@Override
	public String getDescription() {
		return "This column shows if the patient has a diet ordered, is NPO, or has no diet ordered. The column can be configured to show the name of the diet when the diet is not NPO.";
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Order.class.getSimpleName());
		return rslt;
	}
	
	public boolean getTitleEditable() {
		return false;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        boolean showDietName = configProperties.get("showDietName")!=null?Boolean.parseBoolean(configProperties.get("showDietName").toString()):false;
        boolean found = false;
        Iterator<Map<String, Object>> iter = task.iterator();
        while(iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            PointInTime start = HL7DateTimeFormat.parse((String) itm.get("start"));
            PointInTime stop = HL7DateTimeFormat.parse((String) itm.get("stop"));
            PointInTime now = PointInTime.now();
            if(start!=null && start.before(now)) {
                if(stop==null || stop.after(now)) {
                    found = true;
                    String val = (itm.get("summary")!=null?itm.get("summary"):itm.get("content")!=null?itm.get("content"):itm.get("oiName")).toString();
                    if((!showDietName) && (!val.contains("NPO"))) {
                        val = "Ordered";
                    }
                    results.add("<div style=\"white-space: normal;\">"+val+"</div>");
                }
            }
        }
        if(!found) {
            results.add("<span class='text-muted'>No Active Diet</span><br>");
        }
    }
}
