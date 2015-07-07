package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.CheckInTime")
@Scope("prototype")
public class CheckInTime extends ViewDefBasedBoardColumn {

	public CheckInTime() {
		super(null);
	}
	
	public CheckInTime(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
        fieldName = "Today's Appointments";
    }

	@Override
	public String getType() {
		return ViewDefDefColDef.JSON;
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.AppointmentViewDef";
	}
	
	public Map<String, Object> getViewdefFilters() {
		Map<String, Object> rslt = new HashMap<String, Object>();
		rslt.put("range", "T..T+1");
		return rslt;
	}

	@Override
	public String getRenderClass() {
		return "checkin";
	}

	@Override
	public String getName() {
		return "Appt Check-in";
	}

	@Override
	public String getDescription() {
		return "This column displays a list of today's appointments and the status of the appointment. If there is a time associated with the status, such as checked-in, the time will also display.";
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Encounter.class.getSimpleName());
		return rslt;
	}
	
	public boolean getTitleEditable() {
		return false;
	}

    @Override
    protected void appendResults(List results, RenderTask rt, Map<String,Object> params) {
    	results.addAll(rt);
    }
}
