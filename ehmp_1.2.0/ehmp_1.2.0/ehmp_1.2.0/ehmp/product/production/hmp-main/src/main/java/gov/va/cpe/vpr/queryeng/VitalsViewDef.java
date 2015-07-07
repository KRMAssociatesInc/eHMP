package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.queryeng.ColDef.TemplateColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.queryeng.VitalsViewDef")
public class VitalsViewDef extends ViewDef {
	
	public VitalsViewDef() {
    	this.domainClasses.add(VitalSign.class.getSimpleName());
		declareParam(new ViewParam.ViewInfoParam(this, "Vital Signs"));
		declareParam(new ViewParam.ENUMParam("filter_kind", null, "WEIGHT","PAIN","PULSE","PULSE OXIMETRY","HEIGHT","RESPIRATION","BLOOD PRESSURE","TEMPERATURE").addMeta("multiple", true).addMeta("title", "Type filter"));
        declareParam(new ViewParam.AsArrayListParam("filter_kind"));
		declareParam(new ViewParam.DateRangeParam("range", null));
        declareParam(new ViewParam.PatientIDParam());
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "observed,typeName,value,range";
		String requireCols = "observed,typeName,value";
		String hideCols = "uid,result,units,selfLink";
		String sortCols = "";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

		QueryDef qry = new QueryDef("vs-type");
		qry.fields().include("uid","observed","typeName","result","units");
		qry.where("typeName").in("?:filter_kind");
		qry.where("observed").between("?:range.startHL7", "?:range.endHL7");
		JDSQuery primary = new JDSQuery("uid", qry);
		
		addQuery(primary);
		addColumns(primary, "uid","typeName","result","units");
		addColumn(new ColDef.HealthTimeColDef(primary, "observed")).setMetaData("text", "Observed");
		getColumn("typeName").setMetaData("text", "Type Name");
		addColumn(new TemplateColDef("value", "{result} {units}")).setMetaData("text", "Result");
	}
}