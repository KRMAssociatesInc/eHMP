package gov.va.cprs;

import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.PatientEventTrigger;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component(value = "gov.va.cprs.ClassicProblemsViewDef")
@Scope("prototype")
public class ClassicProblemsViewDef extends ViewDef {
    public ClassicProblemsViewDef() {
    	addTrigger(new PatientEventTrigger<Problem>(Problem.class));

        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SimpleViewParam("filterStatus", "active")); // include active problems by default

        addQuery(new JDSQuery("uid", "/vpr/{pid}/index/problem-{filterStatus}"));
    }
}
