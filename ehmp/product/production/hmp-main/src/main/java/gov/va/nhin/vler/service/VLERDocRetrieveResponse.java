package gov.va.nhin.vler.service;

public class VLERDocRetrieveResponse {

    private VLERDoc vlerDoc;
    private boolean isError;
    private String errorMsg;

    public VLERDoc getVlerDoc() {
        return vlerDoc;
    }

    public void setVlerDoc(VLERDoc vlerDoc) {
        this.vlerDoc = vlerDoc;
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
