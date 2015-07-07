package gov.va.hmp.access.asu;

import org.springframework.util.Assert;

/**
 * Representation of ASU actions that can be taken on TIU documents.
 *
 * @see "VistA FileMan USR ACTION(8930.8)"
 */
public enum DocumentAction {

    /**
     * Involves the Privacy Act Amendment of a document by authorized individuals after electronic Signature. (Note that
     * the old unamended document is kept in a retracted status.)
     */
    AMENDMENT("AMENDMENT"),

    /**
     * Rule applies to interdisciplinary PARENT notes and permits notes of this title to have child notes attached.
     */
    ATTACH_ID_ENTRY("ATTACH ID ENTRY"),

    /**
     * Rule applies to individual ID CHILD entries and permits notes of this title to be attached (to a parent note).
     */
    ATTACH_TO_ID_NOTE("ATTACH TO ID NOTE"),

    /**
     * The title may be changed during the life of the document. This most often happens when the medical center is
     * reorganizing their title structure.
     */
    CHANGE_TITLE("CHANGE TITLE"),

    /**
     * Allows an authorized user to copy a document from one patient or encounter to another.
     */
    COPY_RECORD("COPY RECORD"),

    /**
     * This action occurs when a second-line signature is obtained for a document.
     */
    COSIGNATURE("COSIGNATURE"),

    /**
     * The document is deleted. This only applies to unsigned documents. If the document has been signed, it is
     * retracted and remains in the file as part of the audit trail.
     */
    DELETE_RECORD("DELETE RECORD"),

    /**
     * Users authorized to perform this action may edit the text of the document. The text of completed documents may
     * not be edited. Edit attempts result in scrambled electronic signature blocks.
     */
    EDIT_RECORD("EDIT RECORD"),

    /**
     * Permits editing the Expected Cosigner of UNCOSIGNED and UNSIGNED documents using a new TIU VISTA List Manager
     * action which does not include access to the text body.
     */
    EDIT_COSIGNER("EDIT COSIGNER"),

    /**
     * Used to permit the creation of new documents in the TIU Document File.
     *
     * @see "VistA FileMan TIU DOCUMENT(8925)"
     */
    ENTRY("ENTRY"),

    /**
     * This action allows the identification of users whose signature is expected, but not required. This action causes
     * VistA to send an alert to the selected provider(s). The recipient of the alert for an additional signature may
     * add an addendum or sign the document, but may not generally edit the document itself. The signature in this case
     * does not complete the document, but simply indicates that the document has been seen.
     */
    IDENTIFY_SIGNERS("IDENTIFY SIGNERS"),

    /**
     * Users authorized to create NEW PRF documents are automatically authorized (in fact, REQUIRED) to link the new
     * documents when creating them. Explicit authorization for (re)-linking a PRF document to a flag is required only
     * for documents which already exist. Such documents may have been created before PRF Phase II introduced links and
     * have NO links, or they may require re-linking to the correct Assignment History Action for the correct patient
     * and flag assignment.
     */
    LINK_TO_FLAG("LINK TO FLAG"),

    /**
     * Involves the linking (or re-linking) of a result with a request in another application (e.g., a PULMONARY CONSULT
     * with its corresponding request).
     */
    LINK_WITH_REQUEST("LINK WITH REQUEST"),

    /**
     * Addenda may be added to documents for the purposes of clarification or augmenting. Addenda may be thought of as
     * extensions of their parent documents, and inherit their properties from them (i.e., an addendum to a discharge
     * summary is treated like a discharge summary, while an addendum to a progress note is treated like a progress
     * note, etc.).
     */
    MAKE_ADDENDUM("MAKE ADDENDUM"),

    PRINT_RECORD("PRINT RECORD"),

    /**
     * Reassignment of records involves the correction of Patient, Visit, or Signatory information, and may typically be
     * accomplished by the author or MIS prior to signature, or by the CHIEF, MIS following signature. (Note that the
     * old unchanged document is kept in a retracted status.)
     */
    REASSIGN("REASSIGN"),

    /**
     * The transcriptionist is satisfied with the transcription and releases the document for signature. See the TIU
     * Document Parameters.
     */
    RELEASE_FROM_TRANSCRIPTION("RELEASE FROM TRANSCRIPTION"),

    /**
     * Involves sending back a document to transcription for correction (and possibly redictation). It removes documents
     * which require release from view, except by the originator or a transcriptionist.
     */
    SEND_BACK("SEND BACK"),

    /**
     * This applies to a first-time signature or and additional signature depending on the document status.
     */
    SIGNATURE("SIGNATURE"),

    /**
     * See TIU Document and Upload Parameters.
     */
    VERIFICATION("VERIFICATION"),

    /**
     * This action permits users to view the text of the document.
     */
    VIEW("VIEW");

    // instance fields and methods

    private String name;

    private DocumentAction(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return getName();
    }

    public static DocumentAction forName(String name) {
        Assert.hasText(name, "[Assertion failed] - the 'name' of the requested DocumentAction must have text; it must not be null, empty, or blank");
        for (DocumentAction action : values()) {
            if (action.getName().equalsIgnoreCase(name)) {
                return action;
            }
        }
        throw new IllegalArgumentException("Name '" + name + "' does not correspond to a " + DocumentAction.class + " value");
    }
}
