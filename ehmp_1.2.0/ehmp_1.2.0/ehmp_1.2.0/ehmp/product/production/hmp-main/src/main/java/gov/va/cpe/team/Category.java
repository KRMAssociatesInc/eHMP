package gov.va.cpe.team;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class Category extends AbstractPOMObject {

    private String name;
    private String description;
    private String domain;

	public Category() {
        super(null);
    }

    public Category(Map<String, Object> vals) {
        super(vals);
    }

    public String getDomain() {
		return domain;
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
