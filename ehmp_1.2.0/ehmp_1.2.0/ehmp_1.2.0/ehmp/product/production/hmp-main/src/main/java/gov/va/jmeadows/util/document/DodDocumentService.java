package gov.va.jmeadows.util.document;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.util.concurrent.Future;

/**
 * DoD Document Orchestrator.
 * <p/>
 * This class is responsible for queuing processes that retrieves, converts, and stores a DoD RTF & CDA documents.
 */
@Service
public class DodDocumentService implements IDodDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DodDocumentService.class);

    private DodDocumentConfiguration dodDocumentConfiguration;

    @Autowired
    public void setDodDocumentConfiguration(DodDocumentConfiguration dodDocumentConfiguration) {
        this.dodDocumentConfiguration = dodDocumentConfiguration;
    }

    /**
     * Creates a DoD document command instance.
     *
     * @param complexNoteUrl URL that points to DoD complex note.
     * @param patientIds     Patient IDs
     * @param eventId        EventId associated with the note.
     * @param vprDocument    VPR document instance.
     * @return DoD document orchestrator command instance.
     */
    protected RtfDocumentCommand createDodDocumentCommandInstance(String complexNoteUrl, PatientIds patientIds,
                                                       String eventId, Document vprDocument) {
        return new RtfDocumentCommand(dodDocumentConfiguration, complexNoteUrl, patientIds, eventId, vprDocument);
    }

    /**
     * Creates a DoD document command instance.
     *
     * @param cdaNote        CDA note.
     * @param patientIds     Patient IDs
     * @param eventId        EventId associated with the note.
     * @param vprDocument    VPR document instance.
     * @return CDA document orchestrator command instance.
     */
    protected CdaDocumentCommand createCdaDocumentCommandInstance(String cdaNote, PatientIds patientIds, String eventId, Document vprDocument) {
        
        return new CdaDocumentCommand(dodDocumentConfiguration, cdaNote, patientIds, eventId, vprDocument);
    }

    /**
     * Orchestrates CDA document conversion and storage.
     * <p/>
     * The CDA document is converted into two formats: HTML & plain-text.
     * The HTML document is stored to disk and a link to the stored file set as field within the VPR document.
     * The plain-text note string is mapped into the VPR document.
     *
     * @param cdaNote        CDA note.
     * @param patientIds     Patient IDs
     * @param eventId        EventId associated with the note.
     * @param vprDocument    VPR document instance.
     * @return VPR document instance which contains the plain-text format of the note and a link to HTML format.
     */
    @Override
    public Future<Document> convertAndStoreCDADocument(String cdaNote, PatientIds patientIds, String eventId, Document vprDocument) {
        logger.debug("convertAndStoreCDADocument begin");
        return createCdaDocumentCommandInstance(cdaNote, patientIds, eventId, vprDocument).queue();
    }

    /**
     * Orchestrates DoD document retrieval, conversion, and storage.
     * <p/>
     * DoD RTF documents are retrieved via jMeadows.
     * The RTF document is converted into two formats: HTML & plain-text.
     * The HTML document is stored to disk and a link to the stored file set as field within the VPR document.
     * The plain-text note string is mapped into the VPR document.
     *
     * @param complexNoteUrl URL that points to DoD complex note.
     * @param patientIds     Patient IDs
     * @param eventId        EventId associated with the note.
     * @param vprDocument    VPR document instance.
     * @return VPR document instance which contains the plain-text format of the note and a link to HTML format.
     */
    @Override
    public Future<Document> retrieveConvertAndStoreRTFDocument(String complexNoteUrl, PatientIds patientIds,
                                                               String eventId, Document vprDocument) {

        logger.debug("retrieveConvertAndStoreRTFDocument begin");
        return createDodDocumentCommandInstance(complexNoteUrl, patientIds, eventId, vprDocument).queue();
    }

    /**
     * Deletes all DoD complex note documents associated with patient identifier.
     * @param pid Patient Identifier (ICN, SITE:DFN)
     * @return True if patient DoD documents were successfully deleted.
     */
    @Override
    public Boolean deleteDodDocuments(String pid) {
        logger.debug("deleteAllDodDocumentsForPatient begin");

        //return false if pid cannot be correlated
        if (StringUtils.isBlank(pid)) {
            logger.debug("Patient pid is blank");
            return false;
        }


        File patientDocDir = new File(String.format("%s/%s",
                dodDocumentConfiguration.getDocumentStorageFilePath(), pid2HexString(pid)));

        Boolean isDelete = false;

        try {

            isDelete = deleteDirectory(patientDocDir);

        } catch (IOException e) {
            //log exception and return false if IO exception is thrown
            logger.error("Failed to delete patient DoD documents.", e);
        }

        logger.debug("deleteAllDodDocumentsForPatient result: {}", isDelete);

        return isDelete;
    }

    /**
     * Deletes specified directory.
     *
     * Method needed primarily for unit testing purposes.
     *
     * @param fileDir Directory to delete.
     * @return True if directory was successfully deleted.
     * @throws IOException if an error occurs.
     */
    protected Boolean deleteDirectory(File fileDir) throws IOException {
        FileUtils.deleteDirectory(fileDir);

        return !fileDir.exists();
    }

    /**
     * Returns hexadecimal representation of pid.
     * @param pid Patient identifier (ICN or a Site;DFN)
     * @return Patient Identifier hexadecimal representation.
     */
    private String pid2HexString(String pid) {
        return new BigInteger(pid.getBytes()).toString(16);
    }

}
