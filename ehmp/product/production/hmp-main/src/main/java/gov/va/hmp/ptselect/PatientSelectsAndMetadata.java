package gov.va.hmp.ptselect;

import org.springframework.data.domain.Page;

/**
 * Object that carries a page of {@link gov.va.hmp.ptselect.PatientSelect} objects plus metadata from VistA about the
 * source of the list. For CPRS Default lists, in particular, the metadata can affect the display (if the source is a
 * Combination list and is sorted by appointment time, display differently than if it is a Ward list, for example).
 */
public class PatientSelectsAndMetadata {
    private String defaultPatientListSourceName;
    private String defaultPatientListSourceType;
    private String defaultPatientListSourceSort;
    private Page<PatientSelect> patients;

    public PatientSelectsAndMetadata(String defaultPatientListSourceName, String defaultPatientListSourceType, String defaultPatientListSourceSort, Page<PatientSelect> patients) {
        this.defaultPatientListSourceName = defaultPatientListSourceName;
        this.defaultPatientListSourceType = defaultPatientListSourceType;
        this.defaultPatientListSourceSort = defaultPatientListSourceSort;

        this.patients = patients;
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

    public Page<PatientSelect> getPatients() {
        return patients;
    }
}
