package gov.va.cprs;

import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.healthtime.IntervalOfTime;
import org.joda.time.Days;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cprs.ClassicRecentLabsViewDef")
@Scope("prototype")
public class ClassicRecentLabsViewDef extends ViewDef {

    public ClassicRecentLabsViewDef() {
//        IntervalOfTime inPtDateRange = IntervalOfTime.untilNow(Days.days(60));
        IntervalOfTime dateRange = IntervalOfTime.untilNow(Days.days(120));

        QueryDef recentlyCompleteLabOrders = new QueryDef("order-status", "COMPLETE");
        recentlyCompleteLabOrders.where("service").is("LR");
        recentlyCompleteLabOrders.where("stop").between(dateRange.getLow().toString(), dateRange.getHigh().toString());

        addQuery(new JDSQuery("uid", recentlyCompleteLabOrders));
    }
}
