package us.vistacore.vxsync.vler;

/**
 * VLER Document Exception
 */
public class VlerDocumentUtilException extends RuntimeException {

    public VlerDocumentUtilException(String s) {
        super(s);
    }

    public VlerDocumentUtilException(Exception e) {
        super(e);
    }

    public VlerDocumentUtilException(String s, Exception e) {
        super(s, e);
    }
}
