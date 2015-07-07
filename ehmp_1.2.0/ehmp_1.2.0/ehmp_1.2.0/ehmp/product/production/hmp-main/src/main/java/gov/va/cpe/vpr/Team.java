package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.Map;


public class Team extends AbstractPOMObject {

	private Long id;
	private Long version;
    private String name;
    private String phone;
    private String uid;

    public Team() {
    	super(null);
    }

    @JsonCreator
    public Team(Map<String, Object> vals) {
    	super(vals);
    }

    public Team(Map<String, Object> vals, Long id, Long version,
                String name, String phone, String uid) {
		super(vals);
		this.id = id;
		this.version = version;
		this.name = name;
		this.phone = phone;
        this.uid = uid;
	}

    public Team(String name, String phone, String uid) {
        this.name = name;
        this.phone = phone;
        this.uid = uid;
    }

	public String toString() {
        return getSummary();
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    @Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return String.format("%s (%s)", this.name, this.phone);
	}


}
