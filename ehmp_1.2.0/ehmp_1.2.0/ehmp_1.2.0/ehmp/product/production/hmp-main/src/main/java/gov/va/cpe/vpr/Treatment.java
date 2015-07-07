package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class Treatment extends AbstractPatientObject implements IPatientObject {


    private static final String TREATMENT = "Treatment";

    private String facilityCode;
    private String facilityName;
    private String description;
    private PointInTime dueDate;

    public Treatment() {
        super(null);
    }

    @JsonCreator
    public Treatment(Map<String, Object> vals) {
        super(vals);
    }

    public String getDescription() {
        return description;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getKind() {
        // we could potentially move this kind of logic to a "KindService(s)" if that is less smelly
        return TREATMENT;
    }

    public PointInTime getDueDate() {
        // we could potentially move this kind of logic to a "KindService(s)" if that is less smelly
        return dueDate;
    }

}
