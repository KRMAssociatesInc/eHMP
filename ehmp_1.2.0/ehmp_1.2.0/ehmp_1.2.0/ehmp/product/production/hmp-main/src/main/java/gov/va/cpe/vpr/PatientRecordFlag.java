package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class PatientRecordFlag extends AbstractPOMObject {

    private String approved;
    @JsonProperty("assignTS")
    private PointInTime assigned;
    private String assignmentStatus;
    private String category;
    private String name;
    @JsonProperty("nextReviewDT")
    private PointInTime nextReviewDate;
    private String originatingSite;
    private String ownerSite;
    private String text;
    private String type;
    private PatientDemographics patient;


    public PatientRecordFlag() {
    }

    @JsonBackReference("patient-record-flag")
    public PatientDemographics getPatient() {
        return patient;
    }

    public void setPatient(PatientDemographics patient) {
        this.patient = patient;
    }

    public PatientRecordFlag(Map<String, Object> vals) {
        super(vals);
    }

    public String getApproved() {
        return approved;
    }

    public PointInTime getAssigned() {
        return assigned;
    }

    public String getAssignmentStatus() {
        return assignmentStatus;
    }

    public String getCategory() {
        return category;
    }

    public String getName() {
        return name;
    }

    public PointInTime getNextReviewDate() {
        return nextReviewDate;
    }

    public String getOriginatingSite() {
        return originatingSite;
    }

    public String getOwnerSite() {
        return ownerSite;
    }

    public String getText() {
        return text;
    }

    public String getType() {
        return type;
    }
}
