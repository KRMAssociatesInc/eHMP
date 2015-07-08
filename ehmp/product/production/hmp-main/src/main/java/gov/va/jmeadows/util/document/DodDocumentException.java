package gov.va.jmeadows.util.document;

public class DodDocumentException extends RuntimeException {
    public DodDocumentException(String s) {
        super(s);
    }

    public DodDocumentException(Exception e) {
        super(e);
    }

    public DodDocumentException(String s, Exception e) {
        super(s, e);
    }
}
