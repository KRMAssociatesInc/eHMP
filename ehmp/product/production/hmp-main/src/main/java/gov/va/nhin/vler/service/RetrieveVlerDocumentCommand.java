package gov.va.nhin.vler.service;


import com.netflix.hystrix.*;
import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.hhs.fha.nhinc.common.nhinccommonentity.RespondingGatewayCrossGatewayRetrieveRequestType;
import gov.hhs.fha.nhinc.entitydocretrieve.EntityDocRetrievePortType;
import ihe.iti.xds_b._2007.RetrieveDocumentSetRequestType;
import ihe.iti.xds_b._2007.RetrieveDocumentSetResponseType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static gov.va.nhin.vler.service.util.VlerDocumentServiceUtil.generateAssertion;

public class RetrieveVlerDocumentCommand extends HystrixCommand<VLERDocRetrieveResponse> {

    private static final Logger logger = LoggerFactory.getLogger(RetrieveVlerDocumentCommand.class);

    /**
     * Hystrix group, command, and thread key used for thread pool & statistics.
     */
    public static final HystrixCommandGroupKey GROUP_KEY = HystrixCommandGroupKey.Factory.asKey("ehmp");
    public static final HystrixCommandKey COMMAND_KEY = HystrixCommandKey.Factory.asKey("retrieveVlerDoc");
    public static final HystrixThreadPoolKey THREAD_KEY = HystrixThreadPoolKey.Factory.asKey("retrieveVlerDoc-pool");

    /**
     * Hystrix configurations.
     */
    private static final int MAX_QUEUE = Integer.MAX_VALUE;
    private static final int RETRY_ATTEMPTS = 1;

    private EntityDocRetrievePortType entityDocRetrieve;
    private VlerQuery vlerQuery;
    private NhinAdapterCfg nhinAdapterCfg;
    private int numRetries;

    /**
     * Constructs retrieve VLER document command instance.
     *
     * @param entityDocRetrieve Vler doc retrieve client instance.
     * @param vlerQuery VLER document query.
     * @param nhinAdapterCfg NHINAdapter Configuration
     */
    public RetrieveVlerDocumentCommand(EntityDocRetrievePortType entityDocRetrieve, VlerQuery vlerQuery,
                                  NhinAdapterCfg nhinAdapterCfg) {
        this(entityDocRetrieve, vlerQuery, nhinAdapterCfg, RETRY_ATTEMPTS);
    }

    /**
     * Constructs retrieve VLER document command instance.
     *
     * @param entityDocRetrieve vler doc retrieve client instance.
     * @param vlerQuery VLER document query.
     * @param nhinAdapterCfg NHINAdapter Config
     * @param numRetries     Utilized by fallback method - the number of remaining retries.
     */
    public RetrieveVlerDocumentCommand(EntityDocRetrievePortType entityDocRetrieve, VlerQuery vlerQuery,
                                  NhinAdapterCfg nhinAdapterCfg, Integer numRetries) {

        //pass Hystrix command configurations
        super(Setter.withGroupKey(GROUP_KEY)
                .andCommandKey(COMMAND_KEY)
                .andThreadPoolKey(THREAD_KEY)
                .andThreadPoolPropertiesDefaults(
                        HystrixThreadPoolProperties.Setter()
                                .withCoreSize(nhinAdapterCfg.getMaxThreads())
                                .withQueueSizeRejectionThreshold(MAX_QUEUE)
                                .withMaxQueueSize(MAX_QUEUE))
                .andCommandPropertiesDefaults(
                        HystrixCommandProperties.Setter()
                                .withCircuitBreakerEnabled(false)
                                .withFallbackEnabled(true)
                                .withRequestCacheEnabled(false)
                                .withRequestLogEnabled(false)
                                .withExecutionIsolationThreadTimeoutInMilliseconds(nhinAdapterCfg.getTimeoutMS())
                                .withExecutionIsolationStrategy(HystrixCommandProperties.ExecutionIsolationStrategy.THREAD)
                ));

        if (entityDocRetrieve == null)
            throw new IllegalArgumentException("entityDocRetrieve is null");

        if (vlerQuery == null)
            throw new IllegalArgumentException("vlerQuery is null");

        if (vlerQuery.getVlerDoc() == null)
            throw new IllegalArgumentException("vlerQuery.vlerDocument is null");


        this.entityDocRetrieve = entityDocRetrieve;
        this.vlerQuery = vlerQuery;
        this.nhinAdapterCfg = nhinAdapterCfg;
        this.numRetries = numRetries;
    }

    /**
     * Implement this method with code to be executed when {@link #execute()} or {@link #queue()} are invoked.
     *
     * @return VLER doc query retrieve response
     * @throws Exception if command execution fails
     */
    @Override
    protected VLERDocRetrieveResponse run() throws Exception {
        logger.debug("calling entityDocRetrieve.respondingGatewayCrossGatewayRetrieve");

        RespondingGatewayCrossGatewayRetrieveRequestType request = new RespondingGatewayCrossGatewayRetrieveRequestType();
        RetrieveDocumentSetRequestType srt = new RetrieveDocumentSetRequestType();

        RetrieveDocumentSetRequestType.DocumentRequest dr = new RetrieveDocumentSetRequestType.DocumentRequest();
        VLERDoc vDoc = vlerQuery.getVlerDoc();
        dr.setDocumentUniqueId(vDoc.getDocumentUniqueId());
        dr.setHomeCommunityId(vDoc.getHomeCommunityId());
        dr.setRepositoryUniqueId(vDoc.getRepositoryUniqueId());

        srt.getDocumentRequest().add(dr);

        request.setAssertion(
                generateAssertion(vlerQuery.getPatientIds().getIcn(),
                    nhinAdapterCfg.getSystemUserName(),
                    nhinAdapterCfg.getSystemSiteCode()));

        request.setRetrieveDocumentSetRequest(srt);

        RetrieveDocumentSetResponseType result = entityDocRetrieve.respondingGatewayCrossGatewayRetrieve(request);
        if (result != null && result.getDocumentResponse() != null) {
            RetrieveDocumentSetResponseType.DocumentResponse doc = result.getDocumentResponse().get(0);
            vDoc.setDocument(doc.getDocument());
            vDoc.setMimeType(doc.getMimeType());
        }

        VLERDocRetrieveResponse vlerDocRetrieveResponse = new VLERDocRetrieveResponse();
        vlerDocRetrieveResponse.setVlerDoc(vDoc);

        return vlerDocRetrieveResponse;
    }

    /**
     * Handles document retrieval failure logic.
     * <p/>
     * Will attempt to retry document retrieval.
     *
     * @return HTML document file.
     */
    @Override
    public VLERDocRetrieveResponse getFallback() {
        if (numRetries > 0) {
            logger.warn("Fallback triggered for command: " + this.toString());
            return new RetrieveVlerDocumentCommand(this.entityDocRetrieve, this.vlerQuery,
                    this.nhinAdapterCfg, this.numRetries - 1).execute();
        } else {
            throw new HystrixRuntimeException(HystrixRuntimeException.FailureType.COMMAND_EXCEPTION, this.getClass(), "retry limit reached; fallback cancelled.", null, this.getFailedExecutionException());
        }
    }
}
