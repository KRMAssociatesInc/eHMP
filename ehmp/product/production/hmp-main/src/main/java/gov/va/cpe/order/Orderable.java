package gov.va.cpe.order;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.List;
import java.util.Map;

public class Orderable extends AbstractPOMObject {

    private String name;
    private String uid;
    private String internal;
    private List<Map<String, String>> types;
    private List<Map<String, String>> possibleDosages;
    private Map<String,Object> dialogAdditionalInformation;
    private Map<String,String> imagingDetails;
    private Map<String,String> labDetails;

//    public Orderable() {
//        super(null);
//    }

    @JsonCreator
    public Orderable(Map<String, Object> vals) {
        super(vals);    //To change body of overridden methods use File | Settings | File Templates.
    }

    public List<Map<String, String>> getTypes() {
        return types;
    }

    public List<Map<String, String>> getPossibleDosages() {
        return possibleDosages;
    }

    public String getName() {
        return name;
    }

    public String getUid() {
        return uid;
    }

    public String getInternal() {
        return internal;
    }

    public Map<String, Object> getDialogAdditionalInformation() {
        return dialogAdditionalInformation;
    }

    public Map<String, String> getImagingDetails() {
        return imagingDetails;
    }

    public Map<String, String> getLabDetails() {
        return labDetails;
    }

    @Override
    public String getSummary() {
        return getName();
    }
}
