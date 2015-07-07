package gov.va.cprs;

import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Map;

@Component(value = "gov.va.cprs.ClassicCoverVisitViewDef")
@Scope("prototype")
public class ClassicCoverVisitViewDef extends ViewDef {
    public ClassicCoverVisitViewDef() {
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SimpleViewParam("filter_start")); // start date
        declareParam(new ViewParam.SimpleViewParam("filter_stop")); // stop date
        declareParam(new ViewParam.DateRangeParam("range","t-180..t"));

        QueryDef qry = new QueryDef("visit-time", "?:range.startHL7", "?:range.endHL7");
        qry.where("typeName").ne("DAILY HOSPITALIZATION DATA");
        Query q1 = new JDSQuery("uid", qry);
        addQuery(q1);


    }
}

