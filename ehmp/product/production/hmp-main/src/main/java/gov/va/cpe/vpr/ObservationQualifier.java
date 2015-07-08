package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class ObservationQualifier extends AbstractPOMObject{
	
	private String type;
	private String code;
	private String name;
	
	public ObservationQualifier() {
		super(null);
	}
	
	public ObservationQualifier(Map<String, Object> vals) {
		super(vals);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// TODO - delete when checked
	// static belongsTo = [Observation]
	//
	// static constraints = {
	// type(nullable: false)
	// code(nullable: true)
	// name(nullable: false)
	// }
}
