package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class AllergyReaction extends AbstractPOMObject {
	private Long id;
	private Long version;
	/**
	 * Free text name of the reaction
	 * 
	 * @see "HITSP/C154 6.05 Reaction Free-Text"
	 */
	private String name;
	/**
	 * SNOMED CT code for the reaction (problem list subset)
	 * 
	 * @see "HITSP/C154 6.06 Reaction Coded"
	 */
	private String code;
	/**
	 * VA Unique Identifier for the substance
	 */
	private String vuid;

    public AllergyReaction() {
        super(null);
    }

    public AllergyReaction(Map<String, Object> vals) {
        super(vals);
    }

    public Long getId() {
		return id;
	}

	public Long getVersion() {
		return version;
	}

	public String getName() {
		return name;
	}

	public String getCode() {
		return code;
	}

	public String getVuid() {
		return vuid;
	}
}
