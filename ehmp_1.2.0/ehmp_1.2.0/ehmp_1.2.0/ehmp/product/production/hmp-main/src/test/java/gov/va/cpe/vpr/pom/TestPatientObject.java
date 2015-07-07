package gov.va.cpe.vpr.pom;

import com.fasterxml.jackson.annotation.*;
import gov.va.cpe.vpr.pom.POMIndex.MultiValueJDSIndex;
import gov.va.cpe.vpr.pom.POMIndex.RangeJDSIndex;
import gov.va.cpe.vpr.pom.POMIndex.TermJDSIndex;
import gov.va.cpe.vpr.pom.POMIndex.ValueJDSIndex;
import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.Period;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static gov.va.cpe.vpr.pom.POMUtils.mapAlias;
import static gov.va.cpe.vpr.pom.POMUtils.nvl;

/**
 * A test implementation of a portion of a patient object, used for the test cases
 */
@JsonIgnoreProperties({"dob"})
public class TestPatientObject extends AbstractPatientObject {
	public static class CodedValue extends AbstractPOMObject {
		public CodedValue(String code, String name) {
			super(null);
			setData("code", code);
			setData("name", name);
		}
		public CodedValue(Map<String, Object> vals) {
			super(vals);
		}
	}
	
	public static class Address extends AbstractPOMObject {
	    private String city;
	    private String country;
	    private String postalCode;
	    private String stateProvince;
	    private String streetLine1;
	    private String streetLine2;
	    
	    @JsonCreator
	    public Address(Map<String, Object> vals) {
	    	super(vals);
	    }
	    
	    public String getCity() {
	    	return city;
	    }
	    
	    public String getStateProvince() {
	    	return stateProvince;
	    }
	    
	    public String getPostalCode() {
	    	return postalCode;
	    }
	    
	    public String getCountry() {
	    	return country;
	    }
	    
	    public String getStreetLine1() {
	    	return streetLine1;
	    }
	    
	    public String getStreetLine2() {
	    	return streetLine2;
	    }
	    
		@Override
		public void setData(Map<String, Object> data) {
			// ignore these fields (junk from prior address object)
			data.remove("id");
			data.remove("version");
			super.setData(data);
		}
		
		@Override
		public String toString() {
			return String.format("%s\n%s\n%s, %s %s", nvl(streetLine1), nvl(streetLine2), nvl(city), nvl(stateProvince), nvl(postalCode));
		}
	}
	
	/**
	 * Example of a simple enumerated value, for simple lists like gender, status, etc.
	 * not intended to be used for things like codes, religions, etc.
	 */
	public enum Gender {
		MALE, FEMALE, UNKNOWN;
	}
	
	private String personID;
	private String familyName;
	private String givenNames;
	private Gender gender;
	
	@JsonProperty("dateOfBirth") // fields/properties don't have to be named exactly identical
	@ValueJDSIndex(name="birthday-index", field="dateOfBirth")
	@RangeJDSIndex(name="alive-time", startField="dateOfBirth", endField="dateOfDeath")
	private PointInTime born;
	@JsonProperty("dateOfDeath") // this shouldn't need to be here, but seems to not work if its not
	private PointInTime died;
	
	@MultiValueJDSIndex(name="city-list", subfield="city")
	private List<Address> addresses;
	
	private Set<String> aliases;
	
	// fake property to demonstrate the terminology index (temporary)
	@TermJDSIndex(name="loinc-code-index", subfield="code")
	@JsonProperty
	private CodedValue loincCode = new CodedValue("urn:lnc:2345-7", "Glucose");
	
	public TestPatientObject(Map<String, Object> vals) {
		super(vals);
		clearEvents(); // tiny issue: this classes inital field values are not set until after the constructor is run
	}
	
	// data marshalling overrides --------------------
	@Override
	public void setData(Map<String, Object> data) {
		// declaring this function is completely optional and only necessary for aliases like below
		mapAlias(data, "personID", "icn");
		mapAlias(data, "dateOfBirth", "born", "dob");
		mapAlias(data, "dateOfDeath", "died", "dod");
		mapAlias(data, "familyName", "family_name");
		mapAlias(data, "givenNames", "given_name");
		
		super.setData(data);
	}
	
	@Override
	protected void validate() {
		super.validate();
		// lets say that given anem and family name are required
		if (givenNames == null || familyName == null) {
			throw new IllegalArgumentException("givenNames and familyNames are required");
		}
	}
	
	// custom events ----------------------------------
	
	public static class PatientDeathEvent extends PatientEvent {
		public PointInTime deathDate;

		public PatientDeathEvent(TestPatientObject pat, PointInTime deathDate) {
			super(pat, PatientEvent.Type.UPDATE, null);
			this.deathDate = deathDate;
		}
	}
	
	protected void generateEvents(List<PatientEvent<IPatientObject>> events, List<PatientEvent.Change> dirtyFields) {
		// if the death date was modified, it indicates this patient died
		// so it can be more explity called out with a special event type
		if (dirtyFields.contains("dateOfDeath") && died != null) {
			events.add(new PatientDeathEvent(this, died));
		}
	}
	
	
	// domain-specific getters ------------------------
	
	public String getFamilyName() {
		return familyName;
	}
	
	public String getGivenNames() {
		return givenNames;
	}
	
	/**
	 * Example of an explicit data element
	 */
	public Gender getGender() {
		if (gender == null) {
			return Gender.UNKNOWN;
		}
		return gender;
	}
	
	public PointInTime getDOB() {
		return born;
	}
	
	/**
	 * Example of implicit data element
	 */
	@JsonIgnore
	public String getSSN() {
		return (String) getProperty("ssn");
	}
	
	public List<Address> getAddresses() {
		return this.addresses;
	}
	
	public Set<String> getAliases() {
		return aliases;
	}
	
	/**
	 * AKA: ICN 
	 * Example of trying to design to be slightly less VA-specific, personID is HITSP lingo
	 */
	public String getPersonID() {
		return personID;
	}
	
	// domain logic/business logic  -------------------
	
    public String getFullName() {
        return familyName + ", " + givenNames;
    }
    
    @JsonView(JSONViews.WSView.class) // only serialize this property for web services (not storage)
	public Integer getAgeInYears() {
    	if (born == null) return null;
		PointInTime end = (this.died == null) ? PointInTime.today() : this.died;
		return new Period(born, end).getYears();
	}
    
    /**
     * Here is an example of a caluclated value (business logic) that is not stored as data
     * but is used as an index value
     */
    @JsonView(JSONViews.WSView.class) // only serialize this property for web services (not storage)
    @ValueJDSIndex(name="multiple-facility", expiresat="T+30")// named index for multi-facility patients
    public boolean hasBeenSeenInMultipleFacilites() {
    	Object facilities = getProperty("facilities");
    	if (facilities != null && facilities instanceof List) {
    		return ((List) facilities).size() > 1;
    	}
    	return false;
    }
    
	/**
	 * toString() becomes summary if not specified
	 */
	public String toString() {
		Integer age = getAgeInYears();
		return getFullName() + " (" + age + "yo " + getGender() + ")";
	}
}
