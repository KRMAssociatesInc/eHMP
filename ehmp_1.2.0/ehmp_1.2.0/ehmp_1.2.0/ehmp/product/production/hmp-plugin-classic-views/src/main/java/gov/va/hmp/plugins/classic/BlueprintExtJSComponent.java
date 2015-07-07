package gov.va.hmp.plugins.classic;

import gov.va.hmp.module.PatientDataDisplayType;
import gov.va.hmp.module.ExtJSComponent;

public class BlueprintExtJSComponent implements ExtJSComponent {
    private String className;
    private PatientDataDisplayType patientDataDisplayType;

    public BlueprintExtJSComponent(String className, PatientDataDisplayType patientDataDisplayType) {
        this.className = className;
        this.patientDataDisplayType = patientDataDisplayType;
    }

    @Override
    public String getClassName() {
        return className;
    }

    @Override
    public PatientDataDisplayType getPatientDataDisplayType() {
        return patientDataDisplayType;
    }
}
