package gov.va.cpe.odc;

import com.fasterxml.jackson.annotation.JsonProperty;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

/**
 * Corresponds to entries in VistA's HOSPITAL LOCATION file.
 *
 * @see "VistA FileMan HOSPITAL LOCATION(44)"
 */
public class Location extends AbstractPOMObject {

    /**
     * Types of location that maps VistA location type code to this enum.
     *
     * @see "VistA FileMan HOSPITAL LOCATION,TYPE(44,2)"
     */
    public static enum Type {
        CLINIC("C", "Clinic"),
        MODULE("M", "Module"),
        WARD("W", "Ward"),
        OTHER_LOCATION("Z", "Other Location"),
        NON_CLINIC_STOP("N", "Non-Clinic Stop"),
        FILE_AREA("F", "File Area"),
        IMAGING("I", "Imaging"),
        OPERATING_ROOM("OR", "Operating Room");

        private String code;
        private String displayName;

        private Type(String code, String displayName) {
            this.code = code;
            this.displayName = displayName;
        }

        @Override
        public String toString() {
            return displayName;
        }

        public static Type findByCode(String code) {
            for (Type t : Type.values()) {
                if (t.code.equalsIgnoreCase(code)) return t;
            }
            return null;
        }
    }

    private String localId;
    private String refId;
    private String name;
    private String shortName;
    private String type;
    private String typeName;
    private String facilityCode;
    private String facilityName;
    private Boolean oos;

    public Location() {
        super(null);
    }

    public Location(Map<String, Object> vals) {
        super(vals);
    }

    public String getLocalId() {
        return localId;
    }

    public String getRefId() {
        return refId;
    }

    public String getName() {
        return name;
    }

    public String getShortName() {
        return shortName;
    }
    
    public String getDisplayName() {
    	return VistaStringUtils.nameCase(name);
    }

    public String getType() {
        return type;
    }

    public String getTypeName() {
        if (typeName == null) {
            Type t = Type.findByCode(type);
            if (t != null)
                typeName = t.displayName;
        }
        return typeName;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    /**
     * This location is marked as "Occasion of Service".
     */
    @JsonProperty("oos")
    public Boolean isOOS() {
        return oos;
    }
}
