package gov.va.cpe.pt;

import gov.va.cpe.vpr.PatientChecks;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.SyncStatus;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Singleton service bean used to inject a {@link PatientContext} instance into other service beans.  This allows
 * clients to not have to reference {@link PatientContextHolder} directly.
 */
@Service("patientContext")
public class HmpPatientContext implements PatientContext {
    @Override
    public String getCurrentPatientPid() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentPatientPid();
    }

    @Override
    public PatientDemographics getCurrentPatient() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentPatient();
    }

    @Override
    public PatientChecks getCurrentPatientChecks() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentPatientChecks();
    }

    @Override
    public gov.va.cpe.vpr.PatientDemographicsAdditional getCurrentPatientAdditionalDemographics() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentPatientAdditionalDemographics();
    }

    @Override
    public void setCurrentPatientPid(String pid) {
        PatientContext context = PatientContextHolder.getContext();
        if (context != null) {
            context.setCurrentPatientPid(pid);
        }
    }

    @Override
    public void setCurrentPatient(PatientDemographics pt) {
        PatientContext context = PatientContextHolder.getContext();
        if (context != null) {
            context.setCurrentPatient(pt);
        }
    }

    @Override
    public Map<String, Object> getCurrentPatientLocation() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentPatientLocation();
    }

    @Override
    public SyncStatus getCurrentPatientSyncStatus() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentPatientSyncStatus();
    }

    @Override
    public Boolean isCurrentPatientInPatient() {
        PatientContext context = PatientContextHolder.getContext();
        if (context == null) return null;
        return context.isCurrentPatientInPatient();
    }
}
