package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.ColDef.QueryColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.QueryMapper.AppendMapper;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.queryeng.DiabetesViewDef")
@Scope("prototype")
public class DiabetesViewDef extends ProtocolViewDef {
	
	public DiabetesViewDef() {
		super();
		declareParam(new ViewParam.ViewInfoParam(this, "Diabetes Summary"));
		declareParam(new ViewParam.PatientIDParam());
		
		QueryDef qry = new QueryDef();
		Query q1 = new JDSQuery("focus", qry, "/vpr/{pid}/last/vs-type?range=HEIGHT") {
			@Override
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				// TODO: Issue if there is no measurement this doesn't get executed
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Height");
				ret.put("status", getOverdueStatus(obs, Integer.MAX_VALUE));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "21+yo: once after age 21");
				return ret;
			}
		};
		addQuery(new ForceSingleRowQuery(q1));
		
		Query q2 = new JDSQuery("focus", qry, "/vpr/{pid}/last/vs-type?range=WEIGHT") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				// TODO:Where to get BMI?
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Weight/BMI");
				ret.put("status", "?");
				ret.put("status", getOverdueStatus(obs, 7));
				ret.put("relevant_data", row.get("summary") + "<br/> BMI: ?");
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "21+yo: q visit. <br/> Goal: BMI <25");
				return ret;
			}
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q2)));
		
		Query qgfr = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=CREATININE") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				float val = parseFloat((String) row.get("result"));
				if (row.containsKey("pid")) {
					String pid = (String) row.get("pid");
					PatientDemographics pat = renderer.getResource(IPatientDAO.class).findByPid(pid);
					int ageInYears = pat.getAge();
					
					// simple eGFR equation found from: http://en.wikipedia.org/wiki/Renal_function
					// eGFR = 186 X Serum Creat^-1.154 X Age^-0.203 X [1.212 if Black] X [0.742 if Female]
					float genderMult = (pat.isFemale() ? .85f : 1.0f);
					float raceMult = (pat.getRace() != null && pat.getRace().contains("BLACK") ? 1.212f : 1.0f);
					double eGFR = 186 * Math.pow(val, -1.154) * Math.pow(ageInYears, -0.203) * raceMult * genderMult;
					
					ret.put("uid", row.get("uid"));
					ret.put("relevant_data", String.format("eGFR: %2.2f", eGFR));
				}
				ret.put("focus", "GFR");
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "");
				return ret;
			}
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(qgfr)));
		
		Query q3 = new JDSQuery("focus", qry, "/vpr/{pid}/last/vs-type?range=BLOOD PRESSURE") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "B.P.");
				ret.put("status", getOverdueStatus(obs, 365));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "18+yo: annually; if diabetic or HTN q visit; <br/>Goal: <140/90, 130/80 if diabetic or GFR <60");
				return ret;
			}
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q3)));
		
		Query q4 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=LDL CHOLESTEROL") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				int val = parseInt((String) row.get("result"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "LDL Cholesterol");
				ret.put("status", getOverdueStatus(obs, 365));
				String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 100) ? "red" : "blue", row.get("result"), row.get("units"));
				ret.put("relevant_data", summary);
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annual, goal < 100");
				return ret;
			}
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q4)));
		
		Query q5 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=CHOLESTEROL") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				int val = parseInt((String) row.get("result"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Total Cholesterol");
				ret.put("status", getOverdueStatus(obs, 365));
				String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 200) ? "red" : "blue", row.get("result"), row.get("units"));
				ret.put("relevant_data", summary);
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annual, goal < 200");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q5)));
		
		Query q6 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-lnc-code?range=urn:lnc:4548-4") {
			protected Map<String, Object> mapRow(RenderTask task, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
//				float val = Float.parseFloat((String) row.get("result"));
				float val = parseFloat(row.get("result"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Hgb A1C");
				ret.put("status", getOverdueStatus(obs, (val >= 7) ? 90 : 180));
				String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), (val >= 7) ? "red" : "blue", row.get("result"), row.get("units"));
				ret.put("relevant_data", summary);
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "21+yo: q6mo if < 7%, q3mo if >= 7%. <br/> Goal: < 7%");
				ret.put("selfLink", "/frame/goal/a1c/" + task.getParamStr("pid"));
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q6)));

		Query q7 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=GLUCOSE") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				int val = parseInt((String) row.get("result"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Glucose");
				ret.put("status", getOverdueStatus(obs, 900));
				String summary = String.format("FPG: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", (val >= 126) ? "red" : "blue", row.get("result"), row.get("units"));
				ret.put("relevant_data", summary);
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "q3yr unless diabetic<br/>Goal: < 126");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q7)));
		
		Query q8 = new JDSQuery("focus", qry, "/vpr/{pid}/last/imm-name?range=FLU*") {
			protected Map<String, Object> mapRow(RenderTask task, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("administeredDateTime"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Flu Vacc.");
				ret.put("status", getOverdueStatus(obs, 365));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("administeredDateTime"));
				ret.put("guidelines", "annual, unless egg allergic");
				ret.put("selfLink", "/frame/goal/vacc/" + task.getParamStr("pid"));
				List<Map<String,Object>> comments = new ArrayList<Map<String,Object>>();
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("comment", "Pt. scared of vaccines.  Informed pt not to take medical advice from Jenny McCarthy.");
				map.put("entered", "20120906");
				map.put("author", "Bray MD");
				comments.add(map);
				ret.put("comments", comments);
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q8)));
		
		Query q9 = new JDSQuery("focus", qry, "/vpr/{pid}/last/imm-name?range=PNEUMO*") {
			protected Map<String, Object> mapRow(RenderTask task, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("administeredDateTime"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Pneum. Vacc.");
				ret.put("status", getOverdueStatus(obs, 365));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("administeredDateTime"));
				ret.put("guidelines", "once; revacc if >= 65 and last 5+ yrs ago when < 65");
				ret.put("selfLink", "/frame/goal/vacc/" + task.getParamStr("pid"));
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q9)));
		
		Query q10 = new JDSQuery("focus", qry, "/vpr/{pid}/last/lab-type?range=Microalbumin*") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("observed"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Urine alb/cr");
				ret.put("status", getOverdueStatus(obs, 365));
				if (row.containsKey("result")) {
					String summary = String.format("%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>", row.get("displayName"), "black", row.get("result"), row.get("units"));
					ret.put("relevant_data", summary);
				}
				ret.put("last_done", row.get("observed"));
				ret.put("guidelines", "Annually");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q10)));
		
		Query q11 = new JDSQuery("focus", qry, "/vpr/{pid}/last/visit-stop-code?range=urn:va:stop-code:407") {
			protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
				Map<String, Object> ret = new HashMap<String, Object>();
				PointInTime obs = HL7DateTimeFormat.parse((String) row.get("dateTime"));
				ret.put("uid", row.get("uid"));
				ret.put("focus", "Eye Exam");
				ret.put("status", getOverdueStatus(obs, 365));
				ret.put("relevant_data", row.get("summary"));
				ret.put("last_done", row.get("dateTime"));
				ret.put("guidelines", "annual");
				return ret;
			}			
		};
		addQuery(new AppendMapper(new ForceSingleRowQuery(q11)));
		
		addColumns(q1, "focus", "status", "relevant_data");
		getColumn("status").setMetaData("width", 75);
		getColumn("relevant_data").setMetaData("width", 150);
		addColumn(new ColDef.HealthTimeColDef(q1, "last_done")).setMetaData("width", 85);
		addColumn(new QueryColDef(q1, "guidelines")).setMetaData("width", 250);
	}
	
	@Override
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
}
