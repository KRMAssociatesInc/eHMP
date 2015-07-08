package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class MedicationFill extends AbstractPOMObject implements Comparable<MedicationFill> {
	private Long id;
	
	private static enum ROUTING {
		W("Window"), M("Mail"), C("Clinic");
		
		private String disp;
		ROUTING(String disp) {
			this.disp = disp; 
		}
		
		@Override
		public String toString() {
			return disp;
		}
	}

	/**
	 * The status of the fill. It is generally "completed". It would be
	 * "aborted" if the fill was never given to the patient (returned to stock).
	 * 
	 * @see "HITSP/C154 8.40 Fill Status
	 */
	private String fillStatus;

	private Medication med;

	/**
	 * The date/time the fill was given or mailed to the patient.
	 * 
	 * @see "HITSP/C154 8.37 Dispense Date
	 */
	private PointInTime dispenseDate;
	private PointInTime releaseDate;

	/**
	 * Name of the pharmacy that dispensed the medication. For VistA, this
	 * simply says "VA" for the time being. It could include the facility or
	 * CMOP information.
	 * 
	 * @see "HITSP/C154 8.35 Dispensing Pharmacy
	 */
	private String dispensingPharmacy;

	/**
	 * The amount dispensed.
	 * 
	 * @see "HITSP/C154 8.38 Quantity Dispense
	 */
	private String quantityDispensed;

	/**
	 * The days supply dispensed.
	 */
	private Integer daysSupplyDispensed;

	/**
	 * In VistA Window, Mail, Clinic
	 */
	private String routing;

	@JsonCreator
	public MedicationFill(Map<String, Object> vals) {
		super(vals);
	}

    public Long getId() {
		return id;
	}

	public String getFillStatus() {
		return fillStatus;
	}

	public Medication getMed() {
		return med;
	}

	void setMed(Medication med) {
		this.med = med;
	}

	public PointInTime getDispenseDate() {
		return dispenseDate;
	}
	
	public PointInTime getReleaseDate() {
		return releaseDate;
	}

	public String getDispensingPharmacy() {
		return dispensingPharmacy;
	}

	public String getQuantityDispensed() {
		return quantityDispensed;
	}

	public Integer getDaysSupplyDispensed() {
		return daysSupplyDispensed;
	}

	public String getRouting() {
		return routing;
	}
	
	@JsonIgnore
	public String getRoutingName() {
		return ROUTING.valueOf(getRouting()).toString();
	}

	
	// domain business logic methods ------------------------------------------
	
	@JsonIgnore
	public PointInTime getFillDepleatedDate() {
		return getDispenseDate().addDays(getDaysSupplyDispensed());
	}

	/** Sort in reverse chronological order */
	@Override
	public int compareTo(MedicationFill o) {
		return o.getDispenseDate().compareTo(this.dispenseDate);
	}
}
