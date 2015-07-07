package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class MedicationIndication extends AbstractPOMObject {

    /**
     * Code (prefer SNOMED CT) that identifies the reason for the medication.
     * For VistA, this is currently not available.
     * @see "HITSP/C154 8.21 Indication
     */
    private String code;

    /**
     * Textual reason for the medication.
     * @see "HITSP/C154 8.21 Indication
     */
    private String narrative;

    private Medication med;

    public MedicationIndication() {
    	super(null);
    }

    @JsonCreator
	public MedicationIndication(Map<String, Object> vals) {
		super(vals);
	}

	public String getCode() {
		return code;
	}

	public String getNarrative() {
		return narrative;
	}

    @JsonBackReference("medication-indication")
	public Medication getMed() {
		return med;
	}

	void setMed(Medication med) {
		this.med = med;
	}
}
