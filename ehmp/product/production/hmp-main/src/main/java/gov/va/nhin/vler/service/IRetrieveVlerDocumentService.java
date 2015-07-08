package gov.va.nhin.vler.service;

import gov.va.med.jmeadows.webservice.VlerDocument;

import java.util.List;
import java.util.concurrent.Future;

public interface IRetrieveVlerDocumentService {

    /**
     * Retrieve list of VLER document metadata.
     * @param vlerQuery vler query.
     * @return VLER doc query response.
     */
    public VLERDocQueryResponse retrieveVlerDocumentList(VlerQuery vlerQuery);

    /**
     * Asynchronously retrieve VLER document.
     *
     * @param vlerQuery vler query.
     * @return Result of asynchronous execution.
     */
    public Future<VLERDocRetrieveResponse> retrieveVlerDocument(VlerQuery vlerQuery);
}
