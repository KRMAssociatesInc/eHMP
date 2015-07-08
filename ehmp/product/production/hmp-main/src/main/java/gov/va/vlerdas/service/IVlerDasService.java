package gov.va.vlerdas.service;

import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.vlerdas.VlerDasConfiguration;
import gov.va.vlerdas.VlerDasException;
import gov.va.vlerdas.VlerDasQuery;

import java.util.List;

/**
 * Interface for VLER DAS client data-fetch servicesxw
 */
public interface IVlerDasService {

    /**
     *
     * @param query the query parameters to be used when calling the VLER DAS services
     * @return
     * @throws VlerDasException
     */
    public List<VistaDataChunk> fetchData(VlerDasQuery query) throws VlerDasException;
}
