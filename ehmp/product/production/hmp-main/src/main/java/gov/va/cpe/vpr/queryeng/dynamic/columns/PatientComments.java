package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Auxiliary;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Map;

/**
 * @author vhaislchandj
 *
 */
@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.PatientComments")
@Scope("prototype")
public class PatientComments extends ViewDefDefColDef {

	public PatientComments() {
		super(null);
	}

	public PatientComments(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "Patient Preferences";
		restEndpoint = "/patient/comments";
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
		return "comments";
	}

	@Override
	public String getName() {
		return "Patient Preferences";
	}

	@Override
	public String getDescription() {
		return "Enter patient-related comments. These stay with the patient record and will be shown everywhere this column is included.";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("comments","comments");
		return eo;
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Auxiliary.class.getSimpleName());
		return rslt;
	}

	@Override
	public Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
		return dtask.patientService.getOnePatientAuxiliaryObject(dtask.roe.get("pid").toString()).getData();
	}
}
