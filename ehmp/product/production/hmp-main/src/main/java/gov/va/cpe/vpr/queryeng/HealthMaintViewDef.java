package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.ColDef.QueryColDef;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.queryeng.HealthMaintViewDef")
@Scope("prototype")
public class HealthMaintViewDef extends ProtocolViewDef {
	
	public HealthMaintViewDef() {
		declareParam(new ViewParam.ViewInfoParam(this, "Health Maintenance"));
		declareParam(new ViewParam.PatientIDParam());
		
		QueryDef qry = new QueryDef();
		Query q1 = new AbstractQuery("uid", null) {
			@Override
			public void exec(RenderTask task) throws Exception {
				String pid = task.getParamStr("pid");
				PatientDemographics pat = task.getResource(IPatientDAO.class).findByPid(pid);
				Object score = "???"; 
				if (pat != null) {
					int age = pat.getAge();
					boolean male = pat.isMale();
					boolean smoker = true, sbp_treatment = true;; // TODO:Where does this come from?
					int tot_cholesterol = 0; int hdl_cholesterol = 0, sbp = 0;
					score = framinghamScore(male, smoker, age, tot_cholesterol, hdl_cholesterol, sbp, sbp_treatment);
				}
				
				Map<String, Object> row = new HashMap<String, Object>();
				row.put("uid", pid);
				row.put("focus", "Framingham Risk Score");
				row.put("status", "??");
				row.put("relevant_data", score);
				row.put("last_done", "??");
				row.put("guidelines", "<a taget=\"_blank\" href=\"http://www.nhlbi.nih.gov/guidelines/cholesterol/risk_tbl.htm\">Risk Table</a>");
				task.add(row);
			}
		};
		addQuery(new ForceSingleRowQuery(q1));
		
		addColumns(q1, "focus", "status", "relevant_data");
		getColumn("status").setMetaData("width", 75);
		getColumn("relevant_data").setMetaData("width", 150);
		addColumn(new ColDef.HealthTimeColDef(q1, "last_done")).setMetaData("width", 85);
		addColumn(new QueryColDef(q1, "guidelines")).setMetaData("width", 250);
	}
	
	private static int framinghamScore(boolean male, boolean smoker, int age, int tot_cholesterol, int hdl_cholesterol, int sbp, boolean sbp_treatment) {
		Integer score = 0;
		
		// age base score
		if (age < 20 || age > 79) {
			score = null;
		} else if (age <= 34) {
			score = (male) ? -9 : -7;
		} else if (age <= 39) {
			score = (male) ? -4 : -3;
		} else if (age <= 44) {
			score = 0;
		} else if (age <= 49) {
			score = 3;
		} else if (age <= 54) {
			score = 6;
		} else if (age <= 59) {
			score = 8;
		} else if (age <= 64) {
			score = 10;
		} else if (age <= 69) {
			score = (male) ? 11 : 12;
		} else if (age <= 74) {
			score = (male) ? 12 : 14;
		} else if (age <= 79) {
			score = (male) ? 13 : 16;
		} else {
			score = null;
		}
		
		// TODO: colesterol score by age
		
		// TODO: age + smoker status
		
		// TODO: HDL level
		
		// TODO: SBP + status
		
		return score;
	}
}
