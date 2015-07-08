package gov.va.cpe.roster;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class RosterPatient extends AbstractPOMObject {
	
	private static final long serialVersionUID = 7648147978324944712L;

    private String pid;
    private Integer sourceSequence;

    public RosterPatient() {
        super();
    }

    public RosterPatient(Map<String, Object> vals) {
        super(vals);
    }

    public String getPid() {
        return pid;
    }

    public Integer getSourceSequence() {
		return sourceSequence;
	}
}
