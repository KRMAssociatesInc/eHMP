package us.vistacore.vxsync.vler;


import java.util.ArrayList;
import java.util.List;

public class VlerDocQueryResponse {
    private List<VlerMetadata> documentList;
    private boolean isError;
    private String errorMsg;

    public List<VlerMetadata> getDocumentList() {

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
