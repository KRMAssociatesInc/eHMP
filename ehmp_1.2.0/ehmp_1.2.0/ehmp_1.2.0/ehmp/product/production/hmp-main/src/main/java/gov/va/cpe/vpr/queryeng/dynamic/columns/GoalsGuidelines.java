package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.GoalsGuidelines")
@Scope("prototype")
public class GoalsGuidelines extends ViewDefBasedBoardColumn {

	public GoalsGuidelines() {
		super(null);
	}
	
	public GoalsGuidelines(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
        fieldName = "Goals and Guidelines";
        getConfigProperties().put("displaySummaryCount", true);
    }

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.GoalsDueViewDef";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("displaySummaryCount")) {
			return "Summary Count";
		} else {
			return prop;
		}
	}

//	public List<Config> getViewdefFilterOptions() {
//
//		ArrayList<Config> opts = new ArrayList<Config>();
//		Config conf = new Config();
//		conf.setName("qfilter_status");
//		conf.setLabel("Status");
//		conf.setDataType(Config.DATA_TYPE_LIST);
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("ACTIVE", "INACTIVE", "REMOVED")));
//		opts.add(conf);
//		return opts;
//	}
	
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
		return "Goals and Guidelines";
	}

	private String getMostSevereStatus(Iterator<Map<String, Object>> rose) {
		String rslt = "";
		while(rose.hasNext()) {
			Map<String, Object> row = rose.next();
			String stat = row.get("status_code").toString();
			// For now, just return overdue if found, otherwise nothing.
			if(stat.equalsIgnoreCase("OVERDUE")) {
				rslt = row.get("status").toString();
			}
		}
		return rslt;
	}

	@Override
	public String getDescription() {
		return "Current goals due for this patient. Shows 'OVERDUE' in summary if applicable.";
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Procedure.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        boolean summary = configProperties.get("displaySummaryCount")!=null && configProperties.get("displaySummaryCount").toString().equals("true");
        if(summary) {
            results.add(task.getRows().size()+" "+getMostSevereStatus(task.iterator()));
        } else {
            Iterator<Map<String, Object>> iter = task.iterator();
            results.add("<table class=\"hmp-labeled-values\">");
            while(iter.hasNext()) {
                Map<String, Object> itm = iter.next();
                if(itm.get("focus") != null && itm.get("status")!=null) {
                    results.add("<tr><td>"+itm.get("focus").toString()+"</td><td>"+itm.get("status")+"</td></tr>");
                }
            }
            results.add("</table>");
        }
    }
}
