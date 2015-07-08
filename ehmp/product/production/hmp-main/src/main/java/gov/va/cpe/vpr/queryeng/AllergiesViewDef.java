package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.AllergiesViewDef")
@Scope("prototype")
public class AllergiesViewDef extends ViewDef {

    @Autowired
    public AllergiesViewDef(JdsOperations jdsTemplate, Environment environment) {
    	this.domainClasses.add("Allergy");
        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Allergies"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.AsArrayListParam("filter.typeCodes"));

        // Relevant allergies
        addQuery(new JDSQuery("uid", "/vpr/{pid}/index/allergy"));
    }
}

