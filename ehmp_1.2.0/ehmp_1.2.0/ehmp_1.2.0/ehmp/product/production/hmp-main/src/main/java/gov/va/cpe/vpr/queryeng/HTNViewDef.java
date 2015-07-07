package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.queryeng.ColDef.QueryColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefCriteria;
import gov.va.cpe.vpr.queryeng.QueryMapper.AppendMapper;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.queryeng.HTNViewDef")
@Scope("prototype")
public class HTNViewDef  extends ProtocolViewDef {
	public HTNViewDef() {
		super();
		declareParam(new ViewParam.ViewInfoParam(this, "Hypertension Summary"));
		declareParam(new ViewParam.PatientIDParam());
    	this.domainClasses.add(Result.class.getSimpleName());
		
		QueryDef qry = new QueryDef();
		Query q1 = new JDSQuery("focus", qry, "/vpr/{pid}/last/vs-type?range=BLOOD PRESSURE") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "B.P.");
				ret.put("status", getOverdueStatus(obs, 365));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "q visit");
				return ret;
			}
		};
		addQuery(new ForceSingleRowQuery(q1));
		
		// TODO: Next Visit
		// TODO: ASA
		
		// TODO:FROM http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&ved=0CCgQFjAB&url=http%3A%2F%2Fwww.fmdrl.org%2Findex.cfm%3Fevent%3Dc.getAttachment%26riid%3D3862&ei=nKhGUKOdEcnY2QXEt4GQBw&usg=AFQjCNGRTmP1U8cRq7gHlwl6m939LkUVNA&sig2=ngEDesOHnmZ6iMziySV7tg
		
		Query q5 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=CREATININE") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Serum Creatinine");
				ret.put("status", getOverdueStatus(obs, 365));
				if (row.containsKey("result")) {
					float val = Float.parseFloat((String) row.get("result"));
					String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 200) ? "red" : "blue", row.get("result"), row.get("units"));
					ret.put("relevant_data", summary);
				}
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annually");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q5)));
		
		Query q6 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=POTASSIUM") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Serum Potassium");
				ret.put("status", getOverdueStatus(obs, 365));
				if (row.containsKey("result")) {
					float val = Float.parseFloat((String) row.get("result"));
					String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 200) ? "red" : "blue", row.get("result"), row.get("units"));
					ret.put("relevant_data", summary);
				}
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annually");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q6)));
		
		Query q7 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=LDL CHOLESTEROL") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "LDL Cholesterol");
				ret.put("status", getOverdueStatus(obs, 365));
				if (row.containsKey("result")) {
					int val = parseInt((String) row.get("result"));
					String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 100) ? "red" : "blue", row.get("result"), row.get("units"));
					ret.put("relevant_data", summary);
				}
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annually");
				return ret;
			}
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q7)));
		
		Query q8 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=CHOLESTEROL") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Total Cholesterol");
				ret.put("status", getOverdueStatus(obs, 365));
				if (row.containsKey("result")) {
					int val = parseInt((String) row.get("result"));
					String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 200) ? "red" : "blue", row.get("result"), row.get("units"));
					ret.put("relevant_data", summary);
				}
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annually");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q8)));
		
		Query q9 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=GLUCOSE") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Fasting Glucose");
				ret.put("status", getOverdueStatus(obs, 365*3));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "q3yr, if not diabetic");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q9)));
		
		Query q10 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=HCT") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Hematocrit");
				ret.put("status", getOverdueStatus(obs, Integer.MAX_VALUE));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "once");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q10)));
		
		Query q11 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=CALCIUM") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Serum Calcium");
				ret.put("status", getOverdueStatus(obs, Integer.MAX_VALUE));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "once");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q11)));
		
		Query q12 = new JDSQuery("focus", qry, "/vpr/{pid}/last/proc-type?range=EKG*") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("dateTime"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "EKG");
				ret.put("status", getOverdueStatus(obs, Integer.MAX_VALUE));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("dateTime"));
				ret.put("guidelines", "once");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q12)));
		
		QueryDef q13qry = new QueryDef();
		q13qry.addCriteria(QueryDefCriteria.where("categoryName").is("Outpatient Visit"));
		Query q13 = new JDSQuery("focus", q13qry, "/vpr/{pid}/index/appointment?order=dateTime DESC") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("dateTime"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Next Visit");
				ret.put("status", getOverdueStatus(obs, 180));
				ret.put("relevant_data", row.get("appointmentStatus"));
				ret.put("last_done", row.get("dateTime"));
				ret.put("guidelines", "Visit in 6mo for BP < 140/90;<br/>1mo for BP 140-159/90-99;<br/>< 1mo for BP >= 160/100 w/ home BP readings");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q13)));
		
		QueryDef q14qry = new QueryDef();
		q14qry.addCriteria(QueryDefCriteria.where("vaStatus").is("ACTIVE"));
		Query q14 = new JDSQuery("focus", q14qry, "/vpr/{pid}/index/med-ingredient-name?range=ASPIRIN*") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				ret.put("uid", row.get("uid"));
				ret.put("focus", "ASA (81mg)");
				if (row.containsKey("uid")) {
					ret.put("status", "active order");
					ret.put("relevant_data", row.get("summary"));
				} else {
					ret.put("status", "<span style=\"color: red; font-weight: bold;\">not found</span>");
				}
				ret.put("guidelines", "if not contraindicated and (1)BP <140/90 or (2) pt. W/CAD,ischemic stroke, or other ischemic vascular disease");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q14)));
		
		// TODO: last EKG
		// TODO: UA (clean-catch)
		addColumns(q1, "focus", "status", "relevant_data");
		getColumn("status").setMetaData("width", 75);
		getColumn("relevant_data").setMetaData("width", 150);
		addColumn(new ColDef.HealthTimeColDef(q1, "last_done")).setMetaData("width", 75);
		addColumn(new QueryColDef(q1, "guidelines")).setMetaData("width", 250);
	}
}
