package gov.va.nhin.vler.service;


import java.util.ArrayList;
import java.util.List;

public class VLERDocQueryResponse {

    private List<VLERDoc> documentList;
    private boolean isError;
    private String errorMsg;

    public List<VLERDoc> getDocumentList() {

        if (documentList == null) {
            documentList = new ArrayList<>();
        }

        return documentList;
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
