package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.Conditions")
@Scope("prototype")
public class Conditions extends ViewDefBasedBoardColumn {

	public Conditions() {
		super(null);
	}
	
	public Conditions(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
        fieldName = "Conditions";
        getViewdefFilters().put("qfilter_status", Arrays.asList("ACTIVE"));
        getConfigProperties().put("displaySummaryCount", true);
    }

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.ProblemViewDef";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("qfilter_status")) {
			return "Status";
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
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("ACTIVE", "INACTIVE", "REMOVED")));
		conf.addChoice("Active", "ACTIVE");
		conf.addChoice("Inactive", "INACTIVE");
		conf.addChoice("Removed", "REMOVED");
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
	
	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Conditions";
	}

	@Override
	public String getDescription() {
		return "List of conditions";
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Procedure.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask rt, Map<String,Object> params) {
        if(configProperties.get("displaySummaryCount")!=null && configProperties.get("displaySummaryCount").toString().equals("true")) {
            results.add(rt.getRows().size()+"");
        } else {
            Iterator<Map<String, Object>> iter = rt.iterator();
            while(iter.hasNext()) {
                Map<String, Object> itm = iter.next();
                if(itm.get("summary") != null) {
                    results.add(itm.get("summary").toString()+"<br>");
                }
            }
        }
    }
}
