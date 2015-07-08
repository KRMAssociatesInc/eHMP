package gov.va.cpe.roster;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.odc.Person;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Roster extends AbstractPOMObject {

    private String localId;
    private String name;
    private String ownerUid;
    private Person owner;
    private String ownerLocalId;
    private Boolean disabled;
    @JsonProperty("private")
    private Boolean privateRoster;
    private PointInTime dateUpdated;
    private List<RosterSource> sources;
    private List<RosterPatient> patients;

    public Roster() {
        this(null);
    }

    @JsonCreator
    public Roster(Map<String, Object> vals) {
        super(vals);
    }

    public String getLocalId() {
        return localId;
    }

    public String getName() {
        return name;
    }

    public String getOwnerUid() {
        return ownerUid;
    }

    public PointInTime getDateUpdated() {
        return dateUpdated;
    }

    public Boolean isDisabled() {
        return disabled;
    }

    public Boolean isPrivate() {
        return privateRoster;
    }

    @JsonView(JSONViews.WSView.class)
    public Person getOwner() {
        return owner;
    }

    @Override
    public String getSummary() {
        return getName();
    }

    public List<RosterPatient> getPatients() {
        if (patients == null) {
            patients = new ArrayList<RosterPatient>();
        }
        return patients;
    }

    public List<RosterSource> getSources() {
        return sources;
    }

    public void addPatient(RosterPatient patient) {
        getPatients().add(patient);
    }

    public void removePatient(RosterPatient patient) {
        getPatients().remove(patient);
    }
}
