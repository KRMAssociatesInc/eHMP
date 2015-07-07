package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.Map;

public class PatientExposure extends AbstractPOMObject{
	private PatientDemographics patient;
    private String code;
    private String name;
    private String vuid;

    public PatientExposure() {
    	super(null);
    }
    
    @JsonCreator
    public PatientExposure(Map<String, Object> vals) {
    	super(vals);
    }

    @JsonBackReference("patient-exposure")
	public PatientDemographics getPatient() {
		return patient;
	}

	public void setPatient(PatientDemographics patient) {
		this.patient = patient;
	}

	public String getCode() {
		return code;
	}

	public String getName() {
		return name;
	}

	public String getVuid() {
		return vuid;
	}

	@Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return this.uid + " " + this.name;
	}
}
