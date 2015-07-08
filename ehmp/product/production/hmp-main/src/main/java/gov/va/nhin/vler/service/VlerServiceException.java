package gov.va.nhin.vler.service;

public class VlerServiceException extends RuntimeException {
    public VlerServiceException(String s) {
        super(s);
    }

    public VlerServiceException(Exception e) {
        super(e);
    }

    public VlerServiceException(String s, Exception e) {
        super(s, e);
    }
}
