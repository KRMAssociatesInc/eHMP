package gov.va.cpe.lab;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.List;
import java.util.Map;

public class LabGroup extends AbstractPOMObject implements Comparable<LabGroup> {
	
	private List<Map<String, Object>> groups;
	private String name;

	public LabGroup(Map<String, Object> vals) {
		super(vals);
	}
	
	public LabGroup() {
		super(null);
	}

	public List<Map<String, Object>> getGroups() {
		return groups;
	}

	public String getName() {
		return name;
	}
	
	public int compareTo(LabGroup o) {
		return this.getName().compareTo(o.getName());
	}
}
