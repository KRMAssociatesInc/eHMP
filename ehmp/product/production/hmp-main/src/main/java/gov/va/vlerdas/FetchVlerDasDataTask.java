package gov.va.vlerdas;

import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.vlerdas.service.IVlerDasService;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * Class to asynchronously execute a call to the VLER DAS webservices
 */
public class FetchVlerDasDataTask implements Callable<List<VistaDataChunk>> {

    private IVlerDasService service;
    private VlerDasQuery query;

    /**
     * Constructor
     * @param service the service that will make the webservice call
     * @param query the query parameters to pass to the service
     */
    public FetchVlerDasDataTask(IVlerDasService service, VlerDasQuery query) {
        this.service = service;
        this.query = query;
    }

    @Override
    public List<VistaDataChunk> call() throws Exception {
        if (service != null) {
            try {
                return service.fetchData(query);
            } catch (VlerDasException e) {
                return new ArrayList<VistaDataChunk>();
            }
        }
        return null;
    }
}
