package us.vistacore.vxsync.vler;

public class VlerConfig {

    private String docQueryUrl;
    private int docQueryTimeoutMs;

    private String docRetrieveUrl;
    private int docRetrieveTimeoutMs;

    private String systemUsername;
    private String systemSiteCode;


    public String getDocQueryUrl() {
        return docQueryUrl;
    }

    public void setDocQueryUrl(String docQueryUrl) {
        this.docQueryUrl = docQueryUrl;
    }

    public int getDocQueryTimeoutMs() {
        return docQueryTimeoutMs;
    }

    public void setDocQueryTimeoutMs(int docQueryTimeoutMs) {
        this.docQueryTimeoutMs = docQueryTimeoutMs;
    }

    public String getDocRetrieveUrl() {
        return docRetrieveUrl;
    }

    public void setDocRetrieveUrl(String docRetrieveUrl) {
        this.docRetrieveUrl = docRetrieveUrl;
    }

    public int getDocRetrieveTimeoutMs() {
        return docRetrieveTimeoutMs;
    }

    public void setDocRetrieveTimeoutMs(int docRetrieveTimeoutMs) {
        this.docRetrieveTimeoutMs = docRetrieveTimeoutMs;
    }

    public String getSystemUsername() {
        return systemUsername;
    }

    public void setSystemUsername(String systemUsername) {
        this.systemUsername = systemUsername;
    }

    public String getSystemSiteCode() {
        return systemSiteCode;
    }

    public void setSystemSiteCode(String systemSiteCode) {
        this.systemSiteCode = systemSiteCode;
    }
}