package gov.va.cpe.vpr.sync;

public class UnknownPatientException extends RuntimeException {

    public static final String MESSAGE = "Patient with localPatientId '%s' from system '%s' is currently unknown to the VPR. This is likely due to old subscriptions notifying this VPR about new data for patient's that are no longer in it.";

    public UnknownPatientException(String systemId, String localPatientId) {
        super(String.format(MESSAGE, localPatientId, systemId));
    }
}
