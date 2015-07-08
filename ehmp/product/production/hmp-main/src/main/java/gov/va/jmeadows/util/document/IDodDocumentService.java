package gov.va.jmeadows.util.document;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.Document;

import java.util.concurrent.Future;

public interface IDodDocumentService {
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
    public Future<Document> convertAndStoreCDADocument(String cdaNote, PatientIds patientIds, String eventId, Document vprDocument);

    /**
     * Orchestrates DoD RTF document retrieval, conversion, and storage.
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
    public Future<Document> retrieveConvertAndStoreRTFDocument(String complexNoteUrl, PatientIds patientIds,
                                                               String eventId, Document vprDocument);

    /**
     * Deletes all DoD complex note documents associated with patient identifier.
     * @param pid Patient Identifier (ICN, SITE:DFN)
     * @return True if successful
     */
    public Boolean deleteDodDocuments(String pid);
}
