package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.Map;


public class Provider extends AbstractPOMObject {

	protected Long id;
    protected Long version;
    protected String name;
    protected String uid;
    protected String analogPager;
    protected String digitalPager;
    protected String officePhone;


    public Provider() {
    	super(null);
    }

    @JsonCreator
    public Provider(Map<String, Object> vals) {
    	super(vals);
    }

    public Provider(Map<String, Object> vals, Long id, Long version, String name, String uid,
                    String analogPager, String digitalPager, String officePhone) {
		super(vals);
		this.id = id;
		this.version = version;
		this.name = name;
		this.uid = uid;
        this.analogPager = analogPager;
        this.digitalPager = digitalPager;
        this.officePhone = officePhone;
	}

    public Provider(String name, String uid, String analogPager, String digitalPager, String officePhone) {
        this.name = name;
        this.uid = uid;
        this.analogPager = analogPager;
        this.digitalPager = digitalPager;
        this.officePhone = officePhone;
    }

	public String toString() {
        return name;
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

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getAnalogPager() {
        return analogPager;
    }

    public void setAnalogPager(String analogPager) {
        this.analogPager = analogPager;
    }

    public String getDigitalPager() {
        return digitalPager;
    }

    public void setDigitalPager(String digitalPager) {
        this.digitalPager = digitalPager;
    }

    public String getOfficePhone() {
        return officePhone;
    }

    public void setOfficePhone(String officePhone) {
        this.officePhone = officePhone;
    }

    @Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return String.format("%s (%s)", this.name, this.uid);
	}


}
