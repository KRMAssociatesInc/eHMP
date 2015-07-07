package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermEng;

import java.util.Map;

public class MedicationProduct extends AbstractPOMObject {
	private Medication med;

	/**
	 * The code for the medication in general, without tablet size or strength
	 * information. This is intended to map to the RxNorm CUI that represents
	 * the active ingredient. For VistA, it is based on VA Generic name
	 * (currently VUID but should be RxNorm).
	 * 
	 * @see "HITSP/C154 8.13 Coded Product Name
	 */
	private String ingredientCode;
	private String ingredientCodeName;
	private String ingredientRxnCode;

	/**
	 * The textual name for the medication (i.e., the active ingredient(s)).
	 * This is generally the generic name and is intended to map to RxNorm
	 * CUI's. For VistA, it is based on the pharmacy orderable item name.
	 * 
	 * @see "HITSP/C154 8.15 Free Text Product Name
	 */
	private String ingredientName;

	/**
	 * This is the code that represents the VA Drug Class.
	 */
	private String drugClassCode;

	/**
	 * This is the name of the Drug Class
	 */
	private String drugClassName;

	/**
	 * The VUID for the medication that was actually supplied. (Currently VUID,
	 * should be RxNorm) For VistA, this would be based on the VA Product code,
	 * which is based on the dispense drug.
	 */
	private String suppliedCode;

	/**
	 * The name of the drug that was supplied. For VistA, this would be the
	 * dispense drug name and possibly the strength.
	 */
	private String suppliedName;

	/**
	 * Indicates whether the substance is a medication, IV base, or IV additive
	 * This may be mapped to SNOMED CT where:
	 * 
	 * Additive is: 418804003 pharmaceutical fluid or solution agent Base is:
	 * 418297009 pharmaceutical base or inactive agent Medication is: 410942007
	 * drug or medicament
	 */
	private String ingredientRole;

	/**
	 * The strength or concentration of the substance along with the appropriate
	 * units.
	 */
	private String strength;

	/**
	 * The volume (with appropriate units) of the substance if it is a base.
	 */
	private String volume;

	/**
	 * If a specific bag is indicated for an infusion, it is listed here
	 */
	private String ivBag;

	/**
	 * If this product is related to a specific order or sub-order, it may be
	 * indicated here. An example would be a VA inpatient complex dose, where
	 * each dose might be filled by a distinct formulary item.
	 */
	private String relatedOrder;

	public MedicationProduct() {
    	super(null);
    }

    @JsonCreator
	public MedicationProduct(Map<String, Object> vals) {
		super(vals);
	}

    @JsonBackReference("medication-product")
	public Medication getMed() {
		return med;
	}

	void setMed(Medication med) {
		this.med = med;
	}

	public String getIngredientCode() {
		return ingredientCode;
	}
	
	public String getIngredientCodeName() {
		return ingredientCodeName;
	}

	public String getIngredientName() {
		return ingredientName;
	}
	
    /**
     * Private setter, mainly used by Jaxson to prevent it from trying to invoke getIngredientRXNCode() when 
     * setting this property.
     * 
     * @param codes
     */
    @JsonSetter
    void setIngredientRXNCode(String code) {
    	this.ingredientRxnCode = code;
    }
	
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.SolrView.class})
	public String getIngredientRXNCode() {
		// TODO: Should this be the normal ingredient code?
		if (ingredientRxnCode != null) {
			return ingredientRxnCode;
		}
    	// otherwise compute the values
    	TermEng eng = TermEng.getInstance();
		String vuid = getIngredientCode();
		if (vuid == null) {
			return null;
		}
    		
		// In this case, urn:vuid is the same as urn:vandf
		// In this case, urn:vuid is the same as urn:vandf
		String[] parts = vuid.split(":");
		vuid = (parts.length >= 4) ? "urn:vandf:" + parts[3] : null;
		if (vuid == null) {
			return null;
		}		
		
		Concept c = (eng != null) ? eng.getConcept(vuid) : null;
		if (c != null) {
            c = c.getMappingTo("rxn");
            if (c != null) {
			    return ingredientRxnCode = c.getURN();
            }
		}
		return null;
	}

	public String getDrugClassCode() {
		return drugClassCode;
	}

	public String getDrugClassName() {
		return drugClassName;
	}

	public String getSuppliedCode() {
		return suppliedCode;
	}

	public String getSuppliedName() {
		return suppliedName;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getIngredientRole() {
		return ingredientRole;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getStrength() {
		return strength;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getVolume() {
		return volume;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getIvBag() {
		return ivBag;
	}

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
	public String getRelatedOrder() {
		return relatedOrder;
	}
}
