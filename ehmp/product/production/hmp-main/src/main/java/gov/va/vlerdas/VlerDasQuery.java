package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;

/**
 * Contains query parameters needed to query VLER DAS
 */
public class VlerDasQuery {

    private PatientIds patientIds;
    private VlerDasDomain domain;

    /**
     * Constructor
     * @param patientIds the patient's IDs
     * @param domain the domain to be queried (e.g. vitals)
     */
    public VlerDasQuery(PatientIds patientIds, VlerDasDomain domain) {
        this.patientIds = patientIds;
        this.domain = domain;
    }

    public void setPatientIds(PatientIds patientIds) {
        this.patientIds = patientIds;
    }

    public PatientIds getPatientIds() {
        return patientIds;
    }

    public void setDomain(VlerDasDomain domain) {
        this.domain = domain;
    }

    public VlerDasDomain getDomain() {
        return domain;
    }
}
