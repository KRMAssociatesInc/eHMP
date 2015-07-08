package gov.va.hmp.app;

import gov.va.hmp.module.PatientDataDisplayType;

public class ComponentDescriptor {

    private String id;
    private String name;
    private PatientDataDisplayType patientDataDisplayType;
    private String description;

    public ComponentDescriptor(String id, String name, PatientDataDisplayType patientDataDisplayType, String description) {
        this.id = id;
        this.name = name;
        this.patientDataDisplayType = patientDataDisplayType;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public PatientDataDisplayType getPatientDataDisplayType() {
        return patientDataDisplayType;
    }

    public String getDescription() {
        return description;
    }
}
