package gov.va.jmeadows.util.document.retrieve;

import com.netflix.hystrix.*;
import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.NoteImage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.ITEM_ID;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.validateQueryBean;

/**
 * Command retrieves DoD complex note in Rich text format (RTF).
 */
public class RetrieveDodDocumentCommand extends HystrixCommand<NoteImage> {

    private static final Logger logger = LoggerFactory.getLogger(RetrieveDodDocumentCommand.class);

    /**
     * Hystrix group, command, and thread key used for thread pool & statistics.
     */
    public static final HystrixCommandGroupKey GROUP_KEY = HystrixCommandGroupKey.Factory.asKey("ehmp");
    public static final HystrixCommandKey COMMAND_KEY = HystrixCommandKey.Factory.asKey("retrieveDoDDoc");
    public static final HystrixThreadPoolKey THREAD_KEY = HystrixThreadPoolKey.Factory.asKey("retrieveDoDDoc-pool");

    /**
     * Hystrix configurations.
     */
    private static final int MAX_QUEUE = Integer.MAX_VALUE;
    private static final int RETRY_ATTEMPTS = 1;

    private JMeadowsData jMeadowsClient;
    private JMeadowsQuery jMeadowsQuery;
    private Integer maxThreads;
    private Integer timeoutMS;
    private int numRetries;

    /**
     * Constructs retrieve DoD document command instance.
     *
     * @param jMeadowsClient jMeadows client instance.
     * @param jMeadowsQuery  jMeadows query bean.
     * @param maxThreads     Size of hystrix command thread pool.
     * @param timeoutMS      Hystrix command timeout.
     */
    public RetrieveDodDocumentCommand(JMeadowsData jMeadowsClient, JMeadowsQuery jMeadowsQuery,
                                      Integer maxThreads, Integer timeoutMS) {
        this(jMeadowsClient, jMeadowsQuery, maxThreads, timeoutMS, RETRY_ATTEMPTS);
    }

    /**
     * Constructs retrieve DoD document command instance.
     *
     * @param jMeadowsClient jMeadows client instance.
     * @param jMeadowsQuery  jMeadows query bean.
     * @param maxThreads     Size of hystrix command thread pool.
     * @param timeoutMS      Hystrix command timeout.
     * @param numRetries     Utilized by fallback method - the number of remaining retries.
     */
    public RetrieveDodDocumentCommand(JMeadowsData jMeadowsClient, JMeadowsQuery jMeadowsQuery,
                                      Integer maxThreads, Integer timeoutMS, Integer numRetries) {

        //pass Hystrix command configurations
        super(HystrixCommand.Setter.withGroupKey(GROUP_KEY)
                .andCommandKey(COMMAND_KEY)
                .andThreadPoolKey(THREAD_KEY)
                .andThreadPoolPropertiesDefaults(
                        HystrixThreadPoolProperties.Setter()
                                .withCoreSize(maxThreads)
                                .withQueueSizeRejectionThreshold(MAX_QUEUE)
                                .withMaxQueueSize(MAX_QUEUE))
                .andCommandPropertiesDefaults(
                        HystrixCommandProperties.Setter()
                                .withCircuitBreakerEnabled(false)
                                .withFallbackEnabled(true)
                                .withRequestCacheEnabled(false)
                                .withRequestLogEnabled(false)
                                .withExecutionIsolationThreadTimeoutInMilliseconds(timeoutMS)
                                .withExecutionIsolationStrategy(HystrixCommandProperties.ExecutionIsolationStrategy.THREAD)
                ));

        if (jMeadowsClient == null)
            throw new IllegalArgumentException("jMeadowsClient is null");

        validateQueryBean(jMeadowsQuery, USER, ITEM_ID);

        this.jMeadowsClient = jMeadowsClient;
        this.jMeadowsQuery = jMeadowsQuery;
        this.maxThreads = maxThreads;
        this.timeoutMS = timeoutMS;
        this.numRetries = numRetries;
    }


    /**
     * Implement this method with code to be executed when {@link #execute()} or {@link #queue()} are invoked.
     *
     * @return R response type
     * @throws Exception if command execution fails
     */
    @Override
    protected NoteImage run() throws Exception {
        logger.debug("calling jMeadowsClient.getBHIENoteImage begin");
        return jMeadowsClient.getBHIENoteImage(jMeadowsQuery);
    }

    /**
     * Handles document retrieval failure logic.
     * <p/>
     * Will attempt to retry document retrieval.
     *
     * @return HTML document file.
     */
    @Override
    public NoteImage getFallback() {
        if (numRetries > 0) {
            logger.warn("Fallback triggered for command: " + this.toString());
            return new RetrieveDodDocumentCommand(this.jMeadowsClient, this.jMeadowsQuery,
                    this.maxThreads, this.timeoutMS, this.numRetries - 1).execute();
        } else {
            throw new HystrixRuntimeException(HystrixRuntimeException.FailureType.COMMAND_EXCEPTION, this.getClass(), "retry limit reached; fallback cancelled.", null, this.getFailedExecutionException());
        }
    }
}
