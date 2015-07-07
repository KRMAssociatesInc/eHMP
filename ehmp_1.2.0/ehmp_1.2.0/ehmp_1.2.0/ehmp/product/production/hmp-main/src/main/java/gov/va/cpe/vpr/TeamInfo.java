package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;


public class TeamInfo extends AbstractPOMObject {

	private Long id;
	private Long version;
    private Provider primaryProvider;
    private Provider associateProvider;
    private Provider attendingProvider;
    private Provider inpatientProvider;
    private MhCoordinator mhCoordinator;
    private Team team;

    public TeamInfo() {
    	super(null);
    }

    @JsonCreator
    public TeamInfo(Map<String, Object> vals) {
    	super(vals);
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

    public Provider getPrimaryProvider() {
        return primaryProvider;
    }

    public void setPrimaryProvider(Provider primaryProvider) {
        this.primaryProvider = primaryProvider;
    }

    public Provider getAssociateProvider() {
        return associateProvider;
    }

    public void setAssociateProvider(Provider associateProvider) {
        this.associateProvider = associateProvider;
    }

    public Provider getAttendingProvider() {
        return attendingProvider;
    }

    public void setAttendingProvider(Provider attendingProvider) {
        this.attendingProvider = attendingProvider;
    }

    public Provider getInpatientProvider() {
        return inpatientProvider;
    }

    public void setInpatientProvider(Provider inpatientProvider) {
        this.inpatientProvider = inpatientProvider;
    }

    public MhCoordinator getMhCoordinator() {
        return mhCoordinator;
    }

    public void setMhCoordinator(MhCoordinator mhCoordinator) {
        this.mhCoordinator = mhCoordinator;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    @Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return String.format("Primary (%s), Associate (%s), Attending (%s), Inpatient (%s), mhCoordinator (%s), team (%s),",
                this.primaryProvider.getName(), this.associateProvider.getName(), this.attendingProvider.getName(),
                this.inpatientProvider.getName(), mhCoordinator.getName(), team.getName());
	}
}
