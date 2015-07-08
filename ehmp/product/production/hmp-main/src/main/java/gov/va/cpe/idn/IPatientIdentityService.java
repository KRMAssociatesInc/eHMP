package gov.va.cpe.idn;

/**
 * Patient Identity Correlation Service Interface.
 */
public interface IPatientIdentityService
{
    /**
     * Retrieves all known patient identifiers.
     *
     * @param vistaId The vista site hash code.
     * @param pid Patient Identifier (ICN, SITE:DFN)
     * @return PatientIds instance which contains all known patient identifiers.
     */
    public PatientIds getPatientIdentifiers(String vistaId, String pid);
}
