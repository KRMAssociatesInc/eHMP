package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.RoadTrip;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.queryeng.RoadTripViewDef")
@Scope("prototype")
public class RoadTripViewDef extends ViewDef {

	public RoadTripViewDef() {
    	this.domainClasses.add(RoadTrip.class.getSimpleName());
		declareParam(new ViewParam.ViewInfoParam(this, "Road Trip"));
		declareParam(new ViewParam.DateRangeParam("range", null));
        declareParam(new ViewParam.PatientIDParam());
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "location,time,comment,day";
		String requireCols = "location,time,comment,day";
		String hideCols = "uid";
		String sortCols = "";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

		QueryDef qry = new QueryDef("roadtrip");
		qry.fields().include("uid","location","time","comment","day");
		qry.where("removed").ne("true");
		qry.where("day").between("?:range.startHL7", "?:range.endHL7");
		JDSQuery primary = new JDSQuery("uid", qry);
		
		addQuery(primary);
		addColumns(primary, "uid","location","time","comment","day");
	}
}
