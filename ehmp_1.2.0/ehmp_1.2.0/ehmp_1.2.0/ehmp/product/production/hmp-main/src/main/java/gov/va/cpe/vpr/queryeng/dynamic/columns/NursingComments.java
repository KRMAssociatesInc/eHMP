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
 * @author vhaislchandj
 */
@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.NursingComments")
@Scope("prototype")
public class NursingComments extends ViewDefDefColDef {

	public NursingComments() {
		super(null);
	}

	public NursingComments(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "Comments This Visit";
		restEndpoint = "/patient/currentvisit/comments";
	}

	@Override
	public String getViewdefCode() {
		return null;
	}
	
	@Override
	public String getFieldDataIndex() {
		return "comments";
	}
	
	@Override
	public String getRenderClass() {
		return "currentcomments";
	}

	@Override
	public String getName() {
		return "Comments This Visit";
	}
	
	public boolean getTitleEditable() {
		return false;
	}

	@Override
	public String getDescription() {
		return "Display or enter visit-related comments. These are stored with the current (checked-in) visit. If no current visit exists, this field is not editable.";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("comments","currentcomments");
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
        Map<String, Object> rslt = new HashMap<String, Object>();
        Encounter enc = dtask.patientService.getCurrentVisit(pid.toString());
        if (enc != null) {
            Auxiliary aux = dtask.patientService.getOnePatientAuxiliaryObject(pid.toString());
            Map<String, Map<String, Object>> dat = aux.getDomainAux();
            if(dat!=null) {
            	rslt = dat.get(enc.getUid());
            } else {
                rslt.put("comments","");
                rslt.put("editable",true);
            }
        } else {
            rslt.put("comments",null);
            rslt.put("editable",false);
        }
        return rslt;
	}
}
