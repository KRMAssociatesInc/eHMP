package us.vistacore.asm;

import org.apache.commons.lang.Validate;

import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandKey;
import com.netflix.hystrix.HystrixCommandProperties;
import com.netflix.hystrix.HystrixThreadPoolKey;
import com.netflix.hystrix.HystrixThreadPoolProperties;
import com.vistacowboy.jVista.VistaConnection;
import com.vistacowboy.jVista.VistaException;
import com.vistacowboy.jVista.VistaUser;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VistaRpcCommand extends HystrixCommand<String> {

    private static Logger LOGGER = LoggerFactory.getLogger(VistaRpcCommand.class);

    /**
     * Hystrix group and command key used for statistics, circuit-breaker, properties, etc.
     */
    public static final HystrixCommandGroupKey GROUP_KEY = HystrixCommandGroupKey.Factory.asKey("ehmp");
    public static final HystrixCommandKey COMMAND_KEY = HystrixCommandKey.Factory.asKey("authentication");
    public static final HystrixThreadPoolKey THREAD_KEY = HystrixThreadPoolKey.Factory.asKey("vista-pool");

    protected static final int TIMEOUT_MS = 90 * 1000;
    protected static final int MAX_THREADS = 10;
    protected static final int MAX_QUEUE_SIZE = 200;

    private final String vistaHost;
    private final int vistaPort;
    private final String command;
    private final String accessCode;
    private final String verifyCode;
    private final String context;

    public VistaRpcCommand(String command, String vistaHost, int vistaPort, String accessCode, String verifyCode, String context) {
        // instantiate Command and properties
        super(Setter.withGroupKey(GROUP_KEY)
                .andCommandKey(COMMAND_KEY)
                .andThreadPoolKey(THREAD_KEY)
                .andThreadPoolPropertiesDefaults(HystrixThreadPoolProperties.Setter().withCoreSize(MAX_THREADS).withMaxQueueSize(MAX_QUEUE_SIZE).withQueueSizeRejectionThreshold(MAX_QUEUE_SIZE))
                .andCommandPropertiesDefaults(HystrixCommandProperties.Setter()
                        .withCircuitBreakerEnabled(false)
                        .withFallbackEnabled(false)
                        .withRequestCacheEnabled(false)
                        .withRequestLogEnabled(false)
                        .withExecutionIsolationThreadTimeoutInMilliseconds(TIMEOUT_MS)
                        .withExecutionIsolationStrategy(HystrixCommandProperties.ExecutionIsolationStrategy.THREAD)));

        // Validation
        Validate.notNull(vistaHost, "vistaHost cannot be null.");
        Validate.notNull(command, "command cannot be null.");
        Validate.notNull(accessCode, "accessCode cannot be null.");
        Validate.notNull(verifyCode, "verifyCode cannot be null.");
        Validate.notNull(context, "context cannot be null.");

        this.vistaHost = vistaHost;
        this.vistaPort = vistaPort;
        this.command = command;
        this.accessCode = accessCode;
        this.verifyCode = verifyCode;
        this.context = context;
    }

    @Override
    protected String run() throws VistaException {

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        VistaConnection connection = new VistaConnection(vistaHost, vistaPort);

        VistaUser user = new VistaUser();

        try {
            connection.connect();
            LOGGER.info("TIME ELAPSED AFTER RPC CONNECT  = " + stopWatch.getTime());
            user.login(connection, accessCode, verifyCode, context);
            LOGGER.info("TIME ELAPSED AFTER RPC LOGIN  = " + stopWatch.getTime());
            return connection.exec(command);
        } finally {
            LOGGER.info("TIME ELAPSED AFTER RPC EXECUTE  = " + stopWatch.getTime());
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

}
