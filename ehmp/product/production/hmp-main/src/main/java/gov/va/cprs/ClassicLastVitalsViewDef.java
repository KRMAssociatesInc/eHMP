package gov.va.cprs;

import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cprs.ClassicLastVitalsViewDef")
@Scope("prototype")
public class ClassicLastVitalsViewDef extends ViewDef {

    public ClassicLastVitalsViewDef() {
        declareParam(new ViewParam.PatientIDParam());
        addQuery(new JDSQuery("uid", "/vpr/{pid}/last/vs-type"));
    }
}
