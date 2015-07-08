package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Immunization;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.ImmunizationsViewDef")
@Scope("prototype")
public class ImmunizationsViewDef extends ViewDef {

    public ImmunizationsViewDef() {
        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Immunizations"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.AsArrayListParam("filter.name"));
    	this.domainClasses.add(Immunization.class.getSimpleName());

        // Relevant Immunizations
		QueryDef qd = new QueryDef("immunization");
		qd.fields().include("uid","facilityCode","administeredDateTime","facilityName","name","cptCode","cptName");
		qd.where("name").is("?:filter.name");
        addQuery(new JDSQuery("uid", qd));
    }
}

