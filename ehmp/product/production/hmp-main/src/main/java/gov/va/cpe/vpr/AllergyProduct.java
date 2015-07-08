package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class AllergyProduct extends AbstractPOMObject {
	private Long id;
	private Long version;
	/**
	 * Free text name of the substance that caused the allergy / adverse
	 * reaction
	 * 
	 * @see "HITSP/C154 6.03 Product Free-Text"
	 */
	private String name;
	/**
	 * SNOMED CT, UNII, NDF-RT, or RxNorm code for the substance that caused the
	 * allergy / adverse reaction
	 * 
	 * @see "HITSP/C154 6.04 Product Coded"
	 */
	private String code;
	/**
	 * For VistA: Allergies, Generic Drug, Ingredient, Drug Class (AGIC)
	 */
	private String codeSource;
	/**
	 * VA Unique Identifier for the substance
	 */
	private String vuid;

    public AllergyProduct() {
        super(null);
    }

    public AllergyProduct(Map<String, Object> vals) {
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

	public String getCodeSource() {
		return codeSource;
	}

	public String getVuid() {
		return vuid;
	}
}
