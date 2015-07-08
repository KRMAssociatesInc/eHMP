package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.PatientEventTrigger;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Map;

import static gov.va.cpe.vpr.queryeng.query.QueryDefCriteria.where;

/**
 * This demonstrates a concrete implementation of ViewDef that imitates the data on a basic lab tab.
 * <p/>
 * It includes some filter capabilities (all, abnormal, critical) and time range selection criteria.
 */
@Component(value="gov.va.cpe.vpr.queryeng.ProblemViewDef")
@Scope("prototype")
public class ProblemViewDef extends ViewDef {
	
    public ProblemViewDef() {
		
		// update triggers
		addTrigger(new PatientEventTrigger<Problem>(Problem.class));
		domainClasses.add("Problem");
		
        // declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Problems"));
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.AsArrayListParam("filter_uid"));
        declareParam(new ViewParam.AsArrayListParam("filter_icd"));
        declareParam(new ViewParam.QuickFilterParam("qfilter_status", "", "ACTIVE", "INACTIVE", "REMOVED"));
        declareParam(new ViewParam.AsArrayListParam("qfilter_status"));
        declareParam(new ViewParam() {
        	// custom param, basically a true/false result for if qfilter_status contains REMOVED
        	@Override
        	public Map<String, Object> calcParams(FrameTask task) {
        		Map<String, Object> ret = super.calcParams(task);
        		if (task.getParamStr("qfilter_status") != null &&
        			task.getParamStr("qfilter_status").contains("REMOVED")) {
        			ret.put("inc_removed", true);
        		}
        		return ret;
        	}
        	
			@Override
			public Map<String, Object> getDefaultValues() {
				return null;
			}
		});
        declareParam(new ViewParam.SortParam("updated", false));
        
        /*
         * Case 1) Nothing selected;  Only one evaluation, check for removed = false.
         * Case 2) REMOVED selected; Only one evaluation, check for removed = true.
         * Case 3) All other cases; OR condition on statusName.in(vv) + removed = (qfilter.status.contains('REMOVED'))
         */
    	QueryDef qry = new QueryDef("problem");
		qry.fields().alias("facilityName", "facility");
		qry.where("uid").in("?:filter_uid"); // if UID filter was specified
    	qry.whereAny(where("icdCode").in("?:filter_icd"), where("icdGroup").in("?:filter_icd"));
    	qry.whereAny(where("statusName").in("?:qfilter_status"), where("removed").is("?:inc_removed"));
    	qry.sort().asc("statusName"); // since statusName is only ACTIVE or INACTIVE, this works to sort INACTIVE last
    	addQuery(new JDSQuery("uid", qry));
    }
}
