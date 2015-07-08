package us.vistacore.vxsync.vler;

import java.util.ArrayList;
import java.util.List;

public class VlerDocRetrieveResponse {

    private List<Section> vlerDocSections;
    private boolean isError;
    private String errorMsg;

    public List<Section> getVlerDocSections() {

        if (vlerDocSections == null) {
            vlerDocSections = new ArrayList<>();
        }

        return vlerDocSections;
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
