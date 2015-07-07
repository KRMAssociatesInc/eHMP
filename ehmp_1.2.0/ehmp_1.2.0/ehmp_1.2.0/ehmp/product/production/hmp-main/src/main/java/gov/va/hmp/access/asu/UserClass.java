package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.pom.AbstractPOMObject;

import java.util.Map;

/**
 * Representation of VistA ASU user classes.
 *
 * TODO: harmonize with {@link gov.va.hmp.auth.VistaUserClassAuthority} stuff
 *
 * @see "VistA FileMan USR CLASS(8930)"
 */
public class UserClass extends AbstractPOMObject {
    private String abbreviation;
    private Boolean active;
    private String displayName;
    private String localId;
    private String name;

    public UserClass() {
        super();
    }

    public UserClass(Map<String, Object> vals) {
        super(vals);
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public Boolean getActive() {
        return active;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getLocalId() {
        return localId;
    }

    public String getName() {
        return name;
    }

    @Override
    public String getSummary() {
        return getAbbreviation() + " - " + getDisplayName();
    }
}
