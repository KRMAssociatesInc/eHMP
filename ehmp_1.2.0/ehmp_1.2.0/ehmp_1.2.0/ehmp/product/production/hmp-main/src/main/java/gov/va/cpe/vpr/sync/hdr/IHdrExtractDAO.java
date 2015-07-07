package gov.va.cpe.vpr.sync.hdr;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;

import java.util.List;

/**
 * API for fetching patient data from HDR.
 */
public interface IHdrExtractDAO {
    List<VistaDataChunk> fetchHdrData(String vistaId, String division, PatientDemographics pt, String domain) throws Exception;
}
