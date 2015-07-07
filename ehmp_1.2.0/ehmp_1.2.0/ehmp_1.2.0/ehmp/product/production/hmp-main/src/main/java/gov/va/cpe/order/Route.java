package gov.va.cpe.order;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class Route extends AbstractPOMObject {

    private String name;
    private String uid;
    private String internal;
    private String externalName;
    private String abbreviation;
    private boolean useInIv;


//    public Route() {
//        super(null);
//    }

    @JsonCreator
    public Route(Map<String, Object> vals) {
        super(vals);    //To change body of overridden methods use File | Settings | File Templates.
    }

    public String getExternalName() {
        return externalName;
    }

    public String getAbbreviation() {
        return abbreviation;
    }
    public boolean getUseInIV() {
        return useInIv;
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

    @Override
    public String getSummary() {
        return getName();
    }
}
