package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.frameeng.FrameAction.OrderActionMenuItem;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.InvokeTrigger;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;
import gov.va.hmp.healthtime.PointInTime;

import org.springframework.stereotype.Component;

import javax.xml.parsers.ParserConfigurationException;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class GoldFrame {
	@Component(value="gov.va.cpe.vpr.frameeng.ActionButtonFrame")
	public static class ActionButtonFrame extends Frame {
		public ActionButtonFrame() {
			addTrigger(new IFrameTrigger.InvokeTrigger<IPatientObject>(this, IPatientObject.class, "gov.va.cpe.vpr.rowaction"));

		}

		@Override
		public void exec(FrameTask task) {
			IGenericPatientObjectDAO dao = task.getResource(IGenericPatientObjectDAO.class);
			InvokeEvent<IPatientObject> evt = (InvokeEvent<IPatientObject>) task.getTriggerEvent();
			IPatientObject obj = evt.getSource();
			if (obj == null) {
				String uid = (String) evt.getParams().get("uid");
				obj = dao.findByUID(UidUtils.getDomainClassByUid(uid).asSubclass(IPatientObject.class), uid);
			}
				
			if (obj instanceof Result) {
				Result lab = (Result) obj;
				if (lab.getTypeName().contains("CHOLESTEROL")) {
					task.addAction(new FrameAction.URLActionMenuItem("http://hp2010.nhlbihin.net/atpiii/calculator.asp", "NIH Framingham Score Calculator"));
				}
			}
            task.addAction(new FrameAction.OrderActionMenuItem("TASK", "New Task", obj.getUid(), obj.getSummary()));
		}
		
	}
	
	@Component(value="gov.va.cpe.vpr.frameeng.ProblemActionButtonFrame")
	public static class ProblemActionButtonFrame extends Frame {
		
		private InvokeTrigger<Problem> trig;
		public ProblemActionButtonFrame() {
			trig = addTrigger(new IFrameTrigger.InvokeTrigger<Problem>(this, Problem.class, "gov.va.cpe.vpr.rowaction"));
		}
		
		@Override
		public void exec(FrameTask task) throws FrameException {
			Problem prob = trig.getEventOf(task).getSource();
			String hint = "Problem edit functionality not complete";
			
			task.addAction(new FrameAction.OrderActionMenuItem("CHANGE", "Change", prob.getUid()))
				.setDisabled(true).setHint(hint).enableIfEnvironment("incubator");
			task.addAction(new FrameAction.OrderActionMenuItem("INACTIVATE", "Inactivate", prob.getUid()))
				.setDisabled(true).setHint(hint).enableIfEnvironment("incubator");
			task.addAction(new FrameAction.OrderActionMenuItem("ANNOTATE", "Annotate", prob.getUid()))
				.setDisabled(true).setHint(hint).enableIfEnvironment("incubator");
		}
	}
	
	@Component(value="gov.va.cpe.vpr.frameeng.MedActionButtonFrame")
	public static class MedActionButtonFrame extends Frame {
		private IGenericPatientObjectDAO dao;

		public MedActionButtonFrame() {
			addTrigger(new IFrameTrigger.InvokeTrigger<Medication>(this, Medication.class, "gov.va.cpe.vpr.rowaction"));
		}
		
		@Override
		protected void doInit(FrameJob task) throws Exception {
			this.dao = task.getResource(IGenericPatientObjectDAO.class);
		}

		@Override
		public void exec(FrameTask task) throws FrameException {
			InvokeEvent<Medication> evt = (InvokeEvent<Medication>) task.getTriggerEvent();
			Medication med = evt.getSource();
			if (med == null) {
				String uid = (String) evt.getParams().get("uid");
				med = dao.findByUID(Medication.class, uid);
			}
			
			// add a renew action if the med is nearing is renewby DTM
			String hint = "Order edit functionality not complete";
			PointInTime renewBy = med.getRenewBy();
			if (renewBy != null && 
				renewBy.after(PointInTime.now().subtractDays(30)) &&
				renewBy.before(PointInTime.now().addDays(30))) {
				task.addAction(new FrameAction.OrderActionMenuItem("RENEW", "Renew this Med", med.getUid())
					.setDisabled(true).setHint(hint).enableIfEnvironment("incubator"));
			}
			
			// also add some generic actions based on status
			if (med.getVaStatus().equals("ACTIVE")) {
				task.addAction(new FrameAction.OrderActionMenuItem("DISCONTINUE", "D/C this Active Med", med.getUid())
					.setDisabled(true).setHint(hint).enableIfEnvironment("incubator"));
				task.addAction(new FrameAction.OrderActionMenuItem("MODIFY", "Modify this Active Med", med.getUid())
					.setDisabled(true).setHint(hint).enableIfEnvironment("incubator"));
			} else if (med.getVaStatus().equals("PENDING")) {
				task.addAction(new FrameAction.OrderActionMenuItem("CANCEL", "Cancel this Pending Med", med.getUid())
					.setDisabled(true).setHint(hint).enableIfEnvironment("incubator"));
			} else if (med.getVaStatus().equals("DISCONTINUED")) {
				task.addAction(new FrameAction.OrderActionMenuItem("RENEW", "Renew this D/C'ed Med", med.getUid())
					.setDisabled(true).setHint(hint).enableIfEnvironment("incubator"));
			}
			
			// Test case: Add warfarindosing.org link to warfarin meds
			if (med.getRXNCodes().contains("urn:ndfrt:N0000008142")) {
				task.addAction(new FrameAction.URLActionMenuItem("http://www.warfarindosing.org", "WarfarinDosing.org calculator", "", "", "Go to WarfarinDosing.org in a new window"));
			}
		}
	}
	
	
	@Component(value="gov.va.cpe.vpr.frameeng.InfobuttonActionFrame")
	public static class InfobuttonActionFrame extends Frame {
		
		private IPatientDAO patdao;
		private IGenericPatientObjectDAO dao;
		private OpenInfoButtonLinkGenerator gen;
		private InvokeTrigger<IPatientObject> rowActionTrig;
		
		public InfobuttonActionFrame() {
			rowActionTrig = addTrigger(new IFrameTrigger.InvokeTrigger<IPatientObject>(this, IPatientObject.class, "gov.va.cpe.vpr.rowaction"));
		}
		
		@Override
		protected void doInit(FrameJob task) throws ParserConfigurationException {
			gen = task.getResource(OpenInfoButtonLinkGenerator.class);
			dao = task.getResource(IGenericPatientObjectDAO.class);
			patdao = task.getResource(IPatientDAO.class);
		}

		@Override
		public void exec(FrameTask task) throws FrameException {
			// determine trigger object/patient
            PatientDemographics pat = null;
			IPatientObject obj = null;
			Map<String, Object> params = task.getTriggerEvent().getParams();
			if (rowActionTrig.isTriggerOf(task)) {
				obj = rowActionTrig.getEventOf(task).getSource();
				if (obj != null) {
					pat = patdao.findByPid(obj.getPid());
				}
			}
			
			// If URL was specified in row, use that and return
			String url = (String) params.get("infobtnurl");
			if (url != null) {
				fetchInfobuttonURL(task, url, null);
				return;
			}
			
			// otherwise, build a infobutton url from the source object or UID 
			if (obj == null) {
				String uid = (String) params.get("uid");
				obj = dao.findByUID(UidUtils.getDomainClassByUid(uid).asSubclass(IPatientObject.class), uid);
			}
			
			// generate url 
			if (obj instanceof Medication) {
				Medication med = (Medication) obj;
				if (med.isSupply()) return; // skip supplies
				
				List<MedicationProduct> mps = med.getProducts();
				for (MedicationProduct mp : mps) {
					// skip medication products that we can't get a rxnorm code for
					String rxn = mp.getIngredientRXNCode();
					if (rxn == null) continue;
					
					String name = mp.getIngredientName();
					if (mp.getIngredientCodeName() != null) {
						name = mp.getIngredientCodeName();
					}
					
					// performer=provider
					url = gen.buildInfobuttonURL(pat,
							rxn, name,
							OpenInfoButtonLinkGenerator.TASK_CONTEXT_MLREV,
							OpenInfoButtonLinkGenerator.RXNORM_CODE_SYSTEM_OID,
							OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER);
					String title = (mps.size() > 1) ? mp.getIngredientName() : null;
					fetchInfobuttonURL(task, url, title);
					
					// link to pt education 
					url = gen.buildInfobuttonURL(pat,
							rxn, name,
							OpenInfoButtonLinkGenerator.TASK_CONTEXT_MLREV,
							OpenInfoButtonLinkGenerator.RXNORM_CODE_SYSTEM_OID,
							OpenInfoButtonLinkGenerator.PERFORMER_PATIENT);
					OrderActionMenuItem menuItem = new FrameAction.OrderActionMenuItem(
							"gov.va.cpe.PatEdWin", "Patient Education", url);
					menuItem.setHint("Click to see patient education resources");
					menuItem.setProperty("heading", "Links");
					task.addAction(menuItem);
				}

				return;
			} else if (obj instanceof Result) {
				Result lab = (Result) obj;
				url = gen.buildInfobuttonURL(pat, lab.getTypeCode(),
						lab.getTypeName(),
						OpenInfoButtonLinkGenerator.TASK_CONTEXT_LABRREV,
						OpenInfoButtonLinkGenerator.LOINC_CODE_SYSTEM_OID, 
						OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER);
			} else if (obj instanceof Problem) {
		        Problem p = (Problem) obj;
				url = gen.buildInfobuttonURL(pat, p.getIcdCode(),
						p.getIcdName(),
						OpenInfoButtonLinkGenerator.TASK_CONTEXT_PROBLISTREV,
						OpenInfoButtonLinkGenerator.ICD9_CM_CODE_SYSTEM_OID,
						OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER);
				
				// link to pt education 
				url = gen.buildInfobuttonURL(pat,
						p.getIcdCode(), p.getIcdName(),
						OpenInfoButtonLinkGenerator.TASK_CONTEXT_PROBLISTREV,
						OpenInfoButtonLinkGenerator.ICD9_CM_CODE_SYSTEM_OID,
						OpenInfoButtonLinkGenerator.PERFORMER_PATIENT);
				OrderActionMenuItem menuItem = new FrameAction.OrderActionMenuItem(
						"gov.va.cpe.PatEdWin", "Patient Education", url);
				menuItem.setHint("Click to see patient education resources");
				menuItem.setProperty("heading", "Links");
				task.addAction(menuItem);
			} else if (obj instanceof Immunization) {
				Immunization i = (Immunization) obj;
				url = gen.buildInfobuttonURL(pat, i.getCptCode(),
						i.getCptName(),
						OpenInfoButtonLinkGenerator.TASK_CONTEXT_IMMLREV,
						OpenInfoButtonLinkGenerator.CPT_CODE_SYSTEM_OID,
						OpenInfoButtonLinkGenerator.PERFORMER_PROVIDER);
			}
			
			// fetch the URL
			if (url != null) {
				fetchInfobuttonURL(task, url, null);
			}
		}
		
		private static void fetchInfobuttonURL(FrameTask task, String url, String titleOverride) throws FrameExecException {
			// fetch links
			Collection<Map<String,Object>> links = null;
			try {
				links = OpenInfoButtonLinkGenerator.fetchInfobuttonURL(url, 500, 3000, titleOverride);
			} catch (IOException ex) {
				task.addAction(new FrameAction.URLActionMenuItem("","**Infobutton Timeout/Error**"));
//				throw new FrameExecException(task.getFrame(), "Error fetching OpenInfobutton response", ex);
				return;
			}
			
			// map each one to a URLActionMenuItem
			for (Map<String, Object> link : links) {
				String href = (String) link.get("href");
				String etitle = (String) link.get("etitle");
				String title = (String) link.get("title");
				String ehint = (String) link.get("ehint");
				String subtitle = (String) link.get("subtitle");
				task.addAction(new FrameAction.URLActionMenuItem(href, etitle, title, subtitle, ehint));
			}
		}
	}


}
