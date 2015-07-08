package gov.va.cpe.order;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class Schedule extends AbstractPOMObject {

    private String name;
    private String internal;
    private String externalValue;
    private String scheduleType;

    public Schedule() {
        super(null);
    }

    public Schedule(Map<String, Object> vals) {
        super(vals);    //To change body of overridden methods use File | Settings | File Templates.
    }

    public String getName() {
        return name;
    }

    public String getExternalValue() {
        return externalValue;
    }

    public String getScheduleType() {
        return scheduleType;
    }

    public String getInternal() {
        return internal;
    }

    @Override
    public String getSummary() {
        return getName();
    }
}
