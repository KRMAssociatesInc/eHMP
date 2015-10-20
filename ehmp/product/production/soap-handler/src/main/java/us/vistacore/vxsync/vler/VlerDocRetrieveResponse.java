package us.vistacore.vxsync.vler;

import java.util.ArrayList;
import java.util.List;

public class VlerDocRetrieveResponse {

    private String vlerDocHtml;
    private boolean compressRequired;
    private String vlerDocType;
    private boolean isError;
    private String errorMsg;

    public String getVlerDocHtml() {
        return vlerDocHtml;
    }

    public void setVlerDocHtml(String html) {
        vlerDocHtml = html;
    }

    public boolean isCompressRequired() {
        return compressRequired;
    }

    public void setCompressRequired(boolean required) {
        this.compressRequired = required;
    }

    public String getVlerDocType() {
        return vlerDocType;
    }

    public void setVlerDocType(String docType) {
        this.vlerDocType = docType;
    }

    public boolean isError() {
        return isError;
    }

    public void setError(boolean isError) {
        this.isError = isError;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
