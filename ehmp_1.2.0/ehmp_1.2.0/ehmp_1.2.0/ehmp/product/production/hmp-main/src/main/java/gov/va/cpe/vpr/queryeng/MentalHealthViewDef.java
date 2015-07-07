package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.MentalHealth;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.queryeng.MentalHealthViewDef")
@Scope("prototype")
public class MentalHealthViewDef extends ViewDef {
	
	public MentalHealthViewDef() {
    	this.domainClasses.add(MentalHealth.class.getSimpleName());
		declareParam(new ViewParam.ViewInfoParam(this, "Mental Health"));
		declareParam(new ViewParam.DateRangeParam("range", null));
        declareParam(new ViewParam.PatientIDParam());
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "displayName,name,administeredDateTime,scales,providerName";
		String requireCols = "displayName,scales,providerName";
		String hideCols = "uid,responses";
		String sortCols = "";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

		QueryDef qry = new QueryDef("mentalhealth");
		qry.fields().include("uid","displayName","name","administeredDateTime","scales","providerName","responses");
		qry.where("administeredDateTime").between("?:range.startHL7", "?:range.endHL7");
		JDSQuery primary = new JDSQuery("uid", qry);
		
		addQuery(primary);
		addColumns(primary, "uid","displayName","providerName","responses");
        addColumn(new ColDef.CustomRendererColDef("scales","mentalHealthScales"));
		addColumn(new ColDef.HealthTimeColDef(primary, "administeredDateTime")).setMetaData("text", "Administered");
		getColumn("displayName").setMetaData("text", "Name");
		getColumn("scales").setMetaData("text","Score");
	}

}
