package gov.va.cpe.vpr;

import org.springframework.util.Assert;

/**
 * Represents entries in the USR STATUS file.
 *
 * @see "VistA FileMan USR RECORD STATUS(8930.6)"
 */
public enum DocumentStatus {
    /**
     * The document is required and a record has been created in anticipation of dictation and transcription.
     */
    UNDICTATED(1, "Undictated"),
    /**
     * This status is used for business rules permitting entry of not-yet- existing documents into the file.
     */
    UNTRANSCRIBED(2,"Untranscribed"),
    /**
     * The document is in the process of being entered into the system, but hasn’t been released by the originator (i.e., the person who entered the text online). See the TIU Document Parameters.
     */
    UNRELEASED(3, "Unreleased"),
    /**
     * The document has been released or uploaded, but an intervening verification step must be completed before the document is available for signature. See the TIU Document and Upload Parameters.
     */
    UNVERIFIED(4, "Unverified"),
    /**
     * The document is online in a draft state, but the author's signature hasn’t yet been obtained.
     */
    UNSIGNED(5, "Unsigned"),
    /**
     * The document is complete, with the exception of cosignature by the attending physician.
     */
    UNCOSIGNED(6, "Uncosigned"),
    /**
     * The document has acquired all necessary signatures and is legally authenticated.
     */
    COMPLETED(7, "Completed"),
    /**
     * The document has been completed and a privacy act issue has required its amendment.
     */
    AMENDED(8, "Amended"),
    /**
     * The grace period for purge has expired, and the report text has been removed from the on line record to recover
     * disk space.
     * <p/>
     * NOTE:  only completed documents may be purged.  It is assumed that the chart copy of the document has
     * been retained for archival purposes.
     */
    PURGED(9, "Purged"),
    TEST(10, "Test"),
    /**
     * This status applies to document definitions only. Documents may be entered for document definitions of status
     * ACTIVELIVE. ACTIVELIVE status is intended for actual, clinical documents, NOT for test documents.
     */
    LIVE(11, "Live"),
    /**
     * This status applies to document definitions only.
     *
     * If a document definition has status ACTIVENOLONGER, then it may not be
     * used to enter documents.
     *
     * If a document definition has status ACTIVENOLONGER, its status may
     * be changed back to ACTIVELIVE only.
     */
    RETIRED(12, "Retired"),
    /**
     * The document has been deleted but the audit trail is retained.
     */
    DELETED(14, "Deleted"),
    /**
     * Used instead of Deleted after the document has been signed. If an error is discovered after signature, then the document is made invisible for most users, but retained as part of the audit trail.
     */
    RETRACTED(15, "Retracted");

    private int code;
    private String name;

    private DocumentStatus(int code, String name) {
        this.code = code;
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public static DocumentStatus forName(String statusName) {
        Assert.hasText(statusName, "[Assertion failed] - the 'name' of the requested DocumentStatus must have text; it must not be null, empty, or blank");
        for (DocumentStatus status : values()) {
            if (status.getName().equalsIgnoreCase(statusName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Name '" + statusName + "' does not correspond to a " + DocumentStatus.class + " value");
    }
}
