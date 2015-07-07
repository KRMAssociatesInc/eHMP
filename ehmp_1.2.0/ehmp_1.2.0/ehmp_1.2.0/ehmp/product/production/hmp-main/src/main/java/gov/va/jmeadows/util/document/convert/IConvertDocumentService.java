package gov.va.jmeadows.util.document.convert;

import java.io.File;
import java.util.List;
import java.util.concurrent.Future;

public interface IConvertDocumentService {

    /**
     * Asynchronously converts a HL7 CDA (Clinical Data Architecture) XML document to a HTML representation.
     *
     * @param eventId Event ID associated with the CDA note.
     * @param cda CDA Note String.
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convertCDA2HTML(String eventId, String cda, File outputDir);

    /**
     * Asynchronously converts inputFile to HTML and saves it to the specified output directory.
     *
     * @param inputFile Input document file
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convert2HTML(File inputFile, File outputDir);

    /**
     * Asynchronously converts inputFile to PDF and saves it to the specified output directory.
     *
     * @param inputFile Input document file
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convert2PDF(File inputFile, File outputDir);

    /**
     * Asynchronously converts inputFile to plain text and saves it to the specified output directory.
     *
     * @param inputFile Input document file
     * @param outputDir Output directory where converted file will be saved.
     * @return Result of asynchronous execution.
     */
    public Future<File> convert2Text(File inputFile, File outputDir);

    /**
     * Asynchronously converts inputFile to types within list and saves them to the specified output directory.
     *
     * @param inputFile     Input document file.
     * @param outputDir     Output directory where converted file will be saved.
     * @param documentTypes Document conversion targets.
     * @return List of asynchronous results.
     */
    public List<Future<File>> convert(File inputFile, File outputDir, DocumentType... documentTypes);
}
