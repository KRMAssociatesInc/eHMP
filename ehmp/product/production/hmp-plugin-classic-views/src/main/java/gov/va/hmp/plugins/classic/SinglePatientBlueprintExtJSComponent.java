package gov.va.hmp.plugins.classic;

import gov.va.hmp.module.PatientDataDisplayType;

public class SinglePatientBlueprintExtJSComponent extends BlueprintExtJSComponent {
    public SinglePatientBlueprintExtJSComponent(String className) {
        super(className, PatientDataDisplayType.SINGLE);
    }
}
