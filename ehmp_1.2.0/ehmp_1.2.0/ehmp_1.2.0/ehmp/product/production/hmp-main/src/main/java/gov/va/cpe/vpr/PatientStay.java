package gov.va.cpe.vpr;

import gov.va.hmp.healthtime.PointInTime;

// TODO: is this a subclass of encounter?
public class PatientStay {
	private Long id;
	private Long version;
	private Encounter encounter;

	/**
	 * UB-04 FL14 codes (Emergency, Urgent,Elective, etc.)
	 * 
	 * @see "HITSP/C154 16.07 Admission Type"
	 */
//	private AdmissionType admitType;
	private String admitCode;
	private String admitName;
	/**
	 * The date and time the patient arrived at the location.
	 * 
	 * @see "HITSP/C154 16.12 Arrival Date/Time"
	 */
	private PointInTime arrivalDateTime;
	/**
	 * The date and time the provider decided to admit the patient.
	 * 
	 * Future use for Emergency Department.
	 * 
	 * @see "HITSP/C154 16.15 Decision to Admit Date/Time"
	 */
	private PointInTime admitDecisionDateTime;
	/**
	 * The date and time the provider has ordered that the patient be admitted.
	 * 
	 * Future use for Emergency Department.
	 * 
	 * @see "HITSP/C154 16.14 Order to Admit Date/Time"
	 */
	private PointInTime admitOrderDateTime;
	/**
	 * The date and time of the patient discharge.
	 * 
	 * @see "HITSP/C154 16.16 Discharge Date/Time"
	 */
	private PointInTime dischargeDateTime;

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

	public Encounter getEncounter() {
		return encounter;
	}

	public void setEncounter(Encounter encounter) {
		this.encounter = encounter;
	}

	
	public String getAdmitCode() {
		return admitCode;
	}

	public void setAdmitCode(String admitCode) {
		this.admitCode = admitCode;
	}

	public String getAdmitName() {
		return admitName;
	}

	public void setAdmitName(String admitName) {
		this.admitName = admitName;
	}

	public PointInTime getArrivalDateTime() {
		return arrivalDateTime;
	}

	public void setArrivalDateTime(PointInTime arrivalDateTime) {
		this.arrivalDateTime = arrivalDateTime;
	}

	public PointInTime getAdmitDecisionDateTime() {
		return admitDecisionDateTime;
	}

	public void setAdmitDecisionDateTime(PointInTime admitDecisionDateTime) {
		this.admitDecisionDateTime = admitDecisionDateTime;
	}

	public PointInTime getAdmitOrderDateTime() {
		return admitOrderDateTime;
	}

	public void setAdmitOrderDateTime(PointInTime admitOrderDateTime) {
		this.admitOrderDateTime = admitOrderDateTime;
	}

	public PointInTime getDischargeDateTime() {
		return dischargeDateTime;
	}

	public void setDischargeDateTime(PointInTime dischargeDateTime) {
		this.dischargeDateTime = dischargeDateTime;
	}

}
