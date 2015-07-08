package gov.va.cpe.idn;

import org.springframework.stereotype.Service;

/**
 * Master Veteran Index patient identity service implementation.
 */
@Service("mviIdentityService")
public class MVIIdentityService implements IPatientIdentityService
{

    /**
     * Retrieves all known patient identifiers.
     *
     * @param pid    Patient Identifier (ICN, SITE:DFN)
     * @return PatientIds instance which contains all known patient identifiers.
     */
    @Override
    public PatientIds getPatientIdentifiers(String vistaId, String pid) {
        throw new UnsupportedOperationException("Operation not yet implemented.");
    }
}
