package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class Modifier extends AbstractPOMObject {
	private Long id;
	private Long version;
	private String code;
	private String name;

    public Modifier() {
        super(null);
    }

    public Modifier(Map<String, Object> vals) {
        super(vals);
    }

    public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
