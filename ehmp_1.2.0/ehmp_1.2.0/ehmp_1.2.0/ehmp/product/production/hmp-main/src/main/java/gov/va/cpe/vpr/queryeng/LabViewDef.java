package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.queryeng.ColDef.ActionColDef;
import gov.va.cpe.vpr.queryeng.ColDef.TemplateColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer.HTMLEscapeTransformer;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer.ReplaceTransformer;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component(value="gov.va.cpe.vpr.queryeng.LabViewDef")
@Scope("prototype")
public class LabViewDef extends ViewDef {
	
	public LabViewDef() throws IOException {
		
    	this.domainClasses.add(Result.class.getSimpleName());
    	
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Lab Results"));
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("observed", false));
		declareParam(new ViewParam.DateRangeParam("range", "-3y"));
		declareParam(new ViewParam.ENUMParam("filter.catCodes", "", "urn:va:lab-category:CH", "urn:va:lab-category:MI", "urn:va:lab-category:CY", "urn:va:lab-category:EM", "urn:va:lab-category:SP", "urn:va:lab-category:AU")
			.addMeta("multiple", true).addMeta("title", "Categories")
			.addMeta("displayVals", new String[] {"CH", "MI", "CY", "EM", "SP", "AU"}));
		declareParam(new ViewParam.AsArrayListParam("filter.typeCodes"));
		declareParam(new ViewParam.AsArrayListParam("filter.typeNames"));
		declareParam(new ViewParam.AsArrayListParam("filter.catCodes"));
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "rowactions,display,observed,value,ref_range,Facility";
		String requireCols = "display,observed,value,";
		String hideCols = "uid,icn,pid,result,units,low,high,selfLink,trendLink";
		String sortCols = "specimen,resulted,observed";
		String groupCols = "specimen,Facility";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		// define the query
		QueryDef qry = new QueryDef("lab-time", ":range.startHL7", ":range.endHL7");
		qry.fields().include("uid","summary", "result", "statusName", "specimen", "typeCode", "typeName", "summary");
		qry.fields().include("resulted","observed", "units", "facilityName", "high", "low");
		qry.fields().include("categoryName", "interpretationCode");
		qry.fields().alias("typeName", "display").alias("facilityName", "Facility").alias("statusName", "Status");
		qry.fields().transform(new HTMLEscapeTransformer("summary"));
		qry.fields().transform(new ReplaceTransformer("interpretationCode", "urn:hl7:observation-interpretation:", ""));
		qry.where("categoryCode").in("?:filter.catCodes");
		qry.where("typeCode").in("?:filter.typeCodes");
		qry.where("typeNames").in("?:filter.typeNames");
		
		// create the query and columns
		Query q1 = addQuery(new JDSQuery("uid", qry));
		addColumns(q1, "uid", "icn", "pid", "display", "result", "units", "low", "high", "Facility", "Status", "categoryName", "specimen");
		getColumn("display").setMetaData("text", "Test").setMetaData("flex", 1);
		
		addColumn(new TemplateColDef("value", "<span title='{summary}'>{result} {units}</span> <em style=\"color: red; font-weight: bold;\">{interpretationCode}</em>"));
		getColumn("value").setMetaData("text", "Results");
		getColumn("value").setMetaData("width", 90);

		addColumn(new TemplateColDef("ref_range", "{low}-{high}"));
		getColumn("ref_range").setMetaData("text", "Range");
		getColumn("ref_range").setMetaData("width", 65);
		
		getColumn("Status").setMetaData("width", 75);
		getColumn("categoryName").setMetaData("text", "Cat").setMetaData("width", 25);
		
		getColumn("specimen").setMetaData("text", "Specimen");
		getColumn("specimen").setMetaData("width", 65);
		
		addColumn(new ColDef.HealthTimeColDef(q1, "observed")).setMetaData("text", "Observed").setMetaData("width", 100);
		addColumn(new ColDef.HealthTimeColDef(q1, "resulted")).setMetaData("text", "Resulted").setMetaData("width", 100);
		
		addColumn(new DomainClassSelfLinkColDef("selfLink", Result.class));
		addColumn(new ActionColDef("rowactions"));
	}
}
