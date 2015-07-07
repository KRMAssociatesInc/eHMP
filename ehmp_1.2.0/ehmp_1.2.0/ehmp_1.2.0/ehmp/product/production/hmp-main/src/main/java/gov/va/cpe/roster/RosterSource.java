package gov.va.cpe.roster;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

public class RosterSource extends AbstractPOMObject {

    private String action;
    private String source;
    private String localId;
    private String name;
    private String displayName;
    private String sequence;

	public RosterSource() {
        super(null);
    }

    public RosterSource(Map<String, Object> vals) {
        super(vals);
    }

    public String getSequence() {
    	return sequence;
    }
    
    public String getAction() {
        return action;
    }

    public String getSource() {
        return source;
    }

    public String getLocalId() {
        return localId;
    }

    public String getName() {
		return name;
	}

    public String getDisplayName() {
        if (displayName == null) {
            displayName = VistaStringUtils.nameCase(getName());
        }
        return displayName;
    }
}
