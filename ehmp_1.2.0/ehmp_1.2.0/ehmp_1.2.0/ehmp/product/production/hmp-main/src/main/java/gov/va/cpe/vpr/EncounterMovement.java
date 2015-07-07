package gov.va.cpe.vpr;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

public class EncounterMovement extends AbstractPOMObject {
	private static final long serialVersionUID = 1L;
	private Encounter encounter;
	private String locationUid;
	private PointInTime dateTime;
	private String localId;
	private String locationName;
	private String movementType;
	
	public EncounterMovement() {
        super(null);
    }

    @JsonCreator
    public EncounterMovement(Map<String, Object> vals) {
        super(vals);
    }

    
    @JsonBackReference("encounter-movement")
    public Encounter getEncounter() {
        return encounter;
    }

    void setEncounter(Encounter encounter) {
        this.encounter = encounter;
    }
    
    public String getLocationUid() {
		return locationUid;
	}
    
    public PointInTime getDateTime() {
		return dateTime;
	}
    
    public String getLocalId() {
		return localId;
	}
    
    public String getMovementType() {
		return movementType;
	}
    
    public String getLocationName() {
		return locationName;
	}
    
	@Override
	public String getSummary() {
		return String.format("EncounterMovement{localId=%s,dateTime=%s,movementType=%s,locationName=%s",
					getLocalId(), getDateTime(), getMovementType(),
					getLocationName());
	}
}
