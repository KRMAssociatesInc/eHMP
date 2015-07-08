package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class MedicationOrder extends AbstractPOMObject {
	private Long id;
	private Medication med;

    // Common fields ------------------
    /**
     * For VistA, IEN from file 100
     * @see "HITSP/C154 8.26 Order Number
     */
    private String orderUid;

    /**
     * For VistA Outpatient Med, IEN from file 52
     * @see "HITSP/C154 8.34 Prescription Number
     */
    private String prescriptionId;

    /**
     * The date the prescription was entered
     * In VistA field 21 from file 52
     * @see "HITSP/C154 8.30 Order Date/Time
     */
    private PointInTime ordered;

    /**
     * The date when the prescription is no longer fillable
     * In VistA field 26 from file 52
     * @see "HITSP/C154 8.29 Order Expiration Date/Time
     */
    private PointInTime expiration;

    /**
     * The person who ordered the medication
     * @see "HITSP/C154 8.30 Ordering Provider
     */
    private String providerUid;

    private String providerName;

    /**
     * The person who finished the medication
     */
    private String pharmacistUid;

    private String pharmacistName;

    /**
     * @see "HITSP/C154 8.32 Fulfillment Instructions
     */
    private String fulfillmentInstructions;

    /**
     * The cost per unit of the drug
     */
    private String fillCost;

    /**
     *  Where the prescription was written
     */
    private String locationName;
    private String locationUid;

    // Outpatient fields --------------
    /**
     * The amount dispensed
     * In VistA field #7 from file 52
     *
     * @see "HITSP/C154 8.28 Quantity Ordered
     */
    private String quantityOrdered;

    /**
     * In VistA field #8 from file 52
     */
    private Integer daysSupply;

    /**
     * Max number of refills for the order
     * @see "HITSP/C154 8.27 Fills
     */
    private Integer fillsAllowed;

    /**
     * In VistA from fields #9 and #52 from file 52
     */
    private Integer fillsRemaining;

    // VA specific fields (mostly outpatient)
    /**
     * How the prescription should be released to the patient.
     * In VistA:  Window, Clinic, or Mail  (file 52 field 11)
     */
    private String vaRouting;

    /**
     * Internal to VA, true if the med was dispensed by VA, false for a med originating outside VA.
     */
    private Boolean vaDispensed;

    /**
     * Internal to VA, free text order status
     */
    private String vaOrderStatus;
    
	@JsonCreator
	public MedicationOrder(Map<String, Object> vals) {
		super(vals);
	}

    public Long getId() {
		return id;
	}

    @JsonBackReference("medication-order")
	public Medication getMed() {
		return med;
	}

	void setMed(Medication med) {
		this.med = med;
	}

	public String getOrderUid() {
		return orderUid;
	}

	public String getPrescriptionId() {
		return prescriptionId;
	}

	public PointInTime getOrdered() {
		return ordered;
	}

	public PointInTime getExpiration() {
		return expiration;
	}

	public String getProviderUid() {
		return providerUid;
	}

    public String getProviderName() {
		return providerName;
	}

	public String getPharmacistUid() {
		return pharmacistUid;
	}

    public String getPharmacistName() {
		return pharmacistName;
	}

	public String getFulfillmentInstructions() {
		return fulfillmentInstructions;
	}

	public String getFillCost() {
		return fillCost;
	}

	public String getLocationName() {
		return locationName;
	}

    public String getLocationUid() {
		return locationUid;
	}

	public String getQuantityOrdered() {
		return quantityOrdered;
	}

	public Integer getDaysSupply() {
		return daysSupply;
	}

	public Integer getFillsAllowed() {
		return fillsAllowed;
	}

	public Integer getFillsRemaining() {
		return fillsRemaining;
	}

	public String getVaRouting() {
		return vaRouting;
	}

	public Boolean getVaDispensed() {
		return vaDispensed;
	}

	public String getVaOrderStatus() {
		return vaOrderStatus;
	}
}
