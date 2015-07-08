package gov.va.cpe.order;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.jds.JdsCollectionName;

import java.util.List;
import java.util.Map;

@JdsCollectionName("displayGroup")
public class OrderDisplayGroup extends AbstractPOMObject {

    private String name;
    private String uid;
    private String displayName;
    private String abbreviation;
    private String defaultDialogUid;
    private String defaultDialogName;
    private List<Map<String, Object>> children;

    @JsonCreator
    public OrderDisplayGroup(Map<String, Object> vals) {
        super(vals);    //To change body of overridden methods use File | Settings | File Templates.
    }

    public List<Map<String, Object>> getChildren() {
        return children;
    }

    public String getName() {
        return name;
    }

    public String getUid() {
        return uid;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public String getDefaultDialogName() {
        return defaultDialogName;
    }

    public String getDefaultDialogUid() {
        return defaultDialogUid;
    }

    @Override
    public String getSummary() {
        return getName();
    }
}
