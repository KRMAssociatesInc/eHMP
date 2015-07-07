package gov.va.nhin.vler.service;


import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import java.util.List;

public interface IVlerService
{
    /**
     * Retrieve VLER data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param patientIds patient identifiers (ICN is required)
     * @return The VistaDataChunk list that contains the VLER data.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    public List<VistaDataChunk> fetchVlerData(PatientIds patientIds);
}
