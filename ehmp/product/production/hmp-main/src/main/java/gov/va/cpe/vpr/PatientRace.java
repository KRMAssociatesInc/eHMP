package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class PatientRace extends AbstractPOMObject{

	private Long id;
    private PatientDemographics patient;
    private String code;
    private String name;
    private String vuid;
    
    public PatientRace() {
    	super(null);
    }
    
    @JsonCreator
    public PatientRace(Map<String, Object> vals) {
    	super(vals);
    }

    public Long getId() {
		return id;
	}

    @JsonBackReference("patient-race")
	public PatientDemographics getPatient() {
		return patient;
	}

    void setPatient(PatientDemographics patient) {
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
}
