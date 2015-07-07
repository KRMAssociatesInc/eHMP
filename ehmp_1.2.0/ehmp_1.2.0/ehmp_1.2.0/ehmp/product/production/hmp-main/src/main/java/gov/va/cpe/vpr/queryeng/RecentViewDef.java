package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.PatientTimeline;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/** 
 * drives the news feed time line visualization 
 * TODO: probably want to change this to faceted query so we are not dealing with 1000's of results? 
 **/
@Component(value="gov.va.cpe.vpr.queryeng.RecentViewDef")
@Scope("prototype")
public class RecentViewDef extends ViewDef {
	public RecentViewDef() throws Exception {

    	this.domainClasses.add("AbstractPatientObject");
		
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this));
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.DateRangeParam("datetime", "-3Y"));
		declareParam(new ViewParam.ColumnValuesArrayParam("filter.kind", "domain"));
		
		declareParam(new ViewParam.SimpleViewParam("filter.domain", "consult,immunization,mh,procedure,surgery,visit"));
		declareParam(new ViewParam.ORedListParam("filter.domain", "domain"));
		
		
        String q = "datetime_all:[#{getParamStr('datetime.startHL7')} TO #{getParamStr('datetime.endHL7')}] AND (kind:Consult OR domain:immunization OR domain:mh OR domain:procedure OR domain:encounter)";
        
        Query primary = new Query.SOLRQuery("uid", q, "pid:(#{getParamStr('pid')})");
        
		addQuery(primary);
	}

    /**
     * TODO: Hack, I couldn't get the GSP/JSP to work so using this for now,
     * need to replace with a View system that works better.
     */
    public String renderSVG(String pid, RenderTask task) {
    	PatientTimeline tl = new PatientTimeline(5, 50, 600);
    	for (Map<String, Object> row : task) {
    		if (row.containsKey("uid") && row.containsKey("datetime")) {
    			PointInTime pit = new PointInTime(row.get("datetime").toString());
    			tl.addObject(pit, row.get("uid").toString(), getScore(row));
    		}
    	}
    	return tl.buildSVG();
    }
    
    /* temporary scoring mechanism to boost ED visits and admissions */
	private int getScore(Map<String, Object> row) {
		if (row.get("kind").equals("Admission")) {
			return 50;
		} else if (row.get("kind").equals("Visit")) {
			if (row.containsKey("stop_code_name") && row.get("stop_code_name").equals("EMERGENCY DEPT")) {
				return 100;
			}
		}
		return 1;
	}
}
