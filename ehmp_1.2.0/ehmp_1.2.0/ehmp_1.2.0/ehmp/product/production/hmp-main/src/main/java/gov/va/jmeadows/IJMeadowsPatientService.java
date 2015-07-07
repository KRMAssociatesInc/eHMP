package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import java.util.List;

public interface IJMeadowsPatientService {
    /**
     * Retrieves DoD clinical data from jMeadows.
     * @param patientIds Patient identifiers container.
     * @return List of patient DoD clinical data.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    public List<VistaDataChunk> fetchDodPatientData(PatientIds patientIds) throws IllegalArgumentException;
}
