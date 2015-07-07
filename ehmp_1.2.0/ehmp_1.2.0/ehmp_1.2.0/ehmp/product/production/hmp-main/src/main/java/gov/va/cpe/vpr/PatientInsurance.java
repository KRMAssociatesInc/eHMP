package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 7/14/14
 * Time: 11:28 AM
 * To change this template use File | Settings | File Templates.
 */
public class PatientInsurance extends AbstractPOMObject {
    private PatientDemographics patient;

    public String getCompanyName() {
        return companyName;
    }

    public PointInTime getEffectiveDate() {
        return effectiveDate;
    }

    public PointInTime getExpirationDate() {
        return expirationDate;
    }

    public String getGroupNumber() {
        return groupNumber;
    }

    public String getId() {
        return id;
    }

    public String getPolicyHolder() {
        return policyHolder;
    }

    public String getPolicyType() {
        return policyType;
    }

    private String companyName;
    private PointInTime effectiveDate;
    private PointInTime expirationDate;
    private String groupNumber;
    private String id;
    private String policyHolder;
    private String policyType;

    public PatientInsurance() {
        super(null);
    }

    @JsonCreator
    public PatientInsurance(Map<String, Object> vals) {
        super(vals);
    }

    @JsonBackReference("patient-insurance")
    public PatientDemographics getPatient() {
        return patient;
    }

    public void setPatient(PatientDemographics patient) {
        this.patient = patient;
    }

    public String toString() {
        return companyName + " ("+policyType+")";
    }

}
