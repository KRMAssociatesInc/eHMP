package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.Map;

public class Alias extends AbstractPOMObject {

	private String fullName;
	private String familyName;
	private String givenNames;
	private PatientDemographics patient;
	
	public Alias() {
		super(null);
	}
	
	@JsonCreator
	public Alias(Map<String, Object> vals) {
		super(vals);
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getFamilyName() {
		return familyName;
	}

	public void setFamilyName(String familyName) {
		this.familyName = familyName;
	}

	public String getGivenNames() {
		return givenNames;
	}

	public void setGivenNames(String givenNames) {
		this.givenNames = givenNames;
	}

    @JsonBackReference("patient-alias")
	public PatientDemographics getPatient() {
		return patient;
	}

	public void setPatient(PatientDemographics patient) {
		this.patient = patient;
	}
	
	@Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return this.fullName;
	}
	
}
