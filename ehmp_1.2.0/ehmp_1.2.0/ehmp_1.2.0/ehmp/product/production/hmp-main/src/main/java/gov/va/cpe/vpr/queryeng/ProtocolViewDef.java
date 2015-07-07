package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.PatientAlert;
import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.InvokeTrigger;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.cpe.vpr.queryeng.ColDef.ActionColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.QueryMapper.QueryTransformer;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;
import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.queryeng.ProtocolViewDef")
@Scope("prototype")
public class ProtocolViewDef extends ViewDef {
	public static enum GoalStatus {NOT_DONE,DUE,NOT_DUE,DUE_NOW,DUE_SOON,NORMAL,ABNORMAL,MISC}
	
	private InvokeTrigger<Object> trig1;
	private InvokeTrigger<Object> trig2;

	public ProtocolViewDef() {
		super();
		trig1 = addTrigger(new InvokeTrigger<Object>(this, null, "gov.va.cpe.vpr.rowaction"));
		trig2 = addTrigger(new InvokeTrigger<Object>(this, null, "gov.va.cpe.vpr.protocoleval"));
	}
	
	@Override
	public void exec(FrameTask task) throws FrameException {
		if (trig1 != null && trig1.isTriggerOf(task)) {
			if (getClass() == ProtocolViewDef.class) {
				task.addAction(new FrameAction.OrderActionMenuItem("PROTOCOL_REMOVE", "Remove condition for patient", getID()));
			}
		} else if (trig2 != null && trig2.isTriggerOf(task)) {
			super.exec(task);
			ViewRenderAction act = task.getAction(ViewRenderAction.class); 
			for (Map<String, Object> m : act.getResults()) {
				// TODO: Finish this....
			}
		} else {
			super.exec(task);
		}
	}
	
	protected void postProcessHook(RenderTask task) {
		String status = computeProtocolStatus(task);
		if (status != null) {
			String pid = task.getParamStr("pid");
			String id = "protocol:" + getClass().getSimpleName();
			PatientAlert pa = new PatientAlert(this, id, pid, getName(), status);
			pa.setData("kind", "PROTOCOL");
			pa.setData("protocolID", this.getID());
			pa.addLink(pid, "pat");
			task.addAction(pa);
			
			// TODO: This is a hack, I wanted this action to be stored every time instead of only
			// by the FrameEng, most actions I dont want this to happen.
			JdsTemplate tpl = task.getResource(JdsTemplate.class);
			tpl.postForLocation("/vpr/" + pa.getPid(), pa);
		}
	}
	
	@Autowired
	public ProtocolViewDef(OpenInfoButtonLinkGenerator linkgen) throws URISyntaxException {
		super();
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("conditionStatus", false));

        // list of fields that are not displayable as columns and a default user column set/order
        String displayCols = "rowactions,name,status";
        String requireCols = "rowactions,name,status";
        String hideCols = "";
        String sortCols = "";
        String groupCols = "conditionType";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        // TODO: Should fetch this from the FrameRegistry
        URL url = ViewDef.class.getResource("/gov/va/cpe/vpr/frames/");
		File dir = new File(url.toURI());
        Query q1 = new JSONFileQuery("id", dir.listFiles(JSONFileQuery.JSON_FILES));
		addColumns(q1, "id", "type", "name", "icdCode", "status", "conditionType", "relevantDrugClasses", "selfLink");
		getColumn("name").setMetaData("width", 75);
		getColumn("status").setMetaData("width", 125);
		addQuery(q1);
		
		// TODO: Compute the condition status (with a delegate abstract method) and store it somewhere

		/*
		addQuery(new QueryMapper.PerRowAppendMapper(new ViewDefQuery("results", "viewdef") {
			@Override
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				return super.mapRow(renderer, row);
			}
			
			@Override
			public void exec(RenderTask task) throws Exception {
				// TODO Auto-generated method stub
				super.exec(task);
				System.out.println(task);
			}
		}));
		*/
		
		QueryDef qry = new QueryDef();
		qry.fields().include("protocolID", "summary", "description", "frameID");
		addQuery(new QueryMapper.JoinQueryMapper(new JDSQuery("frameID", qry, "/vpr/{pid}/index/alert?filter=eq(kind,PROTOCOL)"), "viewdef"));
		
        addQuery(new QueryMapper.PerRowAppendMapper(new FrameQuery("uid", "viewdefactions", null)));
        addColumn(new ActionColDef("rowactions"));
	}
	
	protected String computeProtocolStatus(RenderTask task) {
		int dueCount = 0;
		int dueSoonCount = 0;
		for (Map<String, Object> row : task) {
			String status = (String) row.get("status");
			if (status == null) continue;
			
			if (status.contains("DUE NOW")) {
				dueCount++;
			} else if (status.contains("DUE SOON")) {
				dueSoonCount++;
			}
		}
		
		if (dueCount > 0) {
			return dueCount + " items due now";
		} else if (dueSoonCount > 0) {
			return dueSoonCount + " items due soon";
		}
		return null;
	}
	
	protected static float parseFloat(Object obj) {
		if (obj instanceof Float) {
			return (Float) obj;
		} else if (obj != null) {
			try {
				return Float.parseFloat(obj.toString());
			} catch (NumberFormatException ex) {
				// ignore
			}
		}
		return -1;
	}
	
	protected static int parseInt(Object obj) {
		if (obj instanceof Integer) {
			return (Integer) obj;
		} else if (obj != null) {
			try {
				return Integer.parseInt(obj.toString());
			} catch (NumberFormatException ex) {
				// ignore
			}
		}
		return -1;
	}
	
	protected static int daysSince(PointInTime observed) {
		PointInTime obs = null;
		PointInTime today = PointInTime.today();
		if (observed.isDateSet()) {
			obs = new PointInTime(observed.getYear(), observed.getMonth(), observed.getDate());
		} else if (observed.isMonthSet()) {
			obs = new PointInTime(observed.getYear(), observed.getMonth());
			today = new PointInTime(today.getYear(), today.getMonth());
		} else {
			obs = new PointInTime(observed.getYear());
			today = new PointInTime(today.getYear());
		}
		return Days.daysBetween(obs, today).getDays();
	}
	
	protected static String getOverdueStatus(PointInTime observed, int days) {
		int daysSince = (observed != null) ? daysSince(observed) : 0;
		int dueInDays = days - daysSince;
		if (observed == null && days == Integer.MAX_VALUE) {
			return "Not done";
		} else if (daysSince >= days || observed == null) {
			return "<b style=\"color: red; font-weight: bold;\" title=\"" + (daysSince - days) + "days overdue\">DUE NOW</b>";
		} else if (dueInDays <= 45) {
			return "<b style=\"color: gold; font-weight: bold;\" title=\"Due in " + dueInDays + "d\">DUE SOON</b>";
		} else {
			return "<span title=\"Due in " + dueInDays + "d\">Not Due</span>";
		}
	}
	
	public static class ForceSingleRowQuery extends QueryTransformer {
		public ForceSingleRowQuery(Query q) {
			super(q);
		}
		
		@Override
		public void exec(RenderTask task) throws Exception {
			this.q.exec(task);
			
			if (task.size() == 0) {
				// force-feed a row in
				task.add(((AbstractQuery) this.q).mapRow(task, new HashMap<String, Object>()));
			} else {
				// ignore everything but the first row
				Map<String, Object> row = task.getRowIdx(0);
				task.clear();
				task.add(mapRow(row, task));
			}
		}

		@Override
		public Map<String, Object> mapRow(Map<String, Object> row, RenderTask task) {
			return row;
		}
	}
}
