package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class AllergyDrugClass extends AbstractPOMObject {
	private Long id;
	private Long version;

    private String code;
    private String name;

    public AllergyDrugClass() {
        super(null);
    }

    public AllergyDrugClass(Map<String, Object> vals) {
        super(vals);
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
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

}
