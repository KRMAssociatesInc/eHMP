package gov.va.jmeadows.util.document;

import com.netflix.hystrix.*;
import com.netflix.hystrix.exception.HystrixRuntimeException;
import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DocumentText;
import gov.va.jmeadows.util.document.convert.IConvertDocumentService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Command executes DoD document orchestration logic.
 */
public class CdaDocumentCommand extends HystrixCommand<Document> {

    private static final Logger logger = LoggerFactory.getLogger(CdaDocumentCommand.class);

    /**
     * Hystrix group, command, and thread key used for thread pool & statistics.
     */
    public static final HystrixCommandGroupKey GROUP_KEY = HystrixCommandGroupKey.Factory.asKey("ehmp");
    public static final HystrixCommandKey COMMAND_KEY = HystrixCommandKey.Factory.asKey("CdaDocument");
    public static final HystrixThreadPoolKey THREAD_KEY = HystrixThreadPoolKey.Factory.asKey("CdaDocument-pool");

    private static final Integer MAX_THREADS = 10;
    private static final Integer TIMEOUT_MS = 120 * 1000;

    /**
     * Hystrix configurations.
     */
    private static final int MAX_QUEUE = Integer.MAX_VALUE;

    private DodDocumentConfiguration dodDocumentConfiguration;
    private IConvertDocumentService convertDocumentService;
    private PatientIds patientIds;
    private String eventId;
    private String cdaNote;
    private Document vprDocument;
    private String documentStorageFilePath;
    private String documentStorageServicePath;

    /**
     * Output directory counter number.
     */
    private static long sOutputDirCnt = 0;

    /**
     * Constructs retrieve DoD document command instance.
     *
     * @param config Orchestrator configuration.
     * @param cdaNote        CDA note.
     * @param patientIds     PatientIds
     * @param eventId        EventId associated with the note.
     * @param vprDocument    VPR document instance.
     */
    public CdaDocumentCommand(DodDocumentConfiguration config, String cdaNote, PatientIds patientIds, String eventId, Document vprDocument) {

        //pass Hystrix command configurations
        super(HystrixCommand.Setter.withGroupKey(GROUP_KEY)
                .andCommandKey(COMMAND_KEY)
                .andThreadPoolKey(THREAD_KEY)
                .andThreadPoolPropertiesDefaults(
                        HystrixThreadPoolProperties.Setter()
                                .withCoreSize(MAX_THREADS)
                                .withQueueSizeRejectionThreshold(MAX_QUEUE)
                                .withMaxQueueSize(MAX_QUEUE))
                .andCommandPropertiesDefaults(
                        HystrixCommandProperties.Setter()
                                .withCircuitBreakerEnabled(false)
                                .withFallbackEnabled(true)
                                .withRequestCacheEnabled(false)
                                .withRequestLogEnabled(false)
                                .withExecutionIsolationThreadTimeoutInMilliseconds(TIMEOUT_MS)
                                .withExecutionIsolationStrategy(HystrixCommandProperties.ExecutionIsolationStrategy.THREAD)
                ));

        validateConfig(config, cdaNote, patientIds, eventId, vprDocument);

        this.dodDocumentConfiguration = config;
        this.convertDocumentService = config.getConvertDocumentService();
        this.patientIds = patientIds;
        this.eventId = eventId;
        this.cdaNote = cdaNote;
        this.vprDocument = vprDocument;
        this.documentStorageFilePath = config.getDocumentStorageFilePath();
        this.documentStorageServicePath = config.getDocumentStorageServicePath();

        if (!this.documentStorageServicePath.endsWith("/"))
            this.documentStorageServicePath = this.documentStorageServicePath + "/";
    }

    /**
     * Validates configuration
     *
     * @param dodDocumentConfiguration Command configuration
     * @param cdaNote        CDA note.
     * @param patientIds     Patient IDs
     * @param eventId        EventId associated with the note.
     * @param vprDocument    VPR document instance.
     */
    private void validateConfig(DodDocumentConfiguration dodDocumentConfiguration, String cdaNote, PatientIds patientIds, String eventId, Document vprDocument) {
        String errorMsg = "Missing required parameter(s): ";

        List<String> illegalParams = new ArrayList<>();
        if (dodDocumentConfiguration == null) {
            throw new IllegalArgumentException(errorMsg + "dodDocumentConfiguration is null");
        }

        if (patientIds == null)
            illegalParams.add("patientIds is null");
        if (StringUtils.isBlank(patientIds.getPid()))
            illegalParams.add("patientIds pid value is blank");
        if (StringUtils.isBlank(eventId))
            illegalParams.add("eventId is blank");
        if (StringUtils.isBlank(cdaNote))
            illegalParams.add("cdaNote is blank");
        if (StringUtils.isBlank(dodDocumentConfiguration.getDocumentStorageFilePath()))
            illegalParams.add("documentStorageFilePath is blank");
        if (StringUtils.isBlank(dodDocumentConfiguration.getDocumentStorageServicePath()))
            illegalParams.add("documentStorageServicePath is blank");
        if (vprDocument == null)
            illegalParams.add("vprDocument is null");
        if (dodDocumentConfiguration.getConvertDocumentService() == null)
            illegalParams.add("convertDocumentService is null");

        if (illegalParams.size() > 0)
            throw new IllegalArgumentException(errorMsg + illegalParams.toString());
    }

    /**
     * Increments output directory count.
     *
     * @return Output dir count.
     */
    private synchronized Long getOutputDirNum() {
        return ++sOutputDirCnt;
    }

    /**
     * Gets document storage directory
     *
     * @return Get document storage directory.
     */
    protected File getStorageDir() {
        return new File(documentStorageFilePath);
    }

    /**
     * Creates a temporary output directory.
     *
     * @return Temporary out put directory.
     */
    protected File createTempOutputDir() {
        return new File(String.format("%s/%s",
                FileUtils.getTempDirectoryPath(),
                String.format("dod_cda_docs_%s_%s", System.currentTimeMillis(), getOutputDirNum())));
    }

    /**
     * Orchestrates CDA document conversion and storage.
     * <p/>

     * The CDA document is converted into two formats: HTML & plain-text.
     * The HTML document is stored to disk and a link to the stored file set as field within the VPR document.
     * The plain-text note string is mapped into the VPR document.
     *
     * @return VPR document instance which contains the plain-text format of the note and a link to HTML format.
     */
    public Document convertAndStoreCdaDocument() {
        logger.debug("convertAndStoreCdaDocument begin");

        File tempOutputDir = createTempOutputDir(),
                htmlFile = null, plainTextFile = null;

        File storageDir = getStorageDir();

        try {

            //convert CDA to HTML
            try {
                htmlFile = convertDocumentService.convertCDA2HTML(this.eventId, this.cdaNote, tempOutputDir).get();
            } catch (InterruptedException | ExecutionException e) {
                throw new DodDocumentException("Failed to convert CDA document to HTML", e);
            }

            //convert CDA HTML to plain-text
            try {
                plainTextFile = convertDocumentService.convert2Text(htmlFile, tempOutputDir).get();
            } catch (InterruptedException | ExecutionException e) {
                throw new DodDocumentException("Failed to convert CDA document to plain text", e);
            }

            //store file
            File storageFile = storeHtmlFile(htmlFile, storageDir);
            logger.debug("stored HTML file: {}", storageFile.getAbsolutePath());

            logger.debug("updating VPR document with HTML link & plain-text content");
            //pass link to complex note and insert plain text into vpr document instance
            updateVprDocument(vprDocument, storageFile, plainTextFile);

            return vprDocument;

        } finally {
            //cleanup output directory
            if (tempOutputDir != null && tempOutputDir.exists()) {
                try {
                    FileUtils.deleteDirectory(tempOutputDir);
                } catch (IOException e) {
                    logger.error("Failed to delete temp directory", e);
                }
            }
        }
    }

    /**
     * Returns hexadecimal representation of pid.
     * @param pid Patient identifier (ICN or a Site;DFN)
     * @return Patient Identifier hexadecimal representation.
     */
    private String pid2HexString(String pid) {
        return new BigInteger(pid.getBytes()).toString(16);
    }

    /**
     * Store HTML file.
     *
     * @param htmlFile   DoD document in HTML format.
     * @param storageDir Storage directory.
     * @return DoD document HTML file in storage directory.
     */
    protected File storeHtmlFile(File htmlFile, File storageDir) {
        File patientDir = new File(storageDir, pid2HexString(patientIds.getPid()));

        File storageFile = new File(patientDir, htmlFile.getName());

        if (storageFile.exists())
            return storageFile;

        try {
            FileUtils.moveFile(htmlFile, storageFile);
        } catch (IOException e) {
            throw new DodDocumentException("Failed to store DoD document.", e);
        }

        return storageFile;
    }

    /**
     * Reads input file and outputs it into a String.
     *
     * @param inputFile Input file.
     * @return String representation of file contents.
     * @throws IOException if an error occurrs.
     */
    protected String readFileToString(File inputFile) throws IOException {
        return FileUtils.readFileToString(inputFile);
    }

    /**
     * Updates VPR document with HTML link and plain-text note.
     *
     * @param vprDocument    VPR document instance.
     * @param storedHtmlFile Stored HTML file.
     * @param plainTextFile  Plain-text file.
     * @return VPR document instance.
     */
    private Document updateVprDocument(Document vprDocument, File storedHtmlFile, File plainTextFile) {
        vprDocument.setData("dodComplexNoteUri",
                String.format("%s%s/%s", documentStorageServicePath, pid2HexString(patientIds.getPid()), storedHtmlFile.getName()));

        try {
            DocumentText docText = new DocumentText();
            docText.setData("content", readFileToString(plainTextFile));
            docText.setData("dateTime", vprDocument.getReferenceDateTime());
            docText.setData("status", "completed");
            docText.setData("uid", vprDocument.getUid());

            vprDocument.setData("text", Arrays.asList(docText));

        } catch (IOException e) {
            throw new DodDocumentException("Failed to read plain-text file.", e);
        }

        return vprDocument;
    }


    /**
     * Orchestrates CDA document conversion and storage.
     * <p/>

     * The CDA document is converted into two formats: HTML & plain-text.
     * The HTML document is stored to disk and a link to the stored file set as field within the VPR document.
     * The plain-text note string is mapped into the VPR document.
     *
     * @return VPR document instance which contains the plain-text format of the note and a link to HTML format.
     */
    @Override
    protected Document run() throws Exception {
        return this.convertAndStoreCdaDocument();
    }

    /**
     * Handles CDA document orchestration failure logic.
     *
     * @throws HystrixRuntimeException if an error occurs.
     */
    @Override
    public Document getFallback() {
        throw new HystrixRuntimeException(HystrixRuntimeException.FailureType.COMMAND_EXCEPTION, this.getClass(), "retry limit reached; fallback cancelled.", null, this.getFailedExecutionException());
    }
}
