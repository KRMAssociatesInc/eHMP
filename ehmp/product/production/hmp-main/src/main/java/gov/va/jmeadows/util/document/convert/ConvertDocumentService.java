package gov.va.jmeadows.util.document.convert;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.xml.transform.stream.StreamSource;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;

/**
 * Converts Documents to supported formats: (HTML, PDF, plain-text).
 * <p/>
 * Converts documents asynchronously by utilizing the Hystrix API.
 */
@Service
public class ConvertDocumentService implements IConvertDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(ConvertDocumentService.class);

    private static final String CDA_XLS_PATH = "classpath:gov/va/jmeadows/xsl/CIS_IMPL_CDAR2.xsl";

    private ResourceLoader resourceLoader;

    private String officeHome;
    private Integer maxThreads;
    private Integer timeoutMS;

    @Autowired
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * Convert Document Service constructor.
     *
     * @param config Convert document config values.
     */
    @Autowired
    public ConvertDocumentService(ConvertDocumentConfiguration config) {

        this.officeHome = config.getOfficeHome();
        this.maxThreads = config.getMaxThreads();
        this.timeoutMS = config.getTimeoutMS();
    }

    /**
     * Retrieves JVM runtime instance.
     */
    protected Runtime getRuntime() {
        return Runtime.getRuntime();
    }

    /**
     * Creates new instance of a ConvertDocumentCommand object.
     *
     * @param documentType Document conversion target.
     * @param inputFile    Input document file
     * @param outputDir    Output directory where converted file will be saved.
     * @return A new ConvertDocumentCommand instance.
     */
    protected ConvertDocumentCommand createConvertDocCommand(DocumentType documentType, File inputFile, File outputDir) {
        return new ConvertDocumentCommand(documentType, officeHome, inputFile, outputDir, maxThreads, timeoutMS);
    }

    /**
     * Asynchronously converts a HL7 CDA (Clinical Data Architecture) XML document to a HTML representation.
     *
     * @param eventId Event ID associated with the CDA note.
     * @param cda CDA Note String.
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convertCDA2HTML(String eventId, String cda, File outputDir) {
        logger.debug("convertCDA2HTML begin");
        StreamSource streamSource = null;

        Resource resource = resourceLoader.getResource(CDA_XLS_PATH);
        try {
            streamSource = new StreamSource(resource.getInputStream());
        } catch (IOException e) {
            throw new ConvertDocumentException(e);
        }

        return new ConvertCDA2HTMLCommand(eventId, cda, streamSource, outputDir, maxThreads, timeoutMS).queue();
    }

    /**
     * Asynchronously converts inputFile to HTML and saves it to the specified output directory.
     *
     * @param inputFile Input document file
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convert2HTML(File inputFile, File outputDir) {

        logger.debug("convert2HTML begin");
        return createConvertDocCommand(DocumentType.HTML, inputFile, outputDir).queue();
    }

    /**
     * Asynchronously converts inputFile to PDF and saves it to the specified output directory.
     *
     * @param inputFile Input document file
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convert2PDF(File inputFile, File outputDir) {
        logger.debug("convert2PDF begin");
        return createConvertDocCommand(DocumentType.PDF, inputFile, outputDir).queue();
    }

    /**
     * Asynchronously converts inputFile to plain text and saves it to the specified output directory.
     *
     * @param inputFile Input document file
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convert2Text(File inputFile, File outputDir) {
        logger.debug("convert2Text begin");
        return createConvertDocCommand(DocumentType.TEXT, inputFile, outputDir).queue();
    }

    /**
     * Asynchronously converts inputFile to types within list and saves them to the specified output directory.
     *
     * @param inputFile     Input document file.
     * @param outputDir     Output directory where converted file will be saved.
     * @param documentTypes Document conversion targets.
     * @return List of asynchronous results.
     */
    public List<Future<File>> convert(File inputFile, File outputDir, DocumentType... documentTypes) {

        logger.debug("convert begin");

        List<Future<File>> futures = new ArrayList<>();

        for (DocumentType type : documentTypes) {
            if (type == DocumentType.HTML) {
                futures.add(convert2HTML(inputFile, outputDir));
            } else if (type == DocumentType.TEXT) {
                futures.add(convert2Text(inputFile, outputDir));
            } else if (type == DocumentType.PDF) {
                futures.add(convert2PDF(inputFile, outputDir));
            }
        }

        return futures;
    }
}
