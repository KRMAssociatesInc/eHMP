package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class PatientMaritalStatus extends AbstractPOMObject{

	private PatientDemographics patient;
    private String code;
    private String name;
    private PointInTime fromDate;  // TODO: maybe model from/through dates as IntervalOfTime?
    private PointInTime thruDate;
    
    public PatientMaritalStatus() {
    	super(null);
    }
    
    @JsonCreator
    public PatientMaritalStatus(Map<String, Object> vals) {
    	super(vals);
    }

    @JsonBackReference("patient-marital-status")
	public PatientDemographics getPatient() {
		return patient;
	}

	void setPatient(PatientDemographics patient) {
		this.patient = patient;
	}

	public PointInTime getFromDate() {
		return fromDate;
	}

	public PointInTime getThruDate() {
		return thruDate;
	}

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String toString() {
        return getName();
    }
}
