package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefCriteria;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.queryeng.EncounterViewDef")
@Scope("prototype")
public class EncounterViewDef extends ViewDef {
	public EncounterViewDef() {

    	this.domainClasses.add("Encounter");
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Encounters"));
		declareParam(new ViewParam.SortParam("dateTime", false));
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.AsArrayListParam("filter.kind"));
		declareParam(new ViewParam.AsArrayListParam("filter.stop_code"));
		declareParam(new ViewParam.DateRangeParam("range", null));
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "dateTime,arrivalDateTime,dischargeDateTime,kind,typeName,service,specialty,location,stopCodeName,appointmentStatus,reason";
		String requireCols = "dateTime,kind,typeName,dateTime";
		String hideCols = "uid,typeCode,reasonCode,selfLink";
		String sortCols = "dateTime,arrivalDateTime,dischargeDateTime";
		String groupCols = "kind,typeName,location,stopCodeName";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		QueryDef qry = new QueryDef("encounter", "?:range.startHL7", "?:range.endHL7");
		qry.fields().include("kind", "uid", "typeName", "dateTime", "service", "specialty");
		qry.fields().include("stopCodeName", "locationName", "roomBed", "current", "reasonName", "reasonCode");
		qry.fields().alias("locationName", "location").alias("reasonName", "reason").alias("reasonCode", "reasonUid");
		// JDS is missing: typeCode, duration, appointmentStatus,
		qry.addCriteria(QueryDefCriteria.where("kind").in("?:filter.kind"));
		qry.addCriteria(QueryDefCriteria.where("stopCodeName").in("?:filter.stop_code"));
		
		Query primary = addQuery(new JDSQuery("uid", qry));
		addColumns(primary, "uid", "kind", "typeName", "typeCode", "duration", "service", "specialty");
		addColumns(primary, "stopCodeName", "location", "roomBed", "reason", "reasonCode");
		
		addColumn(new ColDef.HealthTimeColDef(primary, "dateTime")).setMetaData("text", "Date/Time");
		addColumn(new DomainClassSelfLinkColDef("selfLink", Encounter.class));
	}
}
