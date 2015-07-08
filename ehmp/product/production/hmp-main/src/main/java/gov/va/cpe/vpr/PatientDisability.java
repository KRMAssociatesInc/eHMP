package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class PatientDisability extends AbstractPOMObject{

	private PatientDemographics patient;
	private String name;
	private boolean serviceConnected;
	private int disPercent;

   public PatientDisability() {
		super(null);
	}
	
	@JsonCreator
	public PatientDisability(Map<String, Object> vals) {
		super(vals);
	}

    @JsonBackReference("patient-disability")
    public PatientDemographics getPatient() {
        return patient;
    }

    void setPatient(PatientDemographics patient) {
        this.patient = patient;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isServiceConnected() {
        return serviceConnected;
    }

    public void setServiceConnected(boolean serviceConnected) {
        this.serviceConnected = serviceConnected;
    }

    public int getDisPercent() {
        return disPercent;
    }

    public void setDisPercent(int disPercent) {
        this.disPercent = disPercent;
    }
}
