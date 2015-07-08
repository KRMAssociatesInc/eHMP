package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class Address extends AbstractPOMObject{

	private Long id;
	private Long version;
	private String city;
	private String zip;
	private String state;
	private String line1;
    private String line2;
    private String line3;
    private String use;
    protected PointInTime start;
    protected PointInTime end;

	
	public Address() {
		super(null);
	}
	
	@JsonCreator
	public Address(Map<String, Object> vals) {
		super(vals);
	}
	
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getLine1() {
		return line1;
	}

	public void setLine1(String line1) {
		this.line1 = line1;
	}

	public String getLine2() {
		return line2;
	}

	public void setLine2(String line2) {
		this.line2 = line2;
    }

    public String getLine3() {
        return line3;
    }

    public void setLine3(String line3) {
        this.line3 = line3;
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

    public String getUse() {
        return use;
    }

    public void setUse(String use) {
        this.use = use;
    }

    public PointInTime getStart() {
        return start;
    }

    public void setStart(PointInTime start) {
        this.start = start;
    }

    public PointInTime getEnd() {
        return end;
    }

    public void setEnd(PointInTime end) {
        this.end = end;
    }

    @Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return String.format("%s %s, %s %s", line1, city, state, zip);
	}


}
