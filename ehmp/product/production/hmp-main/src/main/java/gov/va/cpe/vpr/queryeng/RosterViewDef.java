package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.roster.Roster;
import gov.va.cpe.vpr.queryeng.ColDef.TemplateColDef;
import gov.va.cpe.vpr.queryeng.query.RosterPatientQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.RosterViewDef")
@Scope("prototype")
@HMPAppInfo(value="gov.va.cpe.multipatientviewdef", title="Default Roster View")
public class RosterViewDef extends ViewDef {
	
	public RosterViewDef() {
		
		declareParam(new ViewParam.ViewInfoParam(this, "List Patients", null));
		declareParam(new ViewParam.DateRangeParam("recent", "2010..NOW"));
		declareParam(new ViewParam.SessionParams());
		declareParam("roster.uid","");
    	this.domainClasses.add(Roster.class.getSimpleName());
		
		// TODO: Add last 4 of SSN column (or add to pt_name)
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "pt_name";
		String requireCols = "pt_name";
		String hideCols = "";
		String sortCols = null; // no sorting allowed yet
		String groupCols = null;
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
			
		// primary query is a simple RosterService call executed once
		Query primary = new RosterPatientQuery();
		addQuery(primary);

		String tpl = "<span <tpl if=\"!(pid &gt; 0)\">title=\"Patient not in VPR\" class=\"hmp-pt-not-loaded\"</tpl><tpl if=\"pid &gt; 0\">class=\"hmp-pt-loaded\"</tpl>>{displayName}</span>"; 
		addColumn(new TemplateColDef("pt_name", tpl).setMetaData("text","Patient").setMetaData("width",200));
	}
}
