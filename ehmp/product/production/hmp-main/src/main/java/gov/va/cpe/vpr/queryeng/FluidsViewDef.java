package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.queryeng.ColDef.TemplateColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import static gov.va.cpe.vpr.queryeng.query.QueryDefCriteria.where;

@Component(value = "gov.va.cpe.vpr.queryeng.FluidsViewDef")
@Scope("prototype")
public class FluidsViewDef extends ViewDef {
	
    @Autowired
    public FluidsViewDef(OpenInfoButtonLinkGenerator linkgen, Environment env) {
    	this.domainClasses.add(Observation.class.getSimpleName());
        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Fluids In/Out"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SortParam("observed", true));

        // list of fields that are not displayable as columns and a default user column set/order
        String displayCols = "typeName,Value,Flag,observed,BodySite,methodName,Location,Facility";
        String requireCols = "typeName,Value,interpretation";
        String hideCols = "uid,selfLink,methodCode,result,units";
        String sortCols = "typeName,observed";
        String groupCols = "typeName,interpretation,methodName";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        QueryDef qry = new QueryDef();
        qry.fields().alias("facilityName", "Facility").alias("comment", "Comment").alias("bodySiteName", "BodySite")
                .alias("locationName", "Location").alias("qualifierText", "Qualifier");
        qry.addCriteria(where("pid").is(":pid"));
        Query q1 = new JDSQuery("uid", qry, "vpr/{pid}/index/observation?order=#{getParamStr('sort.ORDER_BY')}");

        addColumns(q1, "uid", "Facility", "typeName", "interpretation", "result", "units",
                "methodCode", "methodName", "BodySite", "Location", "Comment", "Status", "Qualifier");

        addColumn(new TemplateColDef("Value", "{result} {units}")).setMetaData("width", 75);
        getColumn("typeName").setMetaData("text", "Name").setMetaData("flex", 1);
        getColumn("methodName").setMetaData("text", "Method");
        //getColumn("interpretation").setMetaData("text", "Flag").setMetaData("width", 30);
        addColumn(new TemplateColDef("Flag", "<tpl if=\"(interpretation == \'N\')==false\"><div style=\"float: right; color: red; font-weight: bold;\">" +
                "{interpretation}</div></tpl>"))
                .setMetaData("width", 30);

        addColumn(new ColDef.HealthTimeColDef(q1, "observed")).setMetaData("text", "Observed");
        addColumn(new DomainClassSelfLinkColDef("selfLink", Observation.class));

        addQuery(q1);
    }

}
