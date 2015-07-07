package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.queryeng.CurrentAppointmentViewDef")
@Scope("prototype")
public class CurrentAppointmentViewDef extends ViewDef {


    @Autowired
	public CurrentAppointmentViewDef(Environment environ) throws Exception {
    	this.domainClasses.add("Encounter");
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Current Appt."));
		declareParam(new ViewParam.SortParam("dateTime", false));
		declareParam(new ViewParam.PatientIDParam());
//		declareParam(new ViewParam.DateRangeParam("range", "-7d"));
		
		// list of fields that are not displayable as columns and a default user column set/order
		
		String displayCols = "dateTime,kind,facilityName,typeName,categoryName,stopCodeName,appointmentStatus,locationName,roomBed,checkIn,comments";
		String requireCols = "dateTime,typeName,kind";
		String hideCols = "uid";
		String sortCols = "dateTime,kind,facilityName,typeName,categoryName,stopCodeName,appointmentStatus,locationName,roomBed,checkIn,comments";
		String groupCols = "kind,facilityName,typeName,categoryName,stopCodeName,appointmentStatus,locationName,roomBed";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		QueryDef qry = new QueryDef();
		Query q1 = new JDSQuery("uid", qry, "/vpr/{pid}/index/curvisit" +		
	        	"#{getParamStr('range.startHL7')!=null?'&filter=between(dateTime,\"'+getParamStr('range.startHL7')+'\",\"'+getParamStr('range.endHL7')+'\")':''}");
		addColumns(q1, "uid", "icn", "pid", "display", "typeCode", "result", "units", "low", "high", "interpretation", "accessionUid", "summary", "Facility");
		getColumn("display").setMetaData("text", "Test").setMetaData("flex", 1);
		addQuery(q1);
		
		addColumns(q1, "dateTime","kind","facilityName","typeName","categoryName","stopCodeName","appointmentStatus","locationName","roomBed","checkIn","comments");
		getColumn("dateTime").setMetaData("text","Appt. Time");
		getColumn("kind").setMetaData("text","Kind");
		getColumn("facilityName").setMetaData("text","Facility");
		getColumn("typeName").setMetaData("text","Type");
		getColumn("categoryName").setMetaData("text","Category");
		getColumn("stopCodeName").setMetaData("text","Stop Code");
		getColumn("appointmentStatus").setMetaData("text","Status");
		getColumn("locationName").setMetaData("text","Location");
		getColumn("roomBed").setMetaData("text","Room/Bed");
		getColumn("checkIn").setMetaData("text","Check-in Time");
		getColumn("comments").setMetaData("text","Reason for Visit");
	}
}
