package gov.va.jmeadows.util.document.convert;

import com.netflix.hystrix.*;
import com.netflix.hystrix.exception.HystrixRuntimeException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ConvertCDA2HTMLCommand extends HystrixCommand<File> {
    private static final Logger logger = LoggerFactory.getLogger(ConvertCDA2HTMLCommand.class);

    /**
     * Hystrix group, command, and thread key used for thread pool & statistics.
     */
    public static final HystrixCommandGroupKey GROUP_KEY = HystrixCommandGroupKey.Factory.asKey("ehmp");
    public static final HystrixCommandKey COMMAND_KEY = HystrixCommandKey.Factory.asKey("convertCDA");
    public static final HystrixThreadPoolKey THREAD_KEY = HystrixThreadPoolKey.Factory.asKey("convertCDA-pool");

    private StreamSource cdaXlsSource;

    private TransformerFactory transformerFactory;

    /**
     * Hystrix configurations.
     */
    private static final int MAX_QUEUE = Integer.MAX_VALUE;

    /**
     * Constructor-passed members and derived members
     */
    private String eventId;
    private String cda;
    private File outputDir;
    private Integer maxThreads;
    private Integer timeoutMS;

    /**
     * Constructs Document conversion command.
     *
     * @param eventId Event ID associated with the CDA note.
     * @param cda CDA Note String.
     * @param cdaXlsSource CDA XLS transformation source.
     * @param outputDir    Output directory where converted file will be saved.
     * @param maxThreads   Size of hystrix command thread pool.
     * @param timeoutMS    Hystrix command timeout.
     */
    public ConvertCDA2HTMLCommand(String eventId, String cda, StreamSource cdaXlsSource, File outputDir, Integer maxThreads, Integer timeoutMS) {

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

        validateConstructorArgs(eventId, cda, cdaXlsSource, outputDir, maxThreads, timeoutMS);

        this.cdaXlsSource = cdaXlsSource;
        this.transformerFactory = TransformerFactory.newInstance();

        this.eventId = eventId;
        this.cda = cda;
        this.outputDir = outputDir;

        this.maxThreads = maxThreads;
        this.timeoutMS = timeoutMS;
    }

    /**
     * Validates constructor parameters.
     *
     * @param eventId Event ID associated with the CDA note.
     * @param cda CDA Note String.
     * @param cdaXlsSource CDA XLS transformation source.
     * @param outputDir    Output directory where converted file will be saved.
     * @throws IllegalArgumentException if any parameters are invalid.
     */
    private void validateConstructorArgs(String eventId, String cda, StreamSource cdaXlsSource, File outputDir, Integer maxThreads, Integer timeoutMS) {
        List<String> illegalParams = new ArrayList<>();

        if (StringUtils.isBlank(eventId)) {
            illegalParams.add("eventId is blank");
        }

        if (StringUtils.isBlank(cda)) {
            illegalParams.add("cda is blank");
        }

        if (cdaXlsSource == null) {
            illegalParams.add("cdaXlsSource is null");
        }

        if (outputDir == null) {
            illegalParams.add("outputDir is null");
        }

        if (maxThreads < 1) {
            illegalParams.add("maxThreads < 1");
        }

        if (timeoutMS < 1) {
            illegalParams.add("timeoutMS < 1");
        }

        if (illegalParams.isEmpty())
            return;

        throw new IllegalArgumentException(illegalParams.toString());
    }

    /**
     * Handles document conversion failure logic.
     * <p/>
     * Will attempt to retry document conversion.
     *
     * @return Converted document file.
     */
    @Override
    protected File run() throws Exception {

        logger.debug("Converting CDA to HTML");

        long start = System.currentTimeMillis();

        String htmlOutputStr = String.format("%s/%s.html", outputDir.getAbsolutePath(), eventId);

        StreamResult htmlStreamResult = new StreamResult(createFileOutputStream(htmlOutputStr));

        transformerFactory.newTransformer(cdaXlsSource)
                .transform(new StreamSource(new StringReader(cda)), htmlStreamResult);

        File outputFile = createFile(htmlOutputStr);

        long end = System.currentTimeMillis();

        logger.debug(String.format("CDA2HTML conversion took %dms", (end-start)));

        if (!outputFile.exists())
            throw new ConvertDocumentException(
                    String.format("Failed to convert CDA2HTML, HTML output not created: %s", htmlOutputStr));

        return outputFile;

    }

    /**
     * Creates a OutputStream to specified filepath.
     *
     * @param filepath Path to file.
     * @return  OutputStream instance.
     * @throws IOException if an error occurs.
     */
    protected OutputStream createFileOutputStream(String filepath) throws IOException {

        //ensure that output directory is created
        FileUtils.forceMkdir(outputDir);

        return new FileOutputStream(filepath);
    }


    /**
     * Creates a new File instance.
     * @param filepath Path to the file.
     * @return A new file instance.
     */
    protected File createFile(String filepath) {
        return new File(filepath);
    }

    /**
     * Handles document conversion failure logic.
     *
     * @throws HystrixRuntimeException when an error occurs.
     */
    @Override
    public File getFallback() {
        throw new HystrixRuntimeException(HystrixRuntimeException.FailureType.COMMAND_EXCEPTION, this.getClass(), "retry limit reached; fallback cancelled.", null, this.getFailedExecutionException());
    }
}
