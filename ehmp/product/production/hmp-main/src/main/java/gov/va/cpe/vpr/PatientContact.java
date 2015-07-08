package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Support includes the patient's sources of support, such as immediate family, relatives and/or guardians. This includes
 * next of kin, caregivers, support organizations, and key contacts relative to healthcare decisions. Support providers
 * may include providers of healthcare related services, such as a personally controlled health record, or registry of
 * emergency contacts.
 *
 * @see <a href="http://wiki.hitsp.org/docs/C83/C83-3.html#_Ref232942923">HITSP/C83 Support</a>
 */
public class PatientContact extends AbstractPOMObject{
	
	private PatientDemographics patient;
    private String name;
    private Set<Address> address;
    private String relationship;
   private String typeCode;
    private String typeName;
    private Set<Telecom> telecom;
    
    public PatientContact() {
    	super(null);
    }

    @JsonCreator
	public PatientContact(Map<String, Object> vals) {
		super(vals);
	}

    @JsonBackReference("patient-contact")
	public PatientDemographics getPatient() {
		return patient;
	}

	public void setPatient(PatientDemographics patient) {
		this.patient = patient;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Address> getAddress() {
		return address;
	}

	public void setAddress(Set<Address> addresses) {
		this.address = addresses;
	}

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public Set<Telecom> getTelecom() {
		return telecom;
	}

	public void setTelecoms(Set<Telecom> telecomList) {
		this.telecom = telecomList;
	}

    public void addToTelecom(Telecom telecom) {
        if (this.telecom == null) {
            this.telecom = new HashSet<Telecom>();
        }
        this.telecom.add(telecom);
    }

    public void addToAddress(Address address) {
        if (this.address == null) {
            this.address = new HashSet<Address>();
        }
        this.address.add(address);
    }

    public String toString() {
        return name;
    }

//    static hasMany = [telecoms: Telecom]
//
//    static constraints = {
//        name(blank: false)
//        address(nullable: true)
//        relationship(nullable: true)
//    }
//
//    static mapping = {
//        address lazy: false
//        relationship lazy: false
//        contactType lazy: false
//        telecoms lazy: false
//    }
}
