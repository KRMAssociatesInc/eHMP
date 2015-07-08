package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.LabDraws")
@Scope("prototype")
public class LabDraws extends ViewDefBasedBoardColumn {
	
    public LabDraws() {
    	super(null);
    }
    
    public LabDraws(Map<String, Object> vals) {
		super(vals);
	}
	
	@PostConstruct
	public void init() {
		fieldName = "Lab Collections<br>Today";
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
		return "Lab Collections<br>Today";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("filter_group")) {
			return "";
		} else {
			return prop;
		}
	}
	
	// Mandatory Imaging filter
	@Override
	public Map<String, Object> getViewdefFilters() {
		/*
		 *  Mandatory displayGroup values gleaned from FileMan Laboratory structure.
		 *  TODO: Confirm that these four values cover all inpatient nursing lab draw types that will be applicable.
		 */
		viewdefFilters.put("filter_group", Arrays.asList("LAB","CH","HEMA","MI"));
		return viewdefFilters;
	}

	public boolean getTitleEditable() {
		return false;
	}

	@Override
	public String getDescription() {
		return "All lab orders that have a start time of today and fall into lab-type display groups (\"LAB\",\"CH\",\"HEMA\",\"MI\")";
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Result.class.getSimpleName());
        rslt.add(Order.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Iterator<Map<String, Object>> iter = task.iterator();
        while(iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            PointInTime start = itm.get("start")==null?PointInTime.now():new PointInTime(itm.get("start").toString());
            if(start.getDate() == PointInTime.now().getDate() && start.getMonth() == PointInTime.now().getMonth() && start.getYear() == PointInTime.now().getYear()) {
                String time = start.getPrecision().greaterThan(Precision.HOUR)?"<i>Anytime</i>": PointInTimeFormat.dateTime().print(start);
                String detail = (itm.get("summary")!=null?itm.get("summary"):itm.get("content")!=null?itm.get("content"):itm.get("oiName")).toString();
                results.add("<text title='"+detail+"'>"+time+"</text><br>");
            }
        }
    }
}
