package gov.va.cpe.lab;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.List;
import java.util.Map;

public class LabPanel extends AbstractPOMObject implements Comparable<LabPanel> {
	private List<Map<String, Object>> labs;
	private String name;

	public LabPanel(Map<String, Object> vals) {
		super(vals);
	}
	
	public LabPanel() {
		super(null);
	}

	public List<Map<String, Object>> getGroups() {
		return labs;
	}

	public String getName() {
		return name;
	}
	
	public int compareTo(LabPanel o) {
		return this.getName().compareTo(o.getName());
	}
}
