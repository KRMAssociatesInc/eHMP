package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.util.GenUtil;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.Consultations")
@Scope("prototype")
public class Consultations extends ViewDefBasedBoardColumn {

	public Consultations() {
		super(null);
	}
	
	public Consultations(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
        fieldName = "Consultations";
        getViewdefFilters().put("range", "-1y");
        getViewdefFilters().put("qfilter_status", Arrays.asList("PENDING"));
        getConfigProperties().put("displaySummaryCount", true);
    }

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.ProceduresViewDef";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("qfilter_status")) {
			return "Status";
		} else if(prop.equals("range")) {
			return "Start Date Range";
		} else if(prop.equals("qfilter_kind")) {
			return "";
		} else if(prop.equals("displaySummaryCount")) {
			return "Summary Count";
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
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("PENDING", "CANCELLED", "COMPLETE", "DISCONTINUED")));
		conf.addChoice("Pending", "PENDING");
		conf.addChoice("Canceled", "CANCELLED");
		conf.addChoice("Complete", "COMPLETE");
		conf.addChoice("Discontinued", "DISCONTINUED");
		opts.add(conf);
		conf = new Config();
		conf.setName("range");
		conf.setLabel("Start Date Range");
		opts.add(conf);
		return opts;
	}
	
	public List<Config> getConfigOptions() {
		
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("displaySummaryCount");
		conf.setLabel("Show Summary Count instead of Details");
		conf.setDataType(Config.DATA_TYPE_BOOLEAN);
		opts.add(conf);
		return opts;
	}
	
	public Map<String, Object> getViewdefFilters() {
		viewdefFilters.put("qfilter_kind", Arrays.asList("Consult"));
		return viewdefFilters;
	}
	
	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Consultations";
	}

	@Override
	public String getDescription() {
		return "List of consults within the specified date range.";
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Procedure.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        if(configProperties.get("displaySummaryCount")!=null && configProperties.get("displaySummaryCount").toString().equals("true")) {
            results.add(task.getRows().size()+"");
        } else {
            Iterator<Map<String, Object>> iter = task.iterator();
            while(iter.hasNext()) {
                // Maybe group these by date? Just show a count?
                Map<String, Object> itm = iter.next();
                String type = (itm.get("service")!=null?itm.get("service").toString():null);
                if(type!=null && itm.get("statusName")!=null && itm.get("summary") != null && itm.get("dateTime") != null) {
                    results.add(type+" "+(itm.get("start")!=null?GenUtil.formatDate(itm.get("dateTime")):"")+"<br>");
                }
            }
        }
    }
}
