package gov.va.hmp.ptselect;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.ArrayList;
import java.util.List;

public class VistaPatientSelectsAndMetadata {
    private String defaultPatientListSourceName;
    private String defaultPatientListSourceType;
    private String defaultPatientListSourceSort;
    private List<VistaPatientSelect> patients = new ArrayList<>();

    @JsonCreator
    public VistaPatientSelectsAndMetadata() {
    }

    public String getDefaultPatientListSourceName() {
        return defaultPatientListSourceName;
    }

    public String getDefaultPatientListSourceType() {
        return defaultPatientListSourceType;
    }

    public String getDefaultPatientListSourceSort() {
        return defaultPatientListSourceSort;
    }

    public List<VistaPatientSelect> getPatients() {
        return patients;
    }
}
