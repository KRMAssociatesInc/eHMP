package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.Auxiliary;
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
@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.PatientLocation")
@Scope("prototype")
public class PatientLocation extends ViewDefDefColDef {

	public PatientLocation() {
		super(null);
	}

	public PatientLocation(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "Patient Location";
		restEndpoint = "/patient/location";
	}

	@Override
	public String getViewdefCode() {
		return null;
	}

	@Override
	public String getRenderClass() {
		return "location";
	}

	@Override
	public String getName() {
		return "Patient Location";
	}

	@Override
	public String getDescription() {
		return "Enter current patient location. This will stay with the patient record and will be shown everywhere this column is included.";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("location","location");
		return eo;
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Auxiliary.class.getSimpleName());
		return rslt;
	}

	@Override
	public Map<String, Object> runDeferred(DeferredBoardColumnTask dtask) {
		Auxiliary aux = dtask.patientService.getOnePatientAuxiliaryObject(dtask.roe.get("pid").toString());
		if(aux!=null) {
			gov.va.cpe.vpr.PointOfCare pock = aux.getLocation();
			return pock!=null?pock.getData():new HashMap<String, Object>();
		}
		return new HashMap<String, Object>();
	}
}
