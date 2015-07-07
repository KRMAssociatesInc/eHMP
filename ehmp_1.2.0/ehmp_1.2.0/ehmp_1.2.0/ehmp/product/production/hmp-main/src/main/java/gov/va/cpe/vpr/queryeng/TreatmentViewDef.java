package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.Treatment;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.TreatmentViewDef")
@Scope("prototype")
public class TreatmentViewDef extends ViewDef {

    public TreatmentViewDef() {
        // declare the view parameters
    	this.domainClasses.add(Treatment.class.getSimpleName());
        declareParam(new ViewParam.ViewInfoParam(this, "Treatments Due"));
        declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.DateRangeParam("range", "-3Y"));
        declareParam(new ViewParam.ENUMParam("filter_status", null, "ACTIVE", "PENDING", "DISCONTINUED", "EXPIRED").addMeta("multiple", true).addMeta("title", "Status filter"));
        declareParam(new ViewParam.RequiredParam("filter_status"));
        declareParam(new ViewParam.QuickFilterParam("qfilter_status", "", "ACTIVE", "PENDING", "DISCONTINUED", "EXPIRED"));
        declareParam(new ViewParam.AsArrayListParam("filter_status", "filter_status", "qfilter_status"));

        // list of fields that are not displayable as columns and a default user column set/order
        String displayCols = "adminTimes,content,displayGroup,statusName,scheduleName,start,stop,locationName,providerName,instructions,entered";
        String requireCols = "adminTimes,content,statusName,scheduleName,start,stop,instructions";
        String hideCols = "uid";
        String sortCols = "start,stop,entered,displayGroup";
        String groupCols = "displayGroup,locationName,statusName,providerName";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

		QueryDef qry = new QueryDef("treatment");
		qry.fields().alias("patient", "pid");
		qry.fields().include("uid", "pid", "adminTimes","content","displayGroup","statusName","scheduleName","start","stop","locationName","providerName","instructions","entered");
		qry.where("statusName").in(":filter_status");
		qry.where("start").between(":range.startHL7", ":range.endHL7");
		Query q1 = addQuery(new JDSQuery("uid", qry));
		
		addColumns(q1, "uid", "pid", "adminTimes","content","displayGroup","statusName","scheduleName","start","stop","locationName","providerName","instructions","entered");
		
		getColumn("content").setMetaData("text", "Description");
		getColumn("content").setMetaData("minWidth", 200);
		getColumn("content").setMetaData("flex", 1);
        addColumn(new ColDef.HealthTimeColDef(q1, "start"));
        addColumn(new ColDef.HealthTimeColDef(q1, "stop"));
        getColumn("start").setMetaData("text", "Start Date").setMetaData("width", 75);
        getColumn("stop").setMetaData("text", "Stop Date").setMetaData("width", 75);

        getColumn("statusName").setMetaData("text", "VA Status");
        
        addColumn(new DomainClassSelfLinkColDef("selfLink", Medication.class)).setMetaData("detailloader", "html");
    }
}
