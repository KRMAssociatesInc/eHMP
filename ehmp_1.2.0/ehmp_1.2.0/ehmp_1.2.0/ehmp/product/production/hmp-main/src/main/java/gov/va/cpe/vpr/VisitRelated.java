package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.Map;

/**
 * Represents entries in the VistA PCE V files.
 *
 * @see <a href="http://domain/vdl/application.asp?appid=82">Patient Care Encounter (PCE)</a>
 */
public class VisitRelated extends AbstractPatientObject {

    private String localId;
    private String name;
    private String facilityCode;
    private String facilityName;
    private String encounterUid;
    private String encounterName;
    private PointInTime entered;
    private String locationName;

    public VisitRelated() {
        super(null);
    }

    public VisitRelated(Map<String, Object> vals) {
        super(vals);
    }

    public String getLocalId() {
        return localId;
    }

    public String getName() {
        return name;
    }

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public String getEncounterUid() {
        return encounterUid;
    }

    public String getEncounterName() {
        return encounterName;
    }

    public PointInTime getEntered() {
        return entered;
    }

    public String getLocationName() {
        return locationName;
    }
}
