package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;

import java.util.Map;


public class MhCoordinator extends Provider {

    private String mhTeam;
    private String mhPosition;

	public MhCoordinator() {
    	super(null);
    }

    @JsonCreator
    public MhCoordinator(Map<String, Object> vals) {
    	super(vals);
    }

    public String getMhTeam() {
        return mhTeam;
    }

    public String getMhPosition() {
        return mhPosition;
    }

    public String toString() {
        return name;
    }

    @Override
	@JsonView(JSONViews.WSView.class) // dont store in DB
	public String getSummary() {
		return String.format("%s (%s)", this.name, this.uid);
	}


}
