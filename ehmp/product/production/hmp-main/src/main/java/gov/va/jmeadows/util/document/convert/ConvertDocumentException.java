package gov.va.jmeadows.util.document.convert;

/**
 * Document Conversion Exception
 */
public class ConvertDocumentException extends RuntimeException {

    public ConvertDocumentException(String errorStr) {
        super(errorStr);
    }

    public ConvertDocumentException(Exception e) {
        super(e);
    }

    public ConvertDocumentException(String s, Exception e) {
        super(s, e);
    }
}
