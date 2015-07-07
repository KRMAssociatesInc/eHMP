package gov.va.cpe.pt;

import gov.va.cpe.vpr.PatientChecks;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientDemographicsAdditional;

public class VistaPatientContextInfo {

    private PatientDemographics patientDemographics;
    private PatientDemographicsAdditional additionalPatientDemographics;
    private PatientChecks patientChecks;

    public VistaPatientContextInfo(PatientDemographics patientDemographics, PatientDemographicsAdditional additionalPatientDemographics, PatientChecks patientChecks) {
        this.patientDemographics = patientDemographics;
        this.additionalPatientDemographics = additionalPatientDemographics;
        this.patientChecks = patientChecks;
    }

    public PatientDemographics getPatientDemographics() {
        return patientDemographics;
    }

    public PatientDemographicsAdditional getAdditionalPatientDemographics() {
        return additionalPatientDemographics;
    }

    public PatientChecks getPatientChecks() {
        return patientChecks;
    }
}
