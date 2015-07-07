package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.UnverifiedOrders")
@Scope("prototype")
public class UnverifiedOrders extends ViewDefBasedBoardColumn {

	public UnverifiedOrders() {
		super(null);
	}
	
	public UnverifiedOrders(Map<String, Object> vals) {
		super(vals);
	}
	
	@PostConstruct
	public void init() {
		fieldName = "Unverified Orders";
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.OrdersViewDef";
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Unverified Orders";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("verifiedBy")) {
			return "Verify Types";
		} else {
			return prop;
		}
	}
	
	@Override
	public List<Config> getConfigOptions() {
		Config conf = new Config();
		conf.setName("verifiedBy");
		conf.setLabel("Verifications");
		conf.setDataType(Config.DATA_TYPE_LIST);
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("Nurse","Clerk","Chart")));
		conf.addChoice("Nurse");
		conf.addChoice("Chart");
		conf.addChoice("Clerk");
		ArrayList<Config> opts = new ArrayList<Config>();
		opts.add(conf);
		return opts;
	}

	@Override
	public String getDescription() {
		return "All orders that are missing the selected verifications (nurse, clerk, chart).";
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Order.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask t, Map<String,Object> params) {
        boolean found = false;
        for(Map<String, Object> order : t.getRows()) {
            if(isActiveOrPending(order)) {
                boolean nurse = order.get("nurseVerify")!=null;
                boolean clerk = order.get("clerkVerify")!=null;
                boolean chart = order.get("chartVerify")!=null;
                Object vb = configProperties.get("verifiedBy");
                ArrayList<String> vbl = new ArrayList<String>();
                if(vb instanceof String) {
                    vbl.add((String) vb);
                } else if(vb instanceof String[]) {
                    vbl = new ArrayList<String>(Arrays.asList((String[])vb));
                }
                boolean add = false;
                if((vbl.contains("Nurse") && !nurse) || (vbl.contains("Clerk") && !clerk) || (vbl.contains("Chart") && !chart)) {
                    add = true;
                }
                if(add) {
                    results.add(order.get("Summary")+"<br>");
                    found = true;
                }
            }
        }
        if (!found) {
            results.add("<span class='text-muted'>No Unverified Orders</span>");
        }
    }

    private boolean isActiveOrPending(Map<String, Object> val) {
        String statusCode = (String) val.get("statusCode");
        if (statusCode == null) return false;
        try {
            Order.StatusCode status = Order.StatusCode.parse((String) val.get("statusCode"));
            return status == Order.StatusCode.ACTIVE || status == Order.StatusCode.PENDING;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
