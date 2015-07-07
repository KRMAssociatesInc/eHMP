package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.ReasonForVisit")
@Scope("prototype")
public class ReasonForVisit extends ViewDefBasedBoardColumn {

    public ReasonForVisit() {
    	super(null);
    }
    
    public ReasonForVisit(Map<String, Object> vals) {
		super(vals);
	}
    
    @PostConstruct
	public void init() {
		fieldName = "Reason For Visit";
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.CurrentAppointmentViewDef";
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Reason For Visit";
	}

	@Override
	public String getDescription() {
		return "This displays the reason entered for the appointment at the time the appointment was created.";
	}
	
	public boolean isEditable(Iterator<Map<String, Object>> iter) {
		return iter.hasNext();
	}
	
	public boolean getTitleEditable() {
		return false;
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Encounter.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Iterator<Map<String, Object>> iter = task.iterator();
        String reason = null;
        boolean found = false;
        while(iter.hasNext()) {
            found = true;
            Map<String, Object> itm = iter.next();
            Object cstr = itm.get("reasonName");
            if(cstr!=null) {
                reason = cstr.toString();
            }
        }
        if(!found) {
            results.add("<span class=\"text-muted\">No Current Visit</span>");
        } else if(reason!=null) {
            results.add(reason);
        } else {
            results.add("<span class=\"text-muted\">None Given</span>");
        }
    }
}
