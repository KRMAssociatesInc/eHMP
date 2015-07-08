package gov.va.hmp.app;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.module.PatientDataDisplayType;

import java.util.List;
import java.util.Map;

public class Page extends AbstractPOMObject {

    private String name;
    private PatientDataDisplayType patientDataDisplayType;
    private int numColumns = 1;
    private Map<Integer, List<String>> columnComponents;

    public Page() {
        super();
    }

    public Page(Map<String, Object> vals) {
        super(vals);
    }
}
