package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.Goal.GoalStatus.DueStatus;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.InvokeTrigger;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.joda.time.Days;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class Goal extends Frame {
	protected  IGenericPatientObjectDAO dao;
	private InvokeTrigger<IPatientObject> actionTrig;
	
	@Override
	protected void doInit(FrameJob task) throws Exception {
		declareParam(new ViewParam.PatientIDParam());
		dao = task.getResource(IGenericPatientObjectDAO.class);
		actionTrig = addTrigger(new IFrameTrigger.InvokeTrigger<IPatientObject>(this, IPatientObject.class, "gov.va.cpe.vpr.rowaction"));
	}
	
	protected <T extends IPatientObject> T findOne(Class<T> clazz, String url, Map<String, Object> params) {
		return dao.findOneByQuery(clazz, url, params);
	}
	
	@Override
	public void exec(FrameTask task) throws FrameException {
		if (actionTrig.isTriggerOf(task)) {
			rowAction(task);
		} else {
			try {
				evalGoal(task);
			} catch (Exception ex) {
				throw new FrameExecException(this, ex);
			}
		}
	}
	
	public abstract void evalGoal(FrameTask task) throws Exception;
	
	/** 
	 * helper method for contributing row actions to goals
	 */
	protected void rowAction(FrameTask task) {
		// nothing by default.
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.HtWtGoal")
	// not ready
	public static class HtWtGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b><br/>";
		
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			VitalSign r1 = findOne(VitalSign.class, "/vpr/{pid}/last/vs-type?range=HEIGHT", task.getParams());
			VitalSign r2 = findOne(VitalSign.class, "/vpr/{pid}/last/vs-type?range=WEIGHT", task.getParams());
			Auxiliary aux = findOne(Auxiliary.class, "/vpr/{pid}/index/auxiliary", task.getParams());
			
			GoalStatus g = new GoalStatus(365);
			String bmiGoal = null;
			if (aux != null && aux.getGoals() != null && aux.getGoals().containsKey("bmi")) {
				Map<String, Object> bmiGoalData = aux.getGoals().get("bmi");
				if (bmiGoalData.containsKey("value")) {
					bmiGoal = (String) bmiGoalData.get("value");
				}
				if (bmiGoalData.containsKey("comments")) {
					g.comments = (List<Map<String, Object>>) bmiGoalData.get("comments");
				}
			}
			
			g.focus = "BMI";
			g.guidelines = "Wt: q visit<br/>BMI: < 25 ";
			g.viewdef = "gov.va.cpe.vpr.queryeng.VitalsViewDef";
			g.viewdef_title = "Last Vitals";
			g.selfLink = "/frame/goal/bmi/" + task.getParamStr("pid");
			g.conditions = "Health Maint";
			g.relevant_data = "";
			if (r1 != null) {
				String color = r1.getInterpretationCode() != null ? "red" : "blue";
//				g.relevant_data += String.format(SUMMARY, "Ht", color, r1.getResult(), r1.getUnits()); 
			}
			if (r2 != null) {
				String color = r2.getInterpretationCode() != null ? "red" : "blue";
//				g.relevant_data += String.format(SUMMARY, "Wt", color, r2.getResult(), r2.getUnits()); 
			}
			g.relevant_data += "BMI: ?";
			if (bmiGoal != null) g.relevant_data += "<br/><i style=\"margin-left: 10px; font-size: 75%\">Goal: < " + bmiGoal + "%</i>";
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.PotassiumGoal")
	// not ready
	public static class PotassiumGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>";
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Result r = findOne(Result.class, "/vpr/{pid}/last/lab-type?range=POTASSIUM", task.getParams());
			GoalStatus g = new GoalStatus(365);
			g.focus = "Serum Potassium";
			g.guidelines = "Annually";
			if (r != null) {
				String color = r.isAbnormal() ? "red" : "blue";
				g.relevant_data = String.format(SUMMARY, r.getDisplayName(), color, r.getResult(), r.getUnits());
				g.uid = r.getUid();
				g.last_done = r.getObserved();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.A1CGoal")
	// not ready
	public static class A1CGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>";
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Result r = findOne(Result.class, "/vpr/{pid}/last/lab-lnc-code?range=urn:lnc:4548-4", task.getParams());
			Number val = (r != null) ? r.getResultNumber() : null;
			GoalStatus g = new GoalStatus((val == null || val.floatValue() >= 7) ? 180 : 90);
			g.focus = "Hgb A1C";
			g.guidelines = "21+yo: q6mo if < 7%, q3mo if >= 7%.";
			g.selfLink = "/frame/goal/a1c/" + task.getParamStr("pid");
			g.conditions = "DMII";
			if (r != null) {
				if (val != null) {
					String color = (val.intValue() >= 7) ? "red" : "blue";
					g.relevant_data = String.format(SUMMARY, r.getDisplayName(), color, r.getResult(), r.getUnits());
					g.relevant_data += "<br/><span style=\"margin-left: 10px;\" class=\"text-muted\">Goal: < 7%</span>";
				}
				g.uid = r.getUid();
				g.last_done = r.getObserved();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.BloodPressureGoal")
	// not ready
	public static class BloodPressureGoal extends Goal {
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			VitalSign res = findOne(VitalSign.class, "/vpr/{pid}/last/vs-type?range=BLOOD PRESSURE", task.getParams());
			GoalStatus g = new GoalStatus(365);
			g.focus = "B.P.";
			g.guidelines = "q visit";
			g.viewdef = "gov.va.cpe.vpr.queryeng.VitalsViewDef";
			g.viewdef_title = "Last Vitals";
			g.conditions = "Health Maint";

			if (res != null) {
				g.relevant_data = String.format("BP: %s %s", res.getResult(), res.getUnits());
				g.uid = res.getUid();
				g.last_done = res.getObserved();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.CreatinineGoal")
	// not ready
	public static class CreatinineGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>";
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Result r = findOne(Result.class, "/vpr/{pid}/last/lab-type?range=CREATININE", task.getParams());
			GoalStatus g = new GoalStatus(365);
			g.focus = "Serum Creatinine";
			g.guidelines = "Annually";
			if (r != null) {
				Number val = r.getResultNumber();
				if (val != null) {
					String color = (val.intValue() >= 200) ? "red" : "blue";
					g.relevant_data = String.format(SUMMARY, r.getDisplayName(), color, r.getResult(), r.getUnits());
				}
				g.uid = r.getUid();
				g.last_done = r.getObserved();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.EyeExamGoal")
	// not ready
	public static class EyeExamGoal extends Goal {
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Encounter r = findOne(Encounter.class, "/vpr/{pid}/last/visit-stop-code?range=urn:va:stop-code:407", task.getParams());
			GoalStatus g = new GoalStatus(365);
			g.focus = "Eye Exam";
			g.guidelines = "Annually";
			g.conditions = "DMII";
			if (r != null) {
				g.relevant_data = r.getSummary();
				g.uid = r.getUid();
				g.last_done = r.getDateTime();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.GlucoseGoal")
	// not ready
	public static class GlucoseGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>";
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Result r = findOne(Result.class, "/vpr/{pid}/last/lab-lnc-code?range=urn:lnc:2345-6", task.getParams());
			GoalStatus g = new GoalStatus(1095);
			g.focus = "Glucose";
			g.guidelines = "q3yr unless diabetic<br/>Goal: < 126";
			g.viewdef = "gov.va.cpe.vpr.queryeng.LabViewDef";
			g.viewdef_title = "Recent Glucose Results";
			if (r != null) {
				Number val = r.getResultNumber();
				if (val != null) {
					String color = (val.intValue() >= 126) ? "red" : "blue";
					g.relevant_data = String.format(SUMMARY, r.getDisplayName(), color, r.getResult(), r.getUnits());
				}
				g.uid = r.getUid();
				g.last_done = r.getObserved();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.UrineAlbGoal")
	// not ready
	public static class UrineAlbGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>";
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Result r = findOne(Result.class, "/vpr/{pid}/last/lab-lnc-code?range=urn:lnc:LP69337-1", task.getParams());
			GoalStatus g = new GoalStatus(365);
			g.focus = "Urine alb/cr";
			g.guidelines = "Annually";
			if (r != null) {
				Number val = r.getResultNumber();
				if (val != null) {
					String color = r.isAbnormal() ? "red" : "blue";
					g.relevant_data = String.format(SUMMARY, r.getDisplayName(), color, r.getResult(), r.getUnits());
				}
				g.uid = r.getUid();
				g.last_done = r.getObserved();
			}
			task.addAction(g);
		}
	}
	
//	@Component(value="gov.va.cpe.vpr.goals.CholesterolGoal")
	// not ready
	public static class CholesterolGoal extends Goal {
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b>";
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Result r1 = findOne(Result.class, "/vpr/{pid}/last/lab-type?range=CHOLESTEROL", task.getParams());
			Result r2 = findOne(Result.class, "/vpr/{pid}/last/lab-type?range=LDL CHOLESTEROL", task.getParams());
			
			GoalStatus g = new GoalStatus(365);
			g.focus = "Chol.";
			g.guidelines = "Annually";
			g.viewdef = "gov.va.cpe.vpr.queryeng.LabViewDef";
			g.viewdef_title = "Cholesterol Results";
			g.viewdef_params = Table.buildRow("filter.typeNames", new String[] { "CHOLESTEROL", "LDL CHOLESTEROL", "HDL CHOLESTEROL"});

			if (r1 != null && r2 != null) {
				String color = (r1.isAbnormal() || r2.isAbnormal()) ? "red" : "blue";
				g.relevant_data = String.format(SUMMARY, r1.getDisplayName(), color, r1.getResult(), r1.getUnits());
				g.relevant_data += "<br/>";
				g.relevant_data += String.format(SUMMARY, r2.getDisplayName(), color, r2.getResult(), r2.getUnits());
				g.uid = r1.getUid();
				g.last_done = r1.getObserved();
			}
			task.addAction(g);
		}
	}
	
	//	@Component(value="gov.va.cpe.vpr.goals.FluImmunizationGoal")
	// not ready
	public static class FluImmunizationGoal extends Goal {
		
		@Override
		protected void rowAction(FrameTask task) {
			String focus = task.getParamStr("focus");
			if (focus != null && focus.equalsIgnoreCase("Flu Vacc.")) {
				task.addAction(new FrameAction.URLActionMenuItem("http://www.cdc.gov/flu/professionals/vaccination/", "CDC: Influenza Vaccination Resources for Health Professionals"));
			}
		}
		
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Immunization r = findOne(Immunization.class, "/vpr/{pid}/last/imm-name?range=FLU*", task.getParams());
			
			GoalStatus g = new GoalStatus(365);
			g.focus = "Flu Vacc.";
			g.guidelines = "Annually, unless egg allergic";
			g.viewdef = "gov.va.cpe.vpr.queryeng.ImmunizationsViewDef";
			g.viewdef_title = "Immunization History";
			g.selfLink = "/frame/goal/vacc/" + task.getParamStr("pid");
			if (r != null) {
				g.relevant_data = r.getSummary();
				g.uid = r.getUid();
				g.last_done = r.getAdministeredDateTime();
			}
			task.addAction(g);
		}
	}
	
	//@Component(value="gov.va.cpe.vpr.goals.PneumoImmunizationGoal")
	// not ready
	public static class PneumoImmunizationGoal extends Goal {
		
		@Override
		protected void rowAction(FrameTask task) {
			String focus = task.getParamStr("focus");
			if (focus !=null && focus.equals("Pneum. Vacc.")) {
				task.addAction(new FrameAction.URLActionMenuItem("http://www.cdc.gov/vaccines/vpd-vac/pneumo/default.htm", "CDC: Pneumococcal Vaccine", "", "", ""));
			}
		}
		
		@Override
		public void evalGoal(FrameTask task) throws Exception {
			Immunization r = findOne(Immunization.class, "/vpr/{pid}/last/imm-name?range=PNEUMO*", task.getParams());
            PatientDemographics p = findOne(PatientDemographics.class, "/vpr/{pid}", task.getParams());
			
			// compute the vaccination status
			PointInTime obs = (r != null) ? r.getAdministeredDateTime() : null;
			DueStatus duestatus = (r == null) ? DueStatus.NOT_DONE : DueStatus.NOT_DUE;
			String guideline = "19-64y: if risk factors";
			if (p.getAge() >= 65 && obs == null) {
				// >65, not vaccinated
				duestatus = DueStatus.OVERDUE;
				guideline = ">= 65y: Vaccinate w/ PPSV23";
			} else if (obs != null && p.getAge() >= 65) {
				// due if >65 && vaccinated 5+ years ago
				if (obs.before(PointInTime.today().subtractYears(5))) duestatus = DueStatus.OVERDUE;
				guideline = ">= 65: revacc once after 5y";
			} else if (obs != null) {
				guideline = "19-64y: revacc at 5+ years if risk factors";
			}
			
			GoalStatus g = new GoalStatus(duestatus);
			g.focus = "Pneum. Vacc.";
			g.guidelines = guideline;
			g.viewdef = "gov.va.cpe.vpr.queryeng.ImmunizationsViewDef";
			g.viewdef_title = "Immunization History";
			g.selfLink = "/frame/goal/vacc/" + task.getParamStr("pid");
			if (r != null) {
				g.relevant_data = r.getSummary();
				g.uid = r.getUid();
				g.last_done = r.getAdministeredDateTime();
			}
			task.addAction(g);
		}
	}
	
	public static class GoalStatus implements FrameAction {
		public static enum DueStatus {NOT_DONE,OVERDUE,NOT_DUE,DUE_SOON,NORMAL,ABNORMAL,MISC}
		
		private int days;
		private DueStatus status;
		private List<IPatientObject> obs = new ArrayList<IPatientObject>();
		
		public String uid;
		public String focus;
		// TODO: Structured status
		public String relevant_data;
		public PointInTime last_done;
		public String guidelines;
		public String selfLink;
		public String conditions = "Other";
		
		public String viewdef;
		public String viewdef_title;
		public Map<String, Object> viewdef_params;
		public List<Map<String,Object>> comments;

		
		public GoalStatus(DueStatus status) {
			this.status = status;
		}
		
		public GoalStatus(int days) {
			this.days = days;
		}
		
		public void addObservation(IPatientObject obj) {
			if (obj != null) this.obs.add(obj);
		}
		
		protected String renderDTM(PointInTime dtm) {
			return PointInTimeFormat.date().print(dtm);
		}
		
		private static String SUMMARY = "%s: <b style=\"color: %s; font-weight: bold;\">%s %s</b><br/>";
		protected String renderObs() {
			if (relevant_data != null) {
				return relevant_data;
			} else if (obs.isEmpty()) {
				return "";
			}
			
			StringBuffer sb = new StringBuffer();
			for (IPatientObject obj : obs) {
				if (obj instanceof Result) {
					Result r = (Result) obj;
					String color = r.isAbnormal() ? "red" : "blue";
					sb.append(String.format(SUMMARY, r.getDisplayName(), color, r.getResult(), r.getUnits()));
				} else if (obj instanceof VitalSign) {
					VitalSign vs = (VitalSign) obj;
					String color = vs.getInterpretationCode() !=null ? "red" : "blue";
					sb.append(String.format(SUMMARY, vs.getQualifiedName(), color, vs.getResult(), vs.getUnits()));
				} else {
					sb.append(obj.toString());
				}
			}
			return sb.toString();
		}
		
		public Map<String, Object> toMap() {
			Map<String, Object> ret = new HashMap<String, Object>();
			ret.put("uid", uid);
			ret.put("focus", focus);
			ret.put("status_code", getOverdueStatus());
			ret.put("status", getOverdueStatusStr());
			ret.put("relevant_data", renderObs());
			ret.put("last_done", last_done);
			ret.put("conditions", conditions);
			if (selfLink != null) ret.put("selfLink", selfLink);
			if (viewdef != null) ret.put("viewdef", viewdef);
			if (viewdef_title != null) ret.put("viewdef_title", viewdef_title);
			if (viewdef_params != null) ret.put("viewdef_params", viewdef_params);
			if (comments != null) ret.put("comments", comments);
			ret.put("guidelines", "<i>" + guidelines + "</i>");
			return ret;
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
		
		protected String getOverdueStatusStr() {
			DueStatus status = getOverdueStatus();
			int daysSince = (last_done != null) ? daysSince(last_done) : 0;
			int dueInDays = days - daysSince;
			
			String tpl = "<span class=\"label %s\" title=\"%s\">%s</span>";
			String hint = (guidelines != null) ? "Guideline: " + guidelines : "";
			String ret = (last_done != null) ? renderDTM(last_done) + "<br/>" : "";
			if (status == DueStatus.NOT_DONE) {
				ret += String.format(tpl, "label-info", hint, "Not Done");
//				ret += "<span title=\"" + hint + "\">Not done</span>";
			} else if (status == DueStatus.OVERDUE) {
				hint = (daysSince - days) + "days overdue; " + hint;
				ret += String.format(tpl, "label-important", hint, "OVERDUE");
//				ret += "<span style=\"color: red; margin-left: 10px; font-weight: bold; font-size: 75%;\" title=\"" + hint + "\">OVERDUE</span>";
			} else if (status == DueStatus.DUE_SOON) {
				hint = (daysSince - days) + "Due in " + dueInDays + "d; " + hint;
				ret += String.format(tpl, "label-warning", hint, "DUE SOON");
//				ret += "<span style=\"color: gold; font-weight: bold;\" title=\"Due in " + dueInDays + "d\">DUE SOON</span>";
			}
			return ret;
		}
		
		protected DueStatus getOverdueStatus() {
			// if a expicit status was declared, return it, otherwise compute one
			if (this.status != null) return this.status;
			int daysSince = (last_done != null) ? daysSince(last_done) : 0;
			int dueInDays = days - daysSince;
			if (last_done == null && days == Integer.MAX_VALUE) {
				return DueStatus.NOT_DONE;
			} else if (daysSince >= days || last_done == null) {
				return DueStatus.OVERDUE;
			} else if (dueInDays <= 45) {
				return DueStatus.DUE_SOON;
			} else {
				return DueStatus.NOT_DUE;
			}
		}
		
	}

}
