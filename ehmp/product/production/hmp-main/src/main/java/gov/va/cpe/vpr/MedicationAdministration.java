package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MedicationAdministration extends AbstractPOMObject implements Comparable<MedicationAdministration> {
	private static final long serialVersionUID = 1L;
	
	private Medication med;
	private PointInTime dateTime;
	private String status;
	private String prnReason;
	private String administeredByUid;
	private String administeredByName;
	private List<MedicationAdministrationMed> medication;
	private List<MedicationAdministrationComment> comment;
	
	@JsonCreator
	public MedicationAdministration(Map<String, Object> vals) {
		super(vals);
	}
	
	public PointInTime getDateTime() {
		return dateTime;
	}
	
	public String getStatus() {
		return status;
	}
	
	/** Returns true if the dose is actually given vs held, etc. */
	public boolean isGiven() {
		if (status == null) return false;
		if (status.equals("GIVEN") || status.equals("INFUSING") || status.equals("STOPPED")) {
			return true;
		}
		return false;
	}
	

	
	public String getPrnReason() {
		return prnReason;
	}
	
	public String getAdministeredByName() {
		return administeredByName;
	}
	
	public String getAdministeredByUid() {
		return administeredByUid;
	}
	
    @JsonBackReference("medication-administration")
	public Medication getMed() {
		return med;
	}
    
    /** 
     * Not sure what is going on here, but jackson is not serializing this properly
     * so for now I'm constructing the objects as needed.
     * TODO: need to figure this out!! 
     **/
    @JsonManagedReference("medication-administration-meds")
    @JsonIgnore
	public List<MedicationAdministrationMed> getMedications() {
    	if (this.medication == null) {
    		this.medication = new ArrayList<>();
    		List<Map<String,Object>> adminMeds = (List<Map<String, Object>>) getProperty("medication");
    		if (adminMeds != null) {
	    		for (Map<String,Object> adminMed : adminMeds) {
	    			this.medication.add(new MedicationAdministrationMed(adminMed));
	    		}
    		}
    	}
		return this.medication;
	}
    
    /**
     * TODO: Same de-serialization issue as above
     * @return
     */
    @JsonManagedReference("medication-administration-comment")
    @JsonIgnore
	public List<MedicationAdministrationComment> getComments() {
    	if (this.comment == null) {
    		this.comment = new ArrayList<>();
    		List<Map<String,Object>> comments = (List<Map<String, Object>>) getProperty("comment");
    		if (comments != null) {
	    		for (Map<String,Object> c : comments) {
	    			this.comment.add(new MedicationAdministrationComment(c));
	    		}
    		}
    	}
		return this.comment;
	}

	@Override
	public int compareTo(MedicationAdministration o) {
		return o.dateTime.compareTo(this.dateTime); // sort in reverse order
	}

	public static class MedicationAdministrationComment extends AbstractPOMObject {
		private static final long serialVersionUID = 1L;
		
		private MedicationAdministration medAdmin;
		private PointInTime dateTime;
		private String text;
		private String enteredByName;
		private String enteredByUid;
		
		@JsonCreator
		public MedicationAdministrationComment(Map<String, Object> vals) {
			super(vals);
		}
		
		public PointInTime getDateTime() {
			return dateTime;
		}
		
		public String getEnteredByName() {
			return enteredByName;
		}
		
		public String getEnteredByUid() {
			return enteredByUid;
		}
		
		public String getText() {
			return text;
		}
		
		@JsonBackReference("medication-administration-comment")
		public MedicationAdministration getMedAdmin() {
			return medAdmin;
		}
	}
}
