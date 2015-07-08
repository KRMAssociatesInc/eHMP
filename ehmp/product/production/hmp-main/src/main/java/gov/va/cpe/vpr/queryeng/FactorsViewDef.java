package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.HealthFactor;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.sql.SQLException;

@Component(value="gov.va.cpe.vpr.queryeng.FactorsViewDef")
@Scope("prototype")
public class FactorsViewDef extends ViewDef{

	@Autowired
	public FactorsViewDef(Environment env)  throws SQLException, Exception {
    	this.domainClasses.add("HealthFactor");
		// declare the view parameters
		declareParam(new ViewParam.ViewInfoParam(this, "Health Factors"));
        declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.AsArrayListParam("filter.typeCodes"));
		
		String displayCols = "summary,entered,facilityName";
		String requireCols = "summary,entered,facilityName";
		String hideCols = "uid,selfLink,comment,encounterUid,locationUid,categoryUid";
		String sortCols = "entered";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));
		
		// Relevant Health Factors
		QueryDef qry = new QueryDef();
		Query q1 = new JDSQuery("uid", qry, "/vpr/{pid}/index/healthfactor?order=desc");

		addQuery(q1);
		addColumns(q1, "uid", "summary", "entered", "comment", "facilityName", "encounterUid", "encounterName", "locationUid","locationDisplayName","categoryUid","categoryName");

        getColumn("summary").setMetaData("text", "Description");
        getColumn("summary").setMetaData("flex", 1);

        addColumn(new ColDef.HealthTimeColDef(q1, "entered")).setMetaData("text", "Visit Date");

        getColumn("facilityName").setMetaData("text", "Facility");

        getColumn("comment").setMetaData("text", "Comments");
        getColumn("encounterName").setMetaData("text", "Visit");
        getColumn("locationDisplayName").setMetaData("text", "Location");
        getColumn("categoryName").setMetaData("text", "Category");

        addColumn(new DomainClassSelfLinkColDef("selfLink", HealthFactor.class));
	}
}

