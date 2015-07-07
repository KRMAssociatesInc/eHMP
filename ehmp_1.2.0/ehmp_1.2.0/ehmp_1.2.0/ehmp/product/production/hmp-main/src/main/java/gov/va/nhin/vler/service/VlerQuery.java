package gov.va.nhin.vler.service;

import gov.va.cpe.idn.PatientIds;

public class VlerQuery {

    private PatientIds patientIds;
    private VLERDoc vlerDoc;

    public PatientIds getPatientIds() {
        return patientIds;
    }

    public void setPatientIds(PatientIds patientIds) {
        this.patientIds = patientIds;
    }

    public VLERDoc getVlerDoc() {
        return vlerDoc;
    }

    public void setVlerDoc(VLERDoc vlerDoc) {
        this.vlerDoc = vlerDoc;
    }
}
