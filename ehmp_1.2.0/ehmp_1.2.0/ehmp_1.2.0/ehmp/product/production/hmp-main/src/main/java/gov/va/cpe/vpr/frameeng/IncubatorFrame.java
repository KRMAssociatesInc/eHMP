package gov.va.cpe.vpr.frameeng;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.frameeng.FrameAction.ObsDateRequestAction;
import gov.va.cpe.vpr.frameeng.FrameAction.ObsRequestAction;
import gov.va.cpe.vpr.frameeng.FrameAction.RetractAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.InvokeTrigger;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.MedOrderedTrigger;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.NewObsTrigger;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.queryeng.ViewParam.AsArrayListParam;
import gov.va.cpe.vpr.queryeng.ViewParam.SimpleViewParam;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermEng;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.*;
import java.util.Map.Entry;

public class IncubatorFrame {
	public static class ProtocolFrame extends Frame {
		private String pid;
		private JsonNode document;
		private Map<IFrameTrigger, ObjectNode> triggerToGoals = new HashMap();

		public ProtocolFrame(JsonNode document) {
			this(null, document);
		}
		
		public ProtocolFrame(URI resource, JsonNode document) {
			this.document = document;
			if (this.document == null) return;
			setID(this.document.findValue("id").asText());
			setName(this.document.findValue("name").asText());
			setResource(resource);
			setType("gov.va.cpe.protocol");
			this.pid = (this.document.has("pid")) ? this.document.findValue("pid").asText() : null;
			
			// setup the candidate-based triggers
			ArrayNode candidates = (ArrayNode) this.document.findValue("candidates");
			if (candidates != null) {
				for (JsonNode cand : candidates) {
					IFrameTrigger trig = buildTrigger(cand.get("trigger"));
					addTrigger(trig);
				}
			}
			
			// setup the goal-based triggers if this is a patient instance frame
			/*
			ArrayNode goals = (ArrayNode) this.document.findValue("goals");
			if (goals != null && this.pid != null) {
				for (JsonNode goal : goals) {
					IFrameTrigger trig = buildTrigger(goal.get("trigger"));
					triggerToGoals.put(trig, (ObjectNode) goal);
					addTrigger(new IFrameTrigger.PatientIDTriggerWrapper(this.pid, trig));
				}
			}
			*/
			
			// add everything else as metadata
			Iterator<Entry<String, JsonNode>> itr = this.document.fields();
			Set<String> ignoreList = new HashSet<String>();
			ignoreList.add("candidates");
			ignoreList.add("goals");
			
			while (itr.hasNext()) {
				Entry<String, JsonNode> obj = itr.next();
				if (!ignoreList.contains(obj.getKey())) {
					addMeta(obj.getKey(), obj.getValue().textValue());
				}
			}
		}
		
		private static IFrameTrigger buildTrigger(JsonNode trig) {
			if (trig != null) {
				String classStr = trig.get("class").asText();
				if (classStr.equals("gov.va.cpe.vpr.frameeng.IFrameTrigger.NewVitalSignTrigger")) {
					ArrayNode params = (ArrayNode) trig.get("params");
					if (params != null && params.size() > 0) {
						return new IFrameTrigger.NewVitalSignTrigger(params.get(0).asText());
					}
				} else if (classStr.equals("gov.va.cpe.vpr.frameeng.IFrameTrigger.LabResultRangeTrigger")) {
					ArrayNode params = (ArrayNode) trig.get("params");
					String name = null;
					Double lo = null;
					Double hi = null;
					if (params != null && params.size() > 0) {
						name = params.get(0).asText();
					}
					if (params != null && params.size() > 1) {
						lo = params.get(1).asDouble();
					}
					if (params != null && params.size() > 2) {
						hi = params.get(2).asDouble();
					}
					if (name != null && lo != null) {
						return new IFrameTrigger.LabResultRangeTrigger(name, lo);
					} else if (name != null && lo != null && hi != null) {
						return new IFrameTrigger.LabResultRangeTrigger(name, lo, hi);
					}
				}
			}
			throw new IllegalStateException("Unable to parse node into trigger def: " + trig);
		}
		
		@Override
		public void exec(FrameTask ctx) {
			// get the corresponding goal
			ObjectNode goal = this.triggerToGoals.get(ctx.getFrameTrigger());
			
			// what type trigger/goal?
			if (goal == null) {
				// this patient is a candidate for this protocol
				PatientEvent event = (PatientEvent) ctx.getTriggerEvent();
				ctx.addAction(new FrameAction.NewInstanceFrameAction(event.getPID()));
			} else if (goal != null && goal.findValue("type").asText().equals("obs_frequency")) {
				// TODO: re-evaluate protocol, invoke DiabetesViewDef
			}
		}
	}
	
	@Component(value="gov.va.cpe.vpr.frameeng.TeratogenicMedsFrame")
	public static class TeratogenicMedsFrame extends Frame {
		// TODO: Externalize these?
		private static String TITLE = "Potentially Teratogenic Medication";
		private static String DESC = "<p>Concern has been raised about use of this medication during pregnancy.  Approximately 6% of US pregnancies are exposed to potentially teratogenic medications. </p>"
				+ "<p>1) Pregnancy status should be determined. Discuss use of this medication on the context of risks to the mother and child of untreated disease. Potential benefits may warrant use of the drug in pregnant women despite risks. </p>"
				+ "<p>2) The patient must be provided contraceptive counseling on potential risk vs. benefit of taking this medication if she were to become pregnant.  </p>";
		
		MedOrderedTrigger trig1 = addTrigger(new MedOrderedTrigger());
		InvokeTrigger<Medication> trig2 = addTrigger(new InvokeTrigger<Medication>(this, Medication.class, "viewdefactions"));
		NewObsTrigger trig3 = addTrigger(new NewObsTrigger("urn:sct:307429007", "urn:sct:236886002"));
		
		public TeratogenicMedsFrame() {
			setName(TITLE);
			
			FrameReference ref = new FrameReference();
			ref.authors = "Andrade SE, Gurwitz JH, Davis RL, et al";
			ref.title = "Prescription drug use in pregancy";
			ref.source = "Am J Obstet Gynecol. 2004;191(2):398-407";
			ref.pmid = "15343213";
			addReference(ref);
			
			ref = new FrameReference();
			ref.authors = "Lee E, Maneno MK, Smith L, et al";
			ref.title = "National patterns of medication use during pregnancy";
			ref.source = "Pharmacoepidemiol DrugSaf. 2006;15(8):537-45";
			ref.pmid = "16700083";
			addReference(ref);
		}

		@Override
		public void exec(FrameTask task) throws FrameExecException {
			TermEng eng = TermEng.getInstance();
            PatientDemographics pat = null;
			String pid = null;
			Medication med = null;
			

			if (trig1.isTriggerOf(task)) {
				PatientEvent<Medication> evt = trig1.getEventOf(task);
				pat = evt.getPatient();
				pid = evt.getPID();
				med = evt.getSource();
			} else if (trig2.isTriggerOf(task)) {
				InvokeEvent<Medication> evt = trig2.getEventOf(task);
				med = evt.getSource();
				pid = med.getPid();
				pat = task.getResource(IPatientDAO.class).findByPid(pid);
			} else if (trig3.isTriggerOf(task)) {
				// retract alert(s) and return
				PatientEvent<Observation> evt = trig3.getEventOf(task);
				task.addAction(new RetractAction(evt.getPID(), getID()));
				return;
			}
			
			// TODO: if med is not active/pending/scheduled then retract
			// med must be active/pending
			if (med == null || (!med.isActive() && !med.isPending())) {
				return;
			}
			
			if (pat == null) {
				IPatientDAO dao = task.getResource(IPatientDAO.class);
				pat = dao.findByPid(pid);
			}
			
			// if pt is Male, under 12yo or over 50yo then quit.
			if (pat!=null && (pat.isMale() || pat.getAge() < 12 || pat.getAge() > 50)) {
				return;
			}

			// look for any mitigating factors, if found, quit.
			IGenericPatientObjectDAO dao = task.getResource(IGenericPatientObjectDAO.class);
			String[] uids = new String[] {
					"urn:va:obs::" + pid + ":urn:sct:307429007",
					"urn:va:obs::" + pid + ":urn:sct:236886002" };
			for (String uid : uids) {
				if (dao.findByUID(uid) != null) return;
			}
			
			// TODO: How to check if FDA categories D or X
			
			// if this med CI'ed with Pregnancy in NDFRT, alert
			// TODO: move the concept matching into the trigger.
			Concept pregnancy = eng.getConcept("urn:ndfrt:N0000010195");
			Map<String,String> pregnancyRels = pregnancy.getRelationships();
			for (String code : med.getRXNCodes()) {
				for (String code2 : pregnancyRels.keySet()) {
					if (code.equals(code2)) {
						String parts[] = med.getUid().split(":");
						String id = "teratogenic:" + ((parts.length == 6) ? parts[4]+":"+parts[5] : "");
						PatientAlert aa = new PatientAlert(this, id, pid, TITLE, DESC);
						aa.addLink(med.getUid(), "TRIGGER");
						aa.addSubAction(new ObsDateRequestAction(pid, "Pt. is post-menopausal? Estimated date of last menstrual period?", "urn:sct:307429007" /*after menopause*/));
						aa.addSubAction(new ObsRequestAction(pid, "Pt. has had a hysterectomy?", "urn:sct:236886002" /*Hysterectomy*/));
						aa.addSubAction(new ObsRequestAction(pid, "Pt. has IUD?", "urn:sct:268460000" /*Intrauterine contraceptive device*/));
						aa.addSubAction(new ObsRequestAction(pid, "Pt. provided contraceptive counseling on risks.", "urn:sct:398780007" /*Contraception education*/));
						aa.addSubAction(new ObsDateRequestAction(pid, "Last menstrual period sensation?", "urn:sct:289899004" /*Finding of sensation of periods*/));
						task.addAction(aa);
					}
				}
			}
		}
	}
	
	@Component(value="gov.va.cpe.vpr.frameeng.RenalDosingAdjustmentFrame")
	public static class RenalDosingAdjustmentFrame extends Frame {
		public RenalDosingAdjustmentFrame() {
			setName("Renal Drug Dosing Adjustment");
			declareParam(new SimpleViewParam("include.classes", "urn:vadc:AM400,urn:vadc:CV701" /*QUINOLONES,THIAZIDES/RELATED DIURETICS (TODO: Hacked in for demo)*/));
			declareParam(new SimpleViewParam("include.ingredients", "urn:ndfrt:N0000007606" /* Quinolones*/));
			declareParam(new AsArrayListParam("include.ingredients"));
			declareParam(new AsArrayListParam("include.classes"));
			declareParam(new SimpleViewParam("scr.threshold", 1.5f));
			addTrigger(new IFrameTrigger.InvokeTrigger<Medication>(this, Medication.class, "viewdefactions"));
			addTrigger(new IFrameTrigger.MedOrderedTrigger()); // trigger on all meds
			addTrigger(new IFrameTrigger.LabResultTrigger("CREATININE"));
			/* Triggering on: 
			 * Quinolones (ciprofloxacin: urn:ndfrt:N0000147503, gatifloxacin, gemifloxacin, grepafloxacin, levofloxacin, lomefloxacin, moxifloxacin, nalidixic acid, norfloxacin, ofloxacin)
			 * Others?
            Purine nucleosides				(acyclovir, cidofovir, famciclovir, ganciclovir, ribavirin, valacyclovir, valganciclovir)			
            Antigout agents				(allopurinol, colchicines, colchicines-probenecid, probenecid, sulfinpyrazone)			
            Adamantine antivirals				(amantadine, rimantidine)			
            aminoglycosides			
            All penicillins				(aminopenicillins, antipseudomonal penicillins, beta-lactamase inhibitors, natural penicillins, penicillinase resistant penicillins)			
            Beta-lactamase inhibitors				(amox-clav, amp-sulbact, pip-tazo, ticar-clav)			
            All cephalosporins			
            Quinolones				(ciprofloxacin, gatifloxacin, gemifloxacin, grepafloxacin, levofloxacin, lomefloxacin, moxifloxacin, nalidixic acid, norfloxacin, ofloxacin)			
            H2 antagonists				(cimetidine, famotidine, nizatidine, ranitidine)			
            Azole antifungals				(clotrimazole, fluconazole, itraconazole, ketoconazole, miconazole, posaconazole, voriconazole)			Carbapenems				(ertapenem, imipenem, meropenem)			Macrolides				(azithromycin, clarithromycin,dirithromycin, erythromycin, troleandomycin)			Echinocandins				(anidulafungin, caspofungin, micafungin)		</ul>      	</p>      	      	<p>Default excluded routes:		<ul>			TOP				VAG				EYE				OPT			</ul>      	</p>      </alert_description>      	      <trigger_events>              	<p>The renal drug screening alert is triggered to run anytime a drug is ordered, discontinued, put on hold, or canceled, or a SCr lab is updated.</p>                         </trigger_events>            <retract_events>              	<p>The renal drug screening alert is retracted when:</p>               		<ul>                             			A candidate medication order is canceled, discontinued or put on hold.                                 			When a newer alert fires updating the previous alert.                                                     			The patient's CrCl increases about the threshold value.                                     		</ul>      </retract_events>            <other_conditions>             	<p>The alert contains additional parameters that can be set at each site.  One parameter allows an age restriction to be turned on.  By default, the alert is configured to generate alerts on all patients but can be configured to ignore patients under 18 or who have an unknown age.  Another parameter allows the site to exclude patients with unknown CrCl values. Another parameter allows the site to set the CrCl threshold value. Another parameter sets the SCr threshold which is used if the CrCl cannot be calculated. Other parameters allows the site to exclude medications based on concept ids, medication text, or route.</p>      </other_conditions>",
			 * 
			 */
			
		}

		@Override
		public void exec(FrameTask ctx) {
			// TODO Auto-generated method stub
			IGenericPatientObjectDAO dao = ctx.getResource(IGenericPatientObjectDAO.class);
			JdsOperations tpl = ctx.getResource(JdsOperations.class);
			
			List<String> includeClasses = (List<String>) AsArrayListParam.toList(ctx.getParamObj("include.classes"));
			List<String> includeIngredients = (List<String>) AsArrayListParam.toList(ctx.getParamObj("include.ingredients"));
			
			// TODO: parameter calculation is not correct yet.
//			List<String> includeClasses = (List<String>) ctx.getParamObj("include.classes");
//			List<String> includeIngredients = (List<String>) ctx.getParamObj("include.ingredients");
			Float scrThreshold = (Float) ctx.getParamObj("scr.threshold");
			
			IFrameEvent<IPatientObject> evt = (IFrameEvent<IPatientObject>) ctx.getTriggerEvent();
			String pid = evt.getSource().getPid();
			
			// get triggering med (if any), or find any active candidate meds
			List<Medication> meds = new ArrayList<Medication>();
			if (ctx.getFrameTrigger() instanceof IFrameTrigger.MedOrderedTrigger) {
				meds.add((Medication) evt.getSource());
			} else if (evt instanceof InvokeEvent) {
				meds.add((Medication) evt.getSource());
			} else {
				meds = tpl.getForList(Medication.class, "/vpr/" + pid + "/index/medication/?filter=eq(medStatus,\"urn:sct:55561003\")");
			}
			
			// get triggering or most recent SCR (if any)
			Result scr = null;
			if (ctx.getFrameTrigger() instanceof IFrameTrigger.LabResultTrigger) {
				scr = (Result) ctx.getTriggerEvent().getSource();
			} else {
				scr = tpl.getForObject(Result.class, "/vpr/" + pid + "/last/lab-type?range=CREATININE*");
			}
			
			// abort if the patient does not have renal insuficiency 
			if(scr==null) {return;}
			Number n = scr.getResultNumber();
			if (n == null || n.floatValue() <= scrThreshold) {
				return;
			}
			
			// abort if the patient does not have any candidate meds
			List<Medication> candidateMeds = new ArrayList<Medication>(meds);
			for (Medication med : meds) {
				if (!isCandidateMed(med, includeClasses, includeIngredients)) {
					candidateMeds.remove(med);
				}
			}
			if (candidateMeds.isEmpty()) {
				return;
			}
			
			// alert! generate alert and link to all relevant meds
			String desc = "The patients last SCR of: " + n + " is abnormal and indicates this drug may need renal dosage adjustment";
			PatientAlert alert = new PatientAlert(this, "renaldrugassesment", pid, "Renal Drug Assessment", desc);
			for (Medication med : candidateMeds) {
				alert.addLink(med.getUid(), "TRIGGER");
			}
			ctx.addAction(alert);
			
		}
		
		private boolean isCandidateMed(Medication med, List<String> includeClasses, List<String> includeIngredients) {
			Set<String> classes = med.getDrugClassCodes();
			for (String s : includeClasses) {
				if (classes.contains(s)) {
					return true;
				}
			}
			
			classes = med.getRXNCodes();
			for (String s : classes) {
				if (TermEng.getInstance().isa(s, includeIngredients)) {
					return true;
				}
			}
			
			return false;
		}
	}
	
	
	// @Component(value="gov.va.cpe.vpr.frameeng.MedHandlerFrame")
	// NOT READY FOR PRIMETIME YET
	public static class MedHandlerFrame extends Frame {
		private InvokeTrigger<Medication> trig;

		public MedHandlerFrame() {
			trig = addTrigger(new InvokeTrigger<Medication>(this, Medication.class, "viewdefactions"));
		}
		
		@Override
		public void exec(FrameTask task) throws FrameException {
			Medication med = trig.getEventOf(task).getSource();
			
			// add alert for non-compliance if found
			Integer meanGap = med.getMeanGap();
			if (med.isActive() && meanGap != null && meanGap >= 2) {
				String desc = "The recent Mean Gap between fills of is " + meanGap + "days indicating potential non-compliance with this drug therapy.";
				PatientAlert alert = new PatientAlert(this, "mednoncompliance", med.getPid(), "Medication Non-compliance", desc);
				alert.addLink(med.getUid(), "TRIGGER");
				task.addAction(alert);
			}
		}
	}
	
	//@Component(value="gov.va.cpe.vpr.frameeng.PatientFlagsFrame")
	// I don't think we are using this anymore
	public static class PatientFlagsFrame extends Frame {
		
		public PatientFlagsFrame() {
			addTrigger(new IFrameTrigger.InvokeTrigger<PatientDemographics>(this, PatientDemographics.class, "gov.va.cpe.vpr.postings"));
		}

		@Override
		public void exec(FrameTask task) throws FrameException {
			IGenericPatientObjectDAO dao = task.getResource(IGenericPatientObjectDAO.class);
			IPatientDAO pdao = task.getResource(IPatientDAO.class);
			IFrameEvent<PatientDemographics> evt = (IFrameEvent<PatientDemographics>) task.getTriggerEvent();
            PatientDemographics triggerPat = evt.getSource();
			PatientDemographics dems = pdao.findByPid(triggerPat.getPid());
			if(dems!=null) {
				for(PatientRecordFlag flag: dems.getPatientRecordFlag()) {
					task.addAction(new FrameAction.PatientPostingsAction(flag.getData()));
				}
			}
			QueryDef qd = new QueryDef("cwad");
			Map<String, Object> parms = new HashMap<String, Object>();
			parms.put("pid",triggerPat.getPid());
			List<gov.va.cpe.vpr.Document> results = dao.findAllByQuery(gov.va.cpe.vpr.Document.class, qd, parms);
			for(gov.va.cpe.vpr.Document rslt: results) {
				task.addAction(new FrameAction.PatientPostingsAction(rslt.getData()));
			}
		}
	}
}
