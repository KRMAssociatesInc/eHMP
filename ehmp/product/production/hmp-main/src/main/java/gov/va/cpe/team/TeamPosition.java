package gov.va.cpe.team;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class TeamPosition extends AbstractPOMObject {

    private String name;
    private String description;

    public TeamPosition() {
        super(null);
    }

    public TeamPosition(Map<String, Object> vals) {
        super(vals);
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String getSummary() {
        return getName();
    }
}
