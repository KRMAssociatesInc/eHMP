package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.OtherAppointments")
@Scope("prototype")
public class OtherAppointments extends ViewDefBasedBoardColumn {

	public OtherAppointments() {
		super(null);
	}
	
	public OtherAppointments(Map<String, Object> vals) {
		super(vals);
	}
	
	@PostConstruct
	public void init() {
		fieldName = "Appointments";
		getViewdefFilters().put("range", "+1w");
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.AppointmentViewDef";
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Appointments";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("range")) {
			return "Appt. Date Range";
		} else {
			return prop;
		}
	}
	
	public List<Config> getViewdefFilterOptions() {
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("range");
		conf.setLabel("Appointment Date");
		opts.add(conf);
		
		return opts;
	}

	@Override
	public String getDescription() {
		return "All future appointments (or appointments in the specified time range, can be past as well.)";
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Encounter.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        String lastTime = null;
        for(Map<String, Object> itm : task) {
            String timeCat = PointInTimeFormat.dateTime().print(new PointInTime(itm.get("dateTime").toString()))+" - "+itm.get("categoryName");
            if(lastTime==null || !timeCat.equals(lastTime)) {
                results.add("<b>"+timeCat+"</b></br>");
                lastTime = timeCat;
            }

            Object clinic = itm.get("locationName");
            Object facility = itm.get("facilityName");
            Object cat = itm.get("stopCodeName");
            Object stat = itm.get("appointmentStatus");

            results.add("<table class=\"hmp-labeled-values\"><tr><td>"+clinic+"</td><td>"+facility+"</td></tr>");
            results.add("<tr><td>"+cat+"</td><td>"+stat+"</td></tr></table>");
            //results.add(itm.get("typeName")+": "+ PointInTimeFormat.dateTime().print(t)+"<br>");

        }
    }
}
