package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.Map;


public class Telecom extends AbstractPOMObject {

	private Long id;
	private Long version;
//    IntervalOfTime period
    private String value;
//    private ContactUsage usageType;
    private String use;

    public Telecom() {
    	super(null);
    }
    
    @JsonCreator
    public Telecom(Map<String, Object> vals) {
    	super(vals);
    }
    
    public Telecom(Map<String, Object> vals, Long id, Long version,
			String telecom, String usageCode) {
		super(vals);
		this.id = id;
		this.version = version;
		this.value = telecom;
		this.use = usageCode;
	}


	public String toString() {
        return value;
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

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getUse() {
		return use;
	}

	public void setUse(String use) {
		this.use = use;
	}

	@Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return String.format("%s (%s)", this.value, this.use);
	}


}
