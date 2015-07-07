package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class PatientFacility extends AbstractPOMObject implements Comparable {

	private PatientDemographics patient;
    private String code;
    private String name;
    private String systemId;
    private String localPatientId;
    private PointInTime earliestDate; // TODO look into modeling this as an IntervalOfTime
    private PointInTime latestDate;
    private boolean homeSite;
//    DateTimeZone timeZone
    
    public PatientFacility() {
    	super(null);
    }

    @JsonCreator    
    public PatientFacility(Map<String, Object> vals) {
    	super(vals);
    }
    
	public int compareTo(Object o) {
        return code.compareTo(((PatientFacility)o).getCode());
    }

    @JsonBackReference("patient-facility")
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

	public String getSystemId() {
		return systemId;
	}

	public String getLocalPatientId() {
		return localPatientId;
	}

	public PointInTime getEarliestDate() {
		return earliestDate;
	}

	public PointInTime getLatestDate() {
		return latestDate;
	}

	public boolean isHomeSite() {
		return homeSite;
	}

	public String toString() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PatientFacility that = (PatientFacility) o;

        if (code != null ? !code.equals(that.code) : that.code != null) return false;
        if (systemId != null ? !systemId.equals(that.systemId) : that.systemId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = code != null ? code.hashCode() : 0;
        result = 31 * result + (systemId != null ? systemId.hashCode() : 0);
        return result;
    }
}
