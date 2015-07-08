package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class AllergyObservation extends AbstractPOMObject {
	private Long id;
	private Long version;

    private PointInTime date;
    private String severity;

    public AllergyObservation() {
        super(null);
    }

    public AllergyObservation(Map<String, Object> vals) {
        super(vals);
    }

    public PointInTime getDate() {
        return date;
    }

    public String getSeverity() {
        return severity;
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

}
