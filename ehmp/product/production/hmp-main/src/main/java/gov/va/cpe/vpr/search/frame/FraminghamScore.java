package gov.va.cpe.vpr.search.frame;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.frameeng.FrameAction.RefDataAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.Goal;
import gov.va.cpe.vpr.frameeng.Goal.GoalStatus.DueStatus;
import gov.va.cpe.vpr.frameeng.IFrameTrigger;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.cpe.vpr.search.SearchFrame;
import gov.va.cpe.vpr.search.SearchFrame.KeywordSearchTrigger;
import gov.va.hmp.healthtime.PointInTime;
import org.springframework.stereotype.Component;

@Component(value="gov.va.cpe.vpr.goals.FraminghamScore")
public class FraminghamScore extends Goal {
	
	private KeywordSearchTrigger searchTrig;

	public FraminghamScore() {
		addTrigger(new IFrameTrigger.CallTrigger(this));
		searchTrig = addTrigger(new SearchFrame.KeywordSearchTrigger(this, false, "framingham", "chd", "atp iii"));
		declareParam("smoker", 0);
		declareParam("sbptreated", 0);
		declareParam("sbp", 0);
		declareParam("tchol", 0);
		declareParam("hdl", 0);
	}
	
	@Override
	protected void rowAction(FrameTask task) {
		String focus = task.getParamStr("focus");
		if (focus != null && focus.equalsIgnoreCase("Framingham Score")) {
			task.addAction(new FrameAction.URLActionMenuItem("http://cvdrisk.nhlbi.nih.gov/calculator.asp", "NIH ATP-III Report"));
		}
	}
	
	@Override
	public void evalGoal(FrameTask task) throws Exception {
		// fetch patient demographics
        PatientDemographics p = findOne(PatientDemographics.class, "/vpr/{pid}", task.getParams());
		if (p == null || p.getAge() > 79) return;
		
		RefDataAction refdata = task.addAction(new FrameAction.RefDataAction());
		refdata.setValue("gender", p.getGenderName());
		refdata.setValue("pid", p.getPid());
		int age = refdata.setValue("age", p.getAge());
		boolean male = refdata.setValue("male", p.isMale());
		boolean smoker = refdata.setValue("smoker", task.getParamInt("smoker") != 0 ? true : false);
		boolean sbptreated = refdata.setValue("sbptreated", task.getParamInt("sbptreated") != 0 ? true : false);
		int hdl = task.getParamInt("hdl"), tchol = task.getParamInt("tchol"), ldl = task.getParamInt("ldl"), sbp = task.getParamInt("sbp");
		String uid = null;
		PointInTime last = null;
		if (hdl <= 0 && tchol > 0 && ldl >= 0) hdl = tchol - ldl;
		if (ldl <= 0 && tchol > 0 && hdl >= 0) ldl = tchol - hdl;
		
		// fetch data (if needed)
		if (tchol <= 0 || ldl <= 0) {
			// TODO: Bad.... change this to loinc
			Result r1 = findOne(Result.class, "/vpr/{pid}/last/lab-type?range=CHOLESTEROL", task.getParams());
			Result r2 = findOne(Result.class, "/vpr/{pid}/last/lab-type?range=LDL CHOLESTEROL,CALCULATED LDL", task.getParams());
			
			if (r1 != null && r2 != null && r1.getResultNumber() != null && r2.getResultNumber() != null) {
				tchol = r1.getResultNumber().intValue();
				ldl = r2.getResultNumber().intValue();
				hdl = tchol - ldl;
				uid = r1.getUid();
				last = r1.getObserved();
			}
		}
		
		if (sbp <= 0) {
			VitalSign r3 = findOne(VitalSign.class, "/vpr/{pid}/last/vs-type?range=BLOOD PRESSURE", task.getParams());
			
			if (r3 != null) {
				sbp = Integer.parseInt(r3.getResult().split("/")[1]);
			}
		}
		
		// create/populate goal
		GoalStatus g = task.addAction(new GoalStatus(DueStatus.MISC));
		g.focus = "Framingham Score";
		g.guidelines = "?";
		g.selfLink = "/frame/exec?frameID=gov.va.cpe.vpr.goals.FraminghamScore&mode=/frame/framingham&pid=" + task.getParamStr("pid");

		SummaryItem search = null;
		if (searchTrig.isTriggerOf(task)) {
			search = task.addAction(new SummaryItem("urn:wizard:framinghamscore"));
			search.type = "Wizard";
			search.kind = "Framingham Score";
			search.summary = "Framingham Score: Unknown";
			search.detailType = "iframe";
			search.detailCfg = Table.buildRow("url", g.selfLink);
		}
		
		if (tchol > 0 && ldl > 0 && hdl > 0 && sbp > 0) {
			g.uid = uid;
			g.last_done = last;

			// calculate the score and risk
			int score = FraminghamScore.calcBaseScore(male, age);
			score += FraminghamScore.calcSmokerScore(male, age, smoker);
			score += FraminghamScore.calcCholScore(male, age, tchol, hdl);
			score += FraminghamScore.calcSBPScore(male, age, sbp, sbptreated);
			String risk = calcRisk(score, male);
			
			refdata.setValue("score", score);
			refdata.setValue("risk", risk);
			refdata.setValue("hdl", hdl);
			refdata.setValue("ldl", ldl);
			refdata.setValue("tchol", tchol);
			refdata.setValue("sbp", sbp);
			
			g.relevant_data = "10-Year Risk: " + risk;
			
			// add search result stuff
			if (search != null) {
				if (last != null) search.datetime = last.toString();
				search.summary = "10-Year CHD risk: " + risk + " (Framingham Score: " + score + ")"; 
			}
		}
	}
	
	public static String calcRisk(int score, boolean male) {
		if (male) {
			if (score <= 4) {
				return "< 1%";
			} else if (score <= 6) {
				return "2%";
			} else if (score <= 7) {
				return "3%";
			} else if (score <= 8) {
				return "4%";
			} else if (score <= 9) {
				return "5%";
			} else if (score <= 10) {
				return "6%";
			} else if (score <= 11) {
				return "8%";
			} else if (score <= 12) {
				return "10%";
			} else if (score <= 13) {
				return "12%";
			} else if (score <= 14) {
				return "16%";
			} else if (score <= 15) {
				return "20%";
			} else if (score <= 16) {
				return "25%";
			} else {
				return "\u2265 30%";
			}
		} else {
			if (score < 9) {
				return "< 1%";
			} else if (score <= 12) {
				return "1%";
			} else if (score <= 14) {
				return "2%";
			} else if (score == 15) {
				return "3%";
			} else if (score == 16) {
				return "4%";
			} else if (score == 17) {
				return "5%";
			} else if (score == 18) {
				return "6%";
			} else if (score == 19) {
				return "8%";
			} else if (score == 20) {
				return "11%";
			} else if (score == 21) {
				return "14%";
			} else if (score == 22) {
				return "17%";
			} else if (score == 23) {
				return "22%";
			} else if (score == 24) {
				return "27%";
			} else {
				return "\u2265 30%";
			}
		}
	}
	
	public static int calcBaseScore(boolean male, int age) {
		int score = 0;
		
		// age baseline score
		if (age <= 34) {
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
		}
		
		return score;
	}
	
	public static int calcSmokerScore(boolean male, int age, boolean smoker) {
	
		// smoking status
		if (!smoker) {
			return 0;
		}
		
		if (age <= 39) {
			return (male) ? 8 : 9;
		} else if (age <= 49) {
			return (male) ? 5 : 7;
		} else if (age <= 59) {
			return (male) ? 3 : 4;
		} else if (age <= 69) {
			return (male) ? 1 : 2;
		} else if (age <= 79) {
			return 1;
		} else {
			return 1;
		}
	}
		
	public static int calcCholScore(boolean male, int age, int tchol, int hdl) {
		int score = 0;
		
		// add tchol score
		if (tchol < 160) {
			score += 0;
		} else if (tchol <= 199 && age <= 39) {
			score += 4;
		} else if (tchol <= 199 && age <= 49) {
			score += 3;
		} else if (tchol <= 199 && age <= 59) {
			score += 2;
		} else if (tchol <= 199 && age <= 69) {
			score += 1;
		} else if (tchol <= 199 && age <= 79) {
			score += (male) ? 0 : 1;
		} else if (tchol <= 239 && age <= 39) {
			score += (male) ? 7 : 8;
		} else if (tchol <= 239 && age <= 49) {
			score += (male) ? 5 : 6;
		} else if (tchol <= 239 && age <= 59) {
			score += (male) ? 3 : 4;
		} else if (tchol <= 239 && age <= 69) {
			score += (male) ? 1 : 2;
		} else if (tchol <= 239 && age <= 79) {
			score += (male) ? 0 : 1;
		} else if (tchol <= 279 && age <= 39) {
			score += (male) ? 9 : 11;
		} else if (tchol <= 279 && age <= 49) {
			score += (male) ? 6 : 8;
		} else if (tchol <= 279 && age <= 59) {
			score += (male) ? 4 : 5;
		} else if (tchol <= 279 && age <= 69) {
			score += (male) ? 2 : 3;
		} else if (tchol <= 279 && age <= 79) {
			score += (male) ? 1 : 2;
		} else if (tchol >= 280 && age <= 39) {
			score += (male) ? 11 : 13;
		} else if (tchol >= 280 && age <= 49) {
			score += (male) ? 8 : 10;
		} else if (tchol >= 280 && age <= 59) {
			score += (male) ? 5 : 7;
		} else if (tchol >= 280 && age <= 69) {
			score += (male) ? 3 : 4;
		} else if (tchol >= 280 && age <= 79) {
			score += (male) ? 1 : 2;
		}
		
		// hdl level
		if (hdl >= 60) {
			score += -1;
		} else if (hdl >= 50) {
			score += 0;
		} else if (hdl >= 40) {
			score += 1;
		} else if (hdl < 40) {
			score += 2;
		}
		
		return score;
	}
	
	public static int calcSBPScore(boolean male, int age, int sbp, boolean sbptreated) {
		// sbp TODO: Add female logic
		if (sbp < 120) {
			return 0;
		} else if (sbp <= 129) {
			return (sbptreated) ? 1 : 0;
		} else if (sbp <= 139) {
			return (sbptreated) ? 2 : 1;
		} else if (sbp <= 159) {
			return (sbptreated) ? 2 : 1;
		} else if (sbp >= 160) {
			return (sbptreated) ? 3 : 2;
		} else {
			return 0;
		}
	}
}