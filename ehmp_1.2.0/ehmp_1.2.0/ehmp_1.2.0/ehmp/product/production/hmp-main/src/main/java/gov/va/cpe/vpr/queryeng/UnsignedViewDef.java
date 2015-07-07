package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.frameeng.IFrameTrigger;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;


@Component(value="gov.va.cpe.vpr.queryeng.UnsignedViewDef")
@Scope("prototype")
public class UnsignedViewDef extends ViewDef {

	public UnsignedViewDef() {

        // update triggers
		addTrigger(new IFrameTrigger.PatientEventTrigger<Order>(Order.class));
		domainClasses.add("Order");

        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Unsigned Orders"));
        declareParam(new ViewParam.PatientIDParam());

        declareParam(new ViewParam.QuickFilterParam("qfilter_status", "UNRELEASED", "UNRELEASED"));
        declareParam(new ViewParam.AsArrayListParam("qfilter_status"));
//        declareParam(new ViewParam.AsArrayListParam("filter.complete"));
//		declareParam(new ViewParam.SortParam("dueDate", false));

		String displayCols = "summary,statusName,providerName,locationName,facilityName";
		String requireCols = "summary,facilityName";
		String hideCols = "uid,selfLink";
		String sortCols = "";
		String groupCols = "";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        // Relevant Immunizations
        Query q1 = new JDSQuery("uid", "/vpr/{pid}/index/order-status?range=UNRELEASED");
        addColumns(q1, "uid", "summary", "providerName", "locationName", "statusName", "facilityName");

        getColumn("summary").setMetaData("text", "Orders");
        getColumn("providerName").setMetaData("text", "Provider");
        getColumn("locationName").setMetaData("text", "Location");
        getColumn("statusName").setMetaData("text", "Status");
//        getColumn("summary").setMetaData("flex", 1).setMetaData("editOpt", new EditorOption("taskName","text"));

        getColumn("facilityName").setMetaData("text", "Facility");

        addColumn(new DomainClassSelfLinkColDef("selfLink", Task.class));
        addQuery(q1);
	}
}

