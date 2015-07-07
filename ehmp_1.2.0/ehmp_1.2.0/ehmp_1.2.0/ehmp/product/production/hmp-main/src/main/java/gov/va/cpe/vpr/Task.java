package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

public class Task extends AbstractPatientObject implements IPatientObject {

    private static final String TASK = "Task";

    private String facilityCode;
    private String facilityName;
    private String type;
    private String taskName;
    private String createdByName;
    private String createdByCode;
    private String claimedByUid;
    private String claimedByName;
    private String teamUid;
    private String description;
    private Boolean completed;
    private PointInTime dueDate;
    private String linkUid;
    private Map<String, Object> link;

    public Task() {
        super(null);
    }

    @JsonCreator
    public Task(Map<String, Object> vals) {
        super(vals);
    }
    
	public String getTaskName() {
        return taskName;
    }

    public String getCreatedByName() {
		return createdByName;
	}

	public String getCreatedByCode() {
		return createdByCode;
	}
	
	public String getClaimedByName() {
		return claimedByName;
	}
	
	public String getClaimedByUid() {
		return claimedByUid;
	}

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getCompleted() {
        return completed;
    }


    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getKind() {
        return TASK;
    }

    public PointInTime getDueDate() {
        return dueDate;
    }

    public String getLinkUid() {
        return linkUid;
    }

    public Map<String, Object> getLink() {
        return link;
    }

    @Override
    public String getSummary() {
        return taskName;
    }

    public String getTeamUid() {
        return teamUid;
    }
}
