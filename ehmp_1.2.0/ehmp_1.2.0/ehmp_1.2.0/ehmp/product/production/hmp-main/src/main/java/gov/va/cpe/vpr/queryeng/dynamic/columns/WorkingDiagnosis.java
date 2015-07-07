package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Auxiliary;
import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.WorkingDiagnosis")
@Scope("prototype")
public class WorkingDiagnosis extends ViewDefDefColDef {

	public WorkingDiagnosis() {
		super(null);
	}

	public WorkingDiagnosis(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "Working Diagnosis";
		restEndpoint = "/patient/currentvisit/diagnosis";
	}

	@Override
	public String getViewdefCode() {
		return null;
	}

	@Override
	public String getFieldDataIndex() {
		return "diagnosis";
	}

	@Override
	public String getRenderClass() {
		return "diagnosis";
	}

	@Override
	public String getName() {
		return "Working Diagnosis";
	}

	@Override
	public String getDescription() {
		return "Display or enter diagnosis for the current inpatient stay. If the patient is not admitted to an inpatient location, this field is not editable.";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("diagnosis","string");
		return eo;
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Auxiliary.class.getSimpleName());
		return rslt;
	}

	@Override
	public Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
		Object pid = dtask.roe.get("pid");
        Encounter enc = dtask.patientService.getCurrentVisit(pid.toString());
        if (enc != null) {
            Auxiliary aux = dtask.patientService.getOnePatientAuxiliaryObject(pid.toString());
            Map<String, Map<String, Object>> dat = aux.getDomainAux();
            if(dat!=null) {
            	return dat.get(enc.getUid());
            }
        }
        Map<String, Object> rslt = new HashMap<String, Object>();
        rslt.put("diagnosis","<span class=\"text-muted\">No Current Visit</span>");
        rslt.put("editable",false);
        return rslt;
	}
}
