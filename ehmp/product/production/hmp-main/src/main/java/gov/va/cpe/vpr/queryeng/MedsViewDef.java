package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.queryeng.ColDef.ActionColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component(value = "gov.va.cpe.vpr.queryeng.MedsViewDef")
@Scope("prototype")
public class MedsViewDef extends ViewDef {
    @Autowired
    public MedsViewDef(OpenInfoButtonLinkGenerator linkgen, Environment env) throws ClassNotFoundException, IOException {
        // declare the view parameters
    	this.domainClasses.add(Medication.class.getSimpleName());
        declareParam(new ViewParam.ViewInfoParam(this, "Medications"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.DateRangeParam("spanTime",null));
		declareParam(new ViewParam.DateRangeParam("range", null));
        declareParam(new ViewParam.AsArrayListParam("filter.typeCodes"));
        declareParam(new ViewParam.ENUMParam("filter_kind", null, "O", "I", "N").addMeta("multiple", true).addMeta("title", "Type filter"));
        declareParam(new ViewParam.AsArrayListParam("filter_kind"));
        declareParam(new ViewParam.ENUMParam("filter_status", null, "ACTIVE", "PENDING", "DISCONTINUED", "EXPIRED").addMeta("multiple", true).addMeta("title", "Status filter"));
        declareParam(new ViewParam.QuickFilterParam("qfilter_status", "", "ACTIVE", "PENDING", "DISCONTINUED", "EXPIRED"));
        declareParam(new ViewParam.AsArrayListParam("filter_status", "filter_status", "qfilter_status"));
        declareParam(new ViewParam.AsArrayListParam("filter_class"));
        declareParam(new ViewParam.AsArrayListParam("filter_class_code"));
        declareParam(new ViewParam.SortParam("overallStart", false));
        declareParam(new ViewParam.SortParam("overallStop", false));

        // list of fields that are not displayable as columns and a default user column set/order
        String displayCols = "rowactions,summary,vaStatus,kind,overallStart,overallStop,facility";
        String requireCols = "summary,facility,overallStart,overallStop";
        String hideCols = "uid,pid,selfLink,dosages,products,vaType";
        String sortCols = "overallStart,kind,overallStop,medStatusName,vaStatus";
        String groupCols = "vaStatus,kind,medStatusName,ingredientName,drugClassName";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

		QueryDef qry = new QueryDef("med-time", "?:range.startHL7", "?:range.endHL7");
		qry.fields().alias("patient", "pid").alias("name", "ingredientName");
		qry.fields().include("uid", "pid", "summary", "overallStart", "overallStop", "facilityCode", "facilityName", "kind", "vaStatus", "medStatusName", "ingredientName", "drugClassName","vaType","dosages","products","locationName","lastFilled");
		qry.where("vaStatus").in("?:filter_status");
		qry.where("vaType").in("?:filter_kind");
		qry.where("products[].drugClassName").in("?:filter_class");
		qry.where("products[].drugClassCode").in("?:filter_class_code");
		qry.where("overallStart").lte("?:spanTime.endHL7");
		qry.where("overallStop").gte("?:spanTime.startHL7");

        Query q1 = new JDSQuery("uid", qry);
		
		addQuery(q1);
		addColumns(q1, "uid", "pid", "summary", "overallStart", "overallStop", "facility", "kind", "vaStatus", "medStatusName", "ingredientName", "drugClassName","vaType","dosages","products","locationName");

        addQuery(new QueryMapper.PerRowAppendMapper(new Query.FrameQuery("uid", "viewdefactions", Medication.class)));
        addColumn(new DomainClassSelfLinkColDef("selfLink", Medication.class)).setMetaData("detailloader", "html");
        addColumn(new ActionColDef("rowactions"));
    }
}

