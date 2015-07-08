package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.PatientAlert;
import gov.va.cpe.vpr.frameeng.FrameAction.ObsRequestAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.queryeng.ViewParam.SimpleViewParam;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.stereotype.Component;

import java.util.List;

@Component(value="gov.va.cpe.vpr.frameeng.IV2POFrame")
public class IV2POFrame extends Frame {
	
	public IV2POFrame() {
		declareParam(new SimpleViewParam("candidateMedClasses", "")); /*h2 antagonissts, proton pump inhibitors, etc */
		addTrigger(new IFrameTrigger.InvokeTrigger<Medication>(this, Medication.class, "viewdefactions"));
		addTrigger(new IFrameTrigger.MedOrderedTrigger());
		addTrigger(new IFrameTrigger.InvokeTrigger<Medication>(this, Medication.class, "gov.va.cpe.vpr.rowaction"));
	}

	@Override
	public void exec(FrameTask ctx) {
		IGenericPatientObjectDAO dao = ctx.getResource(IGenericPatientObjectDAO.class);
		IFrameEvent<Medication> evt = (IFrameEvent<Medication>) ctx.getTriggerEvent();
		Medication triggerMed = evt.getSource();
		String pid = triggerMed.getPid();
		
		// if no trigger med was found, or its not an active infusion med, quit.
		if (triggerMed == null || !triggerMed.getKind().equals("Infusion") || !triggerMed.getVaStatus().equals("ACTIVE")) {
			return;
		}
		
		// look for oral meds
		QueryDef qry = new QueryDef("medication");
		qry.where("vaStatus").is("ACTIVE");
		List<Medication> meds = dao.findAllByQuery(Medication.class, qry, Table.buildRow("pid", pid));
		
		Medication oralMed = null;
		for (Medication med : meds) {
			if (!med.getKind().equals("Infusion")) {
				oralMed = med;
				break;
			}
		}

		// if an oral med was found, issue an alert.
		if (oralMed != null) {
			if (evt instanceof InvokeEvent && ((InvokeEvent) evt).getEntryPoint().equals("gov.va.cpe.vpr.rowaction")) {
				ctx.addAction(new FrameAction.OrderActionMenuItem("MODIFY", "Change route to PO", triggerMed.getUid()));
			} else {
				PatientAlert aa = new PatientAlert(this, "iv2po", pid, "IV2PO Switch Candidate", "This patient has active PO and IV meds, consider switching IV meds to PO to reduce infection risk, etc."); 
				aa.addLink(oralMed.getUid(), "REFERENCE");
				aa.addLink(triggerMed.getUid(), "TRIGGER");
				aa.addSubAction(new ObsRequestAction(pid, "Schedule PO med switch", "?"));
				aa.addSubAction(new ObsRequestAction(pid, "Task someone to evaluate IV2PO switch on: <input type=\"text\" value=\"9/17/2012\" size=\"10\">", "?"));
				aa.addSubAction(new ObsRequestAction(pid, "Patient not a PO candidate because: Oral diet to be canceled.  Reevaluate in <input type=\"text\" size=\"2\"> days", "?"));
				aa.addSubAction(new ObsRequestAction(pid, "Patient not a PO candidate because: pt. with nausea and vomiting.  Reevaluate in <input type=\"text\" size=\"2\"> days", "?"));
				aa.addSubAction(new ObsRequestAction(pid, "Patient not a PO candidate because: Other <input type=\"text\" size=\"30\"> days", "?"));
				ctx.addAction(aa);
			}
		}
	}
	
}