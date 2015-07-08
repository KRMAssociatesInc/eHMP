package gov.va.cpe.idn;

/**
 * Patient Identity Exception class.
 */
public class PatientIdentityException extends RuntimeException {

    public PatientIdentityException(String s) {
        super(s);
    }

    public PatientIdentityException(Exception e) {
        super(e);
    }

    public PatientIdentityException(String s, Exception e) {
        super(s, e);
    }
}
