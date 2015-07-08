package gov.va.cpe.pt;

import gov.va.cpe.vpr.PatientChecks;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientDemographicsAdditional;
import gov.va.cpe.vpr.sync.SyncStatus;

import java.util.Map;

public interface PatientContext {
    String getCurrentPatientPid();
    PatientDemographics getCurrentPatient();
    PatientChecks getCurrentPatientChecks();
    PatientDemographicsAdditional getCurrentPatientAdditionalDemographics();
    Map<String, Object> getCurrentPatientLocation();
    SyncStatus getCurrentPatientSyncStatus();
    Boolean isCurrentPatientInPatient();

    void setCurrentPatientPid(String pid);
    void setCurrentPatient(PatientDemographics pt);
}
