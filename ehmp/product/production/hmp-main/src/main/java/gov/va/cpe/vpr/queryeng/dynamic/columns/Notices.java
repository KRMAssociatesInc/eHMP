package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * CRUFT
 * @author vhaislchandj
 *
 */
@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.Notices")
@Scope("prototype")
public class Notices extends ViewDefDefColDef {

	public Notices() {
		super(null);
	}

	public Notices(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "Postings/Flags";
		restEndpoint = "/patient/flag";
	}

	@Override
	public String getViewdefCode() {
		return null;
	}

	@Override
	public String getRenderClass() {
		return "notices";
	}

	@Override
	public String getName() {
		return "Postings/Flags";
	}

	@Override
	public String getDescription() {
		return "Patient postings / flags";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("notices","notices");
		return eo;
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(PatientDemographics.class.getSimpleName());
		rslt.add(Document.class.getSimpleName());
		return rslt;
	}

	@Override
	public Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
		Object pid = dtask.roe.get("pid");
        Map<String, Object> rslt = new HashMap<String, Object>();
        rslt.put("data",dtask.patientService.getPatientFlags(pid.toString()));
        return rslt;
	}
}
