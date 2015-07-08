package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: VHAISLLEES
 * Date: 12/11/13
 * Time: 2:15 PM
 * To change this template use File | Settings | File Templates.
 */
public class ServiceConnectedCondition extends AbstractPOMObject {

    private Long id;
    private Long version;
    private String name;
    private String scPercent;
    private PatientDemographics patient;

    public ServiceConnectedCondition() {
        super(null);
    }

    @JsonCreator
    public ServiceConnectedCondition(Map<String, Object> vals) {
        super(vals);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScPercent() {
        return scPercent;
    }

    public void setScPercent(String scPercent) {
        this.scPercent = scPercent;
    }

    @JsonBackReference("patient-scCondition")
    public PatientDemographics getPatient() {
        return patient;
    }

    public void setPatient(PatientDemographics patient) {
        this.patient = patient;
    }
}
