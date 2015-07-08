package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

public class MedicationAdministrationMed extends AbstractPOMObject{
	private static final long serialVersionUID = 1L;
	
	private MedicationAdministration medAdmin;
	private String amount;
	private String name;
	private String units;
	
	@JsonCreator
	public MedicationAdministrationMed(Map<String, Object> vals) {
		super(vals);
	}
	
	public String getUnits() {
		return units;
	}
	
	public String getName() {
		return name;
	}
	
	public String getAmount() {
		return amount;
	}
	
	@JsonBackReference("medication-administration-meds")
	public MedicationAdministration getMedAdmin() {
		return medAdmin;
	}
	
}