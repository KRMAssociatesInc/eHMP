package gov.va.cpe.order;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.jds.JdsCollectionName;

import java.util.Map;

@JdsCollectionName("qo")
public class QuickOrder extends AbstractPOMObject {

    private String name;
    private String uid;

    @JsonCreator
    public QuickOrder(Map<String, Object> vals) {
        super(vals);    //To change body of overridden methods use File | Settings | File Templates.
    }

    public String getName() {
        return name;
    }

    public String getUid() {
        return uid;
    }

    @Override
    public String getSummary() {
        return getName();
    }
}
