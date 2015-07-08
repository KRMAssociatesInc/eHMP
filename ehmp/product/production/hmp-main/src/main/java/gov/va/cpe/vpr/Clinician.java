package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Clinician extends AbstractPOMObject {
    private Long id;
    private Long version;
    private String uid;
    private String name;
    private String displayName;
    private Set<Address> addresses;
    private Set<Telecom> telecoms;

    public Clinician() {
        super(null);
    }

    public Clinician(Map<String, Object> vals) {
        super(vals);
    }

    public void addToAddresses(Address address) {
        if (this.addresses == null) {
            this.addresses = new HashSet<Address>();
        }
        this.addresses.add(address);
    }

    public void addToTelecoms(Telecom telecom) {
        if (this.telecoms == null) {
            this.telecoms = new HashSet<Telecom>();
        }
        this.telecoms.add(telecom);
    }

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

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        if (displayName == null) {
            displayName = VistaStringUtils.nameCase(getName());
        }
        return displayName;
    }

    public Set<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(Set<Address> addresses) {
        this.addresses = addresses;
    }

    public Set<Telecom> getTelecoms() {
        return telecoms;
    }

    public void setTelecoms(Set<Telecom> telecoms) {
        this.telecoms = telecoms;
    }
}
