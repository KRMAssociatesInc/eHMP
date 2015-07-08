package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefCriteria;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.queryeng.AlertViewDef")
@Scope("prototype")
public class AlertViewDef extends ViewDef {
	public AlertViewDef() {
		this.domainClasses.add("Alert");
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Alerts"));
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SimpleViewParam("uid_filter"));
		declareParam(new ViewParam.SimpleViewParam("filter.kind", "ALERT"));
		declareParam(new ViewParam.SimpleViewParam("filter.frameIDs"));
		declareParam(new ViewParam.AsArrayListParam("filter.frameIDs"));
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "uid,title,pid,referenceDateTime,description,frameID";
		String requireCols = "";
		String hideCols = "";
		String sortCols = "";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		QueryDef qry = new QueryDef();
		qry.addCriteria(QueryDefCriteria.where("frameID").in("?:filter.frameIDs"));
		Query primary = new JDSQuery("uid", qry, "vpr/{pid}/index/alert?filter=eq(kind,#{getParamStr('filter.kind')})&range=#{getParamStr('uid_filter')!=null?getParamStr('uid_filter'):''}");
		addQuery(primary);
		
		addColumns(primary, "uid", "title", "pid", "referenceDateTime", "description", "frameID");
		addColumn(new ColDef.HealthTimeColDef(primary, "referenceDateTime")).setMetaData("text", "Date/Time");
	}
}
