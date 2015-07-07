package gov.va.cpe.vpr.sync;

public class MessageDestinations {
    public static final String COMMAND_QUEUE = "vpr.command";
    public static final String PATIENT_QUEUE = "vpr.patient";
    public static final String IMPORT_QUEUE = "vpr.import";
    public static final String SYNC_DOD_QUEUE = "vpr.sync.dod";
    public static final String SYNC_CDS_QUEUE = "vpr.sync.cds";
    public static final String SYNC_DAS_QUEUE = "vpr.sync.vlerdas";
    public static final String SYNC_VLER_QUEUE = "vpr.sync.vler";
    public static final String ERROR_QUEUE = "vpr.error";
    public static final String DEAD_LETTER_QUEUE = "ActiveMQ.DLQ";
    public static final String WARNING_QUEUE = "vpr.warning";
    public static final String UI_NOTIFY_TOPIC = "ui.notify";
}
