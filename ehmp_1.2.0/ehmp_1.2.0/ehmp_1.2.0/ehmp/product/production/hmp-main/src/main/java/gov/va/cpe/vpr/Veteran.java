package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Veteran extends AbstractPOMObject{

	private String legacy;
	private PatientDemographics patient;
	private Integer lrdfn;
	private String serviceConnected; // TODO: verify this is a string?
	private String serviceConnectionPercent; // TODO: verify this is a string?
    private List<ServiceConnectedCondition> scConditions;

	// TODO Decide if we are keeping patient to object, reference chain error
	
	public Veteran() {
		super(null);
	}
	
    @JsonCreator
	public Veteran(Map<String, Object> vals) {
		super(vals);
	}

	public String getLegacy() {
		return legacy;
	}

	public void setLegacy(String legacy) {
		this.legacy = legacy;
	}

    //@JsonBackReference("patient-veteran")
	public PatientDemographics getPatient() {
		return patient;
	}

	public void setPatient(PatientDemographics patient) {
		this.patient = patient;
	}

	public Integer getLrdfn() {
		return lrdfn;
	}

	public void setLrdfn(Integer lrdfn) {
		this.lrdfn = lrdfn;
	}

	public String getServiceConnected() {
		return serviceConnected;
	}

	public void setServiceConnected(String serviceConnected) {
		this.serviceConnected = serviceConnected;
	}

	public String getServiceConnectionPercent() {
		return serviceConnectionPercent;
	}

	public void setServiceConnectionPercent(String serviceConnectionPercent) {
		this.serviceConnectionPercent = serviceConnectionPercent;
	}

    public List<ServiceConnectedCondition> getScConditions() {
        return scConditions;
    }

    public void setScConditions(List<ServiceConnectedCondition> scConditions) {
        this.scConditions = scConditions;
    }

    public void addToScConditions(ServiceConnectedCondition scCondition) {
       if ( this.scConditions == null) {
           this.scConditions = new ArrayList<>();
       }
       this.scConditions.add(scCondition);
    }

// static constraints = {
	// legacy(nullable:true)
	// lrdfn(nullable:true)
	// serviceConnected(nullable:true)
	// serviceConnectionPercent(nullable:true)
	// }
}
