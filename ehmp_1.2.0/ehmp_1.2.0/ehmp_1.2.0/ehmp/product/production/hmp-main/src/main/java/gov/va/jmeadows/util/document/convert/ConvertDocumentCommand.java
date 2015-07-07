package gov.va.jmeadows.util.document.convert;

import com.netflix.hystrix.*;
import com.netflix.hystrix.exception.HystrixRuntimeException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ConvertDocumentCommand extends HystrixCommand<File> {

    private static final Logger logger = LoggerFactory.getLogger(ConvertDocumentCommand.class);

    /**
     * Hystrix group, command, and thread key used for thread pool & statistics.
     */
    public static final HystrixCommandGroupKey GROUP_KEY = HystrixCommandGroupKey.Factory.asKey("ehmp");
    public static final HystrixCommandKey COMMAND_KEY = HystrixCommandKey.Factory.asKey("convertDoc");
    public static final HystrixThreadPoolKey THREAD_KEY = HystrixThreadPoolKey.Factory.asKey("convertDoc-pool");

    /**
     * Hystrix configurations.
     */
    private static final int MAX_QUEUE = Integer.MAX_VALUE;
    private static final int RETRY_ATTEMPTS = 1;

    /**
     * String format that's utilized when executing libre office command-line interface.
     */
    private static final String CONVERT_CMD_FORMAT =
            "%sprogram" + File.separatorChar +
                    "soffice --headless -env:UserInstallation=file://%s --convert-to %s %s --outdir %s";

    /**
     * LibreOffice profile counter. This is needed to create unique profiles for LibreOffice processes.
     */
    private static long sProfileCnt = 0;

    /**
     * Constructor-passed members and derived members
     */
    private DocumentType documentType;
    private String officeHome;
    private File inputFile;
    private File outputDir;
    private Integer maxThreads;
    private Integer timeoutMS;
    private int numRetries;

    /**
     * Constructs Document conversion command.
     *
     * @param documentType Document conversion target.
     * @param officeHome   LibreOffice installation location.
     * @param inputFile    Input document file.
     * @param outputDir    Output directory where converted file will be saved.
     * @param maxThreads   Size of hystrix command thread pool.
     * @param timeoutMS    Hystrix command timeout.
     */
    public ConvertDocumentCommand(DocumentType documentType, String officeHome,
                                  File inputFile, File outputDir, Integer maxThreads, Integer timeoutMS) {

        this(documentType, officeHome, inputFile, outputDir, maxThreads, timeoutMS, RETRY_ATTEMPTS);
    }

    /**
     * Constructs Document conversion command.
     *
     * @param documentType Document conversion target.
     * @param officeHome   LibreOffice installation location.
     * @param inputFile    Input document file.
     * @param outputDir    Output directory where converted file will be saved.
     * @param maxThreads   Size of hystrix command thread pool.
     * @param timeoutMS    Hystrix command timeout.
     * @param numRetries   Utilized by fallback method - the number of remaining conversion retries.
     */
    public ConvertDocumentCommand(DocumentType documentType, String officeHome,
                                  File inputFile, File outputDir, Integer maxThreads, Integer timeoutMS, int numRetries) {

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

        validateConstructorArgs(documentType, officeHome, inputFile, outputDir, maxThreads, timeoutMS);

        this.officeHome = officeHome;

        if (!officeHome.endsWith("/"))
            this.officeHome = String.format("%s/", officeHome);

        this.documentType = documentType;
        this.inputFile = inputFile;
        this.outputDir = outputDir;

        this.maxThreads = maxThreads;
        this.timeoutMS = timeoutMS;
        this.numRetries = numRetries;
    }

    /**
     * Validates constructor parameters.
     *
     * @param documentType Document conversion target.
     * @param officeHome   LibreOffice installation location.
     * @param inputFile    Input document file.
     * @param outputDir    Output directory where converted file will be saved.
     * @throws IllegalArgumentException if any parameters are invalid.
     */
    private void validateConstructorArgs(DocumentType documentType, String officeHome,
                                         File inputFile, File outputDir, Integer maxThreads, Integer timeoutMS) {
        List<String> illegalParams = new ArrayList<>();

        if (documentType == null) {
            illegalParams.add("conversionType is null");
        }

        if (StringUtils.isBlank(officeHome)) {
            illegalParams.add("officeName is blank");
        }

        if (inputFile == null) {
            illegalParams.add("inputFile is null");
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
     * Retrieves JVM runtime instance.
     */
    protected Runtime getRuntime() {
        return Runtime.getRuntime();
    }

    /**
     * Increments LibreOffice profile count.
     *
     * @return Profile count.
     */
    private synchronized Long getProfileNum() {
        return ++sProfileCnt;
    }

    /**
     * Creates a unique install profile directory.
     *
     * @return A unique user install profile directory.
     */
    protected File createUniqueUserProfileDir() {

        return new File(String.format("%s/%s",
                FileUtils.getTempDirectoryPath(),
                String.format("libreOfficeProfile_%s_%s", System.currentTimeMillis(), getProfileNum())));
    }

    /**
     * Retrieves the converted file.
     *
     * @return Converted document file.
     */
    protected File retrieveConvertedFile() {
        String outputFilename = String.format("%s.%s",
                FilenameUtils.getBaseName(inputFile.getName()), documentType.getFileExtension());

        return FileUtils.getFile(outputDir, outputFilename);
    }

    /**
     * Executes document conversion.
     *
     * @return Converted document file.
     */
    public File convert() {

        logger.debug("Converting file {} to {}", inputFile.getAbsolutePath(), documentType.getFileExtension());
        long convertStartTime = System.currentTimeMillis(), convertEndTime;
        Process process = null;

        File userProfileDir = createUniqueUserProfileDir();

        try {

            String execStr = String.format(CONVERT_CMD_FORMAT, officeHome, userProfileDir.getAbsolutePath(),
                    documentType.getConversionParam(), inputFile.getAbsolutePath(), outputDir.getAbsolutePath());

            process = getRuntime().exec(execStr);
            process.waitFor();

            File outFile = retrieveConvertedFile();

            convertEndTime = System.currentTimeMillis();

            logger.debug("Converted file: {};Document conversion process took {} ms.",
                    outFile.getAbsolutePath(), convertEndTime-convertStartTime);

            if (!outFile.exists()) {
                logger.debug("converted file does not exist on filesystem: {}", outFile.getAbsolutePath());
                throw new ConvertDocumentException(String.format("Output file not created: %s", outFile));
            }

            return outFile;

        } catch (Exception e) {
            throw new ConvertDocumentException(e);
        } finally {
            if (process != null) {
                process.destroy();
            }

            if (userProfileDir != null) {
                try {
                    FileUtils.deleteDirectory(userProfileDir);
                } catch (IOException e) {
                    throw new ConvertDocumentException(e);
                }
            }
        }
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
        return this.convert();
    }

    /**
     * Handles document conversion failure logic.
     * <p/>
     * Will attempt to retry document conversion.
     *
     * @return HTML document file.
     */
    @Override
    public File getFallback() {
        if (numRetries > 0) {
            logger.warn("Fallback triggered for command: " + this.toString());
            return new ConvertDocumentCommand(this.documentType, this.officeHome, this.inputFile,
                    this.outputDir, this.maxThreads, this.timeoutMS, this.numRetries - 1).execute();
        } else {
            throw new HystrixRuntimeException(HystrixRuntimeException.FailureType.COMMAND_EXCEPTION, this.getClass(), "retry limit reached; fallback cancelled.", null, this.getFailedExecutionException());
        }
    }

}
