package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import java.util.List;

/**
 * Interface for a service to retrieve all VLER DAS data for a patient.
 */
public interface IVlerDasPatientService {

    public List<VistaDataChunk> fetchVlerDasPatientData(PatientIds patientIds);
}
