package us.vistacore.vxsync.vler;

public class VlerDocumentException extends RuntimeException {

    public VlerDocumentException(String s) {
        super(s);
    }

    public VlerDocumentException(Exception e) {
        super(e);
    }

    public VlerDocumentException(String s, Exception e) {
        super(s, e);
    }
}
