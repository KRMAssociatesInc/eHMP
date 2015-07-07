package gov.va.cprs;

import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.queryeng.*;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.Map;

import static gov.va.cpe.vpr.queryeng.query.QueryDefCriteria.where;


@Component(value="gov.va.cprs.CprsClassicOrdersViewDef")
@Scope("prototype")
public class CprsClassicOrdersViewDef extends ViewDef {
	
	public CprsClassicOrdersViewDef() {
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Orders"));
        declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.DateRangeParam("range", null));
		declareParam(new ViewParam.SortParam("start", false));
		declareParam(new ViewParam.DateRangeParam("range", "-1d"));
		
		// Relevant orders
		QueryDef qry = new QueryDef("order");
		qry.whereAny(where("statusName").is("ACTIVE"),where("statusName").is("PENDING"),where("stop").between("?:range.startHL7", "?:range.endHL7"));

		Query q1 = new JDSQuery("uid",qry){
				//"#{getParamStr('range.startHL7')!=null?'&filter=between(overallStart,\"'+getParamStr('range.startHL7')+'\",\"'+getParamStr('range.endHL7')+'\")':''}"){
				protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
					Map<String, Object> ret = super.mapRow(renderer, row);
					if(ret.containsKey("clinicians") && ret.get("clinicians") instanceof Iterable<?>)
					{
						ret.put("nurseVerify", CprsClassicOrdersViewDef.this.getVerified("N",(Iterable<Map<Object, Object>>)ret.get("clinicians")));
						ret.put("clerkVerify", CprsClassicOrdersViewDef.this.getVerified("C",(Iterable<Map<Object, Object>>)ret.get("clinicians")));
						ret.put("chartVerify", CprsClassicOrdersViewDef.this.getVerified("R",(Iterable<Map<Object, Object>>)ret.get("clinicians")));
					}
					return ret;
				}
		};
	
		addColumns(q1, "uid", "summary", "locationName", "displayGroup", "providerDisplayName", "nurseVerify", "clerkVerify", "facilityCode", "facilityName");
        addColumn(new DomainClassSelfLinkColDef("selfLink", Order.class));
		addQuery(q1);
	}
	
	private String getVerified(String verifyVal, Iterable<Map<Object, Object>> iterable) {
		Iterator<Map<Object, Object>> it = iterable.iterator();
		String rslt = null;
		while(it.hasNext() && rslt == null)
		{
			Map<Object, Object> next = it.next();
			if(next.get("role").toString().equalsIgnoreCase(verifyVal)) // Per Mel, this is sufficient.
			{
				rslt = next.get("name").toString();
			}
		}
		return rslt;
	}
}

