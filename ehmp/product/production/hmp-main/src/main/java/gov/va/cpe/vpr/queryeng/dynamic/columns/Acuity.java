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

/**
 * 
 * @author vhaislchandj
 *
 */
@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.Acuity")
@Scope("prototype")
public class Acuity extends ViewDefDefColDef {

	public Acuity() {
		super(null);
	}

	public Acuity(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "ED Acuity";
		restEndpoint = "/patient/acuity";
	}

	@Override
	public String getViewdefCode() {
		return null;
	}

	@Override
	public String getRenderClass() {
		return "acuity";
	}

	@Override
	public String getName() {
		return "ED Acuity";
	}

	@Override
	public String getDescription() {
		return "Enter patient acuity (for the current visit.)";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("acuity","acuity");
		return eo;
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Auxiliary.class.getSimpleName()); // Patient Auxiliary gen. purpose object
		return rslt;
	}
	
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
        rslt.put("acuity",null);
        rslt.put("editable",false);
        return rslt;
	}
}
