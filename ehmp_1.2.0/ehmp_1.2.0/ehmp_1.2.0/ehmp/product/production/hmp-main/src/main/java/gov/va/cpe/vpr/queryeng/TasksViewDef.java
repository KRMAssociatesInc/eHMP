package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.PatientEventTrigger;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;

import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.TasksViewDef")
public class TasksViewDef extends ViewDef {
    public TasksViewDef() {
		// update triggers
		addTrigger(new PatientEventTrigger<Task>(Task.class)); 
		domainClasses.add("Task");
		
        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Tasks"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SimpleViewParam("task_uid", null));
        declareParam(new ViewParam.SimpleViewParam("filter_incomplete", null));
		declareParam(new ViewParam.DateRangeParam("range", null));
		declareParam(new ViewParam.SortParam("dueDate", false));

		QueryDef qry = new QueryDef("task", "?:range.startHL7", "?:range.endHL7");
        qry.linkIf("task-link",null,true);
		qry.where("uid").is("?:task_uid");
		qry.where("dueDate").between("?:range.startHL7", "?:range.endHL7");
		qry.where("completed").ne("?:filter_incomplete");
		addQuery(new JDSQuery("uid", qry));

        addColumn(new DomainClassSelfLinkColDef("selfLink", Task.class));
    }
}

